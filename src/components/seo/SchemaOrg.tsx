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

/** 빌더 헬퍼: Organization 스키마 */
export function buildOrganizationSchema(name: string, url: string, logoUrl: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo: logoUrl,
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
