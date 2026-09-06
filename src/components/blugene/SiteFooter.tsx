import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Wordmark from '@/components/blugene/Wordmark';
import { FOOTER_NAV, PRIMARY_NAV } from '@/data/blugene/site';
import { CATALOGUE, SOURCE_AS_OF, contact } from '@/data/blugene/evidence';

export default async function SiteFooter() {
  const t = await getTranslations('Footer');
  const tNav = await getTranslations('Nav');
  const tInq = await getTranslations('Inquiry');

  return (
    <footer className="on-indigo mt-auto w-full bg-[var(--color-indigo-deep)] text-white">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_1fr_1.3fr] lg:px-8 lg:py-16">
        <div>
          <Wordmark size="md" tone="inverse" href={null} />
          <p className="blugene-tagline mt-5 text-[0.7rem] text-white/60">{t('tagline')}</p>
          <p className="mt-6 text-sm text-white/70">{t('companyLine')}</p>
        </div>

        <nav aria-label={t('sitemapTitle')}>
          <h2 className="text-xs font-semibold tracking-[0.18em] text-white/50 uppercase">
            {t('sitemapTitle')}
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[...PRIMARY_NAV, ...FOOTER_NAV].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="break-keep text-white/85 hover:text-white hover:underline">
                  {tNav(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-semibold tracking-[0.18em] text-white/50 uppercase">
            {t('contactTitle')}
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm text-white/85">
            <li>
              <span className="text-white/50">{tInq('emailLabel')} </span>
              <a href={`mailto:${contact.email}`} className="break-all hover:underline">
                {contact.email}
              </a>
            </li>
            <li>
              <span className="text-white/50">{tInq('telLabel')} </span>
              <a href={`tel:${contact.telHref}`} className="hover:underline">
                {contact.tel}
              </a>
            </li>
            <li className="break-keep">
              <span className="text-white/50">{tInq('addressLabel')} </span>
              {contact.address}
            </li>
          </ul>

          <h2 className="mt-8 text-xs font-semibold tracking-[0.18em] text-white/50 uppercase">
            {t('legalTitle')}
          </h2>
          <p className="mt-3 max-w-md text-xs leading-relaxed break-keep text-white/60">
            {t('sourceNote', { date: SOURCE_AS_OF })}
          </p>
          <a
            href={CATALOGUE.pdfHref}
            className="mt-3 inline-block text-xs font-medium text-white/85 underline underline-offset-4 hover:text-white"
          >
            {t('catalogueLink')}
          </a>
        </div>
      </div>

      <div className="border-t border-white/15">
        <p className="mx-auto max-w-[1280px] px-4 py-5 text-xs text-white/50 sm:px-6 lg:px-8">
          {t('rights')}
        </p>
      </div>
    </footer>
  );
}
