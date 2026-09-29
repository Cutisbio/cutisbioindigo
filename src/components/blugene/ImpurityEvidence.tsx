import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import SectionHeading, { keepLastWords } from '@/components/blugene/SectionHeading';
import SourceNote from '@/components/blugene/SourceNote';
import ComparisonChart, {
  type ChartRow,
  type ChartSeries,
} from '@/components/blugene/ComparisonChart';
import {
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
 * - 큰 숫자 카드 대신 하나의 강조 블록 안에 두 항목을 나란히 세우고, 두 항목이 공유하는
 *   시험 조건은 그 아래에 한 번만 둔다(항목마다 블록을 두면 같은 4행이 두 번 반복된다).
 * - 시판 9개 샘플 비교는 ComparisonChart 의 그래프만 보여 준다. 표 · 캡션 · 각주(익명 표기 · Company M ·
 *   표본 범위 · 출처)는 2026-09-29 고객 요청으로 홈에서 뺐다 — 데이터 · 인증 페이지에 그대로 있다.
 *   표는 그래프의 텍스트 대안으로 sr-only 로만 남는다(ComparisonChart showTable={false}).
 *   원본 그래프 이미지(Figure 2-2)는 2026-09-29 고객 요청으로 홈에서 뺐다 — 데이터 · 인증 페이지의
 *   원본 도판 묶음(/data-certifications#test-results)에서 본다.
 */
export default async function ImpurityEvidence() {
  const t = await getTranslations('Impurity');
  const tHub = await getTranslations('DataHub');

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

  /** 한 강조 블록 안에 나란히 세우는 두 항목 — 항목명과 그 항목의 실제 시험 결과 */
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
              title={<span id="impurity-heading">{keepLastWords(t('title'))}</span>}
              body={t('body')}
              size="hero"
            />
            <p className="mt-6 max-w-2xl text-[0.95rem] leading-[1.9] break-keep text-[var(--color-slate-muted)]">
              {t('context')}
            </p>
          </div>

          {/*
            강조 블록 하나 — 큰 숫자 카드가 아니라, 결과와 조건을 한 덩어리로 읽게 한다.
            두 항목은 같은 시험(같은 시험기관 · 시험법 · 성적서 번호 · 시험일자)의 결과이므로
            블록을 항목마다 하나씩 두면 그 4행이 글자 하나 다르지 않게 두 번 렌더된다.
            결과만 나란히 세우고 시험 조건은 카드 아래에 한 번만 둔다.
          */}
          <div className="space-y-4">
            <div className="border-l-[3px] border-[color:var(--color-indigo-deep)] bg-white px-5 py-5 sm:px-6 sm:py-6">
              <dl className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                {highlights.map((item) => (
                  <div key={item.key}>
                    <dt className="text-sm font-medium break-keep text-[var(--color-slate-muted)]">
                      {item.label}
                    </dt>
                    <dd className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-2xl font-bold tracking-[-0.01em] text-[var(--color-indigo-deep)] sm:text-[1.75rem]">
                        {tHub('notDetected')}
                      </span>
                      <span className="text-base font-semibold text-[var(--color-denim)]">
                        {readMeasurement(item.result)}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>

              {/* 위 두 결과가 공유하는 시험 조건 — 검출한계 · 시험법 · 시험기관 · 성적서 번호와 시험일자 */}
              <dl className="mt-5 space-y-1.5 border-t border-[color:var(--color-washed)] pt-4 text-[0.8125rem] leading-relaxed break-keep text-[var(--color-slate-muted)]">
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

            <SourceNote className="border-l-[3px] border-[color:var(--color-washed)] pl-4">
              {tHub('notDetectedExplain')}
            </SourceNote>
          </div>
        </div>

        {/* 시판 9개 샘플 비교 — 그래프만 보인다. 표는 sr-only 텍스트 대안으로만 남는다(2026-09-29 고객 요청). */}
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
            showTable={false}
          />
        </div>

        {/* 각주(익명 표기 · Company M · 표본 범위 · 출처)와 원본 그래프 이미지는 2026-09-29 고객 요청으로 홈에서 뺐다.
            데이터 · 인증 페이지에 그대로 있다. 이 링크는 홈에서 전체 비교 데이터로 가는 유일한 길이라 남긴다. */}
        <div className="mt-10">
          <Link
            href="/data-certifications"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-denim)] underline underline-offset-4 hover:text-[var(--color-indigo-deep)]"
          >
            {t('cta')}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
