import { DEFAULT_CATEGORY_ICON, getCategoryIcon } from '@/config/category-icons';
import type { CatalogEntry, ResolvedDesktopNavItem } from '@/config/category-catalog';

function entryKey(entry: CatalogEntry, index: number): string {
  switch (entry.type) {
    case 'heading':
      return `h-${index}-${entry.label}`;
    case 'route':
      return entry.path;
    case 'tag':
      return `tag-${entry.tag}`;
    case 'collection':
      return entry.handle;
    default: {
      const _never: never = entry;
      return _never;
    }
  }
}

function MobileEntryIcon({ entry }: { entry: CatalogEntry }) {
  if (entry.type === 'heading') return null;
  if (entry.type === 'route') {
    const Icon = DEFAULT_CATEGORY_ICON;
    return <Icon className="h-5 w-5 shrink-0 text-[#0c3c1f]" aria-hidden />;
  }
  const iconHandle = entry.type === 'collection' ? entry.handle : entry.collectionHandle;
  const Icon = getCategoryIcon(iconHandle);
  return <Icon className="h-5 w-5 shrink-0 text-[#0c3c1f]" aria-hidden />;
}

type Props = {
  item: Extract<ResolvedDesktopNavItem, { kind: 'dropdown' }>;
  onNavEntry: (entry: CatalogEntry) => void;
  onCategoryClick: (handle: string) => void;
};

export function HeaderMobileGroupEntries({ item, onNavEntry, onCategoryClick }: Props) {
  return (
    <div className="border-t border-gray-100 px-2 py-2">
      {item.entries.map((entry, index) => {
        if (entry.type === 'heading') {
          return (
            <p
              key={entryKey(entry, index)}
              className="px-4 pt-2 pb-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#9ca3af] first:pt-0"
            >
              {entry.label}
            </p>
          );
        }
        return (
          <button
            key={entryKey(entry, index)}
            type="button"
            onClick={() => onNavEntry(entry)}
            className="flex min-h-[44px] w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm text-[#212121] transition-colors hover:bg-[#0a5028] hover:text-white active:bg-[#0a5028]/80 active:text-white"
          >
            <MobileEntryIcon entry={entry} />
            {entry.label}
          </button>
        );
      })}
      {item.viewAllLabel && item.viewAllHandle ? (
        <button
          type="button"
          onClick={() => onCategoryClick(item.viewAllHandle)}
          className="mt-1 flex min-h-[44px] w-full items-center justify-center rounded-lg border border-[#0c3c1f]/25 bg-[#0c3c1f]/5 px-4 py-2.5 text-center text-sm font-semibold text-[#0c3c1f] transition-colors hover:bg-[#0c3c1f]/10 active:bg-[#0c3c1f]/15"
        >
          {item.viewAllLabel}
        </button>
      ) : null}
    </div>
  );
}
