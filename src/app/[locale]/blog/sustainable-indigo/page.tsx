import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import SchemaOrg, { buildArticleSchema, buildFAQSchema } from '@/components/seo/SchemaOrg';
import AnilineStructures from '@/components/blugene/AnilineStructures';
import QnaSection from '@/components/ui/QnaSection';
import CertificationLibrary from '@/components/blugene/CertificationLibrary';
import SectionHeading from '@/components/blugene/SectionHeading';
import { Link } from '@/i18n/routing';
import { BRAND, LOCALES, SITE_URL, buildPageMetadata, canonicalUrl } from '@/data/blugene/site';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/** 이 페이지도 인증 배지를 렌더링하므로 하루 단위로 다시 생성한다. */
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Tech' });
  return buildPageMetadata({
    locale,
    path: '/blog/sustainable-indigo',
    title: t('title'),
    description: t('description'),
  });
}

export default async function SustainableIndigoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Tech' });
  const tNav = await getTranslations({ locale, namespace: 'Nav' });

  const articleSchema = buildArticleSchema({
    headline: t('title'),
    image: [`${SITE_URL}/blugene/brand/og-cover.jpg`],
    authorName: `${BRAND.company} R&D Team`,
    publisherName: BRAND.company,
    publisherLogo: `${SITE_URL}/brand/cutisbio-logo.png`,
    datePublished: '2026-04-07T00:00:00Z',
    dateModified: '2026-09-06T00:00:00Z',
    url: canonicalUrl(locale, '/blog/sustainable-indigo'),
  });

  const faqData = t.raw('faqList') as { question: string; answer: string }[];
  const faqSchema = buildFAQSchema(faqData);

  return (
    <>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={faqSchema} />

      <section className="w-full border-b border-[color:var(--color-washed)] bg-[var(--color-ivory)]">
        <div className="mx-auto max-w-[900px] px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
          <SectionHeading headingLevel="h1" title={t('title')} body={t('intro')} size="lg" />
          <p className="mt-8 text-sm text-[var(--color-slate-muted)]">{BRAND.company} R&amp;D Team</p>
        </div>
      </section>

      <article className="mx-auto w-full max-w-[900px] px-4 py-14 sm:px-6 sm:py-16">
        <h2 className="text-2xl font-bold break-keep text-[var(--color-indigo-deep)] sm:text-3xl">
          {t('section1Title')}
        </h2>
        <p className="mt-5 text-base leading-[1.9] break-keep text-[var(--color-ink)]/85 sm:text-lg">
          {t('section1Text')}
        </p>

        <AnilineStructures />

        <h2 className="text-2xl font-bold break-keep text-[var(--color-indigo-deep)] sm:text-3xl">
          {t('section2Title')}
        </h2>
        <p className="mt-5 text-base leading-[1.9] break-keep text-[var(--color-ink)]/85 sm:text-lg">
          {t('section2Text')}
        </p>

        <h2 className="mt-12 text-2xl font-bold break-keep text-[var(--color-indigo-deep)] sm:text-3xl">
          {t('section3Title')}
        </h2>
        <p className="mt-5 text-base leading-[1.9] break-keep text-[var(--color-ink)]/85 sm:text-lg">
          {t('section3Text')}
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/technology"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-denim)] underline underline-offset-4 hover:text-[var(--color-indigo-deep)]"
          >
            {tNav('technology')}
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/data-certifications"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-denim)] underline underline-offset-4 hover:text-[var(--color-indigo-deep)]"
          >
            {tNav('dataCertifications')}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </article>

      <section className="w-full bg-[var(--color-ivory)]">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <h2 className="text-2xl font-bold break-keep text-[var(--color-indigo-deep)] sm:text-3xl">
            {t('certSectionTitle')}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed break-keep text-[var(--color-ink)]/85">
            {t('certSectionText')}
          </p>
          <div className="mt-10">
            <CertificationLibrary compact />
          </div>
        </div>
      </section>

      <section className="w-full bg-white">
        <div className="mx-auto max-w-[900px] px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="text-2xl font-bold break-keep text-[var(--color-indigo-deep)] sm:text-3xl">
            {t('faqTitle')}
          </h2>
          <div className="mt-8">
            <QnaSection items={faqData} headingLevel="h3" />
          </div>
        </div>
      </section>
    </>
  );
}
