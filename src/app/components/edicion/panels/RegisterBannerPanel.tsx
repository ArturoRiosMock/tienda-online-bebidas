import type { HomeContent, RegisterBannerContent } from '@/types/homeContent';
import { ImageFields } from '@/app/components/edicion/fields/ImageFields';
import { TextField } from '@/app/components/edicion/fields/TextField';

interface RegisterBannerPanelProps {
  content: HomeContent;
  onContent: (next: HomeContent) => void;
  onUploadingChange: (uploading: boolean) => void;
}

export function RegisterBannerPanel({
  content,
  onContent,
  onUploadingChange,
}: RegisterBannerPanelProps) {
  const banner = content.registerBanner;

  const set = (patch: Partial<RegisterBannerContent>) => {
    onContent({ ...content, registerBanner: { ...banner, ...patch } });
  };

  return (
    <>
      <p className="text-sm text-gray-600">
        Es la franja que invita a cotizar un evento, más abajo en la portada.
      </p>
      <ImageFields
        mobile={banner.imageMobile}
        desktop={banner.imageDesktop}
        onUploadingChange={onUploadingChange}
        onMobile={(v) => set({ imageMobile: v, imageDesktop: banner.imageDesktop || v })}
        onDesktop={(v) => set({ imageDesktop: v, imageMobile: banner.imageMobile || v })}
      />
      <TextField label="Título" value={banner.title} onChange={(v) => set({ title: v })} />
      <TextField
        label="Descripción"
        value={banner.description}
        onChange={(v) => set({ description: v })}
        multiline
      />
      <TextField
        label="Texto del botón"
        value={banner.buttonText}
        onChange={(v) => set({ buttonText: v })}
      />
      <TextField
        label="A dónde lleva el botón"
        value={banner.buttonHref || ''}
        onChange={(v) => set({ buttonHref: v })}
        placeholder="/cotizar-evento"
        hint="Vacío = formulario de cotización de eventos."
      />
    </>
  );
}
