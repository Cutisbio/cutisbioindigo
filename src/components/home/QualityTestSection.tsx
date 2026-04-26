"use client";

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import StrictImage from '@/components/ui/StrictImage';
import { CheckCircle } from 'lucide-react';

export default function QualityTestSection() {
  const t = useTranslations('Home');

  return (
    <section className="py-20 md:py-28 bg-slate-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left: Image Side */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 lg:order-1 relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-white border border-gray-100 group"
          >
            <StrictImage 
              src="/test.png" 
              alt={t('qualityImageAlt')} 
              fill 
              className="object-contain p-4 sm:p-6 transition-transform duration-700 group-hover:scale-105" 
            />
            {/* Subtle inner shadow overlay */}
            <div className="absolute inset-0 shadow-inner rounded-3xl pointer-events-none" />
          </motion.div>

          {/* Right: Text Side */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="order-1 lg:order-2 flex flex-col justify-center"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-100/80 text-blue-800 px-4 py-2 rounded-full font-semibold text-sm tracking-wide w-fit mb-6 shadow-sm border border-blue-200">
              <CheckCircle className="w-4 h-4" />
              <span>{t('qualityBadge')}</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight break-keep tracking-tight">
              {t('qualityTitle')}
            </h2>
            
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed break-keep font-medium">
              {t('qualitySubtitle')}
            </p>

            {/* Optional subtle design element underneath */}
            <div className="mt-8 pt-8 border-t border-gray-200/60">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                  <span className="text-xl">🇯🇵</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Premium Denim Partner</div>
                  <div className="text-sm text-gray-500">Verified Quality Test Results</div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
