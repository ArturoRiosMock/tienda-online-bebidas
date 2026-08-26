import { motion } from 'motion/react';
import { PartyPopper, Wine } from 'lucide-react';

const STRIPES =
  'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)';

export function QuoteHero() {
  return (
    <section className="relative bg-gradient-to-r from-[#0c3c1f] to-[#1a5c35] overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ backgroundImage: STRIPES }} />
      </div>
      <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <PartyPopper className="w-8 h-8 text-[#FDB93A]" />
            <Wine className="w-8 h-8 text-[#FDB93A]" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            Cotiza tu Evento
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-lg">
            Arma el bar perfecto para tu celebración. Cuéntanos los detalles y te preparamos una
            propuesta a la medida.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
