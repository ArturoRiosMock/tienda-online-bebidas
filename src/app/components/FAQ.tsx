import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { faqs } from '@/content/mrbrown/faq';
import { Link } from 'react-router-dom';

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-[#0c3c1f]/10 px-4 py-2 rounded-full mb-4"
          >
            <HelpCircle className="w-4 h-4 text-[#0c3c1f]" />
            <span className="text-[#0c3c1f]">Preguntas Frecuentes</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#212121] mb-4"
          >
            ¿Tienes alguna duda?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#717182] max-w-2xl mx-auto"
          >
            Aquí encontrarás respuestas a las preguntas más comunes. Si no encuentras lo que buscas, no dudes en contactarnos.
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07 }}
              className="mb-4"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full bg-white rounded-lg p-6 text-left hover:shadow-md transition-shadow duration-300 border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-[#212121] pr-8">{faq.question}</h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-[#0c3c1f]" />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
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

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-[#0c3c1f] to-[#0a5028] text-white rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-white mb-3">¿Aún tienes preguntas?</h3>
            <p className="text-white/90 mb-6">
              Nuestro equipo está disponible para ayudarte con cualquier duda sobre pedidos, entregas o productos.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="mailto:hola@mrbrown.com.mx"
                className="bg-white text-[#0c3c1f] px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                hola@mrbrown.com.mx
              </a>
              <Link
                to="/preguntas-frecuentes"
                className="border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-[#0c3c1f] transition-colors font-medium"
              >
                Ver todas las FAQ
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
