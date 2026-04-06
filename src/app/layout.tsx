import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | CutisBio Indigo',
    default: 'CutisBio Indigo - 지속가능한 미생물 발효 데님 염료',
  },
  description: '아닐린 프리(Aniline-free) 및 인체에 안전한 미생물 발효 기반의 지속가능한 인디고 염료 솔루션입니다.',
  openGraph: {
    title: 'CutisBio Indigo - 지속가능한 인디고 데님 염료',
    description: '아닐린 프리(Aniline-free) 및 인체에 안전한 미생물 발효 기반의 지속가능한 인디고 염료 솔루션입니다.',
    siteName: 'CutisBio Indigo',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <header className="w-full bg-white border-b sticky top-0 z-50">
          <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="text-xl font-bold">
              <a href="/">CutisBio Indigo</a>
            </div>
            <ul className="flex space-x-6">
              <li><a href="/" className="hover:text-blue-600 transition">홈</a></li>
              <li><a href="/blog/sustainable-indigo" className="hover:text-blue-600 transition">기술 소개</a></li>
            </ul>
          </nav>
        </header>

        <main className="flex-grow w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        <footer className="w-full bg-gray-100 border-t mt-auto">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} CutisBio. All rights reserved.</p>
            <p className="mt-2">Sustainable Denim Dye. Aniline free - Human safe.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
