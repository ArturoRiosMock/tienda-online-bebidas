import type { AboutPageContent } from '@/types/homeContent';
import { motion } from 'motion/react';

export function SobreNosotrosHero({ about }: { about: AboutPageContent }) {
  return (
    <section className="relative bg-gradient-to-r from-[#0c3c1f] to-[#1a5c35] overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
          }}
        />
      </div>
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-[#FDB93A] font-bold text-sm tracking-widest uppercase mb-3">{about.tagline}</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{about.badge}</h1>
          <p className="text-white/80 text-lg max-w-2xl">{about.headline}</p>
        </motion.div>
      </div>
    </section>
  );
}
