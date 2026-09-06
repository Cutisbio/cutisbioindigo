/**
 * 인증 데이터 — 카탈로그 p.10-11 및 수록된 인증서 원본 이미지에서 판독
 * ---------------------------------------------------------------------
 * ⚠ 여기 값은 **인증서 문서에 적힌 내용**이다. 인증기관 데이터베이스 실시간 조회 결과가 아니다.
 *   → 화면에는 항상 `status: 'documented'` 의 의미(카탈로그 수록 자료)를 함께 표시한다.
 * ⚠ 인증서의 제품명은 `CB Bio Indigo Dye Powder` 이며, 브랜드명 Blugene 으로 고쳐 쓰지 않는다.
 * ⚠ 분말 인증이 디지털 프린팅 잉크나 최종 데님 의류까지 자동 적용된다고 주장하지 않는다.
 */

import { SOURCE_AS_OF } from './evidence';

export interface Certification {
  id: 'zdhc' | 'oeko' | 'usda' | 'okbiobased';
  /** 인증명 — 고유명사이므로 번역하지 않는다 */
  displayName: string;
  /** 인증기관 / 발행기관 (원문 표기) */
  issuer: string;
  /** 인증번호 (원문 표기) */
  number: string;
  /** 인증서에 적힌 대상 제품명 */
  productOnCertificate: string;
  /** 카탈로그 페이지 */
  page: number;
  /** 문서에 적힌 유효 시작일 (없으면 null) */
  validFrom: string | null;
  /** 문서에 적힌 유효 종료일 (없으면 null) */
  validUntil: string | null;
  /** 문서 발행일 */
  issuedOn: string | null;
  /** 인증서 원본 이미지 */
  certificateImage: string;
  certificateSize: { width: number; height: number };
  /** 인증 마크 이미지 */
  logoImage: string;
  /** 번역 키 접미사 — messages 의 Certifications.<id>.scope / .note 에 대응 */
  hasScopeNote: boolean;
}

export const certifications: Certification[] = [
  {
    id: 'zdhc',
    displayName: 'ZDHC MRSL Level 1 Version 3.1',
    issuer: 'FITI Testing & Research Institute',
    number: 'H682-25-00154',
    productOnCertificate: 'CB Bio Indigo Dye Powder',
    page: 10,
    validFrom: '2025-06-10',
    validUntil: '2027-06-09',
    issuedOn: '2025-06-10',
    certificateImage: '/blugene/certifications/zdhc-certificate.png',
    certificateSize: { width: 611, height: 868 },
    logoImage: '/4ZDHC.png',
    hasScopeNote: true,
  },
  {
    id: 'oeko',
    displayName: 'OEKO-TEX® ECO PASSPORT',
    issuer: 'Centexbel (OEKO-TEX® Service GmbH)',
    number: 'E2AGHSST4',
    productOnCertificate: 'See attached enclosure — Product category 2.9 Natural dyes',
    page: 10,
    validFrom: null,
    validUntil: '2026-10-31',
    issuedOn: '2025-10-23',
    certificateImage: '/blugene/certifications/oeko-certificate.png',
    certificateSize: { width: 610, height: 875 },
    logoImage: '/oeko-tex-eco-passport-logo.png',
    hasScopeNote: true,
  },
  {
    id: 'usda',
    displayName: 'USDA BioPreferred®',
    issuer: 'U.S. Department of Agriculture — Rural Development',
    number: '4295FD7FF6695D3B1D293DB7DDEE34A5',
    productOnCertificate: 'CB Bio Indigo Dye Powder',
    page: 11,
    validFrom: '2026-02-03',
    validUntil: null,
    issuedOn: '2026-02-03',
    certificateImage: '/blugene/certifications/usda-certificate.png',
    certificateSize: { width: 689, height: 524 },
    logoImage: '/2BioPreferredLabel.PNG',
    hasScopeNote: true,
  },
  {
    id: 'okbiobased',
    displayName: 'TÜV AUSTRIA OK biobased — Class 5',
    issuer: 'TÜV AUSTRIA GMBH',
    number: 'TA8072609668',
    productOnCertificate: 'CB Bio Indigo Dye Powder (Colour: indigo)',
    page: 11,
    validFrom: '2026-02-17',
    validUntil: '2031-02-17',
    issuedOn: '2026-02-17',
    certificateImage: '/blugene/certifications/okbiobased-certificate.png',
    certificateSize: { width: 590, height: 851 },
    logoImage: '/1okbiobased.png',
    hasScopeNote: true,
  },
];

/** OK biobased Class 5 의 정의 — 인증서 원문 그대로 */
export const okBiobasedClass = { class: 5, min: 97, max: 100 } as const;

export type DocumentStatus = 'within-document-period' | 'past-document-period' | 'no-expiry-printed';

/**
 * 인증서 **문서에 적힌 기간**과 현재 시각을 비교한다.
 * 인증의 실제 유효 여부를 단정하지 않는다 — 문서 기간이 지났는지만 알려준다.
 */
export function documentStatus(cert: Certification, now: Date = new Date()): DocumentStatus {
  if (!cert.validUntil) return 'no-expiry-printed';
  // 유효 종료일의 하루 끝까지 기간 내로 본다.
  const end = new Date(`${cert.validUntil}T23:59:59Z`);
  return now.getTime() <= end.getTime() ? 'within-document-period' : 'past-document-period';
}

/** 다음 인증 상태 점검 권장일 = 가장 이른 문서 만료일 */
export const nextReviewDate = certifications
  .map((c) => c.validUntil)
  .filter((d): d is string => Boolean(d))
  .sort()[0];

export const certificationsAsOf = SOURCE_AS_OF;
