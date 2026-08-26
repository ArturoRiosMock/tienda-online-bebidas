import type { LucideIcon } from 'lucide-react';
import { RadioGroupItem } from '@/app/components/ui/radio-group';

export type PurchaseType = 'personal' | 'evento';

interface PurchaseTypeChoiceProps {
  value: PurchaseType;
  selected: PurchaseType;
  Icon: LucideIcon;
  label: string;
}

export function PurchaseTypeChoice({
  value,
  selected,
  Icon,
  label,
}: PurchaseTypeChoiceProps) {
  const active = value === selected;
  const box = active
    ? 'border-[#0c3c1f] bg-[#0c3c1f]/5'
    : 'border-gray-200 hover:border-gray-300';
  const tint = active ? 'text-[#0c3c1f]' : 'text-gray-400';
  const text = active ? 'text-[#0c3c1f]' : 'text-gray-600';

  return (
    <label
      htmlFor={value}
      className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${box}`}
    >
      <RadioGroupItem value={value} id={value} className="sr-only" />
      <Icon className={`w-8 h-8 ${tint}`} />
      <span className={`text-sm font-semibold ${text}`}>{label}</span>
    </label>
  );
}
