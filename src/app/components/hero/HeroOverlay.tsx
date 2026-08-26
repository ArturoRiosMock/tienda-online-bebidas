import { motion } from 'motion/react';
import type { HeroSlide } from '@/types/homeContent';
import { HeroCta } from '@/app/components/hero/HeroCta';
import { horizontalClass, verticalClass } from '@/app/components/hero/heroPosition';

interface HeroOverlayProps {
  slide: HeroSlide;
  showText: boolean;
  onShopNowClick: () => void;
}

export function HeroOverlay({ slide, showText, onShopNowClick }: HeroOverlayProps) {
  return (
    <div className={`absolute inset-0 flex ${verticalClass(slide.buttonPosition)}`}>
      <div
        className={`container mx-auto flex px-4 md:px-8 lg:px-16 ${horizontalClass(slide.buttonPosition)}`}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-2xl"
        >
          {showText && slide.badge && (
            <div className="inline-block mb-4 bg-[#0c3c1f] text-white px-4 py-2 rounded-full text-sm font-bold">
              {slide.badge}
            </div>
          )}

          {showText && slide.title && (
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {slide.title}
            </h1>
          )}

          {showText && slide.subtitle && (
            <p className="text-white/90 text-lg md:text-xl mb-8 max-w-lg">{slide.subtitle}</p>
          )}

          {slide.buttonText && (
            <HeroCta
              buttonText={slide.buttonText}
              buttonHref={slide.buttonHref}
              buttonColor={slide.buttonColor}
              onShopNowClick={onShopNowClick}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
