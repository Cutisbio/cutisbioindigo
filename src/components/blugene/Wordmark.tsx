import { Link } from '@/i18n/routing';
import { BRAND } from '@/data/blugene/site';

/**
 * Blugene 워드마크.
 *
 * 예전에는 `Blugene` 아래에 `by` + CutisBio 회사 로고(SVG)를 얹은 두 줄 락업이었다.
 * 지금은 브랜드 이름만 쓴다 — 회사와의 관계는 로고가 아니라 글로 밝힌다:
 * 푸터의 `CutisBio Co., Ltd. (큐티스바이오)` 줄, /brand 의 '큐티스바이오와의 관계' 절,
 * /about 페이지 상단의 회사 로고가 그 역할을 한다.
 *
 * 한 줄이 되면서 세로로 차지하던 높이가 절반이 됐으므로, 헤더에서 존재감이 줄지 않도록
 * 글자 크기를 한 단계씩 키웠다. 헤더 높이(`--header-h`)는 그대로 둔다.
 *
 * `Blugene` 표기 규칙: 첫 글자 B 만 대문자. BluGene / Bluegene 등 변형과 ® 표기를 쓰지 않는다.
 * 서체는 `.blugene-wordmark` (globals.css) 한 곳에서 관리한다 — 세리프로 바꾸려면 그 규칙만 수정한다.
 */
const SCALE = {
  sm: 'text-xl sm:text-2xl',
  md: 'text-[1.75rem] sm:text-[2rem]',
  lg: 'text-4xl sm:text-5xl',
} as const;

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
  const color = tone === 'inverse' ? 'text-white' : 'text-[var(--color-indigo-deep)]';

  const inner = (
    <span className={`blugene-wordmark inline-block leading-none ${SCALE[size]} ${color}`}>
      {BRAND.name}
    </span>
  );

  if (!href) return inner;

  // 링크의 접근성 이름은 화면에 보이는 글자와 어긋나면 안 된다(WCAG 2.5.3).
  // 이름만 보이므로 label 도 `Blugene` 기준이다.
  return (
    <Link href={href} aria-label={label ?? BRAND.name} className="inline-block">
      {inner}
    </Link>
  );
}
