"use client";

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function HeroSection() {
  const t = useTranslations('Home');

  return (
    <section className="relative w-[100vw] h-[100vh] flex items-center justify-center bg-black text-white overflow-hidden left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      {/* Background Video */}
      <video
        src="/jeanforest.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      
      {/* 40% Black Semi-transparent Overlay */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-6xl mx-auto flex flex-col items-center">
        <motion.h1
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-4 sm:mb-6 leading-[1.1] drop-shadow-2xl text-white break-keep"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {t('heroTitle')}
        </motion.h1>
        
        <motion.p
          className="text-lg sm:text-xl md:text-2xl text-slate-200 max-w-3xl font-medium leading-relaxed drop-shadow-lg break-keep mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          {t('heroSubtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        >
          <Link 
            href="/tech" 
            className="inline-block px-8 py-3 sm:px-10 sm:py-4 border-2 border-white text-white rounded-full bg-transparent hover:bg-white hover:text-black transition-all duration-300 font-semibold text-base sm:text-lg tracking-wide shadow-sm"
          >
            자세히 보기
          </Link>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-12 z-20 flex cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          className="p-4"
        >
          <ChevronDown className="w-10 h-10 text-white opacity-70 hover:opacity-100 transition-opacity" />
        </motion.div>
      </motion.div>
    </section>
  );
}
