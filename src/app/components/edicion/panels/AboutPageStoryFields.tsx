import type { AboutPageContent } from '@/types/homeContent';
import { ImageField } from '@/app/components/edicion/fields/ImageField';
import { TextField } from '@/app/components/edicion/fields/TextField';

type Props = {
  page: AboutPageContent;
  set: (patch: Partial<AboutPageContent>) => void;
  onUploadingChange: (uploading: boolean) => void;
};

export function AboutPageStoryFields({ page, set, onUploadingChange }: Props) {
  const setParagraph = (index: number, value: string) => {
    const paragraphs = [...page.paragraphs];
    paragraphs[index] = value;
    set({ paragraphs });
  };

  return (
    <>
      <ImageField
        label="Foto"
        value={page.image}
        onChange={(v) => set({ image: v })}
        onUploadingChange={onUploadingChange}
      />
      <TextField
        label="Descripción de la foto"
        value={page.imageAlt}
        onChange={(v) => set({ imageAlt: v })}
        hint="No se ve en pantalla; la leen los buscadores."
      />
      <TextField
        label="Título de la historia"
        value={page.storyTitle}
        onChange={(v) => set({ storyTitle: v })}
      />
      {page.paragraphs.map((paragraph, index) => (
        <TextField
          key={index}
          label={`Párrafo ${index + 1}`}
          value={paragraph}
          onChange={(v) => setParagraph(index, v)}
          multiline
        />
      ))}
    </>
  );
}
