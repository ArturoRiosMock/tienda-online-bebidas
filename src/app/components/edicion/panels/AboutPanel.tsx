import type { AboutContent, HomeContent } from '@/types/homeContent';
import { ImageField } from '@/app/components/edicion/fields/ImageField';
import { TextField } from '@/app/components/edicion/fields/TextField';

interface AboutPanelProps {
  content: HomeContent;
  onContent: (next: HomeContent) => void;
  onUploadingChange: (uploading: boolean) => void;
}

export function AboutPanel({ content, onContent, onUploadingChange }: AboutPanelProps) {
  const about = content.about;

  const set = (patch: Partial<AboutContent>) => {
    onContent({ ...content, about: { ...about, ...patch } });
  };

  const setFeature = (index: number, patch: { title?: string; description?: string }) => {
    const features = [...about.features];
    features[index] = { ...features[index], ...patch };
    set({ features });
  };

  return (
    <>
      <p className="text-sm text-gray-600">
        Bloque del inicio. La página /page/sobre-nosotros se edita en la sección de abajo.
      </p>
      <ImageField
        label="Foto"
        value={about.image}
        onChange={(v) => set({ image: v })}
        onUploadingChange={onUploadingChange}
      />
      <TextField
        label="Descripción de la foto"
        value={about.imageAlt}
        onChange={(v) => set({ imageAlt: v })}
        hint="No se ve en pantalla; la leen los buscadores y los lectores de voz."
      />
      <TextField label="Etiqueta" value={about.badge} onChange={(v) => set({ badge: v })} />
      <TextField label="Título" value={about.title} onChange={(v) => set({ title: v })} />
      <TextField
        label="Primer párrafo"
        value={about.paragraph1}
        onChange={(v) => set({ paragraph1: v })}
        multiline
      />
      <TextField
        label="Segundo párrafo"
        value={about.paragraph2}
        onChange={(v) => set({ paragraph2: v })}
        multiline
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Dato destacado"
          value={about.statValue}
          onChange={(v) => set({ statValue: v })}
          placeholder="+500"
        />
        <TextField
          label="Qué significa el dato"
          value={about.statLabel}
          onChange={(v) => set({ statLabel: v })}
          placeholder="eventos atendidos"
        />
      </div>
      {about.features.map((feature, index) => (
        <div key={index} className="space-y-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
            Característica {index + 1}
          </p>
          <TextField
            label="Título"
            value={feature.title}
            onChange={(v) => setFeature(index, { title: v })}
          />
          <TextField
            label="Descripción"
            value={feature.description}
            onChange={(v) => setFeature(index, { description: v })}
          />
        </div>
      ))}
      <TextField
        label="Frase destacada"
        value={about.quote}
        onChange={(v) => set({ quote: v })}
        multiline
      />
    </>
  );
}
