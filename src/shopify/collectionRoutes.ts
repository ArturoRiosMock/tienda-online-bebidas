/**
 * Rutas especiales de colecciones.
 *
 * - VIRTUAL_COLLECTIONS: handles del menú que se resuelven cargando y combinando
 *   múltiples colecciones reales de Shopify.
 * - TAG_COLLECTIONS: handles del menú que no tienen colección en Shopify y se
 *   resuelven buscando productos por tag.
 * - COLLECTION_LABELS: títulos amigables para handles virtuales/tag, usados como
 *   fallback cuando no hay un título de colección desde la API.
 */

export const VIRTUAL_COLLECTIONS: Record<string, string[]> = {
  espumosos: ['vino-blanco-espumoso', 'vino-rosado-espumoso', 'vino-tinto-espumoso'],
};

export const TAG_COLLECTIONS: Record<string, string> = {
  jerez: 'Jerez',
};

export const COLLECTION_LABELS: Record<string, string> = {
  espumosos: 'Espumosos',
  jerez: 'Jerez',
};

export const isVirtualCollection = (handle: string): boolean =>
  Object.prototype.hasOwnProperty.call(VIRTUAL_COLLECTIONS, handle);

export const isTagCollection = (handle: string): boolean =>
  Object.prototype.hasOwnProperty.call(TAG_COLLECTIONS, handle);
