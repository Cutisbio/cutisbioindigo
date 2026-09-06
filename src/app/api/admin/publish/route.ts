import { execFile } from 'node:child_process';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { ADMIN_ENABLED } from '@/lib/admin';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

/**
 * 승인한 기사를 실제 소식란에 반영한다 — `scripts/update-news.js` 를 그대로 실행한다.
 *
 * 승인 표시는 `content/news-candidates.json` 에만 있고, 화면에 나오는 글은
 * `messages/*.json` 에 언어별로 번역돼 들어간다. 그 사이를 잇는 것이 이 스크립트다.
 * 직접 쓴 소식(유튜브·사진)은 이 과정이 필요 없다 — 저장 즉시 화면에 나온다.
 */
export async function POST() {
  if (!ADMIN_ENABLED) return NextResponse.json({ error: 'not found' }, { status: 404 });

  const script = path.join(process.cwd(), 'scripts', 'update-news.js');

  const run = () =>
    new Promise<{ code: number; stdout: string; stderr: string }>((resolve) => {
      execFile(
        process.execPath,
        [script],
        { cwd: process.cwd(), maxBuffer: 8 * 1024 * 1024, timeout: 280_000 },
        (error, stdout, stderr) => {
          resolve({
            code: error ? ((error as NodeJS.ErrnoException & { code?: number }).code ?? 1) : 0,
            stdout: String(stdout),
            stderr: String(stderr),
          });
        }
      );
    });

  const { code, stdout, stderr } = await run();

  // 스크립트가 찍는 요약 줄만 뽑아 관리자 화면에 보여 준다
  const summary = stdout
    .split(/\r?\n/)
    .filter((line) => /^(Fetched|Publishing|Updated|All news searches failed)/.test(line))
    .join('\n');

  return NextResponse.json({
    ok: code === 0,
    summary: summary || stdout.slice(-2000),
    error: code === 0 ? '' : stderr.slice(-2000) || '스크립트가 오류로 끝났습니다.',
  });
}
