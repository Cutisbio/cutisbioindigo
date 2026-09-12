import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import SchemaOrg, { buildOrganizationSchema } from '@/components/seo/SchemaOrg';
import SectionHeading from '@/components/blugene/SectionHeading';
import SampleInquiryPanel from '@/components/blugene/SampleInquiryPanel';
import MapEmbed from '@/components/blugene/MapEmbed';
import ContactDetails from '@/components/blugene/ContactDetails';
import { BRAND, LOCALES, SITE_URL, buildPageMetadata } from '@/data/blugene/site';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Contact' });
  return buildPageMetadata({
    locale,
    path: '/contact',
    title: t('title'),
    description: t('description'),
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Contact' });
  const tInq = await getTranslations({ locale, namespace: 'Inquiry' });
  const orgSchema = buildOrganizationSchema(BRAND.company, SITE_URL, `${SITE_URL}/brand/cutisbio-logo.png`);

  return (
    <>
      <SchemaOrg schema={orgSchema} />

      <section className="w-full border-b border-[color:var(--color-washed)] bg-[var(--color-ivory)]">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <SectionHeading
            headingLevel="h1"
            eyebrow={tInq('eyebrow')}
            title={t('title')}
            body={t('description')}
            size="hero"
          />
        </div>
      </section>

      <section className="w-full bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <SampleInquiryPanel />

            <div>
              <h2 className="text-xl font-semibold break-keep text-[var(--color-indigo-deep)]">
                {t('mapTitle')}
              </h2>
              <p className="mt-4 text-base leading-relaxed break-keep whitespace-pre-line text-[var(--color-ink)]/85">
                {t('addressDetail')}
              </p>
              {/* 검색어는 로마자 주소를 써서 언어와 무관하게 같은 지점이 해석되게 한다 */}
              <MapEmbed
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  '842 Nonhyeon-ro, Gangnam-gu, Seoul, Korea'
                )}&hl=${locale}&z=16&ie=UTF8&iwloc=&output=embed`}
                title={t('mapTitle')}
                openLabel={t('mapTitle')}
              />
              {/* 연락처는 문의 폼이 아니라 지도 옆에 둔다 — 같은 '찾아오시는 길' 정보다 */}
              <ContactDetails locale={locale} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
