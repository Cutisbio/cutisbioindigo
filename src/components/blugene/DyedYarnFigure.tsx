import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { DYED_YARN_BLOCKS } from '@/data/blugene/dyedYarn';

/**
 * 염색사 사진 비교표 — 4 · 6 · 8회 염색 × 염색사(왼쪽) · 1회 세탁(오른쪽).
 *
 * 2026-10-05 고객이 준 SVG(Blugene_Website_Brief/assets/mockups/2026-10-05-dyed-yarn-figure.svg — PDF 5쪽의
 * JPEG 6장을 90° 돌려 내장하고 한국어 표제 · 표선을 벡터로 얹은 것)를 이 사이트의 방식으로 옮긴 것이다.
 * - 사진 6장은 SVG 에서 꺼내 90° 회전만 해 public/blugene/performance/dyed-yarn/ 에 둔다(크기 · 색 무변환, 출처는 asset-manifest.json).
 *   색 비교 사진이라 next/image 의 재인코딩을 거치지 않고(unoptimized) 원본을 그대로 보여 준다.
 * - 표제 · 열 이름 · 행 이름 · 시료명은 SVG 의 글자를 그대로 쓰지 않고 messages(DyedYarn.*)에서 읽어 일곱 언어로 번역된다.
 *   시료 코드(Blugene②-1 · Blugene②-2)는 고객 자료의 표기 그대로이며 언어에 따라 바꾸지 않는다.
 * - 각 블록은 CSS 격자 3행(1fr)으로, 사진 한 장이 세 행을 차지한다. 두 사진 열의 너비를 원본 비율(545:725)로 나눠
 *   같은 배율로 줄어들게 하므로 왼쪽 · 오른쪽 사진의 높이가 같고, 시료명 세 줄이 사진 속 실 세 가닥과 나란히 선다.
 * - 좁은 화면(sm 미만)에서는 시료명 열을 숨기고 위의 한 줄 범례(sampleOrder)로 순서를 알린다. 사진 alt 는 언제나 순서를 말한다.
 */
const COLS =
  'grid-cols-[2.4rem_minmax(0,545fr)_minmax(0,725fr)] sm:grid-cols-[2.75rem_7.25rem_minmax(0,545fr)_minmax(0,725fr)]';
const LABEL = 'text-[0.72rem] leading-snug font-semibold break-keep text-[var(--color-ink)] sm:text-[0.8rem]';

export default async function DyedYarnFigure() {
  const t = await getTranslations('DyedYarn');
  const samples = { a: t('sampleA'), petro: t('samplePetro'), b: t('sampleB') };
  const sampleList = [samples.a, samples.petro, samples.b];
  const conditions = { dyed: t('colDyed'), washed: t('colWashed') };

  return (
    <div className="rounded-lg border border-[color:var(--color-washed)] bg-white p-3 sm:p-4">
      {/* 머리 — 왼쪽 표제, 오른쪽 두 사진 열의 이름 */}
      <div className={`grid ${COLS} items-end gap-x-2 border-b-2 border-[var(--color-denim)] pb-2 text-center`}>
        <p className={`${LABEL} col-span-1 text-left sm:col-span-2`}>{t('figureTitle')}</p>
        <p className={LABEL}>{conditions.dyed}</p>
        <p className={LABEL}>{conditions.washed}</p>
      </div>
      {/* 좁은 화면 범례 — 시료명 열을 숨기는 대신 순서를 한 줄로 */}
      <p className="mt-2 text-[0.72rem] leading-relaxed break-keep text-[var(--color-slate-muted)] sm:hidden">
        {t('sampleOrder', samples)}
      </p>

      {DYED_YARN_BLOCKS.map((block) => (
        <div
          key={block.cycles}
          className={`grid ${COLS} grid-rows-[repeat(3,minmax(0,1fr))] gap-x-2 border-b border-[color:var(--color-washed)] py-2 last:border-b-0 last:pb-0`}
        >
          <p className={`${LABEL} row-span-3 flex items-center justify-center text-center`}>
            {t('rowCycles', { count: block.cycles })}
          </p>
          {sampleList.map((sample, i) => (
            <p
              key={sample}
              className={`${LABEL} hidden items-center pl-1 sm:flex ${
                i < sampleList.length - 1 ? 'border-b border-[color:var(--color-washed)]' : ''
              }`}
            >
              {sample}
            </p>
          ))}
          {(['dyed', 'washed'] as const).map((condition) => {
            const photo = block[condition];
            return (
              <div
                key={condition}
                className={`row-span-3 row-start-1 ${
                  condition === 'dyed' ? 'col-start-2 sm:col-start-3' : 'col-start-3 sm:col-start-4'
                }`}
              >
                <Image
                  src={photo.src}
                  alt={t('photoAlt', { count: block.cycles, condition: conditions[condition], ...samples })}
                  width={photo.width}
                  height={photo.height}
                  unoptimized
                  className="swatch-true-color block h-auto w-full"
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
