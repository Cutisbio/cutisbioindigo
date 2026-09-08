import { getTranslations } from 'next-intl/server';
import SourceNote, { AssetKind } from '@/components/blugene/SourceNote';
import Image from 'next/image';

/**
 * 「원료에서 원단까지」 4단계 생산 경로 개념도.
 *
 * 카탈로그 p.2(생산 경로)와 p.12(가치사슬)의 흐름을 읽기 쉽게 4단계로 요약한 그림이며,
 * 수치를 담지 않는 개념도이므로 데이터 모듈에서 값을 가져오지 않는다. (새로운 수치를 만들지 않는다.)
 *
 * 단계 사진은 고객이 준 시안에서 잘라낸 개념 이미지다(public/blugene/technology/pathway, 출처는 asset-manifest).
 * 32px 선 아이콘 → 인라인 SVG 삽화(커밋 60325d8)를 거쳐 사진으로 바뀌었다. CutisBio 의 설비 · 제품을 찍은
 * 사진이 아니므로 제목 옆 '개념 이미지' 배지와 대체 텍스트가 그 사실을 밝힌다.
 * 단계 사이 화살표는 장식이며, 순서는 <ol> 의 목록 구조가 보조기기에 전달한다.
 * 그림 아래 diagramNote 는 고객이 준 브랜드 서사(원료 → 염료 · 잉크 → 데님)다. 인증은 공정이 아니라
 * 염료 제품이 받은 것이므로(docs/blugene-claims.md) 인증명을 염료에 붙여 쓴다. 이 키는 금지어 검사를
 * 면제받지 않는다(check-blugene-data.mjs DISCLAIMER_KEYS). DNA 비유의 해명은 /brand 의 Brand.nameNote 에 있다.
 */

/** messages/ko.json → Science.steps 의 각 항목 */
type PathwayStep = { title: string; text: string; imageAlt: string };

/** Science.steps 순서와 같다. 사진은 1:1 로 잘라 두었다. */
const STEP_IMAGES = [
  '/blugene/technology/pathway/01-feedstock.jpg',
  '/blugene/technology/pathway/02-fermentation.jpg',
  '/blugene/technology/pathway/03-recovery.jpg',
  '/blugene/technology/pathway/04-fabric.jpg',
] as const;

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
  const tCommon = await getTranslations('Common');
  const steps = t.raw('steps') as PathwayStep[];

  // 'bare' 는 이미 h2 를 가진 섹션(ScienceSection) 안에 놓이므로 제목 단계를 한 칸 낮춘다.
  const DiagramTitleTag: 'h2' | 'h3' = variant === 'section' ? 'h2' : 'h3';
  const StepTitleTag: 'h3' | 'h4' = variant === 'section' ? 'h3' : 'h4';

  const content = (
    <>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <DiagramTitleTag className="text-xl font-bold tracking-[-0.01em] break-keep text-[var(--color-indigo-deep)] sm:text-2xl">
          {t('diagramTitle')}
        </DiagramTitleTag>
        {/* 사진이 실제 설비 · 제품으로 오해되지 않도록 기술 페이지와 같은 배지를 붙인다 */}
        <AssetKind>{tCommon('conceptImage')}</AssetKind>
      </div>

      <ol className="mt-10 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-0">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          // 태블릿 2열에서는 행의 끝(홀수 번째)에 가로 화살표를 두지 않는다.
          const rightArrowVisibility = index % 2 === 0 ? 'hidden sm:block' : 'hidden lg:block';

          return (
            <li key={step.title} className="relative">
              {/* 사진은 열 너비를 다 쓴다(1:1). 모바일 한 열에서는 화면을 다 차지하지 않도록 폭을 묶는다. */}
              <div className="relative max-w-[300px] sm:max-w-none">
                <div className="relative aspect-square overflow-hidden rounded-md bg-[var(--color-washed)]">
                  <Image
                    src={STEP_IMAGES[index] ?? STEP_IMAGES[0]}
                    alt={step.imageAlt}
                    fill
                    sizes="(max-width: 640px) 300px, (max-width: 1024px) 45vw, 286px"
                    className="object-cover"
                  />
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
