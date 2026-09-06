'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LOCALES, LOCALE_LABELS } from '@/data/blugene/site';
import { parseYoutubeId, type LocalizedText, type NewsPost } from '@/data/blugene/newsPosts';

type Candidate = {
  date: string;
  category: string;
  title: string;
  summary: string;
  link: string;
  approved: boolean;
  onTopic: boolean;
};

const emptyText = (): LocalizedText =>
  Object.fromEntries(LOCALES.map((l) => [l, ''])) as LocalizedText;

const todayISO = () => new Date().toISOString().slice(0, 10);

/* ------------------------------------------------------------------ 공통 조각 */

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[var(--color-indigo-deep)]">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-[var(--color-slate-muted)]">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputClass =
  'w-full rounded-md border border-[color:var(--color-washed)] bg-white px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-denim)] focus:ring-2 focus:ring-[var(--color-denim)]/25';

/** 한국어 입력 + 5개 언어 자동 번역 + 언어별 직접 수정 */
function LocalizedField({
  label,
  hint,
  value,
  onChange,
  multiline,
}: {
  label: string;
  hint?: string;
  value: LocalizedText;
  onChange: (next: LocalizedText) => void;
  multiline?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');

  const translate = async () => {
    if (!value.ko.trim()) {
      setNote('한국어를 먼저 입력하세요.');
      return;
    }
    setBusy(true);
    setNote('번역 중…');
    try {
      const res = await fetch('/api/admin/translate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: value.ko }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '번역에 실패했습니다.');
      onChange({ ...value, ...data.translations });
      setNote(
        data.failed?.length
          ? `${data.failed.join(', ')} 는 번역하지 못했습니다. 아래에서 직접 입력하세요.`
          : '5개 언어를 채웠습니다. 내용을 확인하세요.'
      );
      setOpen(true);
    } catch (error) {
      setNote((error as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const missing = LOCALES.filter((l) => !value[l].trim());
  const Input = multiline ? 'textarea' : 'input';

  return (
    <div className="rounded-md border border-[color:var(--color-washed)] bg-[var(--color-ivory)]/60 p-4">
      <Field label={`${label} (한국어)`} hint={hint}>
        <Input
          className={inputClass}
          rows={multiline ? 3 : undefined}
          value={value.ko}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            onChange({ ...value, ko: e.target.value })
          }
        />
      </Field>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={translate}
          disabled={busy}
          className="rounded-md bg-[var(--color-denim)] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        >
          {busy ? '번역 중…' : '나머지 5개 언어 번역'}
        </button>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md border border-[color:var(--color-washed)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-indigo-deep)]"
        >
          {open ? '언어별 입력 접기' : '언어별 입력 펼치기'}
        </button>
        {missing.length > 0 && (
          <span className="text-xs font-semibold text-[#9B2C2C]">
            비어 있음: {missing.join(', ')}
          </span>
        )}
        {note && <span className="text-xs text-[var(--color-slate-muted)]">{note}</span>}
      </div>

      {open && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {LOCALES.filter((l) => l !== 'ko').map((l) => (
            <Field key={l} label={LOCALE_LABELS[l].native}>
              <Input
                className={inputClass}
                rows={multiline ? 2 : undefined}
                value={value[l]}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                  onChange({ ...value, [l]: e.target.value })
                }
              />
            </Field>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ 기사 검토 */

function CandidateReview({
  candidates,
  onSaved,
}: {
  candidates: Candidate[];
  onSaved: () => void;
}) {
  const [approvals, setApprovals] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(candidates.map((c) => [c.link, c.approved]))
  );
  const [onlyTopic, setOnlyTopic] = useState(true);
  const [status, setStatus] = useState('');
  const [publishLog, setPublishLog] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setApprovals(Object.fromEntries(candidates.map((c) => [c.link, c.approved])));
  }, [candidates]);

  const dirty = candidates.some((c) => approvals[c.link] !== c.approved);
  const shown = onlyTopic ? candidates.filter((c) => c.onTopic || approvals[c.link]) : candidates;
  const approvedCount = Object.values(approvals).filter(Boolean).length;

  const save = async () => {
    setBusy(true);
    setStatus('저장 중…');
    try {
      const res = await fetch('/api/admin/news', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ approvals }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '저장에 실패했습니다.');
      setStatus(`저장했습니다. 승인 ${data.approved}건 (변경 ${data.changed}건).`);
      onSaved();
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const publish = async () => {
    setBusy(true);
    setPublishLog('');
    setStatus('소식란에 반영 중… 새 기사를 번역하느라 1~2분 걸릴 수 있습니다.');
    try {
      const res = await fetch('/api/admin/publish', { method: 'POST' });
      const data = await res.json();
      setPublishLog(data.summary || '');
      setStatus(data.ok ? '반영을 마쳤습니다. 소식 페이지를 확인하세요.' : `실패: ${data.error}`);
      onSaved();
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-indigo-deep)]">수집한 기사 검토</h2>
          <p className="mt-1 text-sm text-[var(--color-slate-muted)]">
            제목·요약에 큐티스바이오가 들어간 기사는 이미 자동으로 실려 있습니다. 여기 있는 것은
            회사 이름이 헤드라인에 없어 사람이 판단해야 하는 기사입니다.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)]">
          <input type="checkbox" checked={onlyTopic} onChange={(e) => setOnlyTopic(e.target.checked)} />
          인디고·염료·데님·염색 기사만 보기
        </label>
      </div>

      <p className="mt-3 text-sm font-semibold text-[var(--color-denim)]">
        전체 {candidates.length}건 · 화면에 {shown.length}건 · 승인 {approvedCount}건
      </p>

      <ul className="mt-4 divide-y divide-[color:var(--color-washed)] border-y border-[color:var(--color-washed)]">
        {shown.map((c) => (
          <li key={c.link} className="flex gap-3 py-3">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 shrink-0"
              checked={approvals[c.link] ?? false}
              onChange={(e) => setApprovals((prev) => ({ ...prev, [c.link]: e.target.checked }))}
              aria-label={`${c.title} 승인`}
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-slate-muted)]">
                <time dateTime={c.date}>{c.date}</time>
                {c.onTopic && (
                  <span className="rounded-full bg-[var(--color-ivory)] px-2 py-0.5 font-semibold text-[var(--color-denim)]">
                    주제 관련
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm font-semibold break-keep text-[var(--color-ink)]">{c.title}</p>
              <a
                href={c.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-xs text-[var(--color-denim)] underline underline-offset-2"
              >
                기사 열어 보기 ↗
              </a>
            </div>
          </li>
        ))}
        {shown.length === 0 && (
          <li className="py-6 text-sm text-[var(--color-slate-muted)]">검토할 기사가 없습니다.</li>
        )}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={busy || !dirty}
          className="rounded-md bg-[var(--color-indigo-deep)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          승인 상태 저장
        </button>
        <button
          type="button"
          onClick={publish}
          disabled={busy || dirty}
          className="rounded-md border border-[var(--color-indigo-deep)] px-5 py-2.5 text-sm font-semibold text-[var(--color-indigo-deep)] disabled:opacity-40"
        >
          소식란에 반영하기
        </button>
        {dirty && (
          <span className="text-xs text-[var(--color-slate-muted)]">
            먼저 저장해야 반영할 수 있습니다.
          </span>
        )}
      </div>
      {status && <p className="mt-3 text-sm font-semibold text-[var(--color-denim)]">{status}</p>}
      {publishLog && (
        <pre className="mt-2 overflow-x-auto rounded-md bg-[var(--color-ivory)] p-3 text-xs text-[var(--color-ink)]">
          {publishLog}
        </pre>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ 직접 쓰기 */

const blankPost = (): NewsPost => ({
  id: '',
  type: 'youtube',
  date: todayISO(),
  title: emptyText(),
  summary: emptyText(),
});

function PostEditor({ initial, onDone }: { initial: NewsPost | null; onDone: () => void }) {
  const [post, setPost] = useState<NewsPost>(initial ?? blankPost());
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPost(initial ?? blankPost());
    setYoutubeUrl(initial?.youtubeId ?? '');
    setStatus('');
  }, [initial]);

  const set = <K extends keyof NewsPost>(key: K, value: NewsPost[K]) =>
    setPost((prev) => ({ ...prev, [key]: value }));

  const applyYoutube = (raw: string) => {
    setYoutubeUrl(raw);
    const id = parseYoutubeId(raw);
    set('youtubeId', id ?? undefined);
    setStatus(raw && !id ? '유튜브 주소를 알아보지 못했습니다.' : '');
  };

  const upload = async (file: File) => {
    setBusy(true);
    setStatus('사진 올리는 중…');
    try {
      // 사진 크기를 브라우저에서 재서 함께 보낸다 — 화면이 흔들리지 않게 미리 자리를 잡는다
      const bitmap = await createImageBitmap(file);
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '업로드에 실패했습니다.');
      setPost((prev) => ({
        ...prev,
        image: data.url,
        imageWidth: bitmap.width,
        imageHeight: bitmap.height,
      }));
      setStatus(`올렸습니다 (${bitmap.width}×${bitmap.height}).`);
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    setBusy(true);
    setStatus('저장 중…');
    try {
      const payload: NewsPost = {
        ...post,
        id: post.id || `${post.date}-${Math.random().toString(36).slice(2, 8)}`,
      };
      const res = await fetch('/api/admin/news', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '저장에 실패했습니다.');
      setStatus('저장했습니다. 소식 페이지에 바로 나옵니다.');
      setPost(blankPost());
      setYoutubeUrl('');
      if (fileRef.current) fileRef.current.value = '';
      onDone();
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-md border border-[color:var(--color-washed)] bg-white p-5">
      <h3 className="text-base font-bold text-[var(--color-indigo-deep)]">
        {post.id ? '글 수정' : '새 글 쓰기'}
      </h3>

      <div className="mt-4 flex flex-wrap gap-4">
        {(['youtube', 'post'] as const).map((type) => (
          <label key={type} className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="radio"
              name="post-type"
              checked={post.type === type}
              onChange={() => set('type', type)}
            />
            {type === 'youtube' ? '유튜브 영상' : '사진 + 글'}
          </label>
        ))}
        <Field label="날짜">
          <input
            type="date"
            className={inputClass}
            value={post.date}
            onChange={(e) => set('date', e.target.value)}
          />
        </Field>
      </div>

      {post.type === 'youtube' ? (
        <div className="mt-4">
          <Field
            label="유튜브 주소"
            hint="youtu.be/… , youtube.com/watch?v=… , /shorts/… 모두 됩니다."
          >
            <input
              className={inputClass}
              value={youtubeUrl}
              onChange={(e) => applyYoutube(e.target.value)}
              placeholder="https://youtu.be/..."
            />
          </Field>
          {post.youtubeId && (
            <p className="mt-2 text-xs font-semibold text-[var(--color-denim)]">
              영상 ID: {post.youtubeId}
            </p>
          )}
        </div>
      ) : (
        <div className="mt-4">
          <Field label="사진" hint="JPG · PNG · WebP, 8MB 이하">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="text-sm"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void upload(file);
              }}
            />
          </Field>
          {post.image && (
            <div className="mt-3">
              {/* 관리자 미리보기라 next/image 최적화가 필요 없다 */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.image} alt="" className="max-h-48 rounded-md border border-[color:var(--color-washed)]" />
              <p className="mt-1 text-xs text-[var(--color-slate-muted)]">{post.image}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-5 space-y-4">
        <LocalizedField label="제목" value={post.title} onChange={(v) => set('title', v)} />
        <LocalizedField
          label="내용"
          hint="소식 목록에 보이는 본문입니다."
          value={post.summary}
          onChange={(v) => set('summary', v)}
          multiline
        />
        {post.type === 'post' && (
          <LocalizedField
            label="사진 설명"
            hint="화면에 보이지 않지만 시각장애인용 화면 낭독기와 검색엔진이 읽습니다."
            value={post.imageAlt ?? emptyText()}
            onChange={(v) => set('imageAlt', v)}
          />
        )}
        <Field label="원문 링크 (선택)">
          <input
            className={inputClass}
            value={post.link ?? ''}
            onChange={(e) => set('link', e.target.value || undefined)}
            placeholder="https://"
          />
        </Field>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={busy}
          className="rounded-md bg-[var(--color-indigo-deep)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          저장
        </button>
        {post.id && (
          <button
            type="button"
            onClick={() => {
              setPost(blankPost());
              setYoutubeUrl('');
              onDone();
            }}
            className="rounded-md border border-[color:var(--color-washed)] px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)]"
          >
            취소
          </button>
        )}
        {status && <span className="text-sm font-semibold text-[var(--color-denim)]">{status}</span>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ 화면 전체 */

export default function AdminNews() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [editing, setEditing] = useState<NewsPost | null>(null);
  const [tab, setTab] = useState<'review' | 'write'>('review');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/news');
      if (!res.ok) throw new Error('관리자 API 를 열지 못했습니다. 개발 서버에서 실행 중인지 확인하세요.');
      const data = await res.json();
      setCandidates(data.candidates ?? []);
      setPosts(data.posts ?? []);
      setError('');
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const remove = async (id: string) => {
    if (!window.confirm('이 글을 소식란에서 내릴까요? 올린 사진 파일은 그대로 남습니다.')) return;
    await fetch(`/api/admin/news?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    void load();
  };

  const pending = useMemo(() => candidates.filter((c) => !c.approved && c.onTopic).length, [candidates]);

  return (
    <main className="mx-auto max-w-[900px] px-4 py-10 sm:px-6">
      <header className="border-b border-[color:var(--color-washed)] pb-6">
        <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-denim)]">
          BLUGENE 관리자 · 로컬 전용
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[var(--color-indigo-deep)]">소식 관리</h1>
        <p className="mt-2 text-sm leading-relaxed break-keep text-[var(--color-slate-muted)]">
          여기서 고친 내용은 내 컴퓨터의 파일에 저장됩니다. 실제 사이트에 반영하려면 저장한 뒤
          GitHub 에 커밋해야 합니다.
        </p>
      </header>

      {error && (
        <p className="mt-5 rounded-md bg-[#FDE8E8] p-3 text-sm font-semibold text-[#9B2C2C]">{error}</p>
      )}

      <nav className="mt-6 flex gap-2">
        {(
          [
            ['review', `기사 검토${pending ? ` (${pending})` : ''}`],
            ['write', '직접 쓰기'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-md px-4 py-2 text-sm font-semibold ${
              tab === key
                ? 'bg-[var(--color-indigo-deep)] text-white'
                : 'border border-[color:var(--color-washed)] bg-white text-[var(--color-indigo-deep)]'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-8">
        {tab === 'review' ? (
          <CandidateReview candidates={candidates} onSaved={load} />
        ) : (
          <>
            <PostEditor initial={editing} onDone={() => { setEditing(null); void load(); }} />

            <section className="mt-8">
              <h2 className="text-lg font-bold text-[var(--color-indigo-deep)]">
                직접 쓴 소식 {posts.length}건
              </h2>
              <ul className="mt-3 divide-y divide-[color:var(--color-washed)] border-y border-[color:var(--color-washed)]">
                {posts.map((p) => (
                  <li key={p.id} className="flex items-start justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs text-[var(--color-slate-muted)]">
                        <span className="rounded-full bg-[var(--color-ivory)] px-2 py-0.5 font-semibold text-[var(--color-denim)]">
                          {p.type === 'youtube' ? '영상' : '사진'}
                        </span>
                        <time dateTime={p.date}>{p.date}</time>
                      </div>
                      <p className="mt-1 text-sm font-semibold break-keep text-[var(--color-ink)]">
                        {p.title.ko}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => setEditing(p)}
                        className="rounded-md border border-[color:var(--color-washed)] px-3 py-1.5 text-xs font-semibold"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(p.id)}
                        className="rounded-md border border-[#E0B4B4] px-3 py-1.5 text-xs font-semibold text-[#9B2C2C]"
                      >
                        내리기
                      </button>
                    </div>
                  </li>
                ))}
                {posts.length === 0 && (
                  <li className="py-6 text-sm text-[var(--color-slate-muted)]">아직 쓴 글이 없습니다.</li>
                )}
              </ul>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
