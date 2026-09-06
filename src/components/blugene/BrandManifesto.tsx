import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import ThreadMotif from '@/components/blugene/ThreadMotif';

/**
 * 브랜드 선언 — 국경과 세대를 잇는 옷.
 *
 * 사람 사진 위에 문구를 올리지 않고, 깊은 인디고 면과 여백으로 문장을 세운다.
 * 장식은 데님 실 두 가닥을 연상시키는 추상 선(ThreadMotif)으로 제한한다.
 * 화학구조도나 인증마크처럼 보이는 요소를 쓰지 않는다.
 */
export default async function BrandManifesto() {
  const t = await getTranslations('Manifesto');
  const questions = t.raw('questions') as string[];

  return (
    <section className="on-indigo relative overflow-hidden bg-[var(--color-indigo-deep)] text-white">
      <ThreadMotif className="pointer-events-none absolute right-[-6%] bottom-0 h-full w-[62%] opacity-70 sm:right-0 sm:w-[52%]" />

      <div className="relative mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-16">
          <div className="max-w-3xl">
            <p className="blugene-tagline text-[0.68rem] text-white/55 sm:text-[0.75rem]">
              {t('eyebrow')}
            </p>
            <h2 className="mt-6 text-[2rem] leading-[1.22] font-bold tracking-[-0.025em] break-keep sm:text-[2.9rem] lg:text-[3.5rem]">
              {t('title')}
            </h2>

            <p className="mt-8 max-w-2xl text-base leading-[1.95] break-keep text-white/85 sm:text-lg">
              {t('body')}
            </p>

            <ul className="mt-9 flex flex-wrap gap-x-3 gap-y-3">
              {questions.map((q) => (
                <li
                  key={q}
                  className="rounded-full border border-white/25 px-4 py-2 text-sm font-medium break-keep text-white/85"
                >
                  {q}
                </li>
              ))}
            </ul>

            <Link
              href="/brand"
              className="mt-10 inline-flex items-center gap-2 border-b border-white/45 pb-1 text-sm font-semibold text-white hover:border-white"
            >
              {t('cta')}
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* 오른쪽 세로 캡션 — 데스크톱에서만 표시한다 */}
          <p className="blugene-tagline hidden max-w-[9rem] text-right text-[0.68rem] leading-[2.1] text-white/60 lg:block">
            A cleaner blue
            <br />
            for a brighter
            <br />
            tomorrow.
            <span aria-hidden="true" className="mt-4 ml-auto block h-px w-10 bg-white/35" />
          </p>
        </div>
      </div>
    </section>
  );
}
