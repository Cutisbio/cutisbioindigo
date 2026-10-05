import { getTranslations } from 'next-intl/server';
import SourceNote, { AssetKind } from '@/components/blugene/SourceNote';
import DyedYarnFigure from '@/components/blugene/DyedYarnFigure';
import SkeinComparison from '@/components/blugene/SkeinComparison';

/**
 * 「염색 횟수에 따른 발색 비교」 — 고객 제공 사진 두 가지(2026-10-05).
 *   위: 실타래 비교(SkeinComparison) — 석유화학 인디고 · Blugene 1 · Blugene 2 × 1 · 3 · 5회 침염, 사진 한 장. 블록 맨 위(고객 요청).
 *       소제목 「Blugene 염색실증 사례 1」(skeinCaseTitle, 2026-10-06 고객 요청).
 *   아래: 염색사 사진표(DyedYarnFigure) — Blugene1 · 석유화학 인디고 · Blugene2 × 4 · 6 · 8회 염색 × 염색사 · 1회 세탁, 사진 여섯 장.
 *       소제목 「Blugene 염색실증 사례 2」(yarnCaseTitle, 2026-10-06 고객 요청).
 * 전에는 카탈로그 p.8 Figure 5-1(`dyeingCycleImage`, 3행 × 4열)을 ZoomableImage 로 보여 줬는데, 2026-10-05 고객 요청으로
 * 고객이 준 SVG(4 · 6 · 8회 염색 × 염색사 · 1회 세탁 사진 6장)로 바꿨다. 카탈로그 도판 파일은 남아 있고 화면에서만 뺐다.
 *
 * 원래 제품군 섹션(ProductFormats)의 마지막 블록이었다. 2026-10-05 고객 요청으로 색상 라이브러리의
 * 「카탈로그 농도별 견본」 바로 위(ShadeLibrary 의 beforeGrid 슬롯)로 옮기면서 컴포넌트로 뺐다.
 * 문구는 Products.cycles* · cta 를 그대로 쓴다(키 이동 없음). 홈에는 두지 않는다(2026-09-29 고객 요청).
 *
 * 표현 원칙
 * - 사진일 뿐이므로 색 농담을 K/S 나 ΔE 같은 수치로 환산하지 않는다(cyclesNote).
 * - <figure> 안에는 사진표와 그것을 설명하는 한 문장(cyclesCaption)만 둔다.
 *   제목 · 자료 종류 · 주석은 본문이므로 figure 바깥의 형제로 둔다.
 *   (figcaption 이 길어지면 figure 의 접근 가능한 이름이 문단 전체가 되어 버린다.)
 * - 표의 글자(표제 · 열 · 행 · 시료명)는 DyedYarnFigure 가 messages(DyedYarn.*)에서 읽으므로 언어마다 번역된다.
 */
export default async function DyeingCycles({ className = '' }: { className?: string }) {
  const t = await getTranslations('Products');
  const tc = await getTranslations('Common');

  return (
    <div className={`flex flex-col gap-8 lg:gap-10 ${className}`}>
      {/* 글이 먼저, 사진표는 아래에 컨테이너 전체 폭으로 — 사진이 최대한 크게 보이도록(2026-10-05 고객 요청).
          전에는 PC 에서 글 오른쪽 열(약 절반 폭)에 두어 사진이 작았다. */}
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-xl font-bold tracking-[-0.01em] break-keep text-[var(--color-indigo-deep)] sm:text-2xl">
          {t('cyclesTitle')}
        </h3>
        <AssetKind>{tc('testPhoto')}</AssetKind>
      </div>

      {/* 실타래 비교(1 · 3 · 5회 침염) — 2026-10-05 고객 제공 SVG 꾸러미. 블록 맨 위에 둔다(고객 요청).
          사진표 위의 「Blugene 염색실증 사례 1」 소제목은 2026-10-06 고객 요청. 제목은 본문이므로 figure 바깥에 둔다. */}
      <div className="flex flex-col gap-3">
        <h4 className="text-base font-bold tracking-[-0.01em] break-keep text-[var(--color-indigo-deep)] sm:text-lg">
          {t('skeinCaseTitle')}
        </h4>
        <figure>
          <SkeinComparison />
          <figcaption className="mt-2 text-[0.8125rem] leading-relaxed break-keep text-[var(--color-slate-muted)]">
            {t('skeinCaption')}
          </figcaption>
        </figure>
      </div>

      <div className="max-w-3xl">
        {/* 염색사 사진표의 짜임을 적던 설명 문단(Products.cyclesAlt)은 2026-10-06 고객 요청으로 뺐다(키도 지움). 주석만 남긴다. */}
        <SourceNote>{t('cyclesNote')}</SourceNote>

        {/* '제품 자료 문의 →' 링크는 2026-10-06 고객 요청으로 뺐다(Products.cta 키도 지움). */}
      </div>

      {/* figure 는 사진표와 그것을 설명하는 한 문장만 담는다. 전체 폭.
          사진표 위의 「Blugene 염색실증 사례 2」 소제목은 2026-10-06 고객 요청. */}
      <div className="flex flex-col gap-3">
        <h4 className="text-base font-bold tracking-[-0.01em] break-keep text-[var(--color-indigo-deep)] sm:text-lg">
          {t('yarnCaseTitle')}
        </h4>
        <figure>
          <DyedYarnFigure />
          <figcaption className="mt-2 text-[0.8125rem] leading-relaxed break-keep text-[var(--color-slate-muted)]">
            {t('cyclesCaption')}
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
