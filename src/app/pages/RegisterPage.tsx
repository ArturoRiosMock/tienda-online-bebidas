import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { HeliumRegistrationForm } from '@/app/components/HeliumRegistrationForm';
import { PLACEHOLDER_IMAGES } from '@/assets/placeholders';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0055a2] via-[#003d7a] to-[#002855] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-[#212121] px-8 py-8 text-center">
            <img
              src={PLACEHOLDER_IMAGES.logo}
              alt="Bebify"
              className="h-12 mx-auto mb-4"
            />
            <h1 className="text-white text-2xl font-bold mb-1">Crear cuenta</h1>
            <p className="text-blue-200 text-sm">
              Regístrate para acceder a precios y realizar compras
            </p>
          </div>

          <div className="px-6 py-8 sm:px-8">
            <HeliumRegistrationForm redirectUrl={`${window.location.origin}/login?registered=1`} />

            <div className="mt-6 text-center">
              <p className="text-sm text-[#717182]">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-[#0055a2] font-medium hover:underline">
                  Inicia sesión
                </Link>
              </p>
            </div>

            <button
              onClick={() => navigate('/')}
              className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-[#717182] hover:text-[#0055a2] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a la tienda
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
