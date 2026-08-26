import { motion } from 'motion/react';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { BUDGET_RANGES, DRINK_OPTIONS } from '@/config/event-quote-options';
import type { QuoteFormData, SetQuoteField } from './quoteForm.types';

const BUDGET_OPTIONS = BUDGET_RANGES.map((range) => (
  <SelectItem key={range} value={range}>
    {range}
  </SelectItem>
));

interface Props {
  form: QuoteFormData;
  set: SetQuoteField;
  onToggleDrink: (drink: string) => void;
}

export function QuotePreferences({ form, set, onToggleDrink }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <h2 className="text-xl font-bold text-[#212121] mb-1">Preferencias</h2>
      <p className="text-sm text-[#717182] mb-5">Ayúdanos a armar tu propuesta ideal</p>

      <div className="mb-6">
        <Label className="mb-3">Bebidas de interés</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
          {DRINK_OPTIONS.map((drink) => (
            <label
              key={drink}
              className="flex items-center gap-2 cursor-pointer select-none text-sm text-[#212121]"
            >
              <Checkbox
                checked={form.drinks.includes(drink)}
                onCheckedChange={() => onToggleDrink(drink)}
              />
              {drink}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6 space-y-2">
        <Label>Rango de presupuesto</Label>
        <Select value={form.budget} onValueChange={(v) => set('budget', v)}>
          <SelectTrigger className="bg-white border-gray-300">
            <SelectValue placeholder="Selecciona un rango" />
          </SelectTrigger>
          <SelectContent>{BUDGET_OPTIONS}</SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comments">Comentarios adicionales</Label>
        <Textarea
          id="comments"
          placeholder="¿Algo más que debamos saber? Tema del evento, requerimientos especiales, etc."
          value={form.comments}
          onChange={(e) => set('comments', e.target.value)}
          className="bg-white border-gray-300 min-h-[100px]"
        />
      </div>
    </motion.div>
  );
}
