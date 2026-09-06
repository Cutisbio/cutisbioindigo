import { GoogleAuth } from 'google-auth-library';

/**
 * Google Cloud Translation v3 (Advanced) 어댑터.
 *
 * 앞의 세 어댑터와 **성격이 다릅니다.** Claude · OpenAI · Gemini 는 언어 모델이라
 * 용어집과 규칙을 지시문으로 받지만, 이쪽은 전용 번역 엔진이라 받을 수 있는 것이
 * `glossary` 하나뿐입니다. 그래서:
 *
 *   - `content/glossary.json` 의 `terms` → GCP 에 만들어 둔 glossary 리소스로 대체 가능
 *   - `keepAsIs` → glossary 에 "그대로" 항목으로 넣어야 함
 *   - `rules` (불검출을 0 으로 옮기지 말 것 등) → **전달할 방법이 없음**
 *
 * 이 차이 자체가 비교의 결과물입니다. 보고서에 그대로 적힙니다.
 *
 * ## 필요한 것
 *   GOOGLE_CLOUD_PROJECT   GCP 프로젝트 ID (필수)
 *   GOOGLE_TRANSLATE_LOCATION   기본 global. glossary 를 쓰려면 us-central1 등 리전 필요
 *   GOOGLE_TRANSLATE_GLOSSARY   (선택) glossary 리소스 이름 또는 짧은 id
 *   인증: 아래 둘 중 하나
 *     - GOOGLE_APPLICATION_CREDENTIALS 로 서비스 계정 JSON 지정 (권장)
 *     - GOOGLE_ACCESS_TOKEN 에 `gcloud auth print-access-token` 결과 (1시간짜리, 임시 확인용)
 *
 * API 키만으로는 안 됩니다 — v3 는 OAuth 를 요구합니다. 이것이 다른 셋과의 실질적인
 * 도입 장벽 차이입니다.
 */
export const id = 'google-mt';
export const label = 'Google Cloud Translation v3';
export const envKey = 'GOOGLE_CLOUD_PROJECT';
export const model = () =>
  process.env.GOOGLE_TRANSLATE_GLOSSARY ? 'v3 + glossary' : 'v3 (glossary 없음)';

/** 이 엔진이 무엇을 받을 수 있는지 — 보고서가 이걸 그대로 적는다 */
export const capabilities = {
  glossary: Boolean(process.env.GOOGLE_TRANSLATE_GLOSSARY),
  rules: false,
  note: '전용 번역 엔진이라 문장 단위 규칙을 지시할 수 없습니다. 용어는 GCP glossary 리소스로만 고정됩니다.',
};

/** next-intl 로케일 → Cloud Translation 언어 코드 */
const TARGET_CODE = { en: 'en', ja: 'ja', zh: 'zh-CN', bn: 'bn', tr: 'tr' };

let cachedToken = null;

async function accessToken() {
  if (process.env.GOOGLE_ACCESS_TOKEN) return process.env.GOOGLE_ACCESS_TOKEN;
  if (cachedToken && cachedToken.expiry > Date.now() + 60_000) return cachedToken.value;

  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-translation'],
  });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  const value = typeof token === 'string' ? token : token?.token;
  if (!value) throw new Error('GCP 액세스 토큰을 얻지 못했습니다.');
  cachedToken = { value, expiry: Date.now() + 50 * 60_000 };
  return value;
}

export async function translate({ strings, locale }) {
  const project = process.env.GOOGLE_CLOUD_PROJECT;
  if (!project) throw new Error('GOOGLE_CLOUD_PROJECT 가 필요합니다.');
  const target = TARGET_CODE[locale];
  if (!target) throw new Error(`지원하지 않는 언어입니다: ${locale}`);

  // glossary 를 쓰려면 리전이 필요하다 — global 에는 glossary 를 둘 수 없다
  const location = process.env.GOOGLE_TRANSLATE_LOCATION || 'global';
  const glossaryId = process.env.GOOGLE_TRANSLATE_GLOSSARY;
  if (glossaryId && location === 'global') {
    throw new Error(
      'glossary 를 쓰려면 GOOGLE_TRANSLATE_LOCATION 을 리전(예: us-central1)으로 지정해야 합니다.'
    );
  }

  const parent = `projects/${project}/locations/${location}`;
  const body = {
    contents: strings,
    mimeType: 'text/plain',
    sourceLanguageCode: 'ko',
    targetLanguageCode: target,
  };
  if (glossaryId) {
    body.glossaryConfig = {
      glossary: glossaryId.startsWith('projects/')
        ? glossaryId
        : `${parent}/glossaries/${glossaryId}`,
    };
  }

  const response = await fetch(`https://translation.googleapis.com/v3/${parent}:translateText`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${await accessToken()}`,
      'x-goog-user-project': project,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(180_000),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Cloud Translation ${response.status}: ${text.slice(0, 300)}`);
  }

  const data = await response.json();
  // glossary 를 쓰면 결과가 glossaryTranslations 로 온다
  const rows = data.glossaryTranslations?.length ? data.glossaryTranslations : data.translations;
  if (!Array.isArray(rows) || rows.length !== strings.length) {
    throw new Error(`응답 개수가 다릅니다 (요청 ${strings.length} / 응답 ${rows?.length ?? 0}).`);
  }

  return {
    translations: rows.map((r) => String(r.translatedText ?? '')),
    // 문자 과금이라 토큰 개념이 없다. 보낸 글자 수를 대신 적어 둔다.
    usage: { input: strings.join('').length, output: 0 },
  };
}
