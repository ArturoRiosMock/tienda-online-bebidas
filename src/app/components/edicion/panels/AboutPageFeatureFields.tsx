import type { AboutFeature, AboutPageContent } from '@/types/homeContent';
import { TextField } from '@/app/components/edicion/fields/TextField';

type Props = {
  page: AboutPageContent;
  set: (patch: Partial<AboutPageContent>) => void;
};

export function AboutPageFeatureFields({ page, set }: Props) {
  const setFeature = (index: number, patch: Partial<AboutFeature>) => {
    const features = [...page.features];
    features[index] = { ...features[index], ...patch };
    set({ features });
  };

  return (
    <>
      {page.features.map((feature, index) => (
        <div key={index} className="space-y-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
            Dato {index + 1}
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
        value={page.quote}
        onChange={(v) => set({ quote: v })}
        multiline
      />
    </>
  );
}
