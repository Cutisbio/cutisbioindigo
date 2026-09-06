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

/** 엔진에 넘길 지시문. 용어집과 규칙이 여기 들어간다. */
export function buildSystemPrompt(glossary, locale) {
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
