import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { DYED_YARN_BLOCKS } from '@/data/blugene/dyedYarn';

/**
 * 염색사 사진 비교표 — 4 · 6 · 8회 염색 × 염색사 · 1회 세탁.
 *
 * 2026-10-05 고객이 준 SVG(Blugene_Website_Brief/assets/mockups/2026-10-05-dyed-yarn-figure.svg — PDF 5쪽의
 * JPEG 6장을 90° 돌려 내장하고 한국어 표제 · 표선을 벡터로 얹은 것)를 이 사이트의 방식으로 옮긴 것이다.
 * - 사진 6장은 SVG 에서 꺼내 90° 회전만 해 public/blugene/performance/dyed-yarn/ 에 둔다(크기 · 색 무변환, 출처는 asset-manifest.json).
 *   색 비교 사진이라 next/image 의 재인코딩을 거치지 않고(unoptimized) 원본을 그대로 보여 준다.
 * - 표제 · 열 이름 · 행 이름 · 시료명은 SVG 의 글자를 그대로 쓰지 않고 messages(DyedYarn.*)에서 읽어 일곱 언어로 번역된다.
 *   시료 표기는 고객 지정(2026-10-05)으로 Blugene1 · Blugene2 (고객 자료의 Blugene②-1 · ②-2)이며 언어에 따라 바꾸지 않는다.
 * - 넓은 화면(sm 이상): 블록마다 [행 이름 | 시료명 3줄 | 염색사 사진 | 1회 세탁 사진]. 두 사진 열의 너비를 원본 비율(545:725)로
 *   나눠 같은 배율로 줄어들게 하므로 두 사진의 높이가 같고, 시료명 세 줄(1fr × 3)이 사진 속 실 세 가닥과 나란히 선다.
 * - 좁은 화면(sm 미만): 블록마다 행 이름 아래에 [시료명 3줄 | 사진]을 염색사 · 1회 세탁 순으로 쌓는다 — 시료명이 언제나
 *   사진 왼쪽에 같은 글자로 붙어 있어야 한다는 고객 요청(2026-10-05). 사진 alt 도 언제나 순서를 말한다.
 */
const DESKTOP_COLS = 'grid-cols-[2.75rem_7.25rem_minmax(0,545fr)_minmax(0,725fr)]';
const MOBILE_COLS = 'grid-cols-[5.6rem_minmax(0,1fr)]';
const LABEL = 'text-[0.68rem] leading-snug font-semibold break-keep text-[var(--color-ink)] sm:text-[0.8rem]';
const RULE = 'border-[color:var(--color-washed)]';
/* 시료명 세 줄의 자리 — Tailwind 가 클래스를 찾을 수 있게 리터럴로 둔다 */
const DESKTOP_LABEL_POS = ['col-start-2 row-start-1', 'col-start-2 row-start-2', 'col-start-2 row-start-3'] as const;
const MOBILE_LABEL_POS = ['col-start-1 row-start-2', 'col-start-1 row-start-3', 'col-start-1 row-start-4'] as const;
const CONDITIONS = ['dyed', 'washed'] as const;

export default async function DyedYarnFigure() {
  const t = await getTranslations('DyedYarn');
  const samples = { a: t('sampleA'), petro: t('samplePetro'), b: t('sampleB') };
  const sampleList = [samples.a, samples.petro, samples.b];
  const conditions = { dyed: t('colDyed'), washed: t('colWashed') };

  const sampleLabels = (positions: typeof DESKTOP_LABEL_POS | typeof MOBILE_LABEL_POS) =>
    sampleList.map((sample, i) => (
      <p
        key={sample}
        className={`${LABEL} flex items-center pl-1 ${positions[i]} ${i < sampleList.length - 1 ? `border-b ${RULE}` : ''}`}
      >
        {sample}
      </p>
    ));

  const photo = (block: (typeof DYED_YARN_BLOCKS)[number], condition: (typeof CONDITIONS)[number]) => (
    <Image
      src={block[condition].src}
      alt={t('photoAlt', { count: block.cycles, condition: conditions[condition], ...samples })}
      width={block[condition].width}
      height={block[condition].height}
      unoptimized
      className="swatch-true-color block h-auto w-full"
    />
  );

  return (
    <div className="rounded-lg border border-[color:var(--color-washed)] bg-white p-3 sm:p-4">
      {/* 넓은 화면 — 머리(표제 · 두 사진 열 이름) + 블록마다 한 격자 */}
      <div className="hidden sm:block">
        <div className={`grid ${DESKTOP_COLS} items-end gap-x-2 border-b-2 border-[var(--color-denim)] pb-2 text-center`}>
          <p className={`${LABEL} col-span-2 text-left`}>{t('figureTitle')}</p>
          <p className={LABEL}>{conditions.dyed}</p>
          <p className={LABEL}>{conditions.washed}</p>
        </div>
        {DYED_YARN_BLOCKS.map((block) => (
          <div
            key={block.cycles}
            className={`grid ${DESKTOP_COLS} grid-rows-[repeat(3,minmax(0,1fr))] gap-x-2 border-b ${RULE} py-2 last:border-b-0 last:pb-0`}
          >
            <p className={`${LABEL} col-start-1 row-span-3 row-start-1 flex items-center justify-center text-center`}>
              {t('rowCycles', { count: block.cycles })}
            </p>
            {sampleLabels(DESKTOP_LABEL_POS)}
            <div className="col-start-3 row-span-3 row-start-1">{photo(block, 'dyed')}</div>
            <div className="col-start-4 row-span-3 row-start-1">{photo(block, 'washed')}</div>
          </div>
        ))}
      </div>

      {/* 좁은 화면 — 블록마다 행 이름, 그 아래 [시료명 | 사진]을 염색사 · 1회 세탁 순으로 */}
      <div className="sm:hidden">
        <p className={`${LABEL} border-b-2 border-[var(--color-denim)] pb-2`}>{t('figureTitle')}</p>
        {DYED_YARN_BLOCKS.map((block) => (
          <div key={block.cycles} className={`border-b ${RULE} py-2.5 last:border-b-0 last:pb-0`}>
            <p className={`${LABEL} text-[var(--color-denim)]`}>{t('rowCycles', { count: block.cycles })}</p>
            {CONDITIONS.map((condition) => (
              <div
                key={condition}
                className={`mt-1.5 grid ${MOBILE_COLS} grid-rows-[auto_repeat(3,minmax(0,1fr))] gap-x-2`}
              >
                <p className={`${LABEL} col-start-2 row-start-1 pb-1 text-[var(--color-slate-muted)]`}>
                  {conditions[condition]}
                </p>
                {sampleLabels(MOBILE_LABEL_POS)}
                <div className="col-start-2 row-span-3 row-start-2">{photo(block, condition)}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
