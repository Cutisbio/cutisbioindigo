import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import SectionHeading from '@/components/blugene/SectionHeading';
import SourceNote from '@/components/blugene/SourceNote';
import BrandManifesto from '@/components/blugene/BrandManifesto';
import PromiseSection from '@/components/blugene/PromiseSection';
import SdgSection from '@/components/blugene/SdgSection';
import Wordmark from '@/components/blugene/Wordmark';
import { BRAND, LOCALES, buildPageMetadata } from '@/data/blugene/site';
import { productSummary } from '@/data/blugene/evidence';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Brand' });
  return buildPageMetadata({
    locale,
    path: '/brand',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function BrandPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Brand' });

  // 900px 읽기 단 안의 소제목이라 페이지 섹션 제목(SectionHeading size="lg")보다 한 단계 작게 둔다.
  // 같은 문자열이 두 번 나오던 것을 한곳으로 모아 두 제목이 어긋나지 않게 한다.
  const subheading = 'text-2xl font-bold break-keep text-[var(--color-indigo-deep)] sm:text-3xl';

  return (
    <>
      {/*
        페이지 도입부.
        가족 · 데님 사진(카탈로그 p.1)은 홈 히어로가 전면으로 쓰고 있다. 헤더의 '브랜드'를
        눌러 넘어온 독자가 방금 본 사진을 다시 만나지 않도록, 여기서는 카피만 세운다.
      */}
      <section className="w-full border-b border-[color:var(--color-washed)] bg-[var(--color-ivory)]">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <SectionHeading
            headingLevel="h1"
            eyebrow={t('heroEyebrow')}
            // 한국어 제목의 뒷구절 '염료부터 꼼꼼히 확인해야 합니다.' 를 태블릿 이상에서 한 줄로 묶는다
            // (messages/ko.json 의 <keep>…</keep>). 다른 언어는 태그가 없어 그대로 그려진다.
            // 모바일에서는 폭이 모자라 묶지 않는다 — nowrap 이면 화면 밖으로 넘친다.
            title={t.rich('heroTitle', {
              keep: (chunks) => <span className="md:whitespace-nowrap">{chunks}</span>,
            })}
            body={t('heroBody')}
            size="hero"
            titleWidth="wide"
          />
        </div>
      </section>

      {/* 이름에 담은 뜻 */}
      <section className="w-full bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-20">
            <div className="rounded-md border border-[color:var(--color-washed)] bg-[var(--color-ivory)] px-10 py-12">
              <Wordmark size="lg" href={null} />
            </div>
            <div className="max-w-2xl">
              <h2 className={subheading}>{t('nameTitle')}</h2>
              <p className="mt-5 text-base leading-[1.9] break-keep text-[var(--color-ink)]/85 sm:text-lg">
                {t('nameBody')}
              </p>
              {/* '인디고의 DNA를 다시 쓴다'는 비유의 해명문(Brand.nameNote)은 2026-09-12 고객 요청으로 뺐다. */}

              <h2 className={`mt-12 ${subheading}`}>{t('relationTitle')}</h2>
              <p className="mt-5 text-base leading-[1.9] break-keep text-[var(--color-ink)]/85">
                {t('relationBody')}
              </p>
              <SourceNote className="mt-4">
                {BRAND.companyLegal} · {productSummary.catalogueName} · CAS {productSummary.cas}
              </SourceNote>
            </div>
          </div>
        </div>
      </section>

      <BrandManifesto portrait />

      {/* 우리가 약속하는 것 — 홈 상단(히어로 아래)과 같은 블록이다(2026-09-29 부터 PromiseSection 공용).
          2026-09-12 고객 요청으로 뺀 「우리가 말하지 않는 것」 상자(Brand.limits*)의 범위는
          docs/blugene-claims.md 와 check-blugene-data 의 금지어 검사가 계속 지킨다. */}
      <PromiseSection />

      {/* 유엔 SDG 9 · 12 — 2026-09-29 고객 요청으로 「우리가 약속하는 것」 아래에 둔다(필리 구성 참고, 문구는 큐티스바이오 사실). */}
      <SdgSection />
    </>
  );
}
