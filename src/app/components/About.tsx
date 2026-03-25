import React from 'react';
import { motion } from 'motion/react';
import { Heart, Award, Users, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { about } from '@/content/mrbrown/about';

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
                alt="Mr. Brown HOUSE OF SPIRITS"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c3c1f]/60 to-transparent" />
            </div>

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
                  <div className="text-[#0c3c1f] font-bold">Desde 2018</div>
                  <div className="text-[#717182] text-sm">Curadores de experiencias</div>
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
            <div className="inline-block bg-[#0c3c1f]/10 px-4 py-2 rounded-full mb-2">
              <span className="text-[#0c3c1f] font-medium">{about.badge}</span>
            </div>

            <p className="text-[#FDB93A] font-bold text-sm tracking-widest uppercase mb-3">
              {about.tagline}
            </p>

            <h2 className="text-[#212121] mb-6">{about.headline}</h2>

            <p className="text-[#717182] mb-4 leading-relaxed">{about.paragraphs[0]}</p>
            <p className="text-[#717182] mb-8 leading-relaxed">{about.paragraphs[1]}</p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {[
                { icon: Heart, feature: about.features[0] },
                { icon: Sparkles, feature: about.features[1] },
                { icon: Users, feature: about.features[2] },
                { icon: Award, feature: about.features[3] },
              ].map(({ icon: Icon, feature }, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-10 h-10 bg-[#0c3c1f]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#0c3c1f]" />
                  </div>
                  <div>
                    <h4 className="text-[#212121] mb-1">{feature.title}</h4>
                    <p className="text-[#717182] text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-[#0c3c1f]/5 border-l-4 border-[#0c3c1f] p-4 rounded mb-6">
              <p className="text-[#212121] italic">"{about.quote}"</p>
            </div>

            <Link
              to="/sobre-nosotros"
              className="inline-flex items-center gap-2 text-[#0c3c1f] font-semibold hover:underline"
            >
              <span className="w-6 h-6 bg-[#0c3c1f] rounded-full flex items-center justify-center text-white text-sm">→</span>
              Conoce toda nuestra historia
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
