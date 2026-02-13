import React, { useState } from 'react';
import { ChevronRight, Share2, Heart, ShoppingCart, Star, ChevronLeft, Minus, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import Slider from 'react-slick';
import { useCart } from '@/app/context/CartContext';
import { FlashDeals } from '@/app/components/FlashDeals';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Placeholders para ejecución local (figma:asset solo funciona en Figma/Make)
import { PLACEHOLDER_IMAGES } from '@/assets/placeholders';
const imgWhisky = PLACEHOLDER_IMAGES.whisky;
const imgSprite = PLACEHOLDER_IMAGES.refresco;
const imgPenafiel = PLACEHOLDER_IMAGES.agua;

interface ProductDetailProps {
  onBack: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ onBack }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [zipCode, setZipCode] = useState('');

  // Producto principal
  const product = {
    id: 3,
    name: 'Nikka Coffey Malt Whisky',
    code: '687',
    brand: 'Nikka',
    category: 'Whisky',
    originalPrice: 1499.00,
    price: 1299.00,
    discount: 13,
    rating: 5.0,
    reviews: 4,
    stock: 4,
    description: 'Whisky japonés premium de malta, destilado en alambiques Coffey',
    images: [imgWhisky, imgWhisky],
    specifications: [
      { label: 'País de Origen', value: 'Japón' },
      { label: 'Región', value: 'Miyagi' },
      { label: 'Tipo', value: 'Whisky de Malta' },
      { label: 'Teor Alcohólico', value: '45% vol.' },
      { label: 'Volumen', value: '750 ml' }
    ],
    details: 'Este fantástico whisky se encuentra entre los 100 mejores del mundo, según ranking realizado por la Asociación Mundial de Periodistas y Escritores de Bebidas Espirituosas.',
    fullDescription: 'El Nikka Coffey Malt es un whisky japonés excepcional que combina la tradición con la innovación. Destilado en los legendarios alambiques Coffey, ofrece notas dulces y afrutadas con toques de vainilla y caramelo. Perfecto para degustar solo o con hielo.'
  };

  // Productos relacionados de la misma marca
  const relatedProducts = [
    { id: 101, name: 'Nikka Yoichi Single Malt', price: 1599.00, originalPrice: 1899.00, image: imgWhisky, rating: 5.0, discount: 16 },
    { id: 102, name: 'Nikka Taketsuru Pure Malt', price: 1399.00, originalPrice: 1699.00, image: imgWhisky, rating: 4.8, discount: 18 },
    { id: 103, name: 'Nikka From The Barrel', price: 899.00, originalPrice: 1099.00, image: imgWhisky, rating: 4.9, discount: 18 }
  ];

  // Productos similares
  const similarProducts = [
    { id: 201, name: 'Whisky Johnnie Walker Gold Reserve', price: 249.90, originalPrice: 299.90, image: imgWhisky, rating: 4.8 },
    { id: 202, name: 'Whisky Chivas Regal 13 años', price: 199.90, originalPrice: 259.90, image: imgWhisky, rating: 4.7, discount: 23 },
    { id: 203, name: 'Whisky Buffalo Trace', price: 159.90, originalPrice: 199.90, image: imgWhisky, rating: 4.9, discount: 20 },
    { id: 204, name: 'Whisky Macallan 12 años', price: 899.90, originalPrice: 1099.90, image: imgWhisky, rating: 5.0 }
  ];

  // Reviews de clientes
  const reviews = [
    { name: 'Michael Yokota', rating: 5 },
    { name: 'Vítor Hugo', rating: 5 },
    { name: 'Afonso Filho', rating: 5 },
    { name: 'Marco Correa', rating: 5 }
  ];

  const discountAmount = product.originalPrice - product.price;
  const discountPercentage = Math.round((discountAmount / product.originalPrice) * 100);
  const installmentPrice = (product.price / 3).toFixed(2);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        image: product.images[0]
      });
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    const text = `${product.name} - Solo $${product.price.toFixed(2)} MXN`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 }
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
            <button onClick={onBack} className="hover:text-[#0c3c1f] flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" />
              Inicio
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#0c3c1f]">{product.category}</span>
          </div>
        </div>
      </div>

      {/* Sección Principal del Producto */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-lg p-6 shadow-sm">
          {/* Columna Izquierda - Imágenes */}
          <div className="relative">
            {/* Badge de descuento */}
            {product.discount > 0 && (
              <div className="absolute top-4 left-4 z-10 bg-purple-600 text-white rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-lg">
                <span className="text-lg font-bold">-{product.discount}%</span>
                <span className="text-xs uppercase">OFF</span>
              </div>
            )}

            {/* Imagen principal */}
            <div className="flex items-center justify-center bg-gray-50 rounded-lg p-8 mb-4 min-h-[400px]">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="max-h-[400px] object-contain"
              />
            </div>

            {/* Miniaturas */}
            <div className="flex gap-2 justify-center">
              {product.images.map((img, idx) => (
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
          </div>

          {/* Columna Derecha - Información */}
          <div className="space-y-4">
            {/* Título y Código */}
            <div>
              <h1 className="text-[#0c3c1f] text-2xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 text-sm text-[#717182]">
                <span>Código: {product.code}</span>
                <span>Otros productos: <span className="text-[#0c3c1f] font-medium">{product.brand}</span></span>
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
                <span className="text-sm text-[#717182]">({product.reviews})</span>
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
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#717182]">De:</span>
                <span className="text-lg text-[#717182] line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#717182]">Por:</span>
                <span className="text-4xl font-bold text-[#0c3c1f]">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-[#717182]">
                à vista no Pix <span className="text-[#0c3c1f] font-medium">({discountPercentage}% de desconto)</span>
              </p>
              <p className="text-sm text-[#0c3c1f]">
                ou ${(product.price * 1.1).toFixed(2)} no crédito
              </p>

              {/* Cuotas */}
              <div className="bg-white border border-blue-300 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-2 rounded">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <rect x="2" y="4" width="16" height="12" rx="2" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">3x de ${installmentPrice} sem juros</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#717182]" />
              </div>

              <p className="text-sm text-[#717182]">
                ou ${(product.price * 0.95).toFixed(2)} para Empresas con I.E.
              </p>
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
                  disabled={quantity >= product.stock}
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

            {/* Consulta de Entrega */}
            <div className="border-t pt-4">
              <p className="text-sm text-[#0c3c1f] font-medium mb-2">
                Consulte o prazo de entrega do seu pedido
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="00000-000"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm"
                />
                <button className="bg-[#0c3c1f] text-white px-6 py-2 rounded-lg hover:bg-[#0c3c1f]/90 font-medium">
                  Ok
                </button>
              </div>
            </div>

            {/* Otros productos de la marca */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[#0c3c1f] font-medium">
                  Otros productos {product.brand}:
                </h3>
                <button className="text-white bg-[#0c3c1f] px-4 py-1 rounded-full text-sm hover:bg-[#0c3c1f]/90">
                  ver todos
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {relatedProducts.slice(0, 3).map((item) => (
                  <div key={item.id} className="relative">
                    {item.discount && (
                      <div className="absolute top-0 left-0 bg-purple-600 text-white rounded-full w-10 h-10 flex flex-col items-center justify-center text-xs z-10">
                        <span className="font-bold">-{item.discount}%</span>
                      </div>
                    )}
                    <div className="border rounded-lg p-2 hover:shadow-md transition-shadow">
                      <img src={item.image} alt={item.name} className="w-full h-24 object-contain mb-2" />
                      {item.rating && (
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{item.rating}</span>
                        </div>
                      )}
                      <p className="text-xs text-[#212121] line-clamp-2 mb-1">{item.name}</p>
                      <div className="space-y-1">
                        <p className="text-xs text-[#717182] line-through">
                          ${item.originalPrice.toFixed(2)}
                        </p>
                        <p className="text-sm font-bold text-[#0c3c1f]">
                          ${item.price.toFixed(2)} <span className="text-xs font-normal">no pix</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Descripción del Producto */}
        <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
          <h2 className="text-[#0c3c1f] text-xl font-bold mb-4">{product.name}</h2>
          <p className="text-[#212121] mb-4">{product.fullDescription}</p>
          
          <h3 className="text-[#0c3c1f] font-bold mb-2">Ótima opção para seu casamento e evento.</h3>
          <p className="text-[#212121] mb-4">Solicite um orçamento para grandes quantidades.</p>

          <h3 className="text-[#0c3c1f] font-bold mb-2 uppercase">CARACTERÍSTICAS:</h3>
          <ul className="list-disc list-inside space-y-1 text-[#212121] mb-4">
            {product.specifications.map((spec, idx) => (
              <li key={idx}>
                <span className="font-medium">{spec.label}:</span> {spec.value}
              </li>
            ))}
          </ul>

          <h3 className="text-[#0c3c1f] font-bold mb-2 uppercase">DETALLES:</h3>
          <p className="text-[#212121]">{product.details}</p>
        </div>

        {/* Otros productos de la misma marca - Carrusel */}
        <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#0c3c1f] text-xl font-bold">Otros productos da mesma marca</h2>
            <button className="text-white bg-[#0c3c1f] px-6 py-2 rounded-full hover:bg-[#0c3c1f]/90">
              Ver Todos
            </button>
          </div>
          <Slider {...sliderSettings}>
            {relatedProducts.map((item) => (
              <div key={item.id} className="px-3">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="border rounded-lg p-4 relative"
                >
                  {item.discount && (
                    <div className="absolute top-2 left-2 bg-[rgb(255,107,53)] text-white rounded-full w-12 h-12 flex flex-col items-center justify-center text-xs z-10">
                      <span className="font-bold">-{item.discount}%</span>
                      <span className="uppercase">OFF</span>
                    </div>
                  )}
                  <button className="absolute top-2 right-2">
                    <Heart className="w-5 h-5 text-[#0c3c1f]" />
                  </button>
                  <img src={item.image} alt={item.name} className="w-full h-40 object-contain mb-4" />
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{item.rating}</span>
                  </div>
                  <p className="text-sm text-[#212121] font-medium mb-2 line-clamp-2">{item.name}</p>
                  <div className="space-y-1">
                    <p className="text-sm text-[#717182] line-through">
                      De: ${item.originalPrice.toFixed(2)}
                    </p>
                    <p className="text-sm text-[#212121]">
                      por: <span className="text-xl font-bold text-[#0c3c1f]">${item.price.toFixed(2)}</span>
                    </p>
                    <p className="text-xs text-[#717182]">no pix</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Productos Similares */}
        <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
          <h2 className="text-[#0c3c1f] text-xl font-bold mb-6">Produtos similares</h2>
          <Slider {...sliderSettings}>
            {similarProducts.map((item) => (
              <div key={item.id} className="px-3">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="border rounded-lg p-4 relative"
                >
                  {item.discount && (
                    <div className="absolute top-2 left-2 bg-[rgb(255,107,53)] text-white rounded-full w-12 h-12 flex flex-col items-center justify-center text-xs z-10">
                      <span className="font-bold">-{item.discount}%</span>
                      <span className="uppercase">OFF</span>
                    </div>
                  )}
                  <button className="absolute top-2 right-2">
                    <Heart className="w-5 h-5 text-[#0c3c1f]" />
                  </button>
                  <img src={item.image} alt={item.name} className="w-full h-40 object-contain mb-4" />
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{item.rating}</span>
                  </div>
                  <p className="text-sm text-[#212121] font-medium mb-3 line-clamp-2 min-h-[40px]">{item.name}</p>
                  <div className="space-y-2 mb-3">
                    {item.originalPrice && (
                      <p className="text-xs text-[#717182] line-through">
                        De: ${item.originalPrice.toFixed(2)}
                      </p>
                    )}
                    <p className="text-lg font-bold text-[#0c3c1f]">
                      ${item.price.toFixed(2)} <span className="text-xs font-normal">no pix</span>
                    </p>
                    <p className="text-xs text-[#717182]">
                      3x de ${(item.price / 3).toFixed(2)}
                    </p>
                    <p className="text-xs text-[#717182]">
                      ${(item.price * 1.05).toFixed(2)} no crédito
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <button className="p-1 border rounded">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm">1</span>
                    <button className="p-1 border rounded">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button className="w-full bg-[#0c3c1f] text-white py-2 rounded-lg hover:bg-[#0c3c1f]/90 text-sm font-medium">
                    COMPRAR
                  </button>
                </motion.div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Avaliação dos Clientes */}
        <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
          <h2 className="text-[#0c3c1f] text-xl font-bold mb-6">Avaliação dos clientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-blue-50 rounded-lg p-4">
                <p className="text-[#212121] font-medium mb-2">{review.name}</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sección de Ofertas Relámpago */}
      <FlashDeals />
    </div>
  );
};