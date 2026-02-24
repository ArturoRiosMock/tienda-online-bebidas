import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '@/app/components/Hero';
import { FlashDeals } from '@/app/components/FlashDeals';
import { BrandsSection } from '@/app/components/BrandsSection';
import { Newsletter } from '@/app/components/Newsletter';
import { About } from '@/app/components/About';
import { FAQ } from '@/app/components/FAQ';
import { ProductCard } from '@/app/components/ProductCard';
import { AdBanner } from '@/app/components/AdBanner';
import { useShopifyProducts } from '@/shopify/hooks/useShopifyProducts';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const productsRef = useRef<HTMLElement>(null);
  const { products, loading, error } = useShopifyProducts();

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Hero onShopNowClick={scrollToProducts} />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-[100vw]">
        <AdBanner slotId="home-hero-below" />
      </div>

      <FlashDeals />

      {/* Products Grid */}
      <section ref={productsRef} className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 max-w-[100vw]">
        <div className="flex items-center justify-between mb-6 sm:mb-8 gap-2 min-w-0">
          <h2 className="text-[#212121]">Todos los Productos</h2>
          {!loading && <p className="text-[#717182]">{products.length} productos</p>}
        </div>

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
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6">
              {products.slice(0, 8).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => navigate(`/producto/${product.handle || product.id}`)}
                />
              ))}
            </div>

            {products.length > 8 && (
              <div className="my-4 sm:my-8">
                <AdBanner slotId="home-products-mid" />
              </div>
            )}

            {products.length > 8 && (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6">
                {products.slice(8).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => navigate(`/producto/${product.handle || product.id}`)}
                  />
                ))}
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
        <AdBanner slotId="home-faq-below" />
      </div>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0c3c1f]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#0c3c1f] text-2xl">🚚</span>
              </div>
              <h3 className="text-[#212121] mb-2">Envío Rápido</h3>
              <p className="text-[#717182]">Entrega en 24-48 horas</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0c3c1f]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#0c3c1f] text-2xl">✓</span>
              </div>
              <h3 className="text-[#212121] mb-2">100% Original</h3>
              <p className="text-[#717182]">Productos garantizados</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0c3c1f]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#0c3c1f] text-2xl">💳</span>
              </div>
              <h3 className="text-[#212121] mb-2">Pago Seguro</h3>
              <p className="text-[#717182]">Múltiples métodos de pago</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
