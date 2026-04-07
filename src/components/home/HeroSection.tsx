"use client";

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';

export default function HeroSection() {
  const t = useTranslations('Home');

  return (
    <section className="relative w-full h-[100vh] flex items-center justify-center bg-slate-950 text-white overflow-hidden">
      {/* Background Placeholder: Replace with Video or high-q Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-blue-900/40 to-slate-950 opacity-80" />
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950/80 to-slate-950" />
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-6xl mx-auto flex flex-col items-center">
        <motion.h1
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 sm:mb-8 leading-[1.1] drop-shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {t('heroTitle')}
        </motion.h1>
        
        <motion.p
          className="text-base sm:text-xl md:text-2xl text-slate-300 max-w-3xl font-medium leading-relaxed drop-shadow-lg break-keep"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          {t('heroSubtitle')}
        </motion.p>
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
