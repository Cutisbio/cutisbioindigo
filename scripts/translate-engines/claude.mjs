import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt, parseArray } from './prompt.mjs';

/**
 * Anthropic Claude 어댑터. 공식 SDK 를 쓴다.
 *
 * 키: `ANTHROPIC_API_KEY` (.env.local). 모델은 `ANTHROPIC_MODEL` 로 바꿀 수 있다.
 */
export const id = 'claude';
export const label = 'Claude';
export const envKey = 'ANTHROPIC_API_KEY';
export const model = () => process.env.ANTHROPIC_MODEL || 'claude-opus-5';

export async function translate({ strings, locale, glossary }) {
  const client = new Anthropic();

  const response = await client.messages.create({
    model: model(),
    max_tokens: 16000,
    // 규칙이 여럿 걸린 번역이라 적응형 사고를 켠다. 분량이 짧아 effort 는 medium 으로 둔다.
    thinking: { type: 'adaptive' },
    output_config: { effort: 'medium' },
    system: buildSystemPrompt(glossary, locale),
    messages: [{ role: 'user', content: JSON.stringify(strings, null, 2) }],
  });

  const text = response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('');

  return {
    translations: parseArray(text, strings.length),
    usage: {
      input: response.usage?.input_tokens ?? 0,
      output: response.usage?.output_tokens ?? 0,
    },
  };
}
