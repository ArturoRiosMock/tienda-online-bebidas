import React from 'react';
import { ArrowUp, Play } from 'lucide-react';
import { PLACEHOLDER_IMAGES } from '@/assets/placeholders';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#E8EBF0]">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - About */}
          <div className="space-y-4">
            <div className="bg-[#0055a2] rounded-lg px-4 py-2 inline-block">
              <img
                src={PLACEHOLDER_IMAGES.logo}
                alt="Bebify"
                className="h-10"
              />
            </div>
            <p className="text-[#212121] text-sm leading-relaxed">
              Revolucionamos el suministro de bebidas para centros de consumo, 
              centralizando tus compras con acceso a más de 2,000 productos de más 
              de 300 proveedores.
            </p>
            <p className="text-[#212121] text-sm leading-relaxed">
              ¡Optimiza tu operación, ahorra tiempo y dinero con Bebify!
            </p>
            <a 
              href="https://bebify.mx/pages/nosotros" 
              className="inline-flex items-center gap-2 text-[#0055a2] hover:underline text-sm"
            >
              <span className="w-6 h-6 bg-[#0055a2] rounded-full flex items-center justify-center text-white">
                →
              </span>
              Conócenos
            </a>
          </div>

          {/* Middle Column - Links */}
          <div className="space-y-3">
            <h4 className="text-[#212121] font-semibold mb-4">Información</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://bebify.mx/search" className="text-[#212121] hover:text-[#0055a2] transition-colors">
                  Buscar
                </a>
              </li>
              <li>
                <a href="https://bebify.mx/pages/nosotros" className="text-[#212121] hover:text-[#0055a2] transition-colors">
                  Conócenos
                </a>
              </li>
              <li>
                <a href="#about" className="text-[#212121] hover:text-[#0055a2] transition-colors">
                  Preguntas Frecuentes
                </a>
              </li>
              <li>
                <a href="https://bebify.mx/pages/contact" className="text-[#212121] hover:text-[#0055a2] transition-colors">
                  Contáctanos
                </a>
              </li>
            </ul>
            <h4 className="text-[#212121] font-semibold mb-4 mt-6">Políticas</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://bebify.mx/policies/privacy-policy" className="text-[#212121] hover:text-[#0055a2] transition-colors">
                  Política de privacidad
                </a>
              </li>
              <li>
                <a href="https://bebify.mx/policies/terms-of-service" className="text-[#212121] hover:text-[#0055a2] transition-colors">
                  Términos de servicio
                </a>
              </li>
            </ul>
          </div>

          {/* Right Column - Images */}
          <div className="space-y-6">
            <div>
              <h4 className="text-[#0055a2] font-semibold mb-3">Centro de Distribución</h4>
              <div className="relative rounded-lg overflow-hidden group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1767522247768-fb18caca37f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZXZlcmFnZSUyMGRpc3RyaWJ1dGlvbiUyMHdhcmVob3VzZXxlbnwxfHx8fDE3NzAxMzM1ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Centro de Distribución"
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-[#0055a2] font-semibold mb-3">Tienda Concepto</h4>
              <div className="relative rounded-lg overflow-hidden group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1534782596238-c642ca6e4324?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkcmlua3MlMjBzdG9yZSUyMGludGVyaW9yfGVufDF8fHx8MTc3MDEzMzU4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Tienda Concepto"
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment and Security Section */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left - Payment Methods */}
            <div>
              <h4 className="text-[#212121] font-semibold mb-4">Pagos</h4>
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
              <h4 className="text-[#212121] font-semibold mb-4">Seguridad</h4>
              <div className="flex flex-wrap gap-3">
                <div className="bg-white rounded px-3 py-2 shadow-sm flex items-center gap-2">
                  <span className="text-green-600 text-lg">✓</span>
                  <span className="text-xs text-[#212121] font-medium">SSL Strong</span>
                </div>
                <div className="bg-white rounded px-3 py-2 shadow-sm flex items-center gap-2">
                  <span className="text-xs text-[#212121] font-medium">Google Safe</span>
                </div>
                <div className="bg-white rounded px-3 py-2 shadow-sm flex items-center gap-2">
                  <span className="text-xs text-[#212121] font-medium">ClearSale</span>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 p-4 bg-white/50 rounded-lg">
            <h4 className="text-[#212121] font-bold mb-1">BEBA CON MODERACIÓN</h4>
            <p className="text-[#212121] text-sm">No compartir con menores de 18 años</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-white border-t border-gray-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#717182] text-sm">
              Copyright© 2026 Bebify - Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-2">
              <p className="text-[#717182] text-xs">
                Tecnología de
              </p>
              <span className="text-[#0055a2] font-semibold text-sm">Shopify</span>
            </div>
            
            {/* Scroll to Top Button */}
            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full border-2 border-[#0055a2] flex items-center justify-center hover:bg-[#0055a2] hover:text-white transition-colors group"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5 text-[#0055a2] group-hover:text-white" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};