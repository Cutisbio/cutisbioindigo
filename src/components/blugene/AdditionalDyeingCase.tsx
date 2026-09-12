import { getTranslations } from 'next-intl/server';
import ZoomableImage from '@/components/blugene/ZoomableImage';
import SourceNote, { AssetKind } from '@/components/blugene/SourceNote';
import { additionalDyeingCase } from '@/data/blugene/fastness';

/**
 * 추가 원단 평가 사례 (`/test.png`).
 *
 * 저장소에 원래 있던 일본어 라벨의 염색 비교 사진이다.
 * 시험기관·시험법·일자·의뢰처가 확인되지 않으므로 카탈로그 p.6 시험과 **분리해** 표시하고,
 * 원문에 인쇄된 라벨(4·6·8회 염색 / バイオ②-1 · 合成 · バイオ②-2)만 그대로 옮긴다.
 * '일본 프리미엄 파트너가 내구성 우위를 입증' 같은 근거 없는 표현을 붙이지 않는다.
 */
export default async function AdditionalDyeingCase() {
  const t = await getTranslations('Performance');
  const tCommon = await getTranslations('Common');

  return (
    <div className="rounded-md border border-[color:var(--color-washed)] bg-[var(--color-ivory)] p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <AssetKind>{tCommon('testPhoto')}</AssetKind>
        <h3 className="text-xl font-semibold break-keep text-[var(--color-indigo-deep)]">
          {t('additionalCaseTitle')}
        </h3>
      </div>

      <p className="mt-4 max-w-2xl text-base leading-relaxed break-keep text-[var(--color-ink)]/85">
        {t('additionalCaseBody')}
      </p>

      {/* 라벨은 번역하고, 값은 원본 도판에 인쇄된 일본어 전사 문자열이므로 그대로 둔다 */}
      <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm text-[var(--color-slate-muted)]">
        <div className="flex gap-2">
          <dt className="font-medium">{t('additionalCaseCyclesLabel')}</dt>
          <dd lang="ja">{additionalDyeingCase.cycles.map((c) => `${c}回`).join(' · ')}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium">{t('additionalCaseRowsLabel')}</dt>
          <dd lang="ja">{additionalDyeingCase.rowsAsPrinted.join(' / ')}</dd>
        </div>
      </dl>

      <div className="mt-6 max-w-3xl">
        <ZoomableImage
          src={additionalDyeingCase.image}
          alt={t('additionalCaseAlt')}
          width={1258}
          height={732}
          sizes="(max-width: 768px) 92vw, 720px"
          openLabel={tCommon('openImage')}
          closeLabel={tCommon('close')}
          imgClassName="swatch-true-color"
        />
      </div>

      <SourceNote className="mt-5 max-w-3xl">{t('additionalCaseProvenance')}</SourceNote>
    </div>
  );
}
