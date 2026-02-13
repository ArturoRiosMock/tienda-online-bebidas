import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { useCart } from '@/app/context/CartContext';
import { useShopifyProducts } from '@/shopify/hooks/useShopifyProducts';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const FLASH_DEALS_COLLECTION = 'ofertas-relampago';

export const FlashDeals: React.FC = () => {
  const { addToCart } = useCart();
  const { products: deals, loading, error } = useShopifyProducts(FLASH_DEALS_COLLECTION);

  const [timeLeft, setTimeLeft] = useState({
    hours: 11,
    minutes: 18,
    seconds: 15
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          return { hours: 11, minutes: 18, seconds: 15 };
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const settings = {
    dots: true,
    infinite: deals.length > 5,
    speed: 500,
    slidesToShow: Math.min(5, deals.length || 1),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: Math.min(4, deals.length || 1), slidesToScroll: 1 } },
      { breakpoint: 1024, settings: { slidesToShow: Math.min(3, deals.length || 1), slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: Math.min(2, deals.length || 1), slidesToScroll: 1 } },
      { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } }
    ]
  };

  const handleAddToCart = (deal: typeof deals[number]) => {
    addToCart({
      id: deal.id,
      name: deal.name,
      price: deal.price,
      originalPrice: deal.originalPrice,
      category: deal.category,
      description: deal.description,
      image: deal.image,
      variantId: deal.variantId,
      shopifyId: deal.shopifyId,
      handle: deal.handle,
    }, 1);
  };

  // No mostrar la sección si no hay ofertas y no está cargando
  if (!loading && deals.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-12 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-12 h-12 bg-[#0c3c1f] rounded-full flex items-center justify-center"
            >
              <Zap className="w-6 h-6 text-white fill-white" />
            </motion.div>
            <h2 className="text-[#0c3c1f]">Ofertas Relámpago</h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#212121] font-medium">Las ofertas terminan en:</span>
            <div className="flex gap-2">
              <div className="bg-[#0c3c1f] text-white px-3 py-2 rounded-lg min-w-[60px] text-center">
                <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-xs uppercase">Horas</div>
              </div>
              <div className="bg-[#0c3c1f] text-white px-3 py-2 rounded-lg min-w-[60px] text-center">
                <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-xs uppercase">Min</div>
              </div>
              <div className="bg-[#0c3c1f] text-white px-3 py-2 rounded-lg min-w-[60px] text-center">
                <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="text-xs uppercase">Seg</div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-72 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {/* Carousel */}
        {!loading && deals.length > 0 && (
          <div className="flash-deals-slider">
            <Slider {...settings}>
              {deals.map((deal) => {
                const hasDiscount = deal.originalPrice && deal.originalPrice > deal.price;
                const discountPercentage = hasDiscount
                  ? Math.round(((deal.originalPrice! - deal.price) / deal.originalPrice!) * 100)
                  : 0;

                return (
                  <div key={deal.id} className="px-3">
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-lg p-4 relative"
                    >
                      {/* Discount Badge */}
                      {discountPercentage > 0 && (
                        <div className="absolute top-2 left-2 z-10 bg-[rgb(255,107,53)] text-white rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-lg">
                          <span className="text-lg font-bold">{discountPercentage}%</span>
                          <span className="text-xs uppercase">OFF</span>
                        </div>
                      )}

                      {/* Diamond Border Container */}
                      <div className="relative mb-4">
                        <div className="relative w-full aspect-square flex items-center justify-center">
                          <svg
                            className="absolute inset-0 w-full h-full"
                            viewBox="0 0 200 200"
                            style={{ transform: 'rotate(45deg)' }}
                          >
                            <rect
                              x="20"
                              y="20"
                              width="160"
                              height="160"
                              fill="none"
                              stroke="#0c3c1f"
                              strokeWidth="3"
                              rx="15"
                            />
                          </svg>
                          <img
                            src={deal.image}
                            alt={deal.name}
                            className="relative z-10 w-3/4 h-3/4 object-contain"
                          />
                        </div>
                      </div>

                      {/* Product Info */}
                      <h3 className="text-[#212121] text-sm font-medium mb-2 text-center line-clamp-2 min-h-[40px]">
                        {deal.name}
                      </h3>

                      <div className="text-center mb-3">
                        <p className="text-xs text-[#717182] mb-1">Por apenas:</p>
                        <div className="flex items-center justify-center gap-2">
                          {hasDiscount && (
                            <span className="text-sm text-[#717182] line-through">
                              ${deal.originalPrice!.toFixed(2)}
                            </span>
                          )}
                          <span className="text-2xl font-bold text-[#0c3c1f]">
                            ${deal.price.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddToCart(deal)}
                        className="w-full bg-[#0c3c1f] text-white py-2 px-4 rounded-lg hover:bg-[#0c3c1f]/90 transition-colors text-sm font-medium"
                      >
                        Agregar al carrito
                      </motion.button>
                    </motion.div>
                  </div>
                );
              })}
            </Slider>
          </div>
        )}
      </div>

      <style>{`
        .flash-deals-slider .slick-dots {
          bottom: -35px;
        }
        .flash-deals-slider .slick-dots li button:before {
          color: #0c3c1f;
          font-size: 8px;
        }
        .flash-deals-slider .slick-dots li.slick-active button:before {
          color: #0c3c1f;
        }
        .flash-deals-slider .slick-prev,
        .flash-deals-slider .slick-next {
          width: 40px;
          height: 40px;
          z-index: 10;
        }
        .flash-deals-slider .slick-prev {
          left: -45px;
        }
        .flash-deals-slider .slick-next {
          right: -45px;
        }
        .flash-deals-slider .slick-prev:before,
        .flash-deals-slider .slick-next:before {
          color: #0c3c1f;
          font-size: 40px;
        }
        @media (max-width: 1024px) {
          .flash-deals-slider .slick-prev { left: -25px; }
          .flash-deals-slider .slick-next { right: -25px; }
        }
        @media (max-width: 768px) {
          .flash-deals-slider .slick-prev,
          .flash-deals-slider .slick-next {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};
