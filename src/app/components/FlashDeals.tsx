import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { useCart } from '@/app/context/CartContext';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Placeholders para ejecución local (figma:asset solo funciona en Figma/Make)
import { PLACEHOLDER_IMAGES } from '@/assets/placeholders';
const imgPenafiel = PLACEHOLDER_IMAGES.agua;
const imgSprite = PLACEHOLDER_IMAGES.refresco;
const imgWhisky = PLACEHOLDER_IMAGES.whisky;

interface FlashDeal {
  id: number;
  name: string;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  image: string;
  category: string;
  description: string;
}

const flashDeals: FlashDeal[] = [
  {
    id: 101,
    name: 'Agua Peñafiel Mineral 2L',
    originalPrice: 35.00,
    discountPrice: 25.00,
    discountPercentage: 29,
    category: 'Agua',
    description: 'Agua mineral natural de manantial, 2L - Oferta especial',
    image: imgPenafiel
  },
  {
    id: 102,
    name: 'Sprite Zero Refresco',
    originalPrice: 25.00,
    discountPrice: 18.00,
    discountPercentage: 28,
    category: 'Refrescos',
    description: 'Refresco de lima-limón sin azúcar - Precio especial',
    image: imgSprite
  },
  {
    id: 103,
    name: 'Nikka Coffey Malt Whisky',
    originalPrice: 1499.00,
    discountPrice: 1299.00,
    discountPercentage: 13,
    category: 'Whisky',
    description: 'Whisky japonés premium - Gran oferta',
    image: imgWhisky
  },
  {
    id: 104,
    name: 'Agua Mineral Peñafiel',
    originalPrice: 35.00,
    discountPrice: 25.00,
    discountPercentage: 29,
    category: 'Agua',
    description: 'Agua con gas natural - Precio rebajado',
    image: imgPenafiel
  },
  {
    id: 105,
    name: 'Sprite Zero Lima-Limón',
    originalPrice: 25.00,
    discountPrice: 18.00,
    discountPercentage: 28,
    category: 'Refrescos',
    description: 'Bebida refrescante sin calorías - Descuento especial',
    image: imgSprite
  },
  {
    id: 106,
    name: 'Whisky Nikka Premium',
    originalPrice: 1499.00,
    discountPrice: 1299.00,
    discountPercentage: 13,
    category: 'Whisky',
    description: 'Destilado japonés de malta - Oferta limitada',
    image: imgWhisky
  }
];

export const FlashDeals: React.FC = () => {
  const { addToCart } = useCart();
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
          // Reset timer when it reaches zero
          return { hours: 11, minutes: 18, seconds: 15 };
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const handleAddToCart = (deal: FlashDeal) => {
    addToCart({
      id: deal.id,
      name: deal.name,
      price: deal.discountPrice,
      category: deal.category,
      description: deal.description,
      image: deal.image
    });
  };

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

        {/* Carousel */}
        <div className="flash-deals-slider">
          <Slider {...settings}>
            {flashDeals.map((deal) => (
              <div key={deal.id} className="px-3">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg p-4 relative"
                >
                  {/* Discount Badge */}
                  <div className="absolute top-2 left-2 z-10 bg-[rgb(255,107,53)] text-white rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-lg">
                    <span className="text-lg font-bold">{deal.discountPercentage}%</span>
                    <span className="text-xs uppercase">OFF</span>
                  </div>

                  {/* Diamond Border Container */}
                  <div className="relative mb-4">
                    <div className="relative w-full aspect-square flex items-center justify-center">
                      {/* Diamond Border */}
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
                      {/* Product Image */}
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
                      <span className="text-sm text-[#717182] line-through">
                        ${deal.originalPrice.toFixed(2)}
                      </span>
                      <span className="text-2xl font-bold text-[#0c3c1f]">
                        ${deal.discountPrice.toFixed(2)}
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
            ))}
          </Slider>
        </div>
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
          .flash-deals-slider .slick-prev {
            left: -25px;
          }

          .flash-deals-slider .slick-next {
            right: -25px;
          }
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