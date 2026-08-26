import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShopifyCollections } from '@/shopify/hooks/useShopifyCollections';
import { resolveDesktopNav, catalogEntryHref, type CatalogEntry } from '@/config/category-catalog';

export function useHeaderNav(onCategoryClick: (handle: string) => void, closeMobile: () => void) {
  const navigate = useNavigate();
  const { collections, loading } = useShopifyCollections();
  const desktopNavItems = useMemo(() => resolveDesktopNav(collections), [collections]);

  const handleCategoryClick = (handle: string) => {
    onCategoryClick(handle);
    closeMobile();
  };

  const goToNavEntry = (entry: CatalogEntry) => {
    if (entry.type === 'heading') return;
    if (entry.type === 'route') {
      navigate(entry.path);
      closeMobile();
      return;
    }
    navigate(catalogEntryHref(entry));
    closeMobile();
  };

  return {
    desktopNavItems,
    collectionsLoading: loading,
    handleCategoryClick,
    goToNavEntry,
  };
}
