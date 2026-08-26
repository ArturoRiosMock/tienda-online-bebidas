import type { EventFormData } from './eventForm.types';
import { applyPurchaseAttributes } from './applyPurchaseAttributes';

type UpdateAttributes = (attrs: { key: string; value: string }[]) => Promise<unknown>;

interface ConfirmArgs {
  eventData: EventFormData | null;
  updateAttributes?: UpdateAttributes;
  goToCheckout?: () => Promise<boolean>;
  onSuccess: () => void;
}

export async function confirmCartCheckout({
  eventData,
  updateAttributes,
  goToCheckout,
  onSuccess,
}: ConfirmArgs): Promise<void> {
  await applyPurchaseAttributes(updateAttributes, eventData);
  const ok = await goToCheckout?.();
  if (ok) onSuccess();
}
