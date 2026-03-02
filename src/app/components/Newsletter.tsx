import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, User, Check } from 'lucide-react';

export const Newsletter = () => {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: ''
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      alert('Por favor acepta los términos y condiciones');
      return;
    }
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', whatsapp: '', email: '' });
      setAcceptedTerms(false);
    }, 3000);
  };

  return (
    <section className="bg-gradient-to-r from-[#0055a2] to-[#0a5029] py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Section - Promotion */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 text-white"
          >
            <div className="border-2 border-white/30 rounded-lg p-6 backdrop-blur-sm bg-white/5">
              <h3 className="text-3xl font-bold mb-4">¿Aún no tienes cuenta?</h3>
              <p className="text-xl mb-2">
                Regístrate y disfruta del mejor servicio de suministro de bebidas
              </p>
              <p className="mb-6">para tu negocio</p>
              
              <div className="mb-4">
                <motion.a
                  href="/login"
                  whileHover={{ scale: 1.05 }}
                  className="inline-block bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] px-6 py-3 rounded-full shadow-lg"
                >
                  <span className="font-bold text-lg tracking-wider">REGÍSTRATE</span>
                </motion.a>
              </div>

              <p className="text-xs mt-6 opacity-80">
                +250 centros de consumo ya confían en Bebify
              </p>
              <p className="text-xs mt-2 opacity-80">
                Entregas en menos de 24 horas en CDMX
              </p>
            </div>
          </motion.div>

          {/* Center Section - Image */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4 flex justify-center"
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-[#FDB93A] rounded-full blur-3xl opacity-20 scale-110" />
              
              {/* Bottles Image */}
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1681937425985-e6766b090115?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkcmlua3MlMjBib3R0bGVzJTIwY29sbGVjdGlvbiUyMGRhcmt8ZW58MXx8fHwxNzcwMTM0NDI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Premium Bebidas"
                  className="w-full max-w-md h-auto object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </motion.div>

          {/* Right Section - Newsletter Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-5"
          >
            <div className="bg-white rounded-lg p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-[#212121] mb-2">
                Regístrate para el
              </h3>
              <h3 className="text-2xl font-bold text-[#0055a2] mb-4">
                Boletín de Noticias
              </h3>
              <p className="text-[#717182] text-sm mb-6">
                Suscríbete para recibir notificaciones sobre nuevas ofertas exclusivas para tu negocio
              </p>

              {isSubmitted ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
                >
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-green-800 font-semibold text-lg mb-2">
                    ¡Registro Exitoso!
                  </h4>
                  <p className="text-green-600 text-sm">
                    Pronto recibirás nuestras mejores ofertas
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Input */}
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0055a2]">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      placeholder="Nombre"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full pl-12 pr-4 py-3 border-2 border-[#0055a2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0055a2]/50 text-[#212121] placeholder-[#717182]"
                    />
                  </div>

                  {/* WhatsApp Input */}
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0055a2]">
                      <Phone className="w-5 h-5" />
                    </div>
                    <input
                      type="tel"
                      placeholder="WhatsApp"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      required
                      className="w-full pl-12 pr-4 py-3 border-2 border-[#0055a2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0055a2]/50 text-[#212121] placeholder-[#717182]"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0055a2]">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      placeholder="E-mail"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full pl-12 pr-4 py-3 border-2 border-[#0055a2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0055a2]/50 text-[#212121] placeholder-[#717182]"
                    />
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#0055a2] text-white px-6 py-2 rounded-lg hover:bg-[#004488] transition-colors font-semibold"
                    >
                      Registrar
                    </motion.button>
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 text-[#0055a2] border-gray-300 rounded focus:ring-[#0055a2]"
                      required
                    />
                    <label htmlFor="terms" className="text-xs text-[#717182]">
                      Al llenar mis datos, estoy de acuerdo con la{' '}
                      <a href="#" className="text-[#0055a2] hover:underline">
                        política de privacidad
                      </a>
                      .
                    </label>
                  </div>
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
