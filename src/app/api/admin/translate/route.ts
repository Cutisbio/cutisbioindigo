import path from 'node:path';
import { NextResponse } from 'next/server';
import { ADMIN_ENABLED } from '@/lib/admin';
import { LOCALES, type Locale } from '@/data/blugene/site';

export const dynamic = 'force-dynamic';

/**
 * 관리자 화면에서 직접 쓴 글을 나머지 5개 언어로 옮긴다.
 * **관리자가 버튼을 누를 때만** 호출된다 (방문자가 언어를 바꿀 때는 절대 부르지 않는다).
 *
 * 사이트 문구·뉴스와 **같은 엔진, 같은 용어집**을 쓴다 (`scripts/translate-engines/`).
 * 세 곳이 제각각이면 같은 용어가 화면마다 다르게 나온다.
 *
 * 실패한 언어는 빈 값으로 돌려주고 관리자 화면이 직접 입력하도록 표시한다.
 * **실패를 한국어로 채우지 않는다** — 다른 언어 화면에 한국어가 새는 것을 막는다.
 */
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

  // 번역 파이프라인은 scripts/ 아래의 ESM 모듈이다. 서버에서만 도는 라우트라 안전하다.
  const libPath = path.join(process.cwd(), 'scripts', 'translate-lib.mjs');
  const lib = await import(/* webpackIgnore: true */ `file://${libPath.replace(/\\/g, '/')}`);
  lib.loadEnvLocal();

  const engineName = process.env.TRANSLATE_ENGINE || 'openai';
  const engine = await lib.loadEngine(engineName);
  if (!process.env[engine.envKey]) {
    return NextResponse.json(
      { error: `${engine.envKey} 가 없습니다. 프로젝트 루트의 .env.local 에 넣어 주세요.` },
      { status: 400 }
    );
  }
  const glossary = lib.readJson(lib.GLOSSARY_PATH);

  const result: Partial<Record<Locale, string>> = { ko: source };
  const failed: Locale[] = [];

  for (const locale of LOCALES.filter((l) => l !== 'ko')) {
    try {
      const out = await engine.translate({ strings: [source], locale, glossary });
      result[locale] = out.translations[0];
    } catch (error) {
      console.error(`번역 실패 (${locale}):`, (error as Error).message);
      result[locale] = '';
      failed.push(locale);
    }
  }

  return NextResponse.json({ translations: result, failed, engine: engine.label });
}
