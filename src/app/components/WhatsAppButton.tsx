import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X } from 'lucide-react';

export const WhatsAppButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Número de WhatsApp (cambiar por el número real)
  const whatsappNumber = '5215512345678'; // Formato: código país + número
  const message = '¡Hola! Me gustaría obtener más información sobre sus productos.';
  
  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      {/* WhatsApp Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
        className="fixed bottom-6 right-6 z-50"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-lg shadow-lg whitespace-nowrap"
            >
              <p className="text-[#212121] font-semibold text-sm">
                ¿Necesitas ayuda?
              </p>
              <p className="text-[#717182] text-xs">
                Chatea con nosotros
              </p>
              {/* Arrow */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
                <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleWhatsAppClick}
          className="relative w-16 h-16 bg-[#25D366] rounded-full shadow-lg flex items-center justify-center group overflow-hidden"
        >
          {/* Ripple Effect */}
          <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
          
          {/* Icon */}
          <MessageCircle className="w-8 h-8 text-white relative z-10" fill="white" />
          
          {/* Hover Glow */}
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
        </motion.button>

        {/* Notification Badge (opcional) */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5, type: 'spring' }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
        >
          <span className="text-white text-xs font-bold">1</span>
        </motion.div>
      </motion.div>
    </>
  );
};
