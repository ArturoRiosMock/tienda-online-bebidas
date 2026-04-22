import React from 'react';
import { ArrowUp, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PLACEHOLDER_IMAGES } from '@/assets/placeholders';

const socialIconLinkClass =
  'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#212121] transition-colors hover:bg-white hover:text-[#0c3c1f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0c3c1f]';

function TikTokGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#E8EBF0]">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - About */}
          <div className="space-y-4">
            <img src={PLACEHOLDER_IMAGES.logo} alt="Mr. Brown" className="h-12" />
            <p className="text-[#212121] text-sm leading-relaxed">
              Mr. Brown es una plataforma que se especializa en la comercialización de una amplia gama de bebidas populares y premium.
            </p>
            <p className="text-[#212121] text-sm leading-relaxed">
              Nos destacamos por brindar un servicio integral que abarca desde la selección de bebidas hasta la ejecución impecable de cada evento.
            </p>
            <p className="text-[#212121] text-sm font-medium">
              Mr. Brown – HOUSE OF SPIRITS
            </p>
            <Link
              to="/page/sobre-nosotros"
              className="inline-flex items-center gap-2 text-[#0c3c1f] hover:underline text-sm"
            >
              <span className="w-6 h-6 bg-[#0c3c1f] rounded-full flex items-center justify-center text-white text-xs">→</span>
              Conoce nuestra historia
            </Link>
          </div>

          {/* Links: en fila desde md */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 min-w-0">
            <div>
              <h4 className="text-[#212121] font-semibold mb-3">Información</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/page/sobre-nosotros" className="text-[#212121] hover:text-[#0c3c1f] transition-colors">Sobre nosotros</Link></li>
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
            <div>
              <h4 className="text-[#212121] font-semibold mb-3">Síguenos</h4>
              <div className="flex flex-wrap items-center gap-1">
                <a
                  href="https://www.facebook.com/profile.php?id=100076305783446"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialIconLinkClass}
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" strokeWidth={1.75} />
                </a>
                <a
                  href="https://www.instagram.com/mrbrown.mx/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialIconLinkClass}
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" strokeWidth={1.75} />
                </a>
                <a
                  href="https://www.tiktok.com/@mrbrown.com.mx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialIconLinkClass}
                  aria-label="TikTok"
                >
                  <TikTokGlyph className="h-[1.15rem] w-[1.15rem]" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-300">
          <div className="p-4 bg-white/50 rounded-lg">
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
