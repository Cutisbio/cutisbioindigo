import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Home' });

  return {
    title: {
      template: '%s | CutisBio Indigo',
      default: t('title'),
    },
    description: t('subtitle'),
    openGraph: {
      title: t('title'),
      description: t('subtitle'),
      siteName: 'CutisBio Indigo',
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      type: 'website',
    },
  };
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: 'Layout' });

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <NextIntlClientProvider messages={messages}>
          <header className="w-full bg-white border-b sticky top-0 z-50">
            <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="text-xl font-bold">
                <Link href="/">CutisBio Indigo</Link>
              </div>
              <div className="flex items-center space-x-6">
                <ul className="flex space-x-6">
                  <li><Link href="/" className="hover:text-blue-600 transition">{t('home')}</Link></li>
                  <li><Link href="/blog/sustainable-indigo" className="hover:text-blue-600 transition">{t('tech')}</Link></li>
                </ul>
                <div className="border-l pl-4 border-gray-300">
                  <LanguageSwitcher />
                </div>
              </div>
            </nav>
          </header>

          <main className="flex-grow w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>

          <footer className="w-full bg-gray-100 border-t mt-auto">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-gray-500">
              <p>&copy; {new Date().getFullYear()} CutisBio. All rights reserved.</p>
              <p className="mt-2">{t('footerText')}</p>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
