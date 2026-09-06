import { NextResponse } from 'next/server';
import { ADMIN_ENABLED } from '@/lib/admin';
import { LOCALES, type Locale } from '@/data/blugene/site';

export const dynamic = 'force-dynamic';

/**
 * 한국어로 쓴 글을 나머지 5개 언어로 옮긴다. **관리자가 버튼을 누를 때만** 호출된다
 * (방문자가 언어를 바꿀 때는 절대 호출되지 않는다 — 화면 문구는 이미 번역돼 저장돼 있다).
 *
 * 자동 뉴스 수집과 같은 라이브러리를 쓴다. API 키가 필요 없는 대신 실패할 수 있으므로,
 * 실패한 언어는 빈 값으로 돌려주고 관리자 화면이 직접 입력하도록 표시한다.
 * **실패를 한국어로 채우지 않는다** — 다른 언어 화면에 한국어가 새는 것을 막는다.
 */
const TARGET: Record<Exclude<Locale, 'ko'>, string> = {
  en: 'en',
  ja: 'ja',
  zh: 'zh-CN',
  bn: 'bn',
  tr: 'tr',
};

/** 기계 번역이 회사·브랜드 이름을 쪼개거나 음차하는 것을 되돌린다 (update-news.js 와 같은 규칙) */
function restoreProperNouns(text: string): string {
  return text
    .replace(/Cutis\s*[- ]?\s*(Bio|Biyo)/gi, 'CutisBio')
    .replace(/Blu\s*[- ]?\s*gene/gi, 'Blugene')
    .replace(/BluGene/g, 'Blugene')
    .replace(/Bluegene/g, 'Blugene');
}

export async function POST(request: Request) {
  if (!ADMIN_ENABLED) return NextResponse.json({ error: 'not found' }, { status: 404 });

  let body: { text?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON 을 읽지 못했습니다.' }, { status: 400 });
  }
  const source = (body.text || '').trim();
  if (!source) return NextResponse.json({ error: '한국어 원문이 비어 있습니다.' }, { status: 400 });

  const { default: translate } = await import('google-translate-api-x');

  const result: Partial<Record<Locale, string>> = { ko: source };
  const failed: Locale[] = [];

  for (const locale of LOCALES.filter((l): l is Exclude<Locale, 'ko'> => l !== 'ko')) {
    try {
      // "A×B" 형태에서 × 뒤가 잘리는 문제가 있어 미리 바꿔 둔다 (update-news.js 와 동일)
      const prepared = source.replace(/[×✕✖]/g, '-');
      const res = await translate(prepared, { to: TARGET[locale] });
      result[locale] = restoreProperNouns(res.text);
      await new Promise((resolve) => setTimeout(resolve, 800)); // 연속 호출 차단 방지
    } catch (error) {
      console.error(`번역 실패 (${locale}):`, (error as Error).message);
      result[locale] = '';
      failed.push(locale);
    }
  }

  return NextResponse.json({ translations: result, failed });
}
