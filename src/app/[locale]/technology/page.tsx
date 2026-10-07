import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import SectionHeading from '@/components/blugene/SectionHeading';
import CarbonJourney from '@/components/blugene/CarbonJourney';
import SourceNote, { AssetKind } from '@/components/blugene/SourceNote';
import ZoomableImage from '@/components/blugene/ZoomableImage';
import HeroVideo from '@/components/blugene/HeroVideo';
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
  const t = await getTranslations({ locale, namespace: 'Technology' });
  return buildPageMetadata({
    locale,
    path: '/technology',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

type Route = {
  name: string;
  feedstock: string;
  intermediate: string;
  text: string;
};

export default async function TechnologyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Technology' });
  const tCommon = await getTranslations({ locale, namespace: 'Common' });
  const routes = t.raw('routes') as Route[];

  return (
    <>
      {/* 히어로 — 왼쪽 카피, 오른쪽 「옥수수에서 인디고로」 개념 애니메이션(2026-10-06 고객 제공 · 요청).
          같은 날 먼저 넣었던 구조식 도해(blugene-structure.webp)를 이 영상으로 바꿨다(파일은 남김).
          영상은 1280×720 · 22초 · 무음 · 반복이고 바탕을 히어로와 같은 아이보리로 렌더해 테두리 없이 바탕에 녹아든다.
          PC 에서는 오른쪽 열(약 50%, 2026-10-07 고객 요청으로 46% 에서 넓힘 — 더 넓히면 제목이 세 줄로 갈린다), 좁은 화면에서는 카피 아래.
          영상 안의 머리글 · 범례 · 바닥글은 2026-10-07 고객 요청으로 빼고 내용을 조금 키워 다시 렌더했다(scene-web.js).
          남은 글자(옥수수 · 인디고 분자식)는 한국어 · 영어로 그려져 있어 언어별로 바뀌지 않는다.
          캡션은 영상이 탄소 출처를 설명하는 개념 시각화이지 반응 기전이 아니라는 점을 밝힌다(제공 README 의 단서). */}
      <section className="w-full border-b border-[color:var(--color-washed)] bg-[var(--color-ivory)]">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,50%)] lg:items-center lg:gap-10">
            <SectionHeading
              headingLevel="h1"
              eyebrow={t('heroEyebrow')}
              title={t('heroTitle')}
              body={t('heroBody')}
              size="hero"
            />
            <figure className="mx-auto w-full max-w-[720px] lg:max-w-none">
              <HeroVideo
                src="/blugene/technology/corn-to-indigo-720p.mp4"
                poster="/blugene/technology/corn-to-indigo-poster.webp"
                label={t('heroVideoLabel')}
                playLabel={tCommon('playVideo')}
                pauseLabel={tCommon('pauseVideo')}
                className="aspect-video"
              />
              <figcaption className="mt-2.5 text-[0.8125rem] leading-relaxed break-keep text-[var(--color-slate-muted)]">
                {t('heroVideoCaption')}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* 네 가지 경로 — 글과 그림이 같은 내용을 두 방식으로 설명하므로 한 덩어리로 묶는다.
          예전에는 네 카드(1216px)와 도식(895px)이 폭도 다르고 그 사이에 주석까지 끼어 있어
          서로 다른 자료처럼 보였다. 도식을 카드와 같은 폭으로 바로 아래 붙이고, 주석은
          그림 뒤로 뺐다. */}
      <section className="w-full bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <SectionHeading title={t('routesTitle')} size="lg" />

          <div className="mt-10 rounded-lg border border-[color:var(--color-washed)] bg-[var(--color-ivory)] p-4 sm:p-6 lg:p-8">
            {/* 카드 순서는 도식의 왼쪽부터와 같다(화학 · 하이브리드 · 미생물 · 식물).
                순서에 뜻이 있으므로 목록으로 둔다. */}
            <ol className="grid list-none gap-5 p-0 md:grid-cols-2 xl:grid-cols-4">
              {routes.map((route, i) => {
                const isBio = i === 2;
                return (
                  <li
                    key={route.name}
                    className={`rounded-md border bg-white p-6 ${
                      isBio
                        ? 'border-2 border-[var(--color-indigo-deep)]'
                        : 'border-[color:var(--color-washed)]'
                    }`}
                  >
                    <div className="mb-3 flex items-center gap-2">
                      {/* 도식의 몇 번째 줄기인지 눈으로 짚어 주는 번호다. 순서는 목록
                          자체가 이미 알려 주므로 보조기기에는 읽히지 않게 한다. */}
                      <span
                        aria-hidden="true"
                        className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          isBio
                            ? 'bg-[var(--color-indigo-deep)] text-white'
                            : 'bg-[var(--color-washed)] text-[var(--color-indigo-deep)]'
                        }`}
                      >
                        {i + 1}
                      </span>
                      {/* 어느 것이 우리 경로인지가 테두리 색으로만 표시되면 색을 구분하지
                          못하는 사람에게는 네 카드가 같아 보인다. 의미를 글자가 담게 한다.
                          2026-09-12 고객 요청으로 작은 청색 글씨 대신 번호 배지와 같은 남색 알약(굵은 흰 글씨)으로 키웠다.
                          라벨에 브랜드명이 들어가므로 uppercase 를 쓰지 않는다(Blugene 표기 규칙). */}
                      {isBio && (
                        <p className="inline-flex items-center rounded-full bg-[var(--color-indigo-deep)] px-3 py-1 text-[0.8rem] leading-none font-bold tracking-[0.04em] break-keep text-white">
                          {t('routeOursLabel')}
                        </p>
                      )}
                    </div>
                    <h3 className="text-lg leading-snug font-semibold break-keep text-[var(--color-indigo-deep)]">
                      {route.name}
                    </h3>
                    <dl className="mt-4 space-y-2 text-sm">
                      <div>
                        <dt className="text-[var(--color-slate-muted)]">
                          {t('routeFeedstockLabel')}
                        </dt>
                        <dd className="font-medium break-keep text-[var(--color-ink)]">
                          {route.feedstock}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[var(--color-slate-muted)]">
                          {t('routeIntermediateLabel')}
                        </dt>
                        <dd className="font-medium break-keep text-[var(--color-ink)]">
                          {route.intermediate}
                        </dd>
                      </div>
                    </dl>
                    <p className="mt-4 text-sm leading-relaxed break-keep text-[var(--color-ink)]/85">
                      {route.text}
                    </p>
                  </li>
                );
              })}
            </ol>

            {/* 같은 상자 안에서 글 다음에 그림이 온다는 것을 선 하나로 알린다 */}
            <div className="mt-8 border-t border-[color:var(--color-washed)] pt-8">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <AssetKind>{tCommon('conceptImage')}</AssetKind>
                <p className="text-sm break-keep text-[var(--color-slate-muted)]">
                  {t('routesFigureBridge')}
                </p>
              </div>
              <div className="mt-4">
                <ZoomableImage
                  src="/blugene/technology/four-production-routes.png"
                  alt={t('routesAlt')}
                  width={1191}
                  height={771}
                  sizes="(max-width: 1280px) 92vw, 1160px"
                  openLabel={tCommon('openImage')}
                  closeLabel={tCommon('close')}
                  caption={t('routesCaption')}
                />
              </div>
            </div>
          </div>

          <SourceNote className="mt-6 max-w-3xl">{t('routesNote')}</SourceNote>
        </div>
      </section>

      {/* 탄소 경로 — 2026-09-11 고객 제공 HTML(탄소의 여정 · 출처가 중요한 이유 · 근거 · FAQ)을
          이 사이트의 디자인으로 옮긴 단락. 카탈로그 p.2 Figure 1-2 개념도(「카탈로그의 개념도」)는 2026-09-12 고객 요청으로 뺐다. */}
      <CarbonJourney />

      {/*
        4단계 생산 경로 개념도(ProductionPathway)는 홈의 ScienceSection 이 이미 보여 주고
        "기술 자세히 보기 →" 로 이 페이지를 가리킨다. 같은 도표를 여기서 다시 그리면
        더 자세한 내용을 기대하고 넘어온 독자가 방금 본 화면을 되풀이해 읽게 되므로 두지 않는다.
      */}

      {/* 「왜 아닐린을 확인하는가」 단락(본문 + 골격 구조식)은 2026-09-28 고객 요청으로 데이터 · 인증 페이지의
          「아닐린 · N-메틸아닐린 분석」 표 아래(EvidenceTables → AnilineEvidenceTable)로 옮겼다. */}
    </>
  );
}
