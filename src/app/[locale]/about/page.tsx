import React from 'react';
import { getTranslations } from 'next-intl/server';
import SchemaOrg, { buildOrganizationSchema } from '@/components/seo/SchemaOrg';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'About' });
  return {
    title: t('title'),
    description: t('missionText'),
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'About' });
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://cutisbioindigo.kr';
  const orgSchema = buildOrganizationSchema('CutisBio', baseUrl, `${baseUrl}/logo.png`);

  const historyData = t.raw('historyList') as { year: string, event: string }[];

  return (
    <>
      <SchemaOrg schema={orgSchema} />

      <div className="max-w-5xl mx-auto space-y-20 py-10 px-4">
        
        {/* Hero Section */}
        <section className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 drop-shadow-sm">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto italic border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded-r-lg whitespace-pre-wrap">
            {t('missionText')}
          </p>
        </section>

        {/* Vision Banner */}
        <section className="bg-gradient-to-br from-blue-900 to-indigo-800 text-white p-10 md:p-14 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500 opacity-10 mix-blend-overlay"></div>
          <div className="relative z-10 text-center">
            <h2 className="text-3xl font-bold mb-6 text-blue-200 uppercase letter-spacing-widest">
              {t('visionTitle')}
            </h2>
            <p className="text-lg md:text-2xl font-light leading-relaxed max-w-4xl mx-auto">
              {t('visionText')}
            </p>
          </div>
        </section>

        {/* Core Business Areas - Cards Grid */}
        <section>
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-800 relative inline-block left-1/2 -translate-x-1/2">
            {t('coreBusinessTitle')}
            <span className="absolute -bottom-3 left-1/4 w-1/2 h-1 bg-blue-500 rounded-full"></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-white border rounded-xl shadow-sm hover:shadow-lg transition flex flex-col items-center text-center p-8 group">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">{t('medicalTitle')}</h3>
              <p className="text-gray-600">{t('medicalText')}</p>
            </div>

            <div className="bg-white border rounded-xl shadow-sm hover:shadow-lg transition flex flex-col items-center text-center p-8 group">
              <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-pink-600 group-hover:text-white transition duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">{t('beautyTitle')}</h3>
              <p className="text-gray-600">{t('beautyText')}</p>
            </div>

            <div className="bg-white border rounded-xl shadow-sm hover:shadow-lg transition flex flex-col items-center text-center p-8 group">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">{t('fashionTitle')}</h3>
              <p className="text-gray-600">{t('fashionText')}</p>
            </div>
          </div>
        </section>

        {/* History Vertical Timeline */}
        <section>
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">
            {t('historyTitle')}
          </h2>
          <div className="relative border-l-4 border-blue-200 ml-4 md:ml-12 pl-8 space-y-10">
            {historyData.map((item, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-11 w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-sm mt-1"></div>
                <h3 className="text-2xl font-black text-blue-600 mb-2">{item.year}</h3>
                <p className="text-lg text-gray-700 bg-white p-4 border rounded shadow-sm hover:shadow-md transition">
                  {item.event}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
