import {defineRouting} from 'next-intl/routing';

/**
 * 언어 라우팅 설정. proxy(미들웨어) · i18n/request · navigation 이 함께 읽는다.
 *
 * localeCookie: false (2026-10-06) — next-intl 미들웨어가 응답마다 붙이던 Set-Cookie: NEXT_LOCALE 을 끈다.
 * Netlify CDN 은 Set-Cookie 가 있는 응답을 엣지에 저장하지 않아, 모든 페이지 · RSC 응답이 매번 미국 원본까지 갔다
 * (엣지 적중 0.3초 vs 원본 0.6~1.2초, 배포 직후 4.6초). 언어는 주소(/ko, /en …)에 담겨 있어 쿠키 없이도 전환 · 유지가 되고,
 * 루트(/) 진입 때만 쿠키 대신 브라우저 언어(Accept-Language)로 판단한다.
 *
 * Link · useRouter · usePathname · redirect · getPathname 은 src/i18n/navigation.tsx 에서 가져온다.
 */
export const routing = defineRouting({
  locales: ['ko', 'ja', 'en', 'fr', 'it', 'zh', 'tr'],
  defaultLocale: 'ko',
  localeCookie: false
});
