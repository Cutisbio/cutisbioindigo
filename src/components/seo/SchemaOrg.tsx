import React from 'react';

type JsonLd = Record<string, unknown>;

type SchemaOrgProps = {
  schema: JsonLd;
};

export default function SchemaOrg({ schema }: SchemaOrgProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * 빌더 헬퍼: Organization 스키마.
 * extra 로 alternateName · sameAs 같은 항목을 덧붙일 수 있다(홈에서 회사 공식 사이트를 sameAs 로 잇는다).
 */
export function buildOrganizationSchema(
  name: string,
  url: string,
  logoUrl: string,
  extra: JsonLd = {},
): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo: logoUrl,
    ...extra,
  };
}

/**
 * 빌더 헬퍼: WebSite 스키마 — 사이트 이름 · 언어 · 발행 조직. 검색엔진과 AI 답변 엔진이 사이트 이름을
 * "Blugene by CutisBio" 로 읽고, 언어판이 한 사이트임을 알게 한다. 검색 액션은 사이트 내 검색이 없어 넣지 않는다.
 */
export function buildWebSiteSchema(params: {
  name: string;
  alternateName?: string[];
  url: string;
  inLanguage: string[];
  publisherName: string;
  publisherUrl: string;
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: params.name,
    ...(params.alternateName ? { alternateName: params.alternateName } : {}),
    url: params.url,
    inLanguage: params.inLanguage,
    publisher: { '@type': 'Organization', name: params.publisherName, url: params.publisherUrl },
  };
}

/**
 * 빌더 헬퍼: Article 스키마.
 *
 * author 는 팀·법인 명의이므로 Person 이 아니라 Organization 으로 내보낸다.
 * 없는 가격·리뷰·평점은 넣지 않는다.
 */
export function buildArticleSchema(params: {
  headline: string;
  image: string[];
  authorName: string;
  publisherName: string;
  publisherLogo: string;
  datePublished: string;
  dateModified: string;
  url: string;
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: params.headline,
    image: params.image,
    author: { '@type': 'Organization', name: params.authorName },
    publisher: {
      '@type': 'Organization',
      name: params.publisherName,
      logo: { '@type': 'ImageObject', url: params.publisherLogo },
    },
    datePublished: params.datePublished,
    dateModified: params.dateModified,
    mainEntityOfPage: { '@type': 'WebPage', '@id': params.url },
  };
}

/** 빌더 헬퍼: FAQ 스키마 */
export function buildFAQSchema(faqs: { question: string; answer: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
