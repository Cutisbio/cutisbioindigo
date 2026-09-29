import { getTranslations } from 'next-intl/server';
import SourceNote, { AssetKind } from '@/components/blugene/SourceNote';
import { anilineTest } from '@/data/blugene/evidence';

/**
 * 아닐린 · N-메틸아닐린이 피부에 미치는 영향 — 문헌 기반 인포그래픽 (2026-09-29 고객 요청).
 *
 * 데이터 · 인증 페이지의 「아닐린 · N-메틸아닐린 분석」 표 바로 위에 둔다. 근거가 카탈로그가 아니라 외부 문헌이므로
 * 단락마다 출처를 붙이고, 수치는 문헌에 실린 값을 그대로 옮긴다(docs/blugene-claims.md A-2 표).
 *
 *  - 무엇이 어디에 남는가: Cordin 외 2021 (Sci Rep) — 합성 인디고의 아닐린 ≤0.6% · N-메틸아닐린 ≤0.4%, 결정 내부에 갇힘
 *  - 옷 → 땀: Herrero 외 2019 (Environ Res) — 청바지 42벌의 인디고 염료가 인공 땀으로 이동(염료만 측정)
 *  - 피부 흡수: Baranowska-Dutkiewicz 1982 (사람) · Wellner 외 2008 (떼어낸 사람 피부) · Korinth 외 2007 (작업자)
 *  - 메트헤모글로빈혈증: ATSDR 지침 · Lee 외 2013 (한국 사례, 46.8%) · Bernasconi 외 2026 (NEJM, N-메틸아닐린 피부 흡수 82명)
 *  - 분류: EU CLP 조화 분류(부속서 VI) · IARC 제127권 (아닐린 Group 2A, 2020 회의)
 *
 * 하지 않는 것: "안전하다"는 단정, 데님 착용 시 노출량 추정, 인증 허용한도 수치(카탈로그 p.4 표는 계속 미게재).
 * 아이콘은 코드로 그린 SVG 이고 장식(aria-hidden)이다. 글자는 모두 HTML 이라 7개 언어로 번역된다.
 * 문헌 링크 주소는 여기 HAZARD_SOURCE_LINKS 에, 문구는 messages 의 AnilineHazard.sources.items 에 같은 키로 둔다.
 * 규제기관 분류(EU CLP · IARC)는 2026-09-29 고객 요청으로 별도 상자 AnilineClassification 으로 뺐다 — 링크 표를 같이 쓴다.
 */

export const HAZARD_SOURCE_LINKS = {
  cordin2021: 'https://doi.org/10.1038/s41598-021-00634-7',
  herrero2019: 'https://doi.org/10.1016/j.envres.2019.02.030',
  baranowska1982: 'https://doi.org/10.1016/0378-4274(82)90231-4',
  wellner2008: 'https://doi.org/10.1016/j.fct.2008.01.036',
  korinth2007: 'https://doi.org/10.1136/oem.2006.027755',
  lee2013: 'https://doi.org/10.1186/2052-4374-25-31',
  bernasconi2026: 'https://doi.org/10.1056/NEJMoa2606487',
  atsdr: 'https://wwwn.cdc.gov/TSP/MMG/MMGDetails.aspx?mmgid=448&toxid=79',
  iarc2021: 'https://publications.iarc.who.int/599',
  clpAniline: 'https://pubchem.ncbi.nlm.nih.gov/compound/Aniline#section=GHS-Classification',
  clpNMethylaniline: 'https://pubchem.ncbi.nlm.nih.gov/compound/N-Methylaniline#section=GHS-Classification',
} as const;
type SourceId = keyof typeof HAZARD_SOURCE_LINKS;
const SOURCE_IDS = Object.keys(HAZARD_SOURCE_LINKS) as SourceId[];

/** 핵심 논문의 DOI — 고유 표기이므로 번역하지 않는다. */
const PAPER_DOI = '10.1038/s41598-021-00634-7';

type Step = { title: string; body: string; source: string };
type CaseItem = { value: string; label: string; body: string; source: string };
type Threshold = { range: string; label: string };
type PaperCopy = {
  kicker: string;
  journal: string;
  openAccess: string;
  title: string;
  titleTranslated: string;
  authors: string;
  affiliation: string;
  published: string;
  summaryTitle: string;
  summary: string[];
  readLink: string;
  externalHint: string;
};

/** 메트헤모글로빈 비율 4단계의 막대 색 — 낮은 단계부터 짙어진다. */
const THRESHOLD_BAR = [
  'bg-[var(--color-washed)]',
  'bg-[var(--color-denim)]/55',
  'bg-[var(--color-denim)]',
  'bg-[var(--color-indigo-deep)]',
] as const;

const ICON_PROPS = {
  'aria-hidden': true,
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: 'h-10 w-10 shrink-0 text-[var(--color-indigo-deep)]',
};

/** 다섯 단계의 장식 아이콘 — 결정 속 불순물 → 옷감과 땀방울 → 피부층 통과 → 산소를 못 나르는 적혈구 → 유해성 표지 */
function StepIcon({ index }: { index: number }) {
  switch (index) {
    case 0:
      return (
        <svg {...ICON_PROPS}>
          <polygon points="24,5 40,14 40,34 24,43 8,34 8,14" />
          <circle cx="19" cy="20" r="2.4" fill="currentColor" stroke="none" />
          <circle cx="29" cy="26" r="2.4" fill="currentColor" stroke="none" />
          <circle cx="22" cy="31" r="2.4" fill="currentColor" stroke="none" />
        </svg>
      );
    case 1:
      return (
        <svg {...ICON_PROPS}>
          <path d="M7 11c3.5-3.5 7-3.5 10.5 0s7 3.5 10.5 0 7-3.5 10.5 0" />
          <path d="M7 19c3.5-3.5 7-3.5 10.5 0s7 3.5 10.5 0 7-3.5 10.5 0" />
          <path d="M24 26c-4.5 5.5-6.5 8.5-6.5 11.5a6.5 6.5 0 0 0 13 0c0-3-2-6-6.5-11.5z" />
        </svg>
      );
    case 2:
      return (
        <svg {...ICON_PROPS}>
          <rect x="6" y="22" width="36" height="7" rx="3.5" />
          <rect x="6" y="34" width="36" height="7" rx="3.5" />
          <path d="M24 5v27" />
          <path d="M18 26l6 6 6-6" />
        </svg>
      );
    case 3:
      return (
        <svg {...ICON_PROPS}>
          <circle cx="24" cy="24" r="16" />
          <circle cx="24" cy="24" r="6.5" />
          <path d="M11 11l26 26" />
        </svg>
      );
    default:
      return (
        <svg {...ICON_PROPS}>
          <path d="M24 5l19 19-19 19L5 24z" />
          <path d="M24 16v10" />
          <circle cx="24" cy="31.5" r="1.6" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}

function ExternalLink({
  href,
  hint,
  className = '',
  children,
}: {
  href: string;
  hint: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span className="sr-only"> ({hint})</span>
    </a>
  );
}

export default async function AnilineHazardInfographic() {
  const t = await getTranslations('AnilineHazard');
  const steps = t.raw('steps.items') as Step[];
  const cases = t.raw('cases.items') as CaseItem[];
  const thresholds = t.raw('thresholds.items') as Threshold[];
  const paper = t.raw('paper') as PaperCopy;
  const sourceLabels = t.raw('sources.items') as Record<SourceId, string>;

  // 검출한계는 데이터 모듈의 값을 그대로 쓴다 (번역 대상이 아니다).
  const limit = `${anilineTest.detectionLimitMgKg} ${anilineTest.aniline.unit}`;

  return (
    <figure
      aria-labelledby="aniline-hazard-title"
      className="mt-10 rounded-md border border-[color:var(--color-washed)] bg-[var(--color-ivory)] p-5 sm:p-8 lg:p-10"
    >
      <div className="max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.18em] text-[var(--color-denim)] uppercase">{t('eyebrow')}</p>
        <h3
          id="aniline-hazard-title"
          className="mt-2 text-xl font-bold tracking-[-0.01em] break-keep text-[var(--color-indigo-deep)] sm:text-2xl"
        >
          {t('title')}
        </h3>
        <p className="mt-3 text-base leading-[1.85] break-keep text-[var(--color-ink)]/85">{t('intro')}</p>
      </div>

      {/* 1. 노출에서 영향까지 — 다섯 단계 */}
      <ol aria-label={t('steps.ariaLabel')} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((step, index) => (
          <li key={step.title} className="rounded-md bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <StepIcon index={index} />
              <span className="font-mono text-sm font-semibold text-[var(--color-denim)]">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
            <h4 className="mt-4 text-[0.95rem] leading-snug font-bold break-keep text-[var(--color-indigo-deep)]">
              {step.title}
            </h4>
            <p className="mt-2 text-[0.8125rem] leading-[1.75] break-keep text-[var(--color-ink)]/85">{step.body}</p>
            <p className="mt-3 text-[0.7rem] leading-snug break-keep text-[var(--color-slate-muted)]">{step.source}</p>
          </li>
        ))}
      </ol>

      {/* 2. 사람 사례 · 증상 단계 — 규제기관 분류는 2026-09-29 고객 요청으로 별도 상자(AnilineClassification)로 뺐다 */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <h4 className="sr-only">{t('cases.title')}</h4>
        {cases.map((item) => (
          <div key={item.value} className="rounded-md bg-white p-5">
            <p className="text-3xl font-bold tracking-[-0.02em] text-[var(--color-indigo-deep)]">{item.value}</p>
            <p className="mt-1 text-sm font-semibold break-keep text-[var(--color-denim)]">{item.label}</p>
            <p className="mt-3 text-[0.8125rem] leading-[1.75] break-keep text-[var(--color-ink)]/85">{item.body}</p>
            <p className="mt-3 text-[0.7rem] leading-snug break-keep text-[var(--color-slate-muted)]">{item.source}</p>
          </div>
          ))}

          <div className="rounded-md bg-white p-5 sm:col-span-2">
            <h4 className="text-[0.95rem] font-bold break-keep text-[var(--color-indigo-deep)]">{t('thresholds.title')}</h4>
            <ol className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {thresholds.map((band, index) => (
                <li key={band.range}>
                  <span className={`block h-1.5 rounded-full ${THRESHOLD_BAR[index] ?? THRESHOLD_BAR[3]}`} />
                  <span className="mt-2 block font-mono text-sm font-semibold text-[var(--color-indigo-deep)]">
                    {band.range}
                  </span>
                  <span className="mt-1 block text-[0.75rem] leading-snug break-keep text-[var(--color-ink)]/80">
                    {band.label}
                  </span>
                </li>
              ))}
            </ol>
            <SourceNote className="mt-4">{t('thresholds.source')}</SourceNote>
          </div>
      </div>

      {/* 3. 핵심 논문 — 표지 요약 카드와 내용 요약 */}
      <article className="mt-4 grid gap-6 rounded-md border-l-[3px] border-[color:var(--color-indigo-deep)] bg-white p-5 sm:p-7 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-10">
        <div>
          <AssetKind>{paper.kicker}</AssetKind>
          <p className="mt-4 flex flex-wrap items-center gap-2 text-sm font-semibold text-[var(--color-denim)]">
            <span>{paper.journal}</span>
            <span className="rounded-full border border-[color:var(--color-washed)] px-2 py-0.5 text-[0.7rem] font-medium text-[var(--color-slate-muted)]">
              {paper.openAccess}
            </span>
          </p>
          <p className="mt-3 font-serif text-lg leading-snug text-[var(--color-ink)]" lang="en">
            {paper.title}
          </p>
          {paper.titleTranslated !== paper.title && (
            <p className="mt-1 text-sm break-keep text-[var(--color-slate-muted)]">{paper.titleTranslated}</p>
          )}
          <p className="mt-3 text-sm text-[var(--color-ink)]/85">{paper.authors}</p>
          <p className="mt-1 text-[0.8125rem] break-keep text-[var(--color-slate-muted)]">{paper.affiliation}</p>
          <p className="mt-1 text-[0.8125rem] text-[var(--color-slate-muted)]">{paper.published}</p>
          <p className="mt-1 font-mono text-[0.72rem] text-[var(--color-slate-muted)]">doi:{PAPER_DOI}</p>
          <ExternalLink
            href={HAZARD_SOURCE_LINKS.cordin2021}
            hint={paper.externalHint}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-denim)] underline underline-offset-4 hover:text-[var(--color-indigo-deep)]"
          >
            {paper.readLink}
            <span aria-hidden="true">↗</span>
          </ExternalLink>
        </div>
        <div>
          <h4 className="text-[0.95rem] font-bold break-keep text-[var(--color-indigo-deep)]">{paper.summaryTitle}</h4>
          <ol className="mt-3 list-decimal space-y-2.5 pl-5 text-[0.875rem] leading-[1.75] break-keep text-[var(--color-ink)]/85">
            {paper.summary.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        </div>
      </article>

      {/* 4. Blugene 결과 — 아래 표로 이어지는 다리. 불검출을 안전 주장으로 넓히지 않는다. */}
      <div className="mt-4 rounded-md bg-[var(--color-indigo-deep)] px-5 py-5 text-white sm:px-7">
        <p className="text-xs font-semibold tracking-[0.18em] text-white/70 uppercase">{t('result.label')}</p>
        <p className="mt-2 text-base leading-relaxed font-semibold break-keep">{t('result.body', { limit })}</p>
        <SourceNote tone="inverse" className="mt-2">
          {t('result.note')}
        </SourceNote>
      </div>

      {/* 5. 근거 자료와 범위 */}
      <figcaption className="mt-6 border-t border-[color:var(--color-washed)] pt-5">
        <p className="text-sm font-semibold text-[var(--color-indigo-deep)]">{t('sources.title')}</p>
        <SourceNote as="ul" className="mt-2 space-y-1.5">
          {SOURCE_IDS.map((id) => (
            <li key={id}>
              <ExternalLink
                href={HAZARD_SOURCE_LINKS[id]}
                hint={paper.externalHint}
                className="underline underline-offset-2 hover:text-[var(--color-indigo-deep)]"
              >
                {sourceLabels[id]}
              </ExternalLink>
            </li>
          ))}
        </SourceNote>
        <SourceNote className="mt-4 max-w-4xl">{t('scopeNote')}</SourceNote>
      </figcaption>
    </figure>
  );
}
