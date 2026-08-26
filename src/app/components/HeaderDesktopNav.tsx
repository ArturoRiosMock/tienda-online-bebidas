import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MegaMenuPanel } from '@/app/components/MegaMenuPanel';
import { HeaderDesktopCtas } from '@/app/components/HeaderNavCtas';
import type { CatalogEntry, ResolvedDesktopNavItem } from '@/config/category-catalog';

const PILL =
  'rounded-full px-3 py-1.5 text-sm font-semibold text-[#212121] transition-colors hover:bg-[#0a5028] hover:text-white';

type NavProps = {
  collectionsLoading: boolean;
  desktopNavItems: ResolvedDesktopNavItem[];
  onCategoryClick: (handle: string) => void;
  onNavEntry: (entry: CatalogEntry) => void;
};

function DesktopDropdown({
  item,
  onNavEntry,
  onCategoryClick,
}: {
  item: Extract<ResolvedDesktopNavItem, { kind: 'dropdown' }>;
  onNavEntry: (entry: CatalogEntry) => void;
  onCategoryClick: (handle: string) => void;
}) {
  return (
    <div className="group/nav relative">
      <button
        type="button"
        className="flex items-center gap-0.5 rounded-full px-3 py-1.5 text-sm font-semibold text-[#212121] transition-colors group-hover/nav:bg-[#0a5028] group-hover/nav:text-white"
        aria-haspopup="menu"
      >
        {item.title}
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover/nav:-rotate-180" aria-hidden />
      </button>
      <div className="pointer-events-none invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-1 opacity-0 transition-opacity duration-150 group-hover/nav:visible group-hover/nav:opacity-100 group-hover/nav:pointer-events-auto">
        <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-xl">
          <MegaMenuPanel
            entries={item.entries}
            featuredImage={item.featuredImage}
            featuredTitle={item.featuredTitle}
            viewAllLabel={item.viewAllLabel}
            viewAllHandle={item.viewAllHandle}
            onSelectCategory={onNavEntry}
            onViewAll={onCategoryClick}
          />
        </div>
      </div>
    </div>
  );
}

function DesktopNavItem({
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
      <button type="button" onClick={() => onNavEntry(item.entry)} className={PILL}>
        {item.title}
      </button>
    );
  }
  return <DesktopDropdown item={item} onNavEntry={onNavEntry} onCategoryClick={onCategoryClick} />;
}

export function HeaderDesktopNav({
  collectionsLoading,
  desktopNavItems,
  onCategoryClick,
  onNavEntry,
}: NavProps) {
  const navigate = useNavigate();

  return (
    <nav className="hidden lg:block border-b border-gray-200" aria-label="Categorías">
      <div className="container mx-auto px-4">
        <div className="flex w-full flex-wrap items-center justify-center gap-x-2 gap-y-2 py-3">
          <HeaderDesktopCtas
            onCotiza={() => navigate('/cotizar-evento')}
            onPromos={() => onCategoryClick('mr-brown-days')}
          />
          <button type="button" onClick={() => onCategoryClick('Todos')} className={PILL}>
            Todos
          </button>
          <button type="button" onClick={() => navigate('/blog')} className={PILL}>
            Blog
          </button>
          {collectionsLoading ? (
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 w-24 bg-gray-200 rounded-full animate-pulse" />
              ))}
            </div>
          ) : (
            desktopNavItems.map((item) => (
              <DesktopNavItem
                key={item.id}
                item={item}
                onNavEntry={onNavEntry}
                onCategoryClick={onCategoryClick}
              />
            ))
          )}
        </div>
      </div>
    </nav>
  );
}
