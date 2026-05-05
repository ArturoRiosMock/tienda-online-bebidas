import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X } from 'lucide-react';
import { useCookieConsent } from '@/app/context/CookieConsentContext';
import { Switch } from '@/app/components/ui/switch';

export const CookieConsent: React.FC = () => {
  const {
    preferences,
    hasInteracted,
    isPanelOpen,
    openPanel,
    closePanel,
    acceptAll,
    rejectAll,
    savePreferences,
  } = useCookieConsent();

  const [analytics, setAnalytics] = useState<boolean>(preferences?.analytics ?? false);
  const [marketing, setMarketing] = useState<boolean>(preferences?.marketing ?? false);

  useEffect(() => {
    if (isPanelOpen) {
      setAnalytics(preferences?.analytics ?? false);
      setMarketing(preferences?.marketing ?? false);
    }
  }, [isPanelOpen, preferences]);

  const showMinimalBanner = !hasInteracted && !isPanelOpen;
  const showPanel = isPanelOpen;

  if (!showMinimalBanner && !showPanel) return null;

  return (
    <>
      {/* Banner mínimo (default cuando aún no se ha interactuado) */}
      <AnimatePresence>
        {showMinimalBanner && (
          <motion.div
            key="cookie-banner"
            role="dialog"
            aria-modal="false"
            aria-labelledby="cookie-banner-title"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="fixed inset-x-0 bottom-0 z-[100] px-3 pb-3 sm:px-6 sm:pb-6"
          >
            <div className="mx-auto max-w-4xl rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-start">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0c3c1f]/10">
                    <Cookie className="h-5 w-5 text-[#0c3c1f]" aria-hidden />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 id="cookie-banner-title" className="text-base sm:text-lg font-bold text-[#212121] mb-1">
                    Tu privacidad importa
                  </h2>
                  <p className="text-xs sm:text-sm text-[#717182] leading-relaxed">
                    Utilizamos cookies esenciales para el funcionamiento del sitio y, con tu autorización,
                    cookies de análisis y marketing. Puedes aceptar todas, rechazarlas o personalizarlas.
                    Para más información consulta nuestro{' '}
                    <Link
                      to="/aviso-de-privacidad"
                      className="font-semibold text-[#0c3c1f] underline underline-offset-2 hover:text-[#0a3019]"
                    >
                      Aviso de Privacidad
                    </Link>.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:w-auto">
                  <button
                    onClick={acceptAll}
                    className="rounded-lg bg-[#0c3c1f] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#0a3019]"
                  >
                    Aceptar todo
                  </button>
                  <button
                    onClick={rejectAll}
                    className="rounded-lg border-2 border-[#212121] px-5 py-2 text-sm font-bold text-[#212121] transition-colors hover:bg-gray-100"
                  >
                    Rechazar todo
                  </button>
                  <button
                    onClick={openPanel}
                    className="rounded-lg px-5 py-1.5 text-xs font-semibold text-[#717182] underline underline-offset-2 transition-colors hover:text-[#212121]"
                  >
                    Personalizar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel expandido (Personalizar / re-abrir desde el footer) */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            key="cookie-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-end justify-center bg-black/50 backdrop-blur-sm p-0 sm:items-center sm:p-4"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="cookie-panel-title"
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-xl rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0c3c1f]/10">
                    <Cookie className="h-5 w-5 text-[#0c3c1f]" aria-hidden />
                  </div>
                  <h2 id="cookie-panel-title" className="text-lg font-bold text-[#212121]">
                    Preferencias de cookies
                  </h2>
                </div>
                {hasInteracted && (
                  <button
                    onClick={closePanel}
                    aria-label="Cerrar"
                    className="rounded-full p-1.5 text-[#717182] transition-colors hover:bg-gray-100 hover:text-[#212121]"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              <div className="max-h-[55vh] overflow-y-auto p-5 sm:p-6">
                <p className="text-sm text-[#717182] leading-relaxed mb-5">
                  Mr. Brown utiliza cookies y tecnologías similares conforme a la Ley Federal de Protección
                  de Datos Personales en Posesión de los Particulares (LFPDPPP). Elige qué categorías deseas
                  habilitar. Puedes cambiar tu decisión en cualquier momento desde el enlace{' '}
                  <span className="font-semibold text-[#212121]">"Configurar cookies"</span> del pie de página.
                </p>

                <div className="space-y-3">
                  {/* Esenciales — siempre activas */}
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="mb-1 flex items-center gap-2">
                          <h3 className="text-sm font-bold text-[#212121]">Cookies esenciales</h3>
                          <span className="rounded bg-[#0c3c1f] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                            Siempre activas
                          </span>
                        </div>
                        <p className="text-xs text-[#717182] leading-relaxed">
                          Necesarias para el funcionamiento del sitio: carrito de compras, sesión,
                          verificación de edad y seguridad. No pueden desactivarse.
                        </p>
                      </div>
                      <Switch checked disabled aria-label="Cookies esenciales (siempre activas)" />
                    </div>
                  </div>

                  {/* Análisis */}
                  <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-1 text-sm font-bold text-[#212121]">Cookies de análisis</h3>
                      <p className="text-xs text-[#717182] leading-relaxed">
                        Nos ayudan a entender cómo se usa el sitio (páginas vistas, tiempo de
                        navegación) para mejorar la experiencia. Datos agregados y anónimos.
                      </p>
                    </div>
                    <Switch
                      checked={analytics}
                      onCheckedChange={setAnalytics}
                      aria-label="Cookies de análisis"
                    />
                  </label>

                  {/* Marketing */}
                  <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-1 text-sm font-bold text-[#212121]">Cookies de marketing</h3>
                      <p className="text-xs text-[#717182] leading-relaxed">
                        Permiten mostrarte publicidad relevante dentro y fuera del sitio, así como
                        medir la eficacia de nuestras campañas.
                      </p>
                    </div>
                    <Switch
                      checked={marketing}
                      onCheckedChange={setMarketing}
                      aria-label="Cookies de marketing"
                    />
                  </label>
                </div>

                <p className="mt-5 text-[11px] text-[#717182] leading-relaxed">
                  Más información en el{' '}
                  <Link
                    to="/aviso-de-privacidad"
                    onClick={closePanel}
                    className="font-semibold text-[#0c3c1f] underline underline-offset-2"
                  >
                    Aviso de Privacidad
                  </Link>{' '}
                  y los{' '}
                  <Link
                    to="/terminos-de-servicio"
                    onClick={closePanel}
                    className="font-semibold text-[#0c3c1f] underline underline-offset-2"
                  >
                    Términos de Servicio
                  </Link>.
                </p>
              </div>

              <div className="flex flex-col gap-2 border-t border-gray-100 p-5 sm:flex-row sm:justify-between sm:p-6">
                <button
                  onClick={rejectAll}
                  className="rounded-lg border-2 border-[#212121] px-5 py-2.5 text-sm font-bold text-[#212121] transition-colors hover:bg-gray-100"
                >
                  Rechazar todo
                </button>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    onClick={() => savePreferences({ analytics, marketing })}
                    className="rounded-lg border-2 border-[#0c3c1f] px-5 py-2.5 text-sm font-bold text-[#0c3c1f] transition-colors hover:bg-[#0c3c1f]/5"
                  >
                    Guardar preferencias
                  </button>
                  <button
                    onClick={acceptAll}
                    className="rounded-lg bg-[#0c3c1f] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#0a3019]"
                  >
                    Aceptar todo
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
