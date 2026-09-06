import { Link } from '@/i18n/routing';
import { BRAND } from '@/data/blugene/site';

/**
 * Blugene 워드마크 + `by CutisBio` 락업.
 *
 * 표기 규칙: 첫 글자 B 만 대문자. BluGene / Bluegene 등 변형과 ® 표기를 쓰지 않는다.
 * 서체는 `.blugene-wordmark` (globals.css) 한 곳에서 관리한다 — 세리프로 바꾸려면 그 규칙만 수정한다.
 */
export default function Wordmark({
  size = 'md',
  tone = 'ink',
  href = '/',
  label,
}: {
  size?: 'sm' | 'md' | 'lg';
  tone?: 'ink' | 'inverse';
  href?: string | null;
  label?: string;
}) {
  const scale = {
    sm: { name: 'text-lg sm:text-xl', sub: 'text-[0.5rem] sm:text-[0.55rem]' },
    md: { name: 'text-2xl sm:text-[1.75rem]', sub: 'text-[0.6rem] sm:text-[0.65rem]' },
    lg: { name: 'text-3xl sm:text-4xl', sub: 'text-xs' },
  }[size];

  const color = tone === 'inverse' ? 'text-white' : 'text-[var(--color-indigo-deep)]';
  const subColor = tone === 'inverse' ? 'text-white/70' : 'text-[var(--color-slate-muted)]';

  const inner = (
    <span className="inline-flex flex-col items-start leading-none">
      <span className={`blugene-wordmark ${scale.name} ${color}`}>{BRAND.name}</span>
      <span className={`${scale.sub} ${subColor} mt-1 tracking-[0.22em] uppercase font-medium`}>
        by {BRAND.company}
      </span>
    </span>
  );

  if (!href) return inner;

  return (
    <Link href={href} aria-label={label ?? BRAND.lockup} className="inline-block">
      {inner}
    </Link>
  );
}
