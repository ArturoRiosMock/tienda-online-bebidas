import { motion } from 'motion/react';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { MIN_GUESTS } from '@/config/event-quote-options';
import { QuoteEventTypeField } from './QuoteEventTypeField';
import type { QuoteFormData, SetQuoteField } from './quoteForm.types';

const INPUT_CLASS = 'bg-white border-gray-300';

interface Props {
  form: QuoteFormData;
  set: SetQuoteField;
}

export function QuoteEventFields({ form, set }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <h2 className="text-xl font-bold text-[#212121] mb-1">Detalles del evento</h2>
      <p className="text-sm text-[#717182] mb-5">Cuéntanos sobre tu celebración</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <QuoteEventTypeField form={form} set={set} />

        <div className="space-y-2">
          <Label htmlFor="date" className="flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4 text-[#0c3c1f]" />
            Fecha del evento *
          </Label>
          <Input
            id="date"
            type="date"
            value={form.date}
            onChange={(e) => set('date', e.target.value)}
            required
            className={INPUT_CLASS}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="guests" className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#0c3c1f]" />
            Número de personas *
          </Label>
          <Input
            id="guests"
            type="number"
            min={MIN_GUESTS}
            step={1}
            placeholder={String(MIN_GUESTS)}
            value={form.guests}
            onChange={(e) => set('guests', e.target.value)}
            required
            className={INPUT_CLASS}
          />
          <p className="text-xs text-[#717182]">Eventos desde {MIN_GUESTS} personas.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#0c3c1f]" />
            Ubicación del evento *
          </Label>
          <Input
            id="location"
            placeholder="Ciudad o dirección"
            value={form.location}
            onChange={(e) => set('location', e.target.value)}
            required
            className={INPUT_CLASS}
          />
        </div>
      </div>
    </motion.div>
  );
}
