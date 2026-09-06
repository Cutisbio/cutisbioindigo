import type { ReactNode } from 'react';

/**
 * 출처 · 조건 표기 블록.
 *
 * 시험 수치나 인증 정보 옆에는 언제나 이 컴포넌트로 "어디서 온 값인지 / 어떤 조건인지"를 함께 적는다.
 * 각주에 숨기지 않고 본문 흐름 안에서 읽히도록 배치한다.
 */
export default function SourceNote({
  children,
  tone = 'ink',
  className = '',
  as: Tag = 'p',
}: {
  children: ReactNode;
  tone?: 'ink' | 'inverse';
  className?: string;
  as?: 'p' | 'div';
}) {
  const color = tone === 'inverse' ? 'text-white/70' : 'text-[var(--color-slate-muted)]';
  return (
    <Tag className={`text-[0.8125rem] leading-relaxed break-keep ${color} ${className}`}>
      {children}
    </Tag>
  );
}

/** 근거 자료 옆에 붙이는 작은 라벨 (예: 시험 사진 / 개념 이미지 / 브랜드 이미지) */
export function AssetKind({
  children,
  tone = 'ink',
}: {
  children: ReactNode;
  tone?: 'ink' | 'inverse';
}) {
  const cls =
    tone === 'inverse'
      ? 'border-white/25 text-white/75'
      : 'border-[color:var(--color-washed)] text-[var(--color-slate-muted)]';
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-[0.7rem] font-medium tracking-wide break-keep ${cls}`}
    >
      {children}
    </span>
  );
}
