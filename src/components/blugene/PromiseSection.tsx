import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import SectionHeading from '@/components/blugene/SectionHeading';

/**
 * 「우리가 약속하는 것」 — 세 약속과 데이터 · 인증 링크, 문의 버튼.
 *
 * 원래 /brand 의 마지막 단락이었다. 2026-09-29 고객 요청으로 홈 상단(히어로 바로 아래)의 증거 스트립
 * (98% · 불검출 · 불검출 숫자 줄, EvidenceStrip)을 이 블록으로 바꾸면서, 두 페이지가 같이 쓰는 컴포넌트로 뺐다.
 * 문구는 Brand.promiseTitle · promiseBody · promiseItems · cta 와 Nav.dataCertifications 를 그대로 쓴다.
 *
 * 세 번째 약속이 "사이트에서 직접 확인할 수 있습니다"라고 말하므로, 그 '어디서'를 바로 아래 링크가 답한다.
 * 숫자(98% · 불검출)의 근거와 읽는 조건은 이제 홈의 불순물 · 환경 섹션과 데이터 · 인증 페이지가 맡는다.
 */
export default async function PromiseSection() {
  const t = await getTranslations('Brand');
  const tNav = await getTranslations('Nav');
  const promises = t.raw('promiseItems') as { title: string; text: string }[];

  return (
    <section aria-labelledby="promise-heading" className="w-full bg-white">
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <SectionHeading
          title={<span id="promise-heading">{t('promiseTitle')}</span>}
          body={t('promiseBody')}
          size="hero"
        />

        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {promises.map((item, i) => (
            <li key={item.title} className="border-t-2 border-[var(--color-denim)] pt-5">
              <span className="text-sm font-semibold text-[var(--color-denim)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 text-lg font-semibold break-keep text-[var(--color-indigo-deep)]">
                {item.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed break-keep text-[var(--color-ink)]/85">
                {item.text}
              </p>
            </li>
          ))}
        </ol>

        <Link
          href="/data-certifications"
          className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-denim)] underline underline-offset-4 hover:text-[var(--color-indigo-deep)]"
        >
          {tNav('dataCertifications')}
          <span aria-hidden="true">→</span>
        </Link>

        {/* 바로 위 링크가 inline-flex 라, 블록으로 감싸지 않으면 문의 버튼이 같은 줄에 붙는다 */}
        <div className="mt-12">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md bg-[var(--color-indigo-deep)] px-7 py-4 text-base font-semibold break-keep text-white transition-colors hover:bg-[var(--color-denim)]"
          >
            {t('cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
