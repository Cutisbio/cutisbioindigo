import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import SectionHeading from '@/components/blugene/SectionHeading';
import SourceNote, { AssetKind } from '@/components/blugene/SourceNote';
import ZoomableImage from '@/components/blugene/ZoomableImage';
import {
  fabricComparisonImage,
  fabricSamples,
  fabricStripImage,
  type FabricSample,
  type Fiber,
  type IndigoType,
} from '@/data/blugene/fastness';

/**
 * 원단 비교 — 카탈로그 p.6 Figure 3-1.
 *
 * 식물성 · 화학 · 바이오 인디고로 면 · 실크 · 캐시미어를 염색한 9개 견본(#1~#9)을 보여준다.
 * - 라벨이 인쇄된 도판(fabric-comparison)을 크게 두고, 라벨 없는 원본 스트립(fabric-strip)을 함께 제공한다.
 * - 샘플 대응은 표가 아니라 범례 목록으로 정리한다. 샘플 번호는 데이터의 id 를 그대로 `#{id}` 로 쓴다.
 * - 사진에는 어떤 색보정 · 필터 · 오버레이도 씌우지 않는다 (`swatch-true-color`).
 * - 견뢰도 등급 해석은 이 컴포넌트에서 하지 않는다. "모든 항목에서 우월"이 아니라는 안내(honestNote)를 반드시 함께 둔다.
 */

interface FabricComparisonProps {
  /** 견뢰도 전체 표로 가는 링크를 표시할지 여부 (기본 true) */
  showCta?: boolean;
  /** 'section' 이면 배경·여백을 가진 독립 섹션, 'bare' 면 내부 콘텐츠만 반환한다 */
  variant?: 'section' | 'bare';
}

/** 범례 한 그룹 = 인디고 유형 하나 */
interface LegendGroup {
  type: IndigoType;
  label: string;
  /** 그룹 구분용 상단 선 색 (넓은 면적에 쓰지 않는다) */
  rule: string;
  samples: FabricSample[];
}

export default async function FabricComparison({
  showCta = true,
  variant = 'section',
}: FabricComparisonProps) {
  const t = await getTranslations('Performance');
  const tc = await getTranslations('Common');

  const fiberLabel: Record<Fiber, string> = {
    cotton: t('fiberCotton'),
    silk: t('fiberSilk'),
    cashmere: t('fiberCashmere'),
  };

  const samplesOf = (type: IndigoType): FabricSample[] =>
    fabricSamples.filter((sample) => sample.indigo === type);

  // 사진의 왼쪽 → 오른쪽 순서와 같다: 식물성(#1~#3) · 화학(#4~#6) · 바이오(#7~#9)
  const groups: LegendGroup[] = [
    {
      type: 'plant',
      label: t('sampleLegendPlant'),
      rule: 'bg-[var(--color-washed)]',
      samples: samplesOf('plant'),
    },
    {
      type: 'chemical',
      label: t('sampleLegendChemical'),
      rule: 'bg-[var(--color-slate-muted)]',
      samples: samplesOf('chemical'),
    },
    {
      type: 'bio',
      label: t('sampleLegendBio'),
      rule: 'bg-[var(--color-indigo-deep)]',
      samples: samplesOf('bio'),
    },
  ];

  const content = (
    <>
      <SectionHeading eyebrow={t('eyebrow')} title={t('title')} body={t('body')} size="hero" />

      {/* 라벨이 인쇄된 카탈로그 도판 — 이 섹션의 중심 */}
      <div className="mt-12 sm:mt-14">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <AssetKind>{tc('testPhoto')}</AssetKind>
        </div>
        <div className="mx-auto max-w-[1075px]">
          <ZoomableImage
            src={fabricComparisonImage}
            alt={t('fabricAlt')}
            width={1075}
            height={376}
            openLabel={tc('openImage')}
            closeLabel={tc('close')}
            hint={tc('imageNotePhoto')}
            caption={t('fabricCaption')}
            sizes="(max-width: 640px) 92vw, (max-width: 1120px) 90vw, 1080px"
            imgClassName="swatch-true-color"
          />
        </div>
      </div>

      {/* 샘플 범례 — 표가 아니라 목록으로 읽힌다 */}
      <div className="mt-14 border-t border-[color:var(--color-washed)] pt-10 sm:mt-16">
        <ul className="grid gap-8 sm:grid-cols-3 sm:gap-10">
          {groups.map((group) => (
            <li key={group.type}>
              <span aria-hidden="true" className={`block h-[3px] w-12 ${group.rule}`} />
              <h3 className="mt-4 text-base font-semibold break-keep text-[var(--color-indigo-deep)] sm:text-lg">
                {group.label}
              </h3>
              {/* justify-between 을 주면 칸 폭(약 370px)만큼 번호와 섬유명이 벌어져 둘을 눈으로 이어붙여야 한다 */}
              <ul className="mt-4 space-y-0">
                {group.samples.map((sample) => (
                  <li
                    key={sample.id}
                    className="flex items-baseline gap-3 border-b border-[color:var(--color-washed)] py-2.5 last:border-b-0"
                  >
                    <span className="font-mono text-sm font-semibold tracking-tight tabular-nums text-[var(--color-denim)]">
                      #{sample.id}
                    </span>
                    <span className="text-sm break-keep text-[var(--color-ink)] sm:text-base">
                      {fiberLabel[sample.fiber]}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      {/* 라벨 없는 원본 스트립 + 정직한 단서 */}
      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)] lg:items-start lg:gap-14">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <AssetKind>{tc('testPhoto')}</AssetKind>
          </div>
          <ZoomableImage
            src={fabricStripImage}
            alt={t('fabricAlt')}
            width={1147}
            height={193}
            openLabel={tc('viewOriginal')}
            closeLabel={tc('close')}
            hint={tc('imageNotePhoto')}
            caption={tc('imageNotePhoto')}
            sizes="(max-width: 1024px) 92vw, 620px"
            imgClassName="swatch-true-color"
          />
        </div>

        <div className="border-l-2 border-[color:var(--color-denim)] pl-5 sm:pl-6">
          <SourceNote className="text-sm sm:text-[0.9375rem]">{t('honestNote')}</SourceNote>

          {showCta && (
            <Link
              href="/dyeing-printing"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-denim)] underline underline-offset-4 hover:text-[var(--color-indigo-deep)]"
            >
              {t('cta')}
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );

  if (variant === 'bare') return content;

  return (
    <section className="bg-[var(--color-ivory)]">
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        {content}
      </div>
    </section>
  );
}
