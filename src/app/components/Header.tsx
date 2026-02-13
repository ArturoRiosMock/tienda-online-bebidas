import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShoppingCart, Menu, X, MapPin, Package, Search, MessageCircle, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { PLACEHOLDER_IMAGES } from '@/assets/placeholders';
import { useShopifyCollections } from '@/shopify/hooks/useShopifyCollections';
import { SearchBar } from '@/app/components/SearchBar';

const logo = PLACEHOLDER_IMAGES.logo;

interface HeaderProps {
  onCartClick: () => void;
  onCategoryClick: (collectionHandle: string) => void;
}

const announcements = [
  'Productos con precio atractivo. Mr. Brown, credibilidad construida en 18 años.',
  '¡Envío GRATIS en compras mayores a $500 MXN! Aprovecha ahora.',
  'Nuevos productos cada semana. ¡Descubre nuestras novedades!'
];

const FLASH_DEALS_HANDLE = 'ofertas-relampago';

export const Header = ({ onCartClick, onCategoryClick }: HeaderProps) => {
  const { getTotalItems } = useCart();
  const { collections, loading: collectionsLoading } = useShopifyCollections();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [zipCode, setZipCode] = useState('');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navScrollRef = useRef<HTMLDivElement>(null);

  // Filtrar colecciones: excluir la colección de ofertas relámpago del menú principal
  const menuCollections = collections.filter(
    (col) => col.handle !== FLASH_DEALS_HANDLE
  );

  const updateScrollArrows = useCallback(() => {
    const el = navScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  const scrollNav = (direction: 'left' | 'right') => {
    const el = navScrollRef.current;
    if (!el) return;
    const amount = 250;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  useEffect(() => {
    const el = navScrollRef.current;
    if (!el) return;
    updateScrollArrows();
    el.addEventListener('scroll', updateScrollArrows, { passive: true });
    const ro = new ResizeObserver(updateScrollArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateScrollArrows);
      ro.disconnect();
    };
  }, [updateScrollArrows, menuCollections.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCategoryClick = (collectionHandle: string) => {
    onCategoryClick(collectionHandle);
    setMobileMenuOpen(false);
    setHoveredCategory(null);
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
            <img
              src={logo}
              alt="Mr. Brown"
              className="h-10 md:h-12 flex-shrink-0 cursor-pointer"
              onClick={() => handleCategoryClick('Todos')}
            />

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

            {/* Search Bar - Desktop */}
            <div className="flex-1 max-w-xl hidden md:block">
              <SearchBar collections={menuCollections} variant="desktop" />
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors text-[#212121]"
                onClick={() => setMobileSearchOpen(true)}
                aria-label="Abrir búsqueda"
              >
                <Search className="w-6 h-6" />
              </button>
              <button className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MessageCircle className="w-6 h-6 text-[#212121]" />
              </button>
              <button className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <User className="w-6 h-6 text-[#212121]" />
              </button>
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

      {/* Navigation Menu - Desktop */}
      <nav className="hidden lg:block border-b border-gray-200">
        <div className="container mx-auto px-4 relative">
          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scrollNav('left')}
              className="absolute left-0 top-0 bottom-0 z-10 flex items-center pl-1 pr-3 bg-gradient-to-r from-white via-white/95 to-transparent"
              aria-label="Scroll categorías izquierda"
            >
              <ChevronLeft className="w-5 h-5 text-[#0c3c1f]" />
            </button>
          )}

          {/* Scrollable Categories */}
          <div
            ref={navScrollRef}
            className="flex items-center gap-6 py-3 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <button
              onClick={() => handleCategoryClick('Todos')}
              className="flex items-center gap-1 text-[#212121] hover:text-[#0c3c1f] transition-colors font-medium text-sm whitespace-nowrap"
            >
              Todos
            </button>

            {collectionsLoading ? (
              <div className="flex gap-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              menuCollections.map((collection) => (
                <div
                  key={collection.id}
                  className="relative"
                  onMouseEnter={() => setHoveredCategory(collection.handle)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <button
                    onClick={() => handleCategoryClick(collection.handle)}
                    className="flex items-center gap-1 text-[#212121] hover:text-[#0c3c1f] transition-colors font-medium text-sm whitespace-nowrap"
                  >
                    {collection.title}
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Right Arrow */}
          {canScrollRight && (
            <button
              onClick={() => scrollNav('right')}
              className="absolute right-0 top-0 bottom-0 z-10 flex items-center pr-1 pl-3 bg-gradient-to-l from-white via-white/95 to-transparent"
              aria-label="Scroll categorías derecha"
            >
              <ChevronRight className="w-5 h-5 text-[#0c3c1f]" />
            </button>
          )}
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
            <nav className="container mx-auto px-4 py-4 space-y-1">
              {/* Mobile Search - opens fullscreen from header icon; here just a shortcut */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setMobileSearchOpen(true);
                }}
                className="flex items-center gap-2 w-full text-left text-[#212121] py-2 px-4 hover:bg-gray-100 rounded transition-colors font-medium mb-2 border border-gray-200 rounded-lg"
              >
                <Search className="w-5 h-5 text-[#0c3c1f]" />
                Buscar productos
              </button>

              {/* "Todos" */}
              <button
                onClick={() => handleCategoryClick('Todos')}
                className="block w-full text-left text-[#212121] py-2 px-4 hover:bg-gray-100 rounded transition-colors font-medium"
              >
                Todos los Productos
              </button>

              {collectionsLoading ? (
                <div className="space-y-2 px-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                menuCollections.map((collection) => (
                  <button
                    key={collection.id}
                    onClick={() => handleCategoryClick(collection.handle)}
                    className="block w-full text-left text-[#212121] py-2 px-4 hover:bg-gray-100 rounded transition-colors font-medium"
                  >
                    {collection.title}
                  </button>
                ))
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile fullscreen search overlay */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-white lg:hidden flex flex-col min-h-screen"
          >
            <SearchBar
              collections={menuCollections}
              variant="mobile"
              onClose={() => setMobileSearchOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
