import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import SchemaOrg, { buildOrganizationSchema } from '@/components/seo/SchemaOrg';

import BlugeneHero from '@/components/blugene/BlugeneHero';
import EvidenceStrip from '@/components/blugene/EvidenceStrip';
import BrandManifesto from '@/components/blugene/BrandManifesto';
import ImpurityEvidence from '@/components/blugene/ImpurityEvidence';
import ScienceSection from '@/components/blugene/ScienceSection';
import EnvironmentSection from '@/components/blugene/EnvironmentSection';
import FabricComparison from '@/components/blugene/FabricComparison';
import ShadeLibrary from '@/components/blugene/ShadeLibrary';
import ProductFormats from '@/components/blugene/ProductFormats';
import CertificationLibrary from '@/components/blugene/CertificationLibrary';
import SectionHeading from '@/components/blugene/SectionHeading';
import FinalCta from '@/components/blugene/FinalCta';

import { BRAND, LOCALES, SITE_URL, canonicalUrl, localeAlternates } from '@/data/blugene/site';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/**
 * 이 페이지는 인증서의 **문서상 유효기간**을 현재 날짜와 비교해 배지를 렌더링한다.
 * 하루에 한 번 다시 생성해, 만료된 문서를 계속 '유효'로 보여 주지 않게 한다.
 */
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Home' });
  const url = canonicalUrl(locale, '/');
  const title = `${BRAND.lockup} | ${t('metaTitle')}`;
  return {
    title: { absolute: title },
    description: t('metaDescription'),
    alternates: { canonical: url, languages: localeAlternates('/') },
    openGraph: { title, description: t('metaDescription'), url, type: 'website' },
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'DataHub' });
  const orgSchema = buildOrganizationSchema(
    BRAND.company,
    SITE_URL,
    `${SITE_URL}/brand/cutisbio-logo.png`,
  );

  return (
    <>
      <SchemaOrg schema={orgSchema} />

      {/* 01. 처음 만나는 Blugene */}
      <BlugeneHero />
      <EvidenceStrip />

      {/*
        02. 분말과 프린팅 잉크 — '무엇을 파는가'를 근거보다 먼저 밝힌다.
        이 블록이 뒤로 가면 제품명 · CAS · 규격 안내가 스크롤 60% 지점에서야 처음 나온다.
        바탕은 흰 EvidenceStrip 과 붙지 않도록, 또 카드(bg-white)가 섹션 바탕에 묻히지 않도록 ivory 로 둔다.
      */}
      <section className="w-full bg-[var(--color-ivory)]">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          <ProductFormats variant="bare" />
        </div>
      </section>

      {/* 03. 국경과 세대를 잇는 옷 */}
      <BrandManifesto />

      {/* 04. 보이지 않는 것까지 확인 */}
      <ImpurityEvidence />

      {/* 05. 파랑을 만드는 새로운 방식 */}
      <ScienceSection />

      {/* 05-b. 재생 가능한 탄소 */}
      <EnvironmentSection />

      {/* 06. 실제 원단으로 보여주는 성능 */}
      <section className="w-full bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          <FabricComparison variant="bare" />
        </div>
      </section>

      {/* 07. 당신만의 파랑 */}
      <section className="w-full bg-[var(--color-ivory)]">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          <ShadeLibrary variant="bare" />
        </div>
      </section>

      {/* 08. 원본으로 확인하는 신뢰 — 앞의 07 이 아이보리라 흰 바탕으로 받는다
          (2026-09-09 홈의 프린팅 섹션을 뺐다. 같은 내용이 /dyeing-printing 에 있다) */}
      <section className="w-full bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          <SectionHeading eyebrow={t('eyebrow')} title={t('title')} body={t('body')} size="hero" />
          <div className="mt-12">
            <CertificationLibrary compact />
          </div>
          <Link
            href="/data-certifications"
            className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-denim)] underline underline-offset-4 hover:text-[var(--color-indigo-deep)]"
          >
            {t('catalogueTitle')}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* 09. 사업 문의로 연결 */}
      <FinalCta />
    </>
  );
}
