import React from 'react';
import SchemaOrg, { buildArticleSchema, buildFAQSchema } from '@/components/seo/SchemaOrg';
import StrictImage from '@/components/ui/StrictImage';
import QnaSection from '@/components/ui/QnaSection';

export const metadata = {
  title: '미생물 발효를 통한 지속 가능한 데님 염색',
  description: 'CutisBio의 아닐린 프리(Aniline-free) 인디고 염료 개발 배경과 친환경 데님 패션의 미래를 소개합니다.',
};

export default function SustainableIndigoPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://cutisbioindigo.kr';
  
  const articleSchema = buildArticleSchema(
    metadata.title,
    [`${baseUrl}/images/cutisbio-indigo.jpg`],
    'CutisBio R&D Team',
    '2026-04-07T00:00:00Z',
    '2026-04-07T00:00:00Z'
  );

  const faqData = [
    {
      question: '전통적인 인디고 염색의 문제점은 무엇인가요?',
      answer: '기존 합성 인디고 염료는 석유 화학물질인 아닐린(Aniline)과 시안화수소 등을 사용하여 생산됩니다. 이는 심각한 수질 오염을 유발하며, 노동자와 최종 소비자의 건강에도 위협이 될 수 있습니다.',
    },
    {
      question: '미생물 발효 기반 인디고 염료란 무엇인가요?',
      answer: 'CutisBio의 기술은 특수하게 설계된 미생물을 사용하여 자연적인 발효 과정을 통해 인디고 전구체를 생산합니다. 화학적 합성 대신 생물학적 메커니즘을 이용하므로 100% 아닐린 프리 염료를 만들 수 있습니다.',
    },
    {
      question: '의류 품질에 차이가 있나요?',
      answer: '기존의 전통적인 인디고 데님 염색의 품질, 색상 깊이(Shade), 마찰 견뢰도 등을 동일하게 또는 그 이상으로 구현할 수 있습니다. 품질 타협 없이 완벽한 형태의 지속가능성을 달성했습니다.',
    }
  ];

  const faqSchema = buildFAQSchema(faqData);

  return (
    <>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={faqSchema} />

      <article className="max-w-3xl mx-auto py-8">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold mb-4 leading-tight">
            {metadata.title}
          </h1>
          <div className="text-gray-500 text-sm">
            작성자: CutisBio R&D Team | 발행일: 2026-04-07
          </div>
        </header>

        <section className="mb-12 prose prose-lg prose-blue max-w-none">
          <p className="lead text-xl text-gray-700 mb-6">
            모두가 가장 사랑하는 패션 아이템인 <strong>블루 데님(Blue Denim)</strong>. 하지만 그 아름다운 색 뒤에는 환경과 건강을 위협하는 화학 물질, '아닐린(Aniline)'이 숨어 있었습니다. CutisBio는 이를 근본적으로 해결합니다.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 border-b pb-2">1. 아닐린 프리(Aniline-Free)의 중요성</h2>
          <p className="mb-6">
            아닐린은 세계보건기구(WHO) 산하 국제암연구소에서 잠재적 발암물질로 분류된 유해 물질입니다. 데님 공장 주변의 수자원으로 무분별하게 방류되며 생태계를 파괴할 뿐 아니라, 피부와 오랫동안 접촉하는 청바지 소비자에게도 영향을 미칩니다.
          </p>

          <figure className="my-8 bg-gray-50 flex flex-col items-center justify-center p-8 rounded-lg border border-dashed rounded text-gray-400">
             <div className="relative w-full h-64 bg-blue-100 flex items-center justify-center rounded overflow-hidden">
                <StrictImage
                  src="/cutisbio-microbe.jpg"
                  alt="미생물 발효조를 통해 깨끗한 인디고 염료(파란색)가 생산되는 과정을 시각화한 일러스트."
                  fill
                   className="object-cover opacity-0" 
                />
                <span className="z-10 text-blue-800 font-bold whitespace-pre-wrap text-center">
                  {'전통적 화학 합성 (아닐린 사용)\nVS\n미생물 발효 생합성 (100% 무독성)'}
                </span>
             </div>
             <figcaption className="mt-3 text-sm text-center">
               안전하고 깨끗한 생명공학, 미생물 발효 기반 염료 생산 공정
             </figcaption>
          </figure>

          <h2 className="text-2xl font-bold mt-10 mb-4 border-b pb-2">2. CutisBio의 혁신, 미생물 발효</h2>
          <p className="mb-6">
            자연이 정답을 가지고 있었습니다. 우리는 미생물에게 식물과 유사한 대사 경로를 부여하여 스스로 인디고 전구체를 만들어 내도록 설계했습니다. 이 과정을 통해 아닐린과 같은 치명적인 화학 물질의 사용을 원천적으로 차단합니다.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mt-10 mb-6 border-b pb-2">자주 묻는 질문 (FAQ)</h2>
          <QnaSection items={faqData} headingLevel="h3" />
        </section>
      </article>
    </>
  );
}
