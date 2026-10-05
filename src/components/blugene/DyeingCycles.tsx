import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import SourceNote, { AssetKind } from '@/components/blugene/SourceNote';
import ZoomableImage from '@/components/blugene/ZoomableImage';
import { dyeingCycleImage } from '@/data/blugene/shades';

/**
 * 「염색 횟수에 따른 발색 비교」 — 카탈로그 p.8 Figure 5-1 (`dyeingCycleImage`, 3행 × 4열).
 *
 * 원래 제품군 섹션(ProductFormats)의 마지막 블록이었다. 2026-10-05 고객 요청으로 색상 라이브러리의
 * 「카탈로그 농도별 견본」 바로 위(ShadeLibrary 의 beforeGrid 슬롯)로 옮기면서 컴포넌트로 뺐다.
 * 문구는 Products.cycles* · cta 를 그대로 쓴다(키 이동 없음). 홈에는 두지 않는다(2026-09-29 고객 요청).
 *
 * 표현 원칙
 * - 도판은 사진일 뿐이므로 색 농담을 K/S 나 ΔE 같은 수치로 환산하지 않는다(cyclesNote).
 * - <figure> 안에는 도판 이미지와 그것을 설명하는 한 문장(cyclesCaption)만 둔다.
 *   제목 · 자료 종류 · 행열 범례 · 주석 · 문의 링크는 도판의 이름이 아니라 본문이므로 figure 바깥의 형제로 둔다.
 *   (figcaption 이 길어지면 figure 의 접근 가능한 이름이 문단 전체가 되어 버린다.)
 * - 3행 × 4열 구조를 값 없는 회색 막대로 다시 그리지 않는다. 같은 구조를 cyclesAlt 가 글로,
 *   Figure 5-1 이 실제 색과 라벨로 이미 전달한다.
 */
export default async function DyeingCycles({ className = '' }: { className?: string }) {
  const t = await getTranslations('Products');
  const tc = await getTranslations('Common');

  return (
    <div
      className={`grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-14 ${className}`}
    >
      {/* 좌우 비대칭 — 모바일에서는 도판이 먼저 */}
      <div className="order-2 lg:order-1">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-xl font-bold tracking-[-0.01em] break-keep text-[var(--color-indigo-deep)] sm:text-2xl">
            {t('cyclesTitle')}
          </h3>
          <AssetKind>{tc('testPhoto')}</AssetKind>
        </div>

        {/* 행 · 열 범례 — 이미지를 열지 않아도 도판 구조를 글로 읽을 수 있게 본문에 노출한다 */}
        <p className="mt-4 max-w-xl text-[0.95rem] leading-[1.85] break-keep text-[var(--color-ink)]/85">
          {t('cyclesAlt')}
        </p>

        <SourceNote className="mt-6 max-w-xl">{t('cyclesNote')}</SourceNote>

        <Link
          href="/contact"
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-denim)] underline underline-offset-4 hover:text-[var(--color-indigo-deep)]"
        >
          {t('cta')}
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {/* figure 는 도판 한 장과 그것을 설명하는 한 문장만 담는다 */}
      <figure className="order-1 lg:order-2">
        <ZoomableImage
          src={dyeingCycleImage}
          alt={t('cyclesAlt')}
          width={1235}
          height={1175}
          openLabel={tc('openImage')}
          closeLabel={tc('close')}
          hint={tc('imageNotePhoto')}
          sizes="(max-width: 1024px) 92vw, 620px"
        />
        <figcaption className="mt-2 text-[0.8125rem] leading-relaxed break-keep text-[var(--color-slate-muted)]">
          {t('cyclesCaption')}
        </figcaption>
      </figure>
    </div>
  );
}
