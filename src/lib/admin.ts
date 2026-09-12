import fs from 'node:fs';
import path from 'node:path';

/**
 * 관리자 화면과 그 API 는 **로컬 개발 서버에서만** 동작한다.
 *
 * 이 사이트는 정적 생성 후 Netlify 로 배포되며 로그인·데이터베이스가 없다.
 * 배포본에 편집 기능이 열려 있으면 누구나 소식란을 고칠 수 있으므로,
 * 운영 빌드에서는 화면과 API 를 모두 404 로 막는다.
 * 편집 결과는 저장소 파일로 남고, 커밋하면 Netlify 가 다시 배포한다.
 */
export const ADMIN_ENABLED = process.env.NODE_ENV !== 'production';

export const CONTENT_DIR = path.join(process.cwd(), 'content');
export const CANDIDATES_PATH = path.join(CONTENT_DIR, 'news-candidates.json');
export const POSTS_PATH = path.join(CONTENT_DIR, 'news-posts.json');
/** 업로드한 사진이 저장되는 곳. 사이트에서는 `/blugene/news/...` 로 참조한다. */
export const UPLOAD_DIR = path.join(process.cwd(), 'public', 'blugene', 'news');
export const UPLOAD_URL_PREFIX = '/blugene/news';

export type NewsCandidate = {
  date: string;
  category: string;
  title: string;
  summary: string;
  thumbnailAlt: string;
  link: string;
  approved: boolean;
  onTopic: boolean;
};

export function readJsonArray<T>(file: string): T[] {
  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    return [];
  }
}

/** 임시 파일에 쓴 뒤 바꿔치기한다 — 저장 도중 멈춰도 원본이 깨지지 않는다. */
export function writeJsonArray(file: string, value: unknown): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2) + '\n');
  fs.renameSync(tmp, file);
}
