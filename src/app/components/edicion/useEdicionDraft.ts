import { useEffect, useRef, useState } from 'react';
import type { HomeContent } from '@/types/homeContent';
import { persistHomeContent, useHomeContent } from '@/app/hooks/useHomeContent';
import { getEdicionCredentials } from '@/app/utils/edicionAuth';
import { makeIds } from '@/app/components/edicion/heroSlideOps';

export type DraftStatus = { kind: 'ok' | 'error'; text: string } | null;

export function useEdicionDraft(authenticated: boolean) {
  const { content: remote, loading, error: loadError } = useHomeContent();
  const [draft, setDraft] = useState<HomeContent | null>(null);
  const [slideIds, setSlideIds] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);
  const [status, setStatus] = useState<DraftStatus>(null);
  const [uploads, setUploads] = useState(0);
  const baselineRef = useRef('');
  const draftRef = useRef<HomeContent | null>(null);

  draftRef.current = draft;

  const adopt = (next: HomeContent) => {
    setDraft(next);
    setSlideIds(makeIds(next.hero.slides.length));
    baselineRef.current = JSON.stringify(next);
  };

  useEffect(() => {
    if (!authenticated) {
      setDraft(null);
      return;
    }
    // La guarda de loadError es deliberada: si el fetch falló, `remote` son los defaults
    // del bundle y adoptarlos publicaría contenido obsoleto sobre el real.
    if (loading || loadError || draftRef.current) return;
    adopt(remote);
  }, [authenticated, loading, loadError, remote]);

  const dirty = Boolean(draft) && JSON.stringify(draft) !== baselineRef.current;

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const trackUpload = (uploading: boolean) => {
    setUploads((n) => Math.max(0, n + (uploading ? 1 : -1)));
  };

  const publish = async () => {
    const current = draftRef.current;
    if (!current) return;
    if (uploads > 0) {
      setStatus({ kind: 'error', text: 'Espera a que terminen de subir las imágenes' });
      return;
    }
    setPublishing(true);
    setStatus(null);
    try {
      const creds = getEdicionCredentials();
      if (!creds) throw new Error('Tu sesión expiró. Vuelve a entrar.');
      adopt(await persistHomeContent(creds.username, creds.password, current));
      setStatus({ kind: 'ok', text: 'Cambios publicados en el sitio' });
    } catch (err) {
      setStatus({
        kind: 'error',
        text: err instanceof Error ? err.message : 'No se pudo publicar',
      });
    } finally {
      setPublishing(false);
    }
  };

  return {
    draft,
    setDraft,
    slideIds,
    setSlideIds,
    loading,
    loadError,
    dirty,
    publishing,
    status,
    uploads,
    trackUpload,
    publish,
  };
}
