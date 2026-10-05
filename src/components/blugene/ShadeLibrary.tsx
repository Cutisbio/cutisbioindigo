'use client';

import { useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { indirubinPair } from '@/data/blugene/shades';
import SectionHeading, { HEADING_SIZE, keepLastWords } from '@/components/blugene/SectionHeading';
import SourceNote from '@/components/blugene/SourceNote';
import ZoomableImage from '@/components/blugene/ZoomableImage';

/**
 * 색상 라이브러리 — 카탈로그 p.7 Figure 4-1 / Figure 4-2 기반.
 *
 * 근거와 표현 원칙
 * - 「카탈로그 농도별 견본」 2행 6열 격자(A1~B6, p.7 Figure 4-1)는 2026-10-05 고객 요청으로 홈과 /dyeing-printing 에서 뺐다.
 *   (그 전에는 농도 수치가 없어 위치 기준 구분자만 붙였고, 선택기 · A6/B1 중복 안내는 2026-09-12 에 뺐다.)
 *   견본 파일과 데이터(shadeSwatches)는 남아 있고, /contact 의 shade 쿼리 처리도 주소로 들어오면 여전히 동작한다.
 *   홈에서는 격자를 빼면 제목만 남아 섹션 자체를 뺐다. /dyeing-printing 에는 제목 · beforeGrid(염색 횟수 비교) · 인디루빈 블록이 남는다.
 * - 인디고/인디루빈 비교는 카탈로그가 제공한 사진 두 장만 쓴다.
 *   그 사이의 혼합비 색을 CSS 로 만들어 보여 주지 않는다.
 * - 견본·원단 사진에는 색보정을 하지 않는다 (`unoptimized` + `.swatch-true-color`).
 * - 이 화면에서 어떤 정보도 외부로 전송하지 않는다.
 */

/** public/blugene/asset-manifest.json 의 원본 픽셀 크기 (p.7 Figure 4-2, 517×386) */
const INDIRUBIN_IMAGE_WIDTH = 517;
const INDIRUBIN_IMAGE_HEIGHT = 386;

export default function ShadeLibrary({
  variant = 'section',
  showIndirubin = true,
  beforeGrid,
}: {
  /** 'section' 이면 배경·여백을 가진 독립 섹션, 'bare' 면 내부 콘텐츠만 반환한다 */
  variant?: 'section' | 'bare';
  /**
   * false 면 「인디루빈이 만드는 색조 변화」 블록과 인디루빈 약리 활성 고지(medicalNote)를 그리지 않는다
   * (홈, 2026-09-29 고객 요청). 색상 조건 안내(colorDisclaimer)는 견본 격자에도 해당하므로 그대로 둔다. 기본 true.
   */
  showIndirubin?: boolean;
  /**
   * 섹션 제목 바로 아래에 끼울 블록. /dyeing-printing 은 여기에 「염색 횟수에 따른 발색 비교」
   * (DyeingCycles, 서버 컴포넌트)를 넣는다 — 2026-10-05 고객 요청으로 제품군 섹션에서 옮김. 클라이언트 컴포넌트라
   * 서버 컴포넌트를 직접 그릴 수 없으므로 페이지가 ReactNode 로 넘긴다.
   */
  beforeGrid?: ReactNode;
}) {
  const t = useTranslations('ShadeLibrary');
  const tc = useTranslations('Common');

  /** 인디루빈 비교뷰: true = 두 장 나란히, false = 한 장만 크게 */
  const [comparing, setComparing] = useState(true);
  const [singleIndex, setSingleIndex] = useState(0);

  /** 인디루빈 두 조성 — 카탈로그가 제공한 사진 그대로 */
  const indirubinViews = [
    { item: indirubinPair[0], label: t('indirubinLabelA'), alt: t('indirubinAltA') },
    { item: indirubinPair[1], label: t('indirubinLabelB'), alt: t('indirubinAltB') },
  ];
  const singleView = indirubinViews[singleIndex];

  const content = (
    <>
      <SectionHeading eyebrow={t('eyebrow')} title={t('title')} body={t('body')} size="hero" />

      {/* 「염색 횟수에 따른 발색 비교」 등 — 섹션 제목 바로 아래 */}
      {beforeGrid && <div className="mt-12 sm:mt-16">{beforeGrid}</div>}

      {/* ── 인디루빈 조성 비교 ─────────────────────────────────── */}
      {showIndirubin && (
      <div className="mt-16 border-t border-[color:var(--color-washed)] pt-12 sm:mt-20 sm:pt-14">
        {/* 표·비교 블록의 제목 단(md). 1.875rem 에서 멈추면 바로 아래 카드 제목(1.125rem)과 붙어 보인다. */}
        <h3
          className={`${HEADING_SIZE.md} leading-snug font-bold tracking-[-0.02em] text-pretty break-keep text-[var(--color-indigo-deep)]`}
        >
          {keepLastWords(t('indirubinTitle'))}
        </h3>
        <p className="mt-4 max-w-2xl text-base leading-[1.85] break-keep text-[var(--color-ink)]/85">
          {t('indirubinBody')}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-2">
          <button
            type="button"
            aria-pressed={comparing}
            onClick={() => setComparing((prev) => !prev)}
            className={`cursor-pointer rounded-md border px-4 py-2 text-sm font-semibold break-keep transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-denim)] ${
              comparing
                ? 'border-[color:var(--color-indigo-deep)] bg-[var(--color-indigo-deep)] text-white'
                : 'border-[color:var(--color-washed)] bg-white text-[var(--color-ink)] hover:border-[color:var(--color-denim)]'
            }`}
          >
            {t('indirubinToggle')}
          </button>

          {/* 한 장만 크게 볼 때는 어느 조성을 볼지 고른다 */}
          {!comparing &&
            indirubinViews.map((view, index) => (
              <button
                key={view.item.id}
                type="button"
                aria-pressed={singleIndex === index}
                onClick={() => setSingleIndex(index)}
                className={`cursor-pointer rounded-md border px-4 py-2 text-sm font-medium break-keep transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-denim)] ${
                  singleIndex === index
                    ? 'border-[color:var(--color-denim)] bg-white text-[var(--color-indigo-deep)] ring-1 ring-[var(--color-denim)]'
                    : 'border-[color:var(--color-washed)] bg-white text-[var(--color-slate-muted)] hover:border-[color:var(--color-denim)]'
                }`}
              >
                {view.label}
              </button>
            ))}
        </div>

        {comparing ? (
          <div className="mt-7 grid gap-6 sm:max-w-3xl sm:grid-cols-2">
            {indirubinViews.map((view) => (
              <figure key={view.item.id}>
                <ZoomableImage
                  src={view.item.image}
                  alt={view.alt}
                  width={INDIRUBIN_IMAGE_WIDTH}
                  height={INDIRUBIN_IMAGE_HEIGHT}
                  openLabel={tc('openImage')}
                  closeLabel={tc('close')}
                  hint={tc('imageNotePhoto')}
                  sizes="(max-width: 640px) 90vw, 360px"
                  unoptimized
                />
                <figcaption className="mt-2.5 text-sm font-medium break-keep text-[var(--color-indigo-deep)]">
                  {view.label}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <figure className="mt-7 max-w-[34rem]">
            <ZoomableImage
              key={singleView.item.id}
              src={singleView.item.image}
              alt={singleView.alt}
              width={INDIRUBIN_IMAGE_WIDTH}
              height={INDIRUBIN_IMAGE_HEIGHT}
              openLabel={tc('openImage')}
              closeLabel={tc('close')}
              hint={tc('imageNotePhoto')}
              sizes="(max-width: 640px) 90vw, 544px"
              unoptimized
            />
            <figcaption className="mt-2.5 text-sm font-medium break-keep text-[var(--color-indigo-deep)]">
              {singleView.label}
            </figcaption>
          </figure>
        )}

        <SourceNote className="mt-6 max-w-3xl">{t('indirubinNote')}</SourceNote>
      </div>
      )}

      {/* ── 조건 표기 ─────────────────────────────────────────── */}
      {/* '이 색으로 샘플 문의하기' 버튼은 2026-09-12 고객 요청으로 뺐다. 여기에는 색상 조건 안내만 남긴다.
          인디루빈 약리 활성 고지는 인디루빈 블록이 있을 때만 뜻이 있으므로 함께 켜고 끈다. */}
      <div className="mt-12 max-w-2xl space-y-2 border-t border-[color:var(--color-washed)] pt-8 sm:mt-14">
        <SourceNote>{t('colorDisclaimer')}</SourceNote>
        {showIndirubin && <SourceNote>{t('medicalNote')}</SourceNote>}
      </div>
    </>
  );

  // 'bare' 는 페이지가 이미 같은 컨테이너로 감싸고 있을 때 쓴다.
  if (variant === 'bare') {
    return content;
  }

  return (
    <section className="bg-[var(--color-ivory)]">
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        {content}
      </div>
    </section>
  );
}
