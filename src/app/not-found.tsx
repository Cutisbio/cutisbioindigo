import type { Metadata } from 'next';
import './globals.css';
import { BRAND, LOCALE_LABELS, LOCALES } from '@/data/blugene/site';

/**
 * 로케일 접두사가 없거나 어떤 라우트에도 걸리지 않는 경로(예: /foo)의 404.
 *
 * 이 화면은 `[locale]/layout.tsx` 바깥에서 렌더링되므로 next-intl 의 번역을 쓸 수 없다.
 * 따라서 언어를 고르라고 안내하는 최소한의 화면만 두고, 실제 안내는 각 언어의
 * `[locale]/not-found.tsx` 가 담당한다.
 *
 * **`<html>` · `<body>` 를 직접 쓰지 않는다.** 이 프로젝트에는 루트 `layout.tsx` 가 없어서
 * Next 가 기본 루트 레이아웃을 대신 씌우는데, 여기서 `<html>` 을 또 그리면
 * 서버 HTML 과 클라이언트가 어긋나 하이드레이션 오류가 난다
 * (`not-found.js` 는 `<div>` 를 반환하는 것이 규약이다 —
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/not-found.md).
 * 대신 `globals.css` 를 직접 불러와 이 화면에서도 사이트 색·서체를 그대로 쓴다.
 */
export const metadata: Metadata = {
  title: `404 | ${BRAND.lockup}`,
  robots: { index: false, follow: true },
};

export default function RootNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-ivory)] text-[var(--color-ink)]">
      <main className="max-w-[560px] px-8 py-12 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-denim)]">404</p>
        {/* 헤더의 워드마크와 같은 표기 · 같은 서체를 쓴다 — 화면에 보이는 상표는 `Blugene` 하나다.
            (`Wordmark` 컴포넌트는 next-intl 의 Link 를 쓰므로 이 위치에서는 부를 수 없다.) */}
        <h1 className="blugene-wordmark mt-3 text-[2rem] leading-none font-bold text-[var(--color-indigo-deep)]">
          {BRAND.name}
        </h1>
        <p className="mt-4 leading-[1.8] break-keep text-[var(--color-slate-muted)]">
          The page you requested was not found. / 요청하신 페이지를 찾을 수 없습니다.
        </p>
        <ul className="mt-7 flex list-none flex-wrap justify-center gap-2 p-0">
          {LOCALES.map((locale) => (
            <li key={locale}>
              {/* next-intl 의 Link 를 쓸 수 없는 위치이므로 일반 앵커로 각 언어 홈에 보낸다 */}
              <a
                href={`/${locale}`}
                className="inline-block rounded-md border border-[color:var(--color-washed)] bg-white px-4 py-2.5 font-semibold text-[var(--color-indigo-deep)] no-underline transition-colors hover:bg-white/60"
              >
                {LOCALE_LABELS[locale].native}
              </a>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
