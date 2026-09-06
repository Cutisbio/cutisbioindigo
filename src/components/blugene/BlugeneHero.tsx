import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

/**
 * Hero — 처음 만나는 Blugene.
 *
 * 왼쪽: 사용자 지정 카피(상단 설명 / H1 / 본문)와 두 개의 CTA.
 * 오른쪽: 카탈로그 p.1 의 데님을 입은 보호자와 아이, 자연 풍경 이미지.
 *
 * - 본문은 모션 없이도 그대로 읽힌다 (스크롤 애니메이션에 가시성을 의존하지 않는다).
 * - Hero 이미지는 지연 로딩하지 않고 width/height 와 sizes 를 지정한다.
 * - 사람을 잘라내지 않도록 이미지 전체를 보여 준다. 사람 얼굴 위에 문구를 올리지 않는다.
 */
export default async function BlugeneHero() {
  const t = await getTranslations('Hero');
  const tCommon = await getTranslations('Common');

  return (
    <section className="relative w-full border-b border-[color:var(--color-washed)] bg-[var(--color-ivory)]">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-stretch lg:grid-cols-[minmax(0,46%)_1fr]">
        {/* 왼쪽: 카피 */}
        <div className="flex flex-col justify-center px-5 py-12 sm:px-8 sm:py-16 lg:py-24 lg:pr-12 lg:pl-[max(2rem,calc((100vw-1280px)/2))]">
          <div className="max-w-xl">
            <p className="text-base font-medium break-keep text-[var(--color-denim)] sm:text-lg">
              {t('descriptor')}
            </p>

            <h1 className="mt-5 text-[2.4rem] leading-[1.14] font-bold tracking-[-0.03em] break-keep text-[var(--color-indigo-deep)] sm:text-[3.25rem] lg:text-[4rem]">
              <span className="block">{t('titleLine1')}</span>
              <span className="block">{t('titleLine2')}</span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-[1.9] break-keep text-[var(--color-ink)]/85 sm:text-lg">
              {t('body')}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-[var(--color-indigo-deep)] px-7 py-4 text-base font-semibold break-keep text-white transition-colors hover:bg-[var(--color-denim)]"
              >
                {t('ctaPrimary')}
              </Link>
              <Link
                href="/data-certifications"
                className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-indigo-deep)] px-7 py-4 text-base font-semibold break-keep text-[var(--color-indigo-deep)] transition-colors hover:bg-[var(--color-indigo-deep)] hover:text-white"
              >
                {t('ctaSecondary')}
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <span aria-hidden="true" className="h-px w-10 bg-[var(--color-indigo-deep)]/40" />
              <p className="blugene-tagline text-[0.72rem] text-[var(--color-indigo-deep)]/75 sm:text-[0.8rem]">
                {t('tagline')}
              </p>
            </div>
          </div>
        </div>

        {/* 오른쪽: 카탈로그 p.1 이미지 */}
        <div className="relative min-h-[280px] sm:min-h-[380px] lg:min-h-[640px]">
          <Image
            src="/blugene/brand/hero-family-denim.webp"
            alt={t('imageAlt')}
            fill
            preload
            fetchPriority="high"
            sizes="(max-width: 1024px) 100vw, 54vw"
            className="object-cover object-[62%_center] lg:object-center"
          />
          {/* 이미지 성격 표기 — 밝은 하늘 위에서도 읽히도록 어두운 배경 위에 올린다 */}
          <p className="absolute right-3 bottom-3 max-w-[90%] rounded bg-[var(--color-indigo-deep)]/80 px-2.5 py-1.5 text-right text-[0.7rem] leading-snug break-keep text-white">
            {tCommon('brandImage')} · {t('imageCredit')}
          </p>
        </div>
      </div>
    </section>
  );
}
