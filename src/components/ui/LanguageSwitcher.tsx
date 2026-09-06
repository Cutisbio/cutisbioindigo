'use client';

import { useId, useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { LOCALES, LOCALE_LABELS, type Locale } from '@/data/blugene/site';

/**
 * 언어 선택기.
 * - 데스크톱과 모바일 모두 헤더 최상단 오른쪽에 **항상** 노출한다 (햄버거 안에 숨기지 않는다).
 * - 현재 페이지 경로와 쿼리스트링을 유지한 채 언어만 바꾼다. 언어 변경 시 홈으로 보내지 않는다.
 * - 언어 이름은 자체 표기를 우선한다. 국기만으로 언어를 나타내지 않는다.
 */
export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Nav');
  const selectId = useId();
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as Locale;
    if (next === locale) return;
    // 이 헤더는 모든 정적 페이지에 렌더되므로 useSearchParams 로 Suspense 경계를 만들지 않는다.
    // 이 핸들러는 사용자 상호작용 시점(클라이언트)에만 실행되므로 SSR 에 영향이 없다.
    const search = typeof window !== 'undefined' ? window.location.search : '';
    startTransition(() => {
      // pathname 은 locale 접두사를 제외한 현재 경로다 — 같은 화면과 선택 상태를 유지한 채 언어만 바꾼다.
      router.replace(search ? `${pathname}${search}` : pathname, { locale: next });
    });
  };

  return (
    <div
      className={`relative inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-washed)] px-3 py-1.5 text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ivory)] ${
        isPending ? 'opacity-60' : ''
      }`}
    >
      <svg
        aria-hidden="true"
        className="h-4 w-4 shrink-0 opacity-70"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z" />
      </svg>
      <label htmlFor={selectId} className="sr-only">
        {t('languageLabel')}
      </label>
      <select
        id={selectId}
        value={locale}
        onChange={handleChange}
        className="cursor-pointer appearance-none bg-transparent pr-4 text-sm font-medium focus:outline-none"
      >
        {LOCALES.map((l) => (
          <option key={l} value={l} className="text-[var(--color-ink)]">
            {LOCALE_LABELS[l].native}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 opacity-60"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}
