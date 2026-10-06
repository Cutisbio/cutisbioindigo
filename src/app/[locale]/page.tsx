import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import SchemaOrg, { buildOrganizationSchema, buildProductSchema, buildWebSiteSchema } from '@/components/seo/SchemaOrg';

import BlugeneHero from '@/components/blugene/BlugeneHero';
import PromiseSection from '@/components/blugene/PromiseSection';
import BrandManifesto from '@/components/blugene/BrandManifesto';
import ImpurityEvidence from '@/components/blugene/ImpurityEvidence';
import ScienceSection from '@/components/blugene/ScienceSection';
import EnvironmentSection from '@/components/blugene/EnvironmentSection';
import DyeingCycles from '@/components/blugene/DyeingCycles';
import ProductFormats from '@/components/blugene/ProductFormats';
import CertificationLibrary from '@/components/blugene/CertificationLibrary';
import SectionHeading from '@/components/blugene/SectionHeading';
import FinalCta from '@/components/blugene/FinalCta';

import { BRAND, CORPORATE_SITE_URL, LOCALES, SITE_URL, canonicalUrl, localeAlternates } from '@/data/blugene/site';
import { productSummary } from '@/data/blugene/evidence';
import { productForms } from '@/data/blugene/shades';

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
  // 검색어(바이오 인디고 · bio indigo)가 앞에 오도록 홈만 '설명 | 브랜드' 순서다 — 2026-09-29 검색 노출 보강.
  // 다른 페이지는 buildPageMetadata 의 '페이지 | 브랜드' 순서 그대로다.
  const title = `${t('metaTitle')} | ${BRAND.lockup}`;
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
  // 홈에서만 조직에 별칭과 회사 공식 사이트(sameAs)를 잇고, 사이트(WebSite) 스키마를 함께 낸다 — 2026-09-28 검색 · AI 노출 보강.
  const orgSchema = buildOrganizationSchema(BRAND.company, SITE_URL, `${SITE_URL}/brand/cutisbio-logo.png`, {
    alternateName: [BRAND.companyKo, BRAND.companyLegal, BRAND.name],
    sameAs: [CORPORATE_SITE_URL],
  });
  // 제품(분말 · 잉크) 스키마 — 검색엔진과 AI 답변 엔진이 '바이오 인디고 염료' 라는 제품 실체를 브랜드 · 제조사와 함께 읽게 한다.
  // 설명은 시험 · 인증 문서에 있는 사실만 담는다(Products.powderSummary · inkSummary). 가격 · 재고 · 평점은 없으므로 넣지 않는다.
  const tProducts = await getTranslations({ locale, namespace: 'Products' });
  const productSchemas = productForms.map((form) =>
    buildProductSchema({
      name: form.webName,
      alternateName: form.catalogueName,
      description: tProducts(form.id === 'powder' ? 'powderSummary' : 'inkSummary'),
      image: `${SITE_URL}${form.image}`,
      url: `${canonicalUrl(locale, '/dyeing-printing')}#products`,
      brandName: BRAND.name,
      manufacturerName: BRAND.companyLegal,
      manufacturerUrl: CORPORATE_SITE_URL,
      category: 'Indigo dye',
      additionalProperty: form.id === 'powder' ? [{ name: 'CAS', value: productSummary.cas }] : undefined,
    }),
  );
  const siteSchema = buildWebSiteSchema({
    name: BRAND.lockup,
    alternateName: [BRAND.name],
    url: SITE_URL,
    inLanguage: [...LOCALES],
    publisherName: BRAND.companyLegal,
    publisherUrl: CORPORATE_SITE_URL,
  });

  return (
    <>
      <SchemaOrg schema={orgSchema} />
      <SchemaOrg schema={siteSchema} />
      {productSchemas.map((schema, index) => (
        <SchemaOrg key={productForms[index].id} schema={schema} />
      ))}

      {/* 01. 처음 만나는 Blugene */}
      <BlugeneHero />
      {/* 히어로 바로 아래의 「우리가 약속하는 것」 — 2026-09-29 고객 요청으로 98% · 불검출 숫자 줄(EvidenceStrip)을
          브랜드 페이지의 이 블록으로 바꿨다. 숫자의 근거와 읽는 조건은 아래 불순물 · 환경 섹션과 데이터 · 인증 페이지가 맡는다. */}
      <PromiseSection />

      {/*
        02. 분말과 프린팅 잉크 — '무엇을 파는가'를 근거보다 먼저 밝힌다.
        이 블록이 뒤로 가면 제품명 · CAS · 규격 안내가 스크롤 60% 지점에서야 처음 나온다.
        바탕은 흰 PromiseSection 과 붙지 않도록, 또 카드(bg-white)가 섹션 바탕에 묻히지 않도록 ivory 로 둔다.
      */}
      <section className="w-full bg-[var(--color-ivory)]">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          {/* 「염색 횟수에 따른 발색 비교」 도판은 2026-09-29 고객 요청으로 여기서 뺐다. 2026-10-06 부터는 아래 06 섹션에 사례 1만 둔다 */}
          <ProductFormats variant="bare" />
        </div>
      </section>

      {/* 03. 국경과 세대를 잇는 옷 — 기획자(피부과전문의) 사진은 2026-10-05 고객 요청으로 홈에서도 켠다(/brand 와 같은 자리). */}
      <BrandManifesto portrait />

      {/* 04. 보이지 않는 것까지 확인 */}
      <ImpurityEvidence />

      {/* 05. 파랑을 만드는 새로운 방식 */}
      <ScienceSection />

      {/* 05-b. 재생 가능한 탄소 */}
      <EnvironmentSection />

      {/* 06. 염색 횟수에 따른 발색 비교 — 2026-10-06 고객 요청으로 원단 비교(FabricComparison, 카탈로그 Figure 3-1 · 범례 · 원본 스트립)를
          홈에서 빼고, /dyeing-printing 의 「Blugene 염색실증 사례 1」(실타래 비교)만 두고 염색성능 페이지 링크를 단다.
          원단 비교는 /dyeing-printing 에 그대로 있다. */}
      <section className="w-full bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          <DyeingCycles cases={['skein']} titleAs="h2" cta />
        </div>
      </section>

      {/* 07. 당신만의 파랑(ShadeLibrary)은 2026-10-05 고객 요청으로 홈에서 뺐다 — 「카탈로그 농도별 견본」 격자를 빼고 나면
          제목만 남기 때문이다(인디루빈 비교는 2026-09-29 에 이미 뺐다). /dyeing-printing 에는 남아 있다. */}

      {/* 08. 원본으로 확인하는 신뢰 — 앞의 06(발색 비교)이 흰 바탕이라 아이보리로 받는다 — 07 은 2026-10-05 에 뺐다
          (2026-09-09 홈의 프린팅 섹션을 뺐다. 같은 내용이 /dyeing-printing 에 있다)
          (2026-09-11 인증 카드는 인증 마크 · 인증명 · 원본 이미지만 남긴다. 상세와 읽는 조건은 /data-certifications 에 있다) */}
      <section className="w-full bg-[var(--color-ivory)]">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          <SectionHeading eyebrow={t('eyebrow')} title={t('title')} body={t('body')} size="hero" />
          <div className="mt-12">
            <CertificationLibrary variant="gallery" />
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
