import React from 'react';
import Slider, { Settings } from 'react-slick';
import { ProductCard } from '@/app/components/ProductCard';
import type { Product } from '@/app/context/CartContext';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface ProductsCarouselProps {
  title: string;
  products: Product[];
  onProductClick?: (product: Product) => void;
  className?: string;
}

const SLIDER_SETTINGS: Settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  arrows: true,
  responsive: [
    { breakpoint: 1280, settings: { slidesToShow: 3, slidesToScroll: 1 } },
    { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
    { breakpoint: 640, settings: { slidesToShow: 1.5, slidesToScroll: 1, arrows: false } },
  ],
};

export const ProductsCarousel: React.FC<ProductsCarouselProps> = ({
  title,
  products,
  onProductClick,
  className = '',
}) => {
  if (products.length === 0) return null;

  return (
    <section className={`container mx-auto px-3 sm:px-4 py-8 sm:py-10 max-w-[100vw] ${className}`}>
      <div className="flex items-end justify-between mb-4 sm:mb-6 gap-2">
        <h2 className="text-[#212121]">{title}</h2>
        <p className="text-[#717182] text-sm shrink-0">{products.length} productos</p>
      </div>

      <div className="products-carousel">
        <Slider {...SLIDER_SETTINGS}>
          {products.map((product) => (
            <div key={product.id} className="px-2 sm:px-3 py-2">
              <ProductCard
                product={product}
                onClick={onProductClick ? () => onProductClick(product) : undefined}
              />
            </div>
          ))}
        </Slider>
      </div>

      <style>{`
        .products-carousel .slick-list { margin: 0 -8px; }
        .products-carousel .slick-dots { bottom: -32px; }
        .products-carousel .slick-dots li button:before { color: #0055a2; font-size: 8px; opacity: 0.4; }
        .products-carousel .slick-dots li.slick-active button:before { color: #0055a2; opacity: 1; }
        .products-carousel .slick-prev,
        .products-carousel .slick-next { width: 40px; height: 40px; z-index: 10; }
        .products-carousel .slick-prev { left: -45px; }
        .products-carousel .slick-next { right: -45px; }
        .products-carousel .slick-prev:before,
        .products-carousel .slick-next:before { color: #0055a2; font-size: 40px; opacity: 1; }
        @media (max-width: 1024px) {
          .products-carousel .slick-prev { left: -20px; }
          .products-carousel .slick-next { right: -20px; }
        }
      `}</style>
    </section>
  );
};
