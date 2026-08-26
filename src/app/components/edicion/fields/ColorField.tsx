import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { FieldLabel } from '@/app/components/edicion/fields/FieldLabel';

const PRESETS = [
  { value: '#0c3c1f', label: 'Verde Mr. Brown' },
  { value: '#FDB93A', label: 'Amarillo Mr. Brown' },
  { value: '#ffffff', label: 'Blanco' },
  { value: '#111827', label: 'Negro' },
];

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Deja siempre 6 dígitos: `input[type=color]` ignora la forma corta y se pintaría de negro. */
function normalize(raw: string): string | null {
  const digits = raw.trim().replace(/^#/, '');
  if (!HEX.test(`#${digits}`)) return null;
  const full =
    digits.length === 3
      ? digits
          .split('')
          .map((c) => c + c)
          .join('')
      : digits;
  return `#${full}`;
}

interface ColorFieldProps {
  label: string;
  value?: string;
  fallback: string;
  onChange: (v: string | undefined) => void;
  hint?: string;
}

export function ColorField({ label, value, fallback, onChange, hint }: ColorFieldProps) {
  const current = normalize(value || '') || fallback;
  const [typed, setTyped] = useState<string | null>(null);

  /** Mientras escribe puede haber un hex incompleto: solo se guarda cuando ya es válido. */
  const handleTyping = (raw: string) => {
    setTyped(raw);
    const hex = normalize(raw);
    if (hex) onChange(hex);
  };

  const pick = (hex: string | undefined) => {
    setTyped(null);
    onChange(hex);
  };

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="color"
          value={current}
          onChange={(e) => pick(e.target.value)}
          className="h-9 w-12 cursor-pointer rounded-lg border border-gray-300 bg-white p-1"
          aria-label={`${label}: elegir color`}
        />
        <input
          type="text"
          value={typed ?? current}
          onChange={(e) => handleTyping(e.target.value)}
          onBlur={() => setTyped(null)}
          spellCheck={false}
          className="w-28 rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs uppercase focus:outline-none focus:ring-2 focus:ring-[#0c3c1f]"
        />
        {PRESETS.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => pick(preset.value)}
            title={preset.label}
            aria-label={preset.label}
            className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 ${
              current.toLowerCase() === preset.value.toLowerCase()
                ? 'border-[#0c3c1f]'
                : 'border-gray-200'
            }`}
            style={{ backgroundColor: preset.value }}
          />
        ))}
        {current.toLowerCase() !== fallback.toLowerCase() && (
          <button
            type="button"
            onClick={() => pick(undefined)}
            className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 hover:underline"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Volver al original
          </button>
        )}
      </div>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}
