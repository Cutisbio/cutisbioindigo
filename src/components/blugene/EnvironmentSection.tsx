import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import SectionHeading from '@/components/blugene/SectionHeading';
import SourceNote from '@/components/blugene/SourceNote';
import CarbonEvidencePanel from '@/components/blugene/CarbonEvidencePanel';
import { carbonTest } from '@/data/blugene/evidence';

/**
 * 환경 섹션 — "입는 사람을 생각하며. 만드는 과정도 생각하며."
 *
 * 확인된 수치(바이오 기반 탄소 함량 98%)만 정량 표시하고,
 * 제공 자료에 없는 물·에너지·배출 절감 수치는 쓰지 않는다는 사실을 화면에 밝힌다.
 * 섹션 아래의 카탈로그 p.12 가치사슬 '개념 이미지'(value-chain.webp)는 2026-10-07 고객 요청으로 /technology 의 98% 패널
 * (CarbonEvidencePanel)로 바꿨다. 이미지 파일은 남긴다. 패널 제목은 h3, 아래 두 단은 보이지 않는다.
 */
export default async function EnvironmentSection() {
  const t = await getTranslations('Environment');

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

        {/* 98% 패널 — 2026-10-07 고객 요청으로 p.12 개념 이미지 자리에 둔다. 숫자 · 시험 메타는 evidence.ts 하나에서 온다 */}
        <div className="mt-14">
          <CarbonEvidencePanel headingAs="h3" showSplit={false} />
        </div>
      </div>
    </section>
  );
}
