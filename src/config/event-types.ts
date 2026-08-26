export const GRADUATION_EVENT_TYPE = 'Graduación';
export const OTHER_EVENT_TYPE = 'Otro';

export const EVENT_TYPES = [
  'Boda',
  'Cumpleaños',
  'Fiesta corporativa',
  'XV Años',
  'Reunión social',
  GRADUATION_EVENT_TYPE,
  OTHER_EVENT_TYPE,
];

export function resolveEventTypeLabel(eventType: string, other: string): string {
  if (eventType !== OTHER_EVENT_TYPE) return eventType;
  return other.trim() || OTHER_EVENT_TYPE;
}
