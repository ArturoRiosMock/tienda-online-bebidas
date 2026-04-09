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
              de 300 proveedores.
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
                <a href="https://bebify.mx/pages/nosotros" className="text-gray-300 hover:text-[#4da6ff] transition-colors">
                  Conócenos
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

        {/* Payment and Security Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left - Payment Methods */}
            <div>
              <h4 className="text-white font-semibold mb-4">Pagos</h4>
              <div className="flex flex-wrap gap-3">
                <div className="bg-white rounded px-3 py-2 shadow-sm">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='25' viewBox='0 0 40 25'%3E%3Crect fill='%231434CB' width='40' height='25' rx='3'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='Arial, sans-serif' font-size='10' font-weight='bold'%3EVISA%3C/text%3E%3C/svg%3E" alt="Visa" className="h-6" />
                </div>
                <div className="bg-white rounded px-3 py-2 shadow-sm">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='25' viewBox='0 0 40 25'%3E%3Crect fill='%23EB001B' width='20' height='25' rx='3'/%3E%3Crect fill='%23FF5F00' x='10' width='20' height='25'/%3E%3Crect fill='%23F79E1B' x='20' width='20' height='25' rx='3'/%3E%3C/svg%3E" alt="Mastercard" className="h-6" />
                </div>
                <div className="bg-white rounded px-3 py-2 shadow-sm">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='25' viewBox='0 0 40 25'%3E%3Crect fill='%23006FCF' width='40' height='25' rx='3'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='Arial, sans-serif' font-size='8' font-weight='bold'%3EAMEX%3C/text%3E%3C/svg%3E" alt="American Express" className="h-6" />
                </div>
                <div className="bg-white rounded px-3 py-2 shadow-sm">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='25' viewBox='0 0 40 25'%3E%3Crect fill='%23000000' width='40' height='25' rx='3'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23FFCB05' font-family='Arial, sans-serif' font-size='9' font-weight='bold'%3EELO%3C/text%3E%3C/svg%3E" alt="Elo" className="h-6" />
                </div>
                <div className="bg-white rounded px-3 py-2 shadow-sm">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='25' viewBox='0 0 40 25'%3E%3Crect fill='%23FF6000' width='40' height='25' rx='3'/%3E%3Ctext x='50%25' y='35%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='Arial, sans-serif' font-size='6' font-weight='bold'%3EDISCOVER%3C/text%3E%3Cpath d='M15 15 Q20 18 25 15' stroke='white' stroke-width='2' fill='none'/%3E%3C/svg%3E" alt="Discover" className="h-6" />
                </div>
              </div>
            </div>

            {/* Right - Security */}
            <div>
              <h4 className="text-white font-semibold mb-4">Seguridad</h4>
              <div className="flex flex-wrap gap-3">
                <div className="bg-white/10 rounded px-3 py-2 border border-white/10 flex items-center gap-2">
                  <span className="text-green-400 text-lg">✓</span>
                  <span className="text-xs text-gray-200 font-medium">SSL Strong</span>
                </div>
                <div className="bg-white/10 rounded px-3 py-2 border border-white/10 flex items-center gap-2">
                  <span className="text-xs text-gray-200 font-medium">Google Safe</span>
                </div>
                <div className="bg-white/10 rounded px-3 py-2 border border-white/10 flex items-center gap-2">
                  <span className="text-xs text-gray-200 font-medium">ClearSale</span>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-lg">
            <h4 className="text-white font-bold mb-1">BEBA CON MODERACIÓN</h4>
            <p className="text-gray-300 text-sm">No compartir con menores de 18 años</p>
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