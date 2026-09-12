#!/usr/bin/env node
/**
 * `.env.local` 에 키를 제대로 넣었는지 확인한다.
 * =========================================================================
 * **API 를 부르지 않는다.** 돈이 들지 않고, 키 값을 화면에 그대로 찍지도 않는다
 * (앞뒤 몇 글자만 보여 준다 — 어떤 키를 넣었는지 알아볼 수는 있되 어깨너머로
 *  훔쳐볼 수는 없게).
 *
 *   npm run translate:keys
 */

import fs from 'node:fs';
import path from 'node:path';
import { ROOT, ENGINE_NAMES, loadEngine, loadEnvLocal } from './translate-lib.mjs';

const envPath = path.join(ROOT, '.env.local');

console.log('\n── 번역 키 점검 ──────────────────────────────────────\n');

if (!fs.existsSync(envPath)) {
  console.log('.env.local 파일이 없습니다. 먼저 아래를 실행하세요.\n');
  console.log('  cp .env.local.example .env.local\n');
  process.exit(1);
}
console.log(`파일: ${envPath}\n`);

loadEnvLocal();

/** 키를 가린다 — 앞 6자와 뒤 4자만 */
function mask(value) {
  if (value.length <= 12) return '*'.repeat(value.length);
  return `${value.slice(0, 6)}${'*'.repeat(8)}${value.slice(-4)}`;
}

let ready = 0;
for (const name of ENGINE_NAMES) {
  const engine = await loadEngine(name);
  const value = (process.env[engine.envKey] || '').trim();
  if (value) {
    ready++;
    console.log(`  ✔ ${engine.label}`);
    console.log(`      ${engine.envKey} = ${mask(value)}`);
  } else {
    console.log(`  · ${engine.label} — 아직 비어 있음 (${engine.envKey})`);
  }
}

// Cloud Translation v3 는 프로젝트 ID 말고 인증도 따로 필요하다
if ((process.env.GOOGLE_CLOUD_PROJECT || '').trim()) {
  const hasAuth =
    (process.env.GOOGLE_APPLICATION_CREDENTIALS || '').trim() ||
    (process.env.GOOGLE_ACCESS_TOKEN || '').trim();
  if (!hasAuth) {
    console.log(
      '\n  ! Cloud Translation v3: 프로젝트 ID 는 있는데 인증이 없습니다.\n' +
        '    GOOGLE_APPLICATION_CREDENTIALS 또는 GOOGLE_ACCESS_TOKEN 이 필요합니다.'
    );
  }
}

console.log(`\n쓸 수 있는 엔진 ${ready}개.\n`);

if (ready === 0) {
  console.log('키를 하나도 못 찾았습니다. 아래를 확인하세요.\n');
  console.log('  · 값 앞뒤에 따옴표를 넣지 않았는지    (ANTHROPIC_API_KEY=sk-ant-... 이렇게)');
  console.log('  · 등호 앞뒤에 빈칸이 없는지');
  console.log('  · 줄 맨 앞에 # 이 붙어 있지 않은지    (# 이 있으면 주석입니다)');
  console.log('  · 파일을 저장했는지\n');
  process.exit(1);
}

console.log('다음: 비교를 돌려 보세요.\n');
console.log('  npm run translate:compare -- --limit=4 --locale=bn\n');
