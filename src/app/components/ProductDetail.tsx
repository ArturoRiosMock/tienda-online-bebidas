import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Share2, Heart, ShoppingCart, Star, Minus, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import Slider from 'react-slick';
import { useCart } from '@/app/context/CartContext';
import { FlashDeals } from '@/app/components/FlashDeals';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import type { Product } from '@/shopify/types';

interface ProductDetailProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onProductClick: (product: Product) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, allProducts, onBack, onProductClick }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const images = product.image ? [product.image] : [];
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;
  const installmentPrice = (product.price / 3).toFixed(2);

  const similarProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 8);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category,
        description: product.description,
        image: product.image,
        variantId: product.variantId,
        shopifyId: product.shopifyId,
        handle: product.handle,
      },
      quantity
    );
  };

  const handleShare = () => {
    const url = window.location.href;
    const text = `${product.name} - Solo $${product.price.toFixed(2)} MXN`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
  };

  const handleSimilarProductClick = (p: Product) => {
    setQuantity(1);
    setSelectedImage(0);
    onProductClick(p);
    window.scrollTo(0, 0);
  };

  const sliderSettings = {
    dots: true,
    infinite: similarProducts.length > 4,
    speed: 500,
    slidesToShow: Math.min(4, similarProducts.length),
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: Math.min(3, similarProducts.length) }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: Math.min(2, similarProducts.length) }
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-[#717182]">
            <Link to="/" className="hover:text-[#0c3c1f] transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#0c3c1f]">{product.category || 'Producto'}</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#717182] truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Sección Principal del Producto */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-lg p-6 shadow-sm">
          {/* Columna Izquierda - Imágenes */}
          <div className="relative">
            {discountPercentage > 0 && (
              <div className="absolute top-4 left-4 z-10 bg-purple-600 text-white rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-lg">
                <span className="text-lg font-bold">-{discountPercentage}%</span>
                <span className="text-xs uppercase">OFF</span>
              </div>
            )}

            {/* Imagen principal */}
            <div className="flex items-center justify-center bg-gray-50 rounded-lg p-8 mb-4 min-h-[400px]">
              {images.length > 0 ? (
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="max-h-[400px] object-contain"
                />
              ) : (
                <div className="w-full h-[400px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                  Sin imagen
                </div>
              )}
            </div>

            {/* Miniaturas */}
            {images.length > 1 && (
              <div className="flex gap-2 justify-center">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`border-2 rounded-lg p-2 w-20 h-20 flex items-center justify-center ${
                      selectedImage === idx ? 'border-[#0c3c1f]' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt={`Vista ${idx + 1}`} className="max-h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Columna Derecha - Información */}
          <div className="space-y-4">
            {/* Título y Categoría */}
            <div>
              <h1 className="text-[#0c3c1f] text-2xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 text-sm text-[#717182]">
                {product.category && (
                  <span>Categoría: <span className="text-[#0c3c1f] font-medium">{product.category}</span></span>
                )}
              </div>
            </div>

            {/* Rating y Acciones */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-[rgb(12,60,31)] text-white hover:bg-green-600 transition-colors flex items-center gap-1"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-xs">Compartir</span>
                </button>
                <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-50">
                  <Heart className="w-5 h-5 text-[#0c3c1f]" />
                </button>
              </div>
            </div>

            {/* Precios */}
            <div className="bg-blue-50 rounded-lg p-4 space-y-2">
              {hasDiscount && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#717182]">De:</span>
                  <span className="text-lg text-[#717182] line-through">
                    ${product.originalPrice!.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#717182]">{hasDiscount ? 'Por:' : 'Precio:'}</span>
                <span className="text-4xl font-bold text-[#0c3c1f]">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              {hasDiscount && (
                <p className="text-sm text-[#717182]">
                  Al contado <span className="text-[#0c3c1f] font-medium">({discountPercentage}% de descuento)</span>
                </p>
              )}

              {/* Cuotas */}
              <div className="bg-white border border-blue-300 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-2 rounded">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <rect x="2" y="4" width="16" height="12" rx="2" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">3x de ${installmentPrice} sin intereses</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#717182]" />
              </div>
            </div>

            {/* Controles de Cantidad y Comprar */}
            <div className="flex gap-3">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-3 hover:bg-gray-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="w-16 text-center border-x border-gray-300"
                />
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-3 hover:bg-gray-50"
                  disabled={quantity >= 99}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[rgb(12,60,31)] text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors font-bold text-lg flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                COMPRAR
              </button>
            </div>

            {/* Descripción */}
            {product.description && (
              <div className="border-t pt-4">
                <h3 className="text-[#0c3c1f] font-bold mb-2">Descripción</h3>
                <p className="text-[#212121] text-sm leading-relaxed">{product.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Productos Similares */}
        {similarProducts.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#0c3c1f] text-xl font-bold">Productos similares</h2>
              <button onClick={onBack} className="text-white bg-[#0c3c1f] px-6 py-2 rounded-full hover:bg-[#0c3c1f]/90">
                Ver Todos
              </button>
            </div>
            {similarProducts.length >= 2 ? (
              <Slider {...sliderSettings}>
                {similarProducts.map((item) => {
                  const itemHasDiscount = item.originalPrice && item.originalPrice > item.price;
                  const itemDiscount = itemHasDiscount
                    ? Math.round(((item.originalPrice! - item.price) / item.originalPrice!) * 100)
                    : 0;
                  return (
                    <div key={item.id} className="px-3">
                      <motion.div
                        whileHover={{ y: -5 }}
                        className="border rounded-lg p-4 relative cursor-pointer"
                        onClick={() => handleSimilarProductClick(item)}
                      >
                        {itemDiscount > 0 && (
                          <div className="absolute top-2 left-2 bg-[rgb(255,107,53)] text-white rounded-full w-12 h-12 flex flex-col items-center justify-center text-xs z-10">
                            <span className="font-bold">-{itemDiscount}%</span>
                            <span className="uppercase">OFF</span>
                          </div>
                        )}
                        <button className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
                          <Heart className="w-5 h-5 text-[#0c3c1f]" />
                        </button>
                        <img src={item.image} alt={item.name} className="w-full h-40 object-contain mb-4" />
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">5.0</span>
                        </div>
                        <p className="text-sm text-[#212121] font-medium mb-2 line-clamp-2">{item.name}</p>
                        <div className="space-y-1">
                          {itemHasDiscount && (
                            <p className="text-sm text-[#717182] line-through">
                              De: ${item.originalPrice!.toFixed(2)}
                            </p>
                          )}
                          <p className="text-sm text-[#212121]">
                            {itemHasDiscount ? 'por: ' : ''}
                            <span className="text-xl font-bold text-[#0c3c1f]">${item.price.toFixed(2)}</span>
                          </p>
                          <p className="text-xs text-[#717182]">
                            3x de ${(item.price / 3).toFixed(2)}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </Slider>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {similarProducts.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -5 }}
                    className="border rounded-lg p-4 cursor-pointer"
                    onClick={() => handleSimilarProductClick(item)}
                  >
                    <img src={item.image} alt={item.name} className="w-full h-40 object-contain mb-4" />
                    <p className="text-sm text-[#212121] font-medium mb-2 line-clamp-2">{item.name}</p>
                    <p className="text-xl font-bold text-[#0c3c1f]">${item.price.toFixed(2)}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sección de Ofertas Relámpago */}
      <FlashDeals />
    </div>
  );
};
