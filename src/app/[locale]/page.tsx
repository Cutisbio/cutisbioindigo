import React from 'react';
import SchemaOrg, { buildOrganizationSchema } from '@/components/seo/SchemaOrg';
import DataTable from '@/components/ui/DataTable';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Home' });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://cutisbioindigo.kr';
  
  const orgSchema = buildOrganizationSchema(
    'CutisBio',
    baseUrl,
    `${baseUrl}/logo.png`
  );

  const keyFeatures = [
    { feature: t('feature1'), benefit: t('benefit1') },
    { feature: t('feature2'), benefit: t('benefit2') },
    { feature: t('feature3'), benefit: t('benefit3') },
  ];

  return (
    <>
      <SchemaOrg schema={orgSchema} />
      <div className="space-y-10 sm:space-y-16">
        <section className="text-center py-12 sm:py-20 bg-blue-50 rounded-2xl relative overflow-hidden px-4 md:px-8 mx-2 sm:mx-0">
          <div className="relative z-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-4 sm:mb-6 uppercase leading-snug sm:leading-tight drop-shadow-sm">
              {t('heroTitle')}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed px-2">
              {t('heroSubtitle')}
            </p>
          </div>
        </section>

        <section className="py-4 sm:py-8 px-4 sm:px-0">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 text-center text-blue-900">{t('impactMetricsTitle')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 text-center">
            <div className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition">
              <div className="text-3xl sm:text-4xl font-black text-blue-600 mb-2 sm:mb-3">{t('metric1Value')}</div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">{t('metric1Text')}</div>
            </div>
            <div className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition">
              <div className="text-3xl sm:text-4xl font-black text-blue-600 mb-2 sm:mb-3">{t('metric2Value')}</div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">{t('metric2Text')}</div>
            </div>
            <div className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition sm:col-span-2 md:col-span-1">
              <div className="text-3xl sm:text-4xl font-black text-blue-600 mb-2 sm:mb-3">{t('metric3Value')}</div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">{t('metric3Text')}</div>
            </div>
          </div>
        </section>

        <section className="py-4 sm:py-8 px-4 sm:px-0">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-5 border-b pb-3">{t('coreValuesTitle')}</h2>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">{t('coreValuesDesc')}</p>
          <div className="my-6 overflow-x-auto rounded-lg shadow-sm font-medium">
            <DataTable
              columns={[
                { key: 'feature', label: 'Feature' },
                { key: 'benefit', label: 'Benefit' },
              ]}
              data={keyFeatures}
              caption={t('coreValuesTitle')}
            />
          </div>
        </section>
        
        <section className="bg-gray-50 p-6 sm:p-12 rounded-2xl text-center mx-4 sm:mx-0 shadow-sm border border-gray-100">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-5">{t('ctaTitle')}</h2>
          <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 mx-auto max-w-2xl leading-relaxed px-2">
            {t('ctaText')}
          </p>
          <Link href="/blog/sustainable-indigo" className="inline-block bg-blue-600 text-white font-semibold py-3 sm:py-4 px-6 sm:px-10 rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg w-full sm:w-auto">
            {t('ctaButton')}
          </Link>
        </section>
      </div>
    </>
  );
}
