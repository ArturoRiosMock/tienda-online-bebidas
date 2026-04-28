import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Cookie, CheckCircle } from 'lucide-react';
import { useCookieConsent } from '@/app/context/CookieConsentContext';
import { PLACEHOLDER_IMAGES } from '@/assets/placeholders';

export const CookiePolicyPage: React.FC = () => {
  const navigate = useNavigate();
  const { consent, acceptAll, rejectAll } = useCookieConsent();
  const [revoked, setRevoked] = useState(false);

  const handleRevoke = () => {
    rejectAll();
    setRevoked(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0055a2] via-[#003d7a] to-[#002855] py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#212121] px-8 py-8 text-center">
            <img
              src={PLACEHOLDER_IMAGES.logo}
              alt="Bebify"
              className="h-12 mx-auto mb-4"
            />
            <div className="flex items-center justify-center gap-2 mb-1">
              <Cookie className="w-5 h-5 text-blue-300" />
              <h1 className="text-white text-2xl font-bold">Política de Cookies</h1>
            </div>
            <p className="text-blue-200 text-sm">Última actualización: abril 2026</p>
          </div>

          {/* Content */}
          <div className="px-8 py-8 space-y-6 text-[#333] text-sm leading-relaxed">

            <section>
              <h2 className="font-bold text-[#212121] text-base mb-2">1. ¿Qué son las cookies?</h2>
              <p>
                Las cookies son pequeños archivos de texto que los sitios web almacenan en su dispositivo cuando los visita. Se utilizan ampliamente para hacer que los sitios web funcionen correctamente, mejorar la experiencia del usuario y proporcionar información a los propietarios del sitio.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-[#212121] text-base mb-2">2. Cookies propias (funcionales)</h2>
              <p className="mb-3">Estas cookies son necesarias para el correcto funcionamiento del sitio y no requieren su consentimiento:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-3 py-2 border-b border-gray-200 font-semibold text-[#212121]">Nombre</th>
                      <th className="text-left px-3 py-2 border-b border-gray-200 font-semibold text-[#212121]">Finalidad</th>
                      <th className="text-left px-3 py-2 border-b border-gray-200 font-semibold text-[#212121]">Duración</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="px-3 py-2 font-mono">mr-brown-age-verified</td>
                      <td className="px-3 py-2">Recuerda si el usuario verificó tener 18 años o más</td>
                      <td className="px-3 py-2">30 días</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-3 py-2 font-mono">bebify-auth</td>
                      <td className="px-3 py-2">Mantiene la sesión del usuario autenticado (localStorage)</td>
                      <td className="px-3 py-2">Sesión</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-mono">bebify-cookie-consent</td>
                      <td className="px-3 py-2">Guarda su preferencia sobre el uso de cookies</td>
                      <td className="px-3 py-2">Persistente</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="font-bold text-[#212121] text-base mb-2">3. Cookies de terceros (analítica y publicidad)</h2>
              <p className="mb-3">Estas cookies se instalan <strong>únicamente si usted acepta</strong> su uso mediante el aviso de cookies:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-3 py-2 border-b border-gray-200 font-semibold text-[#212121]">Proveedor</th>
                      <th className="text-left px-3 py-2 border-b border-gray-200 font-semibold text-[#212121]">Finalidad</th>
                      <th className="text-left px-3 py-2 border-b border-gray-200 font-semibold text-[#212121]">Más información</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="px-3 py-2 font-medium">Google Analytics</td>
                      <td className="px-3 py-2">Análisis de tráfico y comportamiento de usuarios de forma agregada y anónima</td>
                      <td className="px-3 py-2">
                        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#0055a2] underline">
                          Política de Google
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-medium">Meta Pixel</td>
                      <td className="px-3 py-2">Medición de conversiones y publicidad personalizada en Facebook e Instagram</td>
                      <td className="px-3 py-2">
                        <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className="text-[#0055a2] underline">
                          Política de Meta
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="font-bold text-[#212121] text-base mb-2">4. Cómo gestionar las cookies</h2>
              <p className="mb-2">
                Puede gestionar o eliminar las cookies en cualquier momento desde la configuración de su navegador. Tenga en cuenta que deshabilitar ciertas cookies puede afectar el funcionamiento del sitio.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-[#0055a2] underline">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/es/kb/cookies-informacion-que-los-sitios-web-guardan-en-" target="_blank" rel="noopener noreferrer" className="text-[#0055a2] underline">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/es-mx/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-[#0055a2] underline">Safari</a></li>
                <li><a href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" className="text-[#0055a2] underline">Microsoft Edge</a></li>
              </ul>
            </section>

            {/* Consent management */}
            <section className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h2 className="font-bold text-[#212121] text-base mb-3">5. Gestión de su consentimiento</h2>

              <div className="flex items-center gap-2 mb-4 text-xs text-gray-600">
                <span>Estado actual:</span>
                {consent === 'all' && <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Cookies de análisis aceptadas</span>}
                {consent === 'none' && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Cookies de análisis rechazadas</span>}
                {consent === null && <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">Sin decidir</span>}
              </div>

              {revoked ? (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-4 py-3 rounded-lg text-sm"
                >
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  Consentimiento revocado. Las cookies de análisis ya no están activas.
                </motion.div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {consent !== 'all' && (
                    <button
                      onClick={acceptAll}
                      className="px-4 py-2 text-sm font-medium text-white bg-[#0055a2] rounded-lg hover:bg-[#004488] transition-colors"
                    >
                      Aceptar cookies de análisis
                    </button>
                  )}
                  {consent !== 'none' && (
                    <button
                      onClick={handleRevoke}
                      className="px-4 py-2 text-sm font-medium text-[#cc2200] border border-[#cc2200]/40 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Revocar consentimiento
                    </button>
                  )}
                </div>
              )}
            </section>

            <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center gap-2 text-sm text-[#0055a2] font-medium hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </button>
              <p className="text-xs text-gray-400 sm:ml-auto self-center">
                Bebify © 2026 — Ciudad de México, México
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
