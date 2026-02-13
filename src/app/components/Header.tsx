import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, MapPin, Package, Search, MessageCircle, User, ChevronDown, Plus, Minus } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { PLACEHOLDER_IMAGES } from '@/assets/placeholders';
const logo = PLACEHOLDER_IMAGES.logo;

interface HeaderProps {
  onCartClick: () => void;
  onCategoryClick: (category: string) => void;
}

interface MegaMenuProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  image: string;
  installments: {
    times: number;
    value: number;
  };
  creditValue: number;
}

const megaMenuProducts: MegaMenuProduct[] = [
  {
    id: 101,
    name: 'Whisky Chivas Royal Salute 21 Años',
    category: 'Whisky',
    price: 879.00,
    originalPrice: 999.90,
    image: 'https://images.unsplash.com/photo-1762983039830-9606927656da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGlza3klMjBib3R0bGUlMjBwcmVtaXVtJTIwZGFya3xlbnwxfHx8fDE3NzAxMzQ5MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    installments: { times: 3, value: 308.42 },
    creditValue: 925.26
  },
  {
    id: 102,
    name: 'Whisky Macallan 12 años Double Cask',
    category: 'Whisky',
    price: 699.90,
    originalPrice: 1043.78,
    image: 'https://images.unsplash.com/photo-1546728506-b1746d1e5ac9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYWNrJTIwZGFuaWVscyUyMHdoaXNrZXklMjBib3R0bGV8ZW58MXx8fHwxNzcwMTM0OTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    installments: { times: 3, value: 245.58 },
    creditValue: 736.74
  },
  {
    id: 103,
    name: 'Whisky Jack Daniel\'s 1000 ml',
    category: 'Whisky',
    price: 129.90,
    originalPrice: 159.90,
    image: 'https://images.unsplash.com/photo-1546728506-b1746d1e5ac9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYWNrJTIwZGFuaWVscyUyMHdoaXNrZXklMjBib3R0bGV8ZW58MXx8fHwxNzcwMTM0OTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    installments: { times: 3, value: 45.58 },
    creditValue: 136.74
  },
  {
    id: 104,
    name: 'Vino Tinto Reserva Premium',
    category: 'Vino',
    price: 299.90,
    originalPrice: 450.00,
    image: 'https://images.unsplash.com/photo-1733248113944-c4f7dc132dac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjB3aW5lJTIwYm90dGxlJTIwZWxlZ2FudHxlbnwxfHx8fDE3NzAxMzQ5MDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    installments: { times: 3, value: 105.20 },
    creditValue: 315.60
  },
  {
    id: 105,
    name: 'Vino Blanco Chardonnay',
    category: 'Vino',
    price: 249.90,
    originalPrice: 350.00,
    image: 'https://images.unsplash.com/photo-1695048475650-ab0caee95399?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHdpbmUlMjBib3R0bGUlMjBwcmVtaXVtfGVufDF8fHx8MTc3MDEzNDkwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    installments: { times: 3, value: 87.63 },
    creditValue: 262.89
  }
];

const announcements = [
  'Productos con precio atractivo legal o conforme desde siempre. Casa de Bebidas, credibilidad construida en 18 años.',
  '¡Envío GRATIS en compras mayores a $500 MXN! Aprovecha ahora.',
  'Nuevos productos cada semana. ¡Descubre nuestras novedades!'
];

const categories = [
  {
    name: 'Categorías',
    hasDropdown: true,
    hasProducts: false,
    subcategories: ['Todos', 'Jugos', 'Café', 'Refrescos', 'Energizantes', 'Smoothies', 'Agua', 'Té']
  },
  { name: 'Whisky', hasDropdown: true, hasProducts: true, subcategories: ['Standard', '10 Años', '12 Años', '14 Años', '15 Años', '18 Años', '21 Años', '23 Años', '30 Años', 'Blended Malt', 'Blended Scotch', 'BOURBON'] },
  { name: 'Vino', hasDropdown: true, hasProducts: true, subcategories: ['Tinto', 'Blanco', 'Rosado', 'Espumante'] },
  { name: 'Espumante', hasDropdown: false, hasProducts: false },
  { name: 'Licor', hasDropdown: false, hasProducts: false },
  { name: 'Gin', hasDropdown: false, hasProducts: false },
  { name: 'Vodka', hasDropdown: false, hasProducts: false },
  { name: 'Champagne', hasDropdown: false, hasProducts: false },
  { name: 'Miniatura', hasDropdown: false, hasProducts: false },
];

export const Header = ({ onCartClick, onCategoryClick }: HeaderProps) => {
  const { getTotalItems, addToCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [zipCode, setZipCode] = useState('');
  const [productQuantities, setProductQuantities] = useState<{ [key: number]: number }>({});

  // Initialize quantities
  useEffect(() => {
    const initialQuantities: { [key: number]: number } = {};
    megaMenuProducts.forEach(product => {
      initialQuantities[product.id] = 1;
    });
    setProductQuantities(initialQuantities);
  }, []);

  // Rotate announcements
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCategoryClick = (category: string) => {
    onCategoryClick(category);
    setMobileMenuOpen(false);
    setHoveredCategory(null);
  };

  const handleQuantityChange = (productId: number, delta: number) => {
    setProductQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta)
    }));
  };

  const handleAddToCart = (product: MegaMenuProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    const quantity = productQuantities[product.id] || 1;
    
    // Convert MegaMenuProduct to Product format for cart
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      description: `Precio de: R$ ${product.originalPrice.toFixed(2)}`,
      image: product.image
    };
    
    for (let i = 0; i < quantity; i++) {
      addToCart(cartProduct);
    }
    
    // Reset quantity after adding
    setProductQuantities(prev => ({
      ...prev,
      [product.id]: 1
    }));
  };

  return (
    <header className="bg-white text-[#212121] sticky top-0 z-40 shadow-md">
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-[#FDB93A] to-[#FF8A00] py-2 overflow-hidden">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentAnnouncementIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center text-sm text-[#212121] font-medium"
            >
              {announcements[currentAnnouncementIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4 gap-4">
            {/* Logo */}
            <img src={logo} alt="Mr. Brown" className="h-10 md:h-12 flex-shrink-0" />

            {/* Location */}
            <div className="hidden lg:flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-[#0c3c1f]" />
              <input
                type="text"
                placeholder="Ingresa tu código postal"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="border-b border-gray-300 focus:border-[#0c3c1f] outline-none px-2 py-1 w-40"
              />
            </div>

            {/* Track Order Button */}
            <button className="hidden lg:flex items-center gap-2 bg-[#0c3c1f] text-white px-4 py-2 rounded-lg hover:bg-[#0a3019] transition-colors">
              <Package className="w-4 h-4" />
              <span className="text-sm font-medium">Rastreo</span>
            </button>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="¿Qué estás buscando?"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#0c3c1f]/30 text-sm"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-[#0c3c1f]">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-3">
              {/* Chat Icon */}
              <button className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MessageCircle className="w-6 h-6 text-[#212121]" />
              </button>

              {/* User Icon */}
              <button className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <User className="w-6 h-6 text-[#212121]" />
              </button>

              {/* Cart */}
              <button
                onClick={onCartClick}
                className="relative bg-[#0c3c1f] text-white p-2 rounded-lg hover:bg-[#0a3019] transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FF6B35] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-[#212121]" /> : <Menu className="w-6 h-6 text-[#212121]" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="hidden lg:block border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-8 py-3">
            {categories.map((category) => (
              <div
                key={category.name}
                className="relative"
                onMouseEnter={() => category.hasDropdown && setHoveredCategory(category.name)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <button
                  onClick={() => !category.hasDropdown && handleCategoryClick(category.name)}
                  className="flex items-center gap-1 text-[#212121] hover:text-[#0c3c1f] transition-colors font-medium text-sm"
                >
                  {category.name}
                  {category.hasDropdown && <ChevronDown className="w-4 h-4" />}
                </button>

                {/* Mega Menu Dropdown */}
                <AnimatePresence>
                  {category.hasDropdown && hoveredCategory === category.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className={
                        category.hasProducts 
                          ? 'fixed left-1/2 -translate-x-1/2 top-[180px] bg-white shadow-xl rounded-lg border border-gray-200 w-[95vw] max-w-[1400px] p-8' 
                          : 'absolute left-0 top-full mt-2 min-w-[200px] p-4 bg-white shadow-xl rounded-lg border border-gray-200'
                      }
                      style={{ zIndex: 50 }}
                    >
                      {category.hasProducts ? (
                        <div className="grid grid-cols-[250px_1fr] gap-8">
                          {/* Left Side - Categories List */}
                          <div className="space-y-1 border-r border-gray-200 pr-6">
                            <h3 className="font-bold text-[#212121] mb-6 text-base uppercase tracking-wide">
                              CATEGORÍAS
                            </h3>
                            {category.subcategories?.map((sub) => (
                              <button
                                key={sub}
                                onClick={() => handleCategoryClick(sub)}
                                className="block w-full text-left px-4 py-3 text-sm text-[#212121] hover:bg-gray-100 hover:text-[#0c3c1f] rounded transition-colors"
                              >
                                {sub}
                              </button>
                            ))}
                          </div>

                          {/* Right Side - Products Grid */}
                          <div className="grid grid-cols-3 gap-6">
                            {megaMenuProducts
                              .filter(product => product.category === category.name)
                              .slice(0, 3)
                              .map((product) => (
                                <div
                                  key={product.id}
                                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                                >
                                  {/* Product Image */}
                                  <div className="relative mb-4 bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="w-full h-48 object-contain"
                                    />
                                  </div>

                                  {/* Product Name */}
                                  <h4 className="text-sm text-[#212121] mb-3 line-clamp-2 min-h-[2.5rem] font-medium">
                                    {product.name}
                                  </h4>

                                  {/* Original Price */}
                                  <p className="text-xs text-[#717182] mb-1">
                                    <span className="line-through">De: R$ {product.originalPrice.toFixed(2)}</span>
                                  </p>

                                  {/* Current Price */}
                                  <p className="text-sm mb-2">
                                    <span className="text-xs text-[#717182]">por: </span>
                                    <span className="text-2xl font-bold text-[#0c3c1f]">
                                      R$ {product.price.toFixed(2)}
                                    </span>
                                    <span className="text-xs text-[#717182]"> no pix</span>
                                  </p>

                                  {/* Installments */}
                                  <div className="mb-4 space-y-1">
                                    <p className="text-xs text-[#717182]">
                                      <span className="inline-flex items-center gap-1">
                                        <span className="text-[#0c3c1f]">💳</span>
                                        {product.installments.times}x de R$ {product.installments.value.toFixed(2)}
                                      </span>
                                    </p>
                                    <p className="text-xs text-[#717182]">
                                      R$ {product.creditValue.toFixed(2)} no crédito
                                    </p>
                                  </div>

                                  {/* Quantity Controls and Buy Button */}
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center border border-gray-300 rounded h-9">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleQuantityChange(product.id, -1);
                                        }}
                                        className="px-3 h-full hover:bg-gray-100 flex items-center justify-center"
                                      >
                                        <Minus className="w-3 h-3 text-[#717182]" />
                                      </button>
                                      <span className="px-3 text-sm font-medium min-w-[3rem] text-center h-full flex items-center justify-center border-x border-gray-300">
                                        {productQuantities[product.id] || 1}
                                      </span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleQuantityChange(product.id, 1);
                                        }}
                                        className="px-3 h-full hover:bg-gray-100 flex items-center justify-center"
                                      >
                                        <Plus className="w-3 h-3 text-[#717182]" />
                                      </button>
                                    </div>
                                    <button
                                      onClick={(e) => handleAddToCart(product, e)}
                                      className="flex-1 bg-blue-600 text-white text-xs font-bold h-9 rounded hover:bg-blue-700 transition-colors uppercase"
                                    >
                                      Comprar
                                    </button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {category.subcategories?.map((sub) => (
                            <button
                              key={sub}
                              onClick={() => handleCategoryClick(sub)}
                              className="block w-full text-left px-4 py-2 text-sm text-[#212121] hover:bg-gray-100 hover:text-[#0c3c1f] rounded transition-colors"
                            >
                              {sub}
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-t border-gray-200 overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-4 space-y-3">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="¿Qué estás buscando?"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#0c3c1f]/30 text-sm"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-[#0c3c1f]">
                  <Search className="w-5 h-5" />
                </button>
              </div>

              {categories.map((category) => (
                <div key={category.name}>
                  <button
                    onClick={() => !category.hasDropdown && handleCategoryClick(category.name)}
                    className="block w-full text-left text-[#212121] py-2 px-4 hover:bg-gray-100 rounded transition-colors font-medium"
                  >
                    {category.name}
                  </button>
                  {category.hasDropdown && category.subcategories && (
                    <div className="ml-4 mt-2 space-y-1">
                      {category.subcategories.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => handleCategoryClick(sub)}
                          className="block w-full text-left text-sm text-[#717182] py-2 px-4 hover:bg-gray-100 hover:text-[#0c3c1f] rounded transition-colors"
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};