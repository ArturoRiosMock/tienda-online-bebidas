import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

export function QuoteSuccess({ onReset }: { onReset: () => void }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 bg-[#0c3c1f]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-[#0c3c1f]" />
        </div>
        <h2 className="text-2xl font-bold text-[#212121] mb-3">¡Solicitud enviada!</h2>
        <p className="text-[#717182] mb-6">
          Hemos abierto WhatsApp con los datos de tu cotización. Un asesor de Mr. Brown se pondrá en
          contacto contigo pronto.
        </p>
        <button
          onClick={onReset}
          className="bg-[#0c3c1f] text-white px-6 py-3 rounded-lg hover:bg-[#0a3019] transition-colors font-medium"
        >
          Cotizar otro evento
        </button>
      </motion.div>
    </div>
  );
}
