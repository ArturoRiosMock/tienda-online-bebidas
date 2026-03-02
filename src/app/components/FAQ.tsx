import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: '¿Cómo me registro como cliente en Bebify?',
    answer: 'Regístrate directamente en nuestra plataforma con los datos de tu negocio (centro de consumo, restaurante, bar, etc.). Una vez verificada tu cuenta, tendrás acceso a todo nuestro catálogo con precios exclusivos B2B.'
  },
  {
    question: '¿Cuál es el tiempo de entrega?',
    answer: 'Realizamos entregas en menos de 24 horas en toda la CDMX. Nuestra plataforma tecnológica garantiza pedidos sin errores y entregas rápidas y confiables para que tu negocio nunca se quede sin stock.'
  },
  {
    question: '¿Cómo puedo ver los precios de los productos?',
    answer: 'Los precios son exclusivos para clientes registrados. Una vez que inicies sesión con tu cuenta, podrás ver todos los precios y realizar pedidos. Esto nos permite ofrecer precios competitivos B2B a nuestros clientes.'
  },
  {
    question: '¿Cuáles son los métodos de pago?',
    answer: 'Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), transferencias bancarias y pagos por depósito. Todos los pagos son procesados de forma segura. Para clientes recurrentes, ofrecemos condiciones de crédito.'
  },
  {
    question: '¿Hay pedido mínimo?',
    answer: 'Consulta con nuestro equipo de ventas las condiciones de pedido mínimo. Trabajamos para adaptarnos a las necesidades de cada centro de consumo, desde pequeños bares hasta grandes restaurantes y cadenas.'
  },
  {
    question: '¿Qué variedad de productos manejan?',
    answer: 'Contamos con más de 2,000 productos disponibles de más de 300 proveedores: destilados (whisky, vodka, tequila, gin, ron, mezcal), vinos, champagne, cervezas artesanales, nacionales e importadas, refrescos, aguas y más.'
  },
  {
    question: '¿Puedo devolver un producto?',
    answer: 'Sí, aceptamos devoluciones si el producto llega en mal estado o con defectos. Contacta a nuestro servicio al cliente con fotos del producto y procesaremos tu devolución o cambio de inmediato.'
  },
  {
    question: '¿Cómo contacto a servicio al cliente?',
    answer: 'Puedes contactarnos a través de nuestra página de contacto, por WhatsApp o por correo electrónico. Nuestro equipo de soporte está disponible de lunes a viernes para atender todas tus dudas y solicitudes.'
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
            className="inline-flex items-center gap-2 bg-[#0055a2]/10 px-4 py-2 rounded-full mb-4"
          >
            <HelpCircle className="w-4 h-4 text-[#0055a2]" />
            <span className="text-[#0055a2]">Preguntas Frecuentes</span>
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
                    <ChevronDown className="w-5 h-5 text-[#0055a2]" />
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
          <div className="bg-gradient-to-r from-[#0055a2] to-[#0a5028] text-white rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-white mb-3">¿Aún tienes preguntas?</h3>
            <p className="text-white/90 mb-6">
              Nuestro equipo de soporte está disponible de lunes a viernes de 9:00 AM a 6:00 PM
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://bebify.mx/pages/contact"
                className="bg-white text-[#0055a2] px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Contáctanos
              </a>
              <a
                href="tel:+123456789"
                className="border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-[#0055a2] transition-colors"
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
