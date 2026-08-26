import { useEffect, useRef, useState } from 'react';
import {
  fetchSharedCartLines,
  importAbortMessage,
} from './fetchSharedCartLines';

type SharedCartLine = { variantId: string; quantity: number };
type ImportSharedCart = (lines: SharedCartLine[]) => Promise<boolean>;
type SetSearchParams = (
  next: URLSearchParams,
  opts?: { replace?: boolean },
) => void;

export type ImportState = 'idle' | 'loading' | 'done' | 'error';

async function runImport(
  cartLinkId: string,
  country: string,
  signal: AbortSignal,
  importSharedCart: ImportSharedCart,
  setImportState: (s: ImportState) => void,
  setImportError: (e: string | null) => void,
  clearParams: () => void,
): Promise<void> {
  setImportState('loading');
  setImportError(null);
  const result = await fetchSharedCartLines(cartLinkId, country, signal);
  if (result.kind === 'error') {
    setImportState('error');
    setImportError(result.message);
    return;
  }
  if (result.kind === 'empty') {
    setImportState('done');
    setImportError(result.message);
    clearParams();
    return;
  }
  const ok = await importSharedCart(result.lines);
  if (!ok) {
    setImportState('error');
    setImportError('No se pudieron agregar los productos al carrito.');
    return;
  }
  setImportState('done');
  clearParams();
}

export function useSharedCartImport(
  cartLinkId: string | null,
  importSharedCart: ImportSharedCart | undefined,
  searchParams: URLSearchParams,
  setSearchParams: SetSearchParams,
) {
  const [importState, setImportState] = useState<ImportState>(
    cartLinkId ? 'loading' : 'idle',
  );
  const [importError, setImportError] = useState<string | null>(null);
  const importAttemptRef = useRef<string | null>(null);

  useEffect(() => {
    if (!cartLinkId || !importSharedCart) {
      if (!cartLinkId) setImportState('idle');
      return;
    }
    if (importAttemptRef.current === cartLinkId) return;
    importAttemptRef.current = cartLinkId;

    let cancelled = false;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 12_000);
    const country = searchParams.get('country') || 'MX';
    const clearParams = () => {
      const next = new URLSearchParams(searchParams);
      next.delete('cart_link_id');
      next.delete('country');
      setSearchParams(next, { replace: true });
    };

    void runImport(
      cartLinkId,
      country,
      controller.signal,
      importSharedCart,
      setImportState,
      setImportError,
      clearParams,
    ).catch(() => {
      if (cancelled) return;
      setImportState('error');
      setImportError(importAbortMessage(controller.signal.aborted));
    }).finally(() => {
      window.clearTimeout(timeoutId);
    });

    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [cartLinkId, importSharedCart, searchParams, setSearchParams]);

  return { importState, importError };
}
