import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import SectionHeading from '@/components/blugene/SectionHeading';
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
  const t = await getTranslations({ locale, namespace: 'Blog' });
  return buildPageMetadata({
    locale,
    path: '/blog',
    title: t('title'),
    description: t('description'),
  });
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Blog' });
  const tTech = await getTranslations({ locale, namespace: 'Tech' });

  const posts = [
    {
      slug: 'sustainable-indigo',
      category: t('categoryTech'),
      title: tTech('title'),
      summary: tTech('description'),
      date: '2026-09-06',
      readTime: t('readTime', { minutes: 5 }),
    },
  ];

  return (
    <>
      <section className="w-full border-b border-[color:var(--color-washed)] bg-[var(--color-ivory)]">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <SectionHeading
            headingLevel="h1"
            eyebrow={t('eyebrow')}
            title={t('title')}
            body={t('description')}
            size="hero"
          />
        </div>
      </section>

      <section className="w-full bg-white">
        <div className="mx-auto max-w-[900px] px-4 py-14 sm:px-6 sm:py-16">
          <ul className="space-y-8">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block rounded-md border border-[color:var(--color-washed)] p-7 transition-colors hover:bg-[var(--color-ivory)] sm:p-9"
                >
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-slate-muted)]">
                    <span className="rounded-full bg-[var(--color-ivory)] px-3 py-1 font-semibold text-[var(--color-denim)] group-hover:bg-white">
                      {post.category}
                    </span>
                    <time dateTime={post.date}>{post.date}</time>
                    <span aria-hidden="true">·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="mt-4 text-xl leading-snug font-semibold break-keep text-[var(--color-indigo-deep)] sm:text-2xl">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-base leading-relaxed break-keep text-[var(--color-ink)]/80">
                    {post.summary}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-denim)]">
                    {t('readMore')}
                    <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
