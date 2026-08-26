import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { EVENT_TYPES, OTHER_EVENT_TYPE } from '@/config/event-types';
import type { QuoteFormData, SetQuoteField } from './quoteForm.types';

const OPTIONS = EVENT_TYPES.map((type) => (
  <SelectItem key={type} value={type}>
    {type}
  </SelectItem>
));

interface Props {
  form: QuoteFormData;
  set: SetQuoteField;
}

export function QuoteEventTypeField({ form, set }: Props) {
  return (
    <>
      <div className="space-y-2">
        <Label>Tipo de evento *</Label>
        <Select value={form.eventType} onValueChange={(v) => set('eventType', v)}>
          <SelectTrigger className="bg-white border-gray-300">
            <SelectValue placeholder="Selecciona" />
          </SelectTrigger>
          <SelectContent>{OPTIONS}</SelectContent>
        </Select>
      </div>

      {form.eventType === OTHER_EVENT_TYPE && (
        <div className="space-y-2">
          <Label htmlFor="eventTypeOther">¿Qué tipo de evento es? *</Label>
          <Input
            id="eventTypeOther"
            placeholder="Ejemplo: Aniversario de bodas"
            value={form.eventTypeOther}
            onChange={(e) => set('eventTypeOther', e.target.value)}
            required
            className="bg-white border-gray-300"
          />
        </div>
      )}
    </>
  );
}
