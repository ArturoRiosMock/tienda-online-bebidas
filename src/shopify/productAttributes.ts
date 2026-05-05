import type { ShopifyProduct } from './types';

/**
 * Extracción de atributos legales (NOM-142-SSA1/SCFI-2014) desde un producto
 * de Shopify Storefront. Busca, en orden:
 *   1. Variant `selectedOptions` con nombres comunes (Graduación, Volumen, Origen…).
 *   2. Tags con prefijos convencionales (`abv:`, `volumen:`, `origen:`, `tipo:`).
 *   3. Heurística sobre la descripción (ej. "40°", "750 ml").
 *
 * Si no encuentra un campo, lo deja en `undefined` y la UI lo oculta.
 */

export interface AlcoholAttributes {
  abvLabel?: string;       // ej. "40% Vol."
  volumeLabel?: string;    // ej. "750 ml"
  beverageType?: string;   // ej. "Whisky"
  origin?: string;         // ej. "México"
}

const OPTION_NAMES_ABV = ['graduación', 'graduacion', 'graduación alcohólica', 'alcohol', 'abv'];
const OPTION_NAMES_VOLUME = ['volumen', 'capacidad', 'contenido', 'contenido neto', 'tamaño'];
const OPTION_NAMES_ORIGIN = ['origen', 'país', 'pais', 'país de origen', 'pais de origen', 'country'];
const OPTION_NAMES_TYPE = ['tipo', 'tipo de bebida', 'categoría', 'categoria'];

const TAG_PREFIX_ABV = ['abv:', 'graduacion:', 'graduación:', 'alcohol:'];
const TAG_PREFIX_VOLUME = ['volumen:', 'volume:', 'capacidad:', 'contenido:'];
const TAG_PREFIX_ORIGIN = ['origen:', 'origin:', 'pais:', 'país:', 'country:'];
const TAG_PREFIX_TYPE = ['tipo:', 'type:'];

const matchOption = (
  options: Array<{ name: string; value: string }> | undefined,
  names: string[],
): string | undefined => {
  if (!options?.length) return undefined;
  const hit = options.find((o) => names.includes(o.name.trim().toLowerCase()));
  const v = hit?.value?.trim();
  return v || undefined;
};

const matchTag = (tags: string[] | undefined, prefixes: string[]): string | undefined => {
  if (!tags?.length) return undefined;
  for (const tag of tags) {
    const lower = tag.trim().toLowerCase();
    const prefix = prefixes.find((p) => lower.startsWith(p));
    if (prefix) {
      const value = tag.trim().slice(prefix.length).trim();
      if (value) return value;
    }
  }
  return undefined;
};

const formatAbv = (raw: string): string => {
  const trimmed = raw.trim();
  // Si ya viene con %, °, "Vol", etc, devolver tal cual.
  if (/[%°]|vol|alc/i.test(trimmed)) return trimmed;
  // Si es solo un número, añadir "% Vol."
  if (/^\d+(?:[.,]\d+)?$/.test(trimmed)) return `${trimmed}% Vol.`;
  return trimmed;
};

const formatVolume = (raw: string): string => {
  const trimmed = raw.trim();
  if (/ml|cl|l\b|litros?/i.test(trimmed)) return trimmed;
  if (/^\d+$/.test(trimmed)) return `${trimmed} ml`;
  return trimmed;
};

const extractFromDescription = (description: string | undefined) => {
  if (!description) return { abv: undefined, volume: undefined };
  // ABV: "40°", "40%", "40 % Vol", "40 grados"
  const abvMatch = description.match(/\b(\d{1,2}(?:[.,]\d{1,2})?)\s*(?:°|%(?:\s*(?:vol\.?|alc\.?))?|grados?)\b/i);
  // Volumen: "750 ml", "1 L", "1.5 L"
  const volumeMatch =
    description.match(/\b(\d{2,4})\s*ml\b/i) ||
    description.match(/\b(\d(?:[.,]\d+)?)\s*l\b(?!\w)/i);

  return {
    abv: abvMatch ? formatAbv(abvMatch[0]) : undefined,
    volume: volumeMatch
      ? volumeMatch[0].toLowerCase().includes('ml')
        ? `${volumeMatch[1]} ml`
        : `${volumeMatch[1]} L`
      : undefined,
  };
};

export const extractAlcoholAttributes = (
  shopifyProduct: ShopifyProduct,
): AlcoholAttributes => {
  const firstVariant = shopifyProduct.variants.edges[0]?.node;
  const options = firstVariant?.selectedOptions;
  const tags = shopifyProduct.tags;

  // 1. Variant options
  let abv = matchOption(options, OPTION_NAMES_ABV);
  let volume = matchOption(options, OPTION_NAMES_VOLUME);
  const origin = matchOption(options, OPTION_NAMES_ORIGIN) ?? matchTag(tags, TAG_PREFIX_ORIGIN);
  const beverageType =
    matchOption(options, OPTION_NAMES_TYPE) ??
    matchTag(tags, TAG_PREFIX_TYPE) ??
    (shopifyProduct.productType?.trim() || undefined);

  // 2. Tags
  if (!abv) abv = matchTag(tags, TAG_PREFIX_ABV);
  if (!volume) volume = matchTag(tags, TAG_PREFIX_VOLUME);

  // 3. Descripción (fallback heurístico)
  if (!abv || !volume) {
    const fromDesc = extractFromDescription(shopifyProduct.description);
    abv = abv ?? fromDesc.abv;
    volume = volume ?? fromDesc.volume;
  }

  return {
    abvLabel: abv ? formatAbv(abv) : undefined,
    volumeLabel: volume ? formatVolume(volume) : undefined,
    beverageType,
    origin,
  };
};
