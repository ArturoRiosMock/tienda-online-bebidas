import React, { useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '@/app/components/Hero';
import { FlashDeals } from '@/app/components/FlashDeals';
import { BrandsSection } from '@/app/components/BrandsSection';
import { About } from '@/app/components/About';
import { FAQ } from '@/app/components/FAQ';
import { ProductsCarousel } from '@/app/components/ProductsCarousel';
import { RegisterBanner } from '@/app/components/RegisterBanner';
import { useShopifyProducts } from '@/shopify/hooks/useShopifyProducts';

const PRODUCTS_PER_CAROUSEL = 20;
const NEW_ARRIVALS_OPTIONS = { newest: true, limit: PRODUCTS_PER_CAROUSEL } as const;

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const productsRef = useRef<HTMLDivElement>(null);
  const { products, loading, error } = useShopifyProducts();
  const {
    products: newestProducts,
    loading: newestLoading,
    error: newestError,
  } = useShopifyProducts(undefined, NEW_ARRIVALS_OPTIONS);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const featuredProducts = useMemo(
    () => products.slice(0, PRODUCTS_PER_CAROUSEL),
    [products]
  );

  const newArrivals = useMemo(
    () => newestProducts.slice(0, PRODUCTS_PER_CAROUSEL),
    [newestProducts]
  );

  const isLoading = loading || newestLoading;
  const displayError = error || newestError;

  const handleProductClick = (handleOrId: string) => {
    navigate(`/producto/${handleOrId}`);
  };

  return (
    <>
      <Hero onShopNowClick={scrollToProducts} />

      <FlashDeals />

      <div ref={productsRef}>
        {displayError && (
          <div className="container mx-auto px-3 sm:px-4 mt-4">
            <div className="p-4 bg-red-50 text-red-700 rounded-lg">{displayError}</div>
          </div>
        )}

        {isLoading && (
          <section className="container mx-auto px-3 sm:px-4 py-8 sm:py-10 max-w-[100vw]">
            <div className="h-7 w-40 bg-gray-100 rounded mb-6 animate-pulse" />
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-72 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          </section>
        )}

        {!isLoading && (
          <>
            <ProductsCarousel
              title="Productos Destacados"
              products={featuredProducts}
              onProductClick={(p) => handleProductClick(p.handle || p.id)}
            />

            {newArrivals.length > 0 && (
              <ProductsCarousel
                title="Últimas novedades"
                products={newArrivals}
                onProductClick={(p) => handleProductClick(p.handle || p.id)}
                cornerBadge="Nuevo"
                viewAllHref="/productos"
              />
            )}

          </>
        )}
      </div>

      <BrandsSection />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-[100vw]">
        <RegisterBanner />
      </div>

      {/* NewsletterPopup desactivado temporalmente */}
      {/* <NewsletterPopup /> */}
      <About />
      <FAQ />

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0055a2]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#0055a2] text-2xl">🚚</span>
              </div>
              <h3 className="text-[#212121] mb-2">Entregas Exprés</h3>
              <p className="text-[#717182]">Entregas a partir de 24 a 48 horas en toda la CDMX y área Metropolitana</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0055a2]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#0055a2] text-2xl">📦</span>
              </div>
              <h3 className="text-[#212121] mb-2">Amplio Catálogo</h3>
              <p className="text-[#717182]">+2,000 productos de +200 proveedores</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0055a2]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#0055a2] text-2xl">💬</span>
              </div>
              <h3 className="text-[#212121] mb-2">Servicio al Cliente</h3>
              <p className="text-[#717182]">¿Alguna pregunta? Contáctanos</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/blog')}
              className="text-center group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0055a2] focus-visible:ring-offset-2 rounded-lg"
            >
              <div className="w-16 h-16 bg-[#0055a2]/10 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors group-hover:bg-[#0055a2]/20">
                <span className="text-[#0055a2] text-2xl">📰</span>
              </div>
              <h3 className="text-[#212121] mb-2 group-hover:text-[#0055a2] transition-colors">Blog</h3>
              <p className="text-[#717182]">Tendencias, guías y novedades del mundo de las bebidas</p>
            </button>
          </div>
        </div>
      </section>
    </>
  );
};
