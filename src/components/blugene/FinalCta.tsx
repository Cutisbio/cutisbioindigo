import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import ThreadMotif from '@/components/blugene/ThreadMotif';
import { HEADING_SIZE, keepLastWords } from '@/components/blugene/SectionHeading';
import { contact } from '@/data/blugene/evidence';

/**
 * 마지막 CTA — "다음 데님의 파랑을, 함께 만드세요."
 * 문의 화면으로 연결하고, 이메일 주소도 함께 노출한다.
 */
export default async function FinalCta() {
  const t = await getTranslations('Home');
  const tHero = await getTranslations('Hero');

  return (
    <section className="on-indigo relative overflow-hidden bg-[var(--color-indigo-deep)] text-white">
      <ThreadMotif className="pointer-events-none absolute inset-y-0 right-0 w-[55%] opacity-50" />
      <div className="relative mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          {/* BrandManifesto 와 같은 위계의 섹션 최상위 제목이라 같은 hero 단을 쓴다. */}
          <h2 className={`${HEADING_SIZE.hero} leading-[1.2] font-bold tracking-[-0.025em] text-pretty break-keep`}>
            {keepLastWords(t('ctaTitle'))}
          </h2>
          <p className="mt-6 text-base leading-relaxed break-keep text-white/80 sm:text-lg">
            {t('ctaText')}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-white px-7 py-4 text-base font-semibold break-keep text-[var(--color-indigo-deep)] transition-colors hover:bg-[var(--color-washed)]"
            >
              {t('ctaButton')}
            </Link>
            <Link
              href="/data-certifications"
              className="inline-flex items-center justify-center rounded-md border border-white/50 px-7 py-4 text-base font-semibold break-keep text-white transition-colors hover:bg-white/10"
            >
              {tHero('ctaSecondary')}
            </Link>
          </div>
          <p className="mt-8 text-sm text-white/70">
            <a href={`mailto:${contact.email}`} className="underline underline-offset-4 hover:text-white">
              {contact.email}
            </a>
            <span aria-hidden="true" className="mx-3 text-white/30">
              ·
            </span>
            <a href={`tel:${contact.telHref}`} className="hover:underline">
              {contact.tel}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
