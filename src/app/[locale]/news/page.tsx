import React from 'react';
import { getTranslations } from 'next-intl/server';
import SchemaOrg, { buildOrganizationSchema } from '@/components/seo/SchemaOrg';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'News' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'News' });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://cutisbioindigo.kr';
  const orgSchema = buildOrganizationSchema('CutisBio', baseUrl, `${baseUrl}/logo.png`);

  const articles = t.raw('articles') as { date: string; category: string; title: string; summary: string; thumbnailAlt: string }[];

  return (
    <>
      <SchemaOrg schema={orgSchema} />
      <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12 py-8 sm:py-12 px-4 sm:px-6">
        <section className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-3 sm:mb-4">
            {t('title')}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 px-2 sm:px-0 leading-relaxed">{t('description')}</p>
        </section>

        <section className="space-y-6 sm:space-y-8">
          {articles.map((article, index) => (
            <article key={index} className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition p-5 sm:p-6 md:p-8 flex flex-col gap-2 sm:gap-3 mx-2 sm:mx-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 mb-1 sm:mb-0">
                <span className="bg-blue-100 text-blue-700 font-semibold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">{article.category}</span>
                <time dateTime={article.date}>{article.date}</time>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">{article.title}</h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mt-1">{article.summary}</p>
            </article>
          ))}
        </section>
      </div>
    </>
  );
}
