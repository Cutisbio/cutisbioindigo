import { getTranslations } from 'next-intl/server';
import SectionHeading from '@/components/blugene/SectionHeading';
import CarbonEvidencePanel from '@/components/blugene/CarbonEvidencePanel';

/**
 * 환경 섹션 — "입는 사람을 생각하며. 만드는 과정도 생각하며."
 *
 * 확인된 수치(바이오 기반 탄소 함량 98%)만 정량 표시한다 — 아래 98% 패널이 숫자 · 시험 메타 · 읽는 조건을 맡는다.
 * 오른쪽 열에 있던 작은 98% 카드(carbonCardTitle · carbonCardText) · 범위 안내(scopeNote) · '근거 자료 보기' 링크(cta)는
 * 2026-10-07 고객 요청으로 뺐다(패널과 겹쳤다). 키도 지움. 물 · 에너지 · 배출 절감 수치를 쓰지 않는다는 원칙은 그대로다
 * (docs/blugene-claims.md).
 * 섹션 아래의 카탈로그 p.12 가치사슬 '개념 이미지'(value-chain.webp)는 2026-10-07 고객 요청으로 /technology 의 98% 패널
 * (CarbonEvidencePanel)로 바꿨다. 이미지 파일은 남긴다. 패널 제목은 h3, 아래 두 단은 보이지 않는다.
 */
export default async function EnvironmentSection() {
  const t = await getTranslations('Environment');

  return (
    <section className="w-full bg-[var(--color-ivory)]">
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} body={t('body')} size="hero" />

        {/* 98% 패널 — 2026-10-07 고객 요청으로 p.12 개념 이미지 자리에 둔다. 숫자 · 시험 메타는 evidence.ts 하나에서 온다 */}
        <div className="mt-14">
          <CarbonEvidencePanel headingAs="h3" showSplit={false} />
        </div>
      </div>
    </section>
  );
}
