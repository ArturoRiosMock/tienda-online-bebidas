import type { HeroSlide } from '@/types/homeContent';
import { ColorField } from '@/app/components/edicion/fields/ColorField';
import { PositionPicker } from '@/app/components/edicion/fields/PositionPicker';
import { DEFAULT_CTA_COLOR, DEFAULT_HERO_BG } from '@/app/components/hero/heroPosition';

interface HeroSlideStyleProps {
  slide: HeroSlide;
  onPatch: (patch: Partial<HeroSlide>) => void;
}

export function HeroSlideStyle({ slide, onPatch }: HeroSlideStyleProps) {
  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Apariencia</p>

      <ColorField
        label="Color de los bordes"
        value={slide.bgColor}
        fallback={DEFAULT_HERO_BG}
        onChange={(v) => onPatch({ bgColor: v })}
        hint="La imagen se muestra completa, sin recortar. Este color rellena el espacio que sobra a los lados o arriba y abajo."
      />

      {slide.buttonText ? (
        <>
          <ColorField
            label="Color del botón"
            value={slide.buttonColor}
            fallback={DEFAULT_CTA_COLOR}
            onChange={(v) => onPatch({ buttonColor: v })}
            hint="El texto del botón se pone blanco o negro solo, según lo que se lea mejor."
          />
          <PositionPicker
            label="Posición del botón"
            value={slide.buttonPosition}
            onChange={(v) => onPatch({ buttonPosition: v })}
          />
        </>
      ) : (
        <p className="rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
          Escribe el texto del botón más abajo para poder elegir su color y su posición.
        </p>
      )}
    </div>
  );
}
