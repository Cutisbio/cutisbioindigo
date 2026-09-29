import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import SectionHeading from '@/components/blugene/SectionHeading';
import SourceNote from '@/components/blugene/SourceNote';

/**
 * 유엔 지속가능발전목표(SDGs) 가운데 우리 사업과 닿는 두 목표 — SDG 9(산업 · 혁신 · 기반시설), SDG 12(책임 있는 소비와 생산).
 *
 * 2026-09-29 고객 요청: 필리(Pili)의 SDG 블록 구성을 참고하되 문구는 큐티스바이오의 확인된 사실로 바꿔 브랜드 페이지
 * 「우리가 약속하는 것」 아래에 둔다. 세부목표(9.4 · 12.4) 문구는 유엔 원문(영어 · 프랑스어 · 중국어는 유엔 공식 번역, 나머지는 번역)이고,
 * 회사 서술은 시험값(바이오 기반 탄소 98% · 아닐린 불검출)과 보유 인증(ZDHC MRSL Level 1 · OEKO-TEX ECO PASSPORT)만 말한다.
 * 에너지 · 물 · 배출 절감 같은 수치는 자료가 없어 쓰지 않는다(docs/blugene-claims.md B).
 *
 * 색 타일은 유엔 SDG 공식 색(9번 주황 #FD6925 · 12번 황토 #BF8B2E)의 장식이며 공식 아이콘 도안(정육면체 · 무한 고리)은 쓰지 않는다.
 * 타일은 aria-hidden 이고 정보는 카드 제목이 담는다. 유엔의 후원 · 인증을 뜻하지 않음을 각주로 밝힌다.
 */

const GOALS = [
  { number: '9', color: '#FD6925', url: 'https://sdgs.un.org/goals/goal9' },
  { number: '12', color: '#BF8B2E', url: 'https://sdgs.un.org/goals/goal12' },
] as const;

type Item = { number: string; name: string; target: string; body: string };

export default async function SdgSection() {
  const t = await getTranslations('Sdg');
  const tNav = await getTranslations('Nav');
  const items = t.raw('items') as Item[];

  return (
    <section
      aria-labelledby="sdg-heading"
      className="w-full border-t border-[color:var(--color-washed)] bg-[var(--color-ivory)]"
    >
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <SectionHeading
          eyebrow={t('eyebrow')}
          title={<span id="sdg-heading">{t('title')}</span>}
          body={t('body')}
        />

        <ol className="mt-12 space-y-6">
          {items.map((item, index) => {
            const goal = GOALS[index] ?? GOALS[GOALS.length - 1];
            return (
              <li key={item.number} className="grid gap-5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-8">
                <div
                  aria-hidden="true"
                  className="flex h-36 w-36 flex-col justify-between rounded-md p-3 text-white"
                  style={{ backgroundColor: goal.color }}
                >
                  <span className="text-4xl leading-none font-bold">{item.number}</span>
                  <span className="text-[0.72rem] leading-snug font-bold tracking-wide break-keep uppercase">
                    {item.name}
                  </span>
                </div>

                <article className="rounded-md border border-[color:var(--color-washed)] bg-white p-6 sm:p-8">
                  <h3 className="text-xl font-bold tracking-[-0.01em] break-keep text-[var(--color-indigo-deep)] sm:text-2xl">
                    SDG {item.number} · {item.name}
                  </h3>
                  <p className="mt-3 text-[0.95rem] leading-[1.85] break-keep text-[var(--color-slate-muted)] italic">
                    {item.target}
                  </p>
                  <p className="mt-4 text-base leading-[1.9] break-keep text-[var(--color-ink)]/85">{item.body}</p>
                </article>
              </li>
            );
          })}
        </ol>

        <div className="mt-8 max-w-4xl space-y-2">
          <SourceNote>{t('note')}</SourceNote>
          <SourceNote as="ul" className="flex flex-wrap gap-x-5 gap-y-1">
            {GOALS.map((goal) => (
              <li key={goal.number}>
                <a
                  href={goal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-[var(--color-indigo-deep)]"
                >
                  {t('unLinkLabel')} — SDG {goal.number}
                </a>
                <span className="sr-only"> ({t('externalHint')})</span>
              </li>
            ))}
            <li>
              <Link
                href="/data-certifications"
                className="underline underline-offset-2 hover:text-[var(--color-indigo-deep)]"
              >
                {tNav('dataCertifications')}
              </Link>
            </li>
          </SourceNote>
        </div>
      </div>
    </section>
  );
}
