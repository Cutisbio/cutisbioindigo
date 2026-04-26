"use client";

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import StrictImage from '@/components/ui/StrictImage';

export default function CertificationsSection() {
  const t = useTranslations('Tech');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="relative py-20 md:py-28 bg-slate-900 text-white overflow-hidden shadow-2xl border-t border-b border-slate-800">
      {/* Background glowing gradients for premium look */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900/5 to-transparent pointer-events-none blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-900/30 border border-blue-700/30 text-blue-300 text-sm font-semibold tracking-wider uppercase">
            Global Standards
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight drop-shadow-md break-keep">
            {t('certSectionTitle')}
          </h2>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed break-keep">
            {t('certSectionText')}
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 items-stretch justify-items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {[
            { src: "/1okbiobased.png", altKey: "certOkbiobased" },
            { src: "/2BioPreferredLabel.PNG", altKey: "certBioPreferred" },
            { src: "/3OEKO-TEX® Eco Passport_logo.png", altKey: "certOekoTex" },
            { src: "/4ZDHC.png", altKey: "certZdhc" }
          ].map((cert, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="relative w-full aspect-square md:aspect-auto md:h-56 bg-white/95 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-xl hover:bg-white hover:-translate-y-2 hover:shadow-blue-500/20 hover:shadow-2xl transition-all duration-300 group flex items-center justify-center"
            >
              <div className="relative w-full h-full transform transition-transform duration-500 group-hover:scale-105">
                <StrictImage 
                  src={cert.src} 
                  alt={t(cert.altKey as any)} 
                  fill 
                  className="object-contain drop-shadow-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300 p-2" 
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
