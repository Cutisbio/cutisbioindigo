import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { carbonTest } from '@/data/blugene/evidence';

/**
 * 「분명한 근거」 — 98% 패널.
 *
 * 2026-10-04 고객이 준 시안(Blugene_Website_Brief/assets/mockups/2026-10-04-carbon-evidence-panel.svg 와 화면 캡처)을
 * 이 사이트의 색과 글자로 옮긴 것이다. 예전의 두 질문 카드(「바이오 기반인가요?」 · 「탄소배출은 얼마나 줄었나요?」)와
 * 콜아웃을 대신한다.
 *
 * - 숫자(98) · 시험기관 · 시험법 · 성적서 번호 · 일자 · 카탈로그 쪽 · 표 번호는 evidence.ts 의 carbonTest 에서 가져온다.
 *   messages 에 숫자를 따로 적지 않으므로 값이 바뀌면 한곳만 고친다.
 * - 글자는 messages 의 Technology.carbon.evidence.panel / split 을 쓴다. 이미지에 글자를 굽지 않는다.
 * - 점 격자는 100개 중 98개를 칠한 비율 시각화(20×5)다. role="img" 과 aria-label 로 뜻을 읽어 준다.
 * - 큰 숫자는 'Blugene의 바이오 기반 탄소 함량'(2026-10-04 고객 지정, 이전 '시험 시료의 바이오 기반 탄소 함량')이라는 이름과 함께 두고, 본문이 데님 한 벌의 식물 원료 함량 ·
 *   인디고 순도 · 탄소배출 감축률을 뜻하지 않음을 밝힌다(docs/blugene-claims.md A 표). 링크는 데이터 · 인증 페이지의
 *   시험 결과 표로 간다. 아래 두 단 문장이 '출처'와 '탄소발자국'이 다른 질문임을 말한다.
 */
const COLS = 20;
const ROWS = 5;
const STEP = 20;
const RADIUS = 6.5;

export default async function CarbonEvidencePanel() {
  const t = await getTranslations('Technology');
  const value = carbonTest.biobasedCarbonPercent;
  const total = COLS * ROWS;
  const filled = Math.round((value / 100) * total);
  // 'KATRI (Korea Apparel Testing and Research Institute)' → 'KATRI'. 긴 이름은 데이터 · 인증 페이지의 표가 보여 준다.
  const labShort = carbonTest.lab.replace(/\s*\(.*\)$/, '');
  const meta = [
    `${labShort} · ${carbonTest.method}`,
    `${t('carbon.evidence.panel.reportLabel')} ${carbonTest.reportNumber} · ${carbonTest.reportDate}`,
    `${t('carbon.evidence.panel.sourceLabel')}: ${t('carbon.evidence.panel.source', {
      page: carbonTest.page,
      table: carbonTest.table,
    })}`,
  ];

  return (
    <div>
      <div className="on-indigo grid gap-10 rounded-lg bg-[var(--color-indigo-deep)] px-6 py-10 text-white sm:px-10 sm:py-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:px-14 lg:py-14">
        {/* 왼쪽 — 큰 숫자 · 이름 · 점 격자 */}
        <div className="flex flex-col justify-center">
          <p className="font-serif leading-none tracking-[-0.03em]">
            <span className="text-[6rem] sm:text-[7.5rem] lg:text-[8.5rem]">
              {value}
              <span className="text-[0.4em]">%</span>
            </span>
          </p>
          <p className="mt-4 text-base break-keep text-white/80 sm:text-lg">{t('carbon.evidence.panel.valueLabel')}</p>
          <svg
            role="img"
            aria-label={t('carbon.evidence.panel.dotsAlt', { value, total })}
            viewBox={`0 0 ${COLS * STEP} ${ROWS * STEP}`}
            className="mt-8 w-full max-w-[22rem]"
          >
            {Array.from({ length: total }, (_, i) => (
              <circle
                key={i}
                cx={(i % COLS) * STEP + STEP / 2}
                cy={Math.floor(i / COLS) * STEP + STEP / 2}
                r={RADIUS}
                fill={i < filled ? 'var(--color-washed)' : 'rgba(255,255,255,0.28)'}
              />
            ))}
          </svg>
        </div>

        {/* 오른쪽 — 제목 · 본문 · 시험 메타 · 링크 */}
        <div className="flex flex-col justify-center">
          <h4 className="text-2xl leading-[1.3] font-bold tracking-[-0.01em] text-pretty break-keep sm:text-3xl lg:text-[2.25rem]">
            {t('carbon.evidence.panel.headline')}
          </h4>
          <p className="mt-5 max-w-2xl text-base leading-[1.85] break-keep text-white/85 sm:text-lg">
            {t('carbon.evidence.panel.body')}
          </p>
          <ul className="mt-7 space-y-1.5 text-sm leading-relaxed break-keep text-white/70">
            {meta.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="mt-7">
            <Link
              href="/data-certifications#test-results"
              className="inline-flex items-center gap-1.5 text-base font-semibold text-white underline underline-offset-4 hover:text-white/80"
            >
              {t('carbon.evidence.panel.link', { value })}
              <span aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
      </div>

      {/* 출처와 탄소발자국은 다른 질문 — 패널 아래 두 단 */}
      <div className="mt-10 grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-10 lg:gap-14">
        <p className="text-xl leading-snug font-bold tracking-[-0.01em] break-keep text-[var(--color-indigo-deep)] sm:text-2xl">
          {t('carbon.evidence.split.title')}
        </p>
        <p className="text-base leading-[1.85] break-keep text-[var(--color-ink)]/85 sm:text-lg">
          {t('carbon.evidence.split.text')}
        </p>
      </div>
    </div>
  );
}
