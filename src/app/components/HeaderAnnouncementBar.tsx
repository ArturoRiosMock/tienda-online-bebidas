import { useEffect, useState } from 'react';
import { PartyPopper, Truck } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const ANNOUNCEMENTS = [
  '¡Envios GRATIS en compras mayores a $2000 MXN!',
  '¡Cotiza tu evento y hazlo inolvidable! Barras libres, eventos corporativos y más.',
];

export function HeaderAnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-[#FDB93A] to-[#FF8A00] py-2 overflow-hidden">
      <div className="container mx-auto px-3 sm:px-4 max-w-[100vw]">
        <div className="hidden md:flex items-center justify-center gap-6 text-sm font-medium text-[#212121]">
          <span className="flex items-center gap-2">
            <Truck className="h-4 w-4 shrink-0" aria-hidden />
            ¡Envíos GRATIS en compras mayores a $2.000 MXN!
          </span>
          <span className="h-4 w-px bg-[#212121]/30" aria-hidden />
          <span className="flex items-center gap-2">
            <PartyPopper className="h-4 w-4 shrink-0" aria-hidden />
            ¡Cotiza tu evento y hazlo inolvidable!
          </span>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="md:hidden text-center text-sm text-[#212121] font-medium"
          >
            {ANNOUNCEMENTS[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
