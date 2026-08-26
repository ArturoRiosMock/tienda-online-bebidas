import { CheckCircle2, Loader2, Send } from 'lucide-react';
import type { DraftStatus } from '@/app/components/edicion/useEdicionDraft';

interface PublishBarProps {
  dirty: boolean;
  publishing: boolean;
  uploads: number;
  status: DraftStatus;
  onPublish: () => void;
}

export function PublishBar({ dirty, publishing, uploads, status, onPublish }: PublishBarProps) {
  const busy = publishing || uploads > 0;
  const label = uploads > 0 ? 'Subiendo imágenes…' : publishing ? 'Publicando…' : 'Publicar cambios';

  return (
    <div className="sticky bottom-0 z-20 border-t border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <p className="text-sm">
          {status ? (
            <span
              className={
                status.kind === 'ok' ? 'font-medium text-green-700' : 'font-medium text-red-600'
              }
            >
              {status.text}
            </span>
          ) : dirty ? (
            <span className="font-medium text-amber-700">
              Tienes cambios sin publicar. El sitio todavía no los muestra.
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-gray-500">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Todo publicado
            </span>
          )}
        </p>
        <button
          type="button"
          onClick={onPublish}
          disabled={!dirty || busy}
          className="inline-flex items-center gap-2 rounded-lg bg-[#FDB93A] px-5 py-2.5 text-sm font-bold text-[#0c3c1f] transition-colors hover:bg-[#f0ad2c] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {label}
        </button>
      </div>
    </div>
  );
}
