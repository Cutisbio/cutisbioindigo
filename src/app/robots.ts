import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/data/blugene/site';

/** 크롤러가 들어오면 안 되는 경로. `/admin` 은 운영 빌드에서 404 로 막혀 있지만(src/lib/admin.ts) 여기에도 적어 둔다. */
const DISALLOW = ['/private/', '/admin', '/api/'];

/**
 * 검색엔진과 AI 답변 엔진의 크롤러. `*` 규칙으로도 허용되지만, 사이트가 AI 인용(GEO · AEO)을 의도적으로
 * 허용한다는 뜻을 분명히 하려고 이름을 적는다(2026-09-28). 같은 경로만 막는다. 요약용 안내는 /llms.txt.
 */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Amazonbot',
  'meta-externalagent',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      { userAgent: AI_CRAWLERS, allow: '/', disallow: DISALLOW },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
