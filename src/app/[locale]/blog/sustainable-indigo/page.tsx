import React from 'react';
import SchemaOrg, { buildArticleSchema, buildFAQSchema } from '@/components/seo/SchemaOrg';
import StrictImage from '@/components/ui/StrictImage';
import QnaSection from '@/components/ui/QnaSection';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Tech' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function SustainableIndigoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Tech' });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://cutisbioindigo.kr';
  
  const articleSchema = buildArticleSchema(
    t('title'),
    [`${baseUrl}/cutisbio-microbe.jpg`],
    'CutisBio R&D Team',
    '2026-04-07T00:00:00Z',
    '2026-04-07T00:00:00Z'
  );

  const faqData = t.raw('faqList') as { question: string, answer: string }[];
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
            CutisBio R&D Team
          </div>
        </header>

        <section className="mb-12 prose prose-lg prose-blue max-w-none">
          <p className="lead text-xl text-gray-700 mb-6">
            {t('intro')}
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 border-b pb-2">{t('section1Title')}</h2>
          <p className="mb-6 text-gray-700">
            {t('section1Text')}
          </p>

          <figure className="my-8 bg-gray-50 flex flex-col items-center justify-center p-8 border border-dashed rounded-lg text-gray-400">
             <div className="relative w-full h-64 bg-blue-100 flex items-center justify-center rounded overflow-hidden">
                <StrictImage
                  src="/cutisbio-microbe.jpg"
                  alt={t('comparisonImageAlt')}
                  fill
                   className="object-cover opacity-90" 
                />
             </div>
             <figcaption className="mt-3 text-sm text-center font-medium">
               {t('comparisonCaption')}
             </figcaption>
          </figure>

          <h2 className="text-2xl font-bold mt-10 mb-4 border-b pb-2">{t('section2Title')}</h2>
          <p className="mb-6 text-gray-700">
            {t('section2Text')}
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 border-b pb-2">{t('section3Title')}</h2>
          <p className="mb-6 text-gray-700">
            {t('section3Text')}
          </p>
        </section>

        <section className="mb-12 bg-white shadow-sm p-8 rounded-lg border">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">{t('faqTitle')}</h2>
          <QnaSection items={faqData} headingLevel="h3" />
        </section>
      </article>
    </>
  );
}
