/**
 * 웹용 렌더 — 고객 제공 render.cjs 의 변형(2026-10-06).
 *
 * 원본과 다른 점
 * - 크기 · 비트레이트: 4K 24 Mbps(13 MB) 대신 1280×720, 2 Mbps. 히어로 오른쪽 열(최대 약 560px)에 쓰기에 충분하다.
 * - 바탕색: scene 의 흰 바탕 대신 사이트 히어로의 아이보리(#f6f3ec)로 그려 영상이 바탕에 녹아든다(index-web.html · scene-web.js).
 * - fast start: moov 상자를 mdat 앞에 둔다. 원본은 moov 가 파일 끝에 있어 브라우저가 13 MB 를 다 받아야 재생을 시작했다.
 * - 포스터: 마지막 프레임(완성된 구조식)을 PNG 로 저장해 <video poster> 와 움직임 줄이기 설정용 정지 화면으로 쓴다.
 *
 * 실행: PLAYWRIGHT_MODULE=<playwright 경로> CHROME=<chrome.exe> node animation/render-web.cjs
 * 출력: ../outputs/corn-to-indigo-720p.mp4, ../outputs/poster.png, ../outputs/preview_*.png
 */
const fs = require('fs'), path = require('path');
const PLAYWRIGHT = process.env.PLAYWRIGHT_MODULE || 'playwright';
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const { chromium } = require(PLAYWRIGHT);
const WIDTH = Number(process.env.WIDTH || 1280), HEIGHT = Math.round((WIDTH * 9) / 16), SCALE = WIDTH / 1920;
const BITRATE = Number(process.env.BITRATE || 2_000_000);
const root = path.resolve(__dirname, '..'), out = path.join(root, 'outputs');
fs.mkdirSync(out, { recursive: true });

const u32 = (n) => { const b = Buffer.alloc(4); b.writeUInt32BE(n >>> 0); return b; };
const u16 = (n) => { const b = Buffer.alloc(2); b.writeUInt16BE(n); return b; };
const zeros = (n) => Buffer.alloc(n), str = (s) => Buffer.from(s, 'ascii');
const box = (t, ...xs) => { const b = Buffer.concat(xs); return Buffer.concat([u32(b.length + 8), str(t), b]); };
const full = (t, v, f, ...xs) => box(t, Buffer.from([v, (f >>> 16) & 255, (f >>> 8) & 255, f & 255]), ...xs);
const matrix = () => Buffer.concat([u32(0x10000), u32(0), u32(0), u32(0), u32(0x10000), u32(0), u32(0), u32(0), u32(0x40000000)]);

function mp4(samples, config, w, h, fps, file) {
  const timescale = 30000, delta = timescale / fps, duration = samples.length * delta;
  const ftyp = box('ftyp', str('isom'), u32(0x200), str('isomiso2avc1mp41'));
  const data = Buffer.concat(samples.map((x) => x.data)), mdat = box('mdat', data);
  const buildMoov = (offset) => {
    const mvhd = full('mvhd', 0, 0, u32(0), u32(0), u32(timescale), u32(duration), u32(0x10000), u16(0x100), zeros(10), matrix(), zeros(24), u32(2));
    const tkhd = full('tkhd', 0, 7, u32(0), u32(0), u32(1), u32(0), u32(duration), zeros(8), u16(0), u16(0), u16(0), u16(0), matrix(), u32(w * 65536), u32(h * 65536));
    const mdhd = full('mdhd', 0, 0, u32(0), u32(0), u32(timescale), u32(duration), u16(0x55c4), u16(0));
    const hdlr = full('hdlr', 0, 0, u32(0), str('vide'), zeros(12), str('Blugene Scientific Animation\0'));
    const avc1 = box('avc1', zeros(6), u16(1), zeros(16), u16(w), u16(h), u32(0x480000), u32(0x480000), u32(0), u16(1), zeros(32), u16(0x18), u16(0xffff), box('avcC', config), box('colr', str('nclx'), u16(1), u16(1), u16(1), Buffer.from([0])));
    const stsd = full('stsd', 0, 0, u32(1), avc1);
    const stts = full('stts', 0, 0, u32(1), u32(samples.length), u32(delta));
    const stsc = full('stsc', 0, 0, u32(1), u32(1), u32(samples.length), u32(1));
    const stsz = full('stsz', 0, 0, u32(0), u32(samples.length), ...samples.map((s) => u32(s.data.length)));
    const stco = full('stco', 0, 0, u32(1), u32(offset));
    const keys = samples.map((s, i) => (s.key ? i + 1 : 0)).filter(Boolean);
    const stss = full('stss', 0, 0, u32(keys.length), ...keys.map(u32));
    const stbl = box('stbl', stsd, stts, stsc, stsz, stco, stss);
    const dinf = box('dinf', full('dref', 0, 0, u32(1), full('url ', 0, 1)));
    const minf = box('minf', full('vmhd', 0, 1, u16(0), zeros(6)), dinf, stbl);
    const trak = box('trak', tkhd, box('mdia', mdhd, hdlr, minf));
    return box('moov', mvhd, trak);
  };
  // fast start: ftyp · moov · mdat 순서. moov 길이는 offset 값과 무관하므로 한 번 만들어 길이를 재고 다시 만든다.
  const moovLength = buildMoov(0).length;
  const moov = buildMoov(ftyp.length + moovLength + 8);
  fs.writeFileSync(file, Buffer.concat([ftyp, moov, mdat]));
  return { frames: samples.length, duration: duration / timescale, bytes: fs.statSync(file).size, width: w, height: h, codec: 'H.264/AVC', fps, fastStart: true };
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: CHROME, args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('console', (m) => console.log(m.text()));
  await page.goto('file:///' + path.join(__dirname, 'index-web.html').replace(/\\/g, '/'));
  await page.evaluate(() => window.scene.init());
  // 미리보기 · 포스터
  const still = async (t, name, scale) => {
    const data = await page.evaluate(({ t, scale }) => { window.scene.draw(t, scale); return document.querySelector('canvas').toDataURL('image/png'); }, { t, scale });
    fs.writeFileSync(path.join(out, name), Buffer.from(data.split(',')[1], 'base64'));
  };
  for (const t of [1.6, 10.8, 21.9]) await still(t, `preview_${String(t).replace('.', '_')}.png`, 0.5);
  await still(21.9, 'poster.png', SCALE);

  let samples = [], config = null;
  await page.exposeFunction('receiveChunk', (b64, key, ts, description) => {
    samples.push({ data: Buffer.from(b64, 'base64'), key, ts });
    if (description) config = Buffer.from(description, 'base64');
  });
  await page.evaluate(async ({ scale, width, height, bitrate }) => {
    const scene = window.scene, canvas = document.querySelector('canvas'), fps = scene.fps, duration = scene.duration;
    let pending = [], error = null;
    const toBase64 = (arr) => { let s = ''; for (let i = 0; i < arr.length; i += 32768) s += String.fromCharCode(...arr.subarray(i, i + 32768)); return btoa(s); };
    const encoder = new VideoEncoder({
      output: (chunk, meta) => { const d = new Uint8Array(chunk.byteLength); chunk.copyTo(d); pending.push(window.receiveChunk(toBase64(d), chunk.type === 'key', chunk.timestamp, meta.decoderConfig?.description ? toBase64(new Uint8Array(meta.decoderConfig.description)) : null)); },
      error: (e) => { error = e.message; },
    });
    encoder.configure({ codec: 'avc1.640028', width, height, bitrate, framerate: fps, latencyMode: 'quality', hardwareAcceleration: 'prefer-software', avc: { format: 'avc' } });
    for (let n = 0; n < duration * fps; n++) {
      if (error) throw new Error(error);
      while (encoder.encodeQueueSize > 8) await new Promise((r) => setTimeout(r, 3));
      scene.draw(n / fps, scale);
      const frame = new VideoFrame(canvas, { timestamp: Math.round((n * 1e6) / fps), duration: Math.round(((n + 1) * 1e6) / fps) - Math.round((n * 1e6) / fps) });
      encoder.encode(frame, { keyFrame: n % (fps * 2) === 0 });
      frame.close();
      if (n % 90 === 0) console.log(`ENCODE ${n}/${duration * fps}`);
    }
    await encoder.flush(); await Promise.all(pending); encoder.close();
    if (error) throw new Error(error);
  }, { scale: SCALE, width: WIDTH, height: HEIGHT, bitrate: BITRATE });
  samples.sort((a, b) => a.ts - b.ts);
  if (!config) throw new Error('Encoder did not provide AVC config');
  const file = path.join(out, `corn-to-indigo-${HEIGHT}p.mp4`);
  const report = mp4(samples, config, WIDTH, HEIGHT, 30, file);
  fs.writeFileSync(path.join(out, `render_web_${HEIGHT}p.json`), JSON.stringify(report, null, 2));
  console.log('RENDER_DONE ' + JSON.stringify(report));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
