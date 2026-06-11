// Lógica de precios de mayoreo: carga el snapshot de SAMI y resuelve el grupo
// del cliente a partir de sus tags.
import { readFileSync } from 'node:fs';

const snapshot = JSON.parse(
  readFileSync(new URL('../_data/wholesale-pricing.json', import.meta.url), 'utf8'),
);

// snapshot.groups: { [tag]: { [productLegacyId]: precioMayoreoUnitario } }
const GROUPS = snapshot.groups || {};

// Dado el array de tags de un cliente, devuelve el mapa combinado
// { productLegacyId: precioMayoreo } de todos los grupos que apliquen.
export function pricesForTags(tags) {
  const result = {};
  for (const tag of tags || []) {
    const group = GROUPS[tag];
    if (group) Object.assign(result, group);
  }
  return result;
}

export function hasWholesaleGroup(tags) {
  return (tags || []).some((t) => GROUPS[t]);
}

export { GROUPS };
