import { getTranslations } from 'next-intl/server';
import SectionHeading from '@/components/blugene/SectionHeading';
import SourceNote from '@/components/blugene/SourceNote';
import ZoomableImage from '@/components/blugene/ZoomableImage';
import { inkProcessImage, inkProcessSteps, printingPairs } from '@/data/blugene/shades';

/**
 * 디지털 프린팅 섹션 — 카탈로그 p.9 Figure 6-1 · 6-2.
 *
 * 세 가지를 한 흐름으로 보여준다.
 * 1) 원작 이미지 / 바이오 인디고 잉크 프린팅 결과 두 쌍 (Figure 6-2).
 *    - 원작은 PDF 내장 원본이 184~203px 로 작다. 컨테이너 폭을 제한하고 `object-contain` 으로 두어
 *      과도하게 확대된 저해상도 이미지를 보여주지 않는다.
 *    - "전 · 후 성능 개선" 사진이 아니고 원작자 · 고객 정보도 제공 자료에 없다는 점을 pairNote 로 반드시 밝힌다.
 * 2) 잉크 제조 5단계 흐름 (Figure 6-1). 도판을 그대로 키우지 않고 SVG 레일 · 화살표로 직접 그린다.
 *    - 각 단계에는 카탈로그 원문 표기(sourceLabel)를 함께 적는다. 특히 마지막 단계의 원문은 'Formation' 이며
 *      확정된 공정 전문용어로 덮어쓰지 않는다(processNote).
 *    - 원본 도판은 ZoomableImage 로 언제든 확인할 수 있게 한다.
 * 3) 디지털 프린팅의 특징 3가지. 카탈로그에 있는 일반론적 절감 범위는 Blugene 제품 측정값이 아니므로
 *    수치로 쓰지 않고 advantagesNote 로 그 이유를 밝힌다.
 *
 * 이 컴포넌트는 페이지 쪽에서 이미 섹션 · 컨테이너 안에 놓이므로 자체 배경과 좌우 여백을 만들지 않는다.
 */

/** messages/ko.json → Printing.steps 의 각 항목 */
interface ProcessStepCopy {
  title: string;
  text: string;
}

/** 가로 진행 화살표 (PC) — 장식 */
function ArrowRight() {
  return (
    <svg viewBox="0 0 24 8" className="h-2 w-6 shrink-0" fill="none" aria-hidden="true" focusable="false">
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

/** 단계 번호 노드 — 순서는 <ol> 이 전달하므로 그림은 장식으로 둔다 */
function StepNode({ step }: { step: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-denim)] text-[0.8125rem] font-semibold tabular-nums text-[var(--color-denim)]"
    >
      {step}
    </span>
  );
}

/** 한 쌍의 한쪽(원작 또는 프린팅 결과) */
function PairSide({
  label,
  src,
  alt,
  width,
  height,
  openLabel,
  closeLabel,
  hint,
  frameClassName,
  sizes,
}: {
  label: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  openLabel: string;
  closeLabel: string;
  hint: string;
  /** 원본 픽셀보다 크게 늘어나지 않도록 폭을 제한한다 */
  frameClassName: string;
  sizes: string;
}) {
  return (
    <figure className="flex h-full flex-col">
      <figcaption className="text-[0.72rem] leading-snug font-semibold tracking-[0.08em] break-keep text-[var(--color-denim)]">
        {label}
      </figcaption>
      <div className="mt-3 flex flex-1 items-end">
        <div className={`w-full ${frameClassName}`}>
          <ZoomableImage
            src={src}
            alt={alt}
            width={width}
            height={height}
            openLabel={openLabel}
            closeLabel={closeLabel}
            hint={hint}
            sizes={sizes}
            imgClassName="object-contain"
          />
        </div>
      </div>
    </figure>
  );
}

export default async function PrintingGallery() {
  const t = await getTranslations('Printing');
  const tCommon = await getTranslations('Common');

  const steps = t.raw('steps') as ProcessStepCopy[];
  const advantages = t.raw('advantages') as string[];

  const openLabel = tCommon('openImage');
  const closeLabel = tCommon('close');
  const photoHint = tCommon('imageNotePhoto');

  return (
    <>
      <SectionHeading eyebrow={t('eyebrow')} title={t('title')} body={t('body')} size="lg" />

      {/* 원작 이미지 / 프린팅 결과 두 쌍 — 카탈로그 p.9 Figure 6-2 */}
      <ul className="mt-12 grid gap-12 sm:mt-14 lg:grid-cols-2 lg:gap-14">
        {printingPairs.map((pair, index) => (
          <li key={pair.id} className="border-t border-[color:var(--color-washed)] pt-7">
            <div className="grid grid-cols-2 gap-5 sm:gap-8">
              <PairSide
                label={t('pairOriginal')}
                src={pair.original.image}
                alt={t('pairAltOriginal', { index: index + 1 })}
                width={pair.original.width}
                height={pair.original.height}
                openLabel={openLabel}
                closeLabel={closeLabel}
                hint={photoHint}
                frameClassName="max-w-[190px]"
                sizes="(max-width: 640px) 42vw, 190px"
              />
              <PairSide
                label={t('pairPrinted')}
                src={pair.printed.image}
                alt={t('pairAltPrinted', { index: index + 1 })}
                width={pair.printed.width}
                height={pair.printed.height}
                openLabel={openLabel}
                closeLabel={closeLabel}
                hint={photoHint}
                frameClassName="max-w-[280px]"
                sizes="(max-width: 640px) 46vw, 280px"
              />
            </div>
          </li>
        ))}
      </ul>

      {/* 전 · 후 성능 비교가 아니라는 점과 원작자 정보 부재를 본문 흐름 안에서 밝힌다 */}
      <div className="mt-10 max-w-3xl border-l-2 border-[color:var(--color-denim)] pl-5 sm:pl-6">
        <SourceNote className="text-sm sm:text-[0.9375rem]">{t('pairNote')}</SourceNote>
      </div>

      {/* 잉크 제조 흐름 — 카탈로그 p.9 Figure 6-1 */}
      <div className="mt-16 border-t border-[color:var(--color-washed)] pt-12 sm:mt-20 sm:pt-14">
        <h3 className="text-xl font-bold tracking-[-0.01em] break-keep text-[var(--color-indigo-deep)] sm:text-2xl">
          {t('processTitle')}
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-[1.85] break-keep text-[var(--color-ink)]/80 sm:text-base">
          {t('processCaption')}
        </p>

        <ol className="mt-10 grid grid-cols-1 lg:grid-cols-5 lg:gap-x-0">
          {inkProcessSteps.map((step, index) => {
            const copy = steps[index];
            const isLast = index === inkProcessSteps.length - 1;

            return (
              <li key={step.key} className="relative flex gap-4 pb-8 last:pb-0 lg:block lg:gap-0 lg:pb-0">
                {/* 모바일 세로 연결선 — 노드 아래에서 시작해 다음 단계로 이어진다 */}
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="absolute top-10 bottom-6 left-4 w-px bg-[color:var(--color-washed)] lg:hidden"
                  />
                )}

                {/* 단계 노드 + 가로 레일 (PC) */}
                <div className="flex shrink-0 items-center self-start text-[var(--color-denim)]/50 lg:mb-5">
                  <StepNode step={index + 1} />
                  {!isLast && (
                    <>
                      <span
                        aria-hidden="true"
                        className="mx-2 hidden h-px flex-1 bg-[color:var(--color-washed)] lg:block"
                      />
                      <span aria-hidden="true" className="hidden lg:block">
                        <ArrowRight />
                      </span>
                    </>
                  )}
                </div>

                <div className="min-w-0 lg:pr-6">
                  <h4 className="text-base font-bold break-keep text-[var(--color-indigo-deep)]">
                    {copy.title}
                  </h4>
                  {/* 카탈로그 원문 표기 — 번역하지 않는다 */}
                  <p className="mt-1.5 font-mono text-[0.72rem] tracking-tight text-[var(--color-slate-muted)]">
                    {step.sourceLabel}
                  </p>
                  <p className="mt-2.5 max-w-[34ch] text-sm leading-[1.85] break-keep text-[var(--color-ink)]/80">
                    {copy.text}
                  </p>
                </div>

                {/* 모바일 진행 방향 표시 */}
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-0 left-3 text-[var(--color-denim)]/45 lg:hidden"
                  >
                    <ArrowDown />
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        {/* 원본 도판 — 그림 자체를 확인하고 싶을 때만 내려받는다 */}
        <div className="mt-12 max-w-[900px]">
          <ZoomableImage
            src={inkProcessImage}
            alt={t('processAlt')}
            width={1363}
            height={390}
            openLabel={tCommon('viewOriginal')}
            closeLabel={closeLabel}
            hint={photoHint}
            sizes="(max-width: 768px) 92vw, 900px"
          />
        </div>

        <SourceNote className="mt-6 max-w-3xl">{t('processNote')}</SourceNote>
      </div>

      {/* 디지털 프린팅의 특징 */}
      <div className="mt-16 border-t border-[color:var(--color-washed)] pt-12 sm:mt-20 sm:pt-14">
        <h3 className="text-xl font-bold tracking-[-0.01em] break-keep text-[var(--color-indigo-deep)] sm:text-2xl">
          {t('advantagesTitle')}
        </h3>

        <ul className="mt-8 grid gap-8 sm:grid-cols-3 sm:gap-10">
          {advantages.map((advantage) => (
            <li key={advantage}>
              <span aria-hidden="true" className="block h-[3px] w-12 bg-[var(--color-indigo-deep)]" />
              <p className="mt-4 text-sm leading-[1.85] break-keep text-[var(--color-ink)]/85 sm:text-base">
                {advantage}
              </p>
            </li>
          ))}
        </ul>

        <SourceNote className="mt-9 max-w-3xl">{t('advantagesNote')}</SourceNote>
      </div>
    </>
  );
}
