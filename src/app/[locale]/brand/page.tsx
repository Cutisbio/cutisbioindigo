import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import SectionHeading from '@/components/blugene/SectionHeading';
import SourceNote, { AssetKind } from '@/components/blugene/SourceNote';
import BrandManifesto from '@/components/blugene/BrandManifesto';
import Wordmark from '@/components/blugene/Wordmark';
import { BRAND, LOCALES, buildPageMetadata } from '@/data/blugene/site';
import { productSummary } from '@/data/blugene/evidence';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Brand' });
  return buildPageMetadata({
    locale,
    path: '/brand',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function BrandPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Brand' });
  const tHero = await getTranslations({ locale, namespace: 'Hero' });
  const tCommon = await getTranslations({ locale, namespace: 'Common' });
  const promises = t.raw('promiseItems') as { title: string; text: string }[];
  const limits = t.raw('limitsItems') as string[];

  return (
    <>
      {/* 페이지 도입부 */}
      <section className="w-full border-b border-[color:var(--color-washed)] bg-[var(--color-ivory)]">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-24">
          <SectionHeading
            headingLevel="h1"
            eyebrow={t('heroEyebrow')}
            title={t('heroTitle')}
            body={t('heroBody')}
            size="lg"
          />
          <figure className="m-0">
            <div className="relative aspect-[16/10] overflow-hidden rounded-md">
              <Image
                src="/blugene/brand/hero-family-denim-1200.webp"
                alt={tHero('imageAlt')}
                fill
                preload
                fetchPriority="high"
                sizes="(max-width: 1024px) 92vw, 600px"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
              <AssetKind>{tCommon('brandImage')}</AssetKind>
              <SourceNote className="flex-1">{tHero('imageCredit')}</SourceNote>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 이름에 담은 뜻 */}
      <section className="w-full bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-20">
            <div className="rounded-md border border-[color:var(--color-washed)] bg-[var(--color-ivory)] px-10 py-12">
              <Wordmark size="lg" href={null} />
            </div>
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold break-keep text-[var(--color-indigo-deep)] sm:text-3xl">
                {t('nameTitle')}
              </h2>
              <p className="mt-5 text-base leading-[1.9] break-keep text-[var(--color-ink)]/85 sm:text-lg">
                {t('nameBody')}
              </p>
              <SourceNote className="mt-6">{t('nameNote')}</SourceNote>

              <h2 className="mt-12 text-2xl font-bold break-keep text-[var(--color-indigo-deep)] sm:text-3xl">
                {t('relationTitle')}
              </h2>
              <p className="mt-5 text-base leading-[1.9] break-keep text-[var(--color-ink)]/85">
                {t('relationBody')}
              </p>
              <SourceNote className="mt-4">
                {BRAND.companyLegal} · {productSummary.catalogueName} · CAS {productSummary.cas}
              </SourceNote>
            </div>
          </div>
        </div>
      </section>

      <BrandManifesto />

      {/* 우리가 약속하는 것 / 말하지 않는 것 */}
      <section className="w-full bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          <SectionHeading title={t('promiseTitle')} body={t('promiseBody')} size="lg" />

          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {promises.map((item, i) => (
              <li key={item.title} className="border-t-2 border-[var(--color-denim)] pt-5">
                <span className="text-sm font-semibold text-[var(--color-denim)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 text-lg font-semibold break-keep text-[var(--color-indigo-deep)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed break-keep text-[var(--color-ink)]/85">
                  {item.text}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-16 rounded-md border border-[color:var(--color-washed)] bg-[var(--color-ivory)] p-7 sm:p-10">
            <h3 className="text-xl font-semibold break-keep text-[var(--color-indigo-deep)] sm:text-2xl">
              {t('limitsTitle')}
            </h3>
            <p className="mt-4 max-w-3xl text-base leading-relaxed break-keep text-[var(--color-ink)]/85">
              {t('limitsBody')}
            </p>
            <ul className="mt-6 max-w-3xl space-y-2.5">
              {limits.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-base leading-relaxed break-keep text-[var(--color-ink)]/85"
                >
                  <span aria-hidden="true" className="mt-2.5 h-px w-4 shrink-0 bg-[var(--color-slate-muted)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/contact"
            className="mt-12 inline-flex items-center justify-center rounded-md bg-[var(--color-indigo-deep)] px-7 py-4 text-base font-semibold break-keep text-white transition-colors hover:bg-[var(--color-denim)]"
          >
            {t('cta')}
          </Link>
        </div>
      </section>
    </>
  );
}
