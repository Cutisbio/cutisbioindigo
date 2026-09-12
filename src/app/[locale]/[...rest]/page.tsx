import { notFound } from 'next/navigation';

/**
 * 언어 접두사는 맞지만 그 뒤 주소가 없는 경로(예: `/ko/없는페이지`)를 받아 404 로 넘긴다.
 *
 * 이 파일이 없으면 Next 는 어떤 라우트에도 걸리지 않은 주소를 **루트** `app/not-found.tsx`
 * 로 보내 버린다. 그러면 `[locale]/layout.tsx` 바깥이라 헤더·푸터·번역이 없는
 * 최소 화면만 나오고, 정작 언어별 404 인 `[locale]/not-found.tsx` 는 한 번도 쓰이지 않는다.
 * 여기서 `notFound()` 를 던져야 언어 레이아웃 안에서 그 화면이 렌더링된다.
 *
 * 실제 페이지가 있는 주소는 더 구체적인 라우트가 먼저 잡으므로 이 파일에 걸리지 않는다.
 * 로케일은 `[locale]/layout.tsx` 가 이미 고정하므로 여기서 `params` 를 읽지 않는다.
 */
export default function LocaleCatchAll() {
  notFound();
}
