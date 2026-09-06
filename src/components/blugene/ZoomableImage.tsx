'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

/**
 * 원본 확대 보기.
 *
 * 접근성 요구사항 (Master Prompt §11)
 * - 키보드로 열고 닫을 수 있다 (버튼 · Enter/Space).
 * - Escape 로 닫힌다.
 * - 닫으면 원래 버튼으로 포커스가 돌아온다 (native <dialog> 가 처리한다).
 * - hover 만으로 정보를 제공하지 않는다 — 안내 문구를 화면에 항상 표시한다.
 * - 원본은 클릭할 때 비로소 내려받는다 (초기 페이지에서 12쪽 전체를 받지 않는다).
 */
export default function ZoomableImage({
  src,
  alt,
  width,
  height,
  thumbClassName = '',
  imgClassName = '',
  openLabel,
  closeLabel,
  hint,
  caption,
  sizes = '(max-width: 768px) 90vw, 420px',
  preload = false,
  unoptimized = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  thumbClassName?: string;
  imgClassName?: string;
  openLabel: string;
  closeLabel: string;
  hint?: string;
  caption?: string;
  sizes?: string;
  preload?: boolean;
  unoptimized?: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [opened, setOpened] = useState(false);

  const open = useCallback(() => {
    setOpened(true);
    dialogRef.current?.showModal();
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  // 배경(backdrop)을 눌러도 닫히게 한다
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const onClick = (e: MouseEvent) => {
      if (e.target === el) el.close();
    };
    el.addEventListener('click', onClick);
    return () => el.removeEventListener('click', onClick);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={open}
        className={`group relative block w-full cursor-zoom-in overflow-hidden rounded-lg border border-[color:var(--color-washed)] bg-white ${thumbClassName}`}
        aria-label={`${openLabel}: ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          preload={preload}
          unoptimized={unoptimized}
          className={`swatch-true-color h-auto w-full ${imgClassName}`}
        />
        <span className="pointer-events-none absolute right-2 bottom-2 rounded bg-[var(--color-indigo-deep)]/85 px-2 py-1 text-[0.7rem] font-medium text-white">
          {openLabel}
        </span>
      </button>

      {caption && (
        <p className="mt-2 text-[0.8125rem] leading-relaxed break-keep text-[var(--color-slate-muted)]">
          {caption}
        </p>
      )}

      <dialog
        ref={dialogRef}
        onClose={() => setOpened(false)}
        aria-label={alt}
        className="m-auto max-h-[92vh] max-w-[min(96vw,1100px)] rounded-lg bg-white p-0 backdrop:bg-black/70"
      >
        <div className="flex max-h-[92vh] flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-[color:var(--color-washed)] px-4 py-3">
            <p className="text-sm leading-snug break-keep text-[var(--color-ink)]">{alt}</p>
            <button
              type="button"
              onClick={close}
              className="shrink-0 rounded border border-[color:var(--color-washed)] px-3 py-1.5 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-ivory)]"
            >
              {closeLabel}
            </button>
          </div>
          <div className="table-scroll overflow-auto p-4">
            {/* 원본 비율 그대로. 열었을 때만 내려받는다. */}
            {opened && (
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                sizes="(max-width: 1100px) 96vw, 1100px"
                unoptimized={unoptimized}
                className="swatch-true-color mx-auto h-auto w-auto max-w-full"
              />
            )}
          </div>
          {hint && (
            <p className="border-t border-[color:var(--color-washed)] px-4 py-2.5 text-xs text-[var(--color-slate-muted)]">
              {hint}
            </p>
          )}
        </div>
      </dialog>
    </>
  );
}
