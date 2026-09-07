import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import SectionHeading from '@/components/blugene/SectionHeading';
import ProductionPathway from '@/components/blugene/ProductionPathway';

/**
 * 홈의 기술 섹션 — "인디고의 DNA를, 새롭게 쓰다."
 * 카탈로그 p.2(네 가지 경로)와 p.12(가치사슬)의 내용을 홈에서는 4단계 개념도로 요약하고,
 * 자세한 경로 설명은 /technology 로 넘긴다.
 */
export default async function ScienceSection() {
  const t = await getTranslations('Science');

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} body={t('body')} size="hero" />

        <div className="mt-14">
          <ProductionPathway variant="bare" />
        </div>

        <Link
          href="/technology"
          className="mt-12 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-denim)] underline underline-offset-4 hover:text-[var(--color-indigo-deep)]"
        >
          {t('cta')}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
