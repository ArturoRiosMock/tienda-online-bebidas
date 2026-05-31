import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Search, ChevronRight, X } from 'lucide-react';
import { ProductCard } from '@/app/components/ProductCard';
import { CollectionProductFilters } from '@/app/components/CollectionProductFilters';
import { ProductGridPagination } from '@/app/components/ProductGridPagination';
import {
  defaultCollectionFilterState,
  filterAndSortProducts,
  hasActiveFilters,
} from '@/app/utils/collectionFilters';
import { PRODUCTS_PER_PAGE, useProductPagination } from '@/app/utils/productPagination';
import { CategorySidebar } from '@/app/components/CategorySidebar';
import { searchProducts } from '@/shopify/products';
import { isShopifyConfigured } from '@/shopify/config';
import type { Product } from '@/shopify/types';

export const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryParam = searchParams.get('q') ?? '';
  const [inputValue, setInputValue] = useState(queryParam);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(defaultCollectionFilterState);

  useEffect(() => {
    setInputValue(queryParam);
  }, [queryParam]);

  useEffect(() => {
    setFilters(defaultCollectionFilterState());

    if (!queryParam || queryParam.trim().length < 2) {
      setProducts([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const run = async () => {
      try {
        if (!isShopifyConfigured()) {
          setProducts([]);
          return;
        }
        const results = await searchProducts(queryParam.trim(), 100);
        if (!cancelled) setProducts(results);
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => { cancelled = true; };
  }, [queryParam]);

  const filteredProducts = useMemo(
    () => filterAndSortProducts(products, filters),
    [products, filters],
  );

  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedProducts,
    visiblePages,
    handlePageChange,
    setCurrentPage,
  } = useProductPagination(filteredProducts);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, queryParam, setCurrentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed) {
      setSearchParams({ q: trimmed });
    }
  };

  return (
    <div className="min-h-[60vh]">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-[#717182]">
            <Link to="/" className="hover:text-[#0055a2] transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#0055a2] font-medium">Búsqueda</span>
            {queryParam && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-[#0055a2] font-medium">«{queryParam}»</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Search header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          {queryParam && !loading ? (
            <h1 className="text-2xl font-bold text-[#212121] mb-4">
              {products.length} resultado{products.length !== 1 ? 's' : ''} para{' '}
              <span className="text-[#0055a2]">«{queryParam}»</span>
            </h1>
          ) : (
            <h1 className="text-2xl font-bold text-[#212121] mb-4">Buscar productos</h1>
          )}

          <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Buscar productos..."
                autoFocus
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0055a2] text-[#212121] text-sm transition-colors"
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={() => { setInputValue(''); setSearchParams({}); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#212121]"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-[#0055a2] text-white px-5 py-2.5 rounded-lg hover:bg-[#004488] transition-colors text-sm font-medium"
            >
              Buscar
            </button>
          </form>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-4">
              <h3 className="text-[#0055a2] font-bold mb-3 text-sm uppercase tracking-wide">
                Categorías
              </h3>
              <CategorySidebar />
            </div>
          </aside>

          {/* Results */}
          <div>
            {/* Count + sort row */}
            {!loading && queryParam && (
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <p className="text-[#717182] text-sm">
                  {hasActiveFilters(filters) && products.length > 0
                    ? `${filteredProducts.length} de ${products.length} productos`
                    : `${products.length} productos encontrados`}
                  {filteredProducts.length > PRODUCTS_PER_PAGE && (
                    <span> · Página {currentPage} de {totalPages}</span>
                  )}
                </p>
              </div>
            )}

            {!loading && products.length > 0 && (
              <CollectionProductFilters
                products={products}
                value={filters}
                onChange={setFilters}
                disabled={loading}
              />
            )}

            {/* No query */}
            {!queryParam && !loading && (
              <div className="flex flex-col items-center justify-center py-20 text-[#717182]">
                <Search className="w-16 h-16 text-gray-200 mb-4" />
                <p className="text-lg font-medium">¿Qué estás buscando?</p>
                <p className="text-sm mt-1">Escribe en el buscador de arriba para encontrar productos.</p>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-60 sm:h-80 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            )}

            {/* No results */}
            {!loading && queryParam && products.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-[#717182]">
                <Search className="w-14 h-14 text-gray-200 mb-4" />
                <p className="text-lg font-medium">Sin resultados para «{queryParam}»</p>
                <p className="text-sm mt-1 mb-6">Prueba con otros términos o revisa la ortografía.</p>
                <Link
                  to="/productos"
                  className="bg-[#0055a2] text-white px-6 py-2.5 rounded-lg hover:bg-[#004488] transition-colors text-sm font-medium"
                >
                  Ver todos los productos
                </Link>
              </div>
            )}

            {/* Filtered no results */}
            {!loading && queryParam && products.length > 0 && filteredProducts.length === 0 && (
              <div className="text-center py-16 rounded-xl border border-gray-200 bg-gray-50 px-4">
                <p className="text-[#717182] text-lg mb-4">
                  Ningún producto coincide con los filtros seleccionados.
                </p>
                <button
                  type="button"
                  onClick={() => setFilters(defaultCollectionFilterState())}
                  className="bg-[#0055a2] text-white px-6 py-3 rounded-lg hover:bg-[#003d7a] transition-colors font-medium"
                >
                  Limpiar filtros
                </button>
              </div>
            )}

            {/* Grid */}
            {!loading && filteredProducts.length > 0 && (
              <>
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={`p-${product.id}`}
                      product={product}
                      onClick={() => navigate(`/producto/${product.handle || product.id}`)}
                    />
                  ))}
                </div>

                <ProductGridPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  visiblePages={visiblePages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
