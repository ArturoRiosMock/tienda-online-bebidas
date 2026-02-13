import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';

interface HeroProps {
  onShopNowClick: () => void;
}

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  badge?: string;
  buttonText: string;
  buttonAction?: () => void;
}

export const Hero = ({ onShopNowClick }: HeroProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const slides: Slide[] = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1746422029293-43065303dab5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGlza3klMjBib3R0bGVzJTIwcHJlbWl1bSUyMGNvbGxlY3Rpb258ZW58MXx8fHwxNzcwMTM1OTYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: 'Whisky Premium',
      subtitle: 'Colección exclusiva de whiskies premium de las mejores marcas del mundo',
      badge: '5% OFF',
      buttonText: 'COMPRE AHORA',
      buttonAction: onShopNowClick
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1737029114889-8f5edb15b8be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2RrYSUyMGFic29sdXQlMjBib3R0bGUlMjBwcmVtaXVtfGVufDF8fHx8MTc3MDEzNTk2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: 'Vodka Absolut',
      subtitle: 'Marcas icónicas para momentos especiales',
      badge: 'ROYAL COLLECTION',
      buttonText: 'COMPRE AHORA',
      buttonAction: onShopNowClick
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1672361720452-02fd251c69dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFtcGFnbmUlMjBib3R0bGUlMjBjZWxlYnJhdGlvbiUyMGx1eHVyeXxlbnwxfHx8fDE3NzAxMzU5NjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: 'Champagne & Espumantes',
      subtitle: 'Celebra cada momento con las mejores burbujas',
      badge: 'NUEVO',
      buttonText: 'COMPRE AHORA',
      buttonAction: onShopNowClick
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1769697064243-889f2e25d44a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5lJTIwYm90dGxlcyUyMGVsZWdhbnQlMjBkaXNwbGF5fGVufDF8fHx8MTc3MDEzNTk2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: 'Vinos Selectos',
      subtitle: 'Los mejores vinos tintos, blancos y rosados',
      buttonText: 'COMPRE AHORA',
      buttonAction: onShopNowClick
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1682618901459-54ae8c166d16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaW4lMjB0b25pYyUyMGJvdHRsZSUyMGJhcnxlbnwxfHx8fDE3NzAxMzU5NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: 'Gin Premium',
      subtitle: 'Descubre nuestra colección de gins artesanales',
      badge: 'PREMIUM',
      buttonText: 'COMPRE AHORA',
      buttonAction: onShopNowClick
    }
  ];

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);

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
    <section className="relative bg-gray-100 overflow-hidden">
      {/* Carousel Container */}
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0"
          >
            {/* Slide Background Image */}
            <div className="relative w-full h-full">
              <img
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

              {/* Content Overlay */}
              <div className="absolute inset-0 flex items-center">
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
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
                    >
                      {slides[currentSlide].title}
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-white/90 text-lg md:text-xl mb-8 max-w-lg"
                    >
                      {slides[currentSlide].subtitle}
                    </motion.p>

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