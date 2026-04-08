"use client";

import { useState, useEffect } from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function Header() {
  const t = useTranslations('Layout');
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    // trigger once on load
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isHome = pathname === '/';
  const isTransparent = isHome && !isScrolled && !isMobileMenuOpen;

  const headerBg = isTransparent ? 'bg-transparent border-transparent' : 'bg-white border-b border-gray-200 shadow-sm';
  const logoColor = isTransparent ? 'text-white drop-shadow-md' : 'text-black';
  const textColor = isTransparent ? 'text-white drop-shadow-sm' : 'text-gray-700';
  const hoverColor = isTransparent ? 'hover:text-blue-200' : 'hover:text-blue-600';
  const iconColor = isTransparent ? 'text-white drop-shadow-sm' : 'text-gray-600';

  return (
    <header className={`w-full fixed top-0 z-50 transition-all duration-300 pt-6 sm:pt-10 pb-3 sm:pb-4 ${headerBg}`}>
      <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        <div className={`text-xl font-bold whitespace-nowrap break-keep transition-colors duration-300 ${logoColor}`}>
          <Link href="/">CutisBio Indigo</Link>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <ul className={`flex space-x-6 transition-colors duration-300 ${textColor}`}>
            <li><Link href="/" className={`${hoverColor} transition whitespace-nowrap break-keep`}>{t('home')}</Link></li>
            <li><Link href="/about" className={`${hoverColor} transition whitespace-nowrap break-keep`}>{t('about')}</Link></li>
            <li><Link href="/blog/sustainable-indigo" className={`${hoverColor} transition whitespace-nowrap break-keep`}>{t('tech')}</Link></li>
            <li><Link href="/news" className={`${hoverColor} transition whitespace-nowrap break-keep`}>{t('news')}</Link></li>
            <li><Link href="/contact" className={`${hoverColor} transition whitespace-nowrap break-keep`}>{t('contact')}</Link></li>
          </ul>
          <div className="border-l pl-4 border-gray-300">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={toggleMobileMenu}
            className={`p-2 focus:outline-none transition-colors duration-300 ${iconColor}`}
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b absolute w-full left-0 top-full shadow-lg text-gray-800">
          <ul className="flex flex-col px-4 pt-2 pb-4 space-y-2">
            <li><Link href="/" onClick={toggleMobileMenu} className="block py-3 hover:text-blue-600 transition whitespace-nowrap break-keep text-base font-medium">{t('home')}</Link></li>
            <li><Link href="/about" onClick={toggleMobileMenu} className="block py-3 hover:text-blue-600 transition whitespace-nowrap break-keep text-base font-medium">{t('about')}</Link></li>
            <li><Link href="/blog/sustainable-indigo" onClick={toggleMobileMenu} className="block py-3 hover:text-blue-600 transition whitespace-nowrap break-keep text-base font-medium">{t('tech')}</Link></li>
            <li><Link href="/news" onClick={toggleMobileMenu} className="block py-3 hover:text-blue-600 transition whitespace-nowrap break-keep text-base font-medium">{t('news')}</Link></li>
            <li><Link href="/contact" onClick={toggleMobileMenu} className="block py-3 hover:text-blue-600 transition whitespace-nowrap break-keep text-base font-medium">{t('contact')}</Link></li>
            <li className="pt-4 mt-2 border-t border-gray-100 flex justify-between items-center mb-2">
              <span className="text-gray-500 whitespace-nowrap break-keep font-medium">Language</span>
              <LanguageSwitcher />
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
