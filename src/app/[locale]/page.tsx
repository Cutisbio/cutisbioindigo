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
      <div className="space-y-12">
        <section className="text-center py-16 bg-blue-50 rounded-xl relative overflow-hidden px-4">
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-6 uppercase">
              {t('heroTitle')}
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              {t('heroSubtitle')}
            </p>
          </div>
        </section>

        <section className="py-8">
          <h2 className="text-2xl font-bold mb-8 text-center text-blue-900">{t('impactMetricsTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-white border rounded-lg shadow-sm">
              <div className="text-4xl font-black text-blue-600 mb-2">{t('metric1Value')}</div>
              <div className="text-gray-600 font-medium">{t('metric1Text')}</div>
            </div>
            <div className="p-6 bg-white border rounded-lg shadow-sm">
              <div className="text-4xl font-black text-blue-600 mb-2">{t('metric2Value')}</div>
              <div className="text-gray-600 font-medium">{t('metric2Text')}</div>
            </div>
            <div className="p-6 bg-white border rounded-lg shadow-sm">
              <div className="text-4xl font-black text-blue-600 mb-2">{t('metric3Value')}</div>
              <div className="text-gray-600 font-medium">{t('metric3Text')}</div>
            </div>
          </div>
        </section>

        <section className="py-8">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">{t('coreValuesTitle')}</h2>
          <p className="text-lg text-gray-600 mb-6">{t('coreValuesDesc')}</p>
          <div className="my-6">
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
        
        <section className="bg-gray-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">{t('ctaTitle')}</h2>
          <p className="text-lg text-gray-700 mb-8 mx-auto max-w-2xl">
            {t('ctaText')}
          </p>
          <Link href="/blog/sustainable-indigo" className="inline-block bg-blue-600 text-white font-semibold py-3 px-8 rounded hover:bg-blue-700 transition">
            {t('ctaButton')}
          </Link>
        </section>
      </div>
    </>
  );
}
