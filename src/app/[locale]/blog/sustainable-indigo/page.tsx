import React from 'react';
import SchemaOrg, { buildArticleSchema, buildFAQSchema } from '@/components/seo/SchemaOrg';
import StrictImage from '@/components/ui/StrictImage';
import QnaSection from '@/components/ui/QnaSection';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Blog' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function SustainableIndigoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Blog' });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://cutisbioindigo.kr';
  
  const articleSchema = buildArticleSchema(
    t('title'),
    [`${baseUrl}/cutisbio-microbe.jpg`],
    'CutisBio R&D Team',
    '2026-04-07T00:00:00Z',
    '2026-04-07T00:00:00Z'
  );

  const faqData = [
    {
      question: t('faqQ1'),
      answer: t('faqA1'),
    },
    {
      question: t('faqQ2'),
      answer: t('faqA2'),
    },
    {
      question: t('faqQ3'),
      answer: t('faqA3'),
    }
  ];

  const faqSchema = buildFAQSchema(faqData);

  return (
    <>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={faqSchema} />

      <article className="max-w-3xl mx-auto py-8">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold mb-4 leading-tight">
            {t('title')}
          </h1>
          <div className="text-gray-500 text-sm">
            {t('author')} | {t('date')}
          </div>
        </header>

        <section className="mb-12 prose prose-lg prose-blue max-w-none">
          <p className="lead text-xl text-gray-700 mb-6">
            {t.rich('intro', {
              denim: (chunks) => <strong>{chunks}</strong>
            })}
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 border-b pb-2">{t('section1Title')}</h2>
          <p className="mb-6">
            {t('section1Text')}
          </p>

          <figure className="my-8 bg-gray-50 flex flex-col items-center justify-center p-8 border border-dashed rounded-lg text-gray-400">
             <div className="relative w-full h-64 bg-blue-100 flex items-center justify-center rounded overflow-hidden">
                <StrictImage
                  src="/cutisbio-microbe.jpg"
                  alt={t('imageCaption')}
                  fill
                   className="object-cover opacity-90" 
                />
                <span className="z-10 text-white drop-shadow-md font-bold whitespace-pre-wrap text-center text-lg hidden sm:block">
                  {t('imageText')}
                </span>
             </div>
             <figcaption className="mt-3 text-sm text-center">
               {t('imageCaption')}
             </figcaption>
          </figure>

          <h2 className="text-2xl font-bold mt-10 mb-4 border-b pb-2">{t('section2Title')}</h2>
          <p className="mb-6">
            {t('section2Text')}
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mt-10 mb-6 border-b pb-2">{t('faqTitle')}</h2>
          <QnaSection items={faqData} headingLevel="h3" />
        </section>
      </article>
    </>
  );
}
