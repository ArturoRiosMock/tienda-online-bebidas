import React from 'react';
import { motion } from 'motion/react';
import { Truck, Package, Users, Zap } from 'lucide-react';

export const About = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1767522247768-fb18caca37f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZXZlcmFnZSUyMGRpc3RyaWJ1dGlvbiUyMHdhcmVob3VzZXxlbnwxfHx8fDE3NzAxMzM1ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Centro de distribución Bebify"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0055a2]/60 to-transparent" />
            </div>
            
            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl border-2 border-[#0055a2]/10"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#0055a2] rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-[#0055a2] font-bold text-xl">+250</div>
                  <div className="text-[#717182] text-sm">Clientes Satisfechos</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block bg-[#0055a2]/10 px-4 py-2 rounded-full mb-4">
              <span className="text-[#0055a2]">Quiénes Somos</span>
            </div>
            
            <h2 className="text-[#212121] mb-6">
              Revolucionamos el suministro de bebidas
            </h2>
            
            <p className="text-[#717182] mb-6 leading-relaxed">
              En Bebify, centralizamos tus pedidos con más de 300 proveedores, ahorrándote tiempo y reduciendo costos en la gestión de suministros para tu centro de consumo.
            </p>
            
            <p className="text-[#717182] mb-8 leading-relaxed">
              Con más de 2,000 bebidas disponibles, ofrecemos la diversidad que necesitas para satisfacer todas las preferencias de tus clientes. Nuestra plataforma tecnológica garantiza pedidos sin errores y entregas confiables.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-start gap-3"
              >
                <div className="w-10 h-10 bg-[#0055a2]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-[#0055a2]" />
                </div>
                <div>
                  <h4 className="text-[#212121] mb-1">Coordinación Simple</h4>
                  <p className="text-[#717182] text-sm">+300 proveedores centralizados</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-start gap-3"
              >
                <div className="w-10 h-10 bg-[#0055a2]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-[#0055a2]" />
                </div>
                <div>
                  <h4 className="text-[#212121] mb-1">Amplio Catálogo</h4>
                  <p className="text-[#717182] text-sm">+2,000 productos disponibles</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-start gap-3"
              >
                <div className="w-10 h-10 bg-[#0055a2]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-[#0055a2]" />
                </div>
                <div>
                  <h4 className="text-[#212121] mb-1">Entregas 24h</h4>
                  <p className="text-[#717182] text-sm">En toda la CDMX</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-start gap-3"
              >
                <div className="w-10 h-10 bg-[#0055a2]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-[#0055a2]" />
                </div>
                <div>
                  <h4 className="text-[#212121] mb-1">+250 Clientes</h4>
                  <p className="text-[#717182] text-sm">Confían en Bebify</p>
                </div>
              </motion.div>
            </div>

            <div className="bg-[#0055a2]/5 border-l-4 border-[#0055a2] p-4 rounded">
              <p className="text-[#212121] italic">
                "Optimiza tu operación, ahorra tiempo y dinero. Revolucionamos el suministro de bebidas para centros de consumo."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
