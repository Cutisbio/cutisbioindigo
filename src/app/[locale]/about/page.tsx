import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import SchemaOrg, { buildOrganizationSchema } from '@/components/seo/SchemaOrg';
import SectionHeading from '@/components/blugene/SectionHeading';
import ZoomableImage from '@/components/blugene/ZoomableImage';
import { AssetKind } from '@/components/blugene/SourceNote';
import { BRAND, CORPORATE_SITE_URL, LOCALES, SITE_URL, buildPageMetadata } from '@/data/blugene/site';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/**
 * 「핵심 사업 영역」의 Blugene 사진 세 장 — 2026-10-03 고객이 채팅으로 보낸 촬영 사진(파일명 2~4) 순서 그대로.
 * 파일 1(옷걸이에 건 농도별 셔츠)은 2026-10-04 고객 요청으로 뺐고 파일도 지웠다.
 * public/blugene/about/ 에 원본 JPEG 를 크기 · 색 무변환으로 두고 EXIF/XMP 만 제거했다(출처는 asset-manifest.json).
 * 세로 사진 하나(전시 부스)와 가로 사진 둘(스카프)을 세로로 쌓아 두 열의 높이를 맞춘다(3:4 ≈ 3:2 + 3:2).
 * alt · 캡션은 About.gallery 와 같은 순서다.
 */
const GALLERY = [
  { src: '/blugene/about/booth-coex-2024.jpg', width: 1500, height: 2000 },
  { src: '/blugene/about/scarves-gradient.jpg', width: 1382, height: 922 },
  { src: '/blugene/about/scarves-roses.jpg', width: 1382, height: 922 },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'About' });
  return buildPageMetadata({
    locale,
    path: '/about',
    // 제목에 줄바꿈 묶음 태그(<keep>)가 있어 메타 제목은 태그를 뺀 문자열로 만든다.
    title: t.markup('title', { keep: (chunks) => chunks }),
    // missionText 는 회사의 고정 영문 문구이므로 설명문은 언어별로 번역된 별도 키를 쓴다
    description: t('metaDescription'),
  });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'About' });
  const tCommon = await getTranslations({ locale, namespace: 'Common' });
  const history = t.raw('historyList') as { year: string; event: string }[];
  const galleryText = t.raw('gallery') as { alt: string; caption: string }[];
  const photo = (i: number) => (
    <ZoomableImage
      key={GALLERY[i].src}
      src={GALLERY[i].src}
      alt={galleryText[i].alt}
      caption={galleryText[i].caption}
      width={GALLERY[i].width}
      height={GALLERY[i].height}
      openLabel={tCommon('openImage')}
      closeLabel={tCommon('close')}
      hint={t('galleryNote')}
      sizes="(max-width: 640px) 92vw, 440px"
      originalOnZoom
    />
  );
  const orgSchema = buildOrganizationSchema(BRAND.company, SITE_URL, `${SITE_URL}/brand/cutisbio-logo.png`);

  const areas = [
    { title: t('healthTitle'), text: t('healthText'), highlight: false },
    { title: t('beautyTitle'), text: t('beautyText'), highlight: false },
    { title: t('fashionTitle'), text: t('fashionText'), highlight: true },
  ];

  return (
    <>
      <SchemaOrg schema={orgSchema} />

      <section className="w-full border-b border-[color:var(--color-washed)] bg-[var(--color-ivory)]">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          {/* 원본 로고 SVG. 가로세로비 296.05:62.35 ≈ 4.7482:1 을 그대로 지킨다 */}
          <Image
            src="/brand/cutisbio-logo.svg"
            alt={BRAND.companyLegal}
            width={247}
            height={52}
            unoptimized
            preload
            className="mb-10 h-auto w-[200px] sm:w-[247px]"
          />
          {/*
            아래 비전 문단에는 'OUR VISION' 라벨이 있다. 미션에도 같은 라벨을 붙여야
            영문 문장이 한국어 제목의 부제가 아니라 회사의 고정 미션 문구로 읽힌다.
          */}
          {/* 2026-09-12 제목이 길어져(…더 건강하게 더 아름답게…) 기본 폭에서는 세 줄로 갈라지며 '더'가 줄 끝에 걸린다.
              제목 상자를 넓히고, 문구의 <keep> 구간('더 아름답게 디자인하다')은 md 이상에서 한 줄에 둔다(브랜드 히어로와 같은 방식). */}
          <SectionHeading
            headingLevel="h1"
            eyebrow={t('missionTitle')}
            title={t.rich('title', {
              keep: (chunks) => <span className="md:whitespace-nowrap">{chunks}</span>,
            })}
            body={t('missionText')}
            size="hero"
            titleWidth="wide"
          />
        </div>
      </section>

      <section className="on-indigo w-full bg-[var(--color-indigo-deep)] text-white">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.22em] text-white/55 uppercase">
            {t('visionTitle')}
          </p>
          {/* 2026-10-03 고객 요청: 둘째 문장(Blugene 바이오 인디고 염료는 … 바이오소재입니다)은
              아래 「핵심 사업 영역」의 Blugene 사진 앞 도입문(coreBusinessLead)으로 옮겼다. */}
          <p className="mt-6 max-w-4xl text-xl leading-[1.7] break-keep sm:text-2xl lg:text-[2rem]">
            {t('visionText')}
          </p>
        </div>
      </section>

      <section className="w-full bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <SectionHeading title={t('coreBusinessTitle')} size="lg" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {areas.map((area) => (
              <article
                key={area.title}
                className={`rounded-md border p-7 ${
                  area.highlight
                    ? 'border-[var(--color-indigo-deep)] bg-[var(--color-ivory)]'
                    : 'border-[color:var(--color-washed)] bg-white'
                }`}
              >
                <h3 className="text-lg font-semibold break-keep text-[var(--color-indigo-deep)]">
                  {area.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed break-keep text-[var(--color-ink)]/85">
                  {area.text}
                </p>
              </article>
            ))}
          </div>

          {/* Blugene 도입문과 사진 세 장 — 2026-10-03 고객 요청. 문장은 「Our Vision」에서 옮겨 온 것이고,
              사진은 고객이 같은 날 보낸 촬영본(전시 부스 · 스카프 두 장)이다. 옷걸이 셔츠 사진은 2026-10-04 고객 요청으로 뺐다.
              확대 창은 원본 파일을 그대로 연다(originalOnZoom). 사람이 찍힌 부스 사진 위에는 어떤 문구도 올리지 않는다. */}
          <div className="mt-14 border-t border-[color:var(--color-washed)] pt-12 sm:mt-16 sm:pt-14">
            <p className="max-w-4xl text-xl leading-[1.7] break-keep text-[var(--color-indigo-deep)] sm:text-2xl">
              {t('coreBusinessLead')}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <AssetKind>{tCommon('brandImage')}</AssetKind>
            </div>
            <div className="mt-3 grid max-w-4xl gap-4 sm:grid-cols-2">
              {photo(0)}
              <div className="grid content-start gap-4">
                {photo(1)}
                {photo(2)}
              </div>
            </div>
          </div>

          <div className="mt-14 max-w-3xl rounded-md border border-[color:var(--color-washed)] bg-[var(--color-ivory)] p-7">
            <h3 className="text-lg font-semibold break-keep text-[var(--color-indigo-deep)]">
              {t('blugeneNoteTitle')}
            </h3>
            {/* 2026-09-12 고객 요청: 설명문과 '브랜드 →' 링크 대신 회사 공식 홈페이지 바로가기 버튼. 외부 사이트라 새 창으로 열고,
                보조기기에는 '새 창에서 열림'을 읽어 준다. 주소는 site.ts 의 CORPORATE_SITE_URL. */}
            <div className="mt-5">
              <a
                href={CORPORATE_SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-[var(--color-indigo-deep)] px-6 py-3.5 text-sm font-semibold break-keep text-white transition-colors hover:bg-[var(--color-denim)] sm:text-base"
              >
                {t('corporateSiteCta')}
                <span aria-hidden="true">↗</span>
                <span className="sr-only"> ({t('corporateSiteNewTab')})</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-[var(--color-ivory)]">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <SectionHeading title={t('historyTitle')} size="lg" />
          <ol className="mt-10 border-l-2 border-[color:var(--color-washed)] pl-6 sm:pl-8">
            {history.map((item) => (
              <li key={item.year} className="relative pb-8 last:pb-0">
                <span
                  aria-hidden="true"
                  className="absolute -left-[1.9rem] mt-1.5 h-3 w-3 rounded-full bg-[var(--color-denim)] ring-4 ring-[var(--color-ivory)] sm:-left-[2.4rem]"
                />
                <p className="text-lg font-bold text-[var(--color-denim)]">{item.year}</p>
                <p className="mt-2 text-base leading-relaxed break-keep text-[var(--color-ink)]/85">
                  {item.event}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
