import type { MetadataRoute } from 'next';
import {
  CONTENT_UPDATED_AT,
  FREQUENTLY_UPDATED_PATHS,
  LOCALES,
  ROUTES,
  SITE_URL,
  localeAlternates,
} from '@/data/blugene/site';

/**
 * 모든 언어의 모든 주요 경로를 사이트맵에 넣고, 각 항목에 hreflang 대체 URL을 함께 적는다.
 * 도메인은 `NEXT_PUBLIC_BASE_URL` 로 덮어쓸 수 있으며 기본값은 https://blugene.co 다.
 *
 * lastModified 는 콘텐츠 기준일(CONTENT_UPDATED_AT)로 고정한다.
 * 빌드 시각을 쓰면 배포할 때마다 60개 URL 전부가 '변경됨'으로 보고돼 신호가 무의미해진다.
 * 실제로 자주 바뀌는 경로(/news)만 배포 시각을 쓴다.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const buildTime = new Date();
  const contentDate = new Date(`${CONTENT_UPDATED_AT}T00:00:00Z`);

  return LOCALES.flatMap((locale) =>
    ROUTES.map((route) => ({
      url: `${SITE_URL}/${locale}${route.path === '/' ? '' : route.path}`,
      lastModified: FREQUENTLY_UPDATED_PATHS.has(route.path) ? buildTime : contentDate,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: { languages: localeAlternates(route.path) },
    }))
  );
}
