import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import SourceNote from '@/components/blugene/SourceNote';

/**
 * 「원료에서 원단까지」 4단계 생산 경로 개념도.
 *
 * 카탈로그 p.2(생산 경로)와 p.12(가치사슬)의 흐름을 읽기 쉽게 4단계로 요약한 그림이며,
 * 수치를 담지 않는 개념도이므로 데이터 모듈에서 값을 가져오지 않는다. (새로운 수치를 만들지 않는다.)
 *
 * 아이콘은 직접 그린 단순한 선 아이콘이고 순수 장식(aria-hidden)이다. 의미는 언제나 제목·본문 텍스트가 담는다.
 * 화학구조식 · DNA 문자 · 인증마크처럼 보이는 형태는 쓰지 않는다.
 * 단계 사이 화살표도 장식이며, 순서는 <ol> 의 목록 구조가 보조기기에 전달한다.
 * 공정이 아무 투입물 없이 이루어진다는 인상을 주지 않도록 diagramNote 를 그림 바로 아래에 둔다.
 */

/** messages/ko.json → Science.steps 의 각 항목 */
type PathwayStep = { title: string; text: string };

type IconKey = 'feedstock' | 'fermentation' | 'recovery' | 'fabric';

/** Science.steps 순서(재생 가능한 원료 → 미생물 발효 → 인디고 회수·제품화 → 원단 염색·프린팅) */
const ICON_ORDER: readonly IconKey[] = ['feedstock', 'fermentation', 'recovery', 'fabric'];

/** 모든 단계 아이콘이 공유하는 선 스타일 프레임 */
function IconFrame({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/**
 * 단계 아이콘. 전부 장식이므로 대체 텍스트를 두지 않는다.
 * sage 는 획 하나 정도의 좁은 포인트로만 쓰고, 본체는 인디고/데님 계열 색을 상속받는다.
 */
function StepIcon({ icon }: { icon: IconKey }) {
  if (icon === 'feedstock') {
    // 재생 가능한 원료 — 줄기와 잎 두 장, 바닥선 한 획만 sage
    return (
      <IconFrame>
        <path d="M24 41V19" />
        <path d="M24 29c-7 0-12-5-12-12 7 0 12 5 12 12Z" />
        <path d="M24 24c7 0 12-5 12-12-7 0-12 5-12 12Z" />
        <g className="text-[var(--color-sage)]" stroke="currentColor">
          <path d="M14 41h20" />
        </g>
      </IconFrame>
    );
  }

  if (icon === 'fermentation') {
    // 미생물 발효 — 발효조와 액면, 투입구. 기포만 sage
    return (
      <IconFrame>
        <path d="M24 8v5" />
        <path d="M20.5 8h7" />
        <path d="M11 13h26" />
        <path d="M13 13v14c0 6 4.9 9 11 9s11-3 11-9V13" />
        <path d="M13 26c2.75 0 2.75-2 5.5-2s2.75 2 5.5 2 2.75-2 5.5-2 2.75 2 5.5 2" />
        <g className="text-[var(--color-sage)]" fill="currentColor" stroke="none">
          <circle cx="19" cy="31" r="1.4" />
          <circle cx="25" cy="33" r="1.9" />
          <circle cx="30" cy="30" r="1.1" />
        </g>
      </IconFrame>
    );
  }

  if (icon === 'recovery') {
    // 인디고 회수 · 제품화 — 쏟아져 쌓이는 분말 더미. 알갱이만 sage
    return (
      <IconFrame>
        <path d="M24 12v3.5" />
        <path d="M20.5 15v2" />
        <path d="M27.5 15v2" />
        <path d="M11 34c5.5 0 6-13 13-13s7.5 13 13 13" />
        <path d="M9 34h30" />
        <g className="text-[var(--color-sage)]" fill="currentColor" stroke="none">
          <circle cx="21" cy="29" r="1" />
          <circle cx="24.5" cy="26.5" r="1" />
          <circle cx="28" cy="30.5" r="1" />
        </g>
      </IconFrame>
    );
  }

  // 원단 염색 · 프린팅 — 아래 자락이 물결치는 원단. 아래쪽 선 한 획만 sage
  return (
    <IconFrame>
      <path d="M10 11h28v21c-3.5 0-3.5 3-7 3s-3.5-3-7-3-3.5 3-7 3-3.5-3-7-3V11Z" />
      <path d="M15.5 18h17" />
      <g className="text-[var(--color-sage)]" stroke="currentColor">
        <path d="M15.5 24.5h17" />
      </g>
    </IconFrame>
  );
}

/** 가로 진행 화살표 (태블릿·PC) — 장식 */
function ArrowRight() {
  return (
    <svg viewBox="0 0 24 8" className="h-2 w-6" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M0 4h20m-3-3 3 3-3 3"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** 세로 진행 화살표 (모바일) — 장식 */
function ArrowDown() {
  return (
    <svg viewBox="0 0 8 24" className="h-6 w-2" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M4 0v20m-3-3 3 3 3-3"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function ProductionPathway({
  variant = 'section',
  className = '',
}: {
  /** 'section' 이면 배경·여백을 가진 독립 섹션, 'bare' 면 도표만 반환한다 */
  variant?: 'section' | 'bare';
  className?: string;
}) {
  const t = await getTranslations('Science');
  const steps = t.raw('steps') as PathwayStep[];

  // 'bare' 는 이미 h2 를 가진 섹션(ScienceSection) 안에 놓이므로 제목 단계를 한 칸 낮춘다.
  const DiagramTitleTag: 'h2' | 'h3' = variant === 'section' ? 'h2' : 'h3';
  const StepTitleTag: 'h3' | 'h4' = variant === 'section' ? 'h3' : 'h4';

  const content = (
    <>
      <DiagramTitleTag className="text-xl font-bold tracking-[-0.01em] break-keep text-[var(--color-indigo-deep)] sm:text-2xl">
        {t('diagramTitle')}
      </DiagramTitleTag>

      <ol className="mt-10 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-0">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          // 태블릿 2열에서는 행의 끝(홀수 번째)에 가로 화살표를 두지 않는다.
          const rightArrowVisibility = index % 2 === 0 ? 'hidden sm:block' : 'hidden lg:block';

          return (
            <li key={step.title} className="relative">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-[color:var(--color-washed)] text-[var(--color-denim)]">
                  <StepIcon icon={ICON_ORDER[index] ?? 'feedstock'} />
                </span>
                {/*
                  단계 번호는 <ol> 이 이미 순서를 전달하므로 보조기기에는 숨기지만,
                  화면에서는 읽히는 글자다. washed(#BDD0E3, 약 1.6:1)는 배경과 구분되지 않아
                  보조 텍스트용 slate-muted(#566378 — ivory 위 5.3:1, 흰 배경 위 6.1:1)로 올린다.
                */}
                <span
                  aria-hidden="true"
                  className="text-[0.72rem] font-semibold tracking-[0.18em] text-[var(--color-slate-muted)]"
                >
                  {`0${index + 1}`}
                </span>
              </div>

              <StepTitleTag className="mt-5 text-base font-bold break-keep text-[var(--color-indigo-deep)] sm:text-lg">
                {step.title}
              </StepTitleTag>
              <p className="mt-2.5 max-w-[34ch] text-sm leading-[1.85] break-keep text-[var(--color-ink)]/80">
                {step.text}
              </p>

              {!isLast && (
                <>
                  {/*
                    진행 화살표도 장식이지만 획이 얇아 denim/45(약 2:1)로는 형태가 보이지 않는다.
                    번호와 같은 slate-muted 로 맞춰 비텍스트 대비 3:1 기준을 넘긴다.
                  */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-9 left-6 text-[var(--color-slate-muted)] sm:hidden"
                  >
                    <ArrowDown />
                  </span>
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute top-6 text-[var(--color-slate-muted)] sm:-right-7 lg:-right-6 ${rightArrowVisibility}`}
                  >
                    <ArrowRight />
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-14 max-w-3xl space-y-2 border-t border-[color:var(--color-washed)] pt-5">
        <SourceNote>{t('diagramNote')}</SourceNote>
        <SourceNote>{t('metaphorNote')}</SourceNote>
      </div>
    </>
  );

  if (variant === 'bare') {
    return <div className={className}>{content}</div>;
  }

  return (
    <section className={`w-full bg-[var(--color-ivory)] ${className}`}>
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        {content}
      </div>
    </section>
  );
}
