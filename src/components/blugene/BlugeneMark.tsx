import type { CSSProperties } from 'react';

/**
 * Blugene 마크 — 워드마크의 B 앞에 붙는 열두 갈래 문양.
 *
 * 고객이 준 로고 심벌 시트의 「후보 01」 문양을 모양 그대로 쓴다. 시트에서 문양만 잘라
 * 배경을 투명하게 만든 PNG(public/brand/blugene-mark.png — scripts/extract-blugene-mark.mjs 로
 * 생성)를 CSS mask 로 씌우고, 색은 배경색(currentColor)으로 입힌다. 그래서 색을 바꾸거나
 * 순환시켜도 모양은 변하지 않는다.
 *
 * - 밝은 바탕에서는 `.blugene-mark`(globals.css)가 1초마다 파랑 일곱 가지를 순환시키고,
 *   어두운 바탕(Wordmark tone="inverse")에서는 글자색(흰색)을 따른다.
 * - 순수 장식이므로 aria-hidden. 링크의 접근성 이름은 워드마크 글자가 맡는다.
 * - 마스크는 정사각 PNG 를 contain 으로 맞추므로 요소도 정사각(h = w)으로 둔다.
 */
const MARK_SRC = '/brand/blugene-mark.png';

const MASK_STYLE: CSSProperties = {
  WebkitMaskImage: `url(${MARK_SRC})`,
  maskImage: `url(${MARK_SRC})`,
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',
  maskPosition: 'center',
};

export default function BlugeneMark({ className = '' }: { className?: string }) {
  return <span aria-hidden="true" className={`inline-block bg-current ${className}`} style={MASK_STYLE} />;
}
