import { motion } from 'motion/react';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import type { QuoteFormData, SetQuoteField } from './quoteForm.types';

const INPUT_CLASS = 'bg-white border-gray-300';

interface Props {
  form: QuoteFormData;
  set: SetQuoteField;
}

export function QuoteContactFields({ form, set }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <h2 className="text-xl font-bold text-[#212121] mb-1">Datos de contacto</h2>
      <p className="text-sm text-[#717182] mb-5">Para enviarte la cotización</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Nombre completo *</Label>
          <Input
            id="name"
            placeholder="Tu nombre"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            required
            className={INPUT_CLASS}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono / WhatsApp *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="55 1234 5678"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            required
            className={INPUT_CLASS}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            required
            className={INPUT_CLASS}
          />
        </div>
      </div>
    </motion.div>
  );
}
