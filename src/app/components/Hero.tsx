import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeroProps {
  onShopNowClick: () => void;
}

interface Slide {
  id: number;
  image: string;
  bgColor: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  buttonText: string;
  buttonAction?: () => void;
}

export const Hero = ({ onShopNowClick }: HeroProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const navigate = useNavigate();

  const slides: Slide[] = [
    {
      id: 1,
      image: '/hero-barra-boda-2.png',
      bgColor: '#f5f0e8',
      buttonText: 'COTIZA AHORA',
      buttonAction: () => navigate('/cotizar-evento')
    },
    {
      id: 2,
      image: '/hero-barra-mixologia.png',
      bgColor: '#3a4a35',
      buttonText: 'COTIZA AHORA',
      buttonAction: () => navigate('/cotizar-evento')
    },
    {
      id: 3,
      image: '/hero-eventos-sociales.png',
      bgColor: '#f5f0e8',
      buttonText: 'COTIZA AHORA',
      buttonAction: () => navigate('/cotizar-evento')
    },
    {
      id: 4,
      image: '/hero-super-promo.png',
      bgColor: '#8B5E1A',
      buttonText: 'COMPRE AHORA',
      buttonAction: onShopNowClick
    },
    {
      id: 5,
      image: '/hero-best-sellers.png',
      bgColor: '#4a5240',
      title: 'Best Sellers',
      subtitle: 'Bacardi, Modelo Especial, Dobel Cristalino y más — los favoritos de Mr. Brown',
      badge: 'LO MÁS VENDIDO',
      buttonText: 'COMPRE AHORA',
      buttonAction: onShopNowClick
    }
  ];

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 8000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  const handleNext = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0
    })
  };

  return (
    <section className="relative overflow-hidden">
      {/* Carousel Container */}
      <div className="relative h-[220px] md:h-[320px] lg:h-[420px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "tween", duration: 0.8, ease: "easeInOut" },
              opacity: { duration: 0.6 }
            }}
            className="absolute inset-0"
            style={{ backgroundColor: slides[currentSlide].bgColor }}
          >
            {/* Slide Background Image */}
            <div className="relative w-full h-full">
              <img
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title ?? 'Mr. Brown Banner'}
                className="w-full h-full object-contain"
              />

              {/* Overlay solo para slides con texto superpuesto */}
              {(slides[currentSlide].title || slides[currentSlide].badge) && (
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
              )}

              {/* Content Overlay */}
              <div className="absolute inset-0 flex items-end pb-8">
                <div className="container mx-auto px-4 md:px-8 lg:px-16">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="max-w-2xl"
                  >
                    {/* Badge */}
                    {slides[currentSlide].badge && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="inline-block mb-4"
                      >
                        <div className="bg-[#0c3c1f] text-white px-4 py-2 rounded-full text-sm font-bold">
                          {slides[currentSlide].badge}
                        </div>
                      </motion.div>
                    )}

                    {/* Title */}
                    {slides[currentSlide].title && (
                      <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
                      >
                        {slides[currentSlide].title}
                      </motion.h1>
                    )}

                    {/* Subtitle */}
                    {slides[currentSlide].subtitle && (
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-white/90 text-lg md:text-xl mb-8 max-w-lg"
                      >
                        {slides[currentSlide].subtitle}
                      </motion.p>
                    )}

                    {/* CTA Button */}
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      onClick={slides[currentSlide].buttonAction}
                      className="bg-[#0c3c1f] text-white px-8 py-3 rounded-lg hover:bg-[#0a3019] transition-colors font-bold text-sm flex items-center gap-2 group"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {slides[currentSlide].buttonText}
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#212121] p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#212121] p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all ${
                index === currentSlide
                  ? 'w-8 h-3 bg-white rounded-full'
                  : 'w-3 h-3 bg-white/50 rounded-full hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};