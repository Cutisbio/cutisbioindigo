import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import SectionHeading from '@/components/blugene/SectionHeading';
import SourceNote, { AssetKind } from '@/components/blugene/SourceNote';
import { carbonTest } from '@/data/blugene/evidence';

/**
 * 환경 섹션 — "입는 사람을 생각하며. 만드는 과정도 생각하며."
 *
 * 확인된 수치(바이오 기반 탄소 함량 98%)만 정량 표시하고,
 * 제공 자료에 없는 물·에너지·배출 절감 수치는 쓰지 않는다는 사실을 화면에 밝힌다.
 * p.12 이미지는 실제 공장·직원 사진이 아니라 가치사슬 '개념 이미지'로 다룬다.
 */
export default async function EnvironmentSection() {
  const t = await getTranslations('Environment');
  const tCommon = await getTranslations('Common');

  return (
    <section className="w-full bg-[var(--color-ivory)]">
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionHeading eyebrow={t('eyebrow')} title={t('title')} body={t('body')} size="hero" />

          <div className="lg:pt-6">
            <div className="border-l-2 border-[var(--color-denim)] pl-6">
              <p className="text-4xl leading-none font-bold tracking-[-0.02em] text-[var(--color-indigo-deep)] sm:text-5xl">
                {carbonTest.biobasedCarbonPercent}%
              </p>
              <h3 className="mt-4 text-lg font-semibold break-keep text-[var(--color-indigo-deep)]">
                {t('carbonCardTitle')}
              </h3>
              <p className="mt-3 text-base leading-relaxed break-keep text-[var(--color-ink)]/85">
                {t('carbonCardText')}
              </p>
            </div>

            <SourceNote className="mt-8">{t('scopeNote')}</SourceNote>

            <Link
              href="/data-certifications"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-denim)] underline underline-offset-4 hover:text-[var(--color-indigo-deep)]"
            >
              {t('cta')}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <figure className="mt-14">
          <div className="relative aspect-[784/258] w-full overflow-hidden rounded-md border border-[color:var(--color-washed)] bg-white">
            <Image
              src="/blugene/brand/value-chain.webp"
              alt={t('imageAlt')}
              fill
              sizes="(max-width: 1280px) 100vw, 1216px"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <AssetKind>{tCommon('conceptImage')}</AssetKind>
            <SourceNote className="flex-1">
              {tCommon('imageNoteConcept')} {tCommon('cataloguePage', { page: 12 })}
            </SourceNote>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
