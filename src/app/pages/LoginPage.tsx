import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { PLACEHOLDER_IMAGES } from '@/assets/placeholders';

export const LoginPage: React.FC = () => {
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const from = (location.state as { from?: string; registered?: boolean })?.from || '/';
  const justRegistered = (location.state as { registered?: boolean })?.registered === true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const success = await login(email, password);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0055a2] via-[#003d7a] to-[#002855] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#212121] px-8 py-8 text-center">
            <img
              src={PLACEHOLDER_IMAGES.logo}
              alt="Bebify"
              className="h-12 mx-auto mb-4"
            />
            <h1 className="text-white text-2xl font-bold mb-1">Bienvenido a Bebify</h1>
            <p className="text-blue-200 text-sm">
              Inicia sesión para ver precios y realizar compras
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            {justRegistered && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 bg-green-50 text-green-700 border border-green-200 px-4 py-3 rounded-lg text-sm font-medium"
              >
                ¡Cuenta creada con éxito! Ya puedes iniciar sesión.
              </motion.div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#212121] mb-1.5">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0055a2] focus:border-transparent outline-none transition-all text-[#212121]"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#212121] mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0055a2] focus:border-transparent outline-none transition-all text-[#212121] pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full bg-[#0055a2] text-white py-3 px-6 rounded-lg font-bold text-base flex items-center justify-center gap-2 hover:bg-[#004488] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Iniciar Sesión
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#717182]">
                ¿No tienes cuenta?{' '}
                <Link
                  to="/registro"
                  className="text-[#0055a2] font-medium hover:underline"
                >
                  Regístrate aquí
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
