import React, { useRef, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '@/app/components/Hero';
import { FlashDeals } from '@/app/components/FlashDeals';
import { BrandsSection } from '@/app/components/BrandsSection';
import { Newsletter } from '@/app/components/Newsletter';
import { About } from '@/app/components/About';
import { FAQ } from '@/app/components/FAQ';
import { ProductCard } from '@/app/components/ProductCard';
import { AdBanner, getInlineAdSlots } from '@/app/components/AdBanner';
import { CollectionProductFilters } from '@/app/components/CollectionProductFilters';
import {
  defaultCollectionFilterState,
  filterAndSortProducts,
  hasActiveFilters,
} from '@/app/utils/collectionFilters';
import { useShopifyProducts } from '@/shopify/hooks/useShopifyProducts';

type GridItem =
  | { kind: 'product'; product: ReturnType<typeof useShopifyProducts>['products'][number] }
  | { kind: 'ad'; slotId: string };

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const productsRef = useRef<HTMLElement>(null);
  const { products, loading, error } = useShopifyProducts();
  const [filters, setFilters] = useState(defaultCollectionFilterState);

  const filteredProducts = useMemo(
    () => filterAndSortProducts(products, filters),
    [products, filters]
  );

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const inlineAds = useMemo(() => getInlineAdSlots('home'), []);

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

  const midBannerAfter = 8;
  const firstHalf = gridItems.slice(0, midBannerAfter);
  const secondHalf = gridItems.slice(midBannerAfter);

  return (
    <>
      <Hero onShopNowClick={scrollToProducts} />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-[100vw]">
        <AdBanner slotId="home-hero-below" />
      </div>

      <FlashDeals />

      <section ref={productsRef} className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 max-w-[100vw]">
        <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2 min-w-0 flex-wrap">
          <h2 className="text-[#212121]">Todos los Productos</h2>
          {!loading && (
            <p className="text-[#717182] text-sm sm:text-base">
              {hasActiveFilters(filters) && products.length > 0
                ? `${filteredProducts.length} de ${products.length} productos`
                : `${products.length} productos`}
            </p>
          )}
        </div>

        {!loading && products.length > 0 && (
          <CollectionProductFilters
            products={products}
            value={filters}
            onChange={setFilters}
            disabled={loading}
          />
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-60 sm:h-80 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 rounded-xl border border-gray-200 bg-gray-50 px-4">
            <p className="text-[#717182] text-lg mb-4">
              Ningún producto coincide con los filtros seleccionados.
            </p>
            <button
              type="button"
              onClick={() => setFilters(defaultCollectionFilterState())}
              className="inline-block bg-[#0055a2] text-white px-6 py-3 rounded-lg hover:bg-[#003d7a] transition-colors font-medium"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6">
              {firstHalf.map((item, i) =>
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

            {secondHalf.length > 0 && (
              <div className="my-4 sm:my-8">
                <AdBanner slotId="home-products-mid" />
              </div>
            )}

            {secondHalf.length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6">
                {secondHalf.map((item, i) =>
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
          </>
        )}
      </section>

      <BrandsSection />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-[100vw]">
        <AdBanner slotId="home-brands-below" />
      </div>

      <Newsletter />
      <About />
      <FAQ />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-[100vw]">
        <AdBanner slotId="home-faq-below" variant="leaderboard" />
      </div>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0055a2]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#0055a2] text-2xl">🚚</span>
              </div>
              <h3 className="text-[#212121] mb-2">Entregas Exprés</h3>
              <p className="text-[#717182]">Envíos en menos de 24 horas en CDMX</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0055a2]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#0055a2] text-2xl">📦</span>
              </div>
              <h3 className="text-[#212121] mb-2">Amplio Catálogo</h3>
              <p className="text-[#717182]">+2,000 productos de +300 proveedores</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0055a2]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#0055a2] text-2xl">💬</span>
              </div>
              <h3 className="text-[#212121] mb-2">Servicio al Cliente</h3>
              <p className="text-[#717182]">¿Alguna pregunta? Contáctanos</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
