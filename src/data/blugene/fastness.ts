/**
 * 견뢰도 · 염색성 데이터 — 카탈로그 p.6 (Table 3-1 ~ 3-4, Figure 3-1)
 * -------------------------------------------------------------------
 * ⚠ 등급은 **문자열**이다. '4-5'는 순위 등급이며 소수 4.5로 변환하지 않는다.
 * ⚠ 경사(Warp)/위사(Weft), 건(Dry)/습(Wet), 산성(Acid)/알칼리성(Alkali) 구분을 합치지 않는다.
 * ⚠ 낮은 값(#6 건마찰 1·2, #9 건마찰 2·2-3, #8 알칼리 땀 색변화 3)을 생략하지 않는다.
 * ⚠ 카탈로그 원문은 "comparable performance"다. '모든 항목에서 우월'로 바꾸지 않는다.
 */

export type IndigoType = 'plant' | 'chemical' | 'bio';
export type Fiber = 'cotton' | 'silk' | 'cashmere';

export interface FabricSample {
  /** 카탈로그의 Sample ID (#1 ~ #9). 원본 번호를 유지한다. */
  id: number;
  indigo: IndigoType;
  fiber: Fiber;
}

/** Figure 3-1 의 샘플 대응. 사진 순서와 동일하다. */
export const fabricSamples: FabricSample[] = [
  { id: 1, indigo: 'plant', fiber: 'cotton' },
  { id: 2, indigo: 'plant', fiber: 'silk' },
  { id: 3, indigo: 'plant', fiber: 'cashmere' },
  { id: 4, indigo: 'chemical', fiber: 'cotton' },
  { id: 5, indigo: 'chemical', fiber: 'silk' },
  { id: 6, indigo: 'chemical', fiber: 'cashmere' },
  { id: 7, indigo: 'bio', fiber: 'cotton' },
  { id: 8, indigo: 'bio', fiber: 'silk' },
  { id: 9, indigo: 'bio', fiber: 'cashmere' },
];

/** 한 행 = 시험 항목. values 는 #1..#9 순서. */
export interface FastnessRow {
  /** 번역 키 접미사 (messages 의 Fastness.row.* 와 대응) */
  key: string;
  /** 'change' = 색 변화, 'stain' = 오염 */
  group: 'change' | 'stain';
  /** 하위 구분이 없으면 길이 9, 있으면 길이 18 (샘플별 2값) */
  values: string[];
}

export interface FastnessTable {
  /** 카탈로그 표 번호 */
  table: string;
  /** 번역 키 (messages 의 Fastness.table.* 와 대응) */
  key: 'laundering' | 'light' | 'rubbing' | 'perspiration';
  /** 시험법 원문 — 번역하지 않는다 */
  method: string;
  /** 샘플당 하위 열 라벨 키. 없으면 샘플당 1값. */
  subColumns?: readonly string[];
  rows: FastnessRow[];
}

const all = (v: string) => Array<string>(9).fill(v);

/** Table 3-1. 세탁 견뢰도 */
export const launderingTable: FastnessTable = {
  table: '3-1',
  key: 'laundering',
  method: 'KS K ISO 105-C06:2010, A2S',
  rows: [
    { key: 'colorChange', group: 'change', values: ['4-5', '3-4', '4-5', '4-5', '4', '4-5', '4-5', '4-5', '4-5'] },
    { key: 'acetate', group: 'stain', values: ['4-5', '4-5', '4-5', '4-5', '4-5', '4-5', '4-5', '4-5', '4'] },
    { key: 'cotton', group: 'stain', values: all('4-5') },
    { key: 'nylon', group: 'stain', values: ['4-5', '4-5', '4', '4-5', '4-5', '4', '4', '4', '3-4'] },
    { key: 'polyester', group: 'stain', values: all('4-5') },
    { key: 'acrylic', group: 'stain', values: all('4-5') },
    { key: 'wool', group: 'stain', values: all('4-5') },
  ],
};

/** Table 3-2. 일광 견뢰도 */
export const lightTable: FastnessTable = {
  table: '3-2',
  key: 'light',
  method: 'KS K ISO 105-B02:2014, Exposure Cycle A1, Method 5',
  rows: [
    { key: 'colorChange', group: 'change', values: ['4', '4-5', '4-5', '4', '4', '4-5', '4', '4-5', '4-5'] },
  ],
};

/**
 * Table 3-3. 마찰 견뢰도 — 샘플마다 경사/위사 2값.
 * values 는 [#1경사, #1위사, #2경사, #2위사, ...] 순서.
 */
export const rubbingTable: FastnessTable = {
  table: '3-3',
  key: 'rubbing',
  method: 'KS K ISO 105-X12:2016',
  subColumns: ['warp', 'weft'],
  rows: [
    {
      key: 'dry', group: 'stain',
      values: ['4-5', '4-5', '4-5', '4-5', '3-4', '3-4', '4-5', '4-5', '4-5', '4-5', '1', '2', '4-5', '4-5', '4-5', '4-5', '2', '2-3'],
    },
    {
      key: 'wet', group: 'stain',
      values: ['4-5', '4-5', '4-5', '4-5', '3-4', '3-4', '4', '4-5', '4', '4-5', '3', '3', '4', '4', '4', '3-4', '3', '3-4'],
    },
  ],
};

/** Table 3-4. 땀 견뢰도 — 샘플마다 산성/알칼리성 2값. */
const perspirationAll = (): string[] => Array<string>(18).fill('4-5');

export const perspirationTable: FastnessTable = {
  table: '3-4',
  key: 'perspiration',
  method: 'KS K ISO 105-E04:2013',
  subColumns: ['acid', 'alkali'],
  rows: [
    {
      key: 'colorChange', group: 'change',
      values: ['4-5', '4-5', '4', '4-5', '4-5', '4-5', '4-5', '4-5', '4-5', '4-5', '4-5', '4-5', '4-5', '4-5', '4', '3', '4-5', '4-5'],
    },
    { key: 'acetate', group: 'stain', values: perspirationAll() },
    { key: 'cotton', group: 'stain', values: perspirationAll() },
    { key: 'nylon', group: 'stain', values: perspirationAll() },
    { key: 'polyester', group: 'stain', values: perspirationAll() },
    { key: 'acrylic', group: 'stain', values: perspirationAll() },
    { key: 'wool', group: 'stain', values: perspirationAll() },
  ],
};

export const fastnessTables: FastnessTable[] = [
  launderingTable,
  lightTable,
  rubbingTable,
  perspirationTable,
];

/** 원본 표 이미지(대조용) */
export const fastnessSourceImage = '/blugene/performance/fastness-tables.png';
export const fabricComparisonImage = '/blugene/performance/fabric-comparison.webp';
export const fabricStripImage = '/blugene/performance/fabric-strip.webp';

/**
 * 저장소에 원래 있던 추가 원단 평가 사진(`/test.png`).
 * 일본어 라벨: 4·6·8회 염색 × 바이오②-1 / 合成(합성) / 바이오②-2.
 * 시험기관·시험법·일자·의뢰처가 저장소에 없어 카탈로그 p.6 시험과 분리해 표시한다.
 */
export const additionalDyeingCase = {
  image: '/test.png',
  cycles: [4, 6, 8],
  rowsAsPrinted: ['バイオ②-1', '合成', 'バイオ②-2'],
  provenance: 'unverified' as const,
};
