import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Newspaper, ArrowRight, Sparkles } from 'lucide-react';

export const BlogPage: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-[#0055a2]/10 text-[#0055a2] px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Próximamente</span>
          </div>

          <div className="w-20 h-20 bg-[#0055a2] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Newspaper className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#212121] mb-4">
            Blog Bebify
          </h1>

          <p className="text-[#717182] text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Estamos preparando contenido pensado para tu negocio: tendencias del sector,
            guías de maridaje, mejores prácticas de operación, novedades de proveedores y
            más. Pronto encontrarás aquí artículos que te ayudarán a optimizar tu centro de
            consumo.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-[#0055a2]/10 rounded-lg flex items-center justify-center mb-3">
                <span className="text-xl">📈</span>
              </div>
              <h3 className="text-[#212121] font-semibold mb-1">Tendencias B2B</h3>
              <p className="text-sm text-[#717182]">
                Lo que se está moviendo en el mercado de bebidas mexicano.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-[#0055a2]/10 rounded-lg flex items-center justify-center mb-3">
                <span className="text-xl">🍷</span>
              </div>
              <h3 className="text-[#212121] font-semibold mb-1">Guías y maridajes</h3>
              <p className="text-sm text-[#717182]">
                Recomendaciones para tu carta y selección de productos.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-[#0055a2]/10 rounded-lg flex items-center justify-center mb-3">
                <span className="text-xl">⚙️</span>
              </div>
              <h3 className="text-[#212121] font-semibold mb-1">Operación</h3>
              <p className="text-sm text-[#717182]">
                Logística, control de inventario y eficiencia para tu negocio.
              </p>
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-[#0055a2] text-white px-6 py-3 rounded-lg hover:bg-[#003d7a] transition-colors font-medium"
          >
            Volver a la tienda
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
