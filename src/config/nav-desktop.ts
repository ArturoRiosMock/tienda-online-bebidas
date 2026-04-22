import type { CollectionItem } from '@/shopify/hooks/useShopifyCollections';

const FLASH_DEALS_HANDLE = 'ofertas-relampago';

export type NavDropdownEntry =
  | { type: 'collection'; label: string; handle: string }
  | { type: 'route'; label: string; path: string };

export type ResolvedDesktopNavItem =
  | {
      kind: 'link';
      id: string;
      title: string;
      entry: NavDropdownEntry;
    }
  | {
      kind: 'dropdown';
      id: string;
      title: string;
      entries: NavDropdownEntry[];
    };

type RawGroup =
  | {
      id: string;
      title: string;
      mode: 'link';
      entry: NavDropdownEntry;
    }
  | {
      id: string;
      title: string;
      mode: 'dropdown';
      children: NavDropdownEntry[];
    };

/**
 * Estructura del menú desktop. Ajusta los `handle` para que coincidan con
 * las colecciones publicadas en Shopify (Admin → Colecciones → URL y manejo).
 */
const RAW_GROUPS: RawGroup[] = [
  {
    id: 'ofertas',
    title: 'Ofertas',
    mode: 'link',
    entry: { type: 'collection', label: 'Ofertas', handle: FLASH_DEALS_HANDLE },
  },
  {
    id: 'vinos',
    title: 'Vinos',
    mode: 'dropdown',
    children: [
      { type: 'collection', label: 'Vino tinto', handle: 'vino-tinto' },
      { type: 'collection', label: 'Vino blanco', handle: 'vino-blanco' },
      { type: 'collection', label: 'Vino rosado', handle: 'vino-rosado' },
      { type: 'collection', label: 'Espumoso', handle: 'espumoso' },
      { type: 'collection', label: 'Champagne', handle: 'champagne' },
      { type: 'collection', label: 'Sidra', handle: 'sidra' },
    ],
  },
  {
    id: 'destilados',
    title: 'Destilados',
    mode: 'dropdown',
    children: [
      { type: 'collection', label: 'Tequila', handle: 'tequila' },
      { type: 'collection', label: 'Whisky', handle: 'whisky' },
      { type: 'collection', label: 'Ron', handle: 'ron' },
      { type: 'collection', label: 'Cremas y licores', handle: 'cremas-y-licores' },
      { type: 'collection', label: 'Brandy', handle: 'brandy' },
      { type: 'collection', label: 'Vodka', handle: 'vodka' },
      { type: 'collection', label: 'Cognac', handle: 'cognac' },
      { type: 'collection', label: 'Mezcal', handle: 'mezcal' },
      { type: 'collection', label: 'Ginebra', handle: 'ginebra' },
      { type: 'collection', label: 'Jerez', handle: 'jerez' },
      { type: 'collection', label: 'Anís', handle: 'anis' },
      { type: 'collection', label: 'Aperitivo', handle: 'aperitivo' },
      { type: 'collection', label: 'Otros destilados', handle: 'otros-destilados' },
    ],
  },
  {
    id: 'acompanamientos',
    title: 'Acompañamientos',
    mode: 'dropdown',
    children: [
      { type: 'collection', label: 'Complementos', handle: 'complementos' },
      { type: 'collection', label: 'Otras bebidas', handle: 'otras-bebidas' },
    ],
  },
  {
    id: 'sin-alcohol',
    title: 'Sin alcohol',
    mode: 'link',
    entry: { type: 'collection', label: 'Sin alcohol', handle: 'sin-alcohol' },
  },
  {
    id: 'ayuda',
    title: 'Ayuda',
    mode: 'dropdown',
    children: [
      { type: 'route', label: 'Preguntas frecuentes', path: '/preguntas-frecuentes' },
      { type: 'route', label: 'Contacto', path: '/contacto' },
      { type: 'route', label: 'Sobre nosotros', path: '/page/sobre-nosotros' },
    ],
  },
];

function collectionExists(collections: CollectionItem[], handle: string): boolean {
  return collections.some((c) => c.handle === handle);
}

function labelForHandle(collections: CollectionItem[], handle: string, fallback: string): string {
  const col = collections.find((c) => c.handle === handle);
  return col?.title ?? fallback;
}

function filterEntry(entry: NavDropdownEntry, collections: CollectionItem[]): NavDropdownEntry | null {
  if (entry.type === 'route') return entry;
  if (collectionExists(collections, entry.handle)) {
    return { ...entry, label: labelForHandle(collections, entry.handle, entry.label) };
  }
  return null;
}

function assignedHandlesFromRaw(): Set<string> {
  const set = new Set<string>();
  for (const g of RAW_GROUPS) {
    if (g.mode === 'link' && g.entry.type === 'collection') {
      set.add(g.entry.handle);
    }
    if (g.mode === 'dropdown') {
      for (const c of g.children) {
        if (c.type === 'collection') set.add(c.handle);
      }
    }
  }
  return set;
}

/**
 * Construye ítems de navegación: solo enlaces/colecciones que existen en la API,
 * más un desplegable "Más" con colecciones no listadas arriba.
 */
export function resolveDesktopNav(collections: CollectionItem[]): ResolvedDesktopNavItem[] {
  const assigned = assignedHandlesFromRaw();
  const out: ResolvedDesktopNavItem[] = [];

  for (const g of RAW_GROUPS) {
    if (g.mode === 'link') {
      const resolved = filterEntry(g.entry, collections);
      if (resolved) {
        out.push({ kind: 'link', id: g.id, title: g.title, entry: resolved });
      }
      continue;
    }

    const entries = g.children.map((e) => filterEntry(e, collections)).filter(Boolean) as NavDropdownEntry[];
    if (entries.length === 0) continue;
    if (entries.length === 1) {
      out.push({ kind: 'link', id: g.id, title: g.title, entry: entries[0] });
    } else {
      out.push({ kind: 'dropdown', id: g.id, title: g.title, entries });
    }
  }

  const unmapped = collections.filter(
    (c) => c.handle !== FLASH_DEALS_HANDLE && !assigned.has(c.handle)
  );

  if (unmapped.length > 0) {
    const entries: NavDropdownEntry[] = unmapped.map((c) => ({
      type: 'collection' as const,
      label: c.title,
      handle: c.handle,
    }));
    out.push({
      kind: 'dropdown',
      id: 'mas-categorias',
      title: 'Más',
      entries,
    });
  }

  return out;
}
