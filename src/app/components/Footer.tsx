import React from 'react';
import { ArrowUp, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
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
            <img src={PLACEHOLDER_IMAGES.logo} alt="Mr. Brown" className="h-12" />
            <p className="text-[#212121] text-sm leading-relaxed">
              En Mr. Brown, somos curadores de experiencias únicas en bebidas premium. Desde 2018 ofrecemos una selección inigualable de destilados, vinos y más, para elevar cada momento especial.
            </p>
            <p className="text-[#212121] text-sm leading-relaxed">
              Más que vender bebidas, entregamos experiencias.
            </p>
            <p className="text-[#212121] text-sm font-medium">
              Mr. Brown – HOUSE OF SPIRITS
            </p>
            <Link
              to="/sobre-nosotros"
              className="inline-flex items-center gap-2 text-[#0c3c1f] hover:underline text-sm"
            >
              <span className="w-6 h-6 bg-[#0c3c1f] rounded-full flex items-center justify-center text-white text-xs">→</span>
              Conoce nuestra historia
            </Link>
          </div>

          {/* Middle Column - Links */}
          <div className="space-y-3">
            <div className="mb-6">
              <h4 className="text-[#212121] font-semibold mb-3">Información</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/sobre-nosotros" className="text-[#212121] hover:text-[#0c3c1f] transition-colors">Sobre nosotros</Link></li>
                <li><Link to="/preguntas-frecuentes" className="text-[#212121] hover:text-[#0c3c1f] transition-colors">Preguntas frecuentes</Link></li>
                <li><Link to="/contacto" className="text-[#212121] hover:text-[#0c3c1f] transition-colors">Contacto</Link></li>
                <li><Link to="/cotizar-evento" className="text-[#212121] hover:text-[#0c3c1f] transition-colors">Cotiza tu evento</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#212121] font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/aviso-de-privacidad" className="text-[#212121] hover:text-[#0c3c1f] transition-colors">Política de privacidad</Link></li>
                <li><Link to="/politica-de-reembolso" className="text-[#212121] hover:text-[#0c3c1f] transition-colors">Política de reembolso</Link></li>
                <li><Link to="/terminos-de-servicio" className="text-[#212121] hover:text-[#0c3c1f] transition-colors">Términos de servicio</Link></li>
              </ul>
            </div>
            <div className="pt-2">
              <h4 className="text-[#212121] font-semibold mb-3">Síguenos</h4>
              <div className="flex gap-3">
                <a href="https://www.facebook.com/profile.php?id=100076305783446" target="_blank" rel="noopener noreferrer" className="text-[#212121] hover:text-[#0c3c1f] transition-colors text-sm">Facebook</a>
                <span className="text-gray-400">·</span>
                <a href="https://www.instagram.com/mrbrown.mx/" target="_blank" rel="noopener noreferrer" className="text-[#212121] hover:text-[#0c3c1f] transition-colors text-sm">Instagram</a>
                <span className="text-gray-400">·</span>
                <a href="https://www.tiktok.com/@mrbrown.mx" target="_blank" rel="noopener noreferrer" className="text-[#212121] hover:text-[#0c3c1f] transition-colors text-sm">TikTok</a>
              </div>
            </div>
          </div>

          {/* Right Column - Images */}
          <div className="space-y-6">
            <div>
              <h4 className="text-[#0c3c1f] font-semibold mb-3">Centro de Distribución</h4>
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
              <h4 className="text-[#0c3c1f] font-semibold mb-3">Tienda Concepto</h4>
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
            <div>
              <h4 className="text-[#212121] font-semibold mb-4">Métodos de pago</h4>
              <div className="flex flex-wrap gap-3">
                {['Visa', 'Mastercard', 'Amex', 'PayPal', 'Google Pay'].map((method) => (
                  <div key={method} className="bg-white rounded px-3 py-2 shadow-sm text-xs font-medium text-[#212121]">
                    {method}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[#212121] font-semibold mb-4">Seguridad</h4>
              <div className="flex flex-wrap gap-3">
                {['SSL Strong', 'Google Safe', 'ClearSale'].map((badge) => (
                  <div key={badge} className="bg-white rounded px-3 py-2 shadow-sm flex items-center gap-1.5">
                    <span className="text-green-600 text-sm">✓</span>
                    <span className="text-xs text-[#212121] font-medium">{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-white/50 rounded-lg">
            <h4 className="text-[#212121] font-bold mb-1">BEBA CON MODERACIÓN</h4>
            <p className="text-[#212121] text-sm">No compartir con menores de 18 años.</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-white border-t border-gray-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#717182] text-sm">
              © 2026 Mr. Brown – Todos los derechos reservados.
            </p>
            <div className="flex gap-4 text-xs text-[#717182]">
              <Link to="/aviso-de-privacidad" className="hover:text-[#0c3c1f] transition-colors">Privacidad</Link>
              <Link to="/terminos-de-servicio" className="hover:text-[#0c3c1f] transition-colors">Términos</Link>
              <Link to="/politica-de-reembolso" className="hover:text-[#0c3c1f] transition-colors">Reembolsos</Link>
            </div>
            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full border-2 border-[#0c3c1f] flex items-center justify-center hover:bg-[#0c3c1f] hover:text-white transition-colors group"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5 text-[#0c3c1f] group-hover:text-white" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
