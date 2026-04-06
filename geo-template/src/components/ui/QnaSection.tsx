import React from 'react';

type QnaItem = {
  question: string;
  answer: string;
};

interface QnaSectionProps {
  items: QnaItem[];
  // AI가 h2 혹은 h3를 통해 계층 구조를 이해하도록 Heading 레벨을 받습니다.
  headingLevel?: 'h2' | 'h3';
}

export default function QnaSection({ items, headingLevel = 'h3' }: QnaSectionProps) {
  const HeadingTag = headingLevel;

  return (
    <div className="space-y-6">
      {items.map((item, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
          {/* Heading 태그를 질문으로 렌더링하고, 바로 다음에 답변 p 태그가 오도록 강제합니다. */}
          <HeadingTag className="text-xl font-bold mb-3">{item.question}</HeadingTag>
          <p className="text-gray-700 leading-relaxed">{item.answer}</p>
        </div>
      ))}
    </div>
  );
}
