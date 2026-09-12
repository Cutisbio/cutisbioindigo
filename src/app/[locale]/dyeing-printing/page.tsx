import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import SectionHeading from '@/components/blugene/SectionHeading';
import FabricComparison from '@/components/blugene/FabricComparison';
import FastnessTables from '@/components/blugene/FastnessTables';
import AdditionalDyeingCase from '@/components/blugene/AdditionalDyeingCase';
import ShadeLibrary from '@/components/blugene/ShadeLibrary';
import ProductFormats from '@/components/blugene/ProductFormats';
import PrintingGallery from '@/components/blugene/PrintingGallery';
import { LOCALES, buildPageMetadata } from '@/data/blugene/site';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'DyeingPrinting' });
  return buildPageMetadata({
    locale,
    path: '/dyeing-printing',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function DyeingPrintingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'DyeingPrinting' });

  return (
    <>
      <section className="w-full border-b border-[color:var(--color-washed)] bg-[var(--color-ivory)]">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <SectionHeading
            headingLevel="h1"
            eyebrow={t('heroEyebrow')}
            title={t('heroTitle')}
            body={t('heroBody')}
            size="hero"
          />
          {/* 이 페이지는 11,000px 이 넘는데 앵커 다섯 개가 정의만 되어 있고 링크가 없었다.
              장식이 아니라 이동 수단이라 히어로 바로 아래에 둔다. */}
          <nav aria-label={t('jumpNavLabel')} className="mt-10">
            <ul className="-mx-1 flex flex-wrap gap-2">
              {(t.raw('jumpNav') as string[]).map((label, index) => (
                <li key={label}>
                  <a
                    href={`#${['dyeability', 'colorfastness', 'shades', 'products', 'printing'][index]}`}
                    className="inline-block rounded-full border border-[color:var(--color-washed)] bg-white px-4 py-1.5 text-sm font-semibold break-keep text-[var(--color-indigo-deep)] transition-colors hover:border-[var(--color-denim)] hover:text-[var(--color-denim)]"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* 염색성 — 원본 스트립 + 안내 블록은 2026-09-12 고객 요청으로 뺐다(showStrip). 같은 안내는 아래 견뢰도 표에 남아 있다. */}
      <section id="dyeability" className="w-full bg-white scroll-mt-24">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <FabricComparison variant="bare" showCta={false} showStrip={false} />
        </div>
      </section>

      {/* 견뢰도 전체 표 */}
      <section id="colorfastness" className="w-full bg-[var(--color-ivory)] scroll-mt-24">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <FastnessTables variant="bare" />
          <div className="mt-14">
            <AdditionalDyeingCase />
          </div>
        </div>
      </section>

      {/* 색상 라이브러리 */}
      <section id="shades" className="w-full bg-white scroll-mt-24">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <ShadeLibrary variant="bare" />
        </div>
      </section>

      {/* 제품군 */}
      <section id="products" className="w-full bg-[var(--color-ivory)] scroll-mt-24">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <ProductFormats variant="bare" />
        </div>
      </section>

      {/* 프린팅 */}
      <section id="printing" className="w-full bg-white scroll-mt-24">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <PrintingGallery />
          <Link
            href="/contact"
            className="mt-14 inline-flex items-center justify-center rounded-md bg-[var(--color-indigo-deep)] px-7 py-4 text-base font-semibold break-keep text-white transition-colors hover:bg-[var(--color-denim)]"
          >
            {t('cta')}
          </Link>
        </div>
      </section>
    </>
  );
}
