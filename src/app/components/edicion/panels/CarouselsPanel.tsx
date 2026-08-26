import type { HomeContent } from '@/types/homeContent';
import { TextField } from '@/app/components/edicion/fields/TextField';

interface CarouselsPanelProps {
  content: HomeContent;
  onContent: (next: HomeContent) => void;
}

export function CarouselsPanel({ content, onContent }: CarouselsPanelProps) {
  const set = (patch: Partial<HomeContent['carousels']>) => {
    onContent({ ...content, carousels: { ...content.carousels, ...patch } });
  };

  return (
    <>
      <p className="text-sm text-gray-600">
        Los encabezados de las dos filas de productos de la portada. Los productos se manejan
        desde Shopify; aquí solo cambias el título.
      </p>
      <TextField
        label="Título de la primera fila"
        value={content.carousels.featuredTitle}
        onChange={(v) => set({ featuredTitle: v })}
      />
      <TextField
        label="Título de la segunda fila"
        value={content.carousels.newArrivalsTitle}
        onChange={(v) => set({ newArrivalsTitle: v })}
      />
    </>
  );
}
