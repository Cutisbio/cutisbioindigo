/**
 * 배포 직후 캐시 예열 — Netlify 가 "deploy-succeeded" 이벤트로 자동 호출하는 함수(이름이 곧 트리거다).
 *
 * 왜 — 운영 배포가 끝나면 Netlify 의 Durable 캐시와 엣지 캐시가 비워지고, 그 뒤 첫 방문자는 서버리스 함수의
 * 콜드 스타트까지 떠안아 4~5초를 기다렸다(2026-10-06 측정). 여기서 주요 페이지를 한 번씩 받아 두면 함수가 깨어 있고
 * Durable 캐시에 HTML 이 들어가 있어 첫 방문자도 0.6~1초 안에 받는다.
 *
 * 어떻게 — 운영(production) 배포일 때만, 7개 언어 × 아래 PATHS 를 한국어부터 차례로 받는다. 동기 함수의 기본 제한(10초)
 * 안에 끝나도록 동시 요청 수를 제한하고, 시간 예산(TIME_BUDGET_MS)이 다하면 남은 주소는 건너뛴다. 응답 본문은 읽지 않는다.
 * 실패해도 배포에는 영향이 없다(이 함수는 배포가 끝난 뒤에 돈다).
 *
 * 언어 목록은 src/i18n/routing.ts, 페이지 목록은 src/app/[locale]/ 과 같아야 한다 — 페이지를 더하거나 빼면 여기도 맞춘다.
 * (번들을 가볍게 두려고 src 를 import 하지 않고 적어 둔다.)
 */
const LOCALES = ['ko', 'en', 'ja', 'zh', 'fr', 'it', 'tr'];
const PATHS = [
  '',
  '/dyeing-printing',
  '/technology',
  '/data-certifications',
  '/brand',
  '/about',
  '/contact',
  '/news',
  '/blog',
  '/blog/sustainable-indigo',
];
const CONCURRENCY = 8;
/** 이 시각 이후로는 새 요청을 내지 않고, 진행 중인 요청도 끊는다 — 동기 함수 제한 10초 안에서 끝내기 위해 */
const HARD_DEADLINE_MS = 9300;
const REQUEST_TIMEOUT_MS = 5000;

function buildUrls(base) {
  const urls = [];
  // 한국어 홈 · 염색성능 · 데이터 인증처럼 가장 많이 가는 곳이 먼저 오도록 언어 바깥 루프, 경로 안쪽 루프.
  for (const locale of LOCALES) for (const path of PATHS) urls.push(`${base}/${locale}${path}`);
  return urls;
}

async function warm(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'user-agent': 'blugene-cache-warmer/1 (deploy-succeeded)', 'accept-language': 'ko' },
    });
    // 본문은 버린다 — 캐시에 들어가는 것은 서버 쪽에서 일어난다.
    await res.body?.cancel();
    return { url, status: res.status };
  } catch (error) {
    return { url, status: 0, error: error instanceof Error ? error.message : String(error) };
  } finally {
    clearTimeout(timer);
  }
}

export default async function handler(request) {
  const started = Date.now();
  let payload = {};
  try {
    const body = await request.json();
    payload = body?.payload ?? body ?? {};
  } catch {
    /* 본문이 없으면 수동 호출로 보고 그냥 예열한다 */
  }

  const context = payload.context ?? 'production';
  if (context !== 'production') {
    return Response.json({ skipped: true, reason: `context=${context}` });
  }

  const base = (process.env.URL || payload.ssl_url || payload.url || 'https://blugene.co').replace(/\/$/, '');
  const queue = buildUrls(base);
  const results = [];

  const workers = Array.from({ length: CONCURRENCY }, async () => {
    for (;;) {
      const remaining = HARD_DEADLINE_MS - (Date.now() - started);
      // 남은 시간이 한 요청의 평균(약 1초)보다 짧으면 더 내지 않는다
      if (!queue.length || remaining < 1000) return;
      results.push(await warm(queue.shift(), Math.min(REQUEST_TIMEOUT_MS, remaining)));
    }
  });
  await Promise.all(workers);

  const failed = results.filter((r) => r.status !== 200);
  const summary = {
    base,
    warmed: results.length - failed.length,
    failed: failed.length,
    skipped: queue.length,
    ms: Date.now() - started,
    failures: failed.slice(0, 10).map((r) => `${r.url.replace(base, '')} ${r.status}${r.error ? ` ${r.error}` : ''}`),
  };
  console.log('[deploy-succeeded] cache warm-up', JSON.stringify(summary));
  return Response.json(summary);
}
