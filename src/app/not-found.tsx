import type { Metadata } from 'next';
import { BRAND, DEFAULT_LOCALE, LOCALE_LABELS, LOCALES } from '@/data/blugene/site';

/**
 * 로케일 접두사가 없는 경로(예: /foo)의 404.
 *
 * 이 화면은 `[locale]/layout.tsx` 바깥에서 렌더링되므로 next-intl 의 번역을 쓸 수 없다.
 * 따라서 언어를 고르라고 안내하는 최소한의 화면만 두고, 실제 안내는 각 언어의
 * `[locale]/not-found.tsx` 가 담당한다.
 */
export const metadata: Metadata = {
  title: `404 | ${BRAND.lockup}`,
  robots: { index: false, follow: true },
};

export default function RootNotFound() {
  return (
    <html lang={DEFAULT_LOCALE}>
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F6F3EC',
          color: '#172133',
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <main style={{ maxWidth: 560, padding: '2rem', textAlign: 'center' }}>
          <p style={{ letterSpacing: '0.2em', fontSize: '0.8rem', color: '#365A83', margin: 0 }}>404</p>
          <h1 style={{ fontSize: '1.75rem', margin: '0.75rem 0 0', color: '#101D46' }}>
            {BRAND.lockup}
          </h1>
          <p style={{ marginTop: '1rem', color: '#566378', lineHeight: 1.8 }}>
            The page you requested was not found. / 요청하신 페이지를 찾을 수 없습니다.
          </p>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              marginTop: '1.75rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              justifyContent: 'center',
            }}
          >
            {LOCALES.map((locale) => (
              <li key={locale}>
                <a
                  href={`/${locale}`}
                  style={{
                    display: 'inline-block',
                    padding: '0.65rem 1.1rem',
                    border: '1px solid #BDD0E3',
                    borderRadius: 6,
                    background: '#fff',
                    color: '#101D46',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  {LOCALE_LABELS[locale].native}
                </a>
              </li>
            ))}
          </ul>
        </main>
      </body>
    </html>
  );
}
