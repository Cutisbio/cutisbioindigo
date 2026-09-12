import { Link } from '@/i18n/routing';
import BlugeneMark from '@/components/blugene/BlugeneMark';
import { BRAND } from '@/data/blugene/site';

/**
 * Blugene 워드마크 — 마크(열두 갈래 문양) + `Blugene` 글자.
 *
 * 예전에는 `Blugene` 아래에 `by` + CutisBio 회사 로고(SVG)를 얹은 두 줄 락업이었다.
 * 지금은 브랜드 이름만 쓴다 — 회사와의 관계는 로고가 아니라 글로 밝힌다:
 * 푸터의 `CutisBio Co., Ltd. (큐티스바이오)` 줄, /brand 의 '큐티스바이오와의 관계' 절,
 * /about 페이지 상단의 회사 로고가 그 역할을 한다.
 *
 * 2026-09-11 고객 요청으로 B 앞에 마크를 붙였다(BlugeneMark.tsx). 마크는 em 단위라 글자
 * 크기를 따라 같이 커진다. 밝은 바탕에서는 `.blugene-mark`(globals.css)가 마크 색을 1초마다
 * 파랑 일곱 가지로 순환시킨다. 어두운 바탕(tone="inverse")에서는 순환 색 가운데 네이비 ·
 * 미드나잇이 남색 바탕에 묻히므로 글자와 같은 흰색으로 고정한다.
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
    <span className={`blugene-wordmark inline-flex items-center gap-[0.16em] leading-none ${SCALE[size]} ${color}`}>
      {/* 마크 크기는 글자 em 기준. 고객 시트의 락업 비율(마크 높이 ≈ 대문자 높이의 두 배, 글자와의 간격 ≈ 대문자 높이의 1/5)을 따른다 */}
      <BlugeneMark className={`h-[1.35em] w-[1.35em] shrink-0 ${tone === 'inverse' ? '' : 'blugene-mark'}`} />
      <span>{BRAND.name}</span>
    </span>
  );

  if (!href) return inner;

  // 링크의 접근성 이름은 화면에 보이는 글자와 어긋나면 안 된다(WCAG 2.5.3).
  // 마크는 aria-hidden 장식이고 이름만 보이므로 label 도 `Blugene` 기준이다.
  return (
    <Link href={href} aria-label={label ?? BRAND.name} className="inline-block">
      {inner}
    </Link>
  );
}
