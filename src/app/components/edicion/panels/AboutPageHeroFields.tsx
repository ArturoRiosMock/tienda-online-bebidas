import type { AboutPageContent } from '@/types/homeContent';
import { TextField } from '@/app/components/edicion/fields/TextField';

type Props = {
  page: AboutPageContent;
  set: (patch: Partial<AboutPageContent>) => void;
};

export function AboutPageHeroFields({ page, set }: Props) {
  return (
    <>
      <TextField
        label="Franja superior"
        value={page.tagline}
        onChange={(v) => set({ tagline: v })}
        hint="La línea chica en amarillo, arriba del título."
      />
      <TextField label="Título grande" value={page.badge} onChange={(v) => set({ badge: v })} />
      <TextField
        label="Subtítulo"
        value={page.headline}
        onChange={(v) => set({ headline: v })}
        multiline
      />
    </>
  );
}
