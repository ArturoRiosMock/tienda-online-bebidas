import type { CollectionItem } from '@/shopify/hooks/useShopifyCollections';

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
    id: 'cervezas',
    title: 'Cervezas',
    mode: 'link',
    entry: { type: 'collection', label: 'Cervezas', handle: 'cervezas' },
  },
  {
    id: 'aguas',
    title: 'Aguas',
    mode: 'link',
    entry: { type: 'collection', label: 'Aguas', handle: 'aguas' },
  },
  {
    id: 'refrescos',
    title: 'Refrescos',
    mode: 'link',
    entry: { type: 'collection', label: 'Refrescos', handle: 'refrescos' },
  },
  {
    id: 'otras-bebidas',
    title: 'Otras bebidas',
    mode: 'link',
    entry: { type: 'collection', label: 'Otras bebidas', handle: 'otras-bebidas' },
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

/**
 * Construye ítems de navegación: solo enlaces/colecciones definidos en RAW_GROUPS
 * y que existen en la API de Shopify.
 */
export function resolveDesktopNav(collections: CollectionItem[]): ResolvedDesktopNavItem[] {
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

  return out;
}
