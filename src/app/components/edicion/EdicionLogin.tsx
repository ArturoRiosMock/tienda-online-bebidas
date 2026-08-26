import React, { useState } from 'react';
import { Loader2, Lock } from 'lucide-react';
import { setEdicionSession, verifyEdicionCredentials } from '@/app/utils/edicionAuth';
import { PLACEHOLDER_IMAGES } from '@/assets/placeholders';

const INPUT =
  'w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3c1f]';

export function EdicionLogin({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setChecking(true);
    try {
      if (!(await verifyEdicionCredentials(username, password))) {
        setError('Usuario o contraseña incorrectos');
        return;
      }
      setEdicionSession({ username, password });
      onSuccess();
    } catch {
      setError('No se pudo verificar el acceso. Intenta de nuevo.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex justify-center">
          <img src={PLACEHOLDER_IMAGES.logo} alt="Mr. Brown" className="h-14 object-contain" />
        </div>
        <div className="mb-6 flex items-center justify-center gap-2">
          <Lock className="h-5 w-5 text-[#0c3c1f]" />
          <h1 className="text-xl font-bold text-[#0c3c1f]">Editor del Home</h1>
        </div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Usuario"
          className={`${INPUT} mb-3`}
          autoFocus
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className={`${INPUT} mb-3`}
        />
        {error && <p className="mb-3 text-xs font-medium text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={checking}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0c3c1f] py-3 font-bold text-white transition-colors hover:bg-[#0a3019] disabled:opacity-60"
        >
          {checking && <Loader2 className="h-4 w-4 animate-spin" />}
          Entrar
        </button>
      </form>
    </div>
  );
}
