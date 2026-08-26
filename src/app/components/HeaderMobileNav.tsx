import { Search } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { HeaderMobileCtas } from '@/app/components/HeaderNavCtas';
import { HeaderMobileGroups } from '@/app/components/HeaderMobileGroups';
import type { CatalogEntry, ResolvedDesktopNavItem } from '@/config/category-catalog';

type Props = {
  open: boolean;
  collectionsLoading: boolean;
  desktopNavItems: ResolvedDesktopNavItem[];
  onClose: () => void;
  onOpenSearch: () => void;
  onCategoryClick: (handle: string) => void;
  onNavEntry: (entry: CatalogEntry) => void;
};

export function HeaderMobileNav({
  open,
  collectionsLoading,
  desktopNavItems,
  onClose,
  onOpenSearch,
  onCategoryClick,
  onNavEntry,
}: Props) {
  const navigate = useNavigate();

  const openSearch = () => {
    onClose();
    onOpenSearch();
  };

  const goBlog = () => {
    onClose();
    navigate('/blog');
  };

  const goContacto = () => {
    navigate('/contacto');
    onClose();
  };

  const goCotiza = () => {
    onClose();
    navigate('/cotizar-evento');
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="lg:hidden border-t border-gray-200 bg-white"
          id="mobile-primary-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
        >
          <nav
            className="container mx-auto max-h-[min(85dvh,calc(100vh-5rem))] overflow-y-auto overscroll-contain px-4 py-3 pb-[max(1rem,env(safe-area-inset-bottom))]"
            aria-label="Categorías y enlaces"
          >
            <button
              type="button"
              onClick={openSearch}
              className="mb-3 flex min-h-[48px] w-full items-center gap-3 rounded-xl border border-gray-200 px-4 text-left text-sm font-medium text-[#212121] transition-colors hover:bg-gray-50 active:bg-gray-100"
            >
              <Search className="h-5 w-5 shrink-0 text-[#0c3c1f]" aria-hidden />
              Buscar productos
            </button>
            <button
              type="button"
              onClick={() => onCategoryClick('Todos')}
              className="mb-2 flex min-h-[48px] w-full items-center rounded-xl px-4 text-left text-sm font-semibold text-[#0c3c1f] transition-colors hover:bg-gray-100 active:bg-gray-200"
            >
              Todos los productos
            </button>
            <button
              type="button"
              onClick={goBlog}
              className="mb-2 flex min-h-[48px] w-full items-center rounded-xl px-4 text-left text-sm font-semibold text-[#0c3c1f] transition-colors hover:bg-gray-100 active:bg-gray-200"
            >
              Blog
            </button>
            <HeaderMobileGroups
              items={desktopNavItems}
              loading={collectionsLoading}
              onNavEntry={onNavEntry}
              onCategoryClick={onCategoryClick}
            />
            <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
              <p className="px-1 text-xs font-semibold uppercase tracking-wide text-[#717182]">Enlaces</p>
              <button
                type="button"
                onClick={goContacto}
                className="flex min-h-[44px] w-full items-center rounded-xl px-4 text-left text-sm font-medium text-[#212121] transition-colors hover:bg-gray-100"
              >
                Contacto
              </button>
              <HeaderMobileCtas onCotiza={goCotiza} onPromos={() => onCategoryClick('mr-brown-days')} />
            </div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
