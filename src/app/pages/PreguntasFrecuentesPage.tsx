import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { faqs } from '@/content/mrbrown/faq';

export const PreguntasFrecuentesPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <>
      <section className="bg-gradient-to-r from-[#0c3c1f] to-[#1a5c35] py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-[#FDB93A]" />
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-white">Preguntas Frecuentes</h1>
              <p className="text-white/70 mt-1">Todo lo que necesitas saber sobre Mr. Brown</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 max-w-3xl">
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                onClick={() => toggle(i)}
                className="w-full bg-white rounded-xl p-6 text-left border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-[#212121] font-medium pr-6">{faq.question}</h3>
                  <motion.div animate={{ rotate: openIndex === i ? 180 : 0 }} transition={{ duration: 0.25 }} className="flex-shrink-0">
                    <ChevronDown className="w-5 h-5 text-[#0c3c1f]" />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="text-[#717182] mt-4 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 bg-gradient-to-r from-[#0c3c1f] to-[#0a5028] text-white rounded-xl p-8 text-center"
        >
          <h3 className="text-white mb-2">¿No encontraste tu respuesta?</h3>
          <p className="text-white/80 mb-5 text-sm">Escríbenos y te respondemos a la brevedad.</p>
          <a
            href="mailto:hola@mrbrown.com.mx"
            className="inline-block bg-[#FDB93A] text-[#212121] px-6 py-3 rounded-lg font-bold hover:bg-[#FF8A00] transition-colors"
          >
            hola@mrbrown.com.mx
          </a>
        </motion.div>
      </section>
    </>
  );
};
