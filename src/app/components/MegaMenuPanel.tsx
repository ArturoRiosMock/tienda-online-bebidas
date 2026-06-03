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
 * Panel del mega menú desktop: rejilla de categorías con icono.
 */
export function MegaMenuPanel({
  entries,
  onSelectCategory,
}: MegaMenuPanelProps) {
  const gridColsClass =
    entries.length > 6
      ? 'grid-cols-3'
      : entries.length > 3
        ? 'grid-cols-2'
        : 'grid-cols-2';

  return (
    <div
      className="w-[min(560px,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] p-1"
      role="menu"
    >
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
  );
}
