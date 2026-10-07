'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';

/**
 * 영상 위에 겹치는 글자 한 덩어리 — 재생 시간 [from, until) 동안 보인다. 위치는 영상 폭 · 높이의 백분율.
 * 영상 자체에는 글자가 없고(언어별로 바꿀 수 없으므로), 페이지가 번역된 문구를 여기로 넘긴다(2026-10-07 고객 요청).
 */
export interface VideoOverlay {
  key: string;
  from: number;
  until?: number;
  /** 덩어리의 가운데가 놓일 자리(%) */
  x: number;
  y: number;
  lines: { text: ReactNode; className?: string }[];
}

/**
 * 히어로의 무음 개념 애니메이션(2026-10-06, /technology 「옥수수에서 인디고로」).
 *
 * - 소리 없이 자동 재생 · 반복(autoPlay muted loop playsInline). 포스터는 마지막 프레임(완성된 구조식)이다.
 * - 움직임 줄이기 설정(prefers-reduced-motion)에서는 자동 재생하지 않고 마지막 프레임에 멈춰 둔다 — 정지 화면만으로도 뜻이 통한다.
 * - 5초 넘게 움직이는 콘텐츠이므로 멈춤 · 재생 단추를 둔다(WCAG 2.2.2). 단추는 영상 오른쪽 아래에 작게.
 *   재생 중인지는 <video> 의 play · pause 이벤트를 useSyncExternalStore 로 구독해 읽는다(effect 안에서 setState 하지 않는다).
 * - 글자(옥수수 · 인디고 표기)는 영상에 굽지 않고 overlays 로 겹친다. timeupdate(약 4 Hz)로 현재 시간을 읽어 보일 덩어리를 고르고
 *   300 ms 로 서서히 나타난다. 영상의 자리(1920×1080 좌표 → 1.06배 확대)에 맞춘 백분율은 페이지가 넘긴다.
 * - 영상 파일은 public 의 정적 파일(1280×720 · 2 MB · fast start)이라 CDN 이 그대로 내준다. 렌더 방법은
 *   content/animation/corn-to-indigo/animation/render-web.cjs.
 */
export default function HeroVideo({
  src,
  poster,
  label,
  playLabel,
  pauseLabel,
  overlays = [],
  className = '',
}: {
  src: string;
  poster: string;
  /** 영상의 접근 가능한 이름 — 무엇을 보여 주는 영상인지 */
  label: string;
  playLabel: string;
  pauseLabel: string;
  overlays?: VideoOverlay[];
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [time, setTime] = useState(0);

  const subscribe = useCallback((onChange: () => void) => {
    const video = ref.current;
    if (!video) return () => {};
    video.addEventListener('play', onChange);
    video.addEventListener('pause', onChange);
    return () => {
      video.removeEventListener('play', onChange);
      video.removeEventListener('pause', onChange);
    };
  }, []);
  // 서버 · 하이드레이션 시점에는 autoPlay 가 곧 시작한다고 보고 '재생 중'으로 그린다
  const playing = useSyncExternalStore(
    subscribe,
    () => !(ref.current?.paused ?? true),
    () => true,
  );

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const onTime = () => setTime(video.currentTime);
    video.addEventListener('timeupdate', onTime);
    video.addEventListener('seeked', onTime);
    return () => {
      video.removeEventListener('timeupdate', onTime);
      video.removeEventListener('seeked', onTime);
    };
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video || !window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    video.autoplay = false;
    video.pause();
    // 마지막 프레임(완성된 구조식)에 멈춰 둔다. 메타데이터가 아직 없으면 올 때 옮긴다.
    const toEnd = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) video.currentTime = Math.max(0, video.duration - 0.1);
    };
    if (video.readyState >= 1) toEnd();
    else video.addEventListener('loadedmetadata', toEnd, { once: true });
  }, []);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  };

  return (
    <div className={`relative ${className}`}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        className="block h-auto w-full"
      />
      {/* 겹치는 글자 — 영상의 접근 가능한 이름(label)이 내용을 설명하므로 보조기기에는 숨긴다 */}
      {overlays.map((o) => {
        const visible = time >= o.from && (o.until === undefined || time < o.until);
        return (
          <div
            key={o.key}
            aria-hidden="true"
            data-visible={visible ? '' : undefined}
            className="pointer-events-none absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center whitespace-nowrap opacity-0 transition-opacity duration-300 data-visible:opacity-100"
            style={{ left: `${o.x}%`, top: `${o.y}%` }}
          >
            {o.lines.map((line, i) => (
              <span key={i} className={line.className}>
                {line.text}
              </span>
            ))}
          </div>
        );
      })}
      <button
        type="button"
        onClick={toggle}
        aria-pressed={!playing}
        className="absolute right-2 bottom-2 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[color:var(--color-washed)] bg-white/90 text-[var(--color-indigo-deep)] shadow-sm transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-denim)]"
      >
        <span className="sr-only">{playing ? pauseLabel : playLabel}</span>
        {playing ? (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true" focusable="false">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10-6.5a1 1 0 0 0 0-1.72l-10-6.5A1 1 0 0 0 8 5.5Z" />
          </svg>
        )}
      </button>
    </div>
  );
}
