import React from 'react';
import SchemaOrg, { buildOrganizationSchema } from '@/components/seo/SchemaOrg';
import DataTable from '@/components/ui/DataTable';

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://cutisbioindigo.kr';
  const orgSchema = buildOrganizationSchema(
    'CutisBio',
    baseUrl,
    `${baseUrl}/logo.png`
  );

  const keyFeatures = [
    { feature: '미생물 발효(Microbial Fermentation)', benefit: '지속 가능한 생합성 과정' },
    { feature: '아닐린 프리(Aniline-Free)', benefit: '발암물질이나 독성 없는 안전성' },
    { feature: '친환경 인디고(Sustainable Indigo)', benefit: '수질 오염 최소화 및 패션 산업 혁신' },
  ];

  return (
    <>
      <SchemaOrg schema={orgSchema} />
      {/* 단일 최상위 H1으로 페이지의 목적 명시 */}
      <div className="space-y-12">
        <section className="text-center py-12 bg-blue-50 rounded-xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
            차세대 친환경 데님 염료, CutisBio Indigo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            자연을 해치지 않고 인체에 안전한 데님 염료. 미생물 발효 기술로 유독성 물질(아닐린) 없이 탄생한 가장 지속 가능한 인디고 염색 솔루션입니다.
          </p>
        </section>

        <section>
          {/* 논리적인 흐름을 구성하는 H2 */}
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">CutisBio 기술의 핵심 가치</h2>
          <div className="my-6">
            <DataTable
              columns={[
                { key: 'feature', label: '주요 기술적 과제 해결' },
                { key: 'benefit', label: '자연과 패션 산업에 미치는 이점' },
              ]}
              data={keyFeatures}
              caption="CutisBio가 제안하는 아닐린 프리 염료의 이점"
            />
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">지속가능한 미래를 위한 선택</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            위의 네비게이션에서 <strong>기술 소개</strong> 페이지를 확인하여, 왜 미생물 기반 인디고 염료가 전통 염색 공정을 대체해야 하는지 구체적인 사실을 확인해 보세요.
          </p>
        </section>
      </div>
    </>
  );
}
