import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Eye, EyeOff, UserPlus, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { PLACEHOLDER_IMAGES } from '@/assets/placeholders';

export const RegisterPage: React.FC = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (form.password !== form.confirmPassword) {
      setFormError('Las contraseñas no coinciden.');
      return;
    }

    if (form.password.length < 5) {
      setFormError('La contraseña debe tener al menos 5 caracteres.');
      return;
    }

    if (!privacyAccepted) {
      setFormError('Debes aceptar el aviso de privacidad para continuar.');
      return;
    }

    const result = await register({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
    });

    if (result.success) {
      navigate('/login', { state: { registered: true } });
    } else {
      setFormError(result.error ?? 'Error al crear la cuenta.');
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
            <h1 className="text-white text-2xl font-bold mb-1">Crear cuenta</h1>
            <p className="text-blue-200 text-sm">
              Regístrate para acceder a precios y realizar compras
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-[#212121] mb-1.5">
                    Nombre
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Juan"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0055a2] focus:border-transparent outline-none transition-all text-[#212121]"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-[#212121] mb-1.5">
                    Apellido
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="García"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0055a2] focus:border-transparent outline-none transition-all text-[#212121]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#212121] mb-1.5">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
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
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Mínimo 5 caracteres"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0055a2] focus:border-transparent outline-none transition-all text-[#212121] pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#212121] mb-1.5">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    required
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repite tu contraseña"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0055a2] focus:border-transparent outline-none transition-all text-[#212121] pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Casilla de consentimiento LFPDPPP */}
              <div className="flex items-start gap-3 pt-1">
                <input
                  id="privacy"
                  type="checkbox"
                  checked={privacyAccepted}
                  onChange={(e) => {
                    setPrivacyAccepted(e.target.checked);
                    setFormError(null);
                  }}
                  className="mt-0.5 w-4 h-4 accent-[#0055a2] cursor-pointer flex-shrink-0"
                  tabIndex={0}
                />
                <label htmlFor="privacy" className="text-sm text-[#444] cursor-pointer leading-snug">
                  He leído y comprendido el{' '}
                  <Link
                    to="/aviso-de-privacidad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0055a2] font-medium hover:underline"
                  >
                    aviso de privacidad
                  </Link>
                </label>
              </div>

              {formError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm"
                >
                  {formError}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full bg-[#0055a2] text-white py-3 px-6 rounded-lg font-bold text-base flex items-center justify-center gap-2 hover:bg-[#004488] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Crear cuenta
                  </>
                )}
              </motion.button>
            </form>

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
