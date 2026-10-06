'use client';

import { useEffect } from 'react';
import { useLinkStatus } from 'next/link';
import { navPending } from '@/components/ui/navPendingStore';

/**
 * 링크를 눌렀는데 아직 다음 화면 데이터가 오지 않은 동안을 알리는 표지(2026-10-06).
 *
 * 왜 — 이 사이트는 Netlify 에서 화면 전환 데이터(RSC)를 매번 미국 원본까지 받아 와서 클릭 뒤 0.6~1초가 비었다.
 * 선행 로드(prefetch)가 끝난 링크는 바로 넘어가지만, 끝나기 전에 누르면 "눌렀는데 아무 일도 없다"로 보였다.
 *
 * 어떻게 — Next 의 useLinkStatus 로 이 링크의 pending 을 읽어
 *   1) 눌린 링크 자체에 data-link-pending 을 켠다 → globals.css 의 a:has([data-link-pending]) 가 흐리게 + 진행 커서로 바꾼다.
 *   2) navPending 에 알려 상단 진행 막대(NavProgress)를 켠다.
 * 이 요소는 크기 0 으로 항상 그려 두므로(문서 권고) 배치가 밀리지 않는다. 장식이라 aria-hidden 이다.
 *
 * 쓰는 곳 — src/i18n/navigation.tsx 의 Link 가 모든 링크 안에 자동으로 넣는다. 직접 쓰지 않아도 된다.
 * useLinkStatus 는 Link 의 자손에서만 동작한다(next-intl 의 Link 도 안에서 next/link 를 그리므로 된다).
 */
export default function LinkPending() {
  const { pending } = useLinkStatus();

  useEffect(() => {
    if (!pending) return;
    navPending.begin();
    return () => navPending.end();
  }, [pending]);

  return <span aria-hidden="true" className="link-pending" data-link-pending={pending ? '' : undefined} />;
}
