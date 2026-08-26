import { Plus } from 'lucide-react';
import type { HeroSlide, HomeContent } from '@/types/homeContent';
import {
  MAX_SLIDES,
  addSlide,
  moveSlide,
  patchSlide,
  patchSlideImage,
  removeSlide,
} from '@/app/components/edicion/heroSlideOps';
import { HeroSlideCard } from '@/app/components/edicion/panels/HeroSlideCard';

interface HeroPanelProps {
  content: HomeContent;
  slideIds: string[];
  onContent: (next: HomeContent) => void;
  onSlideIds: (ids: string[]) => void;
  onUploadingChange: (uploading: boolean) => void;
}

export function HeroPanel({
  content,
  slideIds,
  onContent,
  onSlideIds,
  onUploadingChange,
}: HeroPanelProps) {
  const slides = content.hero.slides;

  const commit = (next: { slides: HeroSlide[]; ids: string[] }) => {
    onContent({ ...content, hero: { slides: next.slides } });
    onSlideIds(next.ids);
  };

  const commitSlides = (next: HeroSlide[]) => {
    onContent({ ...content, hero: { slides: next } });
  };

  return (
    <>
      <p className="text-sm text-gray-600">
        Es el carrusel grande de la portada. Cambian solos cada 8 segundos, en el orden de esta
        lista. Usa las flechas para mover un banner al primer lugar.
      </p>

      {slides.map((slide, index) => (
        <HeroSlideCard
          key={slideIds[index] ?? index}
          slide={slide}
          index={index}
          total={slides.length}
          onMove={(to) => commit(moveSlide({ slides, ids: slideIds }, index, to))}
          onRemove={() => commit(removeSlide({ slides, ids: slideIds }, index))}
          onPatch={(patch) => commitSlides(patchSlide(slides, index, patch))}
          onImage={(field, url) => commitSlides(patchSlideImage(slides, index, field, url))}
          onUploadingChange={onUploadingChange}
        />
      ))}

      <button
        type="button"
        disabled={slides.length >= MAX_SLIDES}
        onClick={() => commit(addSlide({ slides, ids: slideIds }))}
        className="inline-flex items-center gap-1.5 rounded-lg bg-[#0c3c1f] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0a3019] disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
        Agregar banner
      </button>
      {slides.length >= MAX_SLIDES && (
        <p className="text-xs text-gray-500">Llegaste al máximo de {MAX_SLIDES} banners.</p>
      )}
    </>
  );
}
