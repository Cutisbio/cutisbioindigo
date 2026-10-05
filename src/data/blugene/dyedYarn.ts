/**
 * 염색사 사진 비교 — 고객 제공(2026-10-05) 사진 6장. 4 · 6 · 8회 염색 × 염색사(dyed) · 1회 세탁(washed).
 * 각 사진은 위에서부터 Blugene1 · 석유화학 인디고 · Blugene2 실을 담고 있다(고객 자료의 표기는 Blugene②-1 · ②-2, 화면 표기는 2026-10-05 고객 지정).
 * 파일은 고객 SVG 에 내장된 PDF 원본 JPEG 를 90° 돌린 것(크기 · 색 무변환)이며 출처는 public/blugene/asset-manifest.json 에 있다.
 * 픽셀 크기는 파일 그대로다. 화면 글자(표제 · 열 · 행 · 시료명)는 messages 의 DyedYarn.* 가 맡는다.
 */
export type DyedYarnPhoto = { readonly src: string; readonly width: number; readonly height: number };

export const DYED_YARN_BLOCKS = [
  {
    cycles: 4,
    dyed: { src: '/blugene/performance/dyed-yarn/cycles-4-dyed.jpg', width: 545, height: 330 },
    washed: { src: '/blugene/performance/dyed-yarn/cycles-4-washed.jpg', width: 725, height: 331 },
  },
  {
    cycles: 6,
    dyed: { src: '/blugene/performance/dyed-yarn/cycles-6-dyed.jpg', width: 547, height: 337 },
    washed: { src: '/blugene/performance/dyed-yarn/cycles-6-washed.jpg', width: 724, height: 338 },
  },
  {
    cycles: 8,
    dyed: { src: '/blugene/performance/dyed-yarn/cycles-8-dyed.jpg', width: 549, height: 337 },
    washed: { src: '/blugene/performance/dyed-yarn/cycles-8-washed.jpg', width: 728, height: 336 },
  },
] as const satisfies readonly { cycles: number; dyed: DyedYarnPhoto; washed: DyedYarnPhoto }[];

/**
 * 실타래 염색 비교 사진 — 고객 제공(2026-10-05, Blugene_SVG_Package.zip). 석유화학 인디고 · Blugene 1 · Blugene 2 (행) ×
 * 1 · 3 · 5회 침염(열)의 3행 3열이 한 장에 담겨 있고, 칸은 가로 · 세로 모두 3등분이다. 꾸러미 SVG 에 내장된 무손실 PNG(1952×1244)를
 * WebP 로 바꾼 것이며 색 · 크기는 손대지 않았다. 원본 PNG 와 꾸러미 설명은 Blugene_Website_Brief/assets/mockups/2026-10-05-dyeing-comparison/ 에 있다.
 * 열 · 행 이름은 messages 의 SkeinComparison.* 가 맡는다.
 */
export const SKEIN_COMPARISON = {
  src: '/blugene/performance/dyed-yarn/skeins-1-3-5-dips.webp',
  width: 1952,
  height: 1244,
  /** 열 — 침염 횟수 */
  dips: [1, 3, 5],
} as const;
