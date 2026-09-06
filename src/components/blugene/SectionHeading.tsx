import type { ReactNode } from 'react';

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
  size = 'md',
  children,
  className = '',
  headingLevel = 'h2',
}: {
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  tone?: 'ink' | 'inverse';
  align?: 'left' | 'center';
  size?: 'md' | 'lg';
  children?: ReactNode;
  className?: string;
  headingLevel?: 'h1' | 'h2' | 'h3';
}) {
  const H = headingLevel;
  const inverse = tone === 'inverse';

  const titleSize =
    size === 'lg'
      ? 'text-[2.1rem] sm:text-5xl lg:text-[3.4rem]'
      : 'text-[1.75rem] sm:text-4xl lg:text-[2.75rem]';

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
