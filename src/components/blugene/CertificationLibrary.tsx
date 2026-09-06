import type { ReactNode } from 'react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import SectionHeading from '@/components/blugene/SectionHeading';
import SourceNote from '@/components/blugene/SourceNote';
import ZoomableImage from '@/components/blugene/ZoomableImage';
import {
  certifications,
  certificationsAsOf,
  documentStatus,
  nextReviewDate,
} from '@/data/blugene/certifications';
import type { Certification, DocumentStatus } from '@/data/blugene/certifications';

/**
 * 인증 라이브러리 — 제공 카탈로그 p.10-11 에 수록된 4개 인증서를 카드로 보여 준다.
 * (ZDHC MRSL / OEKO-TEX ECO PASSPORT / USDA BioPreferred / TÜV AUSTRIA OK biobased)
 *
 * 로고만 나란히 늘어놓는 '신뢰 배너'를 만들지 않는다. 카드마다
 * 인증기관 · 인증번호 · 인증서에 적힌 제품명 · 문서상 유효기간 · 문서 발행일 · 카탈로그 쪽 ·
 * 그 인증의 적용 범위를 함께 적고, 원본 인증서를 확대해 확인할 수 있게 한다.
 *
 * 근거와 한계
 * - 표시하는 값은 모두 `src/data/blugene/certifications.ts` 의 인증서 원본 판독값이다.
 *   인증기관 데이터베이스를 실시간 조회한 결과가 아니므로, 상태 배지에는 언제나
 *   t('statusDocumented')(카탈로그 수록 자료)를 함께 붙이고 t('verificationNote') 로 그 한계를 밝힌다.
 * - `documentStatus(cert)` 는 인자 없이 호출해 현재 시각과 **문서에 적힌 기간**만 비교한다.
 *   인증 자체의 유효 여부를 단정하지 않는다.
 * - 인증서의 제품명은 `CB Bio Indigo Dye Powder` 이며 Blugene 으로 고쳐 쓰지 않는다(t('brandNameNote')).
 * - 분말 인증이 디지털 프린팅 잉크나 최종 데님 의류까지 확장된다고 말하지 않는다(t('scopeNote')).
 */

/** 문서 기간 상태별 배지 스타일. 만료 배지는 문장 자체로 뜻이 전달되며 색에만 기대지 않는다. */
const STATUS_BADGE_STYLE: Record<DocumentStatus, string> = {
  'within-document-period':
    'border-[color:var(--color-washed)] bg-[var(--color-ivory)] text-[var(--color-denim)]',
  'past-document-period':
    'border-[color:var(--color-indigo-deep)] bg-[var(--color-indigo-deep)] text-white',
  'no-expiry-printed':
    'border-[color:var(--color-washed)] bg-white text-[var(--color-slate-muted)]',
};

const BADGE_BASE =
  'inline-block rounded-md border px-2.5 py-1 text-[0.72rem] leading-snug font-medium break-keep';

function Badge({ className = '', children }: { className?: string; children: ReactNode }) {
  return <li className={`${BADGE_BASE} ${className}`}>{children}</li>;
}

/** 카드 안의 라벨 · 값 한 쌍 */
function DetailRow({
  term,
  valueClassName = '',
  children,
}: {
  term: string;
  valueClassName?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <dt className="text-[0.7rem] font-semibold tracking-[0.08em] break-keep text-[var(--color-denim)]">
        {term}
      </dt>
      <dd
        className={`mt-1 text-[0.8125rem] leading-relaxed break-keep text-[var(--color-ink)] ${valueClassName}`}
      >
        {children}
      </dd>
    </div>
  );
}

/**
 * 문서에 적힌 유효기간 문자열.
 * 시작일이 없는 인증서(OEKO-TEX)는 종료일만, 종료일이 없는 인증서(USDA)는 시작일만 적는다.
 * 없는 날짜를 지어내지 않는다.
 */
function printedPeriod(cert: Certification): string | null {
  if (cert.validFrom && cert.validUntil) return `${cert.validFrom} ~ ${cert.validUntil}`;
  if (cert.validUntil) return `~ ${cert.validUntil}`;
  if (cert.validFrom) return `${cert.validFrom} ~`;
  return null;
}

async function CertificationCard({
  cert,
  compact,
}: {
  cert: Certification;
  compact: boolean;
}) {
  const t = await getTranslations('Certifications');
  const tCommon = await getTranslations('Common');

  const status = documentStatus(cert);
  const statusLabel =
    status === 'within-document-period'
      ? t('statusWithinPeriod')
      : status === 'past-document-period'
        ? t('statusPastPeriod')
        : t('noExpiry');

  const period = printedPeriod(cert);
  const certificateAlt = t('certificateAlt', { name: cert.displayName });

  return (
    <li className="flex h-full flex-col rounded-lg border border-[color:var(--color-washed)] bg-white">
      {/* 인증 마크 + 인증명 */}
      <div
        className={`flex items-start gap-4 border-b border-[color:var(--color-washed)] ${
          compact ? 'p-5 pb-4' : 'p-6 pb-5 sm:p-7 sm:pb-5'
        }`}
      >
        <span
          className={`relative shrink-0 ${compact ? 'h-9 w-[5.25rem]' : 'h-11 w-[6.5rem]'}`}
        >
          <Image
            src={cert.logoImage}
            alt={t('logoAlt', { name: cert.displayName })}
            fill
            sizes={compact ? '84px' : '104px'}
            className="object-contain object-left"
          />
        </span>
        <h3
          className={`leading-snug font-bold tracking-[-0.01em] break-keep text-[var(--color-indigo-deep)] ${
            compact ? 'text-[0.9375rem]' : 'text-[1.0625rem] sm:text-lg'
          }`}
        >
          {cert.displayName}
        </h3>
      </div>

      <div className={`flex flex-1 flex-col ${compact ? 'p-5' : 'p-6 sm:p-7'}`}>
        {/* 상태 — 문서 기간 판정과 '카탈로그 수록 자료'라는 사실을 언제나 함께 적는다 */}
        <ul className="flex flex-wrap gap-2">
          <Badge className={STATUS_BADGE_STYLE[status]}>{statusLabel}</Badge>
          <Badge className="border-[color:var(--color-washed)] bg-white text-[var(--color-slate-muted)]">
            {t('statusDocumented')}
          </Badge>
        </ul>

        <div
          className={`mt-6 flex flex-1 flex-col ${
            compact ? 'gap-5' : 'gap-6 sm:flex-row sm:gap-7'
          }`}
        >
          <dl className={`flex-1 grid gap-4 ${compact ? '' : 'sm:grid-cols-2'}`}>
            <DetailRow term={t('numberLabel')} valueClassName="tabular-nums [overflow-wrap:anywhere]">
              {cert.number}
            </DetailRow>
            <DetailRow term={t('issuerLabel')}>{cert.issuer}</DetailRow>
            <DetailRow term={t('productLabel')}>{cert.productOnCertificate}</DetailRow>
            <DetailRow term={t('validityLabel')}>
              {period && <span className="tabular-nums">{period}</span>}
              {!cert.validUntil && (
                <span className={period ? 'block text-[var(--color-slate-muted)]' : undefined}>
                  {t('noExpiry')}
                </span>
              )}
            </DetailRow>
            {/* compact 에서는 발행일 · 카탈로그 쪽을 줄이고, 쪽 번호는 썸네일 캡션으로 옮긴다 */}
            {!compact && cert.issuedOn && (
              <DetailRow term={t('issuedLabel')} valueClassName="tabular-nums">
                {cert.issuedOn}
              </DetailRow>
            )}
            {!compact && (
              <DetailRow term={t('pageLabel')} valueClassName="tabular-nums">
                {cert.page}
              </DetailRow>
            )}
          </dl>

          {/* 원본 인증서 — 썸네일은 작게, 확대하면 원본 비율 그대로 */}
          <div className={compact ? 'w-full max-w-[9rem]' : 'w-full sm:w-[9.5rem] sm:shrink-0'}>
            <ZoomableImage
              src={cert.certificateImage}
              alt={certificateAlt}
              width={cert.certificateSize.width}
              height={cert.certificateSize.height}
              sizes={compact ? '(max-width: 640px) 60vw, 144px' : '(max-width: 640px) 70vw, 152px'}
              openLabel={t('zoomOpen')}
              closeLabel={t('zoomClose')}
              hint={t('zoomHint')}
              caption={
                compact
                  ? `${tCommon('sourceLabel')}: ${tCommon('cataloguePage', { page: cert.page })}`
                  : undefined
              }
            />
          </div>
        </div>

        {/* 이 인증이 무엇을 어디까지 말해 주는지 — 인증마다 다르므로 카드 안에서 개별로 밝힌다 */}
        <p
          className={`mt-6 border-t border-[color:var(--color-washed)] pt-5 leading-relaxed break-keep text-[var(--color-slate-muted)] ${
            compact ? 'text-[0.75rem]' : 'text-[0.8125rem]'
          }`}
        >
          {t(`${cert.id}Scope`)}
        </p>
      </div>
    </li>
  );
}

export default async function CertificationLibrary({
  compact = false,
}: {
  compact?: boolean;
}) {
  const t = await getTranslations('Certifications');

  return (
    <div>
      {/* compact 로 쓰는 쪽(홈 · 블로그)은 이미 자기 제목을 갖고 있으므로 제목을 겹쳐 쓰지 않는다 */}
      {!compact && <SectionHeading title={t('title')} body={t('body')} />}

      <ul
        className={`grid grid-cols-1 ${
          compact
            ? 'mt-0 gap-5 sm:grid-cols-2 lg:grid-cols-4'
            : 'mt-12 gap-6 lg:grid-cols-2'
        }`}
      >
        {certifications.map((cert) => (
          <CertificationCard key={cert.id} cert={cert} compact={compact} />
        ))}
      </ul>

      {/* 인증을 읽는 조건 — 각주로 숨기지 않고 목록 바로 아래 본문에서 밝힌다 */}
      <div className="mt-10 border-t border-[color:var(--color-washed)] pt-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-12">
          <div className="max-w-3xl space-y-2.5">
            <SourceNote>{t('verificationNote')}</SourceNote>
            <SourceNote>{t('brandNameNote')}</SourceNote>
            <SourceNote>{t('scopeNote')}</SourceNote>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2 lg:w-[19rem]">
            <div>
              <dt className="text-[0.7rem] font-semibold tracking-[0.08em] break-keep text-[var(--color-denim)]">
                {t('asOfLabel')}
              </dt>
              <dd className="mt-1 text-[0.8125rem] leading-relaxed tabular-nums text-[var(--color-ink)]">
                {certificationsAsOf}
              </dd>
            </div>
            <div>
              <dt className="text-[0.7rem] font-semibold tracking-[0.08em] break-keep text-[var(--color-denim)]">
                {t('nextReviewLabel')}
              </dt>
              <dd className="mt-1 text-[0.8125rem] leading-relaxed tabular-nums text-[var(--color-ink)]">
                {nextReviewDate}
              </dd>
            </div>
          </dl>
        </div>

        <Link
          href="/contact"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-denim)] underline underline-offset-4 hover:text-[var(--color-indigo-deep)]"
        >
          {t('requestLatest')}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
