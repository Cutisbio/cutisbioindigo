import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames.
  // `admin` 과 `api` 는 언어 접두사를 붙이지 않는다 — 운영자 전용 화면이라 번역 대상이 아니고,
  // 여기에 걸리면 `/admin` 이 `/ko/admin` 으로 넘어가 404 가 난다.
  matcher: ['/', '/(ko|ja|en|fr|it|zh|tr)/:path*', '/((?!api|admin|_next|_vercel|.*\\..*).*)']
};
