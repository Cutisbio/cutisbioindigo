/**
 * 사이트 전역 설정 — 도메인, 라우트, 내비게이션
 * ------------------------------------------------
 * 브랜드명은 정확히 `Blugene` 이다. 첫 B 만 대문자를 쓴다.
 * (BluGene / Bluegene / BluGen 등으로 변형하지 않는다. 상표 기호 ® 를 붙이지 않는다.)
 */

export const BRAND = {
  name: 'Blugene',
  lockup: 'Blugene by CutisBio',
  company: 'CutisBio',
  companyKo: '큐티스바이오',
  companyLegal: 'CutisBio Co., Ltd.',
} as const;

/**
 * 운영 도메인. 배포 환경에서 `NEXT_PUBLIC_BASE_URL` 로 덮어쓸 수 있다.
 * www.blugene.co 는 netlify.toml 에서 apex 로 301 리디렉션한다.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_BASE_URL || 'https://blugene.co').replace(/\/$/, '');

/** 이전 도메인. 기존 URL 은 그대로 살아 있어야 하며 canonical 만 새 도메인을 가리킨다. */
export const LEGACY_DOMAINS = ['https://cutisbioindigo.kr'] as const;

/** 큐티스바이오 회사 공식 홈페이지. 회사소개 페이지의 바로가기 버튼이 새 창으로 연다 (2026-09-12 고객 지정). */
export const CORPORATE_SITE_URL = 'https://www.cutisbio.com';

/** 순서가 곧 언어 선택기의 순서다 (2026-09-11 고객 지정: 한국어 · 일본어 · 영어 · 프랑스어 · 이탈리아어 · 중국어 · 터키어). 벵골어는 같은 날 뺐다. */
export const LOCALES = ['ko', 'ja', 'en', 'fr', 'it', 'zh', 'tr'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'ko';

/** 언어 선택기 표기 — 자체 표기를 우선한다. 국기만으로 언어를 표시하지 않는다. */
export const LOCALE_LABELS: Record<Locale, { native: string; code: string }> = {
  ko: { native: '한국어', code: 'KO' },
  ja: { native: '日本語', code: 'JA' },
  en: { native: 'English', code: 'EN' },
  fr: { native: 'Français', code: 'FR' },
  it: { native: 'Italiano', code: 'IT' },
  zh: { native: '中文', code: 'ZH' },
  tr: { native: 'Türkçe', code: 'TR' },
};

/** OpenGraph locale 매핑 */
export const OG_LOCALES: Record<Locale, string> = {
  ko: 'ko_KR',
  ja: 'ja_JP',
  en: 'en_US',
  fr: 'fr_FR',
  it: 'it_IT',
  zh: 'zh_CN',
  tr: 'tr_TR',
};

/** 사이트맵·hreflang 에 포함하는 모든 경로 (locale 접두사 제외) */
export const ROUTES = [
  { path: '/', priority: 1.0, changeFrequency: 'monthly' as const },
  { path: '/brand', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/technology', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/dyeing-printing', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/data-certifications', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/about', priority: 0.6, changeFrequency: 'yearly' as const },
  { path: '/news', priority: 0.6, changeFrequency: 'weekly' as const },
  { path: '/blog', priority: 0.5, changeFrequency: 'monthly' as const },
  { path: '/blog/sustainable-indigo', priority: 0.5, changeFrequency: 'yearly' as const },
];

/**
 * 상단 메뉴.
 * 제품·근거를 앞에 두고 회사·소식을 뒤에 둔다.
 * 라벨은 messages 의 `Nav.<key>` 에서 온다 (ko: 회사소개 / en: About Us).
 *
 * ⚠ 항목을 늘리면 라벨이 긴 언어(영어·튀르키예어)에서 헤더를 넘칠 수 있다.
 *   추가한 뒤에는 6개 언어 × 1024/1280/1440px 폭을 반드시 실측한다.
 */
export const PRIMARY_NAV = [
  { key: 'brand', href: '/brand' },
  { key: 'technology', href: '/technology' },
  { key: 'dyeingPrinting', href: '/dyeing-printing' },
  { key: 'dataCertifications', href: '/data-certifications' },
  { key: 'about', href: '/about' },
  { key: 'news', href: '/news' },
] as const;

/**
 * 푸터 전용 항목. 상단 메뉴와 중복되지 않게 유지한다 (푸터는 PRIMARY_NAV + FOOTER_NAV 를 이어 붙인다).
 * '인사이트'(/blog)는 2026-09-12 고객 요청으로 뺐다. 블로그 주소(/blog, /blog/sustainable-indigo)는 색인된 URL 이라
 * 페이지와 sitemap 에는 그대로 두고 메뉴에서만 가리키지 않는다.
 */
export const FOOTER_NAV = [{ key: 'contact', href: '/contact' }] as const;

/** 언어별 대체 URL — hreflang / alternates 생성용 */
export function localeAlternates(path: string): Record<string, string> {
  const clean = path === '/' ? '' : path;
  const map: Record<string, string> = {};
  for (const l of LOCALES) map[l] = `${SITE_URL}/${l}${clean}`;
  map['x-default'] = `${SITE_URL}/${DEFAULT_LOCALE}${clean}`;
  return map;
}

export function canonicalUrl(locale: string, path: string): string {
  const clean = path === '/' ? '' : path;
  return `${SITE_URL}/${locale}${clean}`;
}

/** 페이지별 lastModified — 사이트맵이 배포마다 전체 URL을 '변경됨'으로 보고하지 않도록 고정한다. */
export const CONTENT_UPDATED_AT = '2026-09-06';

/** 실제로 자주 바뀌는 경로만 배포 시각을 쓴다. */
export const FREQUENTLY_UPDATED_PATHS = new Set(['/news']);

/**
 * 페이지 메타데이터 생성 헬퍼.
 * canonical · hreflang · OpenGraph URL 을 한 곳에서 만들어 페이지마다 빠뜨리지 않게 한다.
 */
export function buildPageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
}) {
  const url = canonicalUrl(locale, path);
  return {
    title,
    description,
    alternates: { canonical: url, languages: localeAlternates(path) },
    openGraph: { title, description, url, type: 'website' as const },
  };
}
