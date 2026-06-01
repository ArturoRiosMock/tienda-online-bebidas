import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, Star, Minus, Plus, Lock } from 'lucide-react';
import { Product, useCart } from '@/app/context/CartContext';
import { useWishlist } from '@/app/context/WishlistContext';
import { useAuth } from '@/app/context/AuthContext';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const isFavorite = isInWishlist(product.id);

  // Descuento real: solo cuando el producto trae un compareAtPrice mayor al precio actual.
  const hasDiscount =
    typeof product.originalPrice === 'number' && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

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
      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        className="absolute top-1 right-1 sm:top-2 sm:right-2 z-10 w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
      >
        <Heart
          className={`w-3 h-3 sm:w-4 sm:h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
        />
      </button>

      {/* Product Image */}
      <div className="relative">
        <div className="aspect-square overflow-hidden bg-gray-50 group p-1 sm:p-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="p-2 sm:p-4">
        {/* Rating */}
        <div className="flex items-center gap-0.5 sm:gap-1 mb-0.5 sm:mb-2">
          <Star className="w-2.5 h-2.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-[10px] sm:text-sm font-medium text-[#212121]">
            {(4.5 + Math.random() * 0.5).toFixed(1)}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="text-[#0055a2] text-[11px] leading-tight sm:text-sm font-medium mb-1 sm:mb-3 line-clamp-2 min-h-[26px] sm:min-h-[40px]">
          {product.name}
        </h3>

        {isAuthenticated ? (
          <>
            {/* Pricing */}
            <div className="mb-2 sm:mb-3">
              {hasDiscount && (
                <p className="text-[10px] sm:text-xs text-[#717182] line-through mb-0.5 sm:mb-1">
                  De: ${product.originalPrice!.toFixed(2)}
                </p>
              )}
              <div className="flex items-baseline gap-0.5 sm:gap-1 mb-1 sm:mb-2 flex-wrap">
                <span className="text-[10px] sm:text-xs text-[#212121]">
                  {hasDiscount ? 'por:' : 'Precio:'}
                </span>
                <span className="text-base sm:text-2xl font-bold text-[#0055a2]">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Quantity label */}
            <p className="text-[10px] sm:text-xs text-[#212121] mb-1">
              Cantidad: <span className="font-semibold">{product.packLabel ?? '1 Botella'}</span>
            </p>

            {/* Quantity Controls - Desktop */}
            <div className="hidden sm:flex items-center gap-2 mb-3">
              <button
                onClick={decrementQuantity}
                aria-label="Disminuir cantidad"
                className="w-8 h-8 flex items-center justify-center border border-[#0055a2] text-[#0055a2] rounded hover:bg-[#0055a2] hover:text-white transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityInputChange}
                onClick={handleQuantityInputClick}
                aria-label="Cantidad"
                className="w-12 h-8 text-center border border-gray-300 rounded text-[#212121] font-medium"
              />
              <button
                onClick={incrementQuantity}
                aria-label="Aumentar cantidad"
                className="w-8 h-8 flex items-center justify-center border border-[#0055a2] text-[#0055a2] rounded hover:bg-[#0055a2] hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
              <motion.button
                onClick={handleAddToCart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-[#0055a2] text-white py-2 px-4 rounded hover:bg-[#004488] transition-colors text-sm font-semibold uppercase"
              >
                Comprar
              </motion.button>
            </div>

            {/* Quantity Controls + Buy - Mobile */}
            <div className="sm:hidden flex items-center gap-1.5 mb-1.5">
              <button
                onClick={decrementQuantity}
                aria-label="Disminuir cantidad"
                className="w-7 h-7 shrink-0 flex items-center justify-center border border-[#0055a2] text-[#0055a2] rounded"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityInputChange}
                onClick={handleQuantityInputClick}
                aria-label="Cantidad"
                className="w-9 h-7 text-center border border-gray-300 rounded text-[#212121] font-medium text-xs"
              />
              <button
                onClick={incrementQuantity}
                aria-label="Aumentar cantidad"
                className="w-7 h-7 shrink-0 flex items-center justify-center border border-[#0055a2] text-[#0055a2] rounded"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <motion.button
                onClick={handleAddToCart}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-[#0055a2] text-white py-1.5 px-2 rounded hover:bg-[#004488] transition-colors text-[11px] font-semibold uppercase"
              >
                Comprar
              </motion.button>
            </div>
          </>
        ) : (
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-start gap-1.5 sm:gap-2 bg-gray-50 border border-gray-200 rounded p-1.5 sm:p-2.5">
              <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-[#0055a2] shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-[9px] sm:text-xs font-semibold text-[#212121] leading-tight">
                  Precio exclusivo para miembros
                </p>
                <p className="text-[8px] sm:text-[10px] text-[#717182] leading-tight mt-0.5 hidden sm:block">
                  Inicia sesión para ver el precio y comprar
                </p>
              </div>
            </div>
            <motion.button
              onClick={(e) => { e.stopPropagation(); navigate('/login'); }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-[#0055a2] text-white py-1.5 sm:py-2 px-2 rounded hover:bg-[#004488] transition-colors text-[9px] sm:text-xs font-semibold flex items-center justify-center gap-1 sm:gap-1.5"
            >
              <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
              Iniciar sesión para comprar
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};