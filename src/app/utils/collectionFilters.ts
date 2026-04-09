import type { Product } from '@/shopify/types';

export type CollectionSort = 'default' | 'price-asc' | 'price-desc' | 'name-asc';

export interface CollectionFilterState {
  search: string;
  priceMin: string;
  priceMax: string;
  selectedVendors: string[];
  selectedCategories: string[];
  inStockOnly: boolean;
  sort: CollectionSort;
}

export function defaultCollectionFilterState(): CollectionFilterState {
  return {
    search: '',
    priceMin: '',
    priceMax: '',
    selectedVendors: [],
    selectedCategories: [],
    inStockOnly: false,
    sort: 'default',
  };
}

export function hasActiveFilters(state: CollectionFilterState): boolean {
  return (
    state.search.trim() !== '' ||
    state.priceMin !== '' ||
    state.priceMax !== '' ||
    state.selectedVendors.length > 0 ||
    state.selectedCategories.length > 0 ||
    state.inStockOnly ||
    state.sort !== 'default'
  );
}

function vendorLabel(p: Product): string {
  const v = p.vendor?.trim();
  return v || 'Sin marca';
}

export function filterAndSortProducts(products: Product[], state: CollectionFilterState): Product[] {
  let list = [...products];
  const q = state.search.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        vendorLabel(p).toLowerCase().includes(q)
    );
  }

  const min = parseFloat(state.priceMin.replace(',', '.'));
  const max = parseFloat(state.priceMax.replace(',', '.'));
  if (!Number.isNaN(min)) {
    list = list.filter((p) => p.price >= min);
  }
  if (!Number.isNaN(max)) {
    list = list.filter((p) => p.price <= max);
  }

  if (state.selectedVendors.length > 0) {
    list = list.filter((p) => state.selectedVendors.includes(vendorLabel(p)));
  }

  if (state.selectedCategories.length > 0) {
    list = list.filter((p) => state.selectedCategories.includes(p.category));
  }

  if (state.inStockOnly) {
    list = list.filter((p) => p.inStock !== false);
  }

  switch (state.sort) {
    case 'price-asc':
      list.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      list.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      list.sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
      break;
    default:
      break;
  }

  return list;
}

export function uniqueVendorLabels(products: Product[]): string[] {
  const set = new Set<string>();
  for (const p of products) {
    set.add(vendorLabel(p));
  }
  return [...set].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
}

export function uniqueCategories(products: Product[]): string[] {
  const set = new Set<string>();
  for (const p of products) {
    if (p.category) set.add(p.category);
  }
  return [...set].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
}
