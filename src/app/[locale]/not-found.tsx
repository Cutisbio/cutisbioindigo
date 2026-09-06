import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import SectionHeading from '@/components/blugene/SectionHeading';
import { PRIMARY_NAV } from '@/data/blugene/site';

/**
 * 404 화면.
 * 리브랜딩 중에는 이전 주소로 들어오는 방문자가 있으므로, 기본 영문 오류 화면 대신
 * 사이트 껍데기(헤더 · 푸터 · 언어 선택) 안에서 주요 메뉴로 안내한다.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default async function NotFound() {
  const t = await getTranslations('NotFound');
  const tNav = await getTranslations('Nav');

  return (
    <section className="w-full bg-[var(--color-ivory)]">
      <div className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <p className="text-sm font-semibold tracking-[0.2em] text-[var(--color-denim)]">404</p>
        <SectionHeading headingLevel="h1" title={t('title')} body={t('body')} size="lg" className="mt-4" />

        <nav aria-label={tNav('menu')} className="mt-10">
          <ul className="flex flex-wrap gap-3">
            <li>
              <Link
                href="/"
                className="inline-flex items-center rounded-md bg-[var(--color-indigo-deep)] px-6 py-3.5 text-base font-semibold break-keep text-white transition-colors hover:bg-[var(--color-denim)]"
              >
                {t('backHome')}
              </Link>
            </li>
            {PRIMARY_NAV.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="inline-flex items-center rounded-md border border-[color:var(--color-washed)] bg-white px-6 py-3.5 text-base font-semibold break-keep text-[var(--color-indigo-deep)] transition-colors hover:bg-white/60"
                >
                  {tNav(item.key)}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-md border border-[color:var(--color-washed)] bg-white px-6 py-3.5 text-base font-semibold break-keep text-[var(--color-indigo-deep)] transition-colors hover:bg-white/60"
              >
                {tNav('sampleInquiry')}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
}
