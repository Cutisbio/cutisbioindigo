"use client";

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Quote } from 'lucide-react';

export default function PartnersPress() {
  const t = useTranslations('Partners');

  // Duplicated for marquee effect
  const DUMMY_LOGOS = [
    "BBC", "Forbes", "VOGUE", "WIRED", "FastCompany", "TechCrunch",
    "BBC", "Forbes", "VOGUE", "WIRED", "FastCompany", "TechCrunch", 
    "BBC", "Forbes", "VOGUE", "WIRED", "FastCompany", "TechCrunch"
  ];

  return (
    <section className="py-24 sm:py-32 bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 sm:px-12 text-center mb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Quote className="w-16 h-16 sm:w-24 sm:h-24 text-blue-100 mx-auto mb-10" />
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl sm:text-5xl md:text-6xl font-serif italic text-slate-800 leading-snug sm:leading-normal mb-10 break-keep"
        >
          {t('testimonial')}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-2xl font-bold text-slate-400 uppercase tracking-widest"
        >
          — {t('testimonialAuthor')}
        </motion.p>
      </div>

      <div className="w-full border-y border-slate-100 py-16 bg-slate-50 relative flex overflow-x-hidden">
        {/* Rolling Banner Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />
        
        <motion.div
          animate={{ x: [0, -2000] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
          className="flex items-center space-x-16 sm:space-x-32 pr-16 sm:pr-32 whitespace-nowrap"
        >
          {DUMMY_LOGOS.map((logo, idx) => (
            <div key={idx} className="text-3xl sm:text-5xl font-black text-slate-300 grayscale select-none uppercase tracking-tighter">
              {logo}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
