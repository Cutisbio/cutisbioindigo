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
 * variant
 * - full    (/data-certifications) 제목 · 상세 카드 · 읽는 조건(각주 · 자료 기준일 · 점검 권장일).
 * - compact (블로그) 상세 카드를 4열로 줄인다. 발행일 · 카탈로그 쪽은 썸네일 캡션으로 옮긴다.
 * - gallery (홈) 인증 마크 · 인증명 · 원본 인증서 이미지만 그린다 (2026-09-11 고객 요청).
 *   로고 배너가 아니라 원본 문서 자체를 보여 주고 확대할 수 있게 하며, 상세와 읽는 조건은
 *   같은 섹션의 링크가 가리키는 /data-certifications 에서 그대로 확인할 수 있다.
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
            {/* 만료일이 없다는 사실은 바로 위 상태 배지가 이미 말한다.
                여기서 t('noExpiry') 를 한 번 더 쓰면 같은 문장이 한 카드 안에 두 번 나온다.
                (period 가 아예 없는 인증서를 대비해 대체 표기로만 남긴다.) */}
            <DetailRow term={t('validityLabel')} valueClassName="tabular-nums">
              {period ?? t('noExpiry')}
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

/**
 * 홈용 카드 — 인증 마크 · 인증명 · 원본 인증서 이미지만 그린다.
 * 상태 배지 · 인증번호 · 기관 · 유효기간 · 적용 범위 · 출처 캡션은 full · compact 카드에만 있다.
 * 인증서는 세로 3장 · 가로 1장(USDA)이라 높이가 다르다. 자르지 않고 2:3 틀 안에서 세로 가운데 맞춤 해
 * 네 카드의 이미지 영역을 같은 크기로 맞춘다.
 */
async function CertificationGalleryCard({ cert }: { cert: Certification }) {
  const t = await getTranslations('Certifications');

  return (
    <li className="flex h-full flex-col gap-4 rounded-lg border border-[color:var(--color-washed)] bg-white p-4 sm:p-5">
      {/* 인증 마크 + 인증명 — compact 카드의 머리와 같은 구성. 2열 모바일에서는 폭이 좁아 마크를 제목 위에 놓는다 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <span className="relative h-9 w-[5.25rem] shrink-0">
          <Image
            src={cert.logoImage}
            alt={t('logoAlt', { name: cert.displayName })}
            fill
            sizes="84px"
            className="object-contain object-left"
          />
        </span>
        <h3 className="text-[0.9375rem] leading-snug font-bold tracking-[-0.01em] break-keep text-[var(--color-indigo-deep)]">
          {cert.displayName}
        </h3>
      </div>
      {/* 제목 줄 수가 달라도 이미지 틀이 나란히 놓이도록 틀을 카드 아래쪽에 붙인다 */}
      <div className="mt-auto flex aspect-[2/3] flex-col justify-center">
        <ZoomableImage
          src={cert.certificateImage}
          alt={t('certificateAlt', { name: cert.displayName })}
          width={cert.certificateSize.width}
          height={cert.certificateSize.height}
          sizes="(max-width: 1023px) 44vw, 272px"
          openLabel={t('zoomOpen')}
          closeLabel={t('zoomClose')}
          hint={t('zoomHint')}
        />
      </div>
    </li>
  );
}

export type CertificationLibraryVariant = 'full' | 'compact' | 'gallery';

export default async function CertificationLibrary({
  variant = 'full',
}: {
  variant?: CertificationLibraryVariant;
}) {
  const t = await getTranslations('Certifications');
  const compact = variant === 'compact';
  /* 남은 만료일이 없으면 null 이다. 그때는 '다음 점검 권장일' 자체를 그리지 않는다 —
     지난 날짜를 '다음'이라고 부르는 것보다 항목이 없는 편이 정확하다.
     페이지의 revalidate=86400 덕분에 하루 단위로 다시 계산된다. */
  const reviewDate = nextReviewDate();

  return (
    <div>
      {/* compact · gallery 로 쓰는 쪽(블로그 · 홈)은 이미 자기 제목을 갖고 있으므로 제목을 겹쳐 쓰지 않는다 */}
      {variant === 'full' && <SectionHeading title={t('title')} body={t('body')} />}

      <ul
        className={`grid ${
          variant === 'gallery'
            ? 'mt-0 grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4'
            : compact
              ? 'mt-0 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'
              : 'mt-12 grid-cols-1 gap-6 lg:grid-cols-2'
        }`}
      >
        {certifications.map((cert) =>
          variant === 'gallery' ? (
            <CertificationGalleryCard key={cert.id} cert={cert} />
          ) : (
            <CertificationCard key={cert.id} cert={cert} compact={compact} />
          ),
        )}
      </ul>

      {/* 인증을 읽는 조건 — 각주로 숨기지 않고 목록 바로 아래 본문에서 밝힌다.
          gallery(홈)는 상세를 그리지 않으므로 이 조건도 상세와 함께 /data-certifications 에서 읽게 한다. */}
      {variant !== 'gallery' && (
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
              {reviewDate && (
                <div>
                  <dt className="text-[0.7rem] font-semibold tracking-[0.08em] break-keep text-[var(--color-denim)]">
                    {t('nextReviewLabel')}
                  </dt>
                  <dd className="mt-1 text-[0.8125rem] leading-relaxed tabular-nums text-[var(--color-ink)]">
                    {reviewDate}
                  </dd>
                </div>
              )}
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
      )}
    </div>
  );
}
