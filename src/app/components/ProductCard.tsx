import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Star, Minus, Plus } from 'lucide-react';
import { Product, useCart } from '@/app/context/CartContext';
import { useWishlist } from '@/app/context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const isFavorite = isInWishlist(product.id);

  // Calculate discount and pricing
  const originalPrice = product.price * 1.35; // 35% markup to show discount
  const discountPercentage = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, quantity);
    setQuantity(1);
  };

  const incrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      handle: product.handle,
      variantId: product.variantId,
    });
  };

  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setQuantity(Math.max(1, parseInt(e.target.value) || 1));
  };

  const handleQuantityInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 relative cursor-pointer"
    >
      {/* Discount Badge */}
      <div className="absolute top-2 left-2 z-10 bg-[#FF6B35] text-white rounded-full w-10 h-10 sm:w-14 sm:h-14 flex flex-col items-center justify-center shadow-lg">
        <span className="text-[10px] sm:text-sm font-bold leading-none">-{discountPercentage}%</span>
        <span className="text-[7px] sm:text-[10px] uppercase leading-none mt-0.5">OFF</span>
      </div>

      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
      >
        <Heart
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
        />
      </button>

      {/* Product Image */}
      <div className="aspect-square overflow-hidden bg-gray-50 relative group p-2 sm:p-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Product Info */}
      <div className="p-2 sm:p-4">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-1 sm:mb-2">
          <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-xs sm:text-sm font-medium text-[#212121]">
            {(4.5 + Math.random() * 0.5).toFixed(1)}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="text-[#0c3c1f] text-xs sm:text-sm font-medium mb-1.5 sm:mb-3 line-clamp-2 min-h-[28px] sm:min-h-[40px]">
          {product.name}
        </h3>

        {/* Pricing */}
        <div className="mb-2 sm:mb-3">
          <p className="text-[10px] sm:text-xs text-[#717182] line-through mb-0.5 sm:mb-1">
            De: ${originalPrice.toFixed(2)}
          </p>
          <div className="flex items-baseline gap-0.5 sm:gap-1 mb-1 sm:mb-2 flex-wrap">
            <span className="text-[10px] sm:text-xs text-[#212121]">por:</span>
            <span className="text-base sm:text-2xl font-bold text-[#0c3c1f]">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Quantity Controls - Desktop */}
        <div className="hidden sm:flex items-center gap-2 mb-3">
          <button
            onClick={decrementQuantity}
            className="w-8 h-8 flex items-center justify-center border border-[#0c3c1f] text-[#0c3c1f] rounded hover:bg-[#0c3c1f] hover:text-white transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityInputChange}
            onClick={handleQuantityInputClick}
            className="w-12 h-8 text-center border border-gray-300 rounded text-[#212121] font-medium"
          />
          <button
            onClick={incrementQuantity}
            className="w-8 h-8 flex items-center justify-center border border-[#0c3c1f] text-[#0c3c1f] rounded hover:bg-[#0c3c1f] hover:text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          <motion.button
            onClick={handleAddToCart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-[#0c3c1f] text-white py-2 px-4 rounded hover:bg-[#0a3019] transition-colors text-sm font-semibold uppercase"
          >
            Comprar
          </motion.button>
        </div>

        {/* Buy Button - Mobile */}
        <motion.button
          onClick={handleAddToCart}
          whileTap={{ scale: 0.95 }}
          className="sm:hidden w-full bg-[#0c3c1f] text-white py-1.5 px-2 rounded hover:bg-[#0a3019] transition-colors text-[11px] font-semibold uppercase"
        >
          Comprar
        </motion.button>
      </div>
    </motion.div>
  );
};