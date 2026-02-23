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

  const sliderSettings = {
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
      { breakpoint: 1024, settings: { slidesToShow: Math.min(3, deals.length || 1), slidesToScroll: 1 } }
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

  if (!loading && deals.length === 0) {
    return null;
  }

  const DealCard = ({ deal }: { deal: typeof deals[number] }) => {
    const hasDiscount = deal.originalPrice && deal.originalPrice > deal.price;
    const discountPercentage = hasDiscount
      ? Math.round(((deal.originalPrice! - deal.price) / deal.originalPrice!) * 100)
      : 0;

    return (
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white rounded-lg p-2 sm:p-4 relative"
      >
        {discountPercentage > 0 && (
          <div className="absolute top-1 left-1 z-10 bg-[rgb(255,107,53)] text-white rounded-full w-10 h-10 md:w-16 md:h-16 flex flex-col items-center justify-center shadow-lg">
            <span className="text-xs md:text-lg font-bold leading-none">{discountPercentage}%</span>
            <span className="text-[8px] md:text-xs uppercase leading-none">OFF</span>
          </div>
        )}

        <div className="relative mb-2 md:mb-4 mx-auto w-[85%]">
          <div className="relative w-full aspect-square flex items-center justify-center">
            <img
              src={deal.image}
              alt={deal.name}
              className="relative w-[55%] h-[55%] object-contain"
            />
            <svg
              className="absolute inset-0 w-full h-full z-20 pointer-events-none"
              viewBox="0 0 100 100"
            >
              <path
                d="M50 5 L95 50 L50 95 L5 50 Z"
                fill="none"
                stroke="#0c3c1f"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <h3 className="text-[#212121] text-xs md:text-sm font-medium mb-1 md:mb-2 text-center line-clamp-2 min-h-[32px] md:min-h-[40px]">
          {deal.name}
        </h3>

        <div className="text-center mb-1.5 md:mb-3">
          <p className="text-[10px] md:text-xs text-[#717182] mb-0.5">Por apenas:</p>
          <div className="flex items-center justify-center gap-1 flex-wrap">
            {hasDiscount && (
              <span className="text-[10px] md:text-sm text-[#717182] line-through">
                ${deal.originalPrice!.toFixed(2)}
              </span>
            )}
            <span className="text-sm md:text-2xl font-bold text-[#0c3c1f]">
              ${deal.price.toFixed(2)}
            </span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAddToCart(deal)}
          className="w-full bg-[#0c3c1f] text-white py-1.5 md:py-2 px-2 md:px-4 rounded-lg hover:bg-[#0c3c1f]/90 transition-colors text-[10px] md:text-sm font-medium"
        >
          Agregar
        </motion.button>
      </motion.div>
    );
  };

  return (
    <section className="bg-white py-8 md:py-12 overflow-hidden">
      <div className="container mx-auto px-3 sm:px-4 max-w-[100vw]">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-[#0c3c1f] rounded-full flex items-center justify-center shrink-0"
            >
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white" />
            </motion.div>
            <h2 className="text-[#0c3c1f] text-lg sm:text-xl">Ofertas Relámpago</h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto min-w-0">
            <span className="text-[#212121] font-medium text-sm sm:text-base shrink-0">Las ofertas terminan en:</span>
            <div className="flex gap-1.5 sm:gap-2 shrink-0">
              <div className="bg-[#0c3c1f] text-white px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg min-w-[52px] sm:min-w-[60px] text-center">
                <div className="text-xl sm:text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-[10px] sm:text-xs uppercase">Horas</div>
              </div>
              <div className="bg-[#0c3c1f] text-white px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg min-w-[52px] sm:min-w-[60px] text-center">
                <div className="text-xl sm:text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-[10px] sm:text-xs uppercase">Min</div>
              </div>
              <div className="bg-[#0c3c1f] text-white px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg min-w-[52px] sm:min-w-[60px] text-center">
                <div className="text-xl sm:text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="text-[10px] sm:text-xs uppercase">Seg</div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-48 md:h-72 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {/* Mobile: scroll horizontal con 3 columnas visibles */}
        {!loading && deals.length > 0 && (
          <div className="md:hidden">
            <div className="flash-deals-mobile-scroll flex gap-2 overflow-x-auto pb-4 -mx-3 px-3 snap-x snap-mandatory">
              {deals.map((deal) => (
                <div
                  key={deal.id}
                  className="shrink-0 snap-start"
                  style={{ width: 'calc((100% - 16px) / 3)' }}
                >
                  <DealCard deal={deal} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Desktop: carrusel Slider */}
        {!loading && deals.length > 0 && (
          <div className="hidden md:block flash-deals-slider">
            <Slider {...sliderSettings}>
              {deals.map((deal) => (
                <div key={deal.id} className="px-3">
                  <DealCard deal={deal} />
                </div>
              ))}
            </Slider>
          </div>
        )}
      </div>

      <style>{`
        .flash-deals-mobile-scroll::-webkit-scrollbar { display: none; }
        .flash-deals-mobile-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .flash-deals-slider .slick-dots { bottom: -35px; }
        .flash-deals-slider .slick-dots li button:before { color: #0c3c1f; font-size: 8px; }
        .flash-deals-slider .slick-dots li.slick-active button:before { color: #0c3c1f; }
        .flash-deals-slider .slick-prev,
        .flash-deals-slider .slick-next { width: 40px; height: 40px; z-index: 10; }
        .flash-deals-slider .slick-prev { left: -45px; }
        .flash-deals-slider .slick-next { right: -45px; }
        .flash-deals-slider .slick-prev:before,
        .flash-deals-slider .slick-next:before { color: #0c3c1f; font-size: 40px; }
        @media (max-width: 1024px) {
          .flash-deals-slider .slick-prev { left: -25px; }
          .flash-deals-slider .slick-next { right: -25px; }
        }
      `}</style>
    </section>
  );
};
