import { resolveEventTypeLabel } from '@/config/event-types';
import type { QuoteFormData } from './quoteForm.types';

export function buildQuoteMessage(form: QuoteFormData): string {
  const lines = [
    '*Cotización de Evento*',
    '',
    '*Contacto*',
    `Nombre: ${form.name}`,
    `Teléfono: ${form.phone}`,
    `Email: ${form.email}`,
    '',
    '*Evento*',
    `Tipo: ${resolveEventTypeLabel(form.eventType, form.eventTypeOther)}`,
    `Fecha: ${form.date}`,
    `Personas: ${form.guests}`,
    `Ubicación: ${form.location}`,
    '',
    '*Preferencias*',
    form.drinks.length > 0 ? `Bebidas: ${form.drinks.join(', ')}` : '',
    form.budget ? `Presupuesto: ${form.budget}` : '',
    form.comments ? `Comentarios: ${form.comments}` : '',
  ];
  return lines.filter(Boolean).join('\n');
}
