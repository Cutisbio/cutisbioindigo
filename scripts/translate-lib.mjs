import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

/** 여러 스크립트가 함께 쓰는 부분 — 경로, 변경 감지, 엔진 선택. */

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const LOCALES = ['ko', 'en', 'ja', 'zh', 'bn', 'tr'];
export const TARGETS = LOCALES.filter((l) => l !== 'ko');

export const GLOSSARY_PATH = path.join(ROOT, 'content', 'glossary.json');
export const STATE_PATH = path.join(ROOT, 'content', 'translation-state.json');

/**
 * 번역하지 않는 구역.
 * - `News.articles` : 매달 `scripts/update-news.js` 가 수집·번역해 통째로 다시 쓴다.
 *   같은 네임스페이스라도 `News.title` 같은 화면 문구는 여기서 번역해야 한다
 *   (예전에 `News.` 전체를 막아 두어 새 키가 5개 언어에 영원히 안 채워졌다).
 * - `About.missionText` : 회사가 정한 고정 영문 문구라 언어를 바꾸지 않는다.
 */
export const SKIP_PREFIXES = ['News.articles'];
export const SKIP_KEYS = new Set(['About.missionText']);

export const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));

export function writeJson(p, value) {
  const tmp = `${p}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2) + '\n');
  fs.renameSync(tmp, p);
}

/** 한국어 원문의 지문. 이 값이 바뀌면 번역이 낡은 것이다. */
export const hash = (text) =>
  crypto.createHash('sha256').update(String(text), 'utf8').digest('hex').slice(0, 16);

/** 중첩 객체·배열을 `A.b[0].c` 형태의 경로로 펼친다 */
export function flatten(node, prefix = '', out = new Map()) {
  if (Array.isArray(node)) {
    node.forEach((v, i) => flatten(v, `${prefix}[${i}]`, out));
  } else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      flatten(v, prefix ? `${prefix}.${k}` : k, out);
    }
  } else {
    out.set(prefix, node);
  }
  return out;
}

/** `A.b[0].c` 경로에 값을 써 넣는다 (없는 중간 노드는 만들지 않는다 — 키 구조는 ko 를 따른다) */
export function setByPath(root, pathStr, value) {
  const parts = pathStr.match(/[^.[\]]+/g) ?? [];
  let cur = root;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = /^\d+$/.test(parts[i + 1]) ? parts[i] : parts[i];
    if (cur[key] === undefined) cur[key] = /^\d+$/.test(parts[i + 1]) ? [] : {};
    cur = cur[key];
  }
  cur[parts[parts.length - 1]] = value;
}

export const isTranslatable = (key, value) =>
  typeof value === 'string' &&
  value.trim() !== '' &&
  !SKIP_PREFIXES.some((p) => key.startsWith(p)) &&
  !SKIP_KEYS.has(key);

export function loadState() {
  try {
    return readJson(STATE_PATH);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return { version: 1, entries: {} };
  }
}

/**
 * 번역이 필요한 항목을 고른다.
 * - 상태 파일에 기록이 없다 → 처음 보는 문구
 * - 기록된 원문 지문이 현재 한국어와 다르다 → 한국어가 바뀌었으니 다시 번역
 * 그 외에는 건드리지 않는다. **이것이 API 호출을 줄이는 핵심이다.**
 */
export function findStale(koLeaves, state, locale) {
  const stale = [];
  for (const [key, value] of koLeaves) {
    if (!isTranslatable(key, value)) continue;
    const recorded = state.entries[key]?.[locale];
    if (recorded !== hash(value)) stale.push({ key, ko: value });
  }
  return stale;
}

const ENGINE_FILES = {
  claude: 'claude.mjs',
  openai: 'openai.mjs',
  gemini: 'gemini.mjs',
  // 전용 번역 엔진. 앞의 셋과 달리 규칙을 지시할 수 없다 — google-mt.mjs 주석 참고.
  'google-mt': 'google-mt.mjs',
};

export async function loadEngine(name) {
  const file = ENGINE_FILES[name];
  if (!file) {
    throw new Error(`모르는 엔진입니다: ${name} (가능: ${Object.keys(ENGINE_FILES).join(', ')})`);
  }
  return import(`./translate-engines/${file}`);
}

export const ENGINE_NAMES = Object.keys(ENGINE_FILES);

/** `.env.local` 을 읽어 process.env 에 넣는다 (git 에 올라가지 않는 파일) */
export function loadEnvLocal() {
  const file = path.join(ROOT, '.env.local');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!match) continue;
    const value = match[2].trim().replace(/^["']|["']$/g, '');
    if (!process.env[match[1]]) process.env[match[1]] = value;
  }
}

/** 긴 목록을 나눠 보낸다 — 한 번에 너무 많이 넣으면 응답이 잘린다 */
export function chunk(items, size) {
  const out = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}
