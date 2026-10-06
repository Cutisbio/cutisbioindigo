import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import SectionHeading from '@/components/blugene/SectionHeading';
import SourceNote from '@/components/blugene/SourceNote';

/**
 * 유엔 지속가능발전목표(SDGs) 가운데 바이오 인디고의 생산 · 상용화가 닿는 네 목표 —
 * SDG 3(건강과 웰빙 · 3.9 유해 화학물질), SDG 6(깨끗한 물과 위생 · 6.3 유해 화학물질 배출 최소화),
 * SDG 9(산업 · 혁신 · 기반시설 · 9.4 청정 기술), SDG 12(책임 있는 소비와 생산 · 12.4 화학물질 관리).
 *
 * 2026-09-29 고객 요청: 필리(Pili)의 SDG 블록 구성을 참고하되 문구는 큐티스바이오의 확인된 사실로 바꿔 브랜드 페이지
 * 「우리가 약속하는 것」 아래에 둔다(처음 9 · 12, 같은 날 「상용화가 기여하는 다른 항목」 요청으로 3 · 6 추가).
 * 세부목표 문구는 유엔 원문(영어 · 프랑스어 · 중국어는 유엔 공식 번역, 나머지는 번역)이고, 회사 서술은 시험값(바이오 기반 탄소 98% ·
 * 아닐린 · N-메틸아닐린 불검출), 보유 인증(ZDHC MRSL Level 1 · OEKO-TEX ECO PASSPORT), 데이터 · 인증 페이지에 이미 있는
 * 문헌 사실(피부 흡수 · IARC 2A · 폐수 배출 보고)만 말한다. 물 · 에너지 · 온실가스 수치는 자료가 없어 쓰지 않고 SDG 13 도 넣지 않는다
 * (docs/blugene-claims.md B · C).
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
 *    임의로 골라 무리 짓지 않는다 — 목표마다 한 줄씩 왼쪽 정렬로 두고 번호 순서로 놓는다.
 *  - 유엔의 보증을 뜻하는 표현, 제품 광고 맥락, 자체 로고와의 결합은 금지 — 각주로 후원 · 인증이 아님을 밝힌다.
 *  - 모금 · 상업 목적은 유엔의 서면 허가가 필요하다(온라인 Permission Request form). docs/blugene-visual-assets.md 8절 참고.
 */

/** 유엔 원본 파일명 그대로(E/F/C = 영어 · 프랑스어 · 중국어판). 경로를 리터럴로 두어 check:blugene 이 존재 여부를 검사한다. */
const ICONS = {
  E: {
    '3': '/sdg/E-WEB-Goal-03.png',
    '6': '/sdg/E-WEB-Goal-06.png',
    '9': '/sdg/E-WEB-Goal-09.png',
    '12': '/sdg/E-WEB-Goal-12.png',
  },
  F: {
    '3': '/sdg/F-WEB-Goal-03.png',
    '6': '/sdg/F-WEB-Goal-06.png',
    '9': '/sdg/F-WEB-Goal-09.png',
    '12': '/sdg/F-WEB-Goal-12.png',
  },
  C: {
    '3': '/sdg/C-WEB-Goal-03.png',
    '6': '/sdg/C-WEB-Goal-06.png',
    '9': '/sdg/C-WEB-Goal-09.png',
    '12': '/sdg/C-WEB-Goal-12.png',
  },
} as const;

type GoalNumber = keyof typeof ICONS.E;

const GOAL_URLS: Record<GoalNumber, string> = {
  '3': 'https://sdgs.un.org/goals/goal3',
  '6': 'https://sdgs.un.org/goals/goal6',
  '9': 'https://sdgs.un.org/goals/goal9',
  '12': 'https://sdgs.un.org/goals/goal12',
};

const ICON_LANG: Record<string, keyof typeof ICONS> = { en: 'E', fr: 'F', zh: 'C' };

const UN_SDG_SITE = 'https://www.un.org/sustainabledevelopment';
/** 지침은 아이콘을 올린 페이지에 같이 있어야 한다 — 유엔 원본 PDF(2023-09 판)로 연결한다. */
const UN_SDG_GUIDELINES =
  'https://www.un.org/sustainabledevelopment/wp-content/uploads/2023/09/E_SDG_Guidelines_Sep20238.pdf';

const isGoalNumber = (value: string): value is GoalNumber => value in ICONS.E;

type Item = { number: string; name: string; target: string; body: string };

export default async function SdgSection() {
  const t = await getTranslations('Sdg');
  const tNav = await getTranslations('Nav');
  const locale = await getLocale();
  const icons = ICONS[ICON_LANG[locale] ?? 'E'];
  const items = t.raw('items') as Item[];
  const goals = items.filter((item) => isGoalNumber(item.number)).map((item) => item.number as GoalNumber);

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
          {items.map((item) => {
            const src = isGoalNumber(item.number) ? icons[item.number] : undefined;
            return (
              <li key={item.number} className="grid gap-5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-8">
                {/* 유엔 공식 아이콘 — 자르기 · 둥근 모서리 · 그림자 · 색 변경 없이 원본 비율 그대로 */}
                {src ? (
                  <Image
                    src={src}
                    alt={t('iconAlt', { number: item.number })}
                    width={176}
                    height={176}
                    className="h-36 w-36 shrink-0 sm:h-44 sm:w-44"
                  />
                ) : (
                  <div aria-hidden="true" className="hidden sm:block" />
                )}

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
          <SourceNote>{t('scopeNote')}</SourceNote>
          {/* 유엔이 아이콘 사용 조건으로 요구하는 고지문 + 유엔 SDG 사이트 링크 + 지침 링크 */}
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
            {goals.map((number) => (
              <li key={number}>
                <a href={GOAL_URLS[number]} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {t('unLinkLabel')} — SDG {number}
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
