import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { UserPlus } from 'lucide-react';

export const RegisterBanner: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-xl bg-[#0055a2] text-white"
    >
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 p-5 md:p-8">
        <div className="w-full md:w-2/5 shrink-0">
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=520&fit=crop"
            alt="Negocio preparando pedido de bebidas"
            className="w-full h-40 md:h-52 object-cover rounded-lg"
            loading="lazy"
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-lg md:text-2xl font-bold mb-1.5">
            Regístrate y accede a precios exclusivos B2B
          </h3>
          <p className="text-sm md:text-base opacity-90 mb-4 leading-relaxed max-w-xl">
            Crea tu cuenta en Bebify para ver precios, armar pedidos y comprar desde
            un solo lugar con más de 2,000 productos de más de 200 proveedores.
          </p>
          <Link
            to="/registro"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm rounded-lg font-bold bg-white text-[#0055a2] transition-all hover:scale-105 hover:bg-gray-50"
          >
            <UserPlus className="w-4 h-4 shrink-0" />
            Crear cuenta
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
