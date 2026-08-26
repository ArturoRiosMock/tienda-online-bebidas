import { useState } from 'react';
import { format, isValid, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/app/components/ui/calendar';
import { Input } from '@/app/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';

interface EventDateFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  hasError?: boolean;
}

function parseLoose(value: string): Date | undefined {
  if (!value?.trim()) return undefined;
  const parsed = parse(value.trim(), 'dd/MM/yyyy', new Date());
  return isValid(parsed) ? parsed : undefined;
}

export function EventDateField({
  value,
  onChange,
  onBlur,
  hasError,
}: EventDateFieldProps) {
  const [open, setOpen] = useState(false);
  const selected = parseLoose(value);

  return (
    <div className="flex gap-2">
      <Input
        placeholder="DD/MM/AAAA"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={hasError ? 'border-red-500' : ''}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="Abrir calendario"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-input bg-input-background hover:bg-accent"
          >
            <CalendarIcon className="h-4 w-4 text-[#0c3c1f]" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(day) => {
              if (!day) return;
              onChange(format(day, 'dd/MM/yyyy', { locale: es }));
              setOpen(false);
            }}
            locale={es}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
