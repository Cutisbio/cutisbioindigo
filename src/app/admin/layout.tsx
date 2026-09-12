import '../globals.css';

/**
 * 관리자 화면 전용 루트 레이아웃.
 *
 * 이 프로젝트의 루트 레이아웃은 `[locale]/layout.tsx` 하나뿐인데, 관리자 화면은 언어 접두사
 * 바깥(`/admin`)에 있어 그 레이아웃이 씌워지지 않는다. 그래서 `<html>` · `<body>` 를
 * 여기서 직접 만든다 (Next 의 다중 루트 레이아웃 구성).
 *
 * 운영자만 보는 화면이라 언어 전환 대상이 아니며 문구도 한국어로만 둔다.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full bg-[var(--color-paper)] font-sans text-[var(--color-ink)] antialiased">
        {children}
      </body>
    </html>
  );
}
