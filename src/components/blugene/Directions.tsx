import { getTranslations } from 'next-intl/server';
import ContactDetails from '@/components/blugene/ContactDetails';
import MapEmbed from '@/components/blugene/MapEmbed';

/** 지도 검색어 — 로마자 주소를 써서 언어와 무관하게 같은 지점이 해석되게 한다 */
const MAP_QUERY = '842 Nonhyeon-ro, Gangnam-gu, Seoul, Korea';

/**
 * 「찾아오시는 길」 블록 — 제목 · 주소(현지어 + 로마자) · 구글 지도 · 연락처(이메일 · 전화).
 *
 * /contact 의 오른쪽 열에 있던 것을 2026-10-06 고객 요청으로 떼어 내 /about 맨 아래에도 둔다. 문구는 Contact.* 와 Inquiry.* 를
 * 그대로 쓰고, 연락처 값은 evidence.ts 하나에서만 온다. 제목 요소는 페이지 구조에 맞춰 고른다(/contact 는 h2, /about 도 h2).
 */
export default async function Directions({
  locale,
  className = '',
}: {
  locale: string;
  className?: string;
}) {
  const t = await getTranslations({ locale, namespace: 'Contact' });
  const q = encodeURIComponent(MAP_QUERY);

  return (
    <div className={className}>
      <h2 className="text-xl font-semibold break-keep text-[var(--color-indigo-deep)]">{t('mapTitle')}</h2>
      <p className="mt-4 text-base leading-relaxed break-keep whitespace-pre-line text-[var(--color-ink)]/85">
        {t('addressDetail')}
      </p>
      <MapEmbed
        src={`https://maps.google.com/maps?q=${q}&hl=${locale}&z=16&ie=UTF8&iwloc=&output=embed`}
        title={t('mapTitle')}
        openHref={`https://www.google.com/maps/search/?api=1&query=${q}`}
        openLabel={t('mapOpen')}
        newTabLabel={t('mapNewTab')}
      />
      {/* 연락처는 문의 폼이 아니라 지도 옆에 둔다 — 같은 '찾아오시는 길' 정보다 */}
      <ContactDetails locale={locale} />
    </div>
  );
}
