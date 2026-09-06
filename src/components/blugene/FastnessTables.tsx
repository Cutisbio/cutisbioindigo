import { getTranslations } from 'next-intl/server';
import SectionHeading from '@/components/blugene/SectionHeading';
import SourceNote, { AssetKind } from '@/components/blugene/SourceNote';
import ZoomableImage from '@/components/blugene/ZoomableImage';
import {
  fabricSamples,
  fastnessSourceImage,
  fastnessTables,
  type FastnessRow,
  type FastnessTable,
  type Fiber,
  type IndigoType,
} from '@/data/blugene/fastness';

/**
 * 견뢰도 시험 결과 표 (카탈로그 p.6 Table 3-1 ~ 3-4).
 *
 * 근거: `@/data/blugene/fastness.ts` 의 `fastnessTables` — 세탁 · 일광 · 마찰 · 땀 견뢰도.
 * 샘플 대응(#1~#9)은 같은 모듈의 `fabricSamples`(Figure 3-1)를 따른다.
 *
 * 표기 원칙
 * - 등급은 **문자열 그대로** 출력한다. '4-5' 를 4.5 로 환산하지 않는다.
 * - 낮은 등급(#6 건마찰 1 · 2, #9 건마찰 2 · 2-3, #8 알칼리 땀 색변화 3 등)을 숨기거나 반올림하지 않는다.
 *   4 미만 등급에는 글자 굵기만 더해 눈에 띄게 하고, 값 자체는 손대지 않는다.
 * - 경사/위사, 산성/알칼리성 구분은 2단 열 머리글(colSpan + scope)로 유지하며 평균 내지 않는다.
 * - 표 번호 · 시험법 · 샘플 번호는 데이터 모듈의 원문이므로 번역하지 않는다.
 */

/** 'colorChange' → 'ColorChange' (메시지 키 접미사 생성용) */
function pascal(key: string): string {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

/** 4 미만 등급인지 — 표시 강조에만 쓰고 값 문자열은 바꾸지 않는다. */
function isLowGrade(value: string): boolean {
  const first = Number.parseFloat(value);
  return Number.isFinite(first) && first < 4;
}

/**
 * 같은 group 이 연속되는 구간의 시작 행에 rowSpan 값을, 나머지 행에는 0 을 담아 돌려준다.
 * (예: 색 변화 1행 + 오염 6행 → [1, 6, 0, 0, 0, 0, 0])
 */
function groupRowSpans(rows: FastnessRow[]): number[] {
  const spans = new Array<number>(rows.length).fill(0);
  let start = 0;
  while (start < rows.length) {
    let end = start;
    while (end + 1 < rows.length && rows[end + 1].group === rows[start].group) end += 1;
    spans[start] = end - start + 1;
    start = end + 1;
  }
  return spans;
}

/** 샘플 그룹 순서 — 카탈로그 Figure 3-1 과 동일 (#1-3 식물성 / #4-6 화학 / #7-9 바이오) */
const INDIGO_ORDER: readonly IndigoType[] = ['plant', 'chemical', 'bio'];

const INDIGO_LABEL_KEY: Record<IndigoType, string> = {
  plant: 'sampleLegendPlant',
  chemical: 'sampleLegendChemical',
  bio: 'sampleLegendBio',
};

const FIBER_LABEL_KEY: Record<Fiber, string> = {
  cotton: 'fiberCotton',
  silk: 'fiberSilk',
  cashmere: 'fiberCashmere',
};

/** 샘플 그룹을 열 배경으로 구분한다. 색은 토큰만 쓰고 넓은 면에 sage 를 깔지 않는다. */
const GROUP_STYLE: Record<IndigoType, { head: string; cell: string }> = {
  plant: { head: 'bg-white text-[var(--color-indigo-deep)]', cell: 'bg-white' },
  chemical: {
    head: 'bg-[var(--color-ivory)] text-[var(--color-indigo-deep)]',
    cell: 'bg-[var(--color-ivory)]/70',
  },
  bio: {
    head: 'bg-[var(--color-sage)]/18 text-[var(--color-sage-ink)]',
    cell: 'bg-[var(--color-sage)]/8',
  },
};

const CELL_BORDER = 'border border-[color:var(--color-washed)]';

/**
 * 샘플 그룹(식물성 · 화학 · 바이오)이 바뀌는 첫 열에만 굵은 세로선을 넣는다.
 * 그룹당 샘플 수를 상수로 가정하지 않고 `fabricSamples` 의 인디고 종류 변화로 판단한다.
 */
function boundaryClass(sampleIndex: number, subIndex: number): string {
  if (subIndex > 0) return '';
  const isGroupStart =
    sampleIndex === 0 || fabricSamples[sampleIndex].indigo !== fabricSamples[sampleIndex - 1].indigo;
  return isGroupStart ? 'border-l-2 border-l-[color:var(--color-denim)]' : '';
}

export default async function FastnessTables({
  variant = 'section',
}: {
  /** 'section' 이면 배경·여백을 가진 독립 섹션, 'bare' 면 내부 콘텐츠만 반환한다 */
  variant?: 'section' | 'bare';
}) {
  const t = await getTranslations('Fastness');
  const tp = await getTranslations('Performance');
  const tc = await getTranslations('Common');

  const content = (
    <>
      <SectionHeading eyebrow={tp('eyebrow')} title={t('title')} body={t('intro')} />

      {/* 샘플 대응 안내 — 어떤 번호가 어떤 인디고 · 섬유인지 표를 보기 전에 밝힌다 */}
      <dl className="mt-10 grid gap-x-8 gap-y-4 border-t border-[color:var(--color-washed)] pt-6 sm:grid-cols-3">
        {INDIGO_ORDER.map((type) => {
          const samples = fabricSamples.filter((sample) => sample.indigo === type);
          return (
            <div key={type} className="flex flex-col gap-1.5">
              <dt className="flex items-center gap-2 text-sm font-semibold break-keep text-[var(--color-indigo-deep)]">
                <span
                  aria-hidden="true"
                  className={`h-2.5 w-2.5 rounded-sm border border-[color:var(--color-washed)] ${GROUP_STYLE[type].head}`}
                />
                {tp(INDIGO_LABEL_KEY[type])}
              </dt>
              <dd className="text-sm leading-relaxed break-keep text-[var(--color-slate-muted)]">
                {samples.map((sample, index) => (
                  <span key={sample.id}>
                    {index > 0 && <span aria-hidden="true"> · </span>}
                    <span className="font-medium text-[var(--color-ink)]">#{sample.id}</span>{' '}
                    {tp(FIBER_LABEL_KEY[sample.fiber])}
                  </span>
                ))}
              </dd>
            </div>
          );
        })}
      </dl>

      {/* 4개 표 — 표마다 시험법이 다르므로 하나로 합치지 않는다 */}
      <div className="mt-12 space-y-14">
        {fastnessTables.map((table) => {
          // 캡션은 표 이름이자 가로 스크롤 영역의 이름으로도 쓰이므로 한 번만 만든다.
          const caption = t(`caption${pascal(table.key)}`);
          return (
            <FastnessTableBlock
              key={table.key}
              table={table}
              caption={caption}
              scrollLabel={`${caption} — ${tc('scrollableRegion')}`}
              heading={t(`table${pascal(table.key)}`)}
              itemHeader={t('itemHeader')}
              sampleHeader={t('sampleHeader')}
              methodLabel={t('methodLabel')}
              groupLabels={{ change: t('groupChange'), stain: t('groupStain') }}
              rowLabels={Object.fromEntries(
                table.rows.map((row) => [row.key, t(`row${pascal(row.key)}`)]),
              )}
              subLabels={Object.fromEntries(
                (table.subColumns ?? []).map((sub) => [sub, t(`sub${pascal(sub)}`)]),
              )}
              indigoLabels={{
                plant: tp(INDIGO_LABEL_KEY.plant),
                chemical: tp(INDIGO_LABEL_KEY.chemical),
                bio: tp(INDIGO_LABEL_KEY.bio),
              }}
            />
          );
        })}
      </div>

      {/* 등급 읽는 법 · 낮은 등급에 대한 설명 · 원본 표 이미지 */}
      <div className="mt-14 grid gap-8 border-t border-[color:var(--color-washed)] pt-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
        <div className="space-y-3">
          <SourceNote>{t('gradeNote')}</SourceNote>
          <SourceNote>{tp('honestNote')}</SourceNote>
        </div>

        <figure className="m-0">
          <div className="mb-2">
            <AssetKind>{tc('testPhoto')}</AssetKind>
          </div>
          <ZoomableImage
            src={fastnessSourceImage}
            alt={t('sourceImageAlt')}
            width={1198}
            height={943}
            openLabel={t('sourceImageCta')}
            closeLabel={tc('close')}
            hint={tc('imageNotePhoto')}
            sizes="(max-width: 1024px) 90vw, 320px"
          />
        </figure>
      </div>
    </>
  );

  // 'bare' 는 페이지가 이미 같은 컨테이너로 감싼 경우 — 배경·여백을 다시 두르지 않는다.
  if (variant === 'bare') {
    return content;
  }

  return (
    <section aria-label={t('title')} className="bg-white">
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        {content}
      </div>
    </section>
  );
}

/**
 * 표 하나. 서버 컴포넌트이므로 번역 문자열은 부모에서 모두 해결해 전달받는다.
 * (표 안에서 t() 를 다시 호출하지 않아 키 누락을 컴파일 지점 하나로 모은다.)
 */
function FastnessTableBlock({
  table,
  caption,
  scrollLabel,
  heading,
  itemHeader,
  sampleHeader,
  methodLabel,
  groupLabels,
  rowLabels,
  subLabels,
  indigoLabels,
}: {
  table: FastnessTable;
  caption: string;
  /** 가로 스크롤 영역의 접근성 이름 (캡션 + 스크롤 안내) */
  scrollLabel: string;
  heading: string;
  itemHeader: string;
  sampleHeader: string;
  methodLabel: string;
  groupLabels: Record<FastnessRow['group'], string>;
  rowLabels: Record<string, string>;
  subLabels: Record<string, string>;
  indigoLabels: Record<IndigoType, string>;
}) {
  const subColumns = table.subColumns;
  const subCount = subColumns ? subColumns.length : 1;
  const headerRowCount = subColumns ? 3 : 2;
  const spans = groupRowSpans(table.rows);
  // 행이 하나뿐인 표(일광)는 그룹 열이 행 머리글과 같은 말을 반복하므로 생략한다.
  const showGroupColumn = table.rows.length > 1;
  const leadColSpan = showGroupColumn ? 2 : 1;
  const minWidth = subCount > 1 ? 'min-w-[68rem]' : 'min-w-[44rem]';

  return (
    <article>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="rounded border border-[color:var(--color-washed)] bg-[var(--color-ivory)] px-2 py-0.5 text-[0.75rem] font-semibold tracking-wide text-[var(--color-denim)]">
          {table.table}
        </span>
        <h3 className="text-lg font-bold break-keep text-[var(--color-indigo-deep)] sm:text-xl">
          {heading}
        </h3>
      </div>
      <p className="mt-1.5 text-[0.8125rem] leading-relaxed break-keep text-[var(--color-slate-muted)]">
        {methodLabel}
        <span aria-hidden="true"> · </span>
        <span className="text-[var(--color-ink)]">{table.method}</span>
      </p>

      {/* 좁은 화면에서 가로로 스크롤되는 영역 — 마우스가 없어도 초점을 받아 스크롤할 수 있게 한다 */}
      <div
        role="region"
        aria-label={scrollLabel}
        tabIndex={0}
        className="table-scroll mt-4 border border-[color:var(--color-washed)]"
      >
        <table className={`w-full ${minWidth} text-sm`}>
          {/* 표 전체를 설명하는 캡션. 화면에는 위의 제목 · 시험법이 같은 내용을 보여준다. */}
          <caption className="sr-only">
            {caption} — {methodLabel} {table.method}
          </caption>

          <thead>
            {/* 1단: 샘플 그룹 (식물성 / 화학 / 바이오) */}
            <tr>
              <th
                scope="col"
                rowSpan={headerRowCount}
                colSpan={leadColSpan}
                className={`${CELL_BORDER} bg-[var(--color-indigo-deep)] px-3 py-2 text-left align-bottom text-sm font-semibold break-keep text-white`}
              >
                {itemHeader}
              </th>
              {INDIGO_ORDER.map((type) => {
                const count = fabricSamples.filter((sample) => sample.indigo === type).length;
                return (
                  <th
                    key={type}
                    scope="col"
                    colSpan={count * subCount}
                    className={`${CELL_BORDER} border-l-2 border-l-[color:var(--color-denim)] px-2 py-2 text-center text-[0.8125rem] font-semibold break-keep ${GROUP_STYLE[type].head}`}
                  >
                    {indigoLabels[type]}
                  </th>
                );
              })}
            </tr>

            {/* 2단: 샘플 번호 */}
            <tr>
              {fabricSamples.map((sample, sampleIndex) => (
                <th
                  key={sample.id}
                  scope="col"
                  colSpan={subCount}
                  className={`${CELL_BORDER} ${boundaryClass(sampleIndex, 0)} ${GROUP_STYLE[sample.indigo].head} px-2 py-1.5 text-center text-sm font-semibold`}
                >
                  <span className="sr-only">{sampleHeader} </span>#{sample.id}
                </th>
              ))}
            </tr>

            {/* 3단: 하위 구분 (경사/위사 · 산성/알칼리성) — 있는 표에만 나온다 */}
            {subColumns && (
              <tr>
                {fabricSamples.map((sample, sampleIndex) =>
                  subColumns.map((sub, subIndex) => (
                    <th
                      key={`${sample.id}-${sub}`}
                      scope="col"
                      className={`${CELL_BORDER} ${boundaryClass(sampleIndex, subIndex)} ${GROUP_STYLE[sample.indigo].head} px-1.5 py-1.5 text-center text-xs font-medium break-keep`}
                    >
                      {subLabels[sub]}
                    </th>
                  )),
                )}
              </tr>
            )}
          </thead>

          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={row.key}>
                {showGroupColumn && spans[rowIndex] > 0 && (
                  <th
                    scope="row"
                    rowSpan={spans[rowIndex]}
                    className={`${CELL_BORDER} bg-[var(--color-ivory)] px-2 py-1.5 text-center align-middle text-[0.8125rem] font-semibold break-keep text-[var(--color-denim)]`}
                  >
                    {groupLabels[row.group]}
                  </th>
                )}
                <th
                  scope="row"
                  className={`${CELL_BORDER} bg-white px-3 py-1.5 text-left text-sm font-medium whitespace-nowrap text-[var(--color-ink)]`}
                >
                  {rowLabels[row.key]}
                </th>

                {fabricSamples.map((sample, sampleIndex) =>
                  Array.from({ length: subCount }, (_, subIndex) => {
                    // 등급 문자열은 데이터 그대로 출력한다. 숫자로 변환하지 않는다.
                    const grade = row.values[sampleIndex * subCount + subIndex];
                    return (
                      <td
                        key={`${sample.id}-${subIndex}`}
                        className={`${CELL_BORDER} ${boundaryClass(sampleIndex, subIndex)} ${GROUP_STYLE[sample.indigo].cell} px-2 py-1.5 text-center text-sm ${
                          isLowGrade(grade)
                            ? 'font-bold text-[var(--color-indigo-deep)]'
                            : 'text-[var(--color-ink)]'
                        }`}
                      >
                        {grade}
                      </td>
                    );
                  }),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
