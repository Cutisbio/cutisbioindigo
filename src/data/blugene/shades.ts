/**
 * 색상 라이브러리 · 제품군 데이터 — 카탈로그 p.7-9
 * -------------------------------------------------
 * ⚠ 카탈로그에는 각 견본의 **농도 수치가 없다**. 1%, 2% 같은 숫자를 붙이지 않는다.
 *   원문의 Low → High 방향과 등장 위치만 보존하고, 내부 구분자(A1…B6)로 참조한다.
 * ⚠ 인디고/인디루빈 비교는 제공된 사진 두 장만 쓴다. 중간 혼합비를 CSS/AI 로 보간하지 않는다.
 */

/**
 * p.7 Figure 4-1 의 2행 × 6열 견본.
 * PDF 내장 이미지의 등장 위치(bbox) 순서를 그대로 옮겼다.
 * 주의: A6 과 B1 은 원본에서 **같은 내장 이미지가 두 위치에 사용**된다. 위치를 합치지 않는다.
 */
export interface ShadeSwatch {
  /** 내부 구분자. 카탈로그에 없는 라벨이므로 '카탈로그 견본'임을 화면에 밝힌다. */
  code: string;
  row: 'A' | 'B';
  column: number;
  image: string;
  /** PDF 내장 이미지 식별자 — 출처 추적용 */
  xref: string;
}

const swatch = (code: string, xref: string): ShadeSwatch => ({
  code,
  row: code[0] as 'A' | 'B',
  column: Number(code.slice(1)),
  image: `/blugene/shades/swatch-${code}.png`,
  xref,
});

export const shadeSwatches: ShadeSwatch[] = [
  swatch('A1', 'p07-xref121'),
  swatch('A2', 'p07-xref120'),
  swatch('A3', 'p07-xref119'),
  swatch('A4', 'p07-xref118'),
  swatch('A5', 'p07-xref117'),
  swatch('A6', 'p07-xref116'),
  swatch('B1', 'p07-xref116'),
  swatch('B2', 'p07-xref115'),
  swatch('B3', 'p07-xref114'),
  swatch('B4', 'p07-xref113'),
  swatch('B5', 'p07-xref112'),
  swatch('B6', 'p07-xref111'),
];

export const shadeSourceImage = '/blugene/shades/concentration-shades.webp';

/** p.7 Figure 4-2. 인디고 100% vs 인디고 94% + 인디루빈 6% */
export const indirubinPair = [
  { id: 'indigo-100', ratio: { indigo: 100, indirubin: 0 }, image: '/blugene/shades/indirubin-indigo-100.webp' },
  { id: 'indigo-94', ratio: { indigo: 94, indirubin: 6 }, image: '/blugene/shades/indirubin-indigo-94.webp' },
] as const;

/** p.8-9 제품군 */
export interface ProductForm {
  id: 'powder' | 'ink';
  /** 웹 표시명 (신규 브랜드 표기안) */
  webName: string;
  /** 카탈로그·인증서 원문 제품명 */
  catalogueName: string;
  image: string;
  imageSize: { width: number; height: number };
  page: number;
}

export const productForms: ProductForm[] = [
  {
    id: 'powder',
    webName: 'Blugene Indigo Powder',
    catalogueName: 'Bio Indigo Dye Powder (Microbial Fermentation) / CB Bio Indigo Dye Powder',
    image: '/blugene/products/powder.png',
    imageSize: { width: 290, height: 208 },
    page: 8,
  },
  {
    id: 'ink',
    webName: 'Blugene Digital Printing Ink',
    catalogueName: 'BioIndigo Digital Printing Ink',
    image: '/blugene/products/ink-jar.png',
    imageSize: { width: 176, height: 264 },
    page: 9,
  },
];

/** p.8 Figure 5-1. 3행(화학 분말 / 바이오 분말 / 바이오 잉크) × 4열(1~4회 염색) 비교 도판 */
export const dyeingCycleImage = '/blugene/products/powder-ink-cycles.png';
export const dyeingCycleRows = ['chemicalPowder', 'bioPowder', 'bioInk'] as const;
export const dyeingCycles = [1, 2, 3, 4] as const;

/**
 * p.9 Figure 6-1. 디지털 프린팅 잉크 제조 흐름.
 * 원문 단계명은 그대로 보존하고, 설명만 한국어로 붙인다.
 * 특히 마지막 단계의 원문은 'Formation' 이며, 확정된 공정 전문용어로 덮어쓰지 않는다.
 */
export const inkProcessSteps = [
  { key: 'rawMaterial', sourceLabel: 'Raw Material Preparation' },
  { key: 'premixing', sourceLabel: 'Premixing' },
  { key: 'milling', sourceLabel: 'Milling' },
  { key: 'filtration', sourceLabel: 'Filtration' },
  { key: 'formation', sourceLabel: 'Formation' },
] as const;

export const inkProcessImage = '/blugene/printing/ink-process.png';

/** p.9 Figure 6-2. 원작 / 바이오 인디고 잉크 프린팅 결과 두 쌍 */
export const printingPairs = [
  {
    id: 'pair-a',
    original: { image: '/blugene/printing/pair-a-original.webp', width: 184, height: 265 },
    printed: { image: '/blugene/printing/pair-a-printed.webp', width: 285, height: 458 },
  },
  {
    id: 'pair-b',
    original: { image: '/blugene/printing/pair-b-original.webp', width: 203, height: 231 },
    printed: { image: '/blugene/printing/pair-b-printed.webp', width: 384, height: 456 },
  },
] as const;

/** 문의 유형 — 샘플 문의 폼과 mailto 제목에 사용 */
export const inquiryTopics = ['fabricDyeing', 'digitalPrinting', 'shadeDevelopment', 'technicalData'] as const;
export type InquiryTopic = (typeof inquiryTopics)[number];
