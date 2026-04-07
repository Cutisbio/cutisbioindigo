import React from 'react';
import { getTranslations } from 'next-intl/server';
import SchemaOrg, { buildOrganizationSchema } from '@/components/seo/SchemaOrg';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Contact' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Contact' });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://cutisbioindigo.kr';
  
  const orgSchema = buildOrganizationSchema(
    'CutisBio',
    baseUrl,
    `${baseUrl}/logo.png`
  );

  return (
    <>
      <SchemaOrg schema={orgSchema} />
      <div className="max-w-4xl mx-auto space-y-12 py-12 px-4">
        <section className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-6 border-b pb-4 inline-block">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('description')}
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="space-y-8 flex flex-col justify-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center mb-3">
                <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                {t('addressTitle')}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed font-medium pl-8">
                {t('addressDetail')}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center mb-3">
                <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                {t('emailTitle')}
              </h2>
              <a href={`mailto:contact@cutisbio.com`} className="text-lg text-blue-600 hover:text-blue-800 transition font-medium pl-8 inline-block">
                {t('emailAddress')}
              </a>
            </div>
          </div>

          <div className="h-full min-h-[350px] w-full bg-gray-100 rounded-lg overflow-hidden shadow-inner border border-gray-200 relative">
            <h2 className="sr-only">{t('mapTitle')}</h2>
            <iframe 
              src="https://maps.google.com/maps?q=%EC%84%9C%EC%9A%B8%EC%8B%9C%20%EA%B0%95%EB%82%A8%EA%B5%AC%20%EB%85%BC%ED%98%84%EB%A1%9C%20842&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%" 
              height="100%" 
              className="absolute top-0 left-0 border-0"
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map Location"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
}
