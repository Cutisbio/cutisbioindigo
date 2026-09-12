import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import ThreadMotif from '@/components/blugene/ThreadMotif';
import { HEADING_SIZE, keepLastWords } from '@/components/blugene/SectionHeading';

/**
 * 브랜드 선언 — 국경과 세대를 잇는 옷.
 *
 * 사람 사진 위에 문구를 올리지 않고, 깊은 인디고 면과 여백으로 문장을 세운다.
 * 장식은 데님 실 두 가닥을 연상시키는 추상 선(ThreadMotif)으로 제한한다.
 * 화학구조도나 인증마크처럼 보이는 요소를 쓰지 않는다.
 *
 * 세 질문 아래의 '질문에 답을 듣기' 버튼은 기술 페이지(/technology)로 보낸다 — 무엇으로 만들었는지(경로 · 탄소),
 * 어떤 불순물이 남는지(아닐린)를 그 페이지가 답하고, 확인은 거기서 데이터 · 인증으로 이어진다.
 * 전에는 '브랜드 이야기 읽기'(/brand) 링크였는데 /brand 자신에서도 켜져 있어 눌러도 아무 일이 없었다(2026-09-12 고객 요청으로 교체).
 *
 * portrait 는 오른쪽 열에 Blugene 기획자(피부과전문의 최원우)의 사진과 직함 두 줄을 놓는다
 * (2026-09-11 고객 요청). /brand 에서만 켠다. 사진은 고객이 준 인물 사진을 자르지 않고 축소한 것이며
 * (public/blugene/asset-manifest.json 참조), 사진에 시험 완료 배지나 의학적 보증 문구를 붙이지 않는다.
 */
/** 기획자 사진 — 원본 3744×5616 JPEG 를 자르지 않고 960px 폭 WebP 로 축소한 것 */
const PORTRAIT = { src: '/blugene/brand/dermatologist-choi-wonwoo.webp', width: 960, height: 1440 } as const;
export default async function BrandManifesto({
  portrait = false,
}: {
  /** 오른쪽 열에 기획자 사진과 직함을 놓을지 여부. /brand 에서 켠다. */
  portrait?: boolean;
}) {
  const t = await getTranslations('Manifesto');
  const questions = t.raw('questions') as string[];
  // 현지어 줄과 영문 직함 줄. 영어처럼 두 값이 같은 언어에서는 한 줄만 그린다.
  const portraitName = t('portraitName');
  const portraitCredential = t('portraitCredential');

  return (
    <section className="on-indigo relative overflow-hidden bg-[var(--color-indigo-deep)] text-white">
      <ThreadMotif className="pointer-events-none absolute right-[-6%] bottom-0 h-full w-[62%] opacity-70 sm:right-0 sm:w-[52%]" />

      <div className="relative mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div
          className={`grid gap-10 lg:items-start lg:gap-16 ${
            portrait ? 'lg:grid-cols-[minmax(0,1fr)_24rem]' : 'lg:grid-cols-[1fr_auto]'
          }`}
        >
          <div className="max-w-3xl">
            <p className="blugene-tagline text-[0.68rem] text-white/55 sm:text-[0.75rem]">
              {t('eyebrow')}
            </p>
            {/* 섹션 최상위 제목이므로 3.5rem 리터럴 대신 공용 hero 단을 쓴다. 따로 두면 FinalCta(3.25rem)와
                다시 눈에 안 보이는 차이로 갈린다. */}
            <h2
              className={`mt-6 ${HEADING_SIZE.hero} leading-[1.22] font-bold tracking-[-0.025em] text-pretty break-keep`}
            >
              {keepLastWords(t('title'))}
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

            {/* FinalCta 의 짙은 면 위 보조 버튼과 같은 모양 — 흰 테두리, 흰 글자 */}
            <div className="mt-10">
              <Link
                href="/technology"
                className="inline-flex items-center gap-2 rounded-md border border-white/50 px-6 py-3.5 text-sm font-semibold break-keep text-white transition-colors hover:bg-white/10 sm:text-base"
              >
                {t('cta')}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {portrait ? (
            /* 기획자 사진 — 모바일에서는 글 아래에, 데스크톱에서는 오른쪽 열(24rem)에 놓는다 */
            <figure className="w-full max-w-[20rem] sm:max-w-[22rem] lg:max-w-none">
              <Image
                src={PORTRAIT.src}
                alt={t('portraitAlt')}
                width={PORTRAIT.width}
                height={PORTRAIT.height}
                sizes="(max-width: 1023px) 22rem, 24rem"
                className="h-auto w-full rounded-lg"
              />
              <figcaption className="mt-4 text-sm leading-relaxed break-keep">
                {portraitName !== portraitCredential && (
                  <span className="block font-semibold text-white">{portraitName}</span>
                )}
                <span className="block text-[0.8rem] leading-relaxed text-white/70">{portraitCredential}</span>
              </figcaption>
            </figure>
          ) : (
            /* 오른쪽 세로 캡션 — 데스크톱에서만 표시한다 */
            <p className="blugene-tagline hidden max-w-[9rem] text-right text-[0.68rem] leading-[2.1] text-white/60 lg:block">
              A cleaner blue
              <br />
              for a brighter
              <br />
              tomorrow.
              <span aria-hidden="true" className="mt-4 ml-auto block h-px w-10 bg-white/35" />
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
