/**
 * 세 엔진이 **똑같은** 지시문을 받도록 한 곳에서 만든다.
 * 프롬프트가 다르면 비교가 성립하지 않는다.
 */

const LOCALE_NAMES = {
  en: 'English',
  ja: 'Japanese (日本語)',
  zh: 'Simplified Chinese (简体中文)',
  bn: 'Bengali (বাংলা)',
  tr: 'Turkish (Türkçe)',
};

export function localeName(locale) {
  return LOCALE_NAMES[locale] || locale;
}

/**
 * 엔진에 넘길 지시문. 용어집과 규칙이 여기 들어간다.
 *
 * `from` 은 원문 언어다. 사이트 문구는 모두 한국어 원문이라 기본값 'ko' 로 부르면 지시문이
 * 예전과 한 글자도 다르지 않다. 영어 → 한국어(뉴스 자동 수집의 영어 기사)만 따로 만든다.
 */
export function buildSystemPrompt(glossary, locale, from = 'ko') {
  if (from === 'en' && locale === 'ko') return buildEnglishToKoreanPrompt(glossary);
  if (from !== 'ko') throw new Error(`지원하지 않는 번역 방향입니다: ${from} → ${locale}`);

  const terms = glossary.terms
    .map((t) => `- ${t.ko} → ${t[locale] ?? '(대응어 없음: 자연스럽게 옮길 것)'}`)
    .join('\n');

  return [
    `You translate website copy for a B2B bio-indigo dye company from Korean into ${localeName(locale)}.`,
    '',
    'This copy makes technical claims about laboratory test results. Mistranslating one of them',
    'would be a false claim about a product, so the rules below outrank fluency.',
    '',
    '## Required terminology (Korean → target)',
    terms,
    '',
    '## Leave these exactly as written, in Latin script',
    glossary.keepAsIs.join(', '),
    '',
    '## Rules',
    ...glossary.rules.map((r, i) => `${i + 1}. ${r}`),
    '',
    '## Output',
    'You are given a JSON array of Korean strings. Return a JSON array of the same length,',
    'in the same order, containing only the translations. No commentary, no keys, no markdown fence.',
    'Translate each string independently — they are separate pieces of UI copy, not one passage.',
  ].join('\n');
}

/**
 * 영어 기사 제목 · 요약을 한국어 뉴스 목록에 싣기 위한 지시문 (update-news.js 전용).
 * 위 지시문의 규칙은 "한국어 → 다른 언어"가 전제라 거꾸로 쓰면 어긋난다
 * (예: '번역문에 한글을 남기지 마라'). 그래서 용어집만 뒤집어 쓰고 규칙은 따로 둔다.
 */
function buildEnglishToKoreanPrompt(glossary) {
  const terms = glossary.terms
    .filter((t) => t.en)
    .map((t) => `- ${t.en} → ${t.ko}`)
    .join('\n');
  // 한국어 목록에서는 회사명을 한글(큐티스바이오)로 쓴다 — 규칙 1 참고
  const keepAsIs = glossary.keepAsIs.filter((term) => term !== 'CutisBio');

  return [
    'You translate English news headlines and summaries about a B2B bio-indigo dye company',
    "into Korean, for the company's Korean newsroom list.",
    '',
    '## Required terminology (English → Korean)',
    terms,
    '',
    '## Leave these exactly as written, in Latin script',
    keepAsIs.join(', '),
    '',
    '## Rules',
    '1. Write the company name CutisBio (also spelled Cutis Bio) as 큐티스바이오.',
    '2. Translate faithfully. Do not add claims, numbers or qualifiers that are not in the source,',
    '   and do not turn a hedged statement into a definite one.',
    '3. Keep numbers, units and dates exactly as written.',
    '4. Use the established Korean name of a company, institution or outlet if there is one;',
    '   otherwise keep its original Latin spelling.',
    '5. A headline reads as a natural Korean news headline; a summary stays a full sentence.',
    '',
    '## Output',
    'You are given a JSON array of English strings. Return a JSON array of the same length,',
    'in the same order, containing only the translations. No commentary, no keys, no markdown fence.',
    'Translate each string independently.',
  ].join('\n');
}

/** 응답에서 JSON 배열만 꺼낸다. 엔진이 코드펜스를 붙이는 경우가 있다. */
export function parseArray(raw, expectedLength) {
  let text = String(raw).trim();
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) text = fence[1].trim();
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start === -1 || end === -1) throw new Error(`JSON 배열을 찾지 못했습니다: ${text.slice(0, 200)}`);

  const parsed = JSON.parse(text.slice(start, end + 1));
  if (!Array.isArray(parsed)) throw new Error('응답이 배열이 아닙니다.');
  if (parsed.length !== expectedLength) {
    throw new Error(`응답 개수가 다릅니다 (요청 ${expectedLength} / 응답 ${parsed.length}).`);
  }
  return parsed.map((v) => String(v));
}
