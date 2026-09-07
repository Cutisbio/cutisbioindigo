import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import SectionHeading from '@/components/blugene/SectionHeading';
import SourceNote from '@/components/blugene/SourceNote';
import EvidenceTables from '@/components/blugene/EvidenceTables';
import CertificationLibrary from '@/components/blugene/CertificationLibrary';
import CatalogueViewer from '@/components/blugene/CatalogueViewer';
import ZoomableImage from '@/components/blugene/ZoomableImage';
import { LOCALES, buildPageMetadata } from '@/data/blugene/site';
import { anilineTest, carbonTest } from '@/data/blugene/evidence';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/**
 * 인증서의 문서상 유효기간이 지났는지 판단하려면 현재 날짜가 필요하다.
 * 하루에 한 번 다시 생성해, 만료된 문서를 계속 '유효'로 렌더링하지 않게 한다.
 */
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'DataHub' });
  return buildPageMetadata({
    locale,
    path: '/data-certifications',
    title: t('title'),
    description: t('body'),
  });
}

export default async function DataCertificationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'DataHub' });
  const tCommon = await getTranslations({ locale, namespace: 'Common' });

  return (
    <>
      <section className="w-full border-b border-[color:var(--color-washed)] bg-[var(--color-ivory)]">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <SectionHeading
            headingLevel="h1"
            eyebrow={t('eyebrow')}
            title={t('title')}
            body={t('body')}
            size="hero"
          />
          {/* '원본 카탈로그 4쪽' 이 글자로만 있고 링크가 아니어서, 원문을 대조하려는 독자가
              11,000px 을 스크롤해 내려가야 했다. 앵커(#catalogue)는 이미 있었다. */}
          <SourceNote className="mt-8 max-w-3xl">
            {t.rich('regulatoryOmitted', {
              link: (chunks) => (
                <a
                  href="#catalogue"
                  className="font-semibold text-[var(--color-denim)] underline underline-offset-2 hover:text-[var(--color-indigo-deep)]"
                >
                  {chunks}
                </a>
              ),
            })}
          </SourceNote>
        </div>
      </section>

      {/* 시험 결과 전체 표 */}
      <section id="test-results" className="w-full bg-white scroll-mt-24">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <EvidenceTables />

          {/* 카탈로그 원본 그래프 · 표 이미지 */}
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            <ZoomableImage
              src={carbonTest.chartImage}
              alt={`${t('chartCarbonTitle')} — ${tCommon('cataloguePage', { page: carbonTest.page })}`}
              width={1116}
              height={681}
              sizes="(max-width: 1024px) 92vw, 380px"
              openLabel={tCommon('openImage')}
              closeLabel={tCommon('close')}
              caption={`${tCommon('sourceLabel')}: ${tCommon('cataloguePage', { page: carbonTest.page })} Figure ${carbonTest.figure}`}
            />
            <ZoomableImage
              src={carbonTest.tableImage}
              alt={`${t('carbonSectionTitle')} — ${tCommon('cataloguePage', { page: carbonTest.page })} Table ${carbonTest.table}`}
              width={1151}
              height={756}
              sizes="(max-width: 1024px) 92vw, 380px"
              openLabel={tCommon('openImage')}
              closeLabel={tCommon('close')}
              caption={`${tCommon('sourceLabel')}: ${tCommon('cataloguePage', { page: carbonTest.page })} Table ${carbonTest.table}`}
            />
            <ZoomableImage
              src={anilineTest.resultsImage}
              alt={`${t('anilineSectionTitle')} — ${tCommon('cataloguePage', { page: anilineTest.page })}`}
              width={1163}
              height={1545}
              sizes="(max-width: 1024px) 92vw, 380px"
              openLabel={tCommon('openImage')}
              closeLabel={tCommon('close')}
              caption={`${tCommon('sourceLabel')}: ${tCommon('cataloguePage', { page: anilineTest.page })} Figure ${anilineTest.figure} · Table ${anilineTest.table}`}
            />
          </div>
        </div>
      </section>

      {/* 인증 */}
      <section id="certifications" className="w-full bg-[var(--color-ivory)] scroll-mt-24">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <CertificationLibrary />
        </div>
      </section>

      {/* 원본 카탈로그 */}
      <section id="catalogue" className="w-full bg-white scroll-mt-24">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <CatalogueViewer />
        </div>
      </section>
    </>
  );
}
