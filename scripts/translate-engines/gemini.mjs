import { buildSystemPrompt, parseArray } from './prompt.mjs';

/**
 * Google Gemini 어댑터.
 *
 * 왜 Gemini 인가: Claude · OpenAI 와 **같은 조건으로 겨루게** 하기 위해서다. 세 엔진 모두
 * 같은 지시문(용어집 + 규칙)을 받는다. Google 의 전용 번역 제품인
 * Cloud Translation v3 는 성격이 다르다 — 용어집(glossary)은 있지만
 * "불검출을 0 으로 옮기지 마라" 같은 규칙을 지시할 방법이 없고, API 키가 아니라
 * GCP 서비스 계정 인증이 필요하다. 그쪽도 비교하고 싶으면 어댑터를 하나 더 붙이면 된다.
 *
 * 키: `GEMINI_API_KEY` (.env.local). 모델은 `GEMINI_MODEL` 로 바꾼다.
 */
export const id = 'gemini';
export const label = 'Gemini';
export const envKey = 'GEMINI_API_KEY';
export const model = () => process.env.GEMINI_MODEL || 'gemini-2.5-pro';

export async function translate({ strings, locale, glossary }) {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${model()}:generateContent`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-goog-api-key': process.env.GEMINI_API_KEY,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: buildSystemPrompt(glossary, locale) }] },
      contents: [{ role: 'user', parts: [{ text: JSON.stringify(strings, null, 2) }] }],
      generationConfig: { responseMimeType: 'application/json' },
    }),
    signal: AbortSignal.timeout(180_000),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gemini ${response.status}: ${body.slice(0, 300)}`);
  }

  const data = await response.json();
  const text = (data.candidates?.[0]?.content?.parts ?? [])
    .map((part) => part.text ?? '')
    .join('');

  return {
    translations: parseArray(text, strings.length),
    usage: {
      input: data.usageMetadata?.promptTokenCount ?? 0,
      output: data.usageMetadata?.candidatesTokenCount ?? 0,
    },
  };
}
