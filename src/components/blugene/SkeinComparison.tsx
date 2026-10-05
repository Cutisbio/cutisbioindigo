import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { SKEIN_COMPARISON } from '@/data/blugene/dyedYarn';

/**
 * 실타래 염색 비교 — 석유화학 인디고 · Blugene 1 · Blugene 2 × 1 · 3 · 5회 침염 (3행 3열 사진 한 장).
 *
 * 2026-10-05 고객이 준 SVG 꾸러미(Blugene_SVG_Package.zip — 사진 한 장 위에 한국어 · 영어 · 일본어 글자를 벡터로 얹은 것)를
 * 이 사이트의 방식으로 옮겼다. 사진은 SVG 에 내장된 무손실 PNG(1952×1244)를 꺼내 WebP 로 바꿔 두고, 열 이름(침염 횟수)과
 * 행 이름(시료)은 messages(SkeinComparison.*)에서 읽어 일곱 언어로 번역된다. 꾸러미의 영어 · 일본어 표기를 그대로 따랐다.
 * - 사진 속 3×3 칸은 가로 · 세로 모두 3등분이므로, 열 이름은 사진 폭을 3등분한 자리에, 행 이름은 사진 높이를 3등분한 자리에 놓는다.
 * - 색 비교 사진이라 next/image 재인코딩 없이(unoptimized) 그대로 보여 준다. 바탕(실타래 주변의 어두운 판)은 2026-10-05 고객 요청으로
 *   채널당 +30 밝게 조정했고 실 영역은 무변환이다(scripts/brighten-skein-background.mjs, 캡션에 밝힘).
 * - 시료 표기(Blugene 1 · Blugene 2)는 꾸러미의 표기 그대로이며 언어에 따라 바꾸지 않는다.
 */
/* 침염 횟수 라벨 — 언어마다 단수 · 복수가 달라 횟수별 키로 둔다(검사 스크립트가 ICU 복수형을 읽지 못한다) */
const DIP_KEY = { 1: 'dip1', 3: 'dip3', 5: 'dip5' } as const;
const LABEL = 'text-[0.72rem] leading-snug font-semibold break-keep text-[var(--color-ink)] sm:text-sm lg:text-base';

export default async function SkeinComparison() {
  const t = await getTranslations('SkeinComparison');
  const rows = [t('samplePetro'), t('sampleA'), t('sampleB')];

  return (
    <div className="rounded-lg border border-[color:var(--color-washed)] bg-white p-3 sm:p-4">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-2 gap-y-2 sm:gap-x-3">
        {/* 왼쪽 위 빈 칸 */}
        <span aria-hidden="true" />
        {/* 열 이름 — 사진 폭을 3등분 */}
        <div className="grid grid-cols-3 text-center">
          {SKEIN_COMPARISON.dips.map((count) => (
            <p key={count} className={LABEL}>
              {t(DIP_KEY[count])}
            </p>
          ))}
        </div>
        {/* 행 이름 — 사진 높이를 3등분. 같은 격자 행에 있어 사진 높이만큼 늘어난다 */}
        <div className="grid grid-rows-3 items-center text-right">
          {rows.map((label) => (
            <p key={label} className={`${LABEL} max-w-[5.5rem] pr-1 sm:max-w-none sm:pr-2`}>
              {label}
            </p>
          ))}
        </div>
        <Image
          src={SKEIN_COMPARISON.src}
          alt={t('photoAlt')}
          width={SKEIN_COMPARISON.width}
          height={SKEIN_COMPARISON.height}
          unoptimized
          className="swatch-true-color block h-auto w-full"
        />
      </div>
    </div>
  );
}
