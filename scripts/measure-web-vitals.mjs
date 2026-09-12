#!/usr/bin/env node
/**
 * LCP · CLS 측정 (검증용)
 * =========================================================================
 * 로컬 프로덕션 빌드를 헤드리스 Chrome 으로 열어 LCP / CLS / 전송 바이트를 잰다.
 *
 * ⚠ 이 값은 **개발 PC 에서 로컬 서버를 상대로 잰 참고치**다.
 *   실제 사용자 환경(네트워크 · 기기 · CDN)의 성능을 보증하지 않는다.
 *   실사용자 지표는 배포 후 별도 측정이 필요하다.
 *
 * 사용: node scripts/measure-web-vitals.mjs [baseUrl]
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const BASE = process.argv[2] || 'http://localhost:3001';
const ROUTES = ['/ko', '/ko/dyeing-printing', '/ko/data-certifications', '/ko/contact'];
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900, mobile: false },
  { name: 'mobile', width: 390, height: 844, mobile: true },
];

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
  send(method, params = {}, sessionId) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      const payload = { id, method, params };
      if (sessionId) payload.sessionId = sessionId;
      this.ws.send(JSON.stringify(payload));
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`CDP 응답 없음: ${method}`));
        }
      }, 60_000);
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

// 페이지에 미리 심어 LCP·CLS 를 수집하는 스크립트
const COLLECTOR = `
window.__vitals = { lcp: 0, cls: 0, entries: 0 };
new PerformanceObserver((list) => {
  for (const e of list.getEntries()) {
    window.__vitals.lcp = Math.max(window.__vitals.lcp, e.startTime);
    window.__vitals.lcpElement = e.element ? e.element.tagName + '.' + String(e.element.className || '').slice(0, 40) : null;
  }
}).observe({ type: 'largest-contentful-paint', buffered: true });
new PerformanceObserver((list) => {
  for (const e of list.getEntries()) {
    if (!e.hadRecentInput) { window.__vitals.cls += e.value; window.__vitals.entries++; }
  }
}).observe({ type: 'layout-shift', buffered: true });
`;

async function main() {
  const chrome = CHROME_CANDIDATES.find((p) => fs.existsSync(p));
  if (!chrome) throw new Error('Chrome 실행 파일을 찾지 못했습니다.');
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'blugene-vitals-'));
  const port = 9334;

  const proc = spawn(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--remote-allow-origins=*',
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profile}`,
      'about:blank',
    ],
    { stdio: 'ignore' }
  );

  let wsUrl = null;
  for (let i = 0; i < 40 && !wsUrl; i++) {
    await sleep(300);
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json/version`);
      wsUrl = (await r.json()).webSocketDebuggerUrl;
    } catch {
      /* 준비 전 */
    }
  }
  if (!wsUrl) throw new Error('Chrome 원격 디버깅에 연결하지 못했습니다.');

  const browser = await connect(wsUrl);
  const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await browser.send('Target.attachToTarget', { targetId, flatten: true });
  const page = { send: (m, p) => browser.send(m, p, sessionId) };

  await page.send('Page.enable');
  await page.send('Runtime.enable');
  await page.send('Network.enable');

  console.log(`측정 대상: ${BASE}`);
  console.log('(로컬 서버 · 개발 PC 기준 참고치. 실사용자 성능 보증이 아님)\n');
  console.log(`${'화면'.padEnd(28)} ${'뷰포트'.padEnd(9)} ${'LCP'.padStart(9)} ${'CLS'.padStart(7)}   LCP 요소`);
  console.log('─'.repeat(96));

  const rows = [];
  for (const vp of VIEWPORTS) {
    await page.send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.mobile,
    });
    for (const route of ROUTES) {
      // 캐시를 비우고 매번 새로 받는다
      await page.send('Network.clearBrowserCache');
      await page.send('Page.addScriptToEvaluateOnNewDocument', { source: COLLECTOR });
      await page.send('Page.navigate', { url: BASE + route });
      await sleep(4500);
      const { result } = await page.send('Runtime.evaluate', {
        expression: 'JSON.stringify(window.__vitals || {})',
        returnByValue: true,
      });
      const v = JSON.parse(result.value || '{}');
      const lcp = Math.round(v.lcp || 0);
      const cls = Number((v.cls || 0).toFixed(4));
      rows.push({ route, viewport: vp.name, lcp, cls });
      const lcpFlag = lcp <= 2500 ? ' ' : '!';
      const clsFlag = cls <= 0.1 ? ' ' : '!';
      console.log(
        `${route.padEnd(28)} ${vp.name.padEnd(9)} ${(lcp + ' ms').padStart(8)}${lcpFlag} ${String(cls).padStart(6)}${clsFlag}   ${v.lcpElement || '-'}`
      );
    }
  }

  const worstLcp = Math.max(...rows.map((r) => r.lcp));
  const worstCls = Math.max(...rows.map((r) => r.cls));
  console.log('─'.repeat(96));
  console.log(`최대 LCP ${worstLcp} ms (목표 2500 ms 이하) · 최대 CLS ${worstCls} (목표 0.1 이하)`);

  proc.kill();
  await sleep(300);
  try {
    fs.rmSync(profile, { recursive: true, force: true });
  } catch {
    /* 정리 실패 무시 */
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
