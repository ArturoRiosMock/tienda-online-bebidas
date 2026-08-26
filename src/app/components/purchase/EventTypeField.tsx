import type { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { EVENT_TYPES } from '@/config/event-types';
import type { EventFormData } from './eventForm.types';

const LABEL_CLASS = 'text-[#212121] font-semibold text-sm';

const OPTIONS = EVENT_TYPES.map((type) => (
  <SelectItem key={type} value={type}>
    {type}
  </SelectItem>
));

interface EventTypeFieldProps {
  control: Control<EventFormData>;
  errors: FieldErrors<EventFormData>;
  isOther: boolean;
}

export function EventTypeField({ control, errors, isOther }: EventTypeFieldProps) {
  const typeError = errors.eventType?.message;
  const otherError = errors.eventTypeOther?.message;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className={LABEL_CLASS}>
          Tipo de evento: <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="eventType"
          control={control}
          rules={{ required: 'Selecciona el tipo de evento' }}
          render={({ field }) => (
            <Select value={field.value ?? ''} onValueChange={field.onChange}>
              <SelectTrigger className={typeError ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>{OPTIONS}</SelectContent>
            </Select>
          )}
        />
        {typeError && <p className="text-red-500 text-xs">{typeError}</p>}
      </div>

      {isOther && (
        <div className="space-y-2">
          <Label className={LABEL_CLASS}>
            ¿Qué tipo de evento es?: <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="eventTypeOther"
            control={control}
            rules={{ required: 'Escribe el tipo de evento' }}
            render={({ field }) => (
              <Input
                placeholder="Ejemplo: Aniversario de bodas"
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                className={otherError ? 'border-red-500' : ''}
              />
            )}
          />
          {otherError && <p className="text-red-500 text-xs">{otherError}</p>}
        </div>
      )}
    </div>
  );
}
