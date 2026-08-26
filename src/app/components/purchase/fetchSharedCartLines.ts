type SharedCartLine = { variantId: string; quantity: number };

type ImportResult =
  | { kind: 'error'; message: string }
  | { kind: 'empty'; message: string }
  | { kind: 'ok'; lines: SharedCartLine[] };

export async function fetchSharedCartLines(
  cartLinkId: string,
  country: string,
  signal: AbortSignal,
): Promise<ImportResult> {
  const res = await fetch(
    `/api/cart-link?cart_link_id=${encodeURIComponent(cartLinkId)}&country=${encodeURIComponent(country)}`,
    { signal },
  );
  const data = (await res.json()) as {
    ok: boolean;
    lines?: SharedCartLine[];
    error?: string;
  };
  if (!res.ok || !data.ok) {
    return {
      kind: 'error',
      message: data.error ?? 'No se pudo importar el carrito compartido.',
    };
  }
  if (!data.lines?.length) {
    return {
      kind: 'empty',
      message: 'Este enlace no tiene productos o ya expiró.',
    };
  }
  return { kind: 'ok', lines: data.lines };
}

export function importAbortMessage(aborted: boolean): string {
  if (aborted) {
    return 'La importación tardó demasiado. Intenta de nuevo o agrega productos manualmente.';
  }
  return 'Error de conexión al cargar el carrito compartido.';
}
