import { Link } from 'react-router-dom';
import { PartyPopper } from 'lucide-react';

export function EventQuoteNotice({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="space-y-3 rounded-xl border border-[#FDB93A]/50 bg-[#FDB93A]/10 p-4">
      <p className="text-sm text-[#212121]">
        Para este tipo de evento armamos una propuesta a tu medida: barra, bebidas y cantidades
        según tus invitados.
      </p>
      <Link
        to="/cotizar-evento"
        onClick={onNavigate}
        className="inline-flex items-center gap-2 rounded-lg bg-[#0c3c1f] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#0a3019]"
      >
        <PartyPopper className="h-4 w-4" aria-hidden />
        Cotizar evento
      </Link>
    </div>
  );
}
