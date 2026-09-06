import { LOCALES, type Locale } from './site';

/**
 * 직접 작성한 소식(유튜브 영상 · 사진 포스팅).
 *
 * 자동 수집 기사(`messages/*.json` 의 `News.articles`)와 **파일을 분리한다.**
 * `scripts/update-news.js` 가 매달 그 배열을 통째로 다시 쓰기 때문에,
 * 같은 곳에 두면 직접 쓴 글이 지워진다.
 *
 * 이 파일은 관리자 화면(`/admin`, 개발 서버에서만 열린다)이 저장한다.
 * 손으로 고쳐도 되지만 6개 언어를 모두 채워야 한다 — `npm run check:blugene` 이 검사한다.
 */

/** 언어별 문자열. 6개 언어를 모두 채운다 (한 언어라도 비면 검사에서 걸린다). */
export type LocalizedText = Record<Locale, string>;

export type NewsPost = {
  /** 저장 순서와 무관하게 항목을 식별한다. 관리자 화면이 만든다. */
  id: string;
  /** `youtube` = 영상 링크, `post` = 사진 + 글 */
  type: 'youtube' | 'post';
  /** YYYY-MM-DD */
  date: string;
  title: LocalizedText;
  summary: LocalizedText;
  /** 분류 배지. 비워 두면 화면에서 유형에 따른 기본 라벨을 쓴다. */
  category?: LocalizedText;
  /** type === 'youtube' — 영상 ID (URL 전체가 아니다) */
  youtubeId?: string;
  /** type === 'post' — `/blugene/news/...` 로 시작하는 사이트 내부 경로 */
  image?: string;
  imageAlt?: LocalizedText;
  imageWidth?: number;
  imageHeight?: number;
  /** 선택. 외부 원문 링크 */
  link?: string;
};

/** 언어별 값을 꺼내되, 비어 있으면 한국어로 채운다(화면이 비는 것보다 낫다). */
export function pick(text: LocalizedText | undefined, locale: string): string {
  if (!text) return '';
  return text[locale as Locale] || text.ko || '';
}

/** 6개 언어가 모두 채워졌는지 — 관리자 화면 저장과 check:blugene 이 함께 쓴다. */
export function missingLocales(text: LocalizedText | undefined): Locale[] {
  if (!text) return [...LOCALES];
  return LOCALES.filter((l) => !text[l] || !text[l].trim());
}

/**
 * 유튜브 주소에서 영상 ID 만 뽑는다. 지원 형태:
 * `youtu.be/ID`, `youtube.com/watch?v=ID`, `youtube.com/embed/ID`, `youtube.com/shorts/ID`,
 * 그리고 ID 자체(11자).
 * 알아볼 수 없으면 `null` 을 돌려준다 — 호출한 쪽에서 오류로 처리한다.
 */
export function parseYoutubeId(input: string): string | null {
  const value = (input || '').trim();
  if (!value) return null;
  if (/^[\w-]{11}$/.test(value)) return value;

  let url: URL;
  try {
    url = new URL(value.startsWith('http') ? value : `https://${value}`);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, '');
  const id =
    host === 'youtu.be'
      ? url.pathname.slice(1)
      : url.searchParams.get('v') || url.pathname.replace(/^\/(embed|shorts|v)\//, '');
  return /^[\w-]{11}$/.test(id) ? id : null;
}
