import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import SectionHeading from '@/components/blugene/SectionHeading';
import SourceNote, { AssetKind } from '@/components/blugene/SourceNote';
import { productSummary } from '@/data/blugene/evidence';
import { productForms, type ProductForm } from '@/data/blugene/shades';

/**
 * 제품군 섹션 — 분말과 디지털 프린팅 잉크.
 *
 * 근거 자료
 * - 제품 사진 · 원문 제품명: 카탈로그 p.8-9 (`productForms`)
 * - CAS 번호 482-89-3: 카탈로그 p.11 (`productSummary.cas`) — 인디고 물질 자체의 번호이므로 분말에만 붙인다.
 * - 염색 횟수 비교 도판(카탈로그 p.8 Figure 5-1)은 2026-10-05 고객 요청으로 색상 라이브러리의 「카탈로그 농도별 견본」
 *   위로 옮겼다 — DyeingCycles.tsx (/dyeing-printing 의 ShadeLibrary beforeGrid 슬롯). 문구 키(Products.cycles*)는 그대로다.
 *
 * 표기 원칙
 * - 웹 표시명은 신규 브랜드 표기안이므로 메시지(powderTitle / inkTitle)에서 읽고,
 *   카탈로그·인증서의 원문 제품명(catalogueName)은 데이터 모듈 값 그대로 카드마다 함께 밝힌다.
 * - 입도 · 점도 · MOQ 등 제공 자료에 없는 규격은 만들어 쓰지 않고, 없다는 사실을 그대로 안내한다(specNote).
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

      {/*
        두 제형 — 좌우 2열, 모바일에서는 세로로 쌓는다.
        items-start 가 없으면 두 카드가 같은 높이로 늘어나고, CAS 행이 없는 잉크 카드는
        본문과 출처 주석 사이에 약 100px 빈 면이 남는다.
      */}
      <div className="mt-12 grid items-start gap-6 sm:gap-8 lg:mt-16 lg:grid-cols-2">
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

                {/* mt-auto 를 주면 카드 높이가 맞춰질 때 주석이 카드 바닥으로 밀려 본문과 벌어진다 */}
                <SourceNote className="pt-6">
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
