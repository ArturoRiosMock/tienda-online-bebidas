import React from 'react';
import { ArrowUp } from 'lucide-react';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { PLACEHOLDER_IMAGES } from '@/assets/placeholders';

/** Enlaces del footer de https://bebify.mx/ (abril 2026). No hay YouTube en el sitio público. */
const SOCIAL_LINKS = [
  {
    href: 'https://www.facebook.com/people/Bebify/61553628214594/?mibextid=LQQJ4d',
    label: 'Facebook',
    Icon: FacebookIcon,
  },
  {
    href: 'https://www.instagram.com/bebify.mx/',
    label: 'Instagram',
    Icon: InstagramIcon,
  },
  {
    href: 'https://www.linkedin.com/company/grupo-primo-bebidas',
    label: 'LinkedIn',
    Icon: LinkedInIcon,
  },
  {
    href: 'https://api.whatsapp.com/send?phone=525650929066',
    label: 'WhatsApp',
    Icon: WhatsAppIcon,
  },
] as const;

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#121212] text-gray-200">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About — ocupa 2 columnas en desktop */}
          <div className="space-y-4 md:col-span-2">
            <img
              src={PLACEHOLDER_IMAGES.logo}
              alt="Bebify"
              className="h-10 w-auto object-contain object-left"
            />
            <p className="text-gray-300 text-sm leading-relaxed">
              Revolucionamos el suministro de bebidas para centros de consumo, 
              centralizando tus compras con acceso a más de 2,000 productos de más 
              de 200 proveedores.
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              ¡Optimiza tu operación, ahorra tiempo y dinero con Bebify!
            </p>
            <a 
              href="https://bebify.mx/pages/nosotros" 
              className="inline-flex items-center gap-2 text-[#4da6ff] hover:text-[#7ec8ff] hover:underline text-sm"
            >
              <span className="w-6 h-6 bg-[#0055a2] rounded-full flex items-center justify-center text-white">
                →
              </span>
              Conócenos
            </a>
          </div>

          {/* Enlaces */}
          <div className="space-y-3 md:col-span-1">
            <h4 className="text-white font-semibold mb-4">Información</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://bebify.mx/search" className="text-gray-300 hover:text-[#4da6ff] transition-colors">
                  Buscar
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-300 hover:text-[#4da6ff] transition-colors">
                  Preguntas Frecuentes
                </a>
              </li>
              <li>
                <a href="https://bebify.mx/pages/contact" className="text-gray-300 hover:text-[#4da6ff] transition-colors">
                  Contáctanos
                </a>
              </li>
            </ul>
            <h4 className="text-white font-semibold mb-4 mt-6">Políticas</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://bebify.mx/policies/privacy-policy" className="text-gray-300 hover:text-[#4da6ff] transition-colors">
                  Política de privacidad
                </a>
              </li>
              <li>
                <a href="https://bebify.mx/policies/terms-of-service" className="text-gray-300 hover:text-[#4da6ff] transition-colors">
                  Términos de servicio
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8 border-t border-white/10">
          <p className="text-sm font-medium text-gray-200">Síguenos</p>
          <ul className="flex flex-wrap items-center gap-3">
            {SOCIAL_LINKS.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Síguenos en ${label}`}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-[#4da6ff] border border-white/15 transition-colors hover:bg-[#0055a2] hover:text-white hover:border-[#0055a2]"
                >
                  <Icon sx={{ fontSize: 22 }} aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Disclaimer NOM-142-SSA1/SCFI-2014 */}
        <div className="mt-10 pt-8 border-t border-white/10">
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-white font-bold text-sm uppercase tracking-wide">
              PROHIBIDA SU VENTA A MENORES DE 18 AÑOS
            </p>
            <p className="text-gray-300 text-sm mt-1 uppercase tracking-wide">
              EL ABUSO EN EL CONSUMO DE ESTE PRODUCTO ES NOCIVO PARA LA SALUD
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              Copyright© 2026 Bebify - Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-2">
              <p className="text-gray-500 text-xs">
                Tecnología de
              </p>
              <span className="text-[#4da6ff] font-semibold text-sm">Shopify</span>
            </div>
            
            {/* Scroll to Top Button */}
            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full border-2 border-[#0055a2] flex items-center justify-center hover:bg-[#0055a2] text-[#4da6ff] hover:text-white transition-colors group"
              aria-label="Volver arriba"
            >
              <ArrowUp className="w-5 h-5 group-hover:text-white" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};