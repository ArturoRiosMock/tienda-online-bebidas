import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Eye, EyeOff, KeyRound } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import logoColor from '@/assets/logo-bebify-color.svg';

function buildResetOptions(
  customerId?: string,
  resetToken?: string,
  resetUrl?: string | null,
): { customerId: string; resetToken: string } | { resetUrl: string } | null {
  if (resetUrl) {
    return { resetUrl };
  }

  if (customerId && resetToken) {
    return { customerId, resetToken };
  }

  return null;
}

export const ResetPasswordPage: React.FC = () => {
  const { resetPassword, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const { customerId, resetToken } = useParams<{ customerId?: string; resetToken?: string }>();
  const [searchParams] = useSearchParams();

  const resetUrlParam = searchParams.get('reset_url') ?? searchParams.get('url');
  const resetOptions = useMemo(
    () => buildResetOptions(customerId, resetToken, resetUrlParam),
    [customerId, resetToken, resetUrlParam],
  );

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (!resetOptions) {
      setLocalError('El enlace de recuperación no es válido o ha expirado.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Las contraseñas no coinciden.');
      return;
    }

    const result = await resetPassword(password, resetOptions);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/', { replace: true }), 2000);
    }
  };

  if (!resetOptions) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <img src={logoColor} alt="Bebify" className="h-14" />
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-sm text-center space-y-4">
            <h1 className="text-2xl font-bold text-[#212121]">Enlace no válido</h1>
            <p className="text-sm text-[#717182]">
              Este enlace de recuperación no es válido o ya expiró. Solicita uno nuevo.
            </p>
            <Link
              to="/recuperar-contrasena"
              className="inline-block text-[#0055a2] font-medium hover:underline"
            >
              Solicitar nuevo enlace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link to="/">
          <img src={logoColor} alt="Bebify" className="h-14" />
        </Link>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="flex items-center gap-1.5 text-sm text-[#717182] hover:text-[#0055a2] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al login
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-[#212121] mb-1">Nueva contraseña</h1>
            <p className="text-sm text-[#717182]">
              Ingresa y confirma tu nueva contraseña
            </p>
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 text-green-700 border border-green-200 px-4 py-4 rounded-lg text-sm"
            >
              <p className="font-medium">Contraseña actualizada</p>
              <p className="mt-2">Redirigiendo a la tienda…</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#212121] mb-1.5">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={5}
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

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#212121] mb-1.5">
                  Confirmar contraseña
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={5}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0055a2] focus:border-transparent outline-none transition-all text-[#212121]"
                />
              </div>

              {(localError || error) && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm"
                >
                  {localError || error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
                className="w-full bg-[#0055a2] text-white py-3 px-6 rounded-lg font-bold text-base flex items-center justify-center gap-2 hover:bg-[#004488] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-5 h-5" />
                    Guardar contraseña
                  </>
                )}
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};
