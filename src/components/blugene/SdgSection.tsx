import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
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
 * 아이콘은 유엔 공식 파일이다 — un.org/sustainabledevelopment/news/communications-material 의 「17 SDG Icons (WEB)」 팩에서
 * 2026-09-29 내려받은 원본(1500×1500 PNG)을 public/sdg/ 에 파일명 그대로 두고 자르거나 색을 바꾸지 않는다.
 * 유엔은 6개 공용어 판만 제공하므로 영어(E) · 프랑스어(F) · 중국어(C) 는 해당 언어판, 한국어 · 일본어 · 이탈리아어 · 터키어는 영어판을 쓴다.
 *
 * 유엔 사용 지침(같은 페이지 · SDG Guidelines 2023-09) 가운데 이 화면이 지키는 것:
 *  - 유엔 엠블럼이 든 로고는 유엔 기관 전용 — 쓰지 않는다. 아이콘은 지지 · 활동을 알리는 정보성 용도로만 쓴다.
 *  - 유엔 SDG 사이트 링크(https://www.un.org/sustainabledevelopment)와 고지문(「이 페이지의 내용은 유엔의 승인을 받지 않았으며…」)을 함께 싣는다.
 *  - 아이콘을 올린 페이지에는 지침이 같이 있어야 한다 — 유엔 원본 PDF 링크로 둔다.
 *  - 아이콘은 번호 · 이름 · 그림을 갖춘 전체로, 정사각 비율로만 쓴다. 자르기 · 둥근 모서리 · 그림자 · 색 · 서체 변경 · 늘리기 금지.
 *  - 유엔의 보증을 뜻하는 표현, 제품 광고 맥락, 자체 로고와의 결합은 금지 — 각주로 후원 · 인증이 아님을 밝힌다.
 *  - 모금 · 상업 목적은 유엔의 서면 허가가 필요하다(온라인 Permission Request form). docs/blugene-visual-assets.md 8절 참고.
 */

const GOALS = [
  { number: '9', url: 'https://sdgs.un.org/goals/goal9' },
  { number: '12', url: 'https://sdgs.un.org/goals/goal12' },
] as const;

/** 유엔 원본 파일명 그대로(E/F/C = 영어 · 프랑스어 · 중국어판). 경로를 리터럴로 두어 check:blugene 이 존재 여부를 검사한다. */
const ICONS = {
  E: { '9': '/sdg/E-WEB-Goal-09.png', '12': '/sdg/E-WEB-Goal-12.png' },
  F: { '9': '/sdg/F-WEB-Goal-09.png', '12': '/sdg/F-WEB-Goal-12.png' },
  C: { '9': '/sdg/C-WEB-Goal-09.png', '12': '/sdg/C-WEB-Goal-12.png' },
} as const;

const ICON_LANG: Record<string, keyof typeof ICONS> = { en: 'E', fr: 'F', zh: 'C' };

const UN_SDG_SITE = 'https://www.un.org/sustainabledevelopment';
/** 지침은 아이콘을 올린 페이지에 같이 있어야 한다 — 유엔 원본 PDF(2023-09 판)로 연결한다. */
const UN_SDG_GUIDELINES =
  'https://www.un.org/sustainabledevelopment/wp-content/uploads/2023/09/E_SDG_Guidelines_Sep20238.pdf';

type Item = { number: string; name: string; target: string; body: string };

export default async function SdgSection() {
  const t = await getTranslations('Sdg');
  const tNav = await getTranslations('Nav');
  const locale = await getLocale();
  const icons = ICONS[ICON_LANG[locale] ?? 'E'];
  const items = t.raw('items') as Item[];

  const linkClass = 'underline underline-offset-2 hover:text-[var(--color-indigo-deep)]';

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
            const src = icons[goal.number];
            return (
              <li key={item.number} className="grid gap-5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-8">
                {/* 유엔 공식 아이콘 — 자르기 · 둥근 모서리 · 색 변경 없이 원본 비율 그대로 */}
                <Image
                  src={src}
                  alt={t('iconAlt', { number: item.number })}
                  width={176}
                  height={176}
                  className="h-36 w-36 shrink-0 sm:h-44 sm:w-44"
                />

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
          {/* 유엔이 아이콘 사용 조건으로 요구하는 고지문 + 유엔 SDG 사이트 링크 */}
          <SourceNote>{t('unDisclaimer')}</SourceNote>
          <SourceNote as="ul" className="flex flex-wrap gap-x-5 gap-y-1">
            <li>
              <a href={UN_SDG_SITE} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {t('unSiteLabel')}
              </a>
              <span className="sr-only"> ({t('externalHint')})</span>
            </li>
            <li>
              <a href={UN_SDG_GUIDELINES} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {t('guidelinesLabel')}
              </a>
              <span className="sr-only"> ({t('externalHint')})</span>
            </li>
            {GOALS.map((goal) => (
              <li key={goal.number}>
                <a href={goal.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {t('unLinkLabel')} — SDG {goal.number}
                </a>
                <span className="sr-only"> ({t('externalHint')})</span>
              </li>
            ))}
            <li>
              <Link href="/data-certifications" className={linkClass}>
                {tNav('dataCertifications')}
              </Link>
            </li>
          </SourceNote>
        </div>
      </div>
    </section>
  );
}
