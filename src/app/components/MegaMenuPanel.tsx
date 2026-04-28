import type { NavDropdownEntry } from '@/config/nav-desktop';
import { DEFAULT_CATEGORY_ICON, getCategoryIcon } from '@/config/category-icons';

export type MegaMenuPanelProps = {
  entries: NavDropdownEntry[];
  featuredImage: string | null;
  featuredTitle: string | null;
  viewAllLabel?: string;
  viewAllHandle: string | null;
  onSelectCategory: (entry: NavDropdownEntry) => void;
  onViewAll: (collectionHandle: string) => void;
};

function entryKey(entry: NavDropdownEntry): string {
  return entry.type === 'route' ? entry.path : entry.handle;
}

function EntryIcon({ entry }: { entry: NavDropdownEntry }) {
  const Icon = entry.type === 'collection' ? getCategoryIcon(entry.handle) : DEFAULT_CATEGORY_ICON;
  return <Icon className="h-5 w-5 shrink-0 text-[#0c3c1f]" aria-hidden />;
}

/**
 * Panel del mega menú desktop: rejilla de categorías con icono y tarjeta lateral con imagen/CTA.
 */
export function MegaMenuPanel({
  entries,
  featuredImage,
  featuredTitle,
  viewAllLabel,
  viewAllHandle,
  onSelectCategory,
  onViewAll,
}: MegaMenuPanelProps) {
  const showViewAll = Boolean(viewAllLabel && viewAllHandle);

  const gridColsClass =
    entries.length > 6
      ? 'grid-cols-3'
      : entries.length > 3
        ? 'grid-cols-2'
        : 'grid-cols-2';

  return (
    <div className="flex w-[min(760px,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] flex-row gap-4" role="menu">
      <div className="min-w-0 flex-1 p-1">
        <div className={`grid gap-2 ${gridColsClass}`}>
          {entries.map((entry) => (
            <button
              key={entryKey(entry)}
              type="button"
              role="menuitem"
              className="flex min-h-[48px] items-center gap-2.5 rounded-xl border border-gray-100 bg-white px-3 py-2.5 text-left text-sm font-medium text-[#212121] transition-colors hover:bg-[#0c3c1f]/5 active:bg-[#0c3c1f]/10"
              onClick={() => onSelectCategory(entry)}
            >
              <EntryIcon entry={entry} />
              <span className="min-w-0 flex-1 leading-snug">{entry.label}</span>
            </button>
          ))}
        </div>
      </div>

      <aside className="flex w-[min(280px,40%)] shrink-0 flex-col justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-3">
        <div className="min-h-0 flex-1 space-y-2">
          {featuredImage ? (
            <img
              src={featuredImage}
              alt={featuredTitle ?? ''}
              className="h-32 w-full rounded-lg object-cover sm:h-36"
              loading="lazy"
            />
          ) : null}
          {featuredTitle ? (
            <p className="text-sm font-semibold leading-snug text-[#0c3c1f]">{featuredTitle}</p>
          ) : null}
          {!featuredImage && !featuredTitle ? (
            <p className="text-xs text-gray-500">Explora la categoría destacada o elige una opción.</p>
          ) : null}
        </div>
        {showViewAll && viewAllHandle ? (
          <button
            type="button"
            className="w-full rounded-lg bg-[#0c3c1f] px-3 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#0a3019] active:bg-[#082515]"
            onClick={() => onViewAll(viewAllHandle)}
          >
            {viewAllLabel}
          </button>
        ) : null}
      </aside>
    </div>
  );
}
