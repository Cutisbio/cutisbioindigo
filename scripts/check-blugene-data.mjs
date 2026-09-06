#!/usr/bin/env node
/**
 * Blugene 콘텐츠 정합성 검사
 * =========================================================================
 * `npm run check:blugene` 로 실행한다. 배포 전에 아래를 확인한다.
 *
 *  1. 인증서 **문서상 유효기간**이 지났는지 (지났으면 화면에서 '유효'로 보이면 안 된다)
 *  2. 견뢰도 표의 값 개수·낮은 등급 보존 여부
 *  3. 9개 시판 샘플의 수치·시험성적서 번호가 카탈로그 원문과 일치하는지
 *  4. 모든 언어 메시지 파일의 키 · 배열 길이 · 자리표시자가 한국어 원본과 일치하는지
 *  5. 공개 카피에 금지 표현이 섞이지 않았는지 (6개 언어)
 *  6. 비-한국어 파일에 한국어 원문이 남아 있는지 (뉴스 자동 번역 실패의 흔적)
 *  7. 코드가 참조하는 이미지 파일이 실제로 존재하는지
 *
 * 실패(오류)는 종료코드 1, 경고는 0 으로 끝난다.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warnings = [];
const notes = [];

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const readJson = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(ROOT, p));

const LOCALES = ['ko', 'en', 'ja', 'zh', 'bn', 'tr'];

/* ------------------------------------------------------------------ */
/* 1. 인증서 문서 유효기간                                              */
/* ------------------------------------------------------------------ */
const certSource = read('src/data/blugene/certifications.ts');
const certBlocks = [...certSource.matchAll(/id:\s*'([a-z-]+)'[\s\S]*?validUntil:\s*(null|'([\d-]+)')/g)];
const today = new Date();

if (certBlocks.length !== 4) {
  errors.push(`인증 데이터 파싱 실패: 4건을 기대했으나 ${certBlocks.length}건을 찾았습니다.`);
}

for (const [, id, raw, date] of certBlocks) {
  if (raw === 'null') {
    notes.push(`[인증] ${id}: 문서에 만료일이 없습니다 (USDA 참가 증서 등).`);
    continue;
  }
  const end = new Date(`${date}T23:59:59Z`);
  const daysLeft = Math.floor((end - today) / 86_400_000);
  if (daysLeft < 0) {
    // 만료 자체는 빌드를 막지 않는다 — 화면이 이미 '문서 기재 유효기간이 지났습니다' 로
    // 정확히 렌더링하기 때문이다. 다만 눈에 띄게 경고해 갱신을 재촉한다.
    warnings.push(
      `[인증] ${id}: ★ 문서상 유효기간이 ${date} 로 이미 지났습니다. ` +
        `최신 인증서를 받아 src/data/blugene/certifications.ts 를 갱신하세요. ` +
        `(화면에는 '문서 기재 유효기간이 지났습니다' 로 표시됩니다.)`
    );
  } else if (daysLeft < 90) {
    warnings.push(`[인증] ${id}: 문서상 유효기간 ${date} 까지 ${daysLeft}일 남았습니다. 갱신 자료를 확인하세요.`);
  } else {
    notes.push(`[인증] ${id}: 문서상 유효기간 ${date} (${daysLeft}일 남음).`);
  }
}

/* ------------------------------------------------------------------ */
/* 2. 견뢰도 표                                                         */
/* ------------------------------------------------------------------ */
const fastnessSource = read('src/data/blugene/fastness.ts');
for (const m of fastnessSource.matchAll(/values:\s*\[([^\]]*)\]/g)) {
  const count = m[1].split(',').filter((s) => s.trim().length).length;
  if (count !== 9 && count !== 18) {
    errors.push(`[견뢰도] 값 개수가 ${count}개입니다. 9(샘플만) 또는 18(샘플×2)이어야 합니다.`);
  }
}
// 원본의 낮은 등급이 지워지지 않았는지 (마찰 #6 건조 1·2, #9 건조 2·2-3)
for (const needle of ["'1', '2'", "'2', '2-3'"]) {
  if (!fastnessSource.includes(needle)) {
    errors.push(`[견뢰도] 원본의 낮은 등급 ${needle} 이(가) 데이터에서 사라졌습니다.`);
  }
}
if (/values:[\s\S]{0,400}?['"]\d\.\d['"]/.test(fastnessSource)) {
  errors.push("[견뢰도] '4-5' 형태의 순위 등급이 소수(4.5)로 바뀐 곳이 있습니다.");
}

/* ------------------------------------------------------------------ */
/* 3. 9개 시판 샘플을 카탈로그 원문과 1:1 대조                            */
/* ------------------------------------------------------------------ */
/*
 * 카탈로그 p.3 Table 1-1 · p.5 Table 2-3 의 열 순서(9개 샘플).
 * 이 목록은 Blugene_Website_Brief/source/catalogue-extracted-text.txt 를 직접 옮긴 것이며,
 * evidence.ts 를 편집할 때 사람이 실수로 값을 바꾸는 것을 막는 안전망이다.
 */
const CATALOGUE_SAMPLES = [
  { id: 'chemical-s',   pmc: 1.07,   bio: 1,   carbonReport: 'SBED25-00000153-1', carbonDate: '2025-05-22', anilineReport: '2025-0604-1132-C03', anilineDate: '2025-06-10', aniline: 1524, nMethyl: 828 },
  { id: 'chemical-m',   pmc: 19.20,  bio: 19,  carbonReport: 'SBED25-00000211',   carbonDate: '2025-07-11', anilineReport: '2025-0624-1268',     anilineDate: '2025-07-03', aniline: 369,  nMethyl: 225 },
  { id: 'chemical-z',   pmc: 0.30,   bio: 0,   carbonReport: 'SBED25-00000211',   carbonDate: '2025-07-11', anilineReport: '2025-0624-1268',     anilineDate: '2025-07-03', aniline: 1229, nMethyl: 1127 },
  { id: 'plant-m',      pmc: 100.39, bio: 100, carbonReport: 'SBED25-00000211',   carbonDate: '2025-07-11', anilineReport: '2025-0624-1268',     anilineDate: '2025-07-03', aniline: 'ND', nMethyl: 'ND' },
  { id: 'plant-xt',     pmc: 51.15,  bio: 51,  carbonReport: 'SBED25-00000211',   carbonDate: '2025-07-11', anilineReport: '2025-0624-1268',     anilineDate: '2025-07-03', aniline: 131,  nMethyl: 85 },
  { id: 'plant-i',      pmc: 18.34,  bio: 18,  carbonReport: 'SBED25-00000211',   carbonDate: '2025-07-11', anilineReport: '2025-0624-1268',     anilineDate: '2025-07-03', aniline: 'ND', nMethyl: 'ND' },
  { id: 'plant-xb',     pmc: 96.82,  bio: 97,  carbonReport: 'SBED25-00000211',   carbonDate: '2025-07-11', anilineReport: '2025-0624-1268',     anilineDate: '2025-07-03', aniline: 'ND', nMethyl: 'ND' },
  { id: 'plant-h',      pmc: 33.66,  bio: 34,  carbonReport: 'SBED25-00000153-1', carbonDate: '2025-07-11', anilineReport: '2025-0604-1132-C03', anilineDate: '2025-06-10', aniline: 2652, nMethyl: 2375 },
  { id: 'bio-cutisbio', pmc: 97.73,  bio: 98,  carbonReport: 'SBED25-00000153-1', carbonDate: '2025-05-22', anilineReport: '2025-0604-1132-C03', anilineDate: '2025-06-10', aniline: 'ND', nMethyl: 'ND' },
];

const evidenceSource = read('src/data/blugene/evidence.ts');
for (const expected of CATALOGUE_SAMPLES) {
  const row = evidenceSource
    .split('\n')
    .find((l) => l.includes(`id: '${expected.id}'`));
  if (!row) {
    errors.push(`[시험데이터] 샘플 ${expected.id} 행을 evidence.ts 에서 찾지 못했습니다.`);
    continue;
  }
  const field = (name) => {
    const m = row.match(new RegExp(`${name}:\\s*'([^']*)'`));
    return m ? m[1] : null;
  };
  const num = (name) => {
    const m = row.match(new RegExp(`${name}:\\s*([\\d.]+)`));
    return m ? Number(m[1]) : null;
  };

  const checks = [
    ['pmc', num('pmc'), expected.pmc],
    ['biobasedCarbonPercent', num('biobasedCarbonPercent'), expected.bio],
    ['carbonReportNumber', field('carbonReportNumber'), expected.carbonReport],
    ['carbonReportDate', field('carbonReportDate'), expected.carbonDate],
    ['anilineReportNumber', field('anilineReportNumber'), expected.anilineReport],
    ['anilineReportDate', field('anilineReportDate'), expected.anilineDate],
  ];
  for (const [name, actual, want] of checks) {
    if (String(actual) !== String(want)) {
      errors.push(`[시험데이터] ${expected.id}.${name}: 카탈로그는 "${want}" 인데 코드는 "${actual}" 입니다.`);
    }
  }

  // 불검출은 mg() 대신 ND 로 표기되어야 한다
  const anilineCell = row.match(/aniline:\s*(ND|mg\((\d+)\))/);
  const nMethylCell = row.match(/nMethylaniline:\s*(ND|mg\((\d+)\))/);
  const cell = (m) => (!m ? null : m[1] === 'ND' ? 'ND' : Number(m[2]));
  if (cell(anilineCell) !== expected.aniline) {
    errors.push(`[시험데이터] ${expected.id}.aniline: 카탈로그는 "${expected.aniline}" 인데 코드는 "${cell(anilineCell)}" 입니다.`);
  }
  if (cell(nMethylCell) !== expected.nMethyl) {
    errors.push(`[시험데이터] ${expected.id}.nMethylaniline: 카탈로그는 "${expected.nMethyl}" 인데 코드는 "${cell(nMethylCell)}" 입니다.`);
  }
}

/* ------------------------------------------------------------------ */
/* 4. 다국어 키 · 배열 길이 · 자리표시자 정합성                          */
/* ------------------------------------------------------------------ */
/** 배열 원소까지 leaf 경로로 펼친다 (기존 flatten 은 배열 내부를 검사하지 못했다). */
const flattenLeaves = (node, prefix = '', out = new Map()) => {
  if (Array.isArray(node)) {
    node.forEach((v, i) => flattenLeaves(v, `${prefix}[${i}]`, out));
  } else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      flattenLeaves(v, prefix ? `${prefix}.${k}` : k, out);
    }
  } else {
    out.set(prefix, node);
  }
  return out;
};

const placeholders = (s) =>
  typeof s === 'string' ? [...s.matchAll(/\{([^}]*)\}/g)].map((m) => m[1].trim()).sort().join(',') : '';

const ko = readJson('messages/ko.json');
const koLeaves = flattenLeaves(ko);
// News.articles 의 **내용**은 자동 수집 스크립트가 번역해 채우므로 언어마다 달라도 된다.
// 다만 **개수**는 반드시 같아야 한다 — 화면이 언어별 배열을 그대로 훑기 때문에,
// 개수가 어긋나면 그 언어에서만 기사가 빠져 보인다.
// (실제로 update-news.js 가 번역 도중 끊겨 ko·en·ja 22건 / zh·bn·tr 14건으로 갈린 적이 있다.)
const isNews = (k) => k.startsWith('News.articles');
const koKeys = [...koLeaves.keys()].filter((k) => !isNews(k));
const koArticleCount = (ko.News?.articles || []).length;

for (const locale of LOCALES.filter((l) => l !== 'ko')) {
  const file = `messages/${locale}.json`;
  if (!exists(file)) {
    errors.push(`[i18n] ${file} 이 없습니다.`);
    continue;
  }
  const otherJson = readJson(file);
  const otherLeaves = flattenLeaves(otherJson);
  const otherKeys = new Set([...otherLeaves.keys()].filter((k) => !isNews(k)));

  const otherArticleCount = (otherJson.News?.articles || []).length;
  if (otherArticleCount !== koArticleCount) {
    errors.push(
      `[i18n] ${locale}: 소식 기사가 ${otherArticleCount}건인데 한국어는 ${koArticleCount}건입니다. ` +
        `번역이 도중에 끊겼을 수 있습니다 — \`node scripts/update-news.js\` 를 다시 실행하세요.`
    );
  }

  const missing = koKeys.filter((k) => !otherKeys.has(k));
  const extra = [...otherKeys].filter((k) => !koLeaves.has(k));
  if (missing.length) {
    errors.push(
      `[i18n] ${locale}: 한국어에 있는 항목 ${missing.length}개가 없습니다 → ` +
        `${missing.slice(0, 6).join(', ')}${missing.length > 6 ? ' …' : ''}`
    );
  }
  if (extra.length) {
    warnings.push(
      `[i18n] ${locale}: 한국어에 없는 항목 ${extra.length}개가 남아 있습니다 → ` +
        `${extra.slice(0, 6).join(', ')}${extra.length > 6 ? ' …' : ''}`
    );
  }

  // 자리표시자 대조 — 개수·이름이 다르면 런타임 오류가 난다
  for (const key of koKeys) {
    if (!otherKeys.has(key)) continue;
    const a = placeholders(koLeaves.get(key));
    const b = placeholders(otherLeaves.get(key));
    if (a !== b) {
      errors.push(`[i18n] ${locale} ${key}: 자리표시자가 다릅니다 (ko: "{${a}}" / ${locale}: "{${b}}")`);
    }
  }

  // 검색결과 잘림을 피하기 위한 meta description 길이 (라틴 160자 / CJK 90자)
  const desc = otherLeaves.get('Home.metaDescription');
  const limit = ['ja', 'zh'].includes(locale) ? 90 : 160;
  if (typeof desc === 'string' && desc.length > limit) {
    warnings.push(`[SEO] ${locale} Home.metaDescription 이 ${desc.length}자입니다 (권장 ${limit}자 이하).`);
  }
}

/* ------------------------------------------------------------------ */
/* 5. 공개 카피의 금지 표현 (6개 언어)                                   */
/* ------------------------------------------------------------------ */
/*
 * 검사 대상은 messages/*.json 의 "값"뿐이다. 이 목록 자체는 개발 검토용이며 화면에 나오지 않는다.
 * '불검출' / 'not detected' 는 정상 표현이므로 목록에 없다.
 */
const FORBIDDEN = [
  { re: /(^|[^\d.])0\s*ppm/i, why: "'0 ppm' — 불검출을 측정값 0 으로 바꾼 표현" },
  { re: /100\s*%\s*(안전|safe|güvenli|安全|নিরাপদ)|%\s*100\s*güvenli/i, why: "'100% 안전'" },
  { re: /chemical[-\s]?free|化学物質フリー|无化学|রাসায়নিকমুক্ত|kimyasal\s+içermez/i, why: "'chemical-free'" },
  {
    re: /(완전\s*무함유|전혀\s*없|완벽\s*차단|원천\s*배제|完全に含ま|完全不含|tamamen içermez|সম্পূর্ণ মুক্ত)/,
    why: '유해물질 완전 제거 표현',
  },
  {
    re: /(평생\s*안전|임상\s*(적으로\s*)?입증|피부과.{0,6}입증|clinically proven|臨床(的)?に(実)?証明|临床证明|klinik olarak kanıtlan)/i,
    why: '입증되지 않은 안전성 주장',
  },
  {
    re: /(탄소\s*중립|carbon\s*neutral|배출\s*제로|net[-\s]?zero|カーボンニュートラル|碳中和|karbon nötr|কার্বন নিরপেক্ষ)/i,
    why: '탄소중립·배출 제로 주장',
  },
  {
    re: /(80\s*[~-]\s*90\s*%|생분해|biodegradable|生分解|可生物降解|biyobozunur|জৈব-অবচনযোগ্য)/i,
    why: '근거 없는 절감 수치 · 생분해 주장',
  },
  {
    re: /(모든\s*항목에서\s*(우월|우수)|superior\s+in\s+all|すべての項目で(優|上回)|在所有(项目|方面)(都)?(优|更好)|tüm kalemlerde üstün)/i,
    why: "'모든 항목에서 우월' 표현",
  },
  // 브랜드·법인 표기는 **대소문자를 구분해서** 찾는다 (i 플래그를 쓰면 정상 표기까지 걸린다)
  {
    re: /\bBluGene\b|\bBluegene\b|\bBlueGene\b|\bBluGen\b|Blugene\s*®|\bCutis\s+Bio\b|\bCutis\s+Biyo\b|\bCutis-Bio\b/,
    why: '브랜드·법인 표기 오류 (정확한 표기는 Blugene / CutisBio)',
  },
];

/**
 * 부정·설명 맥락 판별.
 * 이 사이트는 "우리가 주장하지 않는 것"을 명시적으로 밝히는 문단을 갖고 있다.
 * 그런 문장에서 금지어가 나오는 것은 정상이므로 오류로 보지 않는다.
 */
const NEGATION =
  /(아닙니다|아니라|아니며|아닌|않습니다|않으며|않는다|않았|없습니다|뜻이\s*아니|표시하지|주장하지|쓰지\s*않|사용하지\s*않|is not|are not|does not|do not|never|not\s+reproduce|without claiming|değildir|değil|yer verilmemekte|ではありません|ではない|していません|しません|不是|并非|不会|未|নয়|করা হয়নি)/;

/** 금지어 검사에서 제외하는 키 (근거 범위를 스스로 밝히는 문단) */
const DISCLAIMER_KEYS = [
  /^Brand\.limits/,
  /^Environment\.scopeNote$/,
  /^Products\.(specNote|cyclesNote)$/,
  /^Printing\.(pairNote|advantagesNote|processNote)$/,
  /^Performance\.(honestNote|additionalCaseProvenance)$/,
  /^Certifications\.(scopeNote|verificationNote|brandNameNote|oekoScope)$/,
  /^DataHub\.(notDetectedExplain|sampleScopeNote|regulatoryOmitted|carbonZeroNote)$/,
  /^EvidenceStrip\.note$/,
  /^ShadeLibrary\.(indirubinNote|medicalNote|duplicateNote)$/,
  /^Science\.(metaphorNote|diagramNote)$/,
  /^Brand\.nameNote$/,
  /^Technology\.(routesNote|safetyBody|conceptCaptionSafety)$/,
  /^Tech\.(faqList|structuresNote|comparisonCaption)/,
  /^Common\.imageNote/,
];

/* 한국어 조사 띄어쓰기 — 지정 카피는 "Blugene은" 처럼 붙여 쓴다 */
const KO_PARTICLE_GAP = /Blugene\s+(은|는|이|가|을|를|의|과|와|에|에서|으로|로|도|만)(?![A-Za-z])/;

/* 비-한국어 파일에 한국어 원문이 남아 있는지 (자동 번역 실패의 흔적) */
const HANGUL = /[가-힣]/;

for (const locale of LOCALES) {
  const file = `messages/${locale}.json`;
  if (!exists(file)) continue;
  const data = readJson(file);
  const leaves = flattenLeaves(data);

  for (const [key, value] of leaves) {
    if (typeof value !== 'string') continue;

    // 뉴스 기사 제목은 외부 언론사 표기라 금지어 검사에서 제외하되,
    // 비-한국어 파일에 한국어가 그대로 남았는지는 확인한다.
    const isNewsValue = key.startsWith('News.articles');

    // `sourceTitle` · `sourceSummary` 는 **일부러** 한국어 원문을 보관하는 대조용 필드다.
    // update-news.js 가 이 값을 현재 한국어와 비교해, 바뀌지 않았으면 번역을 다시 하지 않는다
    // (화면에는 나오지 않는다). 여기서 걸러내지 않으면 정상 동작이 오류로 잡힌다.
    const isTranslationMarker = /\.(sourceTitle|sourceSummary)$/.test(key);

    if (locale !== 'ko' && !isTranslationMarker && HANGUL.test(value)) {
      const where = isNewsValue ? '뉴스 자동 번역' : '메시지';
      errors.push(`[i18n] ${locale} ${key}: ${where}에 한국어 원문이 그대로 남아 있습니다 → "${value.slice(0, 50)}…"`);
    }

    if (isNewsValue) continue;

    if (locale === 'ko' && KO_PARTICLE_GAP.test(value)) {
      warnings.push(`[카피] ko ${key}: 브랜드명과 조사 사이가 띄어져 있습니다 ("Blugene은" 처럼 붙여 씁니다).`);
    }

    const exempt = DISCLAIMER_KEYS.some((re) => re.test(key));
    for (const rule of FORBIDDEN) {
      if (!rule.re.test(value)) continue;
      const isBrandRule = rule.why.startsWith('브랜드');
      if (!isBrandRule && (exempt || NEGATION.test(value))) {
        notes.push(`[카피] ${locale} ${key}: 근거 범위를 밝히는 문장으로 판단해 통과 (${rule.why}).`);
        continue;
      }
      errors.push(`[카피] ${locale} ${key}: ${rule.why} → "${value.slice(0, 70)}…"`);
    }
  }
}

/* ------------------------------------------------------------------ */
/* 6. 참조 이미지 존재 여부                                             */
/* ------------------------------------------------------------------ */
const sourceFiles = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const rel = `${dir}/${entry.name}`;
    if (entry.isDirectory()) walk(rel);
    else if (/\.(tsx?|mjs)$/.test(entry.name)) sourceFiles.push(rel);
  }
};
walk('src');

const referenced = new Set();
for (const file of sourceFiles) {
  for (const m of read(file).matchAll(/['"`](\/[^'"`\s)]+\.(?:png|jpe?g|webp|svg|pdf|mp4|PNG))['"`]/g)) {
    referenced.add(m[1]);
  }
}
for (const ref of referenced) {
  // 템플릿 리터럴로 조립되는 경로(`/a/${x}.png`)는 정적으로 확인할 수 없으므로 건너뛴다.
  if (ref.includes('${')) continue;
  if (!exists(path.join('public', decodeURIComponent(ref)))) {
    errors.push(`[자산] 코드가 참조하는 파일이 public 에 없습니다: ${ref}`);
  }
}

/* ------------------------------------------------------------------ */
/* 8. 직접 쓴 소식(content/news-posts.json)                              */
/* ------------------------------------------------------------------ */
/* 관리자 화면이 저장하지만 손으로도 고칠 수 있어, 6개 언어가 다 찼는지 여기서 막는다.
   한 언어라도 비면 그 언어 화면에서만 글이 빈 채로 나온다. */
let newsPosts = [];
if (exists('content/news-posts.json')) {
  try {
    newsPosts = readJson('content/news-posts.json');
    if (!Array.isArray(newsPosts)) {
      errors.push('[소식] content/news-posts.json 은 배열이어야 합니다.');
      newsPosts = [];
    }
  } catch (e) {
    errors.push(`[소식] content/news-posts.json 을 읽지 못했습니다: ${e.message}`);
  }
}
const seenPostIds = new Set();
for (const post of newsPosts) {
  const label = `${post.date || '날짜없음'} "${(post.title?.ko || '제목없음').slice(0, 24)}"`;
  if (!post.id) errors.push(`[소식] ${label}: id 가 없습니다.`);
  else if (seenPostIds.has(post.id)) errors.push(`[소식] ${label}: id 가 중복입니다 (${post.id}).`);
  else seenPostIds.add(post.id);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date || '')) {
    errors.push(`[소식] ${label}: 날짜는 YYYY-MM-DD 형식이어야 합니다.`);
  }
  for (const [name, value] of [['제목', post.title], ['내용', post.summary]]) {
    const missing = LOCALES.filter((l) => !value?.[l] || !String(value[l]).trim());
    if (missing.length) errors.push(`[소식] ${label}: ${name}에 ${missing.join(', ')} 가 비어 있습니다.`);
  }
  if (post.type === 'youtube') {
    if (!/^[\w-]{11}$/.test(post.youtubeId || '')) {
      errors.push(`[소식] ${label}: 유튜브 영상 ID 가 올바르지 않습니다.`);
    }
  } else if (post.type === 'post') {
    if (!post.image) errors.push(`[소식] ${label}: 사진 경로가 없습니다.`);
    else if (!exists(path.join('public', post.image))) {
      errors.push(`[소식] ${label}: 사진 파일이 public 에 없습니다 (${post.image}).`);
    }
    const missingAlt = LOCALES.filter((l) => !post.imageAlt?.[l] || !String(post.imageAlt[l]).trim());
    if (missingAlt.length) {
      warnings.push(`[소식] ${label}: 사진 설명(alt)에 ${missingAlt.join(', ')} 가 비어 있습니다.`);
    }
  } else {
    errors.push(`[소식] ${label}: type 은 youtube 또는 post 여야 합니다.`);
  }
}

/* ------------------------------------------------------------------ */
/* 결과                                                                 */
/* ------------------------------------------------------------------ */
const line = (s) => console.log(s);

line('\n── Blugene 콘텐츠 정합성 검사 ─────────────────────────────');
line(`검사일: ${today.toISOString().slice(0, 10)}`);
line(`시판 샘플 ${CATALOGUE_SAMPLES.length}건 · 참조 이미지 ${referenced.size}건 대조`);
for (const n of notes.filter((n) => n.startsWith('[인증]'))) line(`  · ${n}`);
if (warnings.length) {
  line('\n[경고]');
  for (const w of warnings) line(`  ! ${w}`);
}
if (errors.length) {
  line('\n[오류]');
  for (const e of errors) line(`  ✗ ${e}`);
  line(`\n오류 ${errors.length}건, 경고 ${warnings.length}건.\n`);
  process.exit(1);
}
line(`\n통과. 경고 ${warnings.length}건.\n`);
