import { execFile, type ChildProcess } from 'node:child_process';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { ADMIN_ENABLED } from '@/lib/admin';

export const dynamic = 'force-dynamic';

/**
 * 승인한 기사를 실제 소식란에 반영한다 — `scripts/update-news.js` 를 그대로 실행한다.
 *
 * 승인 표시는 `content/news-candidates.json` 에만 있고, 화면에 나오는 글은
 * `messages/*.json` 에 언어별로 번역돼 들어간다. 그 사이를 잇는 것이 이 스크립트다.
 * 직접 쓴 소식(유튜브·사진)은 이 과정이 필요 없다 — 저장 즉시 화면에 나온다.
 *
 * **요청 안에서 끝까지 기다리지 않는다.** 기사가 여럿이면 언어당 수십 초씩,
 * 전체로는 몇 분이 걸려 HTTP 요청이 먼저 끊긴다. 실제로 그렇게 끊겨 ko·en·ja 만
 * 반영되고 zh·bn·tr 은 옛 상태로 남은 적이 있다(화면에는 실패로 보이는데 뒤에서는 계속
 * 돌고 있었다). 그래서 POST 는 시작만 시키고, GET 으로 진행 상황을 확인한다.
 */

type Job = {
  child: ChildProcess;
  log: string[];
  startedAt: number;
  exitCode: number | null;
};

// 개발 서버는 단일 프로세스라 모듈 상태로 충분하다.
// (파일을 고쳐 HMR 이 돌면 초기화될 수 있다 — 그때는 진행 상황만 잃고 작업은 계속된다.)
let job: Job | null = null;

const denied = () => NextResponse.json({ error: 'not found' }, { status: 404 });

/** 화면에 보여 줄 만한 줄만 남긴다 */
const isInteresting = (line: string) =>
  /^(Fetched|Publishing|Updated|Processing|Translation error|All news searches failed|\s+-> skipping|Done)/.test(line);

function snapshot() {
  if (!job) return { running: false, log: [], exitCode: null, seconds: 0 };
  return {
    running: job.exitCode === null,
    log: job.log,
    exitCode: job.exitCode,
    seconds: Math.round((Date.now() - job.startedAt) / 1000),
  };
}

/** 진행 상황 확인 */
export async function GET() {
  if (!ADMIN_ENABLED) return denied();
  return NextResponse.json(snapshot());
}

/** 반영 시작 */
export async function POST() {
  if (!ADMIN_ENABLED) return denied();

  if (job && job.exitCode === null) {
    return NextResponse.json({ started: false, alreadyRunning: true, ...snapshot() });
  }

  const script = path.join(process.cwd(), 'scripts', 'update-news.js');
  const log: string[] = [];

  // 타임아웃을 걸지 않는다 — 기사 수에 따라 몇 분이 걸릴 수 있고,
  // 도중에 죽이면 언어별 기사 수가 어긋난 채로 남는다.
  const child = execFile(
    process.execPath,
    [script],
    { cwd: process.cwd(), maxBuffer: 16 * 1024 * 1024 },
    (error) => {
      if (job) job.exitCode = error ? 1 : 0;
      if (error && !log.some((l) => l.includes(error.message))) log.push(error.message);
    }
  );

  const collect = (chunk: Buffer | string) => {
    for (const line of String(chunk).split(/\r?\n/)) {
      if (line.trim() && isInteresting(line)) log.push(line.trim());
    }
  };
  child.stdout?.on('data', collect);
  child.stderr?.on('data', collect);

  job = { child, log, startedAt: Date.now(), exitCode: null };

  return NextResponse.json({ started: true, ...snapshot() });
}
