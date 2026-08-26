import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, PartyPopper, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/app/components/ui/dialog';
import { RadioGroup } from '@/app/components/ui/radio-group';
import { EventFields } from '@/app/components/purchase/EventFields';
import {
  PurchaseTypeChoice,
  type PurchaseType,
} from '@/app/components/purchase/PurchaseTypeChoice';
import type { EventFormData } from '@/app/components/purchase/eventForm.types';

export type { EventFormData };

interface PurchaseTypeDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (eventData: EventFormData | null) => Promise<void>;
  loading: boolean;
  error?: string | null;
  onLeaveToQuote?: () => void;
}

export const PurchaseTypeDialog = ({
  open,
  onClose,
  onConfirm,
  loading,
  error,
  onLeaveToQuote,
}: PurchaseTypeDialogProps) => {
  const [purchaseType, setPurchaseType] = useState<PurchaseType>('personal');

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EventFormData>({ shouldUnregister: true });

  useEffect(() => {
    if (open) {
      setPurchaseType('personal');
      reset();
    }
  }, [open, reset]);

  const handleClose = () => {
    setPurchaseType('personal');
    reset();
    onClose();
  };

  const handleLeaveToQuote = () => {
    setPurchaseType('personal');
    reset();
    (onLeaveToQuote ?? onClose)();
  };

  const handleContinue = () => {
    if (purchaseType === 'personal') {
      onConfirm(null);
      return;
    }
    handleSubmit((data) => onConfirm(data))();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#212121] text-xl">
            Tipo de compra
          </DialogTitle>
          <DialogDescription>
            Selecciona si esta compra es personal o para un evento.
          </DialogDescription>
        </DialogHeader>

        <RadioGroup
          value={purchaseType}
          onValueChange={(v) => setPurchaseType(v as PurchaseType)}
          className="grid grid-cols-2 gap-3 mt-2"
        >
          <PurchaseTypeChoice
            value="personal"
            selected={purchaseType}
            Icon={ShoppingBag}
            label="Compra Personal"
          />
          <PurchaseTypeChoice
            value="evento"
            selected={purchaseType}
            Icon={PartyPopper}
            label="Compra para Evento"
          />
        </RadioGroup>

        <AnimatePresence mode="wait">
          {purchaseType === 'evento' && (
            <motion.div
              key="event-form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="overflow-hidden"
            >
              <EventFields
                control={control}
                errors={errors}
                onQuoteNavigate={handleLeaveToQuote}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <p
            className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}

        <DialogFooter className="mt-2 gap-2 sm:gap-0">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="flex-1 sm:flex-none py-2.5 px-5 border-2 border-gray-300 text-gray-600 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={loading}
            className="flex-1 sm:flex-none py-2.5 px-5 bg-[#0c3c1f] text-white rounded-lg font-bold text-sm hover:bg-[#0a3019] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Continuar al pago'
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
