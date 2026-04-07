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
      <div className="max-w-4xl mx-auto space-y-12 py-12 px-4">
        <section className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600">{t('description')}</p>
        </section>

        <section className="space-y-8">
          {articles.map((article, index) => (
            <article key={index} className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition p-6 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full">{article.category}</span>
                <time dateTime={article.date}>{article.date}</time>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{article.title}</h2>
              <p className="text-gray-600 leading-relaxed">{article.summary}</p>
            </article>
          ))}
        </section>
      </div>
    </>
  );
}
