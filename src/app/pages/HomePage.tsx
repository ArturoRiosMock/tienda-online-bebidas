import React, { useRef, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { PartyPopper, ArrowRight } from 'lucide-react';
import { Hero } from '@/app/components/Hero';
import { FlashDeals } from '@/app/components/FlashDeals';
import { BrandsSection } from '@/app/components/BrandsSection';
import { Newsletter } from '@/app/components/Newsletter';
import { FAQ } from '@/app/components/FAQ';
import { ProductCard } from '@/app/components/ProductCard';
import { AdBanner, getInlineAdSlots } from '@/app/components/AdBanner';
import { useShopifyProducts } from '@/shopify/hooks/useShopifyProducts';

/** Handle esperado; si Admin usa otro, el fallback por título lo corrige. */
const HOME_FEATURED_COLLECTION_HANDLE = 'los-favoritos-del-club';
const HOME_FEATURED_COLLECTION_TITLE = 'Los Favoritos del Club';

type GridItem =
  | { kind: 'product'; product: ReturnType<typeof useShopifyProducts>['products'][number] }
  | { kind: 'ad'; slotId: string };

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const productsRef = useRef<HTMLElement>(null);
  const { products, loading, error } = useShopifyProducts(
    HOME_FEATURED_COLLECTION_HANDLE,
    HOME_FEATURED_COLLECTION_TITLE
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

    while (productIndex < products.length || adIndex < inlineAds.length) {
      if (adIndex < inlineAds.length && position === inlineAds[adIndex].position - 1) {
        items.push({ kind: 'ad', slotId: inlineAds[adIndex].slotId });
        adIndex++;
        position++;
        continue;
      }

      if (productIndex < products.length) {
        items.push({ kind: 'product', product: products[productIndex] });
        productIndex++;
        position++;
      } else {
        break;
      }
    }

    return items;
  }, [products, inlineAds]);

  const midBannerAfter = 8;
  const beforeMidBanner = gridItems.slice(0, midBannerAfter);
  const afterMidBanner = gridItems.slice(midBannerAfter);

  return (
    <>
      <Hero onShopNowClick={scrollToProducts} />

      <AdBanner
        slotId="home-hero-below"
        containerClassName="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-[100vw]"
      />

      <FlashDeals />

      {/* Event Quote CTA */}
      <section className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-[100vw]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <Link
            to="/cotizar-evento"
            className="block rounded-2xl overflow-hidden bg-gradient-to-r from-[#0c3c1f] via-[#1a5c35] to-[#0c3c1f] relative group"
          >
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
                }}
              />
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 sm:px-10 py-8 sm:py-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#FDB93A] rounded-full flex items-center justify-center flex-shrink-0">
                  <PartyPopper className="w-7 h-7 text-[#212121]" />
                </div>
                <div>
                  <h3 className="text-white text-xl sm:text-2xl font-bold mb-1">
                    ¿Planeas un evento?
                  </h3>
                  <p className="text-white/70 text-sm sm:text-base">
                    Cotiza bebidas para tu boda, fiesta o reunión. Te armamos una propuesta a tu medida.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-[#FDB93A] text-[#212121] px-6 py-3 rounded-lg font-bold text-sm whitespace-nowrap group-hover:bg-[#FF8A00] transition-colors flex-shrink-0">
                Cotizar Evento
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.div>
      </section>

      <section ref={productsRef} className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 max-w-[100vw]">
        <div className="flex items-center justify-between mb-6 sm:mb-8 gap-2 min-w-0">
          <h2 className="text-[#212121]">Los Favoritos del Club</h2>
          {!loading && <p className="text-[#717182]">{products.length} productos</p>}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex gap-2 sm:gap-6 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="shrink-0 w-[calc((100%-0.5rem)/2)] lg:w-[calc((100%-3rem)/3)] xl:w-[calc((100%-4.5rem)/4)] h-60 sm:h-80 bg-gray-100 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-[#717182] text-center py-12">
            Pronto tendremos novedades en Los Favoritos del Club.
          </p>
        ) : (
          <>
            <div
              className="flex gap-2 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-3 sm:-mx-4 px-3 sm:px-4"
              style={{ scrollbarWidth: 'thin' }}
            >
              {beforeMidBanner.map((item, i) => (
                <div
                  key={
                    item.kind === 'product'
                      ? `p-${item.product.id}`
                      : `ad-${item.slotId}-${i}`
                  }
                  className="snap-start shrink-0 w-[calc((100%-0.5rem)/2)] lg:w-[calc((100%-3rem)/3)] xl:w-[calc((100%-4.5rem)/4)]"
                >
                  {item.kind === 'product' ? (
                    <ProductCard
                      product={item.product}
                      onClick={() =>
                        navigate(`/producto/${item.product.handle || item.product.id}`)
                      }
                    />
                  ) : (
                    <AdBanner slotId={item.slotId} variant="inline-card" />
                  )}
                </div>
              ))}
            </div>

            {afterMidBanner.length > 0 && (
              <AdBanner
                slotId="home-products-mid"
                containerClassName="my-4 sm:my-8"
              />
            )}

            {afterMidBanner.length > 0 && (
              <div
                className="flex gap-2 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-3 sm:-mx-4 px-3 sm:px-4"
                style={{ scrollbarWidth: 'thin' }}
              >
                {afterMidBanner.map((item, i) => (
                  <div
                    key={
                      item.kind === 'product'
                        ? `p-${item.product.id}`
                        : `ad-${item.slotId}-${i}`
                    }
                    className="snap-start shrink-0 w-[calc((100%-0.5rem)/2)] lg:w-[calc((100%-3rem)/3)] xl:w-[calc((100%-4.5rem)/4)]"
                  >
                    {item.kind === 'product' ? (
                      <ProductCard
                        product={item.product}
                        onClick={() =>
                          navigate(`/producto/${item.product.handle || item.product.id}`)
                        }
                      />
                    ) : (
                      <AdBanner slotId={item.slotId} variant="inline-card" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <BrandsSection />

      <AdBanner
        slotId="home-brands-below"
        containerClassName="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-[100vw]"
      />

      <Newsletter />
      <FAQ />

      <AdBanner
        slotId="home-faq-below"
        variant="leaderboard"
        containerClassName="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-[100vw]"
      />

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
