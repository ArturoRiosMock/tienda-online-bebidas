import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: '¿Cuál es el tiempo de entrega?',
    answer: 'Realizamos entregas en 24-48 horas en zonas urbanas. Para zonas más alejadas, el tiempo puede extenderse de 3 a 5 días hábiles. Recibirás una notificación con el número de seguimiento una vez que tu pedido sea despachado.'
  },
  {
    question: '¿Los productos son 100% naturales?',
    answer: 'Sí, todos nuestros productos están elaborados con ingredientes 100% naturales. No utilizamos conservantes artificiales, colorantes ni saborizantes químicos. Trabajamos con productores locales para garantizar la frescura y calidad de cada bebida.'
  },
  {
    question: '¿Cuáles son los métodos de pago?',
    answer: 'Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), transferencias bancarias, PayPal y pago en efectivo contra entrega en zonas seleccionadas. Todos los pagos son procesados de forma segura.'
  },
  {
    question: '¿Puedo devolver un producto?',
    answer: 'Sí, aceptamos devoluciones dentro de los primeros 7 días después de la entrega si el producto llega en mal estado o con defectos. Contacta a nuestro servicio al cliente con fotos del producto y procesaremos tu devolución o cambio inmediatamente.'
  },
  {
    question: '¿Hay pedido mínimo?',
    answer: 'No, no tenemos pedido mínimo. Puedes comprar desde una sola bebida. Sin embargo, para pedidos superiores a $50, ofrecemos envío gratuito como beneficio especial.'
  },
  {
    question: '¿Las bebidas necesitan refrigeración?',
    answer: 'Sí, la mayoría de nuestras bebidas son productos frescos que requieren refrigeración. Te recomendamos guardarlas en el refrigerador inmediatamente después de recibirlas. Cada producto incluye instrucciones específicas de almacenamiento en la etiqueta.'
  },
  {
    question: '¿Tienen opciones sin azúcar?',
    answer: 'Sí, contamos con una amplia selección de bebidas sin azúcar añadida y endulzadas naturalmente con stevia o fruta. Puedes filtrar estos productos en nuestra tienda usando la categoría "Sin Azúcar".'
  },
  {
    question: '¿Ofrecen suscripciones mensuales?',
    answer: 'Sí, ofrecemos planes de suscripción mensual con descuentos de hasta 15%. Puedes personalizar tu caja eligiendo tus bebidas favoritas y modificar tu suscripción en cualquier momento sin cargos adicionales.'
  }
];

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
              transition={{ delay: index * 0.1 }}
              className="mb-4"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full bg-white rounded-lg p-6 text-left hover:shadow-md transition-shadow duration-300 border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-[#212121] pr-8">
                    {faq.question}
                  </h3>
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
                      <p className="text-[#717182] mt-4 leading-relaxed">
                        {faq.answer}
                      </p>
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
              Nuestro equipo de soporte está disponible de lunes a viernes de 9:00 AM a 6:00 PM
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="mailto:soporte@bebidasfrescas.com"
                className="bg-white text-[#0c3c1f] px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Enviar Email
              </a>
              <a
                href="tel:+123456789"
                className="border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-[#0c3c1f] transition-colors"
              >
                Llamar Ahora
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
