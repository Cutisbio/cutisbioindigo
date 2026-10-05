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
