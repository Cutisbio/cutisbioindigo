import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import SchemaOrg, { buildOrganizationSchema } from '@/components/seo/SchemaOrg';
import SectionHeading from '@/components/blugene/SectionHeading';
import NewsPostCard from '@/components/blugene/NewsPostCard';
import { BRAND, LOCALES, SITE_URL, buildPageMetadata } from '@/data/blugene/site';
import { pick, type NewsPost } from '@/data/blugene/newsPosts';
import { readNewsPosts } from '@/data/blugene/newsPosts.server';

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
  /** 기사를 쓴 매체명. 고유명사라 번역하지 않고 모든 언어에서 원문 그대로 보여 준다 */
  source?: string;
};

/** 목록에 함께 늘어놓기 위해, 직접 쓴 소식을 기사와 같은 모양으로 바꾼다 */
type Entry = Article & { post?: NewsPost };

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'News' });
  const articles = t.raw('articles') as Article[];
  const orgSchema = buildOrganizationSchema(BRAND.company, SITE_URL, `${SITE_URL}/brand/cutisbio-logo.png`);

  // 직접 쓴 소식은 언어별 메시지 파일이 아니라 content/news-posts.json 에 있다.
  // 자동 수집 스크립트가 News.articles 를 통째로 다시 쓰기 때문에 파일을 나눠 두었다.
  const posts = readNewsPosts();
  const entries: Entry[] = [
    ...posts.map((post) => ({
      date: post.date,
      category:
        pick(post.category, locale) ||
        (post.type === 'youtube' ? t('categoryVideo') : t('categoryPost')),
      title: pick(post.title, locale),
      summary: pick(post.summary, locale),
      thumbnailAlt: pick(post.imageAlt, locale),
      link: post.link,
      post,
    })),
    ...articles.map((article) => ({ ...article })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <SchemaOrg schema={orgSchema} />

      <section className="w-full border-b border-[color:var(--color-washed)] bg-[var(--color-ivory)]">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <SectionHeading headingLevel="h1" title={t('title')} body={t('description')} size="hero" />
        </div>
      </section>

      <section className="w-full bg-white">
        <div className="mx-auto max-w-[900px] px-4 py-14 sm:px-6 sm:py-16">
          <ul className="divide-y divide-[color:var(--color-washed)]">
            {entries.map((article, index) => (
              <li key={article.post?.id ?? `${article.date}-${index}`} className="py-7 first:pt-0">
                <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-slate-muted)]">
                  <span className="rounded-full bg-[var(--color-ivory)] px-3 py-1 font-semibold text-[var(--color-denim)]">
                    {article.category}
                  </span>
                  {article.source && (
                    <>
                      <span className="break-keep">{article.source}</span>
                      <span aria-hidden="true">·</span>
                    </>
                  )}
                  <time dateTime={article.date}>{article.date}</time>
                </div>
                {/*
                  언론 목록에서 독자가 누르는 것은 제목이다. 제목 전체가 링크여야
                  좁은 화면에서도 손가락이 닿는다. 같은 주소로 가는 링크를 한 행에
                  두 개 두지 않으려고 아래의 '원본 자료 보기' 줄은 여기로 합쳤다.
                */}
                <h2 className="mt-3 text-lg leading-snug font-semibold break-keep text-[var(--color-indigo-deep)] sm:text-xl">
                  {article.link ? (
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline-offset-4 hover:text-[var(--color-denim)] hover:underline"
                    >
                      {article.title}
                      <span aria-hidden="true" className="ml-1.5 text-[var(--color-denim)]">
                        ↗
                      </span>
                    </a>
                  ) : (
                    article.title
                  )}
                </h2>

                {article.post?.type === 'youtube' && article.post.youtubeId && (
                  <NewsPostCard
                    youtubeId={article.post.youtubeId}
                    title={article.title}
                    playLabel={t('playVideo')}
                  />
                )}

                {article.post?.type === 'post' && article.post.image && (
                  <Image
                    src={article.post.image}
                    alt={article.thumbnailAlt}
                    width={article.post.imageWidth ?? 1600}
                    height={article.post.imageHeight ?? 900}
                    className="mt-4 h-auto w-full rounded-md"
                    sizes="(max-width: 900px) 100vw, 900px"
                  />
                )}

                {/* 자동 수집 기사는 요약이 없는 경우가 많다 — Google News 가 본문 대신
                    제목을 되풀이해 주기 때문에 수집 단계에서 비운다. 빈 줄을 그리지 않는다. */}
                {article.summary.trim() && (
                  <p className="mt-3 text-base leading-relaxed break-keep whitespace-pre-line text-[var(--color-ink)]/80">
                    {article.summary}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
