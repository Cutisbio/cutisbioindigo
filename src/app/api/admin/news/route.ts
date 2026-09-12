import { NextResponse } from 'next/server';
import {
  ADMIN_ENABLED,
  CANDIDATES_PATH,
  POSTS_PATH,
  readJsonArray,
  writeJsonArray,
  type NewsCandidate,
} from '@/lib/admin';
import { missingLocales, type NewsPost } from '@/data/blugene/newsPosts';

/** 개발 서버 전용이므로 정적 생성 대상이 아니다 */
export const dynamic = 'force-dynamic';

const denied = () => NextResponse.json({ error: 'not found' }, { status: 404 });

/** 검토 목록과 직접 쓴 소식을 함께 돌려준다 */
export async function GET() {
  if (!ADMIN_ENABLED) return denied();
  return NextResponse.json({
    candidates: readJsonArray<NewsCandidate>(CANDIDATES_PATH),
    posts: readJsonArray<NewsPost>(POSTS_PATH),
  });
}

/**
 * 승인 상태 저장. 본문은 `{ approvals: { "<link>": true|false } }`.
 * 후보 목록 자체는 수집 스크립트가 관리하므로, 여기서는 `approved` 만 바꾼다.
 */
export async function PATCH(request: Request) {
  if (!ADMIN_ENABLED) return denied();

  let body: { approvals?: Record<string, boolean> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON 을 읽지 못했습니다.' }, { status: 400 });
  }
  const approvals = body.approvals;
  if (!approvals || typeof approvals !== 'object') {
    return NextResponse.json({ error: 'approvals 가 필요합니다.' }, { status: 400 });
  }

  const candidates = readJsonArray<NewsCandidate>(CANDIDATES_PATH);
  let changed = 0;
  for (const candidate of candidates) {
    if (candidate.link in approvals) {
      const next = approvals[candidate.link] === true;
      if (candidate.approved !== next) changed++;
      candidate.approved = next;
    }
  }
  writeJsonArray(CANDIDATES_PATH, candidates);

  return NextResponse.json({
    saved: true,
    changed,
    approved: candidates.filter((c) => c.approved).length,
  });
}

/** 직접 쓴 소식 저장(추가·수정). 본문은 NewsPost 하나. */
export async function PUT(request: Request) {
  if (!ADMIN_ENABLED) return denied();

  let post: NewsPost;
  try {
    post = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON 을 읽지 못했습니다.' }, { status: 400 });
  }

  const problems: string[] = [];
  if (!post.id) problems.push('id 가 없습니다.');
  if (post.type !== 'youtube' && post.type !== 'post') problems.push('type 이 youtube 또는 post 여야 합니다.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date || '')) problems.push('날짜는 YYYY-MM-DD 형식이어야 합니다.');
  if (post.type === 'youtube' && !/^[\w-]{11}$/.test(post.youtubeId || '')) {
    problems.push('유튜브 영상 주소를 알아보지 못했습니다.');
  }
  if (post.type === 'post' && !post.image) problems.push('사진을 올려 주세요.');

  // 6개 언어가 다 차 있어야 한다. 한 언어라도 비면 그 화면만 글이 빠져 보인다.
  for (const [label, value] of [
    ['제목', post.title],
    ['요약', post.summary],
  ] as const) {
    const missing = missingLocales(value);
    if (missing.length) problems.push(`${label}: ${missing.join(', ')} 가 비어 있습니다.`);
  }

  if (problems.length) return NextResponse.json({ error: problems.join('\n') }, { status: 400 });

  const posts = readJsonArray<NewsPost>(POSTS_PATH);
  const index = posts.findIndex((p) => p.id === post.id);
  if (index >= 0) posts[index] = post;
  else posts.push(post);
  posts.sort((a, b) => b.date.localeCompare(a.date));
  writeJsonArray(POSTS_PATH, posts);

  return NextResponse.json({ saved: true, count: posts.length });
}

/** 직접 쓴 소식 삭제. `?id=...` */
export async function DELETE(request: Request) {
  if (!ADMIN_ENABLED) return denied();

  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id 가 필요합니다.' }, { status: 400 });

  const posts = readJsonArray<NewsPost>(POSTS_PATH);
  const remaining = posts.filter((p) => p.id !== id);
  if (remaining.length === posts.length) {
    return NextResponse.json({ error: '해당 글을 찾지 못했습니다.' }, { status: 404 });
  }
  writeJsonArray(POSTS_PATH, remaining);
  // 업로드한 사진 파일은 지우지 않는다 — 다른 글이 같은 사진을 쓸 수 있다.
  return NextResponse.json({ deleted: true, count: remaining.length });
}
