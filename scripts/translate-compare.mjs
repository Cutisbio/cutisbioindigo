#!/usr/bin/env node
/**
 * 번역 엔진 비교 — 같은 문장을 세 엔진에 똑같이 보내고 결과를 나란히 놓는다.
 * =========================================================================
 * 세 엔진 모두 **같은 용어집과 같은 지시문**을 받는다(`translate-engines/prompt.mjs`).
 * 그래야 모델 차이만 남는다.
 *
 * 사용:
 *   node scripts/translate-compare.mjs                       세 엔진 · en·ja·zh·bn·tr
 *   node scripts/translate-compare.mjs --locale=bn           한 언어만
 *   node scripts/translate-compare.mjs --engines=claude,openai
 *   node scripts/translate-compare.mjs --limit=6             문장 수 줄이기
 *
 * 결과는 `docs/translation-comparison.md` 에 저장한다. 사람이 읽고 고르는 자료이며
 * 자동 채점은 하지 않는다 — 무엇을 봐야 하는지는 각 문장의 `checks` 에 적혀 있다.
 *
 * 키가 없는 엔진은 건너뛴다. 이 스크립트는 messages/*.json 을 건드리지 않는다.
 */

import path from 'node:path';
import {
  ROOT, TARGETS, GLOSSARY_PATH,
  readJson, loadEngine, loadEnvLocal, ENGINE_NAMES,
} from './translate-lib.mjs';
import fs from 'node:fs';

const args = process.argv.slice(2);
const flag = (name, fallback = null) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=').slice(1).join('=') : fallback;
};

loadEnvLocal();

const locales = (flag('locale') || TARGETS.join(',')).split(',');
const engineNames = (flag('engines') || ENGINE_NAMES.join(',')).split(',');
const limit = Number(flag('limit', '24'));

const glossary = readJson(GLOSSARY_PATH);
const evalSet = readJson(path.join(ROOT, 'content', 'translation-eval.json'));
const items = evalSet.items.slice(0, limit);

/* 키가 있는 엔진만 고른다 */
const engines = [];
for (const name of engineNames) {
  const engine = await loadEngine(name.trim());
  if (!process.env[engine.envKey]) {
    console.log(`건너뜀: ${engine.label} (${engine.envKey} 없음)`);
    continue;
  }
  engines.push(engine);
}
if (engines.length === 0) {
  console.error(
    '\n비교할 엔진이 없습니다. .env.local 에 키를 하나 이상 넣어 주세요.\n' +
      '  ANTHROPIC_API_KEY=...\n  OPENAI_API_KEY=...\n  GEMINI_API_KEY=...\n'
  );
  process.exit(1);
}
console.log(
  `\n비교: ${engines.map((e) => `${e.label}(${e.model()})`).join(' · ')}\n` +
    `문장 ${items.length}개 × 언어 ${locales.length}개\n`
);

/* ------------------------------------------------------------------ 실행 */

const results = {}; // results[locale][engineId] = string[]
const stats = {};

for (const locale of locales) {
  results[locale] = {};
  for (const engine of engines) {
    const started = Date.now();
    try {
      const out = await engine.translate({
        strings: items.map((i) => i.ko),
        locale,
        glossary,
      });
      results[locale][engine.id] = out.translations;
      stats[engine.id] ??= { input: 0, output: 0, ms: 0, failures: 0 };
      stats[engine.id].input += out.usage.input;
      stats[engine.id].output += out.usage.output;
      stats[engine.id].ms += Date.now() - started;
      console.log(`  ${locale} · ${engine.label}: 완료 (${Math.round((Date.now() - started) / 1000)}초)`);
    } catch (error) {
      results[locale][engine.id] = items.map(() => `(실패: ${error.message.slice(0, 80)})`);
      stats[engine.id] ??= { input: 0, output: 0, ms: 0, failures: 0 };
      stats[engine.id].failures++;
      console.error(`  ${locale} · ${engine.label}: 실패 — ${error.message.slice(0, 120)}`);
    }
  }
}

/* ------------------------------------------------------------------ 보고서 */

const lines = [
  '# 번역 엔진 비교',
  '',
  `생성: ${new Date().toISOString().slice(0, 10)}`,
  `엔진: ${engines.map((e) => `**${e.label}** (\`${e.model()}\`)`).join(' · ')}`,
  '',
  '세 엔진 모두 `content/glossary.json` 의 같은 용어집과 같은 지시문을 받았습니다.',
  '자동 채점이 아닙니다 — 각 문장 아래 **볼 것** 을 보고 직접 판단하세요.',
  '',
  '## 토큰과 시간',
  '',
  '| 엔진 | 모델 | 입력 토큰 | 출력 토큰 | 소요 | 실패 |',
  '|---|---|---|---|---|---|',
  ...engines.map((e) => {
    const s = stats[e.id] ?? { input: 0, output: 0, ms: 0, failures: 0 };
    return `| ${e.label} | \`${e.model()}\` | ${s.input.toLocaleString()} | ${s.output.toLocaleString()} | ${Math.round(s.ms / 1000)}초 | ${s.failures} |`;
  }),
  '',
];

for (const locale of locales) {
  lines.push(`## ${locale}`, '');
  items.forEach((item, index) => {
    lines.push(`### ${index + 1}. ${item.ko}`, '');
    lines.push('**볼 것**');
    for (const check of item.checks) lines.push(`- ${check}`);
    lines.push('');
    for (const engine of engines) {
      lines.push(`**${engine.label}**`, '', `> ${results[locale][engine.id][index]}`, '');
    }
    lines.push('---', '');
  });
}

const outPath = path.join(ROOT, 'docs', 'translation-comparison.md');
fs.writeFileSync(outPath, lines.join('\n'));
console.log(`\n보고서: ${path.relative(ROOT, outPath)}\n`);
