import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';
import type { HeroSlide } from '@/types/homeContent';
import { ImageFields } from '@/app/components/edicion/fields/ImageFields';
import { TextField } from '@/app/components/edicion/fields/TextField';
import { PreviewFrame } from '@/app/components/edicion/PreviewFrame';
import { HeroSlidePreview } from '@/app/components/edicion/HeroSlidePreview';
import { HeroSlideStyle } from '@/app/components/edicion/panels/HeroSlideStyle';

interface HeroSlideCardProps {
  slide: HeroSlide;
  index: number;
  total: number;
  onMove: (to: number) => void;
  onRemove: () => void;
  onPatch: (patch: Partial<HeroSlide>) => void;
  onImage: (field: 'imageMobile' | 'imageDesktop', url: string) => void;
  onUploadingChange: (uploading: boolean) => void;
}

const ICON_BTN =
  'inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-30';

export function HeroSlideCard({
  slide,
  index,
  total,
  onMove,
  onRemove,
  onPatch,
  onImage,
  onUploadingChange,
}: HeroSlideCardProps) {
  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-bold text-gray-800">
          {index === 0 ? 'Banner 1 · el primero que se ve' : `Banner ${index + 1}`}
        </p>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className={ICON_BTN}
            disabled={index === 0}
            onClick={() => onMove(index - 1)}
            aria-label="Subir banner"
            title="Subir"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={ICON_BTN}
            disabled={index === total - 1}
            onClick={() => onMove(index + 1)}
            aria-label="Bajar banner"
            title="Bajar"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={total <= 1}
            onClick={onRemove}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Eliminar
          </button>
        </div>
      </div>

      <PreviewFrame render={(device) => <HeroSlidePreview slide={slide} device={device} />} />

      <ImageFields
        mobile={slide.imageMobile}
        desktop={slide.imageDesktop}
        onUploadingChange={onUploadingChange}
        onMobile={(v) => onImage('imageMobile', v)}
        onDesktop={(v) => onImage('imageDesktop', v)}
      />
      <p className="text-xs text-gray-500">
        Si subes solo una, se usa en los dos tamaños.
      </p>

      <HeroSlideStyle slide={slide} onPatch={onPatch} />

      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <input
          type="checkbox"
          checked={Boolean(slide.imageOnly)}
          onChange={(e) => onPatch({ imageOnly: e.target.checked })}
        />
        Solo imagen, sin títulos encima
      </label>

      {!slide.imageOnly && (
        <div className="space-y-3">
          <TextField
            label="Etiqueta"
            value={slide.badge}
            onChange={(v) => onPatch({ badge: v })}
          />
          <TextField label="Título" value={slide.title} onChange={(v) => onPatch({ title: v })} />
          <TextField
            label="Subtítulo"
            value={slide.subtitle}
            onChange={(v) => onPatch({ subtitle: v })}
            multiline
          />
        </div>
      )}

      <TextField
        label="Texto del botón"
        value={slide.buttonText}
        onChange={(v) => onPatch({ buttonText: v })}
        hint="Déjalo vacío para que el banner no muestre botón."
      />

      <TextField
        label="A dónde lleva el banner"
        value={slide.buttonHref || ''}
        onChange={(v) => onPatch({ buttonHref: v })}
        placeholder="/categorias/vinos o https://…"
        hint="Vacío = baja a los productos. Ruta interna o dirección completa."
      />
    </div>
  );
}
