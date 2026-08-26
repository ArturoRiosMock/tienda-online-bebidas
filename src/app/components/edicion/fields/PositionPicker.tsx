import type { HeroPosition } from '@/types/homeContent';
import { FieldLabel } from '@/app/components/edicion/fields/FieldLabel';
import {
  DEFAULT_HERO_POSITION,
  HERO_POSITIONS,
} from '@/app/components/hero/heroPosition';

interface PositionPickerProps {
  label: string;
  value?: HeroPosition;
  onChange: (v: HeroPosition) => void;
}

export function PositionPicker({ label, value, onChange }: PositionPickerProps) {
  const current = value || DEFAULT_HERO_POSITION;
  const selected = HERO_POSITIONS.find((p) => p.id === current);

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center gap-3">
        <div className="grid w-24 grid-cols-3 gap-1 rounded-lg border border-gray-300 bg-gray-50 p-1">
          {HERO_POSITIONS.map((position) => (
            <button
              key={position.id}
              type="button"
              onClick={() => onChange(position.id)}
              title={position.label}
              aria-label={position.label}
              aria-pressed={current === position.id}
              className={`flex h-6 items-center justify-center rounded transition-colors ${
                current === position.id
                  ? 'bg-[#0c3c1f]'
                  : 'bg-white hover:bg-[#0c3c1f]/20'
              }`}
            >
              <span
                className={`h-1.5 w-3 rounded-sm ${
                  current === position.id ? 'bg-[#FDB93A]' : 'bg-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600">{selected?.label}</p>
      </div>
    </div>
  );
}
