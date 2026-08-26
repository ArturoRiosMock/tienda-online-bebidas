import { MIN_GUESTS } from '@/config/event-quote-options';
import { OTHER_EVENT_TYPE } from '@/config/event-types';
import type { QuoteFormData } from './quoteForm.types';

export function isQuoteReady(form: QuoteFormData): boolean {
  const hasType =
    Boolean(form.eventType) &&
    (form.eventType !== OTHER_EVENT_TYPE || Boolean(form.eventTypeOther.trim()));

  return Boolean(
    form.name &&
      form.phone &&
      form.email &&
      hasType &&
      form.date &&
      form.location.trim() &&
      Number(form.guests) >= MIN_GUESTS,
  );
}
