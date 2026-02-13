import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Star, Minus, Plus } from 'lucide-react';
import { Product, useCart } from '@/app/context/CartContext';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Calculate discount and pricing
  const originalPrice = product.price * 1.35; // 35% markup to show discount
  const discountPercentage = Math.round(((originalPrice - product.price) / originalPrice) * 100);
  const installmentPrice = product.price / 3;
  const creditPrice = product.price * 0.95; // 5% discount for credit

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onClick
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
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
    setIsFavorite(!isFavorite);
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
      <div className="absolute top-3 left-3 z-10 bg-[#FF6B35] text-white rounded-full w-14 h-14 flex flex-col items-center justify-center shadow-lg">
        <span className="text-sm font-bold leading-none">-{discountPercentage}%</span>
        <span className="text-[10px] uppercase leading-none mt-0.5">OFF</span>
      </div>

      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
      >
        <Heart
          className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
        />
      </button>

      {/* Product Image */}
      <div className="aspect-square overflow-hidden bg-gray-50 relative group p-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-[#212121]">
            {(4.5 + Math.random() * 0.5).toFixed(1)}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="text-[#0c3c1f] text-sm font-medium mb-3 line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>

        {/* Pricing */}
        <div className="mb-3">
          <p className="text-xs text-[#717182] line-through mb-1">
            De: ${originalPrice.toFixed(2)} MXN
          </p>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-xs text-[#212121]">por:</span>
            <span className="text-2xl font-bold text-[#0c3c1f]">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-xs text-[#717182]">MXN</span>
          </div>
          <p className="text-xs text-[#212121] mb-1">
            <span className="inline-flex items-center gap-1">
              <span className="text-[#0c3c1f]">📦</span>
              3x de <span className="font-semibold">${installmentPrice.toFixed(2)} MXN</span>
            </span>
          </p>
          <p className="text-xs text-[#717182]">
            ${creditPrice.toFixed(2)} MXN con crédito
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mb-3">
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

          {/* Buy Button */}
          <motion.button
            onClick={handleAddToCart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-[#0c3c1f] text-white py-2 px-4 rounded hover:bg-[#0a3019] transition-colors text-sm font-semibold uppercase"
          >
            Comprar
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};