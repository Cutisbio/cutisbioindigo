'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import SectionHeading from '@/components/blugene/SectionHeading';
import SourceNote from '@/components/blugene/SourceNote';
import { CATALOGUE } from '@/data/blugene/evidence';

/**
 * 원본 카탈로그 12쪽 뷰어.
 *
 * 근거 자료: CutisBio CB Bioindigo Catalogue (EN), 2026-07 발행 (CATALOGUE).
 * 쪽 이미지는 public/blugene/catalogue/page-01..12.webp 이며 원본 픽셀 936 × 1297 이다
 * (public/blugene/asset-manifest.json 기준). PDF 원본도 같은 폴더에 있다.
 *
 * 지켜야 할 규칙
 * - 썸네일 12장은 모두 지연 로딩하고, 작은 sizes 로만 내려받는다.
 * - 큰 이미지는 모달이 열렸을 때에만 렌더링한다. 초기 페이지에서 12쪽 원본을 동시에 받지 않는다.
 * - 확대는 native <dialog> 로 연다. Escape · 배경 클릭으로 닫히고,
 *   닫으면 모달을 열 때 눌렀던 썸네일 버튼으로 포커스가 돌아간다(WAI-ARIA 대화상자 규칙).
 * - 모달 안에서 이전/다음 버튼과 좌우 화살표 키로 쪽을 옮긴다.
 *   두 버튼은 첫 쪽·마지막 쪽에서도 사라지지 않고 disabled 로만 두어 레이아웃과 포커스를 지킨다.
 * - 현재 쪽 표시는 aria-live 영역이라 화살표 키·버튼으로 옮길 때 쪽 번호가 낭독된다.
 * - 애니메이션을 쓰지 않는다. hover 로만 정보를 주지 않는다.
 * - 사용자 대면 문자열은 모두 t() 를 거친다 (DataHub · Common 네임스페이스).
 * - 구역(section) · 배경 · 좌우 여백은 이 컴포넌트를 쓰는 페이지가 정한다
 *   (data-certifications 페이지의 `#catalogue` 구역). 여기서는 내용만 그린다.
 */

/** 카탈로그 쪽 이미지의 원본 픽셀 크기 (asset-manifest.json) */
const PAGE_WIDTH = 936;
const PAGE_HEIGHT = 1297;

/** 1 부터 pageCount 까지의 쪽 번호 */
const PAGES: number[] = Array.from({ length: CATALOGUE.pageCount }, (_, index) => index + 1);

export interface CatalogueViewerProps {
  className?: string;
}

export default function CatalogueViewer({ className = '' }: CatalogueViewerProps) {
  const t = useTranslations('DataHub');
  const tCommon = useTranslations('Common');

  const dialogRef = useRef<HTMLDialogElement>(null);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  /** 모달을 열 때 눌렀던 썸네일의 쪽 번호. 닫을 때 이 버튼으로 포커스를 되돌린다. */
  const triggerPageRef = useRef<number | null>(null);

  /** 열려 있는 쪽 번호. null 이면 모달이 닫힌 상태이고, 큰 이미지를 렌더링하지 않는다. */
  const [currentPage, setCurrentPage] = useState<number | null>(null);

  const openPage = useCallback((page: number) => {
    triggerPageRef.current = page;
    setCurrentPage(page);
    dialogRef.current?.showModal();
  }, []);

  const closeDialog = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  /** 닫힐 때(버튼 · Escape · 배경 클릭) 모달을 열 때 눌렀던 썸네일로 포커스를 돌려준다. */
  const handleClose = () => {
    const triggerPage = triggerPageRef.current;
    triggerPageRef.current = null;
    setCurrentPage(null);
    if (triggerPage !== null) {
      thumbRefs.current[triggerPage - 1]?.focus();
    }
  };

  const atFirstPage = currentPage === null || currentPage <= 1;
  const atLastPage = currentPage === null || currentPage >= CATALOGUE.pageCount;
  /** 이동할 쪽 번호. 경계에서는 버튼을 지우지 않고 disabled 로만 두므로 현재 쪽으로 고정한다. */
  const prevPage = currentPage === null ? 1 : Math.max(1, currentPage - 1);
  const nextPage = currentPage === null ? 1 : Math.min(CATALOGUE.pageCount, currentPage + 1);

  /**
   * 쪽 이동. 이동한 쪽이 경계라서 방금 누른 버튼이 disabled 가 되면
   * 그 버튼에 있던 포커스를 반대쪽 버튼으로 넘겨 모달 안에 남겨 둔다.
   */
  const goToPage = useCallback((target: number) => {
    if (target < 1 || target > CATALOGUE.pageCount) return;
    setCurrentPage(target);
    const active = document.activeElement;
    if (target <= 1 && active === prevButtonRef.current) {
      nextButtonRef.current?.focus();
    } else if (target >= CATALOGUE.pageCount && active === nextButtonRef.current) {
      prevButtonRef.current?.focus();
    }
  }, []);

  /**
   * 좌우 화살표 키로도 쪽을 옮긴다.
   * 큰 이미지·닫기 버튼 등 어디에 포커스가 있어도 동작하도록
   * <dialog> 가 아니라 문서 수준에서 듣는다.
   */
  useEffect(() => {
    if (currentPage === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && currentPage > 1) {
        event.preventDefault();
        goToPage(currentPage - 1);
      } else if (event.key === 'ArrowRight' && currentPage < CATALOGUE.pageCount) {
        event.preventDefault();
        goToPage(currentPage + 1);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [currentPage, goToPage]);

  // 배경(backdrop)을 눌러도 닫히게 한다
  useEffect(() => {
    const element = dialogRef.current;
    if (!element) return;
    const onBackdropClick = (event: MouseEvent) => {
      if (event.target === element) element.close();
    };
    element.addEventListener('click', onBackdropClick);
    return () => element.removeEventListener('click', onBackdropClick);
  }, []);

  return (
    <div className={className}>
      <SectionHeading title={t('catalogueTitle')} body={t('catalogueBody')} />

      {/* 썸네일 12장 — 모두 지연 로딩, 작은 sizes 로만 내려받는다 */}
      <ul className="mt-10 grid grid-cols-2 gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {PAGES.map((page) => (
          <li key={page}>
            <button
              type="button"
              ref={(element) => {
                thumbRefs.current[page - 1] = element;
              }}
              onClick={() => openPage(page)}
              aria-label={`${tCommon('viewOriginal')}: ${t('cataloguePageAlt', { page })}`}
              className="block w-full cursor-zoom-in rounded-md border border-[color:var(--color-washed)] bg-white p-2 text-left hover:border-[color:var(--color-denim)]"
            >
              <Image
                src={CATALOGUE.pageImage(page)}
                alt={t('cataloguePageAlt', { page })}
                width={PAGE_WIDTH}
                height={PAGE_HEIGHT}
                loading="lazy"
                sizes="(max-width: 640px) 44vw, (max-width: 1024px) 30vw, 190px"
                className="swatch-true-color h-auto w-full rounded-sm"
              />
              <span className="mt-2 block text-[0.8125rem] font-medium break-keep text-[var(--color-slate-muted)]">
                {t('cataloguePage', { page })}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* PDF 원본 내려받기 + 쪽 이동 안내 */}
      <div className="mt-10 border-t border-[color:var(--color-washed)] pt-6">
        <a
          href={CATALOGUE.pdfHref}
          download
          className="inline-flex items-center gap-2 rounded-md bg-[var(--color-indigo-deep)] px-5 py-3 text-sm font-semibold break-keep text-white hover:bg-[var(--color-denim)]"
        >
          {t('catalogueDownload', { size: CATALOGUE.pdfSizeLabel })}
          <span aria-hidden="true">↓</span>
        </a>
        <SourceNote className="mt-4 max-w-3xl">{t('catalogueAnchorNote')}</SourceNote>
      </div>

      {/* 확대 보기 — 열렸을 때만 큰 이미지를 렌더링한다 */}
      <dialog
        ref={dialogRef}
        onClose={handleClose}
        aria-label={currentPage === null ? undefined : t('cataloguePageAlt', { page: currentPage })}
        className="m-auto max-h-[92vh] max-w-[min(96vw,960px)] rounded-lg bg-white p-0 backdrop:bg-black/70"
      >
        <div className="flex max-h-[92vh] flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-[color:var(--color-washed)] px-4 py-3">
            <p
              aria-live="polite"
              aria-atomic="true"
              className="text-sm font-semibold break-keep text-[var(--color-ink)]"
            >
              {currentPage === null ? '' : t('cataloguePage', { page: currentPage })}
            </p>
            <button
              type="button"
              onClick={closeDialog}
              className="shrink-0 rounded border border-[color:var(--color-washed)] px-3 py-1.5 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-ivory)]"
            >
              {tCommon('close')}
            </button>
          </div>

          <div className="overflow-auto bg-[var(--color-ivory)] p-4">
            {currentPage !== null && (
              <Image
                src={CATALOGUE.pageImage(currentPage)}
                alt={t('cataloguePageAlt', { page: currentPage })}
                width={PAGE_WIDTH}
                height={PAGE_HEIGHT}
                sizes="(max-width: 960px) 92vw, 900px"
                className="swatch-true-color mx-auto h-auto w-auto max-w-full"
              />
            )}
          </div>

          {/*
            이전 / 다음 쪽 — 좌우 화살표 키로도 이동한다.
            첫 쪽·마지막 쪽에서도 버튼을 지우지 않고 disabled 로만 둔다.
          */}
          <div className="flex items-center justify-between gap-3 border-t border-[color:var(--color-washed)] px-4 py-3">
            <button
              type="button"
              ref={prevButtonRef}
              onClick={() => goToPage(prevPage)}
              disabled={atFirstPage}
              className="inline-flex items-center gap-1.5 rounded border border-[color:var(--color-washed)] px-3 py-1.5 text-sm font-medium break-keep text-[var(--color-ink)] enabled:hover:bg-[var(--color-ivory)] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <span aria-hidden="true">←</span>
              {t('cataloguePage', { page: prevPage })}
            </button>

            <button
              type="button"
              ref={nextButtonRef}
              onClick={() => goToPage(nextPage)}
              disabled={atLastPage}
              className="inline-flex items-center gap-1.5 rounded border border-[color:var(--color-washed)] px-3 py-1.5 text-sm font-medium break-keep text-[var(--color-ink)] enabled:hover:bg-[var(--color-ivory)] disabled:cursor-not-allowed disabled:opacity-45"
            >
              {t('cataloguePage', { page: nextPage })}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
