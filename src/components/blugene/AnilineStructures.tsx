import { getTranslations } from 'next-intl/server';
import SourceNote from '@/components/blugene/SourceNote';

/**
 * 아닐린 · N-메틸아닐린 구조식.
 *
 * 카탈로그 p.4 에서 다루는 두 물질의 화학 구조를 **코드로 직접 그린** 골격 구조식이다.
 * (Master Prompt §6-04: 전문 분자구조가 필요하면 검증된 구조 데이터에서 그리며,
 *  이미지 생성 모델로 화학식을 만들지 않는다.)
 *
 * - 아닐린:        C6H5–NH2   (CAS 62-53-3)
 * - N-메틸아닐린:  C6H5–NH–CH3 (CAS 100-61-8)
 *
 * 건강 영향에 대한 서술은 카탈로그 p.4 의 범위("toxic and potentially carcinogenic")를 넘지 않는다.
 * 특정 질환을 지목하거나 안전성을 단정하지 않는다.
 */

/** 정육각형 벤젠 고리 + 치환기 결합. 좌표는 viewBox 200×120 기준. */
function BenzeneRing() {
  const cx = 52;
  const cy = 60;
  const r = 32;
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  });
  const poly = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

  // 케쿨레 구조의 이중결합 3개 — 고리 안쪽으로 조금 들여 그린다
  const inner = (i: number, j: number) => {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[j];
    const mx = (x1 + x2) / 2 - cx;
    const my = (y1 + y2) / 2 - cy;
    const len = Math.hypot(mx, my);
    const k = 6 / len;
    const dx = mx * k;
    const dy = my * k;
    const t = 0.16;
    return {
      x1: x1 + (x2 - x1) * t - dx,
      y1: y1 + (y2 - y1) * t - dy,
      x2: x2 - (x2 - x1) * t - dx,
      y2: y2 - (y2 - y1) * t - dy,
    };
  };

  return (
    <>
      <polygon points={poly} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" />
      {[
        [0, 1],
        [2, 3],
        [4, 5],
      ].map(([i, j]) => {
        const l = inner(i, j);
        return (
          <line
            key={`${i}-${j}`}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
          />
        );
      })}
      {/* 고리(오른쪽 꼭짓점)에서 질소로 가는 결합 */}
      <line x1={pts[0][0]} y1={pts[0][1]} x2={104} y2={60} stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
    </>
  );
}

function Structure({
  variant,
  title,
  desc,
}: {
  variant: 'aniline' | 'n-methylaniline';
  title: string;
  desc: string;
}) {
  return (
    <svg
      viewBox="0 0 200 120"
      role="img"
      aria-labelledby={`${variant}-t ${variant}-d`}
      className="h-auto w-full max-w-[280px] text-[var(--color-indigo-deep)]"
    >
      <title id={`${variant}-t`}>{title}</title>
      <desc id={`${variant}-d`}>{desc}</desc>
      <BenzeneRing />

      {variant === 'aniline' ? (
        <text x={110} y={65} fontSize="17" fill="currentColor" fontFamily="var(--font-sans)">
          NH
          <tspan fontSize="11" dy="4">
            2
          </tspan>
        </text>
      ) : (
        <>
          <text x={108} y={65} fontSize="17" fill="currentColor" fontFamily="var(--font-sans)">
            N
          </text>
          {/* N–H 결합은 아래쪽, N–CH3 결합은 오른쪽 위로 */}
          <text x={106} y={86} fontSize="13" fill="currentColor" fontFamily="var(--font-sans)">
            H
          </text>
          <line x1={124} y1={56} x2={143} y2={42} stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
          <text x={146} y={40} fontSize="15" fill="currentColor" fontFamily="var(--font-sans)">
            CH
            <tspan fontSize="10" dy="4">
              3
            </tspan>
          </text>
        </>
      )}
    </svg>
  );
}

export default async function AnilineStructures() {
  const t = await getTranslations('Tech');

  const items = [
    {
      variant: 'aniline' as const,
      name: t('structureAnilineName'),
      formula: 'C₆H₅NH₂',
      cas: '62-53-3',
      desc: t('structureAnilineDesc'),
    },
    {
      variant: 'n-methylaniline' as const,
      name: t('structureNMethylanilineName'),
      formula: 'C₆H₅NHCH₃',
      cas: '100-61-8',
      desc: t('structureNMethylanilineDesc'),
    },
  ];

  return (
    <figure className="my-12 rounded-md border border-[color:var(--color-washed)] bg-white p-6 sm:p-8">
      <h3 className="text-lg font-semibold break-keep text-[var(--color-indigo-deep)]">
        {t('structuresTitle')}
      </h3>

      <div className="mt-6 grid gap-8 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.variant} className="flex flex-col items-start gap-4">
            <Structure variant={item.variant} title={item.name} desc={item.desc} />
            <div>
              <p className="font-semibold break-keep text-[var(--color-ink)]">{item.name}</p>
              {/* 화학식·CAS 번호는 고유 표기이므로 번역하지 않는다 */}
              <p className="mt-1 font-mono text-sm text-[var(--color-slate-muted)]">
                {item.formula} · CAS {item.cas}
              </p>
            </div>
          </div>
        ))}
      </div>

      <figcaption className="mt-7 border-t border-[color:var(--color-washed)] pt-5">
        <SourceNote>{t('comparisonCaption')}</SourceNote>
        <SourceNote className="mt-2">{t('structuresNote')}</SourceNote>
      </figcaption>
    </figure>
  );
}
