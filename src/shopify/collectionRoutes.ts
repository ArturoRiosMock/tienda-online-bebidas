/**
 * Rutas especiales de colecciones.
 *
 * - VIRTUAL_COLLECTIONS: handles del menú que se resuelven cargando y combinando
 *   múltiples colecciones reales de Shopify (incluye categorías padre del menú).
 * - TAG_COLLECTIONS: handles del menú que no tienen colección en Shopify y se
 *   resuelven buscando productos por tag.
 * - COLLECTION_LABELS: títulos amigables para handles virtuales/tag, usados como
 *   fallback cuando no hay un título de colección desde la API.
 */

import { MENU_ITEMS } from '@/data/navigation-menu';

const EXPLICIT_VIRTUAL_COLLECTIONS: Record<string, string[]> = {
  espumosos: ['vino-blanco-espumoso', 'vino-rosado-espumoso', 'vino-tinto-espumoso'],
};

const buildParentVirtualCollections = (): Record<string, string[]> => {
  const parents: Record<string, string[]> = {};

  for (const item of MENU_ITEMS) {
    if (item.type !== 'accordion') continue;
    parents[item.parentHandle] = item.children.map((child) => child.handle);
  }

  return parents;
};

export const VIRTUAL_COLLECTIONS: Record<string, string[]> = {
  ...buildParentVirtualCollections(),
  ...EXPLICIT_VIRTUAL_COLLECTIONS,
};

export const TAG_COLLECTIONS: Record<string, string> = {
  jerez: 'Jerez',
};

export const COLLECTION_LABELS: Record<string, string> = {
  espumosos: 'Espumosos',
  jerez: 'Jerez',
  cerveza: 'Cervezas',
  destilados: 'Destilados',
  vinos: 'Vinos',
  refrescos: 'Refrescos',
  aguas: 'Aguas',
  otros: 'Otras Bebidas',
};

export const isVirtualCollection = (handle: string): boolean =>
  Object.prototype.hasOwnProperty.call(VIRTUAL_COLLECTIONS, handle);

export const isTagCollection = (handle: string): boolean =>
  Object.prototype.hasOwnProperty.call(TAG_COLLECTIONS, handle);
