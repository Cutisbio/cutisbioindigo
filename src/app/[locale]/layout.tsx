import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import Header from '@/components/ui/Header';
import SiteFooter from '@/components/blugene/SiteFooter';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import {
  BRAND,
  LOCALES,
  OG_LOCALES,
  SITE_URL,
  canonicalUrl,
  localeAlternates,
  type Locale,
} from '@/data/blugene/site';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

/**
 * 클라이언트 컴포넌트가 실제로 쓰는 네임스페이스만 브라우저로 보낸다.
 * (27개 전체를 보내면 언어당 40~60KB 가 모든 페이지의 HTML·RSC 페이로드에 실린다.)
 *
 * 사용처: Header·LanguageSwitcher → Nav / ShadeLibrary → ShadeLibrary·Common /
 *        SampleInquiry → Inquiry·Common / CatalogueViewer → DataHub·Common
 *
 * ⚠ 'use client' 컴포넌트를 새로 추가하면서 다른 네임스페이스를 쓰면 여기에 추가해야 한다.
 *   빠뜨리면 해당 화면에서 MISSING_MESSAGE 런타임 오류로 바로 드러난다.
 */
const CLIENT_NAMESPACES = ['Nav', 'Common', 'DataHub', 'Inquiry', 'ShadeLibrary'] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Home' });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      // 예: "브랜드 이야기 | Blugene by CutisBio"
      template: `%s | ${BRAND.lockup}`,
      default: `${BRAND.lockup} | ${t('metaTitle')}`,
    },
    description: t('metaDescription'),
    applicationName: BRAND.name,
    alternates: {
      canonical: canonicalUrl(locale, '/'),
      languages: localeAlternates('/'),
    },
    // 페이지마다 다른 값(title · description · url)은 각 page.tsx 의 generateMetadata 가
    // buildPageMetadata() 로 지정한다. 여기에는 모든 페이지가 공유하는 값만 둔다.
    openGraph: {
      siteName: BRAND.lockup,
      locale: OG_LOCALES[locale as Locale] ?? 'ko_KR',
      type: 'website',
      images: [
        {
          // 링크 미리보기 크롤러 호환을 위해 JPEG 를 먼저 둔다
          url: '/blugene/brand/og-cover.jpg',
          width: 1200,
          height: 630,
          alt: BRAND.lockup,
        },
        {
          url: '/blugene/brand/hero-family-denim-1200.webp',
          width: 1200,
          height: 603,
          alt: BRAND.lockup,
        },
      ],
    },
    twitter: { card: 'summary_large_image' },
    robots: { index: true, follow: true },
  };
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) notFound();

  // 정적 렌더링을 위해 요청 로케일을 고정한다
  setRequestLocale(locale);

  const messages = await getMessages();
  const clientMessages = Object.fromEntries(
    CLIENT_NAMESPACES.filter((ns) => ns in messages).map((ns) => [ns, messages[ns]])
  );
  const tNav = await getTranslations({ locale, namespace: 'Nav' });

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-[var(--color-paper)] font-sans text-[var(--color-ink)] antialiased">
        <NextIntlClientProvider messages={clientMessages}>
          <a href="#main" className="skip-link">
            {tNav('skipToContent')}
          </a>
          <Header />
          <main id="main" className="w-full flex-grow">
            {children}
          </main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
