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
 * 섹션 제목 묶음 (eyebrow / 제목 / 본문).
 * 모든 섹션을 같은 카드 격자로 만들지 않기 위해, 정렬과 폭만 제어하고 배경은 각 섹션이 정한다.
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
}) {
  const H = headingLevel;
  const inverse = tone === 'inverse';

  const titleSize = HEADING_SIZE[size];

  return (
    <div className={`${align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'} ${className}`}>
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
        className={`${titleSize} leading-[1.18] font-bold tracking-[-0.02em] break-keep ${
          inverse ? 'text-white' : 'text-[var(--color-indigo-deep)]'
        }`}
      >
        {title}
      </H>
      {body && (
        <p
          className={`mt-6 text-base leading-[1.85] break-keep sm:text-lg ${
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
