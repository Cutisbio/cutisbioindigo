import React from 'react';

type SchemaOrgProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: Record<string, any>;
};

export default function SchemaOrg({ schema }: SchemaOrgProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// 빌더 헬퍼: Organization 스키마
export function buildOrganizationSchema(name: string, url: string, logoUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo: logoUrl,
  };
}

// 빌더 헬퍼: Article 스키마
export function buildArticleSchema(headline: string, image: string[], authorName: string, datePublished: string, dateModified: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    image,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    datePublished,
    dateModified,
  };
}

// 빌더 헬퍼: FAQ 스키마
export function buildFAQSchema(faqs: { question: string; answer: string }[]) {
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
