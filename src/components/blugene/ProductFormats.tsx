import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import SectionHeading from '@/components/blugene/SectionHeading';
import SourceNote, { AssetKind } from '@/components/blugene/SourceNote';
import ZoomableImage from '@/components/blugene/ZoomableImage';
import { productSummary } from '@/data/blugene/evidence';
import {
  dyeingCycleImage,
  dyeingCycleRows,
  dyeingCycles,
  productForms,
  type ProductForm,
} from '@/data/blugene/shades';

/**
 * 제품군 섹션 — 분말과 디지털 프린팅 잉크.
 *
 * 근거 자료
 * - 제품 사진 · 원문 제품명: 카탈로그 p.8-9 (`productForms`)
 * - CAS 번호 482-89-3: 카탈로그 p.11 (`productSummary.cas`) — 인디고 물질 자체의 번호이므로 분말에만 붙인다.
 * - 염색 횟수 비교 도판: 카탈로그 p.8 Figure 5-1 (`dyeingCycleImage`, 3행 × 4열)
 *
 * 표기 원칙
 * - 웹 표시명은 신규 브랜드 표기안이므로 메시지(powderTitle / inkTitle)에서 읽고,
 *   카탈로그·인증서의 원문 제품명(catalogueName)은 데이터 모듈 값 그대로 카드마다 함께 밝힌다.
 * - 도판은 사진일 뿐이므로 색 농담을 K/S 나 ΔE 같은 수치로 환산하지 않는다(cyclesNote).
 * - 입도 · 점도 · MOQ 등 제공 자료에 없는 규격은 만들어 쓰지 않고, 없다는 사실을 그대로 안내한다(specNote).
 *
 * 도판 마크업
 * - <figure> 안에는 도판 이미지와 그것을 설명하는 한 문장(cyclesCaption)만 둔다.
 *   제목 · 자료 종류 · 행열 범례 · 주석 · 문의 링크는 도판의 이름이 아니라 본문이므로 figure 바깥의 형제로 둔다.
 *   (figcaption 이 길어지면 figure 의 접근 가능한 이름이 문단 전체가 되어 버린다.)
 */

/** 제품 id 별로 쓸 메시지 키. 문자열을 조립하지 않고 리터럴로 고정해 오타·누락을 막는다. */
const FORM_COPY: Record<
  ProductForm['id'],
  {
    readonly titleKey: 'powderTitle' | 'inkTitle';
    readonly textKey: 'powderText' | 'inkText';
    readonly altKey: 'powderAlt' | 'inkAlt';
  }
> = {
  powder: { titleKey: 'powderTitle', textKey: 'powderText', altKey: 'powderAlt' },
  ink: { titleKey: 'inkTitle', textKey: 'inkText', altKey: 'inkAlt' },
};

export default async function ProductFormats({
  variant = 'section',
}: {
  /** 'section' 이면 배경·여백을 가진 독립 섹션, 'bare' 면 내부 콘텐츠만 반환한다 */
  variant?: 'section' | 'bare';
}) {
  const t = await getTranslations('Products');
  const tc = await getTranslations('Common');

  const content = (
    <>
      <SectionHeading eyebrow={t('eyebrow')} title={t('title')} body={t('body')} />

      {/* 두 제형 — 좌우 2열, 모바일에서는 세로로 쌓는다 */}
      <div className="mt-12 grid gap-6 sm:gap-8 lg:mt-16 lg:grid-cols-2">
        {productForms.map((form) => {
          const copy = FORM_COPY[form.id];
          return (
            <article
              key={form.id}
              className="flex flex-col overflow-hidden rounded-lg border border-[color:var(--color-washed)] bg-white"
            >
              {/* 제품 사진 — 흰 바탕 위에 원본 비율 그대로, 색보정 없이 */}
              <div className="flex h-[220px] items-center justify-center bg-white px-6 py-8 sm:h-[280px]">
                <Image
                  src={form.image}
                  alt={t(copy.altKey)}
                  width={form.imageSize.width}
                  height={form.imageSize.height}
                  sizes="(max-width: 1024px) 60vw, 320px"
                  className="swatch-true-color h-auto max-h-full w-auto object-contain"
                />
              </div>

              <div className="flex grow flex-col border-t border-[color:var(--color-washed)] px-6 py-7 sm:px-8 sm:py-8">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h3 className="text-xl font-bold tracking-[-0.01em] break-keep text-[var(--color-indigo-deep)] sm:text-2xl">
                    {t(copy.titleKey)}
                  </h3>
                  <AssetKind>{tc('cataloguePage', { page: form.page })}</AssetKind>
                </div>

                <p className="mt-4 text-[0.95rem] leading-[1.85] break-keep text-[var(--color-ink)]/85">
                  {t(copy.textKey)}
                </p>

                {/* CAS 번호는 인디고 물질에 부여된 번호이므로 분말 제품에만 표시한다 */}
                {form.id === 'powder' && (
                  <dl className="mt-5 flex items-baseline gap-3 border-t border-[color:var(--color-washed)] pt-4">
                    <dt className="text-[0.72rem] font-semibold tracking-[0.16em] text-[var(--color-denim)]">
                      CAS
                    </dt>
                    <dd className="font-mono text-base text-[var(--color-ink)] tabular-nums">
                      {productSummary.cas}
                    </dd>
                  </dl>
                )}

                <SourceNote className="mt-auto pt-6">
                  {t('nameNote', { catalogueName: form.catalogueName })}
                </SourceNote>
              </div>
            </article>
          );
        })}
      </div>

      {/* 제공 자료에 없는 규격은 만들지 않고, 없다는 사실을 밝힌다 */}
      <SourceNote className="mt-6 max-w-3xl rounded-md border border-[color:var(--color-washed)] bg-white/70 px-5 py-4">
        {t('specNote')}
      </SourceNote>

      {/* 염색 횟수 비교 — 카드 격자와 리듬을 달리해 좌우 비대칭으로 놓는다 (모바일에서는 도판이 먼저) */}
      <div className="mt-14 grid gap-8 border-t border-[color:var(--color-washed)] pt-12 lg:mt-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-14 lg:pt-16">
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

          {/* 위 문장이 설명하는 3행 × 4열 구조를 눈으로도 잡을 수 있게 한 보조 도식 (열 번호 = 염색 횟수) */}
          <div
            aria-hidden="true"
            className="mt-6 inline-grid grid-cols-4 gap-x-2 gap-y-1.5 rounded-md border border-[color:var(--color-washed)] bg-white px-4 py-3"
          >
            {dyeingCycles.map((cycle) => (
              <span
                key={cycle}
                className="text-center text-[0.7rem] font-semibold text-[var(--color-denim)] tabular-nums"
              >
                {cycle}
              </span>
            ))}
            {dyeingCycleRows.flatMap((row) =>
              dyeingCycles.map((cycle) => (
                <span
                  key={`${row}-${cycle}`}
                  className="h-2.5 w-9 rounded-[2px] bg-[var(--color-washed)]"
                />
              )),
            )}
          </div>

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
