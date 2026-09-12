import { buildSystemPrompt, parseArray } from './prompt.mjs';

/**
 * OpenAI 어댑터.
 *
 * OpenAI 에는 **전용 텍스트 번역 API 가 없다** (`audio.translations` 는 음성→영어 전용).
 * 그래서 일반 채팅 엔드포인트에 같은 지시문을 넣어 부른다 — Claude·Gemini 와 같은 방식이다.
 *
 * SDK 대신 REST 를 직접 부른다. 의존성을 늘리지 않고, 세 엔진의 호출 방식을
 * 나란히 읽을 수 있게 하기 위해서다.
 *
 * 키: `OPENAI_API_KEY` (.env.local). 모델은 `OPENAI_MODEL` 로 바꾼다.
 */
export const id = 'openai';
export const label = 'OpenAI';
export const envKey = 'OPENAI_API_KEY';
export const model = () => process.env.OPENAI_MODEL || 'gpt-4o';

export async function translate({ strings, locale, glossary }) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: model(),
      messages: [
        { role: 'system', content: buildSystemPrompt(glossary, locale) },
        { role: 'user', content: JSON.stringify(strings, null, 2) },
      ],
    }),
    signal: AbortSignal.timeout(180_000),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI ${response.status}: ${body.slice(0, 300)}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? '';

  return {
    translations: parseArray(text, strings.length),
    usage: {
      input: data.usage?.prompt_tokens ?? 0,
      output: data.usage?.completion_tokens ?? 0,
    },
  };
}
