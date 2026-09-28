import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { LEGACY_HOSTS, SITE_URL } from './data/blugene/site';

const intl = createMiddleware(routing);

/**
 * 이전 도메인(cutisbioindigo.kr · www)으로 들어온 요청은 같은 경로 · 쿼리의 blugene.co 로 301 이동시킨다.
 * netlify.toml 에도 같은 규칙이 있지만, 이 프록시(edge)가 그 규칙보다 먼저 돌아 루트(/)를 /ko 로 307 이동시켜 버리므로
 * 여기서 먼저 처리해야 루트도 한 번에 301 로 넘어간다(2026-09-28). 그 밖의 요청은 next-intl 의 언어 처리로 넘긴다.
 * 루트(/)는 새 홈의 언어 감지(307)를 한 번 더 거치지 않도록 기본 언어 홈(/ko)으로 곧장 보낸다 — netlify.toml 규칙과 같은 목적지.
 */
export default function proxy(request: NextRequest) {
  const host = (request.headers.get('host') ?? '').toLowerCase().replace(/:d+$/, '');
  if ((LEGACY_HOSTS as readonly string[]).includes(host)) {
    const { pathname, search } = request.nextUrl;
    const target = pathname === '/' ? `/${routing.defaultLocale}` : pathname;
    return NextResponse.redirect(`${SITE_URL}${target}${search}`, 301);
  }
  return intl(request);
}

export const config = {
  // Match only internationalized pathnames.
  // `admin` 과 `api` 는 언어 접두사를 붙이지 않는다 — 운영자 전용 화면이라 번역 대상이 아니고,
  // 여기에 걸리면 `/admin` 이 `/ko/admin` 으로 넘어가 404 가 난다.
  matcher: ['/', '/(ko|ja|en|fr|it|zh|tr)/:path*', '/((?!api|admin|_next|_vercel|.*\..*).*)'],
};
