#!/usr/bin/env node
/**
 * `content/glossary.json` 을 Google Cloud Translation v3 가 읽는 TSV 로 내보낸다.
 * =========================================================================
 * v3 는 용어집을 **GCP 안의 리소스**로만 받는다. JSON 을 그대로 넘길 수 없고,
 * TSV 를 Cloud Storage 에 올린 뒤 glossary 를 만들어야 한다.
 * 그 첫 단계인 TSV 를 여기서 만든다.
 *
 *   node scripts/glossary-export.mjs
 *   → content/glossary-gcp/glossary-ko-en.tsv 등 5개 파일
 *
 * TSV 형식은 언어쌍당 한 파일, 각 줄이 `원문<TAB>번역` 이다.
 * `keepAsIs` 항목은 원문과 번역을 같게 넣어 그대로 유지되도록 한다.
 *
 * 만든 뒤 GCP 에서 할 일 (이 스크립트가 대신 할 수 없다 — 계정이 필요하다):
 *   1. gsutil cp content/glossary-gcp/*.tsv gs://<버킷>/
 *   2. glossaries.create 로 언어쌍마다 glossary 리소스 생성
 *   3. .env.local 에 GOOGLE_TRANSLATE_GLOSSARY 와 리전 지정
 *
 * ⚠ 용어집으로 고정할 수 있는 건 **단어 대응**뿐이다.
 *   "불검출을 0 으로 옮기지 마라" 같은 문장 단위 규칙은 v3 에 전달할 방법이 없다.
 */

import fs from 'node:fs';
import path from 'node:path';
import { ROOT, TARGETS, GLOSSARY_PATH, readJson } from './translate-lib.mjs';

const glossary = readJson(GLOSSARY_PATH);
const outDir = path.join(ROOT, 'content', 'glossary-gcp');
fs.mkdirSync(outDir, { recursive: true });

const CODE = { en: 'en', ja: 'ja', zh: 'zh-CN', fr: 'fr', it: 'it', tr: 'tr' };

let written = 0;
for (const locale of TARGETS) {
  const rows = [];

  for (const term of glossary.terms) {
    if (!term[locale]) continue;
    rows.push([term.ko, term[locale]]);
  }
  // 그대로 두어야 하는 표기는 원문 = 번역 으로 넣는다
  for (const keep of glossary.keepAsIs) {
    rows.push([keep, keep]);
  }

  const file = path.join(outDir, `glossary-ko-${CODE[locale]}.tsv`);
  fs.writeFileSync(file, rows.map((r) => r.join('\t')).join('\n') + '\n', 'utf8');
  console.log(`  ${path.relative(ROOT, file)}  (${rows.length}줄)`);
  written++;
}

console.log(
  `\n${written}개 파일을 만들었습니다.\n` +
    'GCP 에 올리는 방법은 docs/blugene-번역-엔진.md 를 보세요.\n' +
    '용어집으로는 단어만 고정됩니다. 문장 단위 규칙은 v3 에 전달할 수 없습니다.\n'
);
