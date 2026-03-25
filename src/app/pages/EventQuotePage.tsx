import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CalendarDays, Users, MapPin, Send, CheckCircle2, PartyPopper, Wine } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

const EVENT_TYPES = [
  'Boda',
  'Cumpleaños',
  'Fiesta corporativa',
  'XV Años',
  'Baby Shower',
  'Reunión social',
  'Otro',
];

const DRINK_OPTIONS = [
  'Whisky',
  'Vino',
  'Champagne / Espumante',
  'Vodka',
  'Gin',
  'Licor',
  'Cerveza',
  'Refrescos / Agua',
  'Otro',
];

const BUDGET_RANGES = [
  'Menos de $5,000',
  '$5,000 – $15,000',
  '$15,000 – $30,000',
  '$30,000 – $50,000',
  'Más de $50,000',
  'No estoy seguro',
];

const WHATSAPP_NUMBER = '5215512345678';

interface FormData {
  name: string;
  phone: string;
  email: string;
  eventType: string;
  date: string;
  guests: string;
  location: string;
  drinks: string[];
  budget: string;
  comments: string;
}

const initialForm: FormData = {
  name: '',
  phone: '',
  email: '',
  eventType: '',
  date: '',
  guests: '',
  location: '',
  drinks: [],
  budget: '',
  comments: '',
};

export const EventQuotePage: React.FC = () => {
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const set = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleDrink = (drink: string) =>
    setForm((prev) => ({
      ...prev,
      drinks: prev.drinks.includes(drink)
        ? prev.drinks.filter((d) => d !== drink)
        : [...prev.drinks, drink],
    }));

  const buildWhatsAppMessage = () => {
    const lines = [
      `*Cotización de Evento*`,
      ``,
      `*Contacto*`,
      `Nombre: ${form.name}`,
      `Teléfono: ${form.phone}`,
      `Email: ${form.email}`,
      ``,
      `*Evento*`,
      `Tipo: ${form.eventType}`,
      `Fecha: ${form.date}`,
      `Personas: ${form.guests}`,
      form.location ? `Ubicación: ${form.location}` : '',
      ``,
      `*Preferencias*`,
      form.drinks.length > 0 ? `Bebidas: ${form.drinks.join(', ')}` : '',
      form.budget ? `Presupuesto: ${form.budget}` : '',
      form.comments ? `Comentarios: ${form.comments}` : '',
    ];
    return lines.filter(Boolean).join('\n');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = buildWhatsAppMessage();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    setSubmitted(true);
  };

  const isValid =
    form.name && form.phone && form.email && form.eventType && form.date && form.guests;

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-[#0c3c1f]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-[#0c3c1f]" />
          </div>
          <h2 className="text-2xl font-bold text-[#212121] mb-3">
            ¡Solicitud enviada!
          </h2>
          <p className="text-[#717182] mb-6">
            Hemos abierto WhatsApp con los datos de tu cotización. Un asesor de Mr. Brown se pondrá en contacto contigo pronto.
          </p>
          <button
            onClick={() => {
              setForm(initialForm);
              setSubmitted(false);
            }}
            className="bg-[#0c3c1f] text-white px-6 py-3 rounded-lg hover:bg-[#0a3019] transition-colors font-medium"
          >
            Cotizar otro evento
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* Mini Hero */}
      <section className="relative bg-gradient-to-r from-[#0c3c1f] to-[#1a5c35] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
            }}
          />
        </div>
        <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <PartyPopper className="w-8 h-8 text-[#FDB93A]" />
              <Wine className="w-8 h-8 text-[#FDB93A]" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
              Cotiza tu Evento
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-lg">
              Arma el bar perfecto para tu celebración. Cuéntanos los detalles y te preparamos una propuesta a la medida.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Datos de contacto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
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
                  className="bg-white border-gray-300"
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
                  className="bg-white border-gray-300"
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
                  className="bg-white border-gray-300"
                />
              </div>
            </div>
          </motion.div>

          {/* Detalles del evento */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-[#212121] mb-1">Detalles del evento</h2>
            <p className="text-sm text-[#717182] mb-5">Cuéntanos sobre tu celebración</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de evento *</Label>
                <Select value={form.eventType} onValueChange={(v) => set('eventType', v)}>
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
                  className="bg-white border-gray-300"
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
                  min={1}
                  placeholder="50"
                  value={form.guests}
                  onChange={(e) => set('guests', e.target.value)}
                  required
                  className="bg-white border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#0c3c1f]" />
                  Ubicación del evento
                </Label>
                <Input
                  id="location"
                  placeholder="Ciudad o dirección"
                  value={form.location}
                  onChange={(e) => set('location', e.target.value)}
                  className="bg-white border-gray-300"
                />
              </div>
            </div>
          </motion.div>

          {/* Preferencias */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-[#212121] mb-1">Preferencias</h2>
            <p className="text-sm text-[#717182] mb-5">Ayúdanos a armar tu propuesta ideal</p>

            {/* Drinks checkboxes */}
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
                      onCheckedChange={() => toggleDrink(drink)}
                    />
                    {drink}
                  </label>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div className="mb-6 space-y-2">
              <Label>Rango de presupuesto</Label>
              <Select value={form.budget} onValueChange={(v) => set('budget', v)}>
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue placeholder="Selecciona un rango" />
                </SelectTrigger>
                <SelectContent>
                  {BUDGET_RANGES.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Comments */}
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

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pt-2"
          >
            <button
              type="submit"
              disabled={!isValid}
              className="w-full sm:w-auto bg-[#0c3c1f] text-white px-8 py-3.5 rounded-lg hover:bg-[#0a3019] transition-colors font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              Solicitar Cotización por WhatsApp
            </button>
            <p className="text-xs text-[#717182] mt-3">
              * Campos obligatorios. Al enviar, se abrirá WhatsApp con los datos de tu cotización.
            </p>
          </motion.div>
        </form>
      </section>
    </>
  );
};
