import React from 'react';
import SchemaOrg, { buildOrganizationSchema } from '@/components/seo/SchemaOrg';
import DataTable from '@/components/ui/DataTable';
import { getTranslations } from 'next-intl/server';

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
        <section className="text-center py-12 bg-blue-50 rounded-xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">{t('coreValuesTitle')}</h2>
          <div className="my-6">
            <DataTable
              columns={[
                { key: 'feature', label: t('column1') },
                { key: 'benefit', label: t('column2') },
              ]}
              data={keyFeatures}
              caption={t('coreValuesTitle')}
            />
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">{t('conclusionTitle')}</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {t.rich('conclusionText', {
              techLink: (chunks) => <strong>{chunks}</strong>
            })}
          </p>
        </section>
      </div>
    </>
  );
}
