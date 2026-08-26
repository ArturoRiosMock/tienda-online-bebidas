import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send } from 'lucide-react';
import { useDocumentMeta } from '@/app/hooks/useDocumentMeta';
import { QuoteContactFields } from '@/app/components/eventQuote/QuoteContactFields';
import { QuoteEventFields } from '@/app/components/eventQuote/QuoteEventFields';
import { QuoteHero } from '@/app/components/eventQuote/QuoteHero';
import { QuotePreferences } from '@/app/components/eventQuote/QuotePreferences';
import { QuoteSuccess } from '@/app/components/eventQuote/QuoteSuccess';
import { buildQuoteMessage } from '@/app/components/eventQuote/buildQuoteMessage';
import { isQuoteReady } from '@/app/components/eventQuote/quoteValidation';
import {
  EMPTY_QUOTE,
  type QuoteFormData,
} from '@/app/components/eventQuote/quoteForm.types';

const WHATSAPP_NUMBER = '5215515012488';

export const EventQuotePage: React.FC = () => {
  const [form, setForm] = useState<QuoteFormData>(EMPTY_QUOTE);
  const [submitted, setSubmitted] = useState(false);

  useDocumentMeta({
    title: 'Cotiza tu Evento',
    description:
      'Solicita una cotización para bodas, cumpleaños, fiestas corporativas o XV años en CDMX. Barras libres, mixología y bebidas premium a medida con Mr. Brown.',
    canonicalPath: '/cotizar-evento',
  });

  const set = (field: keyof QuoteFormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleDrink = (drink: string) =>
    setForm((prev) => ({
      ...prev,
      drinks: prev.drinks.includes(drink)
        ? prev.drinks.filter((d) => d !== drink)
        : [...prev.drinks, drink],
    }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(buildQuoteMessage(form));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
    setSubmitted(true);
  };

  const reset = () => {
    setForm(EMPTY_QUOTE);
    setSubmitted(false);
  };

  if (submitted) return <QuoteSuccess onReset={reset} />;

  return (
    <>
      <QuoteHero />

      <section className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-10">
          <QuoteContactFields form={form} set={set} />
          <QuoteEventFields form={form} set={set} />
          <QuotePreferences form={form} set={set} onToggleDrink={toggleDrink} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pt-2"
          >
            <button
              type="submit"
              disabled={!isQuoteReady(form)}
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
