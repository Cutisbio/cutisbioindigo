'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import SectionHeading from '@/components/blugene/SectionHeading';

/**
 * 색상 라이브러리 — 섹션 제목(「당신만의 파랑을」)과 그 아래에 끼우는 블록(beforeGrid)만 남았다.
 *
 * 지난 변경
 * - 「카탈로그 농도별 견본」 2행 6열 격자(A1~B6, p.7 Figure 4-1)는 2026-10-05 고객 요청으로 홈과 /dyeing-printing 에서 뺐다.
 *   (그 전에는 농도 수치가 없어 위치 기준 구분자만 붙였고, 선택기 · A6/B1 중복 안내는 2026-09-12 에 뺐다.)
 *   견본 파일과 데이터(shadeSwatches)는 남아 있고, /contact 의 shade 쿼리 처리도 주소로 들어오면 여전히 동작한다.
 *   홈에서는 격자를 빼면 제목만 남아 섹션 자체를 뺐다.
 * - 「인디루빈이 만드는 색조 변화」 블록(p.7 Figure 4-2 사진 두 장 · 두 조성 비교 토글 · 안내)과 그 아래 조건 표기
 *   (colorDisclaimer · medicalNote)는 2026-10-06 고객 요청으로 /dyeing-printing 에서도 뺐다(홈은 2026-09-29 에 이미 껐다).
 *   showIndirubin 속성과 ShadeLibrary.indirubin* · colorDisclaimer · medicalNote 문구 키를 지웠다.
 *   사진 파일(public/blugene/shades/indirubin-*.webp)과 데이터(shades.ts 의 indirubinPair)는 남겨 둔다.
 * - 이 화면에서 어떤 정보도 외부로 전송하지 않는다.
 *
 * 클라이언트 컴포넌트로 남겨 둔다 — 상태는 없지만 layout 의 CLIENT_NAMESPACES(ShadeLibrary)와 번역 호출 방식을 그대로 두기 위해서다.
 */
export default function ShadeLibrary({
  variant = 'section',
  beforeGrid,
}: {
  /** 'section' 이면 배경·여백을 가진 독립 섹션, 'bare' 면 내부 콘텐츠만 반환한다 */
  variant?: 'section' | 'bare';
  /**
   * 섹션 제목 바로 아래에 끼울 블록. /dyeing-printing 은 여기에 「염색 횟수에 따른 발색 비교」
   * (DyeingCycles, 서버 컴포넌트)를 넣는다 — 2026-10-05 고객 요청으로 제품군 섹션에서 옮김. 클라이언트 컴포넌트라
   * 서버 컴포넌트를 직접 그릴 수 없으므로 페이지가 ReactNode 로 넘긴다.
   */
  beforeGrid?: ReactNode;
}) {
  const t = useTranslations('ShadeLibrary');

  const content = (
    <>
      <SectionHeading eyebrow={t('eyebrow')} title={t('title')} body={t('body')} size="hero" />

      {/* 「염색 횟수에 따른 발색 비교」 등 — 섹션 제목 바로 아래 */}
      {beforeGrid && <div className="mt-12 sm:mt-16">{beforeGrid}</div>}
    </>
  );

  // 'bare' 는 페이지가 이미 같은 컨테이너로 감싸고 있을 때 쓴다.
  if (variant === 'bare') {
    return content;
  }

  return (
    <section className="bg-[var(--color-ivory)]">
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        {content}
      </div>
    </section>
  );
}
