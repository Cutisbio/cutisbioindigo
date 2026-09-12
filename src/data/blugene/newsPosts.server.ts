import fs from 'node:fs';
import path from 'node:path';
import type { NewsPost } from './newsPosts';

/**
 * `content/news-posts.json` 을 읽는 **서버 전용** 부분.
 *
 * 타입과 순수 함수(`pick`, `parseYoutubeId` …)는 `newsPosts.ts` 에 있다.
 * 관리자 화면은 클라이언트 컴포넌트라 그쪽만 가져다 쓰며, `node:fs` 가 딸려 들어가면
 * 브라우저 번들을 만들 수 없어 파일을 나눴다.
 */

export const NEWS_POSTS_PATH = path.join(process.cwd(), 'content', 'news-posts.json');

/** 저장된 포스팅을 읽는다. 파일이 없으면 빈 목록. */
export function readNewsPosts(): NewsPost[] {
  try {
    const parsed = JSON.parse(fs.readFileSync(NEWS_POSTS_PATH, 'utf8'));
    return Array.isArray(parsed) ? (parsed as NewsPost[]) : [];
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== 'ENOENT') {
      console.error('news-posts.json 을 읽지 못했습니다:', (error as Error).message);
    }
    return [];
  }
}
