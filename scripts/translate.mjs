#!/usr/bin/env node
/**
 * 사이트 문구 번역 — **한국어가 바뀐 항목만** 다시 번역한다.
 * =========================================================================
 * `messages/ko.json` 을 기준으로 삼고, 각 항목의 한국어 원문 지문을
 * `content/translation-state.json` 에 기록해 둔다. 다음에 돌릴 때 지문이 그대로면
 * 건너뛴다. 그래서 문구를 하나 고치면 그 한 줄만 API 를 탄다.
 *
 * 방문자가 언어를 바꿀 때는 API 를 부르지 않는다. 6개 언어 페이지가 빌드 때
 * 미리 만들어지고(정적 생성), 언어 전환은 이미 만들어진 페이지로 이동할 뿐이다.
 *
 * 사용:
 *   node scripts/translate.mjs --dry-run              무엇이 번역될지만 본다
 *   node scripts/translate.mjs --engine=claude        기본 엔진
 *   node scripts/translate.mjs --engine=openai --locale=ja
 *   node scripts/translate.mjs --seed                 지금 번역본을 "최신"으로 기록만 한다
 *
 * `--seed` 는 처음 한 번만 쓴다. 지금 5개 언어 파일은 사람이 번역해 넣은 것이라,
 * 이걸 기준선으로 기록해 두어야 **앞으로 바뀐 것만** 번역된다.
 */

import path from 'node:path';
import {
  ROOT, TARGETS, GLOSSARY_PATH, STATE_PATH,
  readJson, writeJson, hash, flatten, setByPath, isTranslatable,
  loadState, findStale, loadEngine, loadEnvLocal, chunk,
} from './translate-lib.mjs';

const args = process.argv.slice(2);
const flag = (name, fallback = null) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=').slice(1).join('=') : fallback;
};
const DRY_RUN = args.includes('--dry-run');
const SEED = args.includes('--seed');
const ENGINE = flag('engine', process.env.TRANSLATE_ENGINE || 'openai');
const ONLY_LOCALE = flag('locale');
const BATCH = Number(flag('batch', '25'));

loadEnvLocal();

const ko = readJson(path.join(ROOT, 'messages', 'ko.json'));
const koLeaves = flatten(ko);
const glossary = readJson(GLOSSARY_PATH);
const state = loadState();
const locales = ONLY_LOCALE ? [ONLY_LOCALE] : TARGETS;

/* ------------------------------------------------------------------ seed */

if (SEED) {
  let marked = 0;
  for (const [key, value] of koLeaves) {
    if (!isTranslatable(key, value)) continue;
    state.entries[key] ??= {};
    for (const locale of TARGETS) {
      state.entries[key][locale] = hash(value);
      marked++;
    }
  }
  writeJson(STATE_PATH, state);
  console.log(
    `기준선을 기록했습니다. 항목 ${Object.keys(state.entries).length}개 × ${TARGETS.length}개 언어 = ${marked}건.\n` +
      '앞으로는 messages/ko.json 에서 **바뀐 문구만** 번역합니다.'
  );
  process.exit(0);
}

/* ------------------------------------------------------------------ 대상 확인 */

const plan = new Map();
for (const locale of locales) {
  plan.set(locale, findStale(koLeaves, state, locale));
}
const total = [...plan.values()].reduce((sum, list) => sum + list.length, 0);

console.log(`\n── 번역 대상 (엔진: ${ENGINE}) ──────────────────────────────`);
for (const [locale, list] of plan) {
  console.log(`  ${locale}: ${list.length}건`);
}
if (total === 0) {
  console.log('\n바뀐 문구가 없습니다. 번역할 것이 없습니다.\n');
  process.exit(0);
}

if (DRY_RUN) {
  const sample = [...plan.values()][0].slice(0, 10);
  console.log(`\n[dry-run] 예시 (최대 10건):`);
  for (const item of sample) console.log(`   · ${item.key}\n     ${item.ko.slice(0, 70)}`);
  console.log('\n[dry-run] API 를 부르지 않고 종료합니다.\n');
  process.exit(0);
}

/* ------------------------------------------------------------------ 번역 */

const engine = await loadEngine(ENGINE);
if (!process.env[engine.envKey]) {
  console.error(
    `\n${engine.envKey} 가 없습니다. 프로젝트 루트의 .env.local 에 넣어 주세요.\n` +
      `  ${engine.envKey}=...\n` +
      '이 파일은 git 에 올라가지 않습니다. NEXT_PUBLIC_ 로 시작하는 이름은 절대 쓰지 마세요.\n'
  );
  process.exit(1);
}
console.log(`\n엔진 ${engine.label} · 모델 ${engine.model()}`);

let failed = 0;
const usage = { input: 0, output: 0 };

for (const [locale, items] of plan) {
  if (items.length === 0) continue;
  const file = path.join(ROOT, 'messages', `${locale}.json`);
  const data = readJson(file);
  let done = 0;

  for (const group of chunk(items, BATCH)) {
    try {
      const result = await engine.translate({
        strings: group.map((i) => i.ko),
        locale,
        glossary,
      });
      group.forEach((item, index) => {
        setByPath(data, item.key, result.translations[index]);
        state.entries[item.key] ??= {};
        state.entries[item.key][locale] = hash(item.ko);
      });
      usage.input += result.usage.input;
      usage.output += result.usage.output;
      done += group.length;
      process.stdout.write(`  ${locale}: ${done}/${items.length}\r`);
    } catch (error) {
      failed += group.length;
      console.error(`\n  ${locale} 묶음 실패: ${error.message}`);
      console.error('    이 묶음은 건너뜁니다. 다시 실행하면 재시도합니다.');
    }
  }

  // 한 언어를 끝낼 때마다 저장한다 — 중간에 멈춰도 한 것까지는 남는다
  writeJson(file, data);
  writeJson(STATE_PATH, state);
  console.log(`  ${locale}: ${done}/${items.length} 완료`);
}

console.log(
  `\n토큰: 입력 ${usage.input.toLocaleString()} · 출력 ${usage.output.toLocaleString()}`
);
if (failed) {
  console.error(`\n${failed}건이 번역되지 않았습니다. 다시 실행하면 그것만 재시도합니다.\n`);
  process.exitCode = 1;
} else {
  console.log('\n끝났습니다. `npm run check:blugene` 으로 확인하세요.\n');
}

