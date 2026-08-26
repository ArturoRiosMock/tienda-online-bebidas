import { ChevronDown } from 'lucide-react';
import { getNavGroupIcon } from '@/config/category-icons';
import { HeaderMobileGroupEntries } from '@/app/components/HeaderMobileGroupEntries';
import type { CatalogEntry, ResolvedDesktopNavItem } from '@/config/category-catalog';

function MobileNavItem({
  item,
  onNavEntry,
  onCategoryClick,
}: {
  item: ResolvedDesktopNavItem;
  onNavEntry: (entry: CatalogEntry) => void;
  onCategoryClick: (handle: string) => void;
}) {
  if (item.kind === 'link') {
    return (
      <button
        type="button"
        onClick={() => onNavEntry(item.entry)}
        className="flex min-h-[48px] w-full items-center rounded-xl px-4 text-left text-sm font-medium text-[#212121] transition-colors hover:bg-gray-100 active:bg-gray-200"
      >
        {item.title}
      </button>
    );
  }
  const SummaryIcon = getNavGroupIcon(item.id);
  return (
    <details className="rounded-xl border border-gray-200 bg-gray-50/50 open:border-[#0c3c1f]/20 open:bg-white open:[&_summary_svg]:rotate-180">
      <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-[#0c3c1f] marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="flex min-w-0 flex-1 items-center gap-2">
          <SummaryIcon className="h-5 w-5 shrink-0 text-[#0c3c1f]" aria-hidden />
          <span className="min-w-0">{item.title}</span>
        </span>
        <ChevronDown className="h-5 w-5 shrink-0 text-[#0c3c1f] transition-transform duration-200" aria-hidden />
      </summary>
      <HeaderMobileGroupEntries item={item} onNavEntry={onNavEntry} onCategoryClick={onCategoryClick} />
    </details>
  );
}

type Props = {
  items: ResolvedDesktopNavItem[];
  loading: boolean;
  onNavEntry: (entry: CatalogEntry) => void;
  onCategoryClick: (handle: string) => void;
};

export function HeaderMobileGroups({ items, loading, onNavEntry, onCategoryClick }: Props) {
  if (loading) {
    return (
      <div className="space-y-2 py-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <MobileNavItem
          key={item.id}
          item={item}
          onNavEntry={onNavEntry}
          onCategoryClick={onCategoryClick}
        />
      ))}
    </div>
  );
}
