import type { CSSProperties } from 'react';
import SourceNote from '@/components/blugene/SourceNote';

/**
 * 시판 인디고 비교용 세로 막대 그래프 (순수 프레젠테이션 · 서버 컴포넌트).
 *
 * 근거: 카탈로그 p.3 Table 1-1(바이오 기반 탄소), p.5 Table 2-3(아닐린 · N-메틸아닐린)의
 * 동일한 9개 시판 샘플. 다만 이 컴포넌트는 데이터도 번역도 직접 읽지 않는다.
 * 값 · 라벨 · 문구는 모두 상위 섹션이 props 로 넘긴다.
 *
 * 지켜야 할 규칙
 * - 값 축은 언제나 0 에서 시작하고 눈금값(0, max/4, max/2, 3max/4, max)을 표시한다.
 * - 불검출(N.D.)은 막대를 그리지 않는다. 축 위 0 자리에 짧은 세로 점선 캡과 'N.D.' 표식만 둔다.
 *   실제 측정값 0(예: 바이오 기반 탄소 0%)은 축에 붙은 0 높이 막대로 그려 N.D. 와 구분한다.
 * - 그래프의 모든 값은 아래의 실제 HTML 표에서도 그대로 읽을 수 있어야 한다(sr-only 아님).
 * - 애니메이션 · hover 전용 정보를 쓰지 않는다.
 * - 가로 스크롤 영역(.table-scroll)은 키보드로도 스크롤할 수 있어야 하므로
 *   tabIndex={0} + role="region" + 접근 가능한 이름을 가진다.
 *   이름 문구도 번역 대상이므로 상위 섹션이 scrollRegionLabel 로 넘긴다
 *   (넘기지 않으면 title 을 쓴다).
 */

export type ChartValue = { status: 'measured'; value: number } | { status: 'not_detected' };

export interface ChartSeries {
  key: string;
  label: string;
  color: string;
}

export interface ChartRow {
  id: string;
  label: string;
  groupLabel: string;
  highlight?: boolean;
  values: Record<string, ChartValue>;
}

export interface ComparisonChartProps {
  title: string;
  axisLabel: string;
  max: number;
  series: ChartSeries[];
  rows: ChartRow[];
  notDetectedLabel: string;
  notDetectedShort: string;
  notDetectedExplain: string;
  tableCaption: string;
  sampleHeader: string;
  groupHeader: string;
  accessibleNote: string;
  caption?: string;
  /** 가로 스크롤 영역의 접근 가능한 이름. 없으면 title 을 쓴다. */
  scrollRegionLabel?: string;
}

/* ── 도면 좌표 상수 (viewBox 단위) ───────────────────────────── */
const PAD_LEFT = 80;
const PAD_RIGHT = 28;
const PAD_TOP = 46;
const PLOT_H = 300;
const LABEL_BAND = 46; // 샘플 라벨 두 줄
const GROUP_BAND = 30; // 그룹 라벨
const BAR_W = 26;
const BAR_GAP = 10;
const ROW_GAP = 20;
const GROUP_GAP = 42;
const MIN_ROW_W = 84;
const ND_CAP_H = 20; // 불검출 점선 캡 높이

const BASELINE_Y = PAD_TOP + PLOT_H;
const LABEL_Y = BASELINE_Y + 18;
const SEP_TOP = PAD_TOP - 14;
const SEP_BOTTOM = BASELINE_Y + LABEL_BAND + GROUP_BAND - 4;
const GROUP_LABEL_Y = BASELINE_Y + LABEL_BAND + 20;
const TOTAL_H = PAD_TOP + PLOT_H + LABEL_BAND + GROUP_BAND;

const COLOR = {
  axis: 'var(--color-slate-muted)',
  grid: 'var(--color-washed)',
  ink: 'var(--color-ink)',
  deep: 'var(--color-indigo-deep)',
} as const;

const gridStyle: CSSProperties = { stroke: COLOR.grid };
const axisStyle: CSSProperties = { stroke: COLOR.axis };
const axisTextStyle: CSSProperties = { fill: COLOR.axis };
const inkTextStyle: CSSProperties = { fill: COLOR.ink };
const deepTextStyle: CSSProperties = { fill: COLOR.deep };
const highlightBandStyle: CSSProperties = { fill: COLOR.grid, fillOpacity: 0.42 };
const highlightBarStyle: CSSProperties = { fill: COLOR.deep };

/**
 * 천 단위 구분 기호를 넣는다. 로케일에 의존하지 않도록 직접 처리한다.
 * 측정값은 **반올림하지 않는다.** 데이터 모듈의 값을 그대로 표시한다(예: 97.73 → 97.73).
 */
function formatNumber(value: number): string {
  const [int, frac] = String(value).split('.');
  const withComma = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return frac ? `${withComma}.${frac}` : withComma;
}

/**
 * 눈금값. 축 상한을 4 등분한 **파생값**이므로 부동소수 오차만 정리한다(소수 한 자리).
 * 시험 측정값에는 이 함수를 쓰지 않는다.
 */
function formatTick(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return formatNumber(rounded);
}

/** 긴 샘플 라벨은 마지막 낱말을 아랫줄로 내려 막대 폭 안에 들어오게 한다. */
function splitLabel(label: string): string[] {
  const words = label.trim().split(/\s+/);
  if (words.length < 2 || label.length <= 9) return [label];
  return [words.slice(0, -1).join(' '), words[words.length - 1]];
}

function slug(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'chart';
}

interface PlacedRow {
  row: ChartRow;
  x: number;
  width: number;
}

interface PlacedGroup {
  label: string;
  start: number;
  end: number;
  separatorX: number | null;
}

export default function ComparisonChart({
  title,
  axisLabel,
  max,
  series,
  rows,
  notDetectedLabel,
  notDetectedShort,
  notDetectedExplain,
  tableCaption,
  sampleHeader,
  groupHeader,
  accessibleNote,
  caption,
  scrollRegionLabel,
}: ComparisonChartProps) {
  const safeMax = max > 0 ? max : 1;

  const barsWidth = series.length * BAR_W + Math.max(series.length - 1, 0) * BAR_GAP;
  const rowWidth = Math.max(barsWidth, MIN_ROW_W);

  /* 행 좌표 계산 — 그룹이 바뀌는 자리에 더 넓은 간격과 구분선을 둔다. */
  const placedRows: PlacedRow[] = [];
  const groups: PlacedGroup[] = [];
  let cursor = PAD_LEFT + 12;

  rows.forEach((row, index) => {
    const previous = index > 0 ? rows[index - 1] : undefined;
    const isNewGroup = !previous || previous.groupLabel !== row.groupLabel;
    if (previous) cursor += isNewGroup ? GROUP_GAP : ROW_GAP;

    const x = cursor;
    placedRows.push({ row, x, width: rowWidth });
    cursor += rowWidth;

    if (isNewGroup) {
      groups.push({
        label: row.groupLabel,
        start: x,
        end: x + rowWidth,
        separatorX: previous ? x - GROUP_GAP / 2 : null,
      });
    } else {
      groups[groups.length - 1].end = x + rowWidth;
    }
  });

  const plotRight = cursor + 14;
  const totalWidth = plotRight + PAD_RIGHT;
  /* 그래프를 축소하지 않는다. 760px 로 줄이면 viewBox 가 함께 줄어 눈금·값·샘플 라벨이
     7px 안팎까지 작아져 읽을 수 없다. 좁은 화면에서는 .table-scroll 안에서 가로로 스크롤한다
     (같은 값을 담은 표가 아래에 있으므로 스크롤 없이도 값을 읽을 수 있다). */
  const svgMinWidth = totalWidth;
  const tableMinWidth = 320 + series.length * 120;

  const uid = slug(`cmp-${rows[0]?.id ?? 'row'}-${series.map((s) => s.key).join('-')}`);
  const headingId = `${uid}-heading`;
  const titleId = `${uid}-title`;
  const descId = `${uid}-desc`;
  const tableCaptionId = `${uid}-table-caption`;
  /* 스크롤 영역 이름은 번역 문구(scrollRegionLabel)를 우선하고, 없으면 이미 번역된 title 을 쓴다. */
  const regionLabel = scrollRegionLabel ?? title;

  const ticks = [0, 1, 2, 3, 4].map((step) => {
    const value = (safeMax * step) / 4;
    return { value, y: BASELINE_Y - (step / 4) * PLOT_H };
  });

  return (
    <div className="w-full">
      <h3
        id={headingId}
        className="text-lg font-bold break-keep text-[var(--color-indigo-deep)] sm:text-xl"
      >
        {title}
      </h3>

      {/* 범례 — hover 없이 항상 보이는 텍스트 범례 */}
      <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        {series.map((s) => (
          <li key={s.key} className="flex items-center gap-2 text-[0.8125rem] break-keep">
            <span
              aria-hidden="true"
              className="h-3 w-3 shrink-0 rounded-[2px]"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-[var(--color-ink)]">{s.label}</span>
          </li>
        ))}
        <li className="flex items-center gap-2 text-[0.8125rem] break-keep">
          <svg
            aria-hidden="true"
            focusable="false"
            width="12"
            height="14"
            viewBox="0 0 12 14"
            className="shrink-0"
          >
            <line x1="6" y1="13" x2="6" y2="2" style={axisStyle} strokeWidth="1.5" strokeDasharray="2.5 3" />
            <line x1="2" y1="2" x2="10" y2="2" style={axisStyle} strokeWidth="1.5" />
          </svg>
          <span className="font-semibold text-[var(--color-ink)]">{notDetectedShort}</span>
          <span className="text-[var(--color-slate-muted)]">{notDetectedLabel}</span>
        </li>
      </ul>

      {/* 그래프 — 좁은 화면에서는 가로 스크롤한다. 본문은 넘치지 않는다.
          마우스·터치 없이도 스크롤할 수 있도록 키보드 초점을 받는 이름 있는 영역으로 둔다. */}
      <div
        className="table-scroll mt-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-denim)]"
        tabIndex={0}
        role="region"
        aria-label={regionLabel}
      >
        <div style={{ minWidth: `${svgMinWidth}px` }}>
          <svg
            role="img"
            aria-labelledby={`${titleId} ${descId}`}
            viewBox={`0 0 ${totalWidth} ${TOTAL_H}`}
            className="h-auto w-full"
          >
            <title id={titleId}>{title}</title>
            <desc id={descId}>{`${axisLabel} · ${accessibleNote} ${notDetectedExplain}`}</desc>

            {/* 강조 행 배경 (CutisBio) */}
            {placedRows.map(({ row, x, width }) =>
              row.highlight ? (
                <rect
                  key={`hl-${row.id}`}
                  x={x - 9}
                  y={PAD_TOP - 12}
                  width={width + 18}
                  height={PLOT_H + 12 + LABEL_BAND - 4}
                  rx="3"
                  style={highlightBandStyle}
                />
              ) : null,
            )}

            {/* 그룹 구분선 */}
            {groups.map((group) =>
              group.separatorX === null ? null : (
                <line
                  key={`sep-${group.label}-${group.start}`}
                  x1={group.separatorX}
                  y1={SEP_TOP}
                  x2={group.separatorX}
                  y2={SEP_BOTTOM}
                  style={gridStyle}
                  strokeWidth="1"
                  shapeRendering="crispEdges"
                />
              ),
            )}

            {/* 눈금선 · 눈금값 (0 에서 시작) */}
            {ticks.map((tick) => (
              <g key={`tick-${tick.value}`}>
                <line
                  x1={PAD_LEFT}
                  y1={tick.y}
                  x2={plotRight}
                  y2={tick.y}
                  style={tick.value === 0 ? axisStyle : gridStyle}
                  strokeWidth={tick.value === 0 ? 1.4 : 1}
                  shapeRendering="crispEdges"
                />
                <line
                  x1={PAD_LEFT - 6}
                  y1={tick.y}
                  x2={PAD_LEFT}
                  y2={tick.y}
                  style={axisStyle}
                  strokeWidth="1.2"
                  shapeRendering="crispEdges"
                />
                <text
                  x={PAD_LEFT - 11}
                  y={tick.y + 4}
                  textAnchor="end"
                  fontSize="11"
                  style={axisTextStyle}
                >
                  {formatTick(tick.value)}
                </text>
              </g>
            ))}

            {/* 값 축 */}
            <line
              x1={PAD_LEFT}
              y1={PAD_TOP - 14}
              x2={PAD_LEFT}
              y2={BASELINE_Y}
              style={axisStyle}
              strokeWidth="1.4"
              shapeRendering="crispEdges"
            />
            <text
              x="18"
              y={PAD_TOP + PLOT_H / 2}
              transform={`rotate(-90 18 ${PAD_TOP + PLOT_H / 2})`}
              textAnchor="middle"
              fontSize="11.5"
              fontWeight="600"
              style={axisTextStyle}
            >
              {axisLabel}
            </text>

            {/* 막대 · 불검출 표식 · 샘플 라벨 */}
            {placedRows.map(({ row, x, width }) => {
              const barsStart = x + (width - barsWidth) / 2;
              const centerX = x + width / 2;
              const lines = splitLabel(row.label);

              return (
                <g key={row.id}>
                  {series.map((s, seriesIndex) => {
                    const value: ChartValue | undefined = row.values[s.key];
                    if (!value) return null;

                    const barX = barsStart + seriesIndex * (BAR_W + BAR_GAP);
                    const barCenter = barX + BAR_W / 2;

                    /* 불검출: 막대를 그리지 않는다. 0 자리의 점선 캡 + N.D. 표식만 둔다. */
                    if (value.status === 'not_detected') {
                      return (
                        <g key={s.key}>
                          <line
                            x1={barCenter}
                            y1={BASELINE_Y}
                            x2={barCenter}
                            y2={BASELINE_Y - ND_CAP_H}
                            style={{ stroke: s.color }}
                            strokeWidth="1.6"
                            strokeDasharray="2.5 3"
                          />
                          <line
                            x1={barCenter - 5}
                            y1={BASELINE_Y - ND_CAP_H}
                            x2={barCenter + 5}
                            y2={BASELINE_Y - ND_CAP_H}
                            style={{ stroke: s.color }}
                            strokeWidth="1.6"
                          />
                          <text
                            x={barCenter}
                            y={BASELINE_Y - ND_CAP_H - 7}
                            textAnchor="middle"
                            fontSize="10"
                            fontWeight="700"
                            style={axisTextStyle}
                          >
                            {notDetectedShort}
                          </text>
                        </g>
                      );
                    }

                    /* 측정값: 0 도 정상적인 0 높이 막대로 그린다(축에 붙은 납작한 캡). */
                    const height = Math.min(Math.max((value.value / safeMax) * PLOT_H, 0), PLOT_H);
                    const capHeight = Math.max(height, 2);

                    return (
                      <g key={s.key}>
                        <rect
                          x={barX}
                          y={BASELINE_Y - height}
                          width={BAR_W}
                          height={height}
                          style={{ fill: s.color }}
                        />
                        <rect
                          x={barX}
                          y={BASELINE_Y - capHeight}
                          width={BAR_W}
                          height="2"
                          style={{ fill: s.color }}
                        />
                        <text
                          x={barCenter}
                          y={BASELINE_Y - height - 7}
                          textAnchor="middle"
                          fontSize="10"
                          style={inkTextStyle}
                        >
                          {formatNumber(value.value)}
                        </text>
                      </g>
                    );
                  })}

                  {/* 강조 행은 축 위에 굵은 강조 막대를 덧붙인다 */}
                  {row.highlight ? (
                    <rect
                      x={x - 9}
                      y={BASELINE_Y}
                      width={width + 18}
                      height="3.5"
                      style={highlightBarStyle}
                    />
                  ) : null}

                  <text
                    x={centerX}
                    y={LABEL_Y}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight={row.highlight ? 700 : 400}
                    style={row.highlight ? deepTextStyle : axisTextStyle}
                  >
                    {/* 두 줄로 쪼갠 라벨은 tspan 사이에 공백이 없어 'CompanyXT' 처럼 붙어 읽힌다.
                        원본 라벨을 담은 <title> 을 두어 보조기술·툴팁에서 온전한 이름이 나오게 한다. */}
                    {lines.length > 1 ? <title>{row.label}</title> : null}
                    {lines.map((line, lineIndex) => (
                      <tspan key={`${row.id}-l${lineIndex}`} x={centerX} dy={lineIndex === 0 ? 0 : 13}>
                        {line}
                      </tspan>
                    ))}
                  </text>
                </g>
              );
            })}

            {/* 그룹(인디고 유형) 라벨 */}
            {groups.map((group) => (
              <text
                key={`grp-${group.label}-${group.start}`}
                x={(group.start + group.end) / 2}
                y={GROUP_LABEL_Y}
                textAnchor="middle"
                fontSize="11.5"
                fontWeight="700"
                style={deepTextStyle}
              >
                {group.label}
              </text>
            ))}
          </svg>
        </div>
      </div>

      {caption ? <SourceNote className="mt-4">{caption}</SourceNote> : null}

      {/* accessibleNote 는 "값은 아래 표에서도 읽을 수 있다"고 안내하는 문장이므로
          반드시 표보다 **위**에 있어야 한다. 표 아래로 내려가면 '아래 표'가 가리키는 것이
          사라져 그래프에서 표를 찾는 독자를 반대 방향으로 보낸다. */}
      <SourceNote className={caption ? 'mt-2' : 'mt-4'}>{accessibleNote}</SourceNote>

      {/* 그래프와 같은 값을 담은 실제 데이터 표 */}
      <div
        className="table-scroll mt-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-denim)]"
        tabIndex={0}
        role="region"
        aria-labelledby={tableCaptionId}
      >
        <table className="w-full text-left text-sm" style={{ minWidth: `${tableMinWidth}px` }}>
          <caption
            id={tableCaptionId}
            className="mb-3 text-left text-[0.8125rem] leading-relaxed break-keep text-[var(--color-slate-muted)]"
          >
            {tableCaption}
          </caption>
          <thead>
            {/* 표 머리·행 구분선은 rule. 차트 격자선(COLOR.grid)은 강조 밴드 채움과 값을 공유하므로 washed 로 둔다. */}
            <tr className="border-y border-[color:var(--color-rule)]">
              <th
                scope="col"
                className="px-3 py-2.5 text-[0.8125rem] font-semibold break-keep text-[var(--color-indigo-deep)]"
              >
                {sampleHeader}
              </th>
              <th
                scope="col"
                className="px-3 py-2.5 text-[0.8125rem] font-semibold break-keep text-[var(--color-indigo-deep)]"
              >
                {groupHeader}
              </th>
              {series.map((s) => (
                <th
                  key={s.key}
                  scope="col"
                  className="px-3 py-2.5 text-right text-[0.8125rem] font-semibold break-keep text-[var(--color-indigo-deep)]"
                >
                  <span className="inline-flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                      style={{ backgroundColor: s.color }}
                    />
                    {s.label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className={`border-b border-[color:var(--color-rule)] ${
                  row.highlight ? 'bg-[var(--color-ivory)]' : ''
                }`}
              >
                <th
                  scope="row"
                  className={`px-3 py-2.5 text-left break-keep ${
                    row.highlight
                      ? 'font-bold text-[var(--color-indigo-deep)]'
                      : 'font-medium text-[var(--color-ink)]'
                  }`}
                >
                  {row.label}
                </th>
                <td className="px-3 py-2.5 break-keep text-[var(--color-slate-muted)]">
                  {row.groupLabel}
                </td>
                {series.map((s) => {
                  const value: ChartValue | undefined = row.values[s.key];
                  return (
                    <td
                      key={s.key}
                      className={`px-3 py-2.5 text-right tabular-nums ${
                        row.highlight
                          ? 'font-semibold text-[var(--color-indigo-deep)]'
                          : 'text-[var(--color-ink)]'
                      }`}
                    >
                      {!value
                        ? ''
                        : value.status === 'not_detected'
                          ? notDetectedLabel
                          : formatNumber(value.value)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SourceNote className="mt-4">{notDetectedExplain}</SourceNote>
    </div>
  );
}
