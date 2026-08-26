import { AlertTriangle, Loader2, RotateCw } from 'lucide-react';

interface EdicionLoadStateProps {
  loading: boolean;
  error: string | null;
}

export function EdicionLoadState({ loading, error }: EdicionLoadStateProps) {
  if (loading) {
    return (
      <p className="flex items-center justify-center gap-2 rounded-xl bg-white p-8 text-sm text-gray-500 shadow-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        Cargando el contenido publicado…
      </p>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-red-200 bg-white p-6 shadow-sm">
      <p className="flex items-center gap-2 font-bold text-red-700">
        <AlertTriangle className="h-5 w-5" />
        No se pudo leer el contenido del sitio
      </p>
      <p className="text-sm text-gray-600">
        Para no arriesgar lo que ya está publicado, el editor no abre hasta poder leer el contenido
        real. Si editáramos ahora, publicarías una versión vieja encima de la buena.
      </p>
      {error && <p className="rounded-lg bg-gray-50 p-2 font-mono text-xs text-gray-500">{error}</p>}
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="inline-flex items-center gap-2 rounded-lg bg-[#0c3c1f] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0a3019]"
      >
        <RotateCw className="h-4 w-4" />
        Volver a intentar
      </button>
    </div>
  );
}
