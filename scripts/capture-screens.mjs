#!/usr/bin/env node
/**
 * 화면 캡처 (검증용)
 * =========================================================================
 * 로컬에 설치된 Chrome 을 원격 디버깅 모드로 띄우고 CDP 로 조작해
 * **정확한 뷰포트 크기**로 전체 페이지를 캡처한다.
 * (`--window-size` 만 쓰는 헤드리스 캡처는 Windows 의 최소 창 너비 때문에
 *  모바일 폭이 제대로 반영되지 않는다.)
 *
 * 사용:
 *   node scripts/capture-screens.mjs [baseUrl] [outDir] [이름필터]
 *   기본값: http://localhost:3001  docs/screenshots  (필터 없으면 전체)
 *   예) node scripts/capture-screens.mjs http://localhost:3000 docs/screenshots about
 *       → 파일명에 'about' 이 들어간 화면만 다시 찍는다(나머지 파일은 건드리지 않는다).
 *
 * 이 스크립트는 개발·검증용이며 빌드나 배포에 관여하지 않는다.
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const BASE = process.argv[2] || 'http://localhost:3001';
const OUT = path.resolve(process.argv[3] || 'docs/screenshots');
/** 파일명 부분 일치 필터. 없으면 전체를 찍는다. */
const ONLY = process.argv[4] || '';

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];

/** 캡처 목록: [경로, 파일명, 폭, 높이, 전체페이지 여부] */
const SHOTS = [
  ['/ko', 'desktop-ko-home', 1440, 900, true],
  ['/ko/brand', 'desktop-ko-brand', 1440, 900, true],
  ['/ko/technology', 'desktop-ko-technology', 1440, 900, true],
  ['/ko/dyeing-printing', 'desktop-ko-dyeing-printing', 1440, 900, true],
  ['/ko/data-certifications', 'desktop-ko-data', 1440, 900, true],
  ['/ko/contact', 'desktop-ko-contact', 1440, 900, true],
  ['/ko/about', 'desktop-ko-about', 1440, 900, true],
  ['/ko/news', 'desktop-ko-news', 1440, 900, true],
  // 없는 주소 — 언어별 404 가 사이트 껍데기 안에서 나오는지 확인용
  ['/ko/no-such-page', 'desktop-ko-404', 1440, 900, true],
  ['/ko', 'mobile390-ko-home', 390, 844, true],
  ['/ko/about', 'mobile390-ko-about', 390, 844, true],
  ['/ko/dyeing-printing', 'mobile390-ko-dyeing-printing', 390, 844, true],
  ['/ko/data-certifications', 'mobile390-ko-data', 390, 844, true],
  ['/ko/contact', 'mobile390-ko-contact', 390, 844, true],
  ['/ko', 'mobile360-ko-home', 360, 800, false],
  ['/ko', 'tablet768-ko-home', 768, 1024, false],
  ['/en', 'desktop-en-home', 1440, 900, false],
  ['/ja', 'desktop-ja-home', 1440, 900, false],
  ['/zh', 'desktop-zh-home', 1440, 900, false],
  ['/fr', 'desktop-fr-home', 1440, 900, false],
  ['/it', 'desktop-it-home', 1440, 900, false],
  ['/tr', 'desktop-tr-home', 1440, 900, false],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function findChrome() {
  for (const p of CHROME_CANDIDATES) if (fs.existsSync(p)) return p;
  throw new Error('Chrome/Edge 실행 파일을 찾지 못했습니다.');
}

/**
 * CDP 커넥션 (Node 내장 WebSocket 사용).
 * 브라우저 소켓 하나만 열고 flatten 세션으로 페이지 명령을 라우팅한다
 * (페이지별로 두 번째 WebSocket 을 여는 방식은 Windows 에서 응답이 오지 않는 경우가 있다).
 */
class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(JSON.stringify(msg.error)));
        else resolve(msg.result);
      }
    });
  }
  /**
   * @param timeoutMs 응답 대기 시간. 기본 2분.
   *   홈처럼 22,000px 이 넘는 화면은 `Page.captureScreenshot` 한 번에 그보다 오래 걸려
   *   전부 실패했다. 부르는 쪽에서 화면 높이에 맞춰 늘려 준다.
   */
  send(method, params = {}, sessionId, timeoutMs = 120_000) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      const payload = { id, method, params };
      if (sessionId) payload.sessionId = sessionId;
      this.ws.send(JSON.stringify(payload));
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`CDP 응답 없음: ${method} (${Math.round(timeoutMs / 1000)}초 대기)`));
        }
      }, timeoutMs);
    });
  }
}

async function connect(url) {
  const ws = new WebSocket(url);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });
  return new Cdp(ws);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const chrome = findChrome();
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'blugene-shot-'));
  const port = 9333;

  const proc = spawn(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--hide-scrollbars',
      '--remote-allow-origins=*',
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profile}`,
      'about:blank',
    ],
    { stdio: 'ignore', detached: false }
  );

  // 디버깅 엔드포인트가 열릴 때까지 대기
  let wsUrl = null;
  for (let i = 0; i < 40 && !wsUrl; i++) {
    await sleep(300);
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json/version`);
      wsUrl = (await r.json()).webSocketDebuggerUrl;
    } catch {
      /* 아직 준비 전 */
    }
  }
  if (!wsUrl) throw new Error('Chrome 원격 디버깅에 연결하지 못했습니다.');

  const browser = await connect(wsUrl);
  const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await browser.send('Target.attachToTarget', { targetId, flatten: true });

  // 페이지 명령은 세션 id 를 붙여 보낸다
  const page = { send: (m, p, t) => browser.send(m, p, sessionId, t) };

  await page.send('Page.enable');
  await page.send('Runtime.enable');

  const results = [];

  for (const [route, name, width, height, fullPage] of SHOTS) {
    if (ONLY && !name.includes(ONLY)) continue;
    const mobile = width < 768;
    await page.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile,
      screenWidth: width,
      screenHeight: height,
    });

    await page.send('Page.navigate', { url: BASE + route });
    await sleep(2600);

    // 지연 로딩 이미지를 모두 불러오기 위해 한 번 훑어 내려간다
    await page.send('Runtime.evaluate', {
      expression: `(async()=>{const step=${height};for(let y=0;y<document.documentElement.scrollHeight;y+=step){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,120));}window.scrollTo(0,0);})()`,
      awaitPromise: true,
    });
    await sleep(900);

    // 가로 넘침 여부를 함께 기록한다
    const { result } = await page.send('Runtime.evaluate', {
      expression:
        'JSON.stringify({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,sh:document.documentElement.scrollHeight})',
      returnByValue: true,
    });
    const metrics = JSON.parse(result.value);

    // 전체 페이지는 뷰포트 높이를 문서 높이로 늘려서 한 번에 담는다
    // (거대한 clip 을 주면 captureScreenshot 이 응답하지 않는 경우가 있다)
    // 홈은 22,000px 이 넘는다. 예전 상한 12,000px 때문에 마지막 세 섹션이 캡처에서
    // 통째로 빠져 있었고, 검토 자료에도 그 부분이 없었다. 상한은 인코딩이 감당하는
    // 선까지만 두고, 대신 아래에서 높이에 맞춰 대기 시간을 늘린다.
    let tall = height;
    if (fullPage) {
      tall = Math.min(metrics.sh, 32000);
      await page.send('Emulation.setDeviceMetricsOverride', {
        width,
        height: tall,
        deviceScaleFactor: 1,
        mobile,
        screenWidth: width,
        screenHeight: tall,
      });
      await sleep(700);
    }
    // JPEG 으로 직접 받는다. 문서 파일이 어차피 JPEG 이기도 하지만, 무엇보다
    // 홈처럼 22,000px 이 넘는 화면은 PNG 무손실 인코딩이 4분을 넘겨 끝내 실패했다.
    const { data } = await page.send('Page.captureScreenshot', { format: 'jpeg', quality: 78 },
      // 긴 화면일수록 인코딩이 오래 걸린다 — 10,000px 마다 2분씩 더 준다
      Math.max(120_000, Math.ceil(tall / 10_000) * 120_000)
    )
    const file = path.join(OUT, `${name}.jpg`);
    fs.writeFileSync(file, Buffer.from(data, 'base64'));

    const overflow = metrics.sw > metrics.cw;
    results.push({ name, route, width, overflow, height: metrics.sh, kb: Math.round(fs.statSync(file).size / 1024) });
    console.log(
      `  ${overflow ? '⚠ 가로넘침' : 'OK       '} ${name.padEnd(30)} ${String(width).padStart(4)}px  ` +
        `문서높이 ${String(metrics.sh).padStart(6)}px  ${String(Math.round(fs.statSync(file).size / 1024)).padStart(5)} KB`
    );
  }

  await browser.send('Target.closeTarget', { targetId }).catch(() => {});
  proc.kill();
  await sleep(400);
  try {
    fs.rmSync(profile, { recursive: true, force: true });
  } catch {
    /* 정리 실패는 무시 */
  }

  const overflowed = results.filter((r) => r.overflow);
  console.log(`\n총 ${results.length}장 저장 → ${OUT}`);
  if (overflowed.length) {
    console.log(`⚠ 가로 넘침이 있는 화면: ${overflowed.map((r) => `${r.name}(${r.width}px)`).join(', ')}`);
    process.exitCode = 1;
  } else {
    console.log('모든 화면에서 본문 가로 넘침 없음.');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
