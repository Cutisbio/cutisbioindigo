'use client';

import { Fragment, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { indirubinPair, shadeSwatches } from '@/data/blugene/shades';
import SectionHeading, { HEADING_SIZE, keepLastWords } from '@/components/blugene/SectionHeading';
import SourceNote, { AssetKind } from '@/components/blugene/SourceNote';
import ZoomableImage from '@/components/blugene/ZoomableImage';

/**
 * 색상 라이브러리 — 카탈로그 p.7 Figure 4-1 / Figure 4-2 기반.
 *
 * 근거와 표현 원칙
 * - 카탈로그에는 각 견본의 **농도 수치가 없다.** 그래서 슬라이더로 값을 보간하지 않고
 *   등장 위치 기준 구분자(A1~B6)를 붙인 2행 6열 도판으로 그대로 보여 준다.
 * - 원본에서 A6 과 B1 은 같은 내장 이미지를 두 위치에 쓴다. 위치를 합치지 않고 그대로 보존한다.
 * - 견본을 골라 크게 보고 그 코드로 문의하던 선택기(radiogroup + 결과 패널 + '이 색으로 샘플 문의하기')와
 *   A6/B1 중복 안내는 2026-09-12 고객 요청으로 뺐다. 격자는 이제 조작하지 않는 도판이다.
 *   (/contact 의 shade 쿼리 처리는 남아 있어 주소로 들어오면 여전히 동작한다.)
 * - 인디고/인디루빈 비교는 카탈로그가 제공한 사진 두 장만 쓴다.
 *   그 사이의 혼합비 색을 CSS 로 만들어 보여 주지 않는다.
 * - 견본·원단 사진에는 색보정을 하지 않는다 (`unoptimized` + `.swatch-true-color`).
 * - 이 화면에서 어떤 정보도 외부로 전송하지 않는다.
 */

/** 2행(A · B) — 카탈로그 도판의 배열을 그대로 따른다. 열 수(6)는 격자 className 에 있다. */
const ROW_KEYS = ['A', 'B'] as const;

/** public/blugene/asset-manifest.json 의 원본 픽셀 크기 (p.7 Figure 4-2, 517×386) */
const INDIRUBIN_IMAGE_WIDTH = 517;
const INDIRUBIN_IMAGE_HEIGHT = 386;

export default function ShadeLibrary({
  variant = 'section',
}: {
  /** 'section' 이면 배경·여백을 가진 독립 섹션, 'bare' 면 내부 콘텐츠만 반환한다 */
  variant?: 'section' | 'bare';
}) {
  const t = useTranslations('ShadeLibrary');
  const tc = useTranslations('Common');

  /** 인디루빈 비교뷰: true = 두 장 나란히, false = 한 장만 크게 */
  const [comparing, setComparing] = useState(true);
  const [singleIndex, setSingleIndex] = useState(0);

  /** 행 라벨과 그 행의 견본 */
  const rows = ROW_KEYS.map((rowKey) => ({
    key: rowKey,
    label: rowKey === 'A' ? t('rowA') : t('rowB'),
    entries: shadeSwatches.filter((swatch) => swatch.row === rowKey),
  }));

  /** 인디루빈 두 조성 — 카탈로그가 제공한 사진 그대로 */
  const indirubinViews = [
    { item: indirubinPair[0], label: t('indirubinLabelA'), alt: t('indirubinAltA') },
    { item: indirubinPair[1], label: t('indirubinLabelB'), alt: t('indirubinAltB') },
  ];
  const singleView = indirubinViews[singleIndex];

  const content = (
    <>
      <SectionHeading eyebrow={t('eyebrow')} title={t('title')} body={t('body')} size="hero" />

      {/* ── 농도별 견본 도판 ───────────────────────────────── */}
      <div className="mt-12 sm:mt-16">
        <h3 className="text-[1.25rem] leading-snug font-bold tracking-[-0.015em] break-keep text-[var(--color-indigo-deep)] sm:text-[1.5rem]">
          {t('gridTitle')}
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed break-keep text-[var(--color-slate-muted)]">
          {t('gridHelp')}
        </p>

        {/*
          2행 6열 격자 + Low → High 축. 2026-09-12 고객 요청으로 선택 · 확대 · 문의 버튼을 뺐으므로
          조작하지 않는 도판이다. 폭을 제한해 데스크톱에서 칸이 지나치게 커지지 않게 한다.
        */}
        <div className="mt-8 max-w-[54rem]">
          <AssetKind>{tc('catalogueFigure')}</AssetKind>
          <div className="mt-4 grid grid-cols-[auto_repeat(6,minmax(0,1fr))] items-start gap-x-1.5 gap-y-3 sm:gap-x-2.5 sm:gap-y-4">
            {rows.map((row) => (
              <Fragment key={row.key}>
                <span className="self-center pr-1 text-[0.7rem] font-medium whitespace-nowrap text-[var(--color-slate-muted)] sm:pr-2 sm:text-xs">
                  {row.label}
                </span>
                {row.entries.map((swatch) => (
                  <figure key={swatch.code} className="m-0 min-w-0">
                    <div className="relative aspect-[193/182] w-full overflow-hidden rounded-md border border-[color:var(--color-washed)] bg-white">
                      <Image
                        src={swatch.image}
                        alt={t('swatchAlt', { code: swatch.code })}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 14vw, (max-width: 1024px) 12vw, 130px"
                        className="swatch-true-color object-cover"
                      />
                    </div>
                    <figcaption className="mt-1.5 block text-center text-[0.65rem] tracking-wide text-[var(--color-slate-muted)] sm:text-[0.7rem]">
                      {swatch.code}
                    </figcaption>
                  </figure>
                ))}
              </Fragment>
            ))}

            {/* 축: 그라디언트 막대가 아니라 얇은 선 + 양끝 라벨 */}
            <span aria-hidden="true" />
            <div className="col-span-6 mt-2">
              <div className="flex items-center gap-2">
                <span className="text-[0.7rem] font-medium tracking-wide text-[var(--color-slate-muted)]">
                  {t('axisLow')}
                </span>
                <span aria-hidden="true" className="h-px flex-1 bg-[color:var(--color-washed)]" />
                <span aria-hidden="true" className="text-[0.7rem] text-[var(--color-slate-muted)]">
                  →
                </span>
                <span className="text-[0.7rem] font-medium tracking-wide text-[var(--color-slate-muted)]">
                  {t('axisHigh')}
                </span>
              </div>
              <p className="mt-2 text-center text-[0.7rem] tracking-wide break-keep text-[var(--color-slate-muted)]">
                {t('axisLabel')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 인디루빈 조성 비교 ─────────────────────────────────── */}
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

      {/* ── 조건 표기 ─────────────────────────────────────────── */}
      {/* '이 색으로 샘플 문의하기' 버튼은 2026-09-12 고객 요청으로 뺐다. 여기에는 색상 조건 안내만 남긴다. */}
      <div className="mt-12 max-w-2xl space-y-2 border-t border-[color:var(--color-washed)] pt-8 sm:mt-14">
        <SourceNote>{t('colorDisclaimer')}</SourceNote>
        <SourceNote>{t('medicalNote')}</SourceNote>
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
