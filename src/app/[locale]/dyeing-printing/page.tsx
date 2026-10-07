import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import SectionHeading from '@/components/blugene/SectionHeading';
import FabricComparison from '@/components/blugene/FabricComparison';
import FastnessTables from '@/components/blugene/FastnessTables';
import ShadeLibrary from '@/components/blugene/ShadeLibrary';
import DyeingCycles from '@/components/blugene/DyeingCycles';
import ProductFormats from '@/components/blugene/ProductFormats';
import PrintingGallery from '@/components/blugene/PrintingGallery';
import { LOCALES, buildPageMetadata } from '@/data/blugene/site';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'DyeingPrinting' });
  return buildPageMetadata({
    locale,
    path: '/dyeing-printing',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function DyeingPrintingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'DyeingPrinting' });

  return (
    <>
      {/* 히어로 — 왼쪽 카피 · 이동 메뉴, 오른쪽 전시 설치 사진(2026-10-06 고객 제공 · 요청).
          사진은 세로(1341×1892 — 2026-10-07 가장자리 여백을 잘라 낸 뒤 크기)라 PC 에서는 오른쪽 열(약 42%)에 세워 크게, 좁은 화면에서는 카피 아래에 폭을 채워 둔다.
          첫 화면이라 지연 로딩하지 않는다. 사진 위에 문구를 올리지 않는다.
          2026-10-07 고객 요청으로 테두리 대신 남색 기운의 그림자와 옅은 링을 둬 사진이 떠 보이게 한다. */}
      <section className="w-full border-b border-[color:var(--color-washed)] bg-[var(--color-ivory)]">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,42%)] lg:items-center lg:gap-16">
            <div>
              <SectionHeading
                headingLevel="h1"
                eyebrow={t('heroEyebrow')}
                title={t('heroTitle')}
                body={t('heroBody')}
                size="hero"
              />
              {/* 이 페이지는 11,000px 이 넘는데 앵커 다섯 개가 정의만 되어 있고 링크가 없었다.
                  장식이 아니라 이동 수단이라 히어로 바로 아래에 둔다. */}
              <nav aria-label={t('jumpNavLabel')} className="mt-10">
                <ul className="-mx-1 flex flex-wrap gap-2">
                  {(t.raw('jumpNav') as string[]).map((label, index) => (
                    <li key={label}>
                      <a
                        href={`#${['dyeability', 'colorfastness', 'shades', 'products', 'printing'][index]}`}
                        className="inline-block rounded-full border border-[color:var(--color-washed)] bg-white px-4 py-1.5 text-sm font-semibold break-keep text-[var(--color-indigo-deep)] transition-colors hover:border-[var(--color-denim)] hover:text-[var(--color-denim)]"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <figure className="mx-auto w-full max-w-[560px] lg:max-w-none">
              <Image
                src="/blugene/performance/exhibition-indigo-installation.webp"
                alt={t('heroImageAlt')}
                width={1341}
                height={1892}
                preload
                fetchPriority="high"
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 560px, 520px"
                className="h-auto w-full rounded-lg bg-white shadow-[0_28px_56px_-24px_rgba(16,29,70,0.55),0_10px_20px_-10px_rgba(16,29,70,0.25)] ring-1 ring-[color:var(--color-indigo-deep)]/10"
              />
              <figcaption className="mt-2.5 text-[0.8125rem] leading-relaxed break-keep text-[var(--color-slate-muted)]">
                {t('heroImageCaption')}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* 염색성 — 원본 스트립 + 안내 블록은 2026-09-12 고객 요청으로 뺐다(showStrip). 같은 안내는 아래 견뢰도 표에 남아 있다. */}
      <section id="dyeability" className="w-full bg-white scroll-mt-24">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <FabricComparison variant="bare" showCta={false} showStrip={false} />
        </div>
      </section>

      {/* 견뢰도 전체 표 */}
      <section id="colorfastness" className="w-full bg-[var(--color-ivory)] scroll-mt-24">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <FastnessTables variant="bare" />
          {/* 「추가 원단 평가 사례」(/test.png, AdditionalDyeingCase)는 2026-10-05 고객 요청으로 뺐다 — 컴포넌트 · 문구 키 삭제, 파일은 남김. */}
        </div>
      </section>

      {/* 색상 라이브러리 — 「염색 횟수에 따른 발색 비교」(DyeingCycles)는 2026-10-05 고객 요청으로 제품군 섹션에서
          「카탈로그 농도별 견본」 바로 위로 옮겼다. */}
      <section id="shades" className="w-full bg-white scroll-mt-24">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <ShadeLibrary variant="bare" beforeGrid={<DyeingCycles />} />
        </div>
      </section>

      {/* 제품군 */}
      <section id="products" className="w-full bg-[var(--color-ivory)] scroll-mt-24">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <ProductFormats variant="bare" />
        </div>
      </section>

      {/* 프린팅 */}
      <section id="printing" className="w-full bg-white scroll-mt-24">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <PrintingGallery />
          <Link
            href="/contact"
            className="mt-14 inline-flex items-center justify-center rounded-md bg-[var(--color-indigo-deep)] px-7 py-4 text-base font-semibold break-keep text-white transition-colors hover:bg-[var(--color-denim)]"
          >
            {t('cta')}
          </Link>
        </div>
      </section>
    </>
  );
}
