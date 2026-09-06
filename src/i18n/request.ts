import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import type { Locale } from '@/data/blugene/site';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  // 지원하지 않는 로케일이면 기본 언어로 되돌린다
  const locale: Locale = routing.locales.includes(requested as Locale)
    ? (requested as Locale)
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
