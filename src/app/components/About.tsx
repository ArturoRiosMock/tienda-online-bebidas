import React from 'react';
import { motion } from 'motion/react';
import { Heart, Award, Users, Sparkles } from 'lucide-react';

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
                src="https://images.unsplash.com/photo-1609270460854-e8ea8c0b591f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwd29ya2luZyUyMGNhZmUlMjBidXNpbmVzc3xlbnwxfHx8fDE3NzAxMzI5OTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Nuestro equipo"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c3c1f]/60 to-transparent" />
            </div>
            
            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl border-2 border-[#0c3c1f]/10"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#0c3c1f] rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-[#0c3c1f]">+10 Años</div>
                  <div className="text-[#717182] text-sm">de Experiencia</div>
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
            <div className="inline-block bg-[#0c3c1f]/10 px-4 py-2 rounded-full mb-4">
              <span className="text-[#0c3c1f]">Quiénes Somos</span>
            </div>
            
            <h2 className="text-[#212121] mb-6">
              Pasión por las Bebidas Naturales
            </h2>
            
            <p className="text-[#717182] mb-6 leading-relaxed">
              BebidasFrescas nació en 2016 con una visión clara: llevar bebidas 100% naturales y saludables a cada hogar. Nos comprometemos con la calidad, frescura y el bienestar de nuestros clientes.
            </p>
            
            <p className="text-[#717182] mb-8 leading-relaxed">
              Trabajamos directamente con productores locales para garantizar ingredientes frescos y de temporada. Cada bebida es preparada con amor y dedicación, sin conservantes artificiales ni aditivos químicos.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-start gap-3"
              >
                <div className="w-10 h-10 bg-[#0c3c1f]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-[#0c3c1f]" />
                </div>
                <div>
                  <h4 className="text-[#212121] mb-1">Con Amor</h4>
                  <p className="text-[#717182] text-sm">Preparado con dedicación</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-start gap-3"
              >
                <div className="w-10 h-10 bg-[#0c3c1f]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-[#0c3c1f]" />
                </div>
                <div>
                  <h4 className="text-[#212121] mb-1">Calidad Premium</h4>
                  <p className="text-[#717182] text-sm">Los mejores ingredientes</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-start gap-3"
              >
                <div className="w-10 h-10 bg-[#0c3c1f]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-[#0c3c1f]" />
                </div>
                <div>
                  <h4 className="text-[#212121] mb-1">Comunidad</h4>
                  <p className="text-[#717182] text-sm">Clientes satisfechos</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-start gap-3"
              >
                <div className="w-10 h-10 bg-[#0c3c1f]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-[#0c3c1f]" />
                </div>
                <div>
                  <h4 className="text-[#212121] mb-1">Certificados</h4>
                  <p className="text-[#717182] text-sm">Estándares de calidad</p>
                </div>
              </motion.div>
            </div>

            <div className="bg-[#0c3c1f]/5 border-l-4 border-[#0c3c1f] p-4 rounded">
              <p className="text-[#212121] italic">
                "Nuestra misión es simple: hacer que cada día sea más saludable y delicioso con nuestras bebidas naturales."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
