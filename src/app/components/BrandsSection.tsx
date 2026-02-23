import React, { useState } from 'react';
import Slider from 'react-slick';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useCart } from '@/app/context/CartContext';
import { useWishlist } from '@/app/context/WishlistContext';

interface Brand {
  id: number;
  name: string;
  image: string;
  bannerImage: string;
  products: BrandProduct[];
}

interface BrandProduct {
  id: number;
  name: string;
  image: string;
  originalPrice: number;
  price: number;
  installments: number;
  creditPrice: number;
  rating: number;
}

const brands: Brand[] = [
  {
    id: 1,
    name: 'Macallan',
    image: 'https://images.unsplash.com/photo-1717413662498-35bd8638a347?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYWNhbGxhbiUyMHdoaXNreSUyMGJvdHRsZXxlbnwxfHx8fDE3NzAxMzQxMTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    bannerImage: 'https://images.unsplash.com/photo-1717413662498-35bd8638a347?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYWNhbGxhbiUyMHdoaXNreSUyMGJvdHRsZXxlbnwxfHx8fDE3NzAxMzQxMTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    products: [
      {
        id: 1,
        name: 'Whisky Macallan Double Cask 12 Años 750 ml',
        image: 'https://images.unsplash.com/photo-1717413662498-35bd8638a347?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYWNhbGxhbiUyMHdoaXNreSUyMGJvdHRsZXxlbnwxfHx8fDE3NzAxMzQxMTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        originalPrice: 1299.00,
        price: 989.90,
        installments: 3,
        creditPrice: 940.40,
        rating: 4.8
      },
      {
        id: 2,
        name: 'Whisky Macallan Triple Cask 15 Años 750 ml',
        image: 'https://images.unsplash.com/photo-1717413662498-35bd8638a347?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYWNhbGxhbiUyMHdoaXNreSUyMGJvdHRsZXxlbnwxfHx8fDE3NzAxMzQxMTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        originalPrice: 2499.00,
        price: 1899.90,
        installments: 3,
        creditPrice: 1804.90,
        rating: 4.9
      },
      {
        id: 3,
        name: 'Whisky Macallan Sherry Oak 18 Años 750 ml',
        image: 'https://images.unsplash.com/photo-1717413662498-35bd8638a347?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYWNhbGxhbiUyMHdoaXNreSUyMGJvdHRsZXxlbnwxfHx8fDE3NzAxMzQxMTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        originalPrice: 4999.00,
        price: 3799.90,
        installments: 3,
        creditPrice: 3609.90,
        rating: 5.0
      }
    ]
  },
  {
    id: 2,
    name: 'Old Parr',
    image: 'https://images.unsplash.com/photo-1643506657522-4fc374267aae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxPbGQlMjBQYXJyJTIwd2hpc2t5JTIwYm90dGxlfGVufDF8fHx8MTc3MDEzNDExNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    bannerImage: 'https://images.unsplash.com/photo-1643506657522-4fc374267aae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxPbGQlMjBQYXJyJTIwd2hpc2t5JTIwYm90dGxlfGVufDF8fHx8MTc3MDEzNDExNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    products: [
      {
        id: 4,
        name: 'Whisky Old Parr 12 Años 750 ml',
        image: 'https://images.unsplash.com/photo-1643506657522-4fc374267aae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxPbGQlMjBQYXJyJTIwd2hpc2t5JTIwYm90dGxlfGVufDF8fHx8MTc3MDEzNDExNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        originalPrice: 699.00,
        price: 529.90,
        installments: 3,
        creditPrice: 503.40,
        rating: 4.6
      },
      {
        id: 5,
        name: 'Whisky Old Parr 18 Años 750 ml',
        image: 'https://images.unsplash.com/photo-1643506657522-4fc374267aae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxPbGQlMjBQYXJyJTIwd2hpc2t5JTIwYm90dGxlfGVufDF8fHx8MTc3MDEzNDExNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        originalPrice: 1299.00,
        price: 989.90,
        installments: 3,
        creditPrice: 940.40,
        rating: 4.8
      },
      {
        id: 6,
        name: 'Whisky Old Parr Superior 750 ml',
        image: 'https://images.unsplash.com/photo-1643506657522-4fc374267aae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxPbGQlMjBQYXJyJTIwd2hpc2t5JTIwYm90dGxlfGVufDF8fHx8MTc3MDEzNDExNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        originalPrice: 899.00,
        price: 679.90,
        installments: 3,
        creditPrice: 645.90,
        rating: 4.7
      }
    ]
  },
  {
    id: 3,
    name: 'Royal Salute',
    image: 'https://images.unsplash.com/photo-1762528459308-bfc2a959e0da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwd2hpc2t5JTIwYm90dGxlJTIwYmx1ZXxlbnwxfHx8fDE3NzAxMzQxMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    bannerImage: 'https://images.unsplash.com/photo-1762528459308-bfc2a959e0da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwd2hpc2t5JTIwYm90dGxlJTIwYmx1ZXxlbnwxfHx8fDE3NzAxMzQxMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    products: [
      {
        id: 7,
        name: 'Whisky Royal Salute 21 Años Blue 700 ml',
        image: 'https://images.unsplash.com/photo-1762528459308-bfc2a959e0da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwd2hpc2t5JTIwYm90dGxlJTIwYmx1ZXxlbnwxfHx8fDE3NzAxMzQxMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        originalPrice: 2999.00,
        price: 2279.90,
        installments: 3,
        creditPrice: 2165.90,
        rating: 4.9
      },
      {
        id: 8,
        name: 'Whisky Royal Salute 21 Años Red 700 ml',
        image: 'https://images.unsplash.com/photo-1762528459308-bfc2a959e0da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwd2hpc2t5JTIwYm90dGxlJTIwYmx1ZXxlbnwxfHx8fDE3NzAxMzQxMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        originalPrice: 2999.00,
        price: 2279.90,
        installments: 3,
        creditPrice: 2165.90,
        rating: 4.9
      },
      {
        id: 9,
        name: 'Whisky Royal Salute 32 Años 700 ml',
        image: 'https://images.unsplash.com/photo-1762528459308-bfc2a959e0da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwd2hpc2t5JTIwYm90dGxlJTIwYmx1ZXxlbnwxfHx8fDE3NzAxMzQxMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        originalPrice: 8999.00,
        price: 6849.90,
        installments: 3,
        creditPrice: 6507.40,
        rating: 5.0
      }
    ]
  },
  {
    id: 4,
    name: 'Jack Daniels',
    image: 'https://images.unsplash.com/photo-1546728506-b1746d1e5ac9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxKYWNrJTIwRGFuaWVscyUyMGJvdHRsZXxlbnwxfHx8fDE3NzAxMzQxMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    bannerImage: 'https://images.unsplash.com/photo-1546728506-b1746d1e5ac9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxKYWNrJTIwRGFuaWVscyUyMGJvdHRsZXxlbnwxfHx8fDE3NzAxMzQxMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    products: [
      {
        id: 10,
        name: 'Whiskey Jack Daniels Old No. 7 750 ml',
        image: 'https://images.unsplash.com/photo-1546728506-b1746d1e5ac9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxKYWNrJTIwRGFuaWVscyUyMGJvdHRsZXxlbnwxfHx8fDE3NzAxMzQxMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        originalPrice: 599.00,
        price: 449.90,
        installments: 3,
        creditPrice: 427.40,
        rating: 4.7
      },
      {
        id: 11,
        name: 'Whiskey Jack Daniels Honey 750 ml',
        image: 'https://images.unsplash.com/photo-1546728506-b1746d1e5ac9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxKYWNrJTIwRGFuaWVscyUyMGJvdHRsZXxlbnwxfHx8fDE3NzAxMzQxMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        originalPrice: 649.00,
        price: 489.90,
        installments: 3,
        creditPrice: 465.40,
        rating: 4.6
      },
      {
        id: 12,
        name: 'Whiskey Jack Daniels Single Barrel 750 ml',
        image: 'https://images.unsplash.com/photo-1546728506-b1746d1e5ac9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxKYWNrJTIwRGFuaWVscyUyMGJvdHRsZXxlbnwxfHx8fDE3NzAxMzQxMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        originalPrice: 899.00,
        price: 679.90,
        installments: 3,
        creditPrice: 645.90,
        rating: 4.8
      }
    ]
  },
  {
    id: 5,
    name: 'Sazerac',
    image: 'https://images.unsplash.com/photo-1703775763396-ea5dd04673a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2duYWMlMjBib3R0bGUlMjBsdXh1cnl8ZW58MXx8fHwxNzcwMTE2NjQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    bannerImage: 'https://images.unsplash.com/photo-1703775763396-ea5dd04673a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2duYWMlMjBib3R0bGUlMjBsdXh1cnl8ZW58MXx8fHwxNzcwMTE2NjQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    products: [
      {
        id: 13,
        name: 'Cognac Sazerac XO Premium 750 ml',
        image: 'https://images.unsplash.com/photo-1703775763396-ea5dd04673a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2duYWMlMjBib3R0bGUlMjBsdXh1cnl8ZW58MXx8fHwxNzcwMTE2NjQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        originalPrice: 1999.00,
        price: 1519.90,
        installments: 3,
        creditPrice: 1443.90,
        rating: 4.8
      },
      {
        id: 14,
        name: 'Cognac Sazerac VSOP 750 ml',
        image: 'https://images.unsplash.com/photo-1703775763396-ea5dd04673a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2duYWMlMjBib3R0bGUlMjBsdXh1cnl8ZW58MXx8fHwxNzcwMTE2NjQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        originalPrice: 1299.00,
        price: 989.90,
        installments: 3,
        creditPrice: 940.40,
        rating: 4.7
      },
      {
        id: 15,
        name: 'Cognac Sazerac Réserve 750 ml',
        image: 'https://images.unsplash.com/photo-1703775763396-ea5dd04673a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2duYWMlMjBib3R0bGUlMjBsdXh1cnl8ZW58MXx8fHwxNzcwMTE2NjQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        originalPrice: 2499.00,
        price: 1899.90,
        installments: 3,
        creditPrice: 1804.90,
        rating: 4.9
      }
    ]
  }
];

const ProductCarouselCard = ({ product }: { product: BrandProduct }) => {
  const { addToCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const isFavorite = isInWishlist(product.id);

  const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: 'Whisky',
        description: product.name
      });
    }
    setQuantity(1);
  };

  return (
    <div className="px-1 sm:px-2">
      <div className="bg-white rounded-lg border border-gray-200 p-2 sm:p-4 h-full">
        {/* Discount Badge & Favorite */}
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <div className="bg-[#FF6B35] text-white rounded-full w-9 h-9 sm:w-12 sm:h-12 flex flex-col items-center justify-center shadow-md">
            <span className="text-[9px] sm:text-xs font-bold leading-none">-{discountPercentage}%</span>
            <span className="text-[7px] sm:text-[9px] uppercase leading-none mt-0.5">OFF</span>
          </div>
          <button
            onClick={() => toggleItem({ id: product.id, name: product.name, price: product.price, originalPrice: product.originalPrice, image: product.image })}
            className="w-6 h-6 sm:w-7 sm:h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          >
            <Heart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </button>
        </div>

        {/* Product Image */}
        <div className="aspect-square mb-2 sm:mb-3 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-1 sm:mb-2">
          <span className="text-yellow-400 text-xs sm:text-sm">★</span>
          <span className="text-[10px] sm:text-xs font-medium text-[#212121]">{product.rating}</span>
        </div>

        {/* Product Name */}
        <h4 className="text-[#0c3c1f] text-[10px] sm:text-xs font-medium mb-1 sm:mb-2 line-clamp-2 min-h-[24px] sm:min-h-[32px]">
          {product.name}
        </h4>

        {/* Pricing */}
        <div className="mb-2 sm:mb-3">
          <p className="text-[9px] sm:text-[10px] text-[#717182] line-through mb-0.5">
            De: ${product.originalPrice.toFixed(2)}
          </p>
          <div className="flex items-baseline gap-0.5 sm:gap-1 mb-1 flex-wrap">
            <span className="text-[9px] sm:text-[10px] text-[#212121]">por:</span>
            <span className="text-sm sm:text-lg font-bold text-[#0c3c1f]">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Quantity & Buy - Desktop */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-7 h-7 flex items-center justify-center border border-[#0c3c1f] text-[#0c3c1f] rounded hover:bg-[#0c3c1f] hover:text-white transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-10 h-7 text-center border border-gray-300 rounded text-[#212121] text-xs font-medium"
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-7 h-7 flex items-center justify-center border border-[#0c3c1f] text-[#0c3c1f] rounded hover:bg-[#0c3c1f] hover:text-white transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-[#0c3c1f] text-white py-1.5 px-3 rounded hover:bg-[#0a3019] transition-colors text-xs font-semibold uppercase"
          >
            Comprar
          </button>
        </div>

        {/* Buy Button - Mobile */}
        <button
          onClick={handleAddToCart}
          className="sm:hidden w-full bg-[#0c3c1f] text-white py-1.5 px-2 rounded hover:bg-[#0a3019] transition-colors text-[10px] font-semibold uppercase"
        >
          Comprar
        </button>
      </div>
    </div>
  );
};

const CustomArrow = ({ onClick, direction }: { onClick?: () => void; direction: 'prev' | 'next' }) => (
  <button
    onClick={onClick}
    className={`absolute top-1/2 -translate-y-1/2 ${direction === 'prev' ? '-left-4' : '-right-4'} z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200`}
  >
    {direction === 'prev' ? (
      <ChevronLeft className="w-5 h-5 text-[#0c3c1f]" />
    ) : (
      <ChevronRight className="w-5 h-5 text-[#0c3c1f]" />
    )}
  </button>
);

export const BrandsSection = () => {
  const [selectedBrand, setSelectedBrand] = useState<Brand>(brands[0]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: <CustomArrow direction="prev" />,
    nextArrow: <CustomArrow direction="next" />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } }
    ],
    customPaging: () => (
      <div className="w-2 h-2 bg-gray-300 rounded-full hover:bg-[#0c3c1f] transition-colors mt-4" />
    ),
    dotsClass: 'slick-dots !flex !items-center !justify-center !gap-2'
  };

  return (
    <section className="bg-gray-50 py-8 md:py-12 overflow-hidden">
      <div className="container mx-auto px-3 sm:px-4 max-w-[100vw]">
        {/* Section Title */}
        <h2 className="text-[#212121] mb-6 sm:mb-8 text-lg sm:text-2xl">Grandes Marcas</h2>

        {/* Brand Category Buttons - scroll horizontal en móvil */}
        <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap brands-scroll">
          {brands.map((brand) => (
            <motion.button
              key={brand.id}
              onClick={() => setSelectedBrand(brand)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all shrink-0 ${
                selectedBrand.id === brand.id ? 'ring-2 ring-[#0c3c1f] ring-offset-2' : ''
              }`}
            >
              <div className="relative w-28 h-16 sm:w-40 sm:h-24">
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

        {/* Banner & Product Carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedBrand.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Banner - en móvil compacto arriba */}
            <div className="mb-4 md:hidden">
              <div className="bg-gradient-to-r from-[#FDB93A] to-[#FF8A00] rounded-lg overflow-hidden h-40 relative shadow-lg">
                <div className="absolute inset-0 flex items-center justify-between p-4">
                  <div>
                    <h3 className="text-white text-xl font-bold mb-1">
                      {selectedBrand.name.toUpperCase()}
                    </h3>
                    <p className="text-black text-xs font-semibold">
                      Un Brindis para cada<br />CELEBRACIÓN
                    </p>
                  </div>
                  <img
                    src={selectedBrand.bannerImage}
                    alt={selectedBrand.name}
                    className="h-32 object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>

            {/* Mobile: scroll horizontal con 2 productos visibles */}
            <div className="md:hidden">
              <div className="brands-product-scroll flex gap-2 overflow-x-auto pb-4 -mx-3 px-3 snap-x snap-mandatory">
                {selectedBrand.products.map((product) => (
                  <div
                    key={product.id}
                    className="shrink-0 snap-start"
                    style={{ width: 'calc((100% - 8px) / 2)' }}
                  >
                    <ProductCarouselCard product={product} />
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: banner lateral + carrusel */}
            <div className="hidden md:grid grid-cols-12 gap-6">
              <div className="col-span-3">
                <div className="bg-gradient-to-br from-[#FDB93A] to-[#FF8A00] rounded-lg overflow-hidden h-full min-h-[400px] relative shadow-lg">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <h3 className="text-white text-3xl font-bold mb-2">
                      {selectedBrand.name.toUpperCase()}
                    </h3>
                    <p className="text-black text-lg font-semibold mb-4">
                      Un Brindis para cada<br />CELEBRACIÓN
                    </p>
                    <div className="mt-auto">
                      <img
                        src={selectedBrand.bannerImage}
                        alt={selectedBrand.name}
                        className="w-full max-w-[200px] object-contain drop-shadow-2xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-9">
                <div className="relative px-8">
                  <Slider {...sliderSettings}>
                    {selectedBrand.products.map((product) => (
                      <ProductCarouselCard key={product.id} product={product} />
                    ))}
                  </Slider>
                </div>
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
