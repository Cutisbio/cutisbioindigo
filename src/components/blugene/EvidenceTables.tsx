import { getTranslations } from 'next-intl/server';
import SourceNote from '@/components/blugene/SourceNote';
import { SOURCE_AS_OF, anilineTest, carbonTest, marketSamples } from '@/data/blugene/evidence';
import type { IndigoType, MarketSample, Measurement } from '@/data/blugene/evidence';

/**
 * 데이터 · 인증 페이지의 시험 결과 전체 표.
 *
 * 근거는 제공 카탈로그 두 곳이다.
 *  - 바이오 기반 탄소 (C14): p.3 Table 1-1 — KATRI / ASTM D6866-24a Method B (AMS)
 *  - 아닐린 · N-메틸아닐린: p.5 Table 2-3 — KOTERI / KS K 0734 2019, 방법 검출한계 5 mg/kg
 *
 * 두 시험은 기관 · 시험법 · 보고서 · 일자가 서로 다르므로 하나의 표로 합치지 않고 두 표로 나눈다.
 * 시험기관과 시험법은 표 위 정의 목록에, 샘플마다 다른 성적서 번호와 시험일자는 표 안에 둔다.
 *
 * 불검출은 절대 빈칸이나 0 으로 두지 않는다. t('notDetected') 로 적고,
 * 그것이 "방법 검출한계 미만"이라는 뜻임을 표 위(검출한계)와 표 아래(설명)에서 함께 밝힌다.
 * 회사명은 카탈로그의 익명 표기를 그대로 쓰고, 같은 이름이 두 유형에 등장하므로(Company M)
 * 유형 라벨을 언제나 샘플 라벨과 한 행에서 함께 보여 준다.
 */

/** 카탈로그 표에서 자사 샘플에 해당하는 행. 시각적으로 강조한다. */
const BRAND_SAMPLE_ID = 'bio-cutisbio';

/** 천 단위 구분은 서버·클라이언트가 같은 결과를 내도록 로케일을 고정한다. */
const integerFormat = new Intl.NumberFormat('en-US');

const TH_COL =
  'px-4 py-3 text-[0.78rem] leading-snug font-semibold break-keep text-[var(--color-denim)]';
const TD_CELL = 'px-4 py-3 align-middle';
const TD_META = 'px-4 py-3 align-middle text-[0.8125rem] whitespace-nowrap tabular-nums';

interface TestMetaItem {
  term: string;
  description: string;
}

/** 시험기관 · 시험법 · 검출한계처럼 표 전체에 공통으로 걸리는 조건 */
function TestMetaList({ items }: { items: readonly TestMetaItem[] }) {
  return (
    <dl className="mt-7 grid gap-x-10 gap-y-5 border-t border-[color:var(--color-washed)] pt-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.term}>
          <dt className="text-[0.75rem] font-semibold tracking-[0.08em] break-keep text-[var(--color-denim)]">
            {item.term}
          </dt>
          <dd className="mt-1.5 text-sm leading-relaxed break-keep text-[var(--color-ink)]">
            {item.description}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** 인디고 유형 배지. 자사 샘플만 채운 배지로 대비를 준다. */
function TypeBadge({ label, emphasis }: { label: string; emphasis: boolean }) {
  return (
    <span
      className={`inline-block rounded-md border px-2 py-0.5 text-[0.72rem] font-medium break-keep whitespace-nowrap ${
        emphasis
          ? 'border-[color:var(--color-indigo-deep)] bg-[var(--color-indigo-deep)] text-white'
          : 'border-[color:var(--color-washed)] text-[var(--color-slate-muted)]'
      }`}
    >
      {label}
    </span>
  );
}

/**
 * 유형 셀 + 샘플 행 머리. 두 값을 같은 행에서 함께 읽히게 하고,
 * 스크린리더가 행 머리만 읽을 때에도 'Company M' 이 어느 유형인지 알 수 있게 유형을 함께 넣는다.
 */
function SampleIdentityCells({
  sample,
  typeLabel,
  emphasis,
}: {
  sample: MarketSample;
  typeLabel: string;
  emphasis: boolean;
}) {
  return (
    <>
      <td className={TD_CELL}>
        <TypeBadge label={typeLabel} emphasis={emphasis} />
      </td>
      <th scope="row" className={`${TD_CELL} text-left font-medium break-keep whitespace-nowrap`}>
        <span className="sr-only">{`${typeLabel} `}</span>
        {sample.label}
      </th>
    </>
  );
}

/** 측정값과 불검출을 시각적으로 구분한다. 불검출을 0 으로 바꾸지 않는다. */
function measurementContent(measurement: Measurement, notDetectedLabel: string) {
  if (measurement.status === 'not_detected') {
    return (
      <span className="font-semibold break-keep text-[var(--color-sage-ink)]">
        {notDetectedLabel}
      </span>
    );
  }
  return <span className="tabular-nums">{integerFormat.format(measurement.value)}</span>;
}

/** 자사 샘플 행 강조. 색만으로 구분하지 않도록 유형 배지도 함께 채워진다. */
function rowClassName(emphasis: boolean) {
  return `border-b border-[color:var(--color-washed)] last:border-b-0 ${
    emphasis
      ? 'bg-[var(--color-washed)]/45 font-semibold text-[var(--color-indigo-deep)]'
      : 'text-[var(--color-ink)]'
  }`;
}

/**
 * 바이오 기반 탄소 (C14) 시험 결과 — 카탈로그 p.3 Table 1-1 의 9개 시판 샘플.
 * 98% 는 바이오 기반 탄소 함량이며 인디고 순도나 배출 감축률이 아니다.
 */
export async function CarbonEvidenceTable({ className = '' }: { className?: string }) {
  const t = await getTranslations('DataHub');
  const tCommon = await getTranslations('Common');

  const typeLabels: Record<IndigoType, string> = {
    chemical: t('typeChemical'),
    plant: t('typePlant'),
    bio: t('typeBio'),
  };

  const meta: TestMetaItem[] = [
    { term: t('tableLab'), description: carbonTest.lab },
    { term: t('tableMethod'), description: carbonTest.method },
  ];

  return (
    <section aria-labelledby="evidence-carbon-heading" className={className}>
      <h2
        id="evidence-carbon-heading"
        className="text-[1.5rem] leading-[1.25] font-bold tracking-[-0.02em] break-keep text-[var(--color-indigo-deep)] sm:text-[1.875rem]"
      >
        {t('carbonSectionTitle')}
      </h2>
      <p className="mt-4 max-w-3xl text-base leading-[1.85] break-keep text-[var(--color-ink)]/85">
        {t('carbonSectionBody')}
      </p>

      <TestMetaList items={meta} />

      {/* 좁은 화면에서 가로로 스크롤되는 영역이므로 키보드 초점을 받을 수 있어야 한다. */}
      <div
        className="table-scroll mt-8 rounded-md border border-[color:var(--color-washed)] bg-white"
        tabIndex={0}
        role="region"
        aria-label={`${t('carbonSectionTitle')}: ${tCommon('scrollableRegion')}`}
      >
        <table className="w-full min-w-[46rem] text-left text-sm">
          <caption className="sr-only">{t('carbonSectionTitle')}</caption>
          <thead>
            <tr className="border-b border-[color:var(--color-washed)] bg-[var(--color-ivory)]">
              <th scope="col" className={TH_COL}>
                {t('tableType')}
              </th>
              <th scope="col" className={TH_COL}>
                {t('tableSample')}
              </th>
              <th scope="col" className={`${TH_COL} text-right`}>
                {t('tablePmc')}
              </th>
              <th scope="col" className={`${TH_COL} text-right`}>
                {t('tableBiobased')}
              </th>
              <th scope="col" className={TH_COL}>
                {t('tableReport')}
              </th>
              <th scope="col" className={TH_COL}>
                {t('tableReportDate')}
              </th>
            </tr>
          </thead>
          <tbody>
            {marketSamples.map((sample) => {
              const emphasis = sample.id === BRAND_SAMPLE_ID;
              return (
                <tr key={sample.id} className={rowClassName(emphasis)}>
                  <SampleIdentityCells
                    sample={sample}
                    typeLabel={typeLabels[sample.type]}
                    emphasis={emphasis}
                  />
                  <td className={`${TD_CELL} text-right tabular-nums`}>{sample.pmc.toFixed(2)}</td>
                  <td className={`${TD_CELL} text-right tabular-nums`}>
                    {sample.biobasedCarbonPercent}
                  </td>
                  <td className={TD_META}>{sample.carbonReportNumber}</td>
                  <td className={TD_META}>{sample.carbonReportDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 max-w-4xl space-y-2.5">
        <SourceNote>
          {`${tCommon('sourceLabel')}: ${tCommon('cataloguePage', { page: carbonTest.page })} Table ${carbonTest.table} · ${tCommon('asOf', { date: SOURCE_AS_OF })}`}
        </SourceNote>
        <SourceNote>{t('anonymousNote')}</SourceNote>
        <SourceNote>{t('sameLabelNote')}</SourceNote>
        <SourceNote>{t('sampleScopeNote')}</SourceNote>
        {/* 같은 샘플이 카탈로그 Table 1-1 과 Figure 1-3 에서 다르게 표기된 점을 밝힌다. */}
        <SourceNote>{t('carbonZeroNote')}</SourceNote>
      </div>
    </section>
  );
}

/**
 * 아닐린 · N-메틸아닐린 분석 결과 — 카탈로그 p.5 Table 2-3 의 같은 9개 시판 샘플.
 * 불검출 셀은 t('notDetected') 로 적고, 방법 검출한계를 표 위 정의 목록에 함께 밝힌다.
 */
export async function AnilineEvidenceTable({ className = '' }: { className?: string }) {
  const t = await getTranslations('DataHub');
  const tCommon = await getTranslations('Common');

  const typeLabels: Record<IndigoType, string> = {
    chemical: t('typeChemical'),
    plant: t('typePlant'),
    bio: t('typeBio'),
  };
  const notDetectedLabel = t('notDetected');

  const meta: TestMetaItem[] = [
    { term: t('tableLab'), description: anilineTest.lab },
    { term: t('tableMethod'), description: anilineTest.method },
    {
      term: t('tableDetectionLimit'),
      // 단위는 데이터 모듈의 값을 그대로 쓴다 (번역 대상이 아니다).
      description: `${anilineTest.detectionLimitMgKg} ${anilineTest.aniline.unit}`,
    },
  ];

  return (
    <section aria-labelledby="evidence-aniline-heading" className={className}>
      <h2
        id="evidence-aniline-heading"
        className="text-[1.5rem] leading-[1.25] font-bold tracking-[-0.02em] break-keep text-[var(--color-indigo-deep)] sm:text-[1.875rem]"
      >
        {t('anilineSectionTitle')}
      </h2>
      <p className="mt-4 max-w-3xl text-base leading-[1.85] break-keep text-[var(--color-ink)]/85">
        {t('anilineSectionBody')}
      </p>

      <TestMetaList items={meta} />

      {/* 좁은 화면에서 가로로 스크롤되는 영역이므로 키보드 초점을 받을 수 있어야 한다. */}
      <div
        className="table-scroll mt-8 rounded-md border border-[color:var(--color-washed)] bg-white"
        tabIndex={0}
        role="region"
        aria-label={`${t('anilineSectionTitle')}: ${tCommon('scrollableRegion')}`}
      >
        <table className="w-full min-w-[46rem] text-left text-sm">
          <caption className="sr-only">{t('anilineSectionTitle')}</caption>
          <thead>
            <tr className="border-b border-[color:var(--color-washed)] bg-[var(--color-ivory)]">
              <th scope="col" className={TH_COL}>
                {t('tableType')}
              </th>
              <th scope="col" className={TH_COL}>
                {t('tableSample')}
              </th>
              <th scope="col" className={`${TH_COL} text-right`}>
                {t('tableAniline')}
              </th>
              <th scope="col" className={`${TH_COL} text-right`}>
                {t('tableNMethylaniline')}
              </th>
              <th scope="col" className={TH_COL}>
                {t('tableReport')}
              </th>
              <th scope="col" className={TH_COL}>
                {t('tableReportDate')}
              </th>
            </tr>
          </thead>
          <tbody>
            {marketSamples.map((sample) => {
              const emphasis = sample.id === BRAND_SAMPLE_ID;
              return (
                <tr key={sample.id} className={rowClassName(emphasis)}>
                  <SampleIdentityCells
                    sample={sample}
                    typeLabel={typeLabels[sample.type]}
                    emphasis={emphasis}
                  />
                  <td className={`${TD_CELL} text-right`}>
                    {measurementContent(sample.aniline, notDetectedLabel)}
                  </td>
                  <td className={`${TD_CELL} text-right`}>
                    {measurementContent(sample.nMethylaniline, notDetectedLabel)}
                  </td>
                  <td className={TD_META}>{sample.anilineReportNumber}</td>
                  <td className={TD_META}>{sample.anilineReportDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 max-w-4xl space-y-2.5">
        <SourceNote>
          {`${tCommon('sourceLabel')}: ${tCommon('cataloguePage', { page: anilineTest.page })} Table ${anilineTest.table} · ${tCommon('asOf', { date: SOURCE_AS_OF })}`}
        </SourceNote>
        <SourceNote>{t('anonymousNote')}</SourceNote>
        <SourceNote>{t('sameLabelNote')}</SourceNote>
        <SourceNote>{t('sampleScopeNote')}</SourceNote>
        <SourceNote>{t('notDetectedExplain')}</SourceNote>
      </div>
    </section>
  );
}

/** 두 시험 표를 세로로 배치한다. 페이지가 이미 폭·여백 컨테이너를 갖고 있으므로 여기서는 리듬만 준다. */
export default function EvidenceTables({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <CarbonEvidenceTable />
      <AnilineEvidenceTable className="mt-14 border-t border-[color:var(--color-washed)] pt-14 sm:mt-16 sm:pt-16" />
    </div>
  );
}
