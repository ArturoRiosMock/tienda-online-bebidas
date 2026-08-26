import { Link } from 'react-router-dom';
import { ExternalLink, LogOut } from 'lucide-react';
import { PLACEHOLDER_IMAGES } from '@/assets/placeholders';

export function EdicionTopBar({ onLogout }: { onLogout: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-[#0c3c1f] px-4 py-3 text-white">
      <div className="flex items-center gap-3">
        <img
          src={PLACEHOLDER_IMAGES.logo}
          alt="Mr. Brown"
          className="h-7 object-contain brightness-0 invert"
        />
        <h1 className="text-base font-bold">Editor del sitio</h1>
      </div>
      <div className="flex items-center gap-2">
        <Link
          to="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-2 text-sm transition-colors hover:bg-white/25"
        >
          <ExternalLink className="h-4 w-4" />
          <span className="hidden sm:inline">Ver el sitio</span>
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-lg p-2 transition-colors hover:bg-white/20"
          aria-label="Salir"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
