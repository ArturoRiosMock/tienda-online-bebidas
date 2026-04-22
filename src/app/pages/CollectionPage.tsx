import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '@/app/components/ProductCard';
import { AdBanner, getInlineAdSlots } from '@/app/components/AdBanner';
import { useShopifyProducts } from '@/shopify/hooks/useShopifyProducts';
import { useShopifyCollections } from '@/shopify/hooks/useShopifyCollections';

type GridItem =
  | { kind: 'product'; product: ReturnType<typeof useShopifyProducts>['products'][number] }
  | { kind: 'ad'; slotId: string };

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name';

export const CollectionPage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const { products, loading, error } = useShopifyProducts(handle);
  const { collections } = useShopifyCollections();

  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [vendorFilter, setVendorFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [discountOnly, setDiscountOnly] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    setSortBy('default');
    setVendorFilter('');
    setTypeFilter('');
    setTagFilter('');
    setDiscountOnly(false);
    setMinPrice('');
    setMaxPrice('');
  }, [handle]);

  const currentCollection = collections.find((c) => c.handle === handle);
  const collectionTitle = currentCollection?.title || handle?.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || 'Colección';

  const inlineAds = useMemo(() => getInlineAdSlots('collection'), []);

  const vendorOptions = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) {
      const v = p.vendor?.trim();
      if (v) set.add(v);
    }
    return [...set].sort((a, b) => a.localeCompare(b, 'es'));
  }, [products]);

  const typeOptions = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) {
      const t = p.category?.trim();
      if (t) set.add(t);
    }
    return [...set].sort((a, b) => a.localeCompare(b, 'es'));
  }, [products]);

  const tagOptions = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) {
      for (const t of p.tags || []) {
        const tag = t.trim();
        if (tag) set.add(tag);
      }
    }
    return [...set].sort((a, b) => a.localeCompare(b, 'es'));
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      if (vendorFilter && (p.vendor || '') !== vendorFilter) return false;
      if (typeFilter && p.category !== typeFilter) return false;
      if (tagFilter && !(p.tags || []).includes(tagFilter)) return false;
      if (discountOnly) {
        const hasDiscount = p.originalPrice != null && p.originalPrice > p.price;
        if (!hasDiscount) return false;
      }
      const min = parseFloat(minPrice.replace(',', '.'));
      if (minPrice.trim() !== '' && !Number.isNaN(min) && p.price < min) return false;
      const max = parseFloat(maxPrice.replace(',', '.'));
      if (maxPrice.trim() !== '' && !Number.isNaN(max) && p.price > max) return false;
      return true;
    });

    const sorted = [...list];
    if (sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name, 'es'));

    return sorted;
  }, [products, sortBy, vendorFilter, typeFilter, tagFilter, discountOnly, minPrice, maxPrice]);

  const filtersActive =
    sortBy !== 'default' ||
    Boolean(vendorFilter) ||
    Boolean(typeFilter) ||
    Boolean(tagFilter) ||
    discountOnly ||
    minPrice.trim() !== '' ||
    maxPrice.trim() !== '';

  const clearFilters = () => {
    setSortBy('default');
    setVendorFilter('');
    setTypeFilter('');
    setTagFilter('');
    setDiscountOnly(false);
    setMinPrice('');
    setMaxPrice('');
  };

  const gridItems = useMemo<GridItem[]>(() => {
    const items: GridItem[] = [];
    let adIndex = 0;
    let productIndex = 0;
    let position = 0;

    while (productIndex < filteredProducts.length || adIndex < inlineAds.length) {
      if (adIndex < inlineAds.length && position === inlineAds[adIndex].position - 1) {
        items.push({ kind: 'ad', slotId: inlineAds[adIndex].slotId });
        adIndex++;
        position++;
        continue;
      }

      if (productIndex < filteredProducts.length) {
        items.push({ kind: 'product', product: filteredProducts[productIndex] });
        productIndex++;
        position++;
      } else {
        break;
      }
    }

    return items;
  }, [filteredProducts, inlineAds]);

  return (
    <div className="min-h-[60vh]">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-[#717182]">
            <Link to="/" className="hover:text-[#0c3c1f] transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#0c3c1f] font-medium">{collectionTitle}</span>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-[#0c3c1f] mb-2">{collectionTitle}</h1>
          {currentCollection?.description && (
            <p className="text-[#717182] max-w-2xl">{currentCollection.description}</p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 pt-4 pb-0">
        <AdBanner slotId="collection-header-below" variant="leaderboard" />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          <aside className="hidden lg:block">
            <div className="sticky top-4 space-y-6">
              <div>
                <h3 className="text-[#0c3c1f] font-bold mb-4 text-sm uppercase tracking-wide">Categorías</h3>
                <nav className="space-y-1">
                  <Link
                    to="/"
                    className="block px-3 py-2 text-sm rounded-lg text-[#212121] hover:bg-gray-100 hover:text-[#0c3c1f] transition-colors"
                  >
                    Todos los Productos
                  </Link>
                  {collections
                    .filter((c) => c.handle !== 'ofertas-relampago')
                    .map((col) => (
                      <Link
                        key={col.id}
                        to={`/categorias/${col.handle}`}
                        className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                          col.handle === handle
                            ? 'bg-[#0c3c1f] text-white font-medium'
                            : 'text-[#212121] hover:bg-gray-100 hover:text-[#0c3c1f]'
                        }`}
                      >
                        {col.title}
                      </Link>
                    ))}
                </nav>
              </div>

              <AdBanner slotId="collection-sidebar-skyscraper" variant="sidebar" />
            </div>
          </aside>

          <div>
            <div className="mb-4">
              {!loading && (
                <p className="text-[#717182] text-sm">
                  {filteredProducts.length === products.length
                    ? `${products.length} productos encontrados`
                    : `${filteredProducts.length} de ${products.length} productos`}
                </p>
              )}
            </div>

            {!loading && products.length > 0 && (
              <div
                className="mb-6 rounded-xl border border-gray-200 bg-gray-50/80 p-4 sm:p-5"
                role="search"
                aria-label="Filtros de productos"
              >
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <SlidersHorizontal className="w-4 h-4 text-[#0c3c1f] shrink-0" aria-hidden />
                  <span className="text-sm font-semibold text-[#0c3c1f]">Filtros</span>
                  {filtersActive && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="ml-auto text-xs sm:text-sm text-[#0c3c1f] underline underline-offset-2 hover:no-underline"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                  <label className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-[#717182]">Ordenar</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#212121] focus:border-[#0c3c1f] focus:outline-none focus:ring-1 focus:ring-[#0c3c1f]"
                    >
                      <option value="default">Destacados</option>
                      <option value="price-asc">Precio: menor a mayor</option>
                      <option value="price-desc">Precio: mayor a menor</option>
                      <option value="name">Nombre (A–Z)</option>
                    </select>
                  </label>

                  {vendorOptions.length > 0 && (
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-[#717182]">Marca</span>
                      <select
                        value={vendorFilter}
                        onChange={(e) => setVendorFilter(e.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#212121] focus:border-[#0c3c1f] focus:outline-none focus:ring-1 focus:ring-[#0c3c1f]"
                      >
                        <option value="">Todas</option>
                        {vendorOptions.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}

                  {typeOptions.length > 0 && (
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-[#717182]">Tipo</span>
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#212121] focus:border-[#0c3c1f] focus:outline-none focus:ring-1 focus:ring-[#0c3c1f]"
                      >
                        <option value="">Todos</option>
                        {typeOptions.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}

                  {tagOptions.length > 0 && (
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-[#717182]">Etiqueta</span>
                      <select
                        value={tagFilter}
                        onChange={(e) => setTagFilter(e.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#212121] focus:border-[#0c3c1f] focus:outline-none focus:ring-1 focus:ring-[#0c3c1f]"
                      >
                        <option value="">Todas</option>
                        {tagOptions.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}

                  <label className="flex flex-col gap-1 sm:col-span-2 xl:col-span-1">
                    <span className="text-xs font-medium text-[#717182]">Precio (MXN)</span>
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder="Mín."
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#212121] placeholder:text-gray-400 focus:border-[#0c3c1f] focus:outline-none focus:ring-1 focus:ring-[#0c3c1f]"
                        aria-label="Precio mínimo"
                      />
                      <span className="text-[#717182] text-sm">—</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder="Máx."
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#212121] placeholder:text-gray-400 focus:border-[#0c3c1f] focus:outline-none focus:ring-1 focus:ring-[#0c3c1f]"
                        aria-label="Precio máximo"
                      />
                    </div>
                  </label>

                  <label className="flex items-center gap-2 sm:col-span-2 xl:col-span-3 cursor-pointer select-none pt-1">
                    <input
                      type="checkbox"
                      checked={discountOnly}
                      onChange={(e) => setDiscountOnly(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-[#0c3c1f] focus:ring-[#0c3c1f]"
                    />
                    <span className="text-sm text-[#212121]">Solo productos con descuento</span>
                  </label>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-60 sm:h-80 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-[#717182] text-lg mb-4">No se encontraron productos en esta colección.</p>
                <Link
                  to="/"
                  className="inline-block bg-[#0c3c1f] text-white px-6 py-3 rounded-lg hover:bg-[#0a3019] transition-colors font-medium"
                >
                  Ver todos los productos
                </Link>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
                <p className="text-[#717182] text-lg mb-4">Ningún producto coincide con los filtros.</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-block bg-[#0c3c1f] text-white px-6 py-3 rounded-lg hover:bg-[#0a3019] transition-colors font-medium"
                >
                  Quitar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-6">
                {gridItems.map((item, i) =>
                  item.kind === 'product' ? (
                    <ProductCard
                      key={`p-${item.product.id}`}
                      product={item.product}
                      onClick={() => navigate(`/producto/${item.product.handle || item.product.id}`)}
                    />
                  ) : (
                    <AdBanner key={`ad-${item.slotId}-${i}`} slotId={item.slotId} variant="inline-card" />
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
