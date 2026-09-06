import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import SectionHeading from '@/components/blugene/SectionHeading';
import SourceNote, { AssetKind } from '@/components/blugene/SourceNote';
import ZoomableImage from '@/components/blugene/ZoomableImage';
import ProductionPathway from '@/components/blugene/ProductionPathway';
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
  const t = await getTranslations({ locale, namespace: 'Technology' });
  return buildPageMetadata({
    locale,
    path: '/technology',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

type Route = { name: string; feedstock: string; intermediate: string; text: string };

export default async function TechnologyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Technology' });
  const tCommon = await getTranslations({ locale, namespace: 'Common' });
  const routes = t.raw('routes') as Route[];

  return (
    <>
      <section className="w-full border-b border-[color:var(--color-washed)] bg-[var(--color-ivory)]">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <SectionHeading
            headingLevel="h1"
            eyebrow={t('heroEyebrow')}
            title={t('heroTitle')}
            body={t('heroBody')}
            size="lg"
          />
        </div>
      </section>

      {/* 네 가지 경로 */}
      <section className="w-full bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <h2 className="text-2xl font-bold break-keep text-[var(--color-indigo-deep)] sm:text-3xl">
            {t('routesTitle')}
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {routes.map((route, i) => {
              const isBio = i === 2;
              return (
                <article
                  key={route.name}
                  className={`rounded-md border p-6 ${
                    isBio
                      ? 'border-[var(--color-indigo-deep)] bg-[var(--color-ivory)]'
                      : 'border-[color:var(--color-washed)] bg-white'
                  }`}
                >
                  <h3 className="text-lg leading-snug font-semibold break-keep text-[var(--color-indigo-deep)]">
                    {route.name}
                  </h3>
                  <dl className="mt-4 space-y-2 text-sm">
                    <div>
                      <dt className="text-[var(--color-slate-muted)]">{t('routeFeedstockLabel')}</dt>
                      <dd className="font-medium break-keep text-[var(--color-ink)]">{route.feedstock}</dd>
                    </div>
                    <div>
                      <dt className="text-[var(--color-slate-muted)]">{t('routeIntermediateLabel')}</dt>
                      <dd className="font-medium break-keep text-[var(--color-ink)]">
                        {route.intermediate}
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-sm leading-relaxed break-keep text-[var(--color-ink)]/85">
                    {route.text}
                  </p>
                </article>
              );
            })}
          </div>

          <SourceNote className="mt-6 max-w-3xl">{t('routesNote')}</SourceNote>

          <div className="mt-10 max-w-4xl">
            <div className="mb-3">
              <AssetKind>{tCommon('conceptImage')}</AssetKind>
            </div>
            <ZoomableImage
              src="/blugene/technology/four-production-routes.png"
              alt={t('routesAlt')}
              width={1191}
              height={771}
              sizes="(max-width: 1024px) 92vw, 900px"
              openLabel={tCommon('openImage')}
              closeLabel={tCommon('close')}
              caption={t('routesCaption')}
            />
          </div>
        </div>
      </section>

      {/* 탄소 경로 */}
      <section className="w-full bg-[var(--color-ivory)]">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-24">
          <div>
            <h2 className="text-2xl font-bold break-keep text-[var(--color-indigo-deep)] sm:text-3xl">
              {t('carbonTitle')}
            </h2>
            <p className="mt-5 text-base leading-[1.9] break-keep text-[var(--color-ink)]/85 sm:text-lg">
              {t('carbonBody')}
            </p>
            <div className="mt-6">
              <AssetKind>{tCommon('conceptImage')}</AssetKind>
            </div>
          </div>
          <ZoomableImage
            src="/blugene/technology/carbon-pathways.png"
            alt={t('carbonAlt')}
            width={1230}
            height={678}
            sizes="(max-width: 1024px) 92vw, 600px"
            openLabel={tCommon('openImage')}
            closeLabel={tCommon('close')}
            caption={t('carbonCaption')}
          />
        </div>
      </section>

      {/* 원료에서 원단까지 */}
      <section className="w-full bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <h2 className="sr-only">{t('processTitle')}</h2>
          <ProductionPathway variant="bare" />
        </div>
      </section>

      {/* 불순물 · 작업 환경 */}
      <section className="w-full bg-[var(--color-ivory)]">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
          <div>
            <h2 className="text-2xl font-bold break-keep text-[var(--color-indigo-deep)] sm:text-3xl">
              {t('impurityTitle')}
            </h2>
            <p className="mt-5 text-base leading-[1.9] break-keep text-[var(--color-ink)]/85">
              {t('impurityBody')}
            </p>
            <Link
              href="/data-certifications"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-denim)] underline underline-offset-4 hover:text-[var(--color-indigo-deep)]"
            >
              {t('cta')}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div>
            <h2 className="text-2xl font-bold break-keep text-[var(--color-indigo-deep)] sm:text-3xl">
              {t('safetyTitle')}
            </h2>
            <p className="mt-5 text-base leading-[1.9] break-keep text-[var(--color-ink)]/85">
              {t('safetyBody')}
            </p>
            <div className="mt-6">
              <div className="mb-3">
                <AssetKind>{tCommon('conceptImage')}</AssetKind>
              </div>
              <ZoomableImage
                src="/blugene/technology/worker-safety.png"
                alt={t('safetyAlt')}
                width={988}
                height={331}
                sizes="(max-width: 1024px) 92vw, 560px"
                openLabel={tCommon('openImage')}
                closeLabel={tCommon('close')}
                caption={t('conceptCaptionSafety')}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
