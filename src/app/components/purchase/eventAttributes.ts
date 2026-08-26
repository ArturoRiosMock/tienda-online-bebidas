import { GRADUATION_EVENT_TYPE, resolveEventTypeLabel } from '@/config/event-types';
import type { EventFormData } from './eventForm.types';

export type CartAttribute = { key: string; value: string };

export function buildCartAttributes(
  eventData: EventFormData | null,
): CartAttribute[] {
  if (!eventData) {
    return [{ key: 'Tipo de compra', value: 'Personal' }];
  }

  const base: CartAttribute[] = [
    { key: 'Tipo de compra', value: 'Evento' },
    {
      key: 'Tipo de evento',
      value: resolveEventTypeLabel(eventData.eventType, eventData.eventTypeOther ?? ''),
    },
  ];

  if (eventData.eventType !== GRADUATION_EVENT_TYPE) return base;

  return [
    ...base,
    { key: 'Nombre de la escuela', value: eventData.schoolName },
    { key: 'Nombre del graduado', value: eventData.graduateName },
    { key: 'Número de mesa', value: eventData.tableNumber },
    { key: 'Fecha de la graduación', value: eventData.eventDate },
  ];
}
