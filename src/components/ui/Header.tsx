'use client';

import { useEffect, useRef, useState } from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import Wordmark from '@/components/blugene/Wordmark';
import { PRIMARY_NAV } from '@/data/blugene/site';

/**
 * BrandHeader — Blugene by CutisBio.
 *
 * 밝은 콘텐츠 위에서도 항상 읽히도록 **불투명 배경**을 유지한다(투명 헤더를 쓰지 않는다).
 * 언어 선택기는 데스크톱·모바일 모두 오른쪽 상단에 항상 보인다.
 *
 * 가로 메뉴는 xl(1280px) 이상에서만 편다. 메뉴가 5개이고 언어별 라벨 길이가 달라
 * (영어 About CutisBio / 튀르키예어 CutisBio hakkında 등) 1024px 에서는 넘쳤다.
 * 그 아래 폭에서는 햄버거 메뉴로 같은 항목을 모두 노출한다.
 */
export default function Header() {
  const t = useTranslations('Nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 메뉴가 열려 있을 때 Escape 로 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      // 키보드로 메뉴를 닫으면 포커스를 토글 버튼으로 되돌린다.
      toggleRef.current?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-[var(--color-ivory)]/95 backdrop-blur transition-shadow ${
        scrolled ? 'border-[color:var(--color-washed)] shadow-sm' : 'border-transparent'
      }`}
    >
      <nav
        aria-label={t('menu')}
        className="mx-auto flex h-[var(--header-h)] max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        <Wordmark size="md" label={t('homeAria')} />

        {/* 데스크톱 메뉴 */}
        <ul className="hidden items-center gap-6 xl:flex">
          {PRIMARY_NAV.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`whitespace-nowrap break-keep text-[0.95rem] font-semibold transition-colors ${
                  isActive(item.href)
                    ? 'text-[var(--color-indigo-deep)] underline decoration-2 underline-offset-8'
                    : 'text-[var(--color-ink)] hover:text-[var(--color-denim)]'
                }`}
              >
                {t(item.key)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/contact"
            className="hidden rounded-md bg-[var(--color-indigo-deep)] px-5 py-2.5 text-sm font-semibold whitespace-nowrap break-keep text-white transition-colors hover:bg-[var(--color-denim)] sm:inline-block"
          >
            {t('sampleInquiry')}
          </Link>

          {/* 언어 선택기 — 모든 화면 크기에서 상시 노출 */}
          <div className="border-l border-[color:var(--color-washed)] pl-2 sm:pl-3">
            <LanguageSwitcher />
          </div>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t('closeMenu') : t('openMenu')}
            className="-mr-1 rounded-md p-2 text-[var(--color-ink)] xl:hidden"
          >
            <svg
              aria-hidden="true"
              focusable="false"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              {open ? (
                <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* 모바일 메뉴 — 언어 선택기는 위쪽 바에 그대로 남아 있다 */}
      {open && (
        <div
          id="mobile-menu"
          className="border-t border-[color:var(--color-washed)] bg-[var(--color-ivory)] xl:hidden"
        >
          <ul className="mx-auto flex max-w-[1280px] flex-col px-4 py-3 sm:px-6">
            {PRIMARY_NAV.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className="block border-b border-[color:var(--color-washed)]/60 py-3.5 text-base font-semibold break-keep text-[var(--color-ink)]"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
            <li className="pt-4 pb-2">
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="block rounded-md bg-[var(--color-indigo-deep)] px-5 py-3.5 text-center text-base font-semibold break-keep text-white"
              >
                {t('sampleInquiry')}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
