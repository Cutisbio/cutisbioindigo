import type { ReactNode } from 'react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import SectionHeading, { HEADING_SIZE, keepLastWords } from '@/components/blugene/SectionHeading';
import SourceNote from '@/components/blugene/SourceNote';

/**
 * 탄소는 어디에서 오는가 — 기술 페이지의 탄소 경로 단락.
 *
 * 고객이 준 HTML(Blugene_Carbon_Comparison.html, 2026-09-11)의 내용을 이 사이트의 디자인 언어로 옮긴 것이다.
 * 원문의 맨 위 블록(청바지 사진 · 제목)은 고객 요청으로 뺐고, 그 도입 문장만 이 단락의 본문(carbon.lead)으로 썼다.
 *
 * 구성 (문구는 messages 의 Technology.carbon)
 *   01 탄소의 여정  — 바이오 기반 · 석유화학 두 경로를 같은 4단계(원료 → 생산 → 제품 → 사용 이후)로 위아래로 보여 준다.
 *                    단계마다 원문의 삽화(나무 · 발효조 · 인디고와 데님 · 구름 / 채굴 펌프 · 화학 공장)를 그대로 쓴다.
 *                    삽화는 원문 HTML 의 스프라이트(3×2, 1536×1024)를 512px 타일로 잘라 둔 것이다
 *                    (public/blugene/technology/carbon/, 출처는 asset-manifest.json).
 *                    카탈로그 p.2 Figure 1-2 개념도(「카탈로그의 개념도」 블록)는 2026-09-12 고객 요청으로 뺐다. 파일은 남아 있다.
 *   02 출처가 중요한 이유 — 같은 탄소, 다른 시간 척도.
 *   03 분명한 근거 — 바이오 기반 탄소 함량 시험(ASTM D6866)과 전과정평가(LCA)는 다른 질문에 답한다.
 *   FAQ · 맺음 · 근거 자료(외부 링크)
 *
 * 근거와 한계
 * - 이 단락은 원료 탄소의 출처를 설명할 뿐, 탄소중립 · 배출 저감 수치 · 생분해 · 전량 회수를 주장하지 않는다.
 *   본문이 그 점을 스스로 밝히므로 해당 키는 check-blugene-data 의 금지어 검사에서 면제한다.
 * - 원문의 '바이오 기반 함량 100%' FAQ 는 이 사이트의 시험값(98%, /data-certifications)과 어긋나지 않도록
 *   일반 설명으로 고치고 데이터 페이지를 가리키게 했다.
 * - 외부 자료 링크(SOURCE_URLS)는 번역 대상이 아니라 코드에 둔다. 순서는 messages 의 sources.items 와 같다.
 */

const SOURCE_URLS = [
  'https://science.nasa.gov/earth/earth-observatory/the-carbon-cycle/',
  'https://store.astm.org/d6866-24a.html',
  'https://ghgprotocol.org/product-standard',
  'https://www.biopreferred.gov/BioPreferred/faces/pages/FAQs.xhtml',
] as const;

type Step = { label: string; title: string; text: string; imageAlt: string; note?: string };
type Route = {
  eyebrow: string;
  title: string;
  lede: string;
  chip?: string;
  steps: Step[];
  loop: string;
  loopSub: string;
  coreLabel: string;
  core: string;
  coreSub: string;
};
type CarbonCopy = {
  lead: string;
  journey: {
    eyebrow: string;
    title: string;
    body: string;
    guide: string;
    order: string;
    legendSolid: string;
    legendDashed: string;
    legendNote: string;
    evidenceLink: string;
  };
  routes: Route[];
  footnote: string;
  origin: {
    eyebrow: string;
    title: string;
    body: string;
    items: { label: string; title: string; text: string; tags: string[] }[];
    closing: string;
  };
  evidence: {
    eyebrow: string;
    title: string;
    body: string;
    items: { label: string; title: string; text: string; tag: string }[];
    calloutTitle: string;
    calloutBody: string;
  };
  faq: { eyebrow: string; title: string; items: { question: string; answers: string[] }[] };
  closing: { eyebrow: string; text: string };
  sources: {
    summary: string;
    introStrong: string;
    introText: string;
    items: { title: string; note: string }[];
    processStrong: string;
    processText: string;
    externalLinkHint: string;
  };
};

const EYEBROW = 'text-[0.72rem] font-semibold tracking-[0.22em] uppercase text-[var(--color-denim)]';
const PART_TITLE = `mt-4 ${HEADING_SIZE.lg} leading-[1.18] font-bold tracking-[-0.02em] text-pretty break-keep text-[var(--color-indigo-deep)]`;
const PART_BODY = 'mt-5 max-w-2xl text-base leading-[1.9] break-keep text-[var(--color-ink)]/85 sm:text-lg';
const CARD = 'rounded-lg border border-[color:var(--color-washed)] bg-white';
const TAG =
  'inline-block rounded-full border border-[color:var(--color-washed)] px-2.5 py-0.5 text-[0.7rem] font-medium tracking-wide break-keep text-[var(--color-slate-muted)]';
const SMALL_LABEL = 'text-[0.7rem] font-semibold tracking-[0.18em] uppercase text-[var(--color-slate-muted)]';

/** 접이식 항목의 열림 표시 — 텍스트 '+' 를 45° 돌려 '×' 로 보이게 한다. 장식이라 aria-hidden. */
function Toggle({ tone = 'ink' }: { tone?: 'ink' | 'inverse' }) {
  return (
    <span
      aria-hidden="true"
      className={`mt-0.5 shrink-0 text-lg leading-none transition-transform group-open:rotate-45 ${
        tone === 'inverse' ? 'text-white/70' : 'text-[var(--color-slate-muted)]'
      }`}
    >
      +
    </span>
  );
}

function PartHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body?: ReactNode }) {
  return (
    <div className="max-w-[52rem]">
      <p className={EYEBROW}>{eyebrow}</p>
      <h3 className={PART_TITLE}>{keepLastWords(title)}</h3>
      {body && <p className={PART_BODY}>{body}</p>}
    </div>
  );
}

/** 단계별 삽화 — 원문 스프라이트를 자른 512px 타일. 순서는 messages 의 routes[i].steps 와 같다. */
const ROUTE_ART = [
  ['bio-biomass-tree', 'fermenter', 'indigo-denim', 'co2-cloud'],
  ['fossil-oil-pump', 'refinery', 'indigo-denim', 'co2-cloud'],
] as const;

/** 카드마다 다른 강조색 — 바이오 기반은 denim(우리 경로 = 파랑), 석유화학은 slate. 제목은 둘 다 indigo-deep. */
const ROUTE_TONE = {
  bio: {
    text: 'text-[var(--color-denim)]',
    top: 'border-t-[var(--color-denim)]',
    wash: 'bg-[color-mix(in_srgb,var(--color-washed)_30%,white)]',
  },
  fossil: {
    text: 'text-[var(--color-slate-muted)]',
    top: 'border-t-[var(--color-slate-muted)]',
    wash: 'bg-[var(--color-ivory)]',
  },
} as const;

/**
 * 단계 사이 화살표. 데스크톱(md 이상)은 그림 세로 중앙 높이에서 오른쪽 열 사이(gap 1.5rem)로 가로로,
 * 모바일은 그림 가로 중앙 아래로 세로로 놓는다. 03 → 04 사이는 원문처럼 점선(처리 조건에 따라 달라지는 배출).
 * 장식이라 aria-hidden. 그림 크기(모바일 6.25rem / sm 8.75rem / md 9.5rem / xl 11rem)와 좌표가 맞물려 있다.
 */
function FlowArrow({ dashed }: { dashed: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 12"
      className="absolute bottom-1 left-[3.125rem] h-3 w-6 -translate-x-1/2 rotate-90 opacity-75 sm:left-[4.375rem] md:top-[4.375rem] md:right-[-1.5rem] md:bottom-auto md:left-auto md:translate-x-0 md:rotate-0 xl:top-[5.125rem]"
    >
      <path d="M0 6H21" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray={dashed ? '3 3' : undefined} />
      <path d="M16 1L21 6L16 11" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/**
 * md 미만에서 04(구름) → 01(나무)로 돌아가는 점선 고리. 데스크톱의 고리 svg 는 md 미만에서 숨기므로,
 * 세로로 쌓인 단계의 왼쪽(li 기준 -0.75rem, ol 의 안쪽 여백 안)에 세로 차선을 두고 단계마다 자기 구간을 그려 잇는다.
 *   01: 그림 중앙 → 아래 끝 (+ 나무 쪽 가로 연결선과 화살촉)   02 · 03: 위 끝 → 아래 끝   04: 위 끝 → 그림 중앙 (+ 구름 쪽 가로 연결선)
 * 그림 중앙 높이: 04 는 pt-4 · pb-4 라 li 중앙, 01 은 pt-4 · pb-9 라 li 중앙보다 0.625rem 위. 단계 사이에 gap 이 없어 구간이 이어진다.
 * 장식이라 aria-hidden. 2026-09-12 고객 요청(모바일에서도 순환 점선이 보이게).
 */
function ReturnLane({ position }: { position: 'start' | 'middle' | 'end' }) {
  const center = position === 'start' ? 'top-[calc(50%-0.625rem)]' : 'top-1/2';
  const span =
    position === 'start' ? `${center} bottom-0` : position === 'end' ? 'top-0 bottom-1/2' : 'top-0 bottom-0';
  return (
    <span aria-hidden="true" className="md:hidden">
      <span className={`absolute left-[-0.75rem] border-l border-dashed border-current ${span}`} />
      {position !== 'middle' && (
        <span className={`absolute left-[-0.75rem] w-3 border-t border-dashed border-current ${center}`} />
      )}
      {position === 'start' && (
        <span
          className={`absolute left-[-0.6rem] h-2 w-2 -translate-y-1/2 rotate-45 border-t border-r border-current ${center}`}
        />
      )}
    </span>
  );
}

/**
 * 탄소 경로 카드 — 원문 HTML 의 그림 카드를 이 사이트의 색과 글자로 옮긴 것.
 * 4단계(원료 → 생산 → 제품 → 사용 이후)를 삽화 · 순서 · 제목 · 설명으로 가로에 늘어놓고,
 * 바이오 기반은 04 에서 01 로 돌아가는 점선 고리(새 식물이 다시 흡수), 석유화학은 '≠'(저장고는 다시 채워지지 않음)로 맺는다.
 * md 미만에서는 단계를 세로로 쌓고 그림을 왼쪽에 두며, 고리는 ReturnLane 이 왼쪽 차선에 그린다.
 */
function RouteCard({ route, index }: { route: Route; index: number }) {
  const bio = index === 0;
  const tone = bio ? ROUTE_TONE.bio : ROUTE_TONE.fossil;
  const art = ROUTE_ART[bio ? 0 : 1];

  return (
    <article className={`${CARD} overflow-hidden border-t-4 ${tone.top}`}>
      <header className="flex flex-col gap-3 border-b border-[color:var(--color-washed)] px-5 pt-6 pb-5 sm:px-7 sm:pt-7 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div>
          <p className={`text-[0.72rem] font-semibold tracking-[0.22em] uppercase ${tone.text}`}>{route.eyebrow}</p>
          <h4 className="mt-2 text-xl font-bold tracking-[-0.01em] break-keep text-[var(--color-indigo-deep)] sm:text-2xl">
            {route.title}
          </h4>
        </div>
        <p className="text-base leading-relaxed font-medium break-keep text-[var(--color-ink)] lg:max-w-[20rem] lg:text-right">
          {route.lede}
        </p>
      </header>

      {/* 4단계 그림 흐름 — 그림은 원문 스프라이트를 자른 타일, 알트는 원문의 aria-label 을 옮긴 것 */}
      <ol className="mt-2 px-5 sm:px-7 md:mt-5 md:grid md:grid-cols-4 md:gap-6">
        {route.steps.map((step, i) => {
          const last = i === route.steps.length - 1;
          return (
            <li
              key={step.label}
              className={`relative grid grid-cols-[6.25rem_minmax(0,1fr)] items-center gap-x-4 pt-4 ${
                last ? 'pb-4' : 'pb-9'
              } sm:grid-cols-[8.75rem_minmax(0,1fr)] sm:gap-x-6 md:block md:pt-0 md:pb-2 md:text-center ${tone.text}`}
            >
              <div className="relative aspect-square w-full max-w-[6.25rem] bg-white sm:max-w-[8.75rem] md:mx-auto md:max-w-[9.5rem] xl:max-w-[11rem]">
                <Image
                  src={`/blugene/technology/carbon/${art[i]}.webp`}
                  alt={step.imageAlt}
                  width={512}
                  height={512}
                  sizes="(max-width: 640px) 100px, (max-width: 1280px) 152px, 176px"
                  className="h-auto w-full"
                />
                {/* 01 원료(바이오)의 '공기 중 CO₂ 흡수 ↓' 표찰 — 나무 위에 얹는다 */}
                {i === 0 && route.chip && (
                  <span className="absolute -top-2 left-1/2 w-max -translate-x-1/2 rounded border border-[color:var(--color-washed)] bg-[color-mix(in_srgb,var(--color-washed)_35%,white)] px-1.5 py-0.5 text-[0.6rem] leading-snug tracking-[-0.01em] break-keep text-[var(--color-denim)] shadow-sm sm:top-0 sm:px-2 sm:py-1 sm:text-[0.7rem]">
                    {route.chip}
                    <span aria-hidden="true" className="ml-1 text-[0.85rem] sm:ml-1.5 sm:text-base">
                      ↓
                    </span>
                  </span>
                )}
                {/* 04 사용 이후의 구름 위 'CO₂' — 알트가 이미 설명하므로 장식 */}
                {last && (
                  <span
                    aria-hidden="true"
                    className="absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[1.8rem] leading-none text-[var(--color-denim)] [text-shadow:0_1px_6px_#fff] sm:text-[2.3rem] xl:text-[2.6rem]"
                  >
                    CO₂
                  </span>
                )}
              </div>

              <div className="md:mt-3">
                <p className={SMALL_LABEL}>{step.label}</p>
                <h5 className="mt-1 text-base font-bold break-keep text-[var(--color-indigo-deep)] md:mt-1.5 md:text-[1.0625rem] md:tracking-[-0.01em]">
                  {step.title}
                </h5>
                <p className="mt-1 text-sm leading-[1.8] break-keep text-[var(--color-ink)]/80 md:mt-2 xl:text-[0.9375rem]">
                  {step.text}
                </p>
                {step.note && (
                  <p className="mt-1.5 text-xs leading-relaxed break-keep text-[var(--color-slate-muted)] md:mx-auto md:mt-2 md:max-w-[15rem]">
                    {step.note}
                  </p>
                )}
              </div>

              {!last && <FlowArrow dashed={i === route.steps.length - 2} />}
              {bio && <ReturnLane position={i === 0 ? 'start' : last ? 'end' : 'middle'} />}
            </li>
          );
        })}
      </ol>

      {bio ? (
        /* 04 → 01 로 돌아가는 점선 고리(md 이상). 좌표(12.4% · 87.8%)는 4열 그림의 가로 중앙과 맞는다. md 미만의 고리는 위 ReturnLane. */
        <div className={`mx-5 mt-1 mb-6 sm:mx-7 md:mx-0 md:mt-3 md:px-7 ${tone.text}`}>
          <div className="relative md:pt-[42px]">
            <svg
              aria-hidden="true"
              viewBox="0 0 1000 42"
              preserveAspectRatio="none"
              className="absolute top-0 left-0 hidden h-[42px] w-full md:block"
            >
              <path d="M878 2V25Q878 34 867 34H135Q124 34 124 23V2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 6" />
              <path d="M117 9L124 2L131 9" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <p className="text-[0.9375rem] leading-relaxed break-keep md:flex md:flex-wrap md:items-center md:justify-center md:gap-x-2 md:gap-y-0.5 md:pt-2.5 md:text-center">
              <span aria-hidden="true" className="mr-2 align-middle text-[1.6rem] leading-none md:mr-0">
                ↶
              </span>
              <strong className="font-semibold text-[var(--color-indigo-deep)]">{route.loop}</strong>
              <span className="mt-1 block text-xs leading-relaxed text-[var(--color-slate-muted)] md:mt-0.5 md:basis-full">
                {route.loopSub}
              </span>
            </p>
          </div>
        </div>
      ) : (
        /* 채워지지 않는 저장고 — '≠' 표시 */
        <div className={`mx-5 mt-2 mb-6 flex items-start gap-3 border-t border-dashed border-[color:var(--color-washed)] pt-4 sm:mx-7 sm:gap-4 md:mt-4 md:items-center md:justify-center md:pt-5 ${tone.text}`}>
          <span aria-hidden="true" className="shrink-0 font-serif text-[2.1rem] leading-none text-[var(--color-rule)] sm:text-[2.6rem]">
            ≠
          </span>
          <p className="text-[0.9375rem] leading-relaxed break-keep">
            <strong className="font-semibold text-[var(--color-indigo-deep)]">{route.loop}</strong>
            <span className="mt-1 block text-xs leading-relaxed text-[var(--color-slate-muted)]">{route.loopSub}</span>
          </p>
        </div>
      )}

      {/* 이 경로의 핵심 — 카드 폭 전체를 쓰는 띠 */}
      <div className={`flex flex-col gap-1 border-t border-[color:var(--color-washed)] px-5 py-4 sm:px-7 md:flex-row md:items-baseline md:gap-5 ${tone.wash}`}>
        <span className={`${SMALL_LABEL} whitespace-nowrap`}>{route.coreLabel}</span>
        <p className="text-sm leading-[1.75] break-keep text-[var(--color-ink)]/85">
          <strong className="font-bold text-[var(--color-indigo-deep)]">{route.core}</strong> {route.coreSub}
        </p>
      </div>
    </article>
  );
}

export default async function CarbonJourney() {
  const t = await getTranslations('Technology');
  const c = t.raw('carbon') as CarbonCopy;

  return (
    <section id="carbon" className="w-full bg-[var(--color-ivory)]">
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <SectionHeading title={t('carbonTitle')} body={c.lead} size="lg" titleWidth="wide" />

        {/* 01 · 탄소의 여정 */}
        <div className="mt-16">
          <PartHeading eyebrow={c.journey.eyebrow} title={c.journey.title} body={c.journey.body} />
          <p className="mt-4 text-sm leading-relaxed break-keep text-[var(--color-slate-muted)]">
            {c.journey.guide}{' '}
            <span className="font-semibold whitespace-nowrap text-[var(--color-denim)]">{c.journey.order}</span>
          </p>

          <div className="mt-8 flex flex-col gap-6">
            {c.routes.map((route, index) => (
              <RouteCard key={route.title} route={route} index={index} />
            ))}
          </div>

          {/* 읽는 법 — 실선 · 점선 · 그림은 예시 */}
          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs leading-relaxed break-keep text-[var(--color-slate-muted)]">
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="inline-block w-6 border-t border-current" />
              {c.journey.legendSolid}
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="inline-block w-6 border-t border-dashed border-current" />
              {c.journey.legendDashed}
            </li>
            <li className="md:ml-auto">{c.journey.legendNote}</li>
          </ul>

          <SourceNote className="mt-3">
            {c.footnote}{' '}
            <a
              href="#carbon-sources"
              className="whitespace-nowrap underline underline-offset-[3px] hover:text-[var(--color-indigo-deep)]"
            >
              {c.journey.evidenceLink}
              <span aria-hidden="true"> ↓</span>
            </a>
          </SourceNote>
        </div>

        {/* 02 · 출처가 중요한 이유 */}
        <div className="mt-20">
          <PartHeading eyebrow={c.origin.eyebrow} title={c.origin.title} body={c.origin.body} />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:gap-8">
            {c.origin.items.map((item, index) => {
              const bio = index === 1;
              return (
                <div
                  key={item.title}
                  className={`${CARD} border-t-4 p-6 sm:p-7 ${
                    bio ? 'border-t-[var(--color-denim)]' : 'border-t-[var(--color-slate-muted)]'
                  }`}
                >
                  <p className={bio ? EYEBROW : `${EYEBROW} text-[var(--color-slate-muted)]`}>{item.label}</p>
                  <h4 className="mt-3 text-xl font-bold tracking-[-0.01em] break-keep text-[var(--color-indigo-deep)]">
                    {item.title}
                  </h4>
                  <p className="mt-3 text-sm leading-[1.85] break-keep text-[var(--color-ink)]/80 sm:text-base">
                    {item.text}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <li key={tag} className={TAG}>
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <p className="mt-8 max-w-3xl border-l-2 border-[var(--color-denim)] pl-5 text-lg leading-relaxed font-semibold break-keep text-[var(--color-indigo-deep)] sm:text-xl">
            {c.origin.closing}
          </p>
        </div>

        {/* 03 · 분명한 근거 */}
        <div className="mt-20">
          <PartHeading eyebrow={c.evidence.eyebrow} title={c.evidence.title} body={c.evidence.body} />
          <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:gap-8">
            {c.evidence.items.map((item, index) => (
              <li key={item.title} className={`${CARD} p-6 sm:p-7`}>
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="rounded bg-[var(--color-ivory)] px-1.5 py-0.5 text-[0.72rem] font-semibold tracking-[0.18em] text-[var(--color-slate-muted)]"
                  >
                    {`0${index + 1}`}
                  </span>
                  <p className={SMALL_LABEL}>{item.label}</p>
                </div>
                <h4 className="mt-4 text-xl font-bold tracking-[-0.01em] break-keep text-[var(--color-indigo-deep)]">
                  {item.title}
                </h4>
                <p className="mt-3 text-sm leading-[1.85] break-keep text-[var(--color-ink)]/80 sm:text-base">
                  {item.text}
                </p>
                <span className={`${TAG} mt-5`}>{item.tag}</span>
              </li>
            ))}
          </ol>
          <div className={`${CARD} mt-8 border-l-4 border-l-[var(--color-denim)] p-6 sm:p-7`}>
            <p className="text-lg font-bold break-keep text-[var(--color-indigo-deep)]">{c.evidence.calloutTitle}</p>
            <p className="mt-3 max-w-3xl text-sm leading-[1.85] break-keep text-[var(--color-ink)]/85 sm:text-base">
              {t.rich('carbon.evidence.calloutBody', {
                link: (chunks) => (
                  <Link
                    href="/data-certifications"
                    className="font-semibold text-[var(--color-denim)] underline underline-offset-4 hover:text-[var(--color-indigo-deep)]"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <PartHeading eyebrow={c.faq.eyebrow} title={c.faq.title} />
          <div className="mt-8 max-w-3xl divide-y divide-[color:var(--color-washed)] border-y border-[color:var(--color-washed)]">
            {c.faq.items.map((item) => (
              <details key={item.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base font-semibold break-keep text-[var(--color-indigo-deep)] sm:text-lg [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>
                  <Toggle />
                </summary>
                <div className="mt-3 space-y-3">
                  {item.answers.map((answer) => (
                    <p key={answer} className="text-sm leading-[1.85] break-keep text-[var(--color-ink)]/85 sm:text-base">
                      {answer}
                    </p>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* 맺음 + 근거 자료 — 브랜드 선언 구역과 같은 짙은 남색 면 */}
        <div className="on-indigo mt-16 rounded-lg bg-[var(--color-indigo-deep)] px-6 py-10 text-white sm:px-10 sm:py-12">
          <p className="blugene-tagline text-[0.68rem] text-white/55 sm:text-[0.75rem]">{c.closing.eyebrow}</p>
          <p className={`mt-4 max-w-3xl ${HEADING_SIZE.md} leading-[1.25] font-bold tracking-[-0.02em] text-pretty break-keep`}>
            {keepLastWords(c.closing.text)}
          </p>

          <details id="carbon-sources" className="group mt-8 scroll-mt-24 border-t border-white/20 pt-6">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-semibold text-white/85 [&::-webkit-details-marker]:hidden sm:text-base">
              <span>{c.sources.summary}</span>
              <Toggle tone="inverse" />
            </summary>
            <div className="mt-5 max-w-3xl text-sm leading-[1.85] break-keep text-white/80">
              <p>
                <strong className="font-semibold text-white">{c.sources.introStrong}</strong>
                <span aria-hidden="true"> — </span>
                {c.sources.introText}
              </p>
              <ol className="mt-4 list-decimal space-y-3 pl-5">
                {c.sources.items.map((item, index) => (
                  <li key={item.title}>
                    <a
                      href={SOURCE_URLS[index]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-white underline underline-offset-4 hover:text-white/80"
                    >
                      {item.title}
                      <span aria-hidden="true"> ↗</span>
                      <span className="sr-only"> ({c.sources.externalLinkHint})</span>
                    </a>
                    <span className="block text-white/70">{item.note}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4">
                <strong className="font-semibold text-white">{c.sources.processStrong}</strong>
                <span aria-hidden="true"> — </span>
                {c.sources.processText}
              </p>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
