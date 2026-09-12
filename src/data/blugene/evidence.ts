/**
 * Blugene 시험 근거 데이터 — 단일 출처(Single Source of Truth)
 * ---------------------------------------------------------------
 * 출처: CutisBio_CB_Bioindigo_Catalogue_(EN)_July 2026.pdf (제공 카탈로그)
 * 전사본: Blugene_Website_Brief/data/evidence.json
 *
 * ⚠ 이 파일의 숫자·시험번호·날짜는 **번역 대상이 아니다**. 언어와 무관하게 그대로 렌더링한다.
 * ⚠ 불검출(N.D.)은 `null`이 아니라 status 'not_detected' 로 표현한다. 절대 0으로 변환하지 않는다.
 * ⚠ 카탈로그에 없는 값(농도, 색차, 물·탄소 절감량 등)을 여기에 추가하지 않는다.
 */

/** 이 사이트가 인용하는 자료의 기준일. 화면에 '자료 기준일'로 표시한다. */
export const SOURCE_AS_OF = '2026-09-06';

/** 제공 카탈로그 자체의 발행 기준 */
export const CATALOGUE = {
  title: 'CutisBio CB Bioindigo Catalogue (EN)',
  issued: '2026-07',
  pdfHref: '/blugene/catalogue/CutisBio-CB-Bioindigo-Catalogue-EN-2026-07.pdf',
  /** 내려받기 버튼에 표시할 파일 크기 (scripts/build-blugene-assets.py 실행 결과 기준) */
  pdfSizeLabel: '1.9 MB',
  pageImage: (page: number) => `/blugene/catalogue/page-${String(page).padStart(2, '0')}.webp`,
  pageCount: 12,
} as const;

/** 시험 결과의 상태. 측정값과 불검출을 타입 수준에서 구분한다. */
export type Measurement =
  | { status: 'measured'; value: number; unit: string }
  | { status: 'not_detected'; unit: string };

/** 1-C. 바이오 기반 탄소 (C14) — 카탈로그 p.3, Table 1-1 */
export const carbonTest = {
  page: 3,
  table: '1-1',
  figure: '1-3',
  lab: 'KATRI (Korea Apparel Testing and Research Institute)',
  method: 'ASTM D6866-24a Method B (AMS)',
  reportNumber: 'SBED25-00000153-1',
  reportDate: '2025-05-22',
  /** percent Modern Carbon — 원측정값 */
  pmc: 97.73,
  /** 바이오 기반 탄소 함량(%) — 카탈로그 표기값. 인디고 순도도, 배출 감축률도 아니다. */
  biobasedCarbonPercent: 98,
  chartImage: '/blugene/evidence/biobased-carbon-chart.png',
  tableImage: '/blugene/evidence/biobased-carbon-table.png',
} as const;

/** 2-C. (N-메틸)아닐린 분석 — 카탈로그 p.5, Table 2-3 */
export const anilineTest = {
  page: 5,
  table: '2-3',
  figure: '2-2',
  lab: 'KOTERI (Korea High Tech Textile Research Institute)',
  method: 'KS K 0734 2019',
  reportNumber: '2025-0604-1132-C03',
  reportDate: '2025-06-10',
  /** 방법 검출한계 (mg/kg). '불검출'은 이 한계 아래라는 뜻이다. */
  detectionLimitMgKg: 5,
  aniline: { status: 'not_detected', unit: 'mg/kg' } as Measurement,
  nMethylaniline: { status: 'not_detected', unit: 'mg/kg' } as Measurement,
  resultsImage: '/blugene/evidence/aniline-results.png',
} as const;

export type IndigoType = 'chemical' | 'plant' | 'bio';

export interface MarketSample {
  /** 카탈로그의 익명 표기를 그대로 쓴다. 실제 회사명을 추정하지 않는다. */
  id: string;
  type: IndigoType;
  /** 카탈로그 표기 라벨. Company M 은 chemical·plant 두 유형에 각각 등장하므로 type 과 함께 표시한다. */
  label: string;
  pmc: number;
  biobasedCarbonPercent: number;
  aniline: Measurement;
  nMethylaniline: Measurement;
  carbonReportNumber: string;
  carbonReportDate: string;
  anilineReportNumber: string;
  anilineReportDate: string;
}

const ND: Measurement = { status: 'not_detected', unit: 'mg/kg' };
const mg = (value: number): Measurement => ({ status: 'measured', value, unit: 'mg/kg' });

/**
 * 카탈로그 p.3 Table 1-1 + p.5 Table 2-3 의 동일한 9개 시판 샘플.
 * 두 시험은 기관·시험법·보고서·일자가 서로 다르다. 하나의 새로운 지표로 합치지 않는다.
 */
export const marketSamples: MarketSample[] = [
  { id: 'chemical-s',  type: 'chemical', label: 'Company S',  pmc: 1.07,   biobasedCarbonPercent: 1,   aniline: mg(1524), nMethylaniline: mg(828),  carbonReportNumber: 'SBED25-00000153-1', carbonReportDate: '2025-05-22', anilineReportNumber: '2025-0604-1132-C03', anilineReportDate: '2025-06-10' },
  { id: 'chemical-m',  type: 'chemical', label: 'Company M',  pmc: 19.20,  biobasedCarbonPercent: 19,  aniline: mg(369),  nMethylaniline: mg(225),  carbonReportNumber: 'SBED25-00000211',   carbonReportDate: '2025-07-11', anilineReportNumber: '2025-0624-1268',     anilineReportDate: '2025-07-03' },
  { id: 'chemical-z',  type: 'chemical', label: 'Company Z',  pmc: 0.30,   biobasedCarbonPercent: 0,   aniline: mg(1229), nMethylaniline: mg(1127), carbonReportNumber: 'SBED25-00000211',   carbonReportDate: '2025-07-11', anilineReportNumber: '2025-0624-1268',     anilineReportDate: '2025-07-03' },
  { id: 'plant-m',     type: 'plant',    label: 'Company M',  pmc: 100.39, biobasedCarbonPercent: 100, aniline: ND,       nMethylaniline: ND,       carbonReportNumber: 'SBED25-00000211',   carbonReportDate: '2025-07-11', anilineReportNumber: '2025-0624-1268',     anilineReportDate: '2025-07-03' },
  { id: 'plant-xt',    type: 'plant',    label: 'Company XT', pmc: 51.15,  biobasedCarbonPercent: 51,  aniline: mg(131),  nMethylaniline: mg(85),   carbonReportNumber: 'SBED25-00000211',   carbonReportDate: '2025-07-11', anilineReportNumber: '2025-0624-1268',     anilineReportDate: '2025-07-03' },
  { id: 'plant-i',     type: 'plant',    label: 'Company I',  pmc: 18.34,  biobasedCarbonPercent: 18,  aniline: ND,       nMethylaniline: ND,       carbonReportNumber: 'SBED25-00000211',   carbonReportDate: '2025-07-11', anilineReportNumber: '2025-0624-1268',     anilineReportDate: '2025-07-03' },
  { id: 'plant-xb',    type: 'plant',    label: 'Company XB', pmc: 96.82,  biobasedCarbonPercent: 97,  aniline: ND,       nMethylaniline: ND,       carbonReportNumber: 'SBED25-00000211',   carbonReportDate: '2025-07-11', anilineReportNumber: '2025-0624-1268',     anilineReportDate: '2025-07-03' },
  { id: 'plant-h',     type: 'plant',    label: 'Company H',  pmc: 33.66,  biobasedCarbonPercent: 34,  aniline: mg(2652), nMethylaniline: mg(2375), carbonReportNumber: 'SBED25-00000153-1', carbonReportDate: '2025-07-11', anilineReportNumber: '2025-0604-1132-C03', anilineReportDate: '2025-06-10' },
  { id: 'bio-cutisbio',type: 'bio',      label: 'CutisBio',   pmc: 97.73,  biobasedCarbonPercent: 98,  aniline: ND,       nMethylaniline: ND,       carbonReportNumber: 'SBED25-00000153-1', carbonReportDate: '2025-05-22', anilineReportNumber: '2025-0604-1132-C03', anilineReportDate: '2025-06-10' },
];

/** 차트 축 상한 — 데이터에서 파생. 모든 그래프는 0부터 시작한다. */
export const anilineChartMax = 3000;
export const carbonChartMax = 100;

/** 제품 요약 — 카탈로그 p.11 */
export const productSummary = {
  page: 11,
  /** 인증서·카탈로그에 기재된 원래 제품명. 인증서 이미지를 고쳐 쓰지 않는다. */
  catalogueName: 'Bio Indigo Dye Powder (Microbial Fermentation)',
  certificateName: 'CB Bio Indigo Dye Powder',
  /** 신규 브랜드의 웹 표시명 */
  brandName: 'Blugene',
  cas: '482-89-3',
} as const;

/** 연락처 — 카탈로그 p.11-12 */
export const contact = {
  email: 'contact@cutisbio.com',
  tel: '+82-70-4914-2525',
  telHref: '+827049142525',
  address: '8F Apgujeong B/D, 842 Nonhyeon-ro, Gangnam-gu, Seoul 06025, Korea',
} as const;
