import { getTranslations } from 'next-intl/server';
import { HEADING_SIZE, keepLastWords } from '@/components/blugene/SectionHeading';
import SourceNote from '@/components/blugene/SourceNote';
import { HAZARD_SOURCE_LINKS } from '@/components/blugene/AnilineHazardInfographic';

/**
 * 규제기관의 분류 — 아닐린 · N-메틸아닐린의 EU CLP 조화 분류 유해성 문구와 IARC 평가를 큰 상자 하나로 보여 준다.
 *
 * 원래 AnilineHazardInfographic 안의 작은 패널이었다. 2026-09-29 고객 요청으로 독립된 상자로 빼서
 * 데이터 · 인증 페이지(인포그래픽 아래)와 홈 「보이지 않는 것까지, 우리의 기준입니다」 단락에 같은 상자를 둔다.
 * 문구는 AnilineHazard.classification.* 를 그대로 쓰고, 링크 주소는 인포그래픽의 HAZARD_SOURCE_LINKS 를 같이 쓴다.
 *
 * 근거: EU CLP 규정(EC 1272/2008) 부속서 VI 조화 분류(PubChem GHS 항목이 ECHA 를 인용) · IARC Monographs 제127권.
 * 이 상자는 두 물질이 "무엇으로 분류되는가"만 말한다. 제품의 안전성을 단정하지 않으며, 시험 결과는 아래 표가 말한다.
 */

/** 두 물질의 고유 표기 — AnilineStructures 와 같은 값. 화학식 · CAS 는 번역하지 않는다. */
const SUBSTANCES = [
  { key: 'aniline', formula: 'C₆H₅NH₂', cas: '62-53-3' },
  { key: 'nMethylaniline', formula: 'C₆H₅NHCH₃', cas: '100-61-8' },
] as const;

const LINKS = [
  { id: 'clpAniline', labelKey: 'classification.linkClpAniline' },
  { id: 'clpNMethylaniline', labelKey: 'classification.linkClpNMethylaniline' },
  { id: 'iarc2021', labelKey: 'classification.linkIarc' },
] as const;

type Group = { name: string; items: string[] };

export default async function AnilineClassification({ className = '' }: { className?: string }) {
  const t = await getTranslations('AnilineHazard');
  const groups = SUBSTANCES.map((s) => ({ ...s, ...(t.raw(`classification.${s.key}`) as Group) }));

  return (
    <section
      aria-labelledby="aniline-classification-title"
      className={`rounded-md border border-[color:var(--color-washed)] border-l-[4px] border-l-[color:var(--color-indigo-deep)] bg-white p-6 sm:p-8 lg:p-10 ${className}`}
    >
      <p className="text-xs font-semibold tracking-[0.18em] text-[var(--color-denim)] uppercase">
        {t('classification.eyebrow')}
      </p>
      <h3
        id="aniline-classification-title"
        className={`${HEADING_SIZE.md} mt-2 leading-[1.25] font-bold tracking-[-0.02em] break-keep text-[var(--color-indigo-deep)]`}
      >
        {keepLastWords(t('classification.title'))}
      </h3>
      <p className="mt-3 max-w-3xl text-base leading-[1.85] break-keep text-[var(--color-ink)]/85">
        {t('classification.intro')}
      </p>

      <div className="mt-8 grid gap-5 lg:grid-cols-2 lg:gap-6">
        {groups.map((group) => (
          <div key={group.key} className="rounded-md bg-[var(--color-ivory)] p-5 sm:p-6">
            <p className="text-xl font-bold tracking-[-0.01em] break-keep text-[var(--color-indigo-deep)] sm:text-2xl">
              {group.name}
            </p>
            <p className="mt-1 font-mono text-sm text-[var(--color-slate-muted)]">
              {group.formula} · CAS {group.cas}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-[color:var(--color-washed)] bg-white px-3.5 py-1.5 text-sm leading-snug break-keep text-[var(--color-ink)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <SourceNote className="mt-6 max-w-4xl">{t('classification.note')}</SourceNote>
      <SourceNote as="ul" className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
        {LINKS.map((link) => (
          <li key={link.id}>
            <a
              href={HAZARD_SOURCE_LINKS[link.id]}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-[var(--color-indigo-deep)]"
            >
              {t(link.labelKey)}
            </a>
            <span className="sr-only"> ({t('paper.externalHint')})</span>
          </li>
        ))}
      </SourceNote>
    </section>
  );
}
