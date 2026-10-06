import type { ComponentProps } from 'react';
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';
import LinkPending from '@/components/ui/LinkPending';

/**
 * 언어 접두사를 붙이는 내비게이션 — next-intl 의 createNavigation.
 *
 * 2026-10-06 routing.ts 에서 여기로 옮겼다. routing.ts 는 proxy(미들웨어)와 i18n/request 도 읽으므로 React 컴포넌트를
 * 들이지 않고 라우팅 설정만 남긴다. 화면 쪽은 Link · useRouter · usePathname · redirect · getPathname 을 여기서 가져온다.
 */
const navigation = createNavigation(routing);

export const { redirect, usePathname, useRouter, getPathname } = navigation;

const IntlLink = navigation.Link;

export type LinkProps = ComponentProps<typeof IntlLink>;

/**
 * 사이트의 모든 내부 링크. next-intl 의 Link 에 '기다리는 중' 표지(LinkPending)를 자동으로 넣는다.
 *
 * 왜 — 클릭 뒤 다음 화면 데이터가 올 때까지 0.6~1초가 비어 "눌렀는데 반응이 없다"로 보였다(2026-10-06 고객 지적).
 * 표지는 크기 0 이라 배치에 영향이 없고, 눌린 링크를 흐리게 하고 상단 진행 막대를 켠다. 서버 · 클라이언트 컴포넌트 어디서든
 * 그대로 쓴다(이 래퍼는 훅을 쓰지 않는다).
 */
export function Link({ children, ...props }: LinkProps) {
  return (
    <IntlLink {...props}>
      {children}
      <LinkPending />
    </IntlLink>
  );
}
