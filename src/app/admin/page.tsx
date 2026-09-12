import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ADMIN_ENABLED } from '@/lib/admin';
import AdminNews from './AdminNews';

/**
 * 소식 관리 화면. **로컬 개발 서버(`npm run dev`)에서만 열린다.**
 *
 * 이 사이트는 정적 생성 후 Netlify 로 배포되고 로그인 기능이 없다. 배포본에 편집 화면이
 * 열려 있으면 누구나 소식란을 고칠 수 있으므로 운영 빌드에서는 404 로 막는다
 * (API 도 같은 방식으로 막는다 — src/lib/admin.ts).
 *
 * `[locale]` 바깥에 있어 언어 전환 대상이 아니고 sitemap 에도 실리지 않는다.
 * 화면 문구는 운영자용이라 한국어로만 둔다.
 */
export const metadata: Metadata = {
  title: '소식 관리 | Blugene 관리자',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  if (!ADMIN_ENABLED) notFound();
  return <AdminNews />;
}
