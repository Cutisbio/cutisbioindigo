/**
 * 「찾아오시는 길」 지도 — 구글 지도 embed 를 바로 보여 준다.
 *
 * 2026-10-06 고객 요청으로 바꿨다. 전에는 NewsPostCard 의 유튜브처럼 '누르기 전까지 구글에 요청하지 않는' 버튼이었는데,
 * 고객이 보기에 지도 자리가 비어 있어 "연결이 안 된 것"으로 읽혔다. 이제 페이지가 열리면 지도가 보인다.
 * - iframe 은 loading="lazy" 라 지도 자리가 화면에 가까워질 때 받는다. 구글 요청과 쿠키가 실리는 것은 고객이 받아들인 조건이다.
 * - 주소는 이 자리 위에 언제나 글로 적혀 있고, 아래에 구글 지도를 새 창으로 여는 링크를 둔다(지도가 막힌 환경 · 보조기기용).
 * - 상태가 없으므로 서버 컴포넌트다.
 */
export default function MapEmbed({
  src,
  title,
  openHref,
  openLabel,
  newTabLabel,
}: {
  /** 구글 지도 embed 주소(output=embed) */
  src: string;
  /** iframe 제목 — 보조기기가 읽는 이름 */
  title: string;
  /** 구글 지도를 새 창으로 여는 주소 */
  openHref: string;
  /** 그 링크의 글자 */
  openLabel: string;
  /** '새 창에서 열림' — 보조기기용 */
  newTabLabel: string;
}) {
  return (
    <div className="mt-6">
      <div className="relative h-[320px] w-full overflow-hidden rounded-md border border-[color:var(--color-washed)] bg-[var(--color-ivory)] sm:h-[380px]">
        <iframe
          src={src}
          width="100%"
          height="100%"
          className="absolute inset-0 border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          title={title}
        />
      </div>
      <a
        href={openHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-denim)] underline underline-offset-4 hover:text-[var(--color-indigo-deep)]"
      >
        {openLabel}
        <span aria-hidden="true">↗</span>
        <span className="sr-only"> ({newTabLabel})</span>
      </a>
    </div>
  );
}
