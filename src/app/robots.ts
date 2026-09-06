import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/data/blugene/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // `/admin` 은 운영 빌드에서 404 로 막혀 있지만(src/lib/admin.ts),
      // 크롤러가 굳이 찾아보지 않도록 여기에도 적어 둔다.
      disallow: ['/private/', '/admin', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
