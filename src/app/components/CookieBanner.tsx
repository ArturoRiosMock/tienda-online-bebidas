import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useCookieConsent } from '@/app/context/CookieConsentContext';

export const CookieBanner: React.FC = () => {
  const { consent, acceptAll, rejectAll } = useCookieConsent();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {consent === null && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a] border-t border-white/10 shadow-2xl"
          role="dialog"
          aria-label="Aviso de cookies"
          aria-modal="false"
        >
          <div className="container mx-auto px-4 py-4 max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm mb-1">Nota informativa</p>
                <p className="text-gray-300 text-xs leading-relaxed">
                  Nosotros y terceros seleccionados utilizamos cookies o tecnologías similares según se especifica en la{' '}
                  <button
                    onClick={() => navigate('/politica-de-cookies')}
                    className="text-[#4da6ff] underline hover:text-blue-300 transition-colors"
                  >
                    política de cookies
                  </button>
                  . Puede consentir el uso de dichas tecnologías cerrando el presente aviso, desplazándose por esta
                  página, interactuando con cualquier enlace o botón fuera de este aviso o continuando su navegación de
                  cualquier otro modo.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                <button
                  onClick={() => navigate('/politica-de-cookies')}
                  className="px-4 py-2 text-sm font-medium text-white border border-white/30 rounded hover:bg-white/10 transition-colors whitespace-nowrap"
                >
                  Saber más y personalizar
                </button>
                <button
                  onClick={rejectAll}
                  className="px-4 py-2 text-sm font-medium text-white border border-white/30 rounded hover:bg-white/10 transition-colors"
                >
                  Rechazar
                </button>
                <button
                  onClick={acceptAll}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#0055a2] rounded hover:bg-[#004488] transition-colors"
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
