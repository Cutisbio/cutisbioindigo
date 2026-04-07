'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <select
        value={locale}
        onChange={handleLanguageChange}
        aria-label="Select language"
        className="bg-transparent text-sm font-medium focus:outline-none appearance-none cursor-pointer pr-4 text-gray-700"
      >
        <option value="ko">🇰🇷 한국어 (KO)</option>
        <option value="en">🇺🇸 English (EN)</option>
        <option value="ja">🇯🇵 日本語 (JA)</option>
        <option value="zh">🇨🇳 中文 (ZH)</option>
        <option value="bn">🇧🇩 বাংলা (BN)</option>
        <option value="tr">🇹🇷 Türkçe (TR)</option>
      </select>
    </div>
  );
}
