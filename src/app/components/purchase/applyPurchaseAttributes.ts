import type { EventFormData } from './eventForm.types';
import { buildCartAttributes } from './eventAttributes';

type UpdateAttributes = (attrs: { key: string; value: string }[]) => Promise<unknown>;

export async function applyPurchaseAttributes(
  updateAttributes: UpdateAttributes | undefined,
  eventData: EventFormData | null,
): Promise<void> {
  if (!updateAttributes) return;
  await updateAttributes(buildCartAttributes(eventData)).catch(() => {});
}
