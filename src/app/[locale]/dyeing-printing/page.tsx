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
        </div>
      </section>

      {/* 염색성 */}
      <section id="dyeability" className="w-full bg-white scroll-mt-24">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <FabricComparison variant="bare" showCta={false} />
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
