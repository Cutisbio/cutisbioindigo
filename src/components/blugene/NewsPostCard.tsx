'use client';

import { useState } from 'react';
import Image from 'next/image';

/**
 * 직접 올린 소식 한 건.
 *
 * 유튜브는 **누르기 전까지 유튜브에 아무것도 요청하지 않는다.** 썸네일만 먼저 보여 주고,
 * 방문자가 재생을 누르면 그때 `youtube-nocookie.com` 으로 embed 를 붙인다.
 * 처음부터 iframe 을 박아 두면 방문자가 영상을 보지 않아도 추적 쿠키가 실리고
 * 페이지도 무거워진다.
 */
export default function NewsPostCard({
  youtubeId,
  title,
  playLabel,
}: {
  youtubeId: string;
  title: string;
  playLabel: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="mt-4 aspect-video w-full overflow-hidden rounded-md bg-black">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative mt-4 block aspect-video w-full overflow-hidden rounded-md bg-[var(--color-ivory)]"
      aria-label={`${title} — ${playLabel}`}
    >
      <Image
        src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
        alt=""
        fill
        unoptimized
        className="object-cover"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/40"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-2xl text-[var(--color-indigo-deep)] shadow-lg">
          ▶
        </span>
      </span>
    </button>
  );
}
