import type { BenefitItem, HomeContent } from '@/types/homeContent';
import { TextField } from '@/app/components/edicion/fields/TextField';

interface BenefitsPanelProps {
  content: HomeContent;
  onContent: (next: HomeContent) => void;
}

export function BenefitsPanel({ content, onContent }: BenefitsPanelProps) {
  const set = (index: number, patch: Partial<BenefitItem>) => {
    const benefits = [...content.benefits];
    benefits[index] = { ...benefits[index], ...patch };
    onContent({ ...content, benefits });
  };

  return (
    <>
      <p className="text-sm text-gray-600">
        Las cuatro columnas con los argumentos de venta (envíos, pago seguro, etc.).
      </p>
      {content.benefits.map((benefit, index) => (
        <div key={index} className="space-y-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl leading-none">{benefit.icon || '•'}</span>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
              Columna {index + 1}
            </p>
          </div>
          <TextField
            label="Ícono"
            value={benefit.icon}
            onChange={(v) => set(index, { icon: v })}
            hint="Pega un emoji, por ejemplo 🚚 o 🔒."
          />
          <TextField
            label="Título"
            value={benefit.title}
            onChange={(v) => set(index, { title: v })}
          />
          <TextField
            label="Descripción"
            value={benefit.description}
            onChange={(v) => set(index, { description: v })}
            multiline
          />
        </div>
      ))}
    </>
  );
}
