'use client';

import { useState } from 'react';

/**
 * 「찾아오시는 길」 지도.
 *
 * NewsPostCard 의 유튜브와 같은 원칙을 지킨다 — **누르기 전까지 구글에 아무것도 요청하지 않는다.**
 * 처음부터 iframe 을 박아 두면 지도를 한 번도 보지 않는 방문자에게도 방문 즉시 구글 요청과
 * 쿠키가 실린다. 6개 언어를 서비스하는 사이트에서 지도만 예외를 두지 않는다.
 *
 * 주소는 이 자리 위에 언제나 글로 적혀 있으므로, 지도를 열지 않아도 찾아오는 데 문제가 없다.
 */
export default function MapEmbed({
  src,
  title,
  openLabel,
}: {
  src: string;
  title: string;
  openLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative mt-6 h-[320px] w-full overflow-hidden rounded-md border border-[color:var(--color-washed)] bg-[var(--color-ivory)] sm:h-[380px]">
      {open ? (
        <iframe
          src={src}
          width="100%"
          height="100%"
          className="absolute inset-0 border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={title}
        />
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-3 text-[var(--color-denim)] transition-colors hover:bg-[color:var(--color-washed)]/35 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--color-denim)]"
        >
          {/* 지도 핀 — 순수 장식이고, 의미는 아래 버튼 글자가 담는다 */}
          <svg
            viewBox="0 0 48 48"
            className="h-9 w-9"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M24 42c8-9.5 12-16.2 12-21a12 12 0 1 0-24 0c0 4.8 4 11.5 12 21Z" />
            <circle cx="24" cy="21" r="4.5" />
          </svg>
          <span className="text-sm font-semibold break-keep underline underline-offset-4">
            {openLabel}
          </span>
        </button>
      )}
    </div>
  );
}
