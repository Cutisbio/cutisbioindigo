import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { BRAND } from '@/data/blugene/site';

/**
 * Blugene 워드마크 + `by CutisBio` 락업.
 *
 * `by` 뒤의 CutisBio 는 **실제 회사 로고(SVG)** 를 쓴다.
 * - 밝은 배경: `/brand/cutisbio-logo.svg` (원본 색 그대로)
 * - 어두운 배경: `/brand/cutisbio-logo-white.svg` (단색 흰색 판본)
 * 두 파일 모두 원본 `logo_cutis_2.svg` 에서 viewBox 만 실제 그림 영역에 맞춰 잘라낸 것이며
 * 형태는 손대지 않았다. 자세한 내용은 docs/blugene-visual-assets.md 참조.
 *
 * `Blugene` 표기 규칙: 첫 글자 B 만 대문자. BluGene / Bluegene 등 변형과 ® 표기를 쓰지 않는다.
 * 서체는 `.blugene-wordmark` (globals.css) 한 곳에서 관리한다 — 세리프로 바꾸려면 그 규칙만 수정한다.
 */

/** 로고 원본 가로세로비 296.05 : 62.35 ≈ 4.7482 : 1 */
// 로고 안에서 글자는 방패보다 낮아(약 69%) 보이므로, 글자 높이가 읽히도록 조금 넉넉히 잡는다.
const SCALE = {
  sm: { name: 'text-lg sm:text-xl', by: 'text-[0.6rem]', logoW: 62, logoH: 13, gap: 'gap-1.5' },
  md: { name: 'text-2xl sm:text-[1.75rem]', by: 'text-[0.72rem]', logoW: 85, logoH: 18, gap: 'gap-2' },
  lg: { name: 'text-3xl sm:text-4xl', by: 'text-[0.85rem]', logoW: 114, logoH: 24, gap: 'gap-2.5' },
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
  const scale = SCALE[size];
  const inverse = tone === 'inverse';

  const nameColor = inverse ? 'text-white' : 'text-[var(--color-indigo-deep)]';
  const byColor = inverse ? 'text-white/70' : 'text-[var(--color-slate-muted)]';

  const inner = (
    <span className="inline-flex flex-col items-start leading-none">
      <span className={`blugene-wordmark ${scale.name} ${nameColor}`}>{BRAND.name}</span>
      <span className={`mt-1.5 inline-flex items-center ${scale.gap}`}>
        <span className={`${scale.by} ${byColor} lowercase`}>by</span>
        <Image
          src={inverse ? '/brand/cutisbio-logo-white.svg' : '/brand/cutisbio-logo.svg'}
          alt={BRAND.company}
          width={scale.logoW}
          height={scale.logoH}
          // SVG 는 Next 이미지 최적화를 거치지 않고 원본 그대로 내보낸다
          unoptimized
          className="h-auto w-auto"
          style={{ width: scale.logoW, height: scale.logoH }}
        />
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
