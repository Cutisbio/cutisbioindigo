import { getTranslations } from 'next-intl/server';
import SourceNote from '@/components/blugene/SourceNote';
import PathwayArt, { PATHWAY_STEPS } from '@/components/blugene/PathwayArt';

/**
 * 「원료에서 원단까지」 4단계 생산 경로 개념도.
 *
 * 카탈로그 p.2(생산 경로)와 p.12(가치사슬)의 흐름을 읽기 쉽게 4단계로 요약한 그림이며,
 * 수치를 담지 않는 개념도이므로 데이터 모듈에서 값을 가져오지 않는다. (새로운 수치를 만들지 않는다.)
 *
 * 단계 그림은 PathwayArt 의 인라인 SVG 삽화이고 순수 장식(aria-hidden)이다. 의미는 언제나 제목·본문 텍스트가 담는다.
 * 예전에는 32px 선 아이콘이었는데 너무 작고 단순해서 단계 내용(옥수수 · 미생물 · 분말과 잉크 · 염색과 프린팅)이
 * 보이지 않는다는 지적을 받았다. 지금은 열 너비를 다 쓰는 4:3 삽화다. 서체 · 색 · 금지 형태 규칙은 PathwayArt 에 있다.
 * 단계 사이 화살표는 장식이며, 순서는 <ol> 의 목록 구조가 보조기기에 전달한다.
 * 공정이 아무 투입물 없이 이루어진다는 인상을 주지 않도록 diagramNote 를 그림 바로 아래에 둔다.
 */

/** messages/ko.json → Science.steps 의 각 항목 */
type PathwayStep = { title: string; text: string };

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
              {/* 삽화는 열 너비를 다 쓴다(4:3). 모바일 한 열에서는 화면을 다 차지하지 않도록 폭을 묶는다. */}
              <div className="relative max-w-[300px] sm:max-w-none">
                <div className="overflow-hidden rounded-md border border-[color:var(--color-washed)] bg-white">
                  <PathwayArt step={PATHWAY_STEPS[index] ?? 'feedstock'} />
                </div>
                {/*
                  단계 번호는 <ol> 이 이미 순서를 전달하므로 보조기기에는 숨기지만, 화면에서는 읽히는 글자다.
                  washed(#BDD0E3, 약 1.6:1)는 배경과 구분되지 않아 slate-muted(#566378 — 흰 배경 위 6.1:1)로 쓴다.
                */}
                <span
                  aria-hidden="true"
                  className="absolute top-3 left-3 rounded bg-white/90 px-1.5 py-0.5 text-[0.72rem] font-semibold tracking-[0.18em] text-[var(--color-slate-muted)]"
                >
                  {`0${index + 1}`}
                </span>

                {!isLast && (
                  <>
                    {/*
                      진행 화살표도 장식이지만 획이 얇아 denim/45(약 2:1)로는 형태가 보이지 않는다.
                      번호와 같은 slate-muted 로 맞춰 비텍스트 대비 3:1 기준을 넘긴다. 삽화 세로 가운데에 둔다.
                    */}
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-[var(--color-slate-muted)] sm:-right-7 lg:-right-6 ${rightArrowVisibility}`}
                    >
                      <ArrowRight />
                    </span>
                  </>
                )}
              </div>

              <StepTitleTag className="mt-5 text-base font-bold break-keep text-[var(--color-indigo-deep)] sm:text-lg">
                {step.title}
              </StepTitleTag>
              <p className="mt-2.5 max-w-[34ch] text-sm leading-[1.85] break-keep text-[var(--color-ink)]/80">
                {step.text}
              </p>

              {!isLast && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-9 left-6 text-[var(--color-slate-muted)] sm:hidden"
                >
                  <ArrowDown />
                </span>
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
