'use client';

import { useSyncExternalStore } from 'react';
import { navPending } from '@/components/ui/navPendingStore';

/**
 * 화면 전환 중임을 알리는 상단 진행 막대(2026-10-06).
 *
 * 링크 클릭(LinkPending)이나 언어 전환(LanguageSwitcher)으로 다음 화면 데이터를 기다리는 동안만 보인다.
 * 전환이 끝나면(주소가 바뀌면) 사라진다. 모양은 globals.css 의 .nav-progress 가 맡는다 — 헤더보다 위(z-index)에 고정하고,
 * 움직임 줄이기 설정에서는 애니메이션 없이 정지된 막대만 보인다.
 * 장식이므로 aria-hidden 이다. 화면 전환 자체는 브라우저 주소 변경으로 보조 기술에 전달된다.
 */
export default function NavProgress() {
  const count = useSyncExternalStore(navPending.subscribe, navPending.getSnapshot, navPending.getServerSnapshot);

  return <div aria-hidden="true" className="nav-progress" data-active={count > 0 ? '' : undefined} />;
}
