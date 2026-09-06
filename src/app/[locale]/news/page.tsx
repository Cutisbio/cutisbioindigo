import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import SchemaOrg, { buildOrganizationSchema } from '@/components/seo/SchemaOrg';
import SectionHeading from '@/components/blugene/SectionHeading';
import { BRAND, LOCALES, SITE_URL, buildPageMetadata } from '@/data/blugene/site';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'News' });
  return buildPageMetadata({
    locale,
    path: '/news',
    title: t('title'),
    description: t('description'),
  });
}

type Article = {
  date: string;
  category: string;
  title: string;
  summary: string;
  thumbnailAlt: string;
  link?: string;
};

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'News' });
  const tCommon = await getTranslations({ locale, namespace: 'Common' });
  const articles = t.raw('articles') as Article[];
  const orgSchema = buildOrganizationSchema(BRAND.company, SITE_URL, `${SITE_URL}/brand/cutisbio-logo.png`);

  return (
    <>
      <SchemaOrg schema={orgSchema} />

      <section className="w-full border-b border-[color:var(--color-washed)] bg-[var(--color-ivory)]">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <SectionHeading headingLevel="h1" title={t('title')} body={t('description')} size="lg" />
        </div>
      </section>

      <section className="w-full bg-white">
        <div className="mx-auto max-w-[900px] px-4 py-14 sm:px-6 sm:py-16">
          <ul className="divide-y divide-[color:var(--color-washed)]">
            {articles.map((article, index) => (
              <li key={`${article.date}-${index}`} className="py-7 first:pt-0">
                <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-slate-muted)]">
                  <span className="rounded-full bg-[var(--color-ivory)] px-3 py-1 font-semibold text-[var(--color-denim)]">
                    {article.category}
                  </span>
                  <time dateTime={article.date}>{article.date}</time>
                </div>
                <h2 className="mt-3 text-lg leading-snug font-semibold break-keep text-[var(--color-indigo-deep)] sm:text-xl">
                  {article.title}
                </h2>
                <p className="mt-2 text-base leading-relaxed break-keep text-[var(--color-ink)]/80">
                  {article.summary}
                </p>
                {article.link && (
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-denim)] underline underline-offset-4 hover:text-[var(--color-indigo-deep)]"
                  >
                    {tCommon('viewSource')}
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
