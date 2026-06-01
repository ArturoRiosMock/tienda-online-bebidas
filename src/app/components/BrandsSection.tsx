import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ProductCard } from '@/app/components/ProductCard';
import { useShopifyProducts } from '@/shopify/hooks/useShopifyProducts';
import type { Product } from '@/app/context/CartContext';
import casaBacardiImg from '@/assets/casa-bacardi.png';
import casaDelAguaImg from '@/assets/casa-del-agua.png';
import condesaGinImg from '@/assets/condesa-gin.png';
import felixImg from '@/assets/felix.png';
import laMadrilenaImg from '@/assets/la-madrilena.png';

const PRODUCTS_LIMIT = 12;

interface BrandConfig {
  id: number;
  name: string;
  handle: string;
  image: string;
  bannerImage: string;
}

const BRANDS: BrandConfig[] = [
  {
    id: 1,
    name: 'La Madrileña',
    handle: 'la-madrilena',
    image: laMadrilenaImg,
    bannerImage: laMadrilenaImg,
  },
  {
    id: 2,
    name: 'Félix',
    handle: 'felix',
    image: felixImg,
    bannerImage: felixImg,
  },
  {
    id: 3,
    name: 'Condesa Gin',
    handle: 'condesa-gin',
    image: condesaGinImg,
    bannerImage: condesaGinImg,
  },
  {
    id: 4,
    name: 'Casa del Agua',
    handle: 'casa-del-agua',
    image: casaDelAguaImg,
    bannerImage: casaDelAguaImg,
  },
  {
    id: 5,
    name: 'Casa Bacardi',
    handle: 'casa-bacardi',
    image: casaBacardiImg,
    bannerImage: casaBacardiImg,
  },
];

const CustomArrow = ({ onClick, direction }: { onClick?: () => void; direction: 'prev' | 'next' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`absolute top-1/2 -translate-y-1/2 ${direction === 'prev' ? '-left-4' : '-right-4'} z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200`}
  >
    {direction === 'prev' ? (
      <ChevronLeft className="w-5 h-5 text-[#0055a2]" />
    ) : (
      <ChevronRight className="w-5 h-5 text-[#0055a2]" />
    )}
  </button>
);

const BrandBanner = ({ brand }: { brand: BrandConfig }) => (
  <Link
    to={`/categorias/${brand.handle}`}
    className="block relative rounded-lg overflow-hidden h-full min-h-[160px] md:min-h-[400px] shadow-lg group"
  >
    <img
      src={brand.bannerImage}
      alt={brand.name}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
    <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 text-white">
      <h3 className="text-xl md:text-2xl font-bold mb-0.5 md:mb-1 drop-shadow">{brand.name}</h3>
      <span className="inline-flex items-center gap-1 text-xs md:text-sm opacity-90 group-hover:opacity-100 transition-opacity">
        Ver colección →
      </span>
    </div>
  </Link>
);

const BrandProducts = ({
  products,
  loading,
  error,
  onProductClick,
}: {
  products: Product[];
  loading: boolean;
  error: string | null;
  onProductClick: (product: Product) => void;
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-[#717182] text-sm">
        Cargando productos…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16 text-red-600 text-sm">
        No se pudieron cargar los productos de esta marca.
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-[#717182] text-sm">
        No hay productos disponibles en esta colección.
      </div>
    );
  }

  const sliderSettings = {
    dots: true,
    infinite: products.length > 3,
    speed: 500,
    slidesToShow: Math.min(3, products.length),
    slidesToScroll: 1,
    prevArrow: <CustomArrow direction="prev" />,
    nextArrow: <CustomArrow direction="next" />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: Math.min(3, products.length), slidesToScroll: 1 } },
      { breakpoint: 1024, settings: { slidesToShow: Math.min(2, products.length), slidesToScroll: 1 } },
    ],
    customPaging: () => (
      <div className="w-2 h-2 bg-gray-300 rounded-full hover:bg-[#0055a2] transition-colors mt-4" />
    ),
    dotsClass: 'slick-dots !flex !items-center !justify-center !gap-2',
  };

  return (
    <>
      <div className="md:hidden">
        <div className="brands-product-scroll flex gap-2 overflow-x-auto pb-4 -mx-3 px-3 snap-x snap-mandatory">
          {products.map((product) => (
            <div
              key={product.id}
              className="shrink-0 snap-start w-[calc((100%-8px)/2)] min-w-[140px]"
            >
              <ProductCard product={product} onClick={() => onProductClick(product)} />
            </div>
          ))}
        </div>
      </div>

      <div className="hidden md:block relative px-8">
        <Slider {...sliderSettings}>
          {products.map((product) => (
            <div key={product.id} className="px-1 sm:px-2">
              <ProductCard product={product} onClick={() => onProductClick(product)} />
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export const BrandsSection = () => {
  const navigate = useNavigate();
  const [selectedBrand, setSelectedBrand] = useState<BrandConfig>(BRANDS[0]);
  const { products, loading, error } = useShopifyProducts(selectedBrand.handle);
  const brandProducts = products.slice(0, PRODUCTS_LIMIT);

  const handleProductClick = (product: Product) => {
    if (product.handle) {
      navigate(`/producto/${product.handle}`);
    }
  };

  return (
    <section className="bg-gray-50 py-8 md:py-12 overflow-hidden">
      <div className="container mx-auto px-3 sm:px-4 max-w-[100vw]">
        <h2 className="text-[#212121] mb-6 sm:mb-8 text-lg sm:text-2xl">Grandes Marcas</h2>

        <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 overflow-x-auto py-2 -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap brands-scroll">
          {BRANDS.map((brand) => (
            <motion.button
              key={brand.id}
              type="button"
              onClick={() => setSelectedBrand(brand)}
              whileTap={{ scale: 0.98 }}
              className={`relative rounded-lg shrink-0 transition-shadow ${
                selectedBrand.id === brand.id
                  ? 'ring-2 ring-[#0055a2] shadow-lg'
                  : 'ring-2 ring-transparent shadow-md hover:shadow-lg'
              }`}
            >
              <div className="relative w-28 h-16 sm:w-40 sm:h-24 rounded-lg overflow-hidden">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-1.5 sm:pb-2">
                  <span className="text-white text-xs sm:text-sm font-semibold">{brand.name}</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedBrand.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4 md:hidden">
              <BrandBanner brand={selectedBrand} />
            </div>

            <div className="md:grid md:grid-cols-12 md:gap-6">
              <div className="hidden md:block md:col-span-3">
                <BrandBanner brand={selectedBrand} />
              </div>
              <div className="md:col-span-9">
                <BrandProducts
                  products={brandProducts}
                  loading={loading}
                  error={error}
                  onProductClick={handleProductClick}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`
        .brands-scroll::-webkit-scrollbar,
        .brands-product-scroll::-webkit-scrollbar { display: none; }
        .brands-scroll,
        .brands-product-scroll { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
    </section>
  );
};
