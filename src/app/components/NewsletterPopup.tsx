import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, User, Check, X, Sparkles } from 'lucide-react';

const SUBSCRIBED_KEY = 'bebify-newsletter-subscribed';
const DISMISSED_SESSION_KEY = 'bebify-newsletter-dismissed';

const isSubscribed = (): boolean => {
  try {
    return localStorage.getItem(SUBSCRIBED_KEY) === 'true';
  } catch {
    return false;
  }
};

const isDismissedThisSession = (): boolean => {
  try {
    return sessionStorage.getItem(DISMISSED_SESSION_KEY) === 'true';
  } catch {
    return false;
  }
};

export const NewsletterPopup: React.FC = () => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  const [formData, setFormData] = useState({ name: '', whatsapp: '', email: '' });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const close = useCallback(() => {
    setIsOpen(false);
    try {
      sessionStorage.setItem(DISMISSED_SESSION_KEY, 'true');
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (hasShown || isSubscribed() || isDismissedThisSession()) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !hasShown) {
          setIsOpen(true);
          setHasShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasShown]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, close]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      alert('Por favor acepta los términos y condiciones');
      return;
    }
    setIsSubmitted(true);
    try {
      localStorage.setItem(SUBSCRIBED_KEY, 'true');
    } catch {
      /* ignore */
    }
    setTimeout(() => {
      setIsOpen(false);
      setIsSubmitted(false);
      setFormData({ name: '', whatsapp: '', email: '' });
      setAcceptedTerms(false);
    }, 2500);
  };

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="newsletter-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-labelledby="newsletter-popup-title"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar"
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#212121] flex items-center justify-center shadow-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="bg-gradient-to-r from-[#0055a2] to-[#0a5029] px-6 pt-8 pb-12 text-white text-center relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(45deg, transparent, transparent 25px, rgba(255,255,255,.15) 25px, rgba(255,255,255,.15) 50px)',
                  }}
                />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/15 backdrop-blur rounded-full mb-3">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3
                    id="newsletter-popup-title"
                    className="text-2xl font-bold mb-1"
                  >
                    Boletín de Noticias
                  </h3>
                  <p className="text-sm text-white/90 max-w-xs mx-auto">
                    Recibe ofertas exclusivas y novedades para tu negocio
                  </p>
                </div>
              </div>

              <div className="px-6 py-6 -mt-6">
                {isSubmitted ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white border border-green-200 rounded-xl p-6 text-center shadow-sm"
                  >
                    <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Check className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-[#212121] font-semibold text-lg mb-1">
                      ¡Registro exitoso!
                    </h4>
                    <p className="text-[#717182] text-sm">
                      Pronto recibirás nuestras mejores ofertas
                    </p>
                  </motion.div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-xl space-y-3"
                  >
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0055a2]" />
                      <input
                        type="text"
                        placeholder="Nombre"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        className="w-full pl-11 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#0055a2] text-[#212121] placeholder-[#717182] text-sm"
                      />
                    </div>

                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0055a2]" />
                      <input
                        type="tel"
                        placeholder="WhatsApp"
                        value={formData.whatsapp}
                        onChange={(e) =>
                          setFormData({ ...formData, whatsapp: e.target.value })
                        }
                        required
                        className="w-full pl-11 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#0055a2] text-[#212121] placeholder-[#717182] text-sm"
                      />
                    </div>

                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0055a2]" />
                      <input
                        type="email"
                        placeholder="E-mail"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                        className="w-full pl-11 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#0055a2] text-[#212121] placeholder-[#717182] text-sm"
                      />
                    </div>

                    <label
                      htmlFor="newsletter-popup-terms"
                      className="flex items-start gap-2 pt-1 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        id="newsletter-popup-terms"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-[#0055a2] border-gray-300 rounded focus:ring-[#0055a2]"
                        required
                      />
                      <span className="text-xs text-[#717182] leading-snug">
                        Acepto la{' '}
                        <a
                          href="/aviso-de-privacidad"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0055a2] hover:underline"
                        >
                          política de privacidad
                        </a>
                        .
                      </span>
                    </label>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-[#0055a2] text-white py-3 rounded-lg hover:bg-[#003d7a] transition-colors font-semibold mt-2"
                    >
                      Registrarme
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
