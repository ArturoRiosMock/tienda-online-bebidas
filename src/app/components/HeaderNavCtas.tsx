import { PartyPopper, Percent } from 'lucide-react';

type CtaProps = {
  onCotiza: () => void;
  onPromos: () => void;
};

export function HeaderDesktopCtas({ onCotiza, onPromos }: CtaProps) {
  return (
    <>
      <button
        type="button"
        onClick={onCotiza}
        className="flex flex-shrink-0 items-center gap-1.5 rounded-full bg-[#FDB93A] px-4 py-1.5 text-sm font-bold text-[#212121] transition-colors hover:bg-[#FF8A00]"
      >
        <PartyPopper className="h-4 w-4" />
        Cotiza tu Evento
      </button>
      <button
        type="button"
        onClick={onPromos}
        className="flex flex-shrink-0 items-center gap-1.5 rounded-full bg-[#0c3c1f] px-4 py-1.5 text-sm font-bold text-white transition-colors hover:bg-[#0a3019]"
      >
        <Percent className="h-4 w-4" />
        Promociones
      </button>
    </>
  );
}

export function HeaderMobileCtas({ onCotiza, onPromos }: CtaProps) {
  return (
    <>
      <button
        type="button"
        onClick={onPromos}
        className="flex min-h-[48px] w-full items-center gap-2 rounded-xl bg-[#0c3c1f] px-4 py-3 text-left text-sm font-bold text-white transition-colors hover:bg-[#0a3019] active:bg-[#082414]"
      >
        <Percent className="h-5 w-5 shrink-0" aria-hidden />
        Promociones
      </button>
      <button
        type="button"
        onClick={onCotiza}
        className="flex min-h-[48px] w-full items-center gap-2 rounded-xl bg-[#FDB93A]/15 px-4 py-3 text-left text-sm font-bold text-[#212121] transition-colors hover:bg-[#FDB93A]/25 active:bg-[#FDB93A]/35"
      >
        <PartyPopper className="h-5 w-5 shrink-0 text-[#0c3c1f]" aria-hidden />
        Cotiza tu evento
      </button>
    </>
  );
}
