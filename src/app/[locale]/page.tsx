import React from 'react';
import SchemaOrg, { buildOrganizationSchema } from '@/components/seo/SchemaOrg';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

import HeroSection from '@/components/home/HeroSection';
import ProblemSolution from '@/components/home/ProblemSolution';
import TechnologyProcess from '@/components/home/TechnologyProcess';
import PartnersPress from '@/components/home/PartnersPress';
import CertificationsSection from '@/components/shared/CertificationsSection';
import QualityTestSection from '@/components/home/QualityTestSection';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Home' });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://cutisbioindigo.kr';
  
  const orgSchema = buildOrganizationSchema(
    'CutisBio',
    baseUrl,
    `${baseUrl}/logo.png`
  );

  return (
    <>
      <SchemaOrg schema={orgSchema} />
      
      <div className="flex flex-col w-full">
        <HeroSection />
        <ProblemSolution />
        <CertificationsSection />
        <QualityTestSection />
        <TechnologyProcess />
        <PartnersPress />
        
        {/* Call to Action Section - Refactored to match premium layout */}
        <section className="bg-slate-900 py-32 px-6 text-center shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-900 to-slate-900" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white leading-tight break-keep">{t('ctaTitle')}</h2>
            <p className="text-lg sm:text-xl text-slate-300 mb-10 leading-relaxed break-keep">
              {t('ctaText')}
            </p>
            <Link href="/blog/sustainable-indigo" className="inline-block bg-white text-blue-900 font-bold py-4 sm:py-5 px-8 sm:px-12 rounded-full hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl text-lg sm:text-xl w-full sm:w-auto tracking-wide">
              {t('ctaButton')}
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
