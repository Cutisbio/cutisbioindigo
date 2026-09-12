import type { ReactNode } from 'react';

/**
 * 제목 크기 3단.
 *
 * 예전에는 3.5 / 3.4 / 3.25rem 처럼 눈으로 구분되지 않는 단이 나란히 있었고, 반대로
 * 2.75rem 과 1.875rem 사이는 비어 있어서 같은 위계의 섹션 제목이 한 화면에서 30px 과 44px 로 갈렸다.
 * 눈에 실제로 보이는 세 단만 남긴다.
 *
 *   hero — 페이지/섹션 최상위 제목 (히어로 h1 4rem 바로 아래 단)
 *   lg   — 일반 섹션 제목
 *   md   — 표·목록 섹션 제목. 그 아래 카드 제목(1.125rem)과 붙어 보이지 않도록 44→30px 사이를 메운다.
 *
 * SectionHeading 을 쓰지 않는 제목(BrandManifesto·FinalCta·EvidenceTables·ShadeLibrary)도
 * 리터럴을 다시 적지 않고 이 표를 가져다 쓴다. 한쪽만 고쳐 다시 갈라지는 것을 막기 위해서다.
 */
export const HEADING_SIZE = {
  hero: 'text-[2.1rem] sm:text-5xl lg:text-[3.4rem]',
  lg: 'text-[1.75rem] sm:text-4xl lg:text-[2.75rem]',
  md: 'text-[1.5rem] sm:text-[1.875rem] lg:text-[2.125rem]',
} as const;

export type HeadingSize = keyof typeof HEADING_SIZE;

/**
 * 제목의 마지막 두 단어를 태블릿(md) 이상에서 한 덩어리로 묶는다 — 한 단어만 마지막 줄에 남는 것을 막는다.
 * 문자열 제목에만 적용한다. 이미 ReactNode 로 조립된 제목(브랜드 페이지의 <keep>)은 그대로 두므로,
 * 제목을 span 으로 감싸 넘기는 쪽(ImpurityEvidence)과 뉴스 목록의 기사 제목은 안에서 직접 부른다.
 * 띄어쓰기가 없는 중국어 · 일본어 제목은 바뀌지 않는다. 모바일에서는 묶지 않는다 — 두 단어가 폭을 넘칠 수 있다.
 */
export function keepLastWords(title: ReactNode): ReactNode {
  if (typeof title !== 'string') return title;
  const words = title.trim().split(/\s+/);
  if (words.length < 3) return title;
  return (
    <>
      {words.slice(0, -2).join(' ')} <span className="md:whitespace-nowrap">{words.slice(-2).join(' ')}</span>
    </>
  );
}

/**
 * 섹션 제목 묶음 (eyebrow / 제목 / 본문).
 * 모든 섹션을 같은 카드 격자로 만들지 않기 위해, 정렬과 폭만 제어하고 배경은 각 섹션이 정한다.
 *
 * 줄바꿈 — 마지막 줄에 '기준입니다.' · '파랑을.' 처럼 한 단어만 홀로 남지 않도록(2026-09-11 홈에서 두 곳)
 * keepLastWords 가 제목의 마지막 두 단어를 태블릿 이상에서 한 덩어리로 묶는다. text-pretty 도 함께 주지만
 * 크롬이 한 단어 고아를 매번 막아 주지는 않아서(같은 홈에서 셋 중 하나만 고쳤다) 묶기가 기준이다.
 * balance 는 줄 길이를 고르게 맞추느라 '네 가지 | 길,' 처럼 구절 가운데를 끊어서 쓰지 않는다.
 * HEADING_SIZE 를 직접 쓰는 제목(BrandManifesto · FinalCta · EvidenceTables · ShadeLibrary)도 같은 두 가지를 쓴다.
 *
 * 폭 — 왼쪽 정렬일 때 제목 · 본문 상자는 2xl(42rem)이다. titleWidth="wide" 면 제목 상자만 52rem 으로
 * 넓히고 본문은 2xl 에 둔다(문단의 한 줄 글자 수는 그대로). 브랜드 페이지 제목처럼 긴 뒷구절을
 * 한 줄에 두어야 할 때 쓴다 — 그 구절은 messages 의 <keep>…</keep> 태그로 묶어 t.rich 로 그린다.
 */
export default function SectionHeading({
  eyebrow,
  title,
  body,
  tone = 'ink',
  align = 'left',
  // 기본값이 lg 인 이유: size 를 생략한 호출부(CatalogueViewer·CertificationLibrary·FastnessTables·
  // ProductFormats·SampleInquiry)가 예전 기본값 2.75rem 을 그대로 유지해야 한다. md 로 두면 그 다섯 곳이
  // 방문하지 않은 채 2.125rem 으로 줄어든다.
  size = 'lg',
  children,
  className = '',
  headingLevel = 'h2',
  titleWidth = 'default',
}: {
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  tone?: 'ink' | 'inverse';
  align?: 'left' | 'center';
  size?: HeadingSize;
  children?: ReactNode;
  className?: string;
  headingLevel?: 'h1' | 'h2' | 'h3';
  /** wide — 제목 상자를 52rem 으로 넓힌다(본문은 2xl 유지). 긴 제목의 뒷구절을 한 줄에 두어야 할 때 */
  titleWidth?: 'default' | 'wide';
}) {
  const H = headingLevel;
  const inverse = tone === 'inverse';

  const titleSize = HEADING_SIZE[size];
  const wide = align !== 'center' && titleWidth === 'wide';
  const bodyWidth = wide ? 'max-w-2xl' : '';

  return (
    <div className={`${align === 'center' ? 'mx-auto max-w-3xl text-center' : wide ? 'max-w-[52rem]' : 'max-w-2xl'} ${className}`}>
      {eyebrow && (
        <p
          className={`mb-4 text-[0.72rem] font-semibold tracking-[0.22em] uppercase ${
            inverse ? 'text-white/60' : 'text-[var(--color-denim)]'
          }`}
        >
          {eyebrow}
        </p>
      )}
      <H
        className={`${titleSize} leading-[1.18] font-bold tracking-[-0.02em] text-pretty break-keep ${
          inverse ? 'text-white' : 'text-[var(--color-indigo-deep)]'
        }`}
      >
        {keepLastWords(title)}
      </H>
      {body && (
        <p
          className={`mt-6 text-base leading-[1.85] break-keep sm:text-lg ${bodyWidth} ${
            inverse ? 'text-white/80' : 'text-[var(--color-ink)]/85'
          }`}
        >
          {body}
        </p>
      )}
      {children}
    </div>
  );
}
