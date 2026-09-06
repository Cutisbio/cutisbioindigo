import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { anilineTest, carbonTest } from '@/data/blugene/evidence';

/**
 * Hero 바로 아래의 증거 스트립.
 *
 * 98% 의 분모(바이오 기반 탄소 함량)와 불검출의 의미(방법 검출한계 5 mg/kg)를
 * 숨긴 각주가 아니라 스트립 바로 아래 본문에서 밝힌다.
 */
export default async function EvidenceStrip() {
  const t = await getTranslations('EvidenceStrip');

  const items = [
    { value: t('carbonValue'), label: t('carbonLabel'), page: carbonTest.page, table: carbonTest.table },
    { value: t('anilineValue'), label: t('anilineLabel'), page: anilineTest.page, table: anilineTest.table },
    {
      value: t('nMethylanilineValue'),
      label: t('nMethylanilineLabel'),
      page: anilineTest.page,
      table: anilineTest.table,
    },
  ];

  return (
    <section
      aria-label={t('carbonLabel')}
      className="w-full border-b border-[color:var(--color-washed)] bg-white"
    >
      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-baseline gap-4 border-[color:var(--color-washed)] sm:block sm:border-l sm:pl-6 sm:first:border-l-0 sm:first:pl-0"
            >
              <dd className="order-1 text-3xl leading-none font-bold tracking-[-0.02em] text-[var(--color-indigo-deep)] sm:text-[2.75rem]">
                {item.value}
              </dd>
              <dt className="order-2 text-sm font-medium break-keep text-[var(--color-slate-muted)] sm:mt-3 sm:text-base">
                {item.label}
              </dt>
            </div>
          ))}
        </dl>

        <div className="mt-7 border-t border-[color:var(--color-washed)] pt-5">
          <p className="max-w-4xl text-[0.8125rem] leading-relaxed break-keep text-[var(--color-slate-muted)]">
            {t('note')}
          </p>
          <ul className="mt-3 space-y-1 text-[0.75rem] text-[var(--color-slate-muted)]">
            <li>{t('sourceCarbon')}</li>
            <li>{t('sourceAniline')}</li>
          </ul>
          <Link
            href="/data-certifications"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-denim)] underline underline-offset-4 hover:text-[var(--color-indigo-deep)]"
          >
            {t('cta')}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
