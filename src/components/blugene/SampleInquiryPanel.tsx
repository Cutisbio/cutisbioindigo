'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SampleInquiry from '@/components/blugene/SampleInquiry';

/**
 * 색상 라이브러리에서 넘어온 `?shade=A4` 를 읽어 문의 내용에 채워 넣는다.
 *
 * useSearchParams 를 Suspense 로 감싸 문의 페이지 자체는 정적으로 유지한다.
 * 이 화면에서 어떤 정보도 외부로 전송하지 않는다 — 값은 mailto 본문에만 쓰인다.
 */
function InquiryWithShade() {
  const params = useSearchParams();
  const shade = params.get('shade') ?? undefined;
  // 견본 코드는 A1~B6 형식만 허용한다 (임의의 문자열이 메일 본문에 들어가지 않도록)
  const safeShade = shade && /^[AB][1-6]$/.test(shade) ? shade : undefined;
  return <SampleInquiry initialShade={safeShade} />;
}

export default function SampleInquiryPanel() {
  return (
    <Suspense fallback={<SampleInquiry />}>
      <InquiryWithShade />
    </Suspense>
  );
}
