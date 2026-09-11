#!/usr/bin/env node
/**
 * Blugene 마크 추출
 * =========================================================================
 * 고객이 준 로고 심벌 색상 베리에이션 시트(후보 01 ~ 08)에서 「후보 01 (네이비 블루)」의
 * 문양만 잘라내, 배경을 투명하게 만든 알파 마스크 PNG 를 만든다.
 * 화면에서는 이 PNG 를 CSS mask 로 써서 색을 자유롭게 입힌다(src/components/blugene/BlugeneMark.tsx).
 *
 * 원칙: 모양을 바꾸지 않는다. 자르기와 배경 제거만 하고 리샘플링(확대 · 축소)은 하지 않는다.
 *
 * 입력: Blugene_Website_Brief/assets/brand/blugene-symbol-color-variations.jpg
 * 출력: public/brand/blugene-mark.png (정사각, 사방 여백 2px)
 * 실행: node scripts/extract-blugene-mark.mjs
 *
 * `sharp` 는 next 가 의존하는 패키지라 따로 설치하지 않아도 node_modules 에 있다.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'Blugene_Website_Brief/assets/brand/blugene-symbol-color-variations.jpg');
const OUT = path.join(ROOT, 'public/brand/blugene-mark.png');

/**
 * 시트(2752×1536)에서 후보 01 문양이 있는 영역(원본 픽셀).
 * 오른쪽 아래로 캡션 '후보 01 …' 의 첫 글자가 조금 걸치지만, 가운데에서 이어진 덩어리만
 * 남기므로 글자는 자동으로 빠진다.
 */
const REGION = { left: 120, top: 190, width: 350, height: 360 };

/** 가장자리 안티에일리어싱을 살리기 위해 덩어리 주변 몇 픽셀까지 알파를 남길지 */
const EDGE = 2;
/** 출력 여백(px) */
const PAD = 2;

const { data, info } = await sharp(SRC)
  .extract(REGION)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;
const N = W * H;

// 밝기(상대휘도 근사). 문양은 어둡고 배경은 밝다.
const lum = new Float32Array(N);
for (let i = 0; i < N; i++) {
  lum[i] = 0.2126 * data[i * C] + 0.7152 * data[i * C + 1] + 0.0722 * data[i * C + 2];
}

// 배경 밝기 = 영역 테두리 픽셀의 중앙값, 전경 밝기 = 가장 어두운 0.5% 지점.
const median = (arr) => {
  const s = Float32Array.from(arr).sort();
  return s[Math.floor(s.length / 2)];
};
const border = [];
for (let x = 0; x < W; x++) border.push(lum[x], lum[(H - 1) * W + x]);
for (let y = 0; y < H; y++) border.push(lum[y * W], lum[y * W + W - 1]);
const bg = median(border);
const fg = Float32Array.from(lum).sort()[Math.floor(N * 0.005)];

// 잉크 비율(0 = 배경, 1 = 문양) → 알파. 양 끝 12% 를 잘라 JPEG 잡티는 없애고
// 가장자리의 중간값(안티에일리어싱)은 그대로 둔다.
const ink = new Float32Array(N);
for (let i = 0; i < N; i++) {
  const t = (bg - lum[i]) / (bg - fg);
  ink[i] = Math.min(1, Math.max(0, (t - 0.12) / 0.76));
}

// 가운데에서 이어진 덩어리만 남긴다 (4-연결 flood fill).
const solid = new Uint8Array(N);
for (let i = 0; i < N; i++) solid[i] = ink[i] >= 0.5 ? 1 : 0;
let start = -1;
let best = -1;
for (let y = Math.floor(H * 0.4); y < H * 0.6; y++) {
  for (let x = Math.floor(W * 0.4); x < W * 0.6; x++) {
    const i = y * W + x;
    if (solid[i] && ink[i] > best) {
      best = ink[i];
      start = i;
    }
  }
}
if (start < 0) throw new Error('영역 가운데에서 문양을 찾지 못했다. REGION 을 확인하라.');
const keep = new Uint8Array(N);
const stack = [start];
keep[start] = 1;
while (stack.length) {
  const i = stack.pop();
  const x = i % W;
  const y = (i - x) / W;
  const nb = [];
  if (x > 0) nb.push(i - 1);
  if (x < W - 1) nb.push(i + 1);
  if (y > 0) nb.push(i - W);
  if (y < H - 1) nb.push(i + W);
  for (const j of nb) {
    if (solid[j] && !keep[j]) {
      keep[j] = 1;
      stack.push(j);
    }
  }
}

// 덩어리 주변 EDGE px 까지는 알파를 살린다(가장자리 부드럽게). 그 밖은 버린다.
const near = new Uint8Array(N);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (!keep[y * W + x]) continue;
    for (let dy = -EDGE; dy <= EDGE; dy++) {
      for (let dx = -EDGE; dx <= EDGE; dx++) {
        const yy = y + dy;
        const xx = x + dx;
        if (yy >= 0 && yy < H && xx >= 0 && xx < W) near[yy * W + xx] = 1;
      }
    }
  }
}

// 남는 픽셀의 경계 상자 → 정사각 캔버스 가운데에 놓는다.
let minX = W;
let minY = H;
let maxX = -1;
let maxY = -1;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = y * W + x;
    if (near[i] && ink[i] > 0) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
const bw = maxX - minX + 1;
const bh = maxY - minY + 1;
const side = Math.max(bw, bh) + PAD * 2;
const offX = Math.floor((side - bw) / 2);
const offY = Math.floor((side - bh) / 2);

// RGB 는 시트의 문양 색(진한 픽셀 평균)으로 채운다. 마스크로 쓸 때는 알파만 쓰이지만
// PNG 를 그냥 열어 봐도 시트와 같은 남색으로 보이게 한다.
let sr = 0;
let sg = 0;
let sb = 0;
let sn = 0;
for (let i = 0; i < N; i++) {
  if (keep[i] && ink[i] >= 0.95) {
    sr += data[i * C];
    sg += data[i * C + 1];
    sb += data[i * C + 2];
    sn++;
  }
}
const rgb = [Math.round(sr / sn), Math.round(sg / sn), Math.round(sb / sn)];

const out = Buffer.alloc(side * side * 4, 0);
for (let y = minY; y <= maxY; y++) {
  for (let x = minX; x <= maxX; x++) {
    const i = y * W + x;
    if (!near[i]) continue;
    const a = Math.round(ink[i] * 255);
    if (!a) continue;
    const o = ((y - minY + offY) * side + (x - minX + offX)) * 4;
    out[o] = rgb[0];
    out[o + 1] = rgb[1];
    out[o + 2] = rgb[2];
    out[o + 3] = a;
  }
}
await sharp(out, { raw: { width: side, height: side, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(OUT);

console.log(
  `배경 밝기 ${bg.toFixed(1)} · 문양 밝기 ${fg.toFixed(1)} · 문양 색 rgb(${rgb.join(', ')}) · ` +
    `문양 ${bw}×${bh}px → ${side}×${side}px  ${path.relative(ROOT, OUT)}`,
);
