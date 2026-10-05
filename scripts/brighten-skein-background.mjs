/**
 * 실타래 비교 사진(염색 · 프린팅 「염색 횟수에 따른 발색 비교」 맨 위)의 바탕만 밝히는 스크립트.
 *
 * 2026-10-05 고객 요청("실타래 배경이 어두운 색인데 약간 밝게")으로 만들었으나 2026-10-06 고객 요청으로 원본 바탕으로 되돌렸다.
 * 지금 화면의 파일에는 적용하지 않는다 — 다시 쓰려면 실행 후 캡션 · 출처 기록 · 문서에 조정 사실을 함께 적는다.
 * 실의 색은 비교의 핵심이므로 손대지 않고,
 * 실타래 주변의 어두운 무채색 판(바탕)만 채널당 LIFT 만큼 올린다.
 *
 * 방법
 *  1. 색이 있는 픽셀(채도 = max−min > 10)을 실타래 후보로 본다. 가장 짙은 5회 실타래 안쪽은 채도가 낮지만
 *     가장자리는 색이 있으므로, 후보를 5px 팽창한 뒤 구멍을 메우고(테두리에서 닿지 않는 곳) 3px 되돌리면 실타래 덩어리가 된다.
 *  2. 바탕 = 그 나머지 전체(그림자 포함). 마스크를 2px 흐려 가장자리를 부드럽게 하되, 실타래 쪽으로는 번지지 않게 바탕 안에서만 적용한다.
 *  3. 바탕 픽셀에 LIFT(기본 30)를 더한다. 실타래 표본 구역의 변화는 채널당 1 미만이어야 한다(아래 probe 로 출력).
 *
 * 입력: Blugene_Website_Brief/assets/mockups/2026-10-05-dyeing-comparison/source-photo-1952x1244.png (고객 원본, 무손실)
 * 출력: public/blugene/performance/dyed-yarn/skeins-1-3-5-dips.webp (q92)
 * 실행: node scripts/brighten-skein-background.mjs [lift]
 */
import fs from 'node:fs';
import { createRequire } from 'node:module';

const sharp = createRequire(import.meta.url)('sharp');
const SRC = 'Blugene_Website_Brief/assets/mockups/2026-10-05-dyeing-comparison/source-photo-1952x1244.png';
const OUT = 'public/blugene/performance/dyed-yarn/skeins-1-3-5-dips.webp';

const CHROMA_COLORED = 10;
const DILATE_R = 5;
const ERODE_R = 3;
const LIFT = Number(process.argv[2] || 30);

const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height, C = info.channels, N = W * H;

const colored = new Uint8Array(N);
for (let p = 0; p < N; p++) {
  const i = p * C;
  const r = data[i], g = data[i + 1], b = data[i + 2];
  if (Math.max(r, g, b) - Math.min(r, g, b) > CHROMA_COLORED) colored[p] = 1;
}

/** wantAll=false: 팽창(이웃에 하나라도 1), true: 침식(이웃이 모두 1) */
const morph = (src, r, wantAll) => {
  const out = new Uint8Array(N);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const p = y * W + x;
    let acc = wantAll ? 1 : 0;
    outer: for (let dy = -r; dy <= r; dy++) {
      const yy = y + dy; if (yy < 0 || yy >= H) continue;
      for (let dx = -r; dx <= r; dx++) {
        const xx = x + dx; if (xx < 0 || xx >= W) continue;
        const v = src[yy * W + xx];
        if (wantAll ? !v : v) { acc = wantAll ? 0 : 1; break outer; }
      }
    }
    out[p] = acc;
  }
  return out;
};
const dilated = morph(colored, DILATE_R, false);

// 구멍 메우기 — 테두리에서 닿는 '바깥'을 채운 뒤, 바깥이 아닌 곳은 모두 실타래로 본다
const outside = new Uint8Array(N);
const queue = new Int32Array(N);
let qh = 0, qt = 0;
const push = (p) => { if (!dilated[p] && !outside[p]) { outside[p] = 1; queue[qt++] = p; } };
for (let x = 0; x < W; x++) { push(x); push((H - 1) * W + x); }
for (let y = 0; y < H; y++) { push(y * W); push(y * W + W - 1); }
while (qh < qt) {
  const p = queue[qh++]; const x = p % W, y = (p - x) / W;
  if (x > 0) push(p - 1); if (x < W - 1) push(p + 1); if (y > 0) push(p - W); if (y < H - 1) push(p + W);
}
const filled = new Uint8Array(N);
for (let p = 0; p < N; p++) filled[p] = outside[p] ? 0 : 1;
const skein = morph(filled, ERODE_R, true);

const bg = new Uint8Array(N);
let bgCount = 0;
for (let p = 0; p < N; p++) { bg[p] = skein[p] ? 0 : 1; bgCount += bg[p]; }

// 가장자리 부드럽게 — 흐린 마스크를 바탕 안에서만 쓴다. sharp 가 1채널 입력을 3채널로 돌려줄 수 있어 첫 채널만 읽는다.
const bgImg = Buffer.from(bg.map((v) => (v ? 255 : 0)));
const blurredRaw = await sharp(bgImg, { raw: { width: W, height: H, channels: 1 } }).blur(2).raw().toBuffer({ resolveWithObject: true });
const ch = blurredRaw.info.channels;
const out = Buffer.from(data);
let touched = 0;
for (let p = 0; p < N; p++) {
  if (!bg[p]) continue;
  const a = blurredRaw.data[p * ch] / 255;
  if (a <= 0) continue;
  touched++;
  const i = p * C;
  for (let k = 0; k < 3; k++) out[i + k] = Math.min(255, Math.round(data[i + k] + LIFT * a));
}
console.log('background', (bgCount / N * 100).toFixed(1) + '%', 'touched', (touched / N * 100).toFixed(1) + '%', 'lift', LIFT);

const probe = (x0, y0, x1, y1, name) => {
  let d = 0, n = 0, l0 = 0;
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    const i = (y * W + x) * C;
    d += out[i] + out[i + 1] + out[i + 2] - (data[i] + data[i + 1] + data[i + 2]);
    l0 += data[i] + data[i + 1] + data[i + 2];
    n++;
  }
  console.log(name.padEnd(22), 'orig L', (l0 / n / 3).toFixed(1), 'lift', (d / n / 3).toFixed(2));
};
probe(10, 10, 60, 60, 'bg top-left');
probe(1900, 1200, 1950, 1240, 'bg bottom-right');
probe(560, 300, 620, 360, 'bg shadow near col1');
probe(1600, 250, 1700, 330, 'yarn 5dip petro');
probe(1600, 650, 1700, 730, 'yarn 5dip B1');
probe(1600, 1060, 1700, 1140, 'yarn 5dip B2');
probe(250, 150, 350, 230, 'yarn 1dip');
probe(950, 650, 1050, 730, 'yarn 3dip');

const webp = await sharp(out, { raw: { width: W, height: H, channels: C } }).webp({ quality: 92 }).toBuffer();
fs.writeFileSync(OUT, webp);
console.log('written', OUT, Math.round(webp.length / 1024) + 'KB');
