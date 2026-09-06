import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import SectionHeading from '@/components/blugene/SectionHeading';
import SourceNote, { AssetKind } from '@/components/blugene/SourceNote';
import ZoomableImage from '@/components/blugene/ZoomableImage';
import ComparisonChart, {
  type ChartRow,
  type ChartSeries,
} from '@/components/blugene/ComparisonChart';
import {
  SOURCE_AS_OF,
  anilineChartMax,
  anilineTest,
  marketSamples,
  type IndigoType,
  type Measurement,
} from '@/data/blugene/evidence';

/**
 * 홈 — "보이지 않는 것까지, 우리의 기준입니다." (불순물 근거 섹션)
 *
 * 근거: 제공 카탈로그 p.5 Table 2-3 · Figure 2-2 (KOTERI, KS K 0734 2019).
 * - 아닐린 · N-메틸아닐린은 **불검출(N.D.)** 이다. 숫자 0 으로 바꾸지 않고,
 *   방법 검출한계(5 mg/kg)와 시험법 · 시험기관 · 보고서 번호를 같은 블록 안에서 함께 밝힌다.
 * - 큰 숫자 카드 대신 두 개의 강조 블록으로 두 항목을 나란히 세운다.
 * - 시판 9개 샘플 비교는 ComparisonChart 가 그래프와 표를 함께 제공하고,
 *   원본 그래프 이미지(Figure 2-2)는 ZoomableImage 로 확인할 수 있게 둔다.
 */
export default async function ImpurityEvidence() {
  const t = await getTranslations('Impurity');
  const tHub = await getTranslations('DataHub');
  const tCommon = await getTranslations('Common');

  /** 인디고 유형 라벨 — Company M 은 화학 · 식물 두 유형에 모두 등장하므로 항상 함께 표시한다. */
  const typeLabel: Record<IndigoType, string> = {
    chemical: tHub('typeChemical'),
    plant: tHub('typePlant'),
    bio: tHub('typeBio'),
  };

  /** 불검출은 기호(N.D.)로, 측정값은 값 + 단위로 적는다. 0 으로 바꾸지 않는다. */
  const readMeasurement = (m: Measurement): string =>
    m.status === 'not_detected' ? tHub('notDetectedShort') : `${m.value} ${m.unit}`;

  /** 계열 색은 디자인 토큰을 그대로 참조한다(하드코딩한 헥사값을 쓰지 않는다). */
  const series: ChartSeries[] = [
    { key: 'aniline', label: tHub('tableAniline'), color: 'var(--color-indigo-deep)' },
    { key: 'nMethylaniline', label: tHub('tableNMethylaniline'), color: 'var(--color-denim)' },
  ];

  const rows: ChartRow[] = marketSamples.map((sample) => ({
    id: sample.id,
    label: sample.label,
    groupLabel: typeLabel[sample.type],
    highlight: sample.id === 'bio-cutisbio',
    values: {
      aniline: sample.aniline,
      nMethylaniline: sample.nMethylaniline,
    },
  }));

  /** 두 강조 블록 — 항목명과 그 항목의 실제 시험 결과 */
  const highlights: { key: string; label: string; result: Measurement }[] = [
    { key: 'aniline', label: tHub('tableAniline'), result: anilineTest.aniline },
    { key: 'nMethylaniline', label: tHub('tableNMethylaniline'), result: anilineTest.nMethylaniline },
  ];

  const detectionLimit = `${anilineTest.detectionLimitMgKg} ${anilineTest.aniline.unit}`;

  return (
    <section
      aria-labelledby="impurity-heading"
      className="w-full bg-[var(--color-ivory)] py-16 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:items-start lg:gap-16">
          <div>
            <SectionHeading
              eyebrow={t('eyebrow')}
              title={<span id="impurity-heading">{t('title')}</span>}
              body={t('body')}
              size="lg"
            />
            <p className="mt-6 max-w-2xl text-[0.95rem] leading-[1.9] break-keep text-[var(--color-slate-muted)]">
              {t('context')}
            </p>
          </div>

          {/* 두 개의 강조 블록 — 큰 숫자 카드가 아니라, 결과와 조건을 한 덩어리로 읽게 한다 */}
          <div className="space-y-4">
            {highlights.map((item) => (
              <div
                key={item.key}
                className="border-l-[3px] border-[color:var(--color-indigo-deep)] bg-white px-5 py-5 sm:px-6 sm:py-6"
              >
                <p className="text-sm font-medium break-keep text-[var(--color-slate-muted)]">
                  {item.label}
                </p>
                <p className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-2xl font-bold tracking-[-0.01em] text-[var(--color-indigo-deep)] sm:text-[1.75rem]">
                    {tHub('notDetected')}
                  </span>
                  <span className="text-base font-semibold text-[var(--color-denim)]">
                    {readMeasurement(item.result)}
                  </span>
                </p>

                <dl className="mt-4 space-y-1.5 border-t border-[color:var(--color-washed)] pt-4 text-[0.8125rem] leading-relaxed break-keep text-[var(--color-slate-muted)]">
                  <div className="flex gap-2">
                    <dt className="shrink-0 font-medium">{tHub('tableDetectionLimit')}</dt>
                    <dd>{detectionLimit}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="shrink-0 font-medium">{tHub('tableMethod')}</dt>
                    <dd>{anilineTest.method}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="shrink-0 font-medium">{tHub('tableLab')}</dt>
                    <dd>{anilineTest.lab}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="shrink-0 font-medium">{tHub('tableReport')}</dt>
                    <dd>
                      {anilineTest.reportNumber}
                      <span className="ml-2 whitespace-nowrap">
                        ({tHub('tableReportDate')} {anilineTest.reportDate})
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            ))}

            <SourceNote className="border-l-[3px] border-[color:var(--color-washed)] pl-4">
              {tHub('notDetectedExplain')}
            </SourceNote>
          </div>
        </div>

        {/* 시판 9개 샘플 비교 — 그래프와 표를 같이 제공한다 (JS 없이도 표로 읽힌다) */}
        <div className="mt-14 border-t border-[color:var(--color-washed)] pt-10 sm:mt-16 lg:mt-20">
          <ComparisonChart
            title={t('chartTitle')}
            axisLabel={tHub('chartAnilineTitle')}
            max={anilineChartMax}
            series={series}
            rows={rows}
            notDetectedLabel={tHub('notDetected')}
            notDetectedShort={tHub('notDetectedShort')}
            notDetectedExplain={tHub('notDetectedExplain')}
            tableCaption={t('chartTitle')}
            sampleHeader={tHub('tableSample')}
            groupHeader={tHub('tableType')}
            accessibleNote={tHub('chartAccessibleNote')}
            caption={t('chartCaption')}
          />
        </div>

        {/* 원본 그래프 이미지와 인용 조건 */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start lg:gap-12">
          <div className="space-y-2.5">
            <SourceNote>{tHub('anonymousNote')}</SourceNote>
            <SourceNote>{tHub('sameLabelNote')}</SourceNote>
            <SourceNote>{tHub('sampleScopeNote')}</SourceNote>
            <SourceNote>
              {tCommon('sourceLabel')} · {tCommon('cataloguePage', { page: anilineTest.page })}{' '}
              Table {anilineTest.table} · Figure {anilineTest.figure} ·{' '}
              {tCommon('asOf', { date: SOURCE_AS_OF })}
            </SourceNote>

            <div className="pt-4">
              <Link
                href="/data-certifications"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-denim)] underline underline-offset-4 hover:text-[var(--color-indigo-deep)]"
              >
                {t('cta')}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <figure className="m-0">
            <figcaption className="mb-2.5 flex flex-wrap items-center gap-2">
              <AssetKind>{tCommon('testPhoto')}</AssetKind>
              <span className="text-[0.8125rem] break-keep text-[var(--color-slate-muted)]">
                {tCommon('cataloguePage', { page: anilineTest.page })} Figure {anilineTest.figure}
              </span>
            </figcaption>
            <ZoomableImage
              src={anilineTest.resultsImage}
              alt={t('chartTitle')}
              width={1163}
              height={1545}
              sizes="(max-width: 1024px) 90vw, 352px"
              openLabel={tCommon('openImage')}
              closeLabel={tCommon('close')}
              hint={tCommon('imageNotePhoto')}
              caption={tCommon('imageNotePhoto')}
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
