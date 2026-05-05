import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PLACEHOLDER_IMAGES } from '@/assets/placeholders';

const COOKIE_NAME = 'mr-brown-age-verified';
const STORAGE_KEY = 'mr-brown-age-verified';
const COOKIE_DAYS = 30;

type AgeStatus = 'pending' | 'verified' | 'rejected';

const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
};

const safeGetLocal = (key: string): string | null => {
  try {
    return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
  } catch {
    return null;
  }
};

const safeSetLocal = (key: string, value: string) => {
  try {
    if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
  } catch {
    /* almacenamiento bloqueado (modo privado, cookies/storage deshabilitado) */
  }
};

export const AgeVerification: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<AgeStatus>(() => {
    const cookie = getCookie(COOKIE_NAME);
    const local = safeGetLocal(STORAGE_KEY);
    if (cookie === 'true' || local === 'true') return 'verified';
    if (cookie === 'false' || local === 'false') return 'rejected';
    return 'pending';
  });

  useEffect(() => {
    if (status === 'pending' || status === 'rejected') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [status]);

  const handleConfirmAge = () => {
    setCookie(COOKIE_NAME, 'true', COOKIE_DAYS);
    safeSetLocal(STORAGE_KEY, 'true');
    setStatus('verified');
  };

  const handleRejectAge = () => {
    setCookie(COOKIE_NAME, 'false', 1);
    safeSetLocal(STORAGE_KEY, 'false');
    setStatus('rejected');
  };

  const handleGoBack = () => {
    setStatus('pending');
  };

  if (status === 'verified') return <>{children}</>;

  return (
    <>
      {status === 'rejected' && (
        <div className="sr-only">{children}</div>
      )}

      <AnimatePresence mode="wait">
        {status === 'pending' && (
          <motion.div
            key="age-gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="age-gate-title"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
            >
              <img
                src={PLACEHOLDER_IMAGES.logo}
                alt="Mr. Brown"
                className="h-20 mx-auto mb-6 object-contain"
              />

              <h2 id="age-gate-title" className="text-2xl font-bold text-[#212121] mb-4">
                CONFIRMA TU EDAD
              </h2>

              <p className="text-[#717182] text-sm leading-relaxed mb-8">
                En Mr. Brown promovemos el consumo responsable.<br />
                Este sitio es solo para mayores de 18 años.<br />
                Confirma tu edad antes de seguir.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleRejectAge}
                  className="flex-1 py-3 px-4 border-2 border-[#212121] text-[#212121] rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors"
                >
                  Soy menor de edad.
                </button>
                <button
                  autoFocus
                  onClick={handleConfirmAge}
                  className="flex-1 py-3 px-4 bg-[#212121] text-white rounded-lg font-bold text-sm hover:bg-[#333] transition-colors"
                >
                  Tengo más de 18 años.
                </button>
              </div>

              <p className="text-[10px] sm:text-xs text-[#717182] leading-relaxed mt-6 pt-4 border-t border-gray-100">
                Beber con moderación. La venta y suministro de bebidas alcohólicas a menores de 18 años
                está estrictamente prohibida conforme al artículo 220 de la Ley General de Salud.
              </p>
            </motion.div>
          </motion.div>
        )}

        {status === 'rejected' && (
          <motion.div
            key="age-rejected"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-white p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="max-w-md w-full text-center"
            >
              <img
                src={PLACEHOLDER_IMAGES.logo}
                alt="Mr. Brown"
                className="h-20 mx-auto mb-6 object-contain"
              />

              <h2 className="text-2xl font-bold text-[#212121] mb-4">
                ESTE SITIO ES SOLO PARA MAYORES DE 18 AÑOS.
              </h2>

              <p className="text-[#717182] text-sm leading-relaxed mb-8">
                Parece que no tienes edad suficiente para comprar con
                nosotros, te recomendamos visitar la siguiente página para
                más información:{' '}
                <a
                  href="https://alcoholinformate.org.mx/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#212121] font-bold underline"
                >
                  https://alcoholinformate.org.mx/
                </a>
              </p>

              <button
                onClick={handleGoBack}
                className="py-3 px-10 border-2 border-[#212121] text-[#212121] rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors"
              >
                Volver
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
