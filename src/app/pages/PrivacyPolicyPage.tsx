import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Shield } from 'lucide-react';
import { PLACEHOLDER_IMAGES } from '@/assets/placeholders';

export const PrivacyPolicyPage: React.FC = () => {
  const navigate = useNavigate();

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
              <Shield className="w-5 h-5 text-blue-300" />
              <h1 className="text-white text-2xl font-bold">Aviso de Privacidad</h1>
            </div>
            <p className="text-blue-200 text-sm">
              Última actualización: abril 2026
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-8 space-y-6 text-[#333] text-sm leading-relaxed">

            <section>
              <h2 className="font-bold text-[#212121] text-base mb-2">1. Identidad y domicilio del Responsable</h2>
              <p>
                <strong>Bebify</strong> (en adelante "el Responsable"), con domicilio en Ciudad de México, México, es responsable del tratamiento de los datos personales que usted nos proporcione, de conformidad con lo dispuesto por la <em>Ley Federal de Protección de Datos Personales en Posesión de los Particulares</em> (LFPDPPP) y su Reglamento.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-[#212121] text-base mb-2">2. Datos personales recabados</h2>
              <p>Para las finalidades descritas en este aviso, podemos recabar los siguientes datos personales:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Nombre completo</li>
                <li>Correo electrónico</li>
                <li>Contraseña (almacenada de forma cifrada)</li>
                <li>Dirección de entrega (al realizar un pedido)</li>
                <li>Datos de transacciones y compras realizadas</li>
              </ul>
              <p className="mt-2">No recabamos datos sensibles en el sentido del artículo 3, fracción VI, de la LFPDPPP.</p>
            </section>

            <section>
              <h2 className="font-bold text-[#212121] text-base mb-2">3. Finalidades del tratamiento</h2>
              <p className="mb-2"><strong>Finalidades primarias</strong> (necesarias para la relación comercial):</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Crear y administrar su cuenta de cliente.</li>
                <li>Procesar y dar seguimiento a sus pedidos.</li>
                <li>Facturación y cumplimiento de obligaciones fiscales.</li>
                <li>Atención a solicitudes, quejas y aclaraciones.</li>
              </ul>
              <p className="mt-3 mb-2"><strong>Finalidades secundarias</strong> (puede oponerse a estas):</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Envío de comunicaciones comerciales y promociones.</li>
                <li>Análisis estadístico y mejora del servicio.</li>
              </ul>
              <p className="mt-2">Si no desea que sus datos sean tratados para las finalidades secundarias, puede manifestarlo enviando un correo a <a href="mailto:privacidad@bebify.mx" className="text-[#0055a2] underline">privacidad@bebify.mx</a>.</p>
            </section>

            <section>
              <h2 className="font-bold text-[#212121] text-base mb-2">4. Transferencias de datos</h2>
              <p>
                Sus datos personales pueden ser compartidos con proveedores de servicios tecnológicos y de pago (como Shopify Inc.) únicamente para las finalidades primarias descritas. Dichos proveedores están obligados contractualmente a mantener la confidencialidad y seguridad de los datos.
              </p>
              <p className="mt-2">No transferimos sus datos a terceros con fines de mercadotecnia sin su consentimiento expreso.</p>
            </section>

            <section>
              <h2 className="font-bold text-[#212121] text-base mb-2">5. Derechos ARCO</h2>
              <p>
                Usted tiene derecho a <strong>Acceder</strong>, <strong>Rectificar</strong>, <strong>Cancelar</strong> u <strong>Oponerse</strong> al tratamiento de sus datos personales (derechos ARCO). Para ejercerlos, envíe una solicitud a:
              </p>
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p><strong>Correo:</strong> <a href="mailto:privacidad@bebify.mx" className="text-[#0055a2] underline">privacidad@bebify.mx</a></p>
                <p className="mt-1"><strong>Asunto:</strong> Solicitud de derechos ARCO</p>
              </div>
              <p className="mt-2">
                Daremos respuesta a su solicitud en un plazo máximo de <strong>20 días hábiles</strong>, de conformidad con el artículo 32 de la LFPDPPP.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-[#212121] text-base mb-2">6. Revocación del consentimiento</h2>
              <p>
                En cualquier momento puede revocar el consentimiento que nos ha otorgado para el tratamiento de sus datos personales enviando un correo a <a href="mailto:privacidad@bebify.mx" className="text-[#0055a2] underline">privacidad@bebify.mx</a>. La revocación no tendrá efectos retroactivos.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-[#212121] text-base mb-2">7. Uso de cookies y tecnologías de rastreo</h2>
              <p>
                Este sitio utiliza cookies y tecnologías similares para mejorar su experiencia de navegación. Puede desactivar las cookies desde la configuración de su navegador; sin embargo, esto puede afectar el funcionamiento de algunas secciones del sitio.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-[#212121] text-base mb-2">8. Modificaciones al aviso de privacidad</h2>
              <p>
                Nos reservamos el derecho de modificar este aviso en cualquier momento. Cualquier cambio será comunicado a través del sitio web <strong>bebify.mx</strong>. El uso continuado del sitio después de la publicación de cambios implica la aceptación de los mismos.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-[#212121] text-base mb-2">9. Autoridad competente</h2>
              <p>
                Si considera que su derecho a la protección de datos personales ha sido vulnerado, puede acudir ante el Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (INAI): <a href="https://www.inai.org.mx" target="_blank" rel="noopener noreferrer" className="text-[#0055a2] underline">www.inai.org.mx</a>.
              </p>
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
