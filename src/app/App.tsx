import React, { useState, useRef } from 'react';
import { CartProvider } from '@/app/context/CartContext';
import { Header } from '@/app/components/Header';
import { Hero } from '@/app/components/Hero';
import { FlashDeals } from '@/app/components/FlashDeals';
import { BrandsSection } from '@/app/components/BrandsSection';
import { Newsletter } from '@/app/components/Newsletter';
import { WhatsAppButton } from '@/app/components/WhatsAppButton';
import { About } from '@/app/components/About';
import { FAQ } from '@/app/components/FAQ';
import { Footer } from '@/app/components/Footer';
import { ProductCard } from '@/app/components/ProductCard';
import { Cart } from '@/app/components/Cart';
import { ProductDetail } from '@/app/components/ProductDetail';
import { Product } from '@/app/context/CartContext';

// Placeholders para ejecución local (figma:asset solo funciona en Figma/Make)
import { PLACEHOLDER_IMAGES } from '@/assets/placeholders';
const imgPenafiel = PLACEHOLDER_IMAGES.agua;
const imgSprite = PLACEHOLDER_IMAGES.refresco;
const imgWhisky = PLACEHOLDER_IMAGES.whisky;

const products: Product[] = [
  {
    id: 1,
    name: 'Agua Peñafiel Mineral',
    price: 25.00,
    category: 'Agua',
    description: 'Agua mineral natural de manantial, 2L',
    image: imgPenafiel
  },
  {
    id: 2,
    name: 'Sprite Zero',
    price: 18.00,
    category: 'Refrescos',
    description: 'Refresco de lima-limón sin azúcar, sabor refrescante',
    image: imgSprite
  },
  {
    id: 3,
    name: 'Nikka Coffey Malt Whisky',
    price: 1299.00,
    originalPrice: 1499.00,
    category: 'Whisky',
    description: 'Whisky japonés premium de malta, destilado en alambiques Coffey',
    image: imgWhisky
  },
  {
    id: 4,
    name: 'Agua Peñafiel Mineral 2L',
    price: 25.00,
    category: 'Agua',
    description: 'Agua mineral natural de manantial con gas',
    image: imgPenafiel
  },
  {
    id: 5,
    name: 'Sprite Zero Refresco',
    price: 18.00,
    category: 'Refrescos',
    description: 'Bebida gaseosa sin calorías con sabor a lima-limón',
    image: imgSprite
  },
  {
    id: 6,
    name: 'Whisky Nikka Coffey Malt',
    price: 1299.00,
    originalPrice: 1499.00,
    category: 'Whisky',
    description: 'Destilado japonés de malta 100% con notas dulces y afrutadas',
    image: imgWhisky
  },
  {
    id: 7,
    name: 'Peñafiel Agua con Gas',
    price: 25.00,
    category: 'Agua',
    description: 'Agua mineral carbonatada natural, ideal para mezclas',
    image: imgPenafiel
  },
  {
    id: 8,
    name: 'Sprite Zero Limón',
    price: 18.00,
    category: 'Refrescos',
    description: 'Refresco sin azúcar con sabor intenso a limón',
    image: imgSprite
  },
  {
    id: 9,
    name: 'Nikka Coffey Whisky Japonés',
    price: 1299.00,
    originalPrice: 1499.00,
    category: 'Whisky',
    description: 'Whisky premium japonés, destilación continua estilo Coffey',
    image: imgWhisky
  },
  {
    id: 10,
    name: 'Agua Mineral Peñafiel',
    price: 25.00,
    category: 'Agua',
    description: 'Agua natural con minerales esenciales, botella 2L',
    image: imgPenafiel
  },
  {
    id: 11,
    name: 'Refresco Sprite Zero',
    price: 18.00,
    category: 'Refrescos',
    description: 'Bebida refrescante con extractos naturales de limón',
    image: imgSprite
  },
  {
    id: 12,
    name: 'Whisky Nikka Malt Premium',
    price: 1299.00,
    originalPrice: 1499.00,
    category: 'Whisky',
    description: 'Expresión premium de whisky japonés de malta',
    image: imgWhisky
  }
];

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const productsRef = useRef<HTMLElement>(null);

  const filteredProducts = selectedCategory === 'Todos'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleProductClick = (productId: number) => {
    setSelectedProductId(productId);
    setShowProductDetail(true);
    window.scrollTo(0, 0);
  };

  const handleBackToHome = () => {
    setShowProductDetail(false);
    setSelectedProductId(null);
  };

  // Si estamos en la vista de detalle de producto
  if (showProductDetail) {
    return (
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          <Header
            onCartClick={() => setIsCartOpen(true)}
            onCategoryClick={setSelectedCategory}
          />
          <ProductDetail onBack={handleBackToHome} />
          <Footer />
          <WhatsAppButton />
          <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
      </CartProvider>
    );
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <Header
          onCartClick={() => setIsCartOpen(true)}
          onCategoryClick={setSelectedCategory}
        />

        {/* Hero Component */}
        <Hero onShopNowClick={scrollToProducts} />

        {/* Flash Deals Component */}
        <FlashDeals />

        {/* Products Grid */}
        <section ref={productsRef} className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[#212121]">
              {selectedCategory === 'Todos' ? 'Todos los Productos' : selectedCategory}
            </h2>
            <p className="text-[#717182]">{filteredProducts.length} productos</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} onClick={() => handleProductClick(product.id)} />
            ))}
          </div>
        </section>

        {/* Brands Section */}
        <BrandsSection />

        {/* Newsletter Section */}
        <Newsletter />

        {/* About Component */}
        <About />

        {/* FAQ Component */}
        <FAQ />

        {/* Features Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#0c3c1f]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#0c3c1f] text-2xl">🚚</span>
                </div>
                <h3 className="text-[#212121] mb-2">Envío Rápido</h3>
                <p className="text-[#717182]">Entrega en 24-48 horas</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#0c3c1f]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#0c3c1f] text-2xl">✓</span>
                </div>
                <h3 className="text-[#212121] mb-2">100% Natural</h3>
                <p className="text-[#717182]">Ingredientes frescos y naturales</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#0c3c1f]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#0c3c1f] text-2xl">💳</span>
                </div>
                <h3 className="text-[#212121] mb-2">Pago Seguro</h3>
                <p className="text-[#717182]">Múltiples métodos de pago</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />

        {/* WhatsApp Sticky Button */}
        <WhatsAppButton />

        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </CartProvider>
  );
}

export default App;