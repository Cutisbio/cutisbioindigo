'use client';

import { Fragment, useCallback, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { indirubinPair, shadeSwatches } from '@/data/blugene/shades';
import SectionHeading, { HEADING_SIZE } from '@/components/blugene/SectionHeading';
import SourceNote, { AssetKind } from '@/components/blugene/SourceNote';
import ZoomableImage from '@/components/blugene/ZoomableImage';

/**
 * 색상 라이브러리 — 카탈로그 p.7 Figure 4-1 / Figure 4-2 기반.
 *
 * 근거와 표현 원칙
 * - 카탈로그에는 각 견본의 **농도 수치가 없다.** 그래서 슬라이더로 값을 보간하지 않고
 *   등장 위치 기준 구분자(A1~B6)만 고르는 **이산형 선택기**로 만든다.
 * - 원본에서 A6 과 B1 은 같은 내장 이미지를 두 위치에 쓴다. 위치를 합치지 않고 그대로 보존한다.
 * - 견본 격자는 radiogroup / radio 조합 + roving tabindex 로 조작 방식을 보조기기에 알린다.
 * - 인디고/인디루빈 비교는 카탈로그가 제공한 사진 두 장만 쓴다.
 *   그 사이의 혼합비 색을 CSS 로 만들어 보여 주지 않는다.
 * - 견본·원단 사진에는 색보정을 하지 않는다 (`unoptimized` + `.swatch-true-color`).
 * - 이 화면에서 어떤 정보도 외부로 전송하지 않는다. 선택한 견본 코드는 /contact 링크의 쿼리로만 넘긴다.
 */

/** 2행 6열 — 카탈로그 도판의 배열을 그대로 따른다 */
const COLUMNS = 6;
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

  const [selectedIndex, setSelectedIndex] = useState(0);
  /** 인디루빈 비교뷰: true = 두 장 나란히, false = 한 장만 크게 */
  const [comparing, setComparing] = useState(true);
  const [singleIndex, setSingleIndex] = useState(0);

  const swatchRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selected = shadeSwatches[selectedIndex];
  const rowCount = Math.ceil(shadeSwatches.length / COLUMNS);

  /** 화살표 이동 = 선택 이동 (roving tabindex) */
  const moveTo = useCallback((nextIndex: number) => {
    const clamped = Math.min(Math.max(nextIndex, 0), shadeSwatches.length - 1);
    setSelectedIndex(clamped);
    swatchRefs.current[clamped]?.focus();
  }, []);

  const handleSwatchKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      const row = Math.floor(index / COLUMNS);
      const column = index % COLUMNS;
      let next: number;

      switch (event.key) {
        case 'ArrowRight':
          next = column < COLUMNS - 1 ? index + 1 : index;
          break;
        case 'ArrowLeft':
          next = column > 0 ? index - 1 : index;
          break;
        case 'ArrowDown':
          next = row < rowCount - 1 ? index + COLUMNS : index;
          break;
        case 'ArrowUp':
          next = row > 0 ? index - COLUMNS : index;
          break;
        case 'Home':
          next = row * COLUMNS;
          break;
        case 'End':
          next = row * COLUMNS + COLUMNS - 1;
          break;
        // radio 역할에서는 Space/Enter 로도 선택할 수 있어야 한다.
        case ' ':
        case 'Enter':
          next = index;
          break;
        default:
          return;
      }

      event.preventDefault();
      moveTo(next);
    },
    [moveTo, rowCount],
  );

  /** 행 라벨과 견본을 함께 묶어 둔다 (원본 인덱스를 잃지 않도록 index 를 들고 다닌다) */
  const rows = ROW_KEYS.map((rowKey) => ({
    key: rowKey,
    label: rowKey === 'A' ? t('rowA') : t('rowB'),
    entries: shadeSwatches
      .map((swatch, index) => ({ swatch, index }))
      .filter((entry) => entry.swatch.row === rowKey),
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

      {/* ── 농도별 견본 (이산형 선택기) ───────────────────────────── */}
      <div className="mt-12 sm:mt-16">
        <h3 className="text-[1.25rem] leading-snug font-bold tracking-[-0.015em] break-keep text-[var(--color-indigo-deep)] sm:text-[1.5rem]">
          {t('gridTitle')}
        </h3>
        <p
          id="shade-grid-help"
          className="mt-3 max-w-2xl text-sm leading-relaxed break-keep text-[var(--color-slate-muted)]"
        >
          {t('gridHelp')}
        </p>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
          {/*
            선택 결과 — 모바일에서는 격자 아래, 데스크톱에서는 오른쪽.
            모바일에서 이 패널을 먼저 두면 무엇을 고른 결과인지 보기 전에 큰 색면부터 만나
            이미지가 깨진 자리처럼 읽힌다. 조작(격자) → 결과 순서를 지킨다.
          */}
          <div className="order-2 lg:order-2 lg:w-[19rem] lg:shrink-0">
            {/* 모바일에서는 '큰 색면 하나'가 아니라 '고른 칸의 확대'로 읽히도록 폭을 줄인다 */}
            <div className="relative aspect-[193/182] w-full max-w-[9rem] overflow-hidden rounded-md border border-[color:var(--color-washed)] bg-white lg:max-w-none">
              <Image
                key={selected.code}
                src={selected.image}
                alt={t('swatchAlt', { code: selected.code })}
                fill
                unoptimized
                sizes="(max-width: 1024px) 60vw, 304px"
                className="swatch-true-color object-cover"
              />
            </div>
            <p
              aria-live="polite"
              className="mt-3 text-sm font-semibold break-keep text-[var(--color-indigo-deep)]"
            >
              {t('swatchLabel', { code: selected.code })}
            </p>
            <SourceNote className="mt-2">{tc('imageNoteSwatch')}</SourceNote>

            {/*
              문의 버튼은 고른 견본 바로 아래에 둔다.
              페이지 맨 아래에 두면 견본을 고른 사실과 버튼이 1,300px 떨어져
              어떤 색으로 문의가 넘어가는지 화면에서 이어 보이지 않는다.
              버튼 안의 코드는 /contact 로 넘기는 shade 쿼리 값과 같은 값이다.
            */}
            <Link
              href={{ pathname: '/contact', query: { shade: selected.code } }}
              aria-label={`${t('inquiryCta')} (${t('swatchLabel', { code: selected.code })})`}
              className="mt-5 inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-md bg-[var(--color-indigo-deep)] px-4 py-3 text-sm font-semibold break-keep text-white transition-colors hover:bg-[var(--color-denim)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-denim)]"
            >
              {t('inquiryCta')}
              <span
                aria-hidden="true"
                className="rounded bg-white/15 px-1.5 py-0.5 font-mono text-[0.75rem] tracking-wide"
              >
                {selected.code}
              </span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* 2행 6열 격자 + Low → High 축 */}
          <div className="order-1 min-w-0 flex-1 lg:order-1">
            <AssetKind>{tc('catalogueFigure')}</AssetKind>
            <p
              id="shade-keyboard-hint"
              className="mt-3 max-w-2xl text-[0.8125rem] leading-relaxed break-keep text-[var(--color-slate-muted)]"
            >
              {t('keyboardHint')}
            </p>

            <div
              role="radiogroup"
              aria-label={t('gridTitle')}
              aria-describedby="shade-grid-help shade-keyboard-hint"
              className="mt-4 grid grid-cols-[auto_repeat(6,minmax(0,1fr))] items-start gap-x-1.5 gap-y-3 sm:gap-x-2.5 sm:gap-y-4"
            >
              {rows.map((row) => (
                <Fragment key={row.key}>
                  <span className="self-center pr-1 text-[0.7rem] font-medium whitespace-nowrap text-[var(--color-slate-muted)] sm:pr-2 sm:text-xs">
                    {row.label}
                  </span>
                  {row.entries.map(({ swatch, index }) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <div key={swatch.code} className="min-w-0">
                        {/*
                          hover 표시를 1px 테두리가 아니라 바깥쪽 링으로 준다.
                          B1~B6 처럼 거의 남색인 견본 위에서는 denim 1px 선이 보이지 않아
                          격자가 눌리지 않는 색상 램프로 읽힌다. 링은 견본 바깥에 생겨 색을 가리지 않는다.
                        */}
                        <button
                          type="button"
                          ref={(el) => {
                            swatchRefs.current[index] = el;
                          }}
                          role="radio"
                          aria-checked={isSelected}
                          aria-label={t('swatchLabel', { code: swatch.code })}
                          tabIndex={isSelected ? 0 : -1}
                          onClick={() => setSelectedIndex(index)}
                          onKeyDown={(event) => handleSwatchKeyDown(event, index)}
                          className={`relative block aspect-[193/182] w-full cursor-pointer overflow-hidden rounded-md border bg-white transition-[box-shadow,border-color] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-denim)] ${
                            isSelected
                              ? 'border-[color:var(--color-indigo-deep)] ring-2 ring-[var(--color-indigo-deep)] ring-offset-2 ring-offset-[var(--color-ivory)]'
                              : 'border-[color:var(--color-washed)] hover:ring-2 hover:ring-[var(--color-denim)]/50 hover:ring-offset-2 hover:ring-offset-[var(--color-ivory)]'
                          }`}
                        >
                          <Image
                            src={swatch.image}
                            alt=""
                            fill
                            unoptimized
                            sizes="(max-width: 640px) 14vw, (max-width: 1024px) 12vw, 100px"
                            className="swatch-true-color object-cover"
                          />
                        </button>
                        <span
                          aria-hidden="true"
                          className={`mt-1.5 block text-center text-[0.65rem] tracking-wide sm:text-[0.7rem] ${
                            isSelected
                              ? 'font-semibold text-[var(--color-indigo-deep)]'
                              : 'text-[var(--color-slate-muted)]'
                          }`}
                        >
                          {swatch.code}
                        </span>
                      </div>
                    );
                  })}
                </Fragment>
              ))}

              {/* 축: 그라디언트 막대가 아니라 얇은 선 + 양끝 라벨 */}
              <span aria-hidden="true" />
              <div className="col-span-6 mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-[0.7rem] font-medium tracking-wide text-[var(--color-slate-muted)]">
                    {t('axisLow')}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-px flex-1 bg-[color:var(--color-washed)]"
                  />
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

            {/*
              모바일에서는 결과 패널이 격자 아래에 있어 시선에서 멀다.
              손가락 근처에서도 선택이 바뀐 것이 보이도록 코드를 한 줄 반복한다.
              읽어 주는 것은 패널의 aria-live 하나면 충분하므로 여기서는 감춘다.
            */}
            <p
              aria-hidden="true"
              className="mt-4 text-sm font-semibold break-keep text-[var(--color-indigo-deep)] lg:hidden"
            >
              {t('swatchLabel', { code: selected.code })}
            </p>

            <SourceNote className="mt-6 max-w-2xl">{t('duplicateNote')}</SourceNote>
          </div>
        </div>
      </div>

      {/* ── 인디루빈 조성 비교 ─────────────────────────────────── */}
      <div className="mt-16 border-t border-[color:var(--color-washed)] pt-12 sm:mt-20 sm:pt-14">
        {/* 표·비교 블록의 제목 단(md). 1.875rem 에서 멈추면 바로 아래 카드 제목(1.125rem)과 붙어 보인다. */}
        <h3
          className={`${HEADING_SIZE.md} leading-snug font-bold tracking-[-0.02em] break-keep text-[var(--color-indigo-deep)]`}
        >
          {t('indirubinTitle')}
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
      {/* 문의 버튼은 선택 결과 패널로 옮겼다. 여기에는 색상 조건 안내만 남긴다. */}
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
