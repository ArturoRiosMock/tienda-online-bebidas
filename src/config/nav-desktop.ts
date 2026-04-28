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
      featuredImage: string | null;
      featuredTitle: string | null;
      viewAllLabel?: string;
      viewAllHandle: string | null;
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
      featuredHandle?: string;
      viewAllLabel?: string;
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
    featuredHandle: 'tequila',
    viewAllLabel: 'Ver todos los destilados',
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
    featuredHandle: 'vino-tinto',
    viewAllLabel: 'Ver todos los vinos',
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
    entry: { type: 'collection', label: 'Aguas', handle: 'refrescos' },
  },
  {
    id: 'refrescos',
    title: 'Refrescos',
    mode: 'link',
    entry: { type: 'collection', label: 'Refrescos', handle: 'aguas' },
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

function firstCollectionHandle(entries: NavDropdownEntry[]): string | null {
  const e = entries.find((x): x is Extract<NavDropdownEntry, { type: 'collection' }> => x.type === 'collection');
  return e?.handle ?? null;
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
      let featuredCol: CollectionItem | null = null;
      if (g.featuredHandle && collectionExists(collections, g.featuredHandle)) {
        featuredCol = collections.find((c) => c.handle === g.featuredHandle) ?? null;
      } else {
        const first = entries.find((e): e is Extract<NavDropdownEntry, { type: 'collection' }> => e.type === 'collection');
        if (first && collectionExists(collections, first.handle)) {
          featuredCol = collections.find((c) => c.handle === first.handle) ?? null;
        }
      }

      const viewAllHandle =
        g.featuredHandle && collectionExists(collections, g.featuredHandle)
          ? g.featuredHandle
          : firstCollectionHandle(entries);

      out.push({
        kind: 'dropdown',
        id: g.id,
        title: g.title,
        entries,
        featuredImage: featuredCol?.image ?? null,
        featuredTitle: featuredCol?.title ?? null,
        viewAllLabel: g.viewAllLabel,
        viewAllHandle,
      });
    }
  }

  return out;
}
