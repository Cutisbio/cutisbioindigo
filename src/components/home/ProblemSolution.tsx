"use client";

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function ProblemSolution() {
  const t = useTranslations('ProblemSolution');

  return (
    <section className="py-24 sm:py-32 px-6 sm:px-12 lg:px-24 bg-white text-slate-900 border-b border-slate-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Problem */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col justify-center"
        >
          <span className="text-rose-600 font-bold tracking-widest uppercase mb-4 text-sm md:text-base break-keep">The Problem</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-8 leading-[1.1] tracking-tight break-keep">
            {t('problemTitle')}
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 leading-relaxed font-medium break-keep">
            {t('problemText')}
          </p>
        </motion.div>

        {/* Solution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="flex flex-col justify-center p-10 sm:p-14 bg-slate-50 rounded-[2rem] shadow-sm border border-slate-100"
        >
          <span className="text-blue-600 font-bold tracking-widest uppercase mb-4 text-sm md:text-base break-keep">The Solution</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight break-keep">
            {t('solutionTitle')}
          </h2>
          <p className="text-lg sm:text-xl text-slate-700 leading-relaxed font-medium break-keep">
            {t('solutionText')}
          </p>
        </motion.div>

      </div>
    </section>
  );
}
