import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import SectionHeading from '@/components/blugene/SectionHeading';
import SourceNote from '@/components/blugene/SourceNote';
import BrandManifesto from '@/components/blugene/BrandManifesto';
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
  const tNav = await getTranslations({ locale, namespace: 'Nav' });
  const promises = t.raw('promiseItems') as { title: string; text: string }[];

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

      {/* 우리가 약속하는 것 / 말하지 않는 것 */}
      <section className="w-full bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          <SectionHeading title={t('promiseTitle')} body={t('promiseBody')} size="hero" />

          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {promises.map((item, i) => (
              <li key={item.title} className="border-t-2 border-[var(--color-denim)] pt-5">
                <span className="text-sm font-semibold text-[var(--color-denim)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 text-lg font-semibold break-keep text-[var(--color-indigo-deep)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed break-keep text-[var(--color-ink)]/85">
                  {item.text}
                </p>
              </li>
            ))}
          </ol>

          {/*
            세 번째 약속이 "사이트에서 직접 확인할 수 있습니다" 라고 말하므로, 그 '어디서'를
            바로 옆에서 답한다. 이 링크가 없으면 페이지에서 데이터 · 인증으로 가는 길이 아예 없다.
          */}
          <Link
            href="/data-certifications"
            className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-denim)] underline underline-offset-4 hover:text-[var(--color-indigo-deep)]"
          >
            {tNav('dataCertifications')}
            <span aria-hidden="true">→</span>
          </Link>

          {/* 2026-09-12 고객 요청으로 여기 있던 「우리가 말하지 않는 것」 상자(Brand.limits*)를 뺐다.
              주장하지 않는 범위 자체는 docs/blugene-claims.md 와 check-blugene-data 의 금지어 검사가 계속 지킨다. */}
          {/* 바로 위 데이터 · 인증 링크가 inline-flex 라, 블록으로 감싸지 않으면 문의 버튼이 같은 줄에 붙는다 */}
          <div className="mt-12">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-[var(--color-indigo-deep)] px-7 py-4 text-base font-semibold break-keep text-white transition-colors hover:bg-[var(--color-denim)]"
            >
              {t('cta')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
