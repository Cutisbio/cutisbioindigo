import React from 'react';

type QnaItem = {
  question: string;
  answer: string;
};

interface QnaSectionProps {
  items: QnaItem[];
  /** 문서 계층이 유지되도록 Heading 레벨을 상위에서 지정한다. */
  headingLevel?: 'h2' | 'h3';
}

export default function QnaSection({ items, headingLevel = 'h3' }: QnaSectionProps) {
  const HeadingTag = headingLevel;

  return (
    <dl className="divide-y divide-[color:var(--color-washed)] border-y border-[color:var(--color-washed)]">
      {items.map((item, index) => (
        <div key={index} className="py-6">
          <dt>
            <HeadingTag className="text-lg font-semibold break-keep text-[var(--color-indigo-deep)]">
              {item.question}
            </HeadingTag>
          </dt>
          <dd className="mt-3 text-base leading-[1.85] break-keep text-[var(--color-ink)]/85">
            {item.answer}
          </dd>
        </div>
      ))}
    </dl>
  );
}
