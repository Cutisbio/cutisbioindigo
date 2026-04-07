"use client";

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function TechnologyProcess() {
  const t = useTranslations('Process');

  const steps = [
    { num: '01', titleKey: 'step1Title', textKey: 'step1Text' },
    { num: '02', titleKey: 'step2Title', textKey: 'step2Text' },
    { num: '03', titleKey: 'step3Title', textKey: 'step3Text' },
    { num: '04', titleKey: 'step4Title', textKey: 'step4Text' },
  ];

  return (
    <section className="py-24 sm:py-32 bg-slate-50 border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="text-center mb-20 sm:mb-32">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 text-slate-900 tracking-tight break-keep">
            {t('title')}
          </h2>
          <p className="text-xl sm:text-2xl text-slate-600 font-medium break-keep">
            {t('subtitle')}
          </p>
        </div>

        <div className="space-y-24 sm:space-y-32">
          {steps.map((step, index) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-150px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`flex flex-col lg:flex-row gap-10 lg:gap-20 items-center ${
                index % 2 !== 0 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="flex-1 w-full">
                {/* Visual placeholder */}
                <div className="aspect-square sm:aspect-[4/3] w-full bg-slate-200 rounded-[2rem] shadow-sm flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-300 to-slate-100 opacity-50 group-hover:scale-105 transition-transform duration-700" />
                  <div className="text-[10rem] sm:text-[15rem] font-black text-white/70 absolute select-none tracking-tighter drop-shadow-md">
                    {step.num}
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full">
                <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-bold text-sm tracking-widest mb-6">
                  STEP {step.num}
                </span>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight break-keep">
                  {t(step.titleKey as any)}
                </h3>
                <p className="text-lg sm:text-xl md:text-2xl text-slate-600 leading-relaxed font-medium break-keep">
                  {t(step.textKey as any)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
