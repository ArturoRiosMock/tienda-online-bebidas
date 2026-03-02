import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShoppingCart, Menu, X, MapPin, Package, Search, MessageCircle, User, ChevronLeft, ChevronRight, Heart, LogIn, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/app/context/CartContext';
import { useWishlist } from '@/app/context/WishlistContext';
import { useAuth } from '@/app/context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { PLACEHOLDER_IMAGES } from '@/assets/placeholders';
import { useShopifyCollections } from '@/shopify/hooks/useShopifyCollections';
import { SearchDrawer } from '@/app/components/SearchDrawer';

const logo = PLACEHOLDER_IMAGES.logo;

interface HeaderProps {
  onCartClick: () => void;
  onWishlistClick?: () => void;
  onCategoryClick: (collectionHandle: string) => void;
  searchDrawerOpen: boolean;
  onSearchDrawerChange: (open: boolean) => void;
}

const announcements = [
  'Bebify – La Plataforma de Bebidas B2B. +2,000 productos de +300 proveedores.',
  'Entregas en menos de 24 horas en toda la CDMX. ¡Pedidos sin errores!',
  '¿Aún no tienes cuenta? Regístrate y accede a precios exclusivos B2B.'
];

const FLASH_DEALS_HANDLE = 'ofertas-relampago';

export const Header = ({ onCartClick, onWishlistClick, onCategoryClick, searchDrawerOpen, onSearchDrawerChange }: HeaderProps) => {
  const { getTotalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { collections, loading: collectionsLoading } = useShopifyCollections();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [zipCode, setZipCode] = useState('');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const setSearchDrawerOpen = onSearchDrawerChange;
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
      <div className="bg-gradient-to-r from-[#4da6ff] to-[#0055a2] py-2 overflow-hidden">
        <div className="container mx-auto px-3 sm:px-4 max-w-[100vw]">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentAnnouncementIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center text-sm text-white font-medium"
            >
              {announcements[currentAnnouncementIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-[#212121]">
        <div className="container mx-auto px-3 sm:px-4 max-w-[100vw]">
          <div className="flex items-center justify-between py-3 sm:py-4 gap-2 sm:gap-4 min-w-0">
            {/* Logo */}
            <img
              src={logo}
              alt="Bebify"
              className="h-8 sm:h-9 md:h-11 flex-shrink-0 cursor-pointer object-contain"
              onClick={() => handleCategoryClick('Todos')}
            />

            {/* Location */}
            <div className="hidden lg:flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-[#0055a2]" />
              <input
                type="text"
                placeholder="Ingresa tu código postal"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="border-b border-gray-500 focus:border-[#0055a2] outline-none px-2 py-1 w-40 bg-transparent text-white placeholder-gray-400"
              />
            </div>

            {/* Track Order Button */}
            <button className="hidden lg:flex items-center gap-2 bg-[#0055a2] text-white px-4 py-2 rounded-lg hover:bg-[#004488] transition-colors">
              <Package className="w-4 h-4" />
              <span className="text-sm font-medium">Rastreo</span>
            </button>

            {/* Search Trigger - Desktop */}
            <button
              onClick={() => setSearchDrawerOpen(true)}
              className="flex-1 max-w-xl hidden md:flex items-center gap-2 border border-gray-500 rounded-lg px-4 py-2 text-sm text-gray-400 hover:border-gray-300 transition-colors cursor-text bg-transparent"
            >
              <Search className="w-4 h-4" />
              <span>¿Qué estás buscando?</span>
            </button>

            {/* Right Icons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                onClick={() => setSearchDrawerOpen(true)}
                aria-label="Abrir búsqueda"
              >
                <Search className="w-6 h-6" />
              </button>
              <button className="hidden lg:block p-2 hover:bg-white/10 rounded-lg transition-colors">
                <MessageCircle className="w-6 h-6 text-white" />
              </button>
              {isAuthenticated ? (
                <div className="hidden lg:flex items-center gap-2">
                  <span className="text-sm text-[#4da6ff] font-medium truncate max-w-[120px]">
                    {user?.firstName || user?.email}
                  </span>
                  <button
                    onClick={logout}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Cerrar sesión"
                  >
                    <LogOut className="w-5 h-5 text-white" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="hidden lg:flex items-center gap-1.5 bg-[#0055a2] text-white px-4 py-2 rounded-lg hover:bg-[#004488] transition-colors text-sm font-medium"
                >
                  <LogIn className="w-4 h-4" />
                  Iniciar Sesión
                </button>
              )}
              <button
                onClick={onWishlistClick}
                className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Favoritos"
              >
                <Heart className={`w-6 h-6 ${wishlistCount > 0 ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                    {wishlistCount}
                  </span>
                )}
              </button>
              <button
                onClick={onCartClick}
                data-cart-icon
                className="relative bg-[#0055a2] text-white p-2 rounded-lg hover:bg-[#004488] transition-colors"
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
                {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
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
              <ChevronLeft className="w-5 h-5 text-[#0055a2]" />
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
              className="flex items-center gap-1 text-[#212121] hover:text-[#0055a2] transition-colors font-medium text-sm whitespace-nowrap"
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
                    className="flex items-center gap-1 text-[#212121] hover:text-[#0055a2] transition-colors font-medium text-sm whitespace-nowrap"
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
              <ChevronRight className="w-5 h-5 text-[#0055a2]" />
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
              {/* Mobile Auth */}
              {isAuthenticated ? (
                <div className="flex items-center justify-between py-2 px-4 mb-2 bg-blue-50 rounded-lg">
                  <span className="text-sm text-[#0055a2] font-medium truncate">
                    {user?.firstName || user?.email}
                  </span>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="text-sm text-red-500 font-medium flex items-center gap-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Salir
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                  className="flex items-center gap-2 w-full text-left text-white bg-[#0055a2] py-2.5 px-4 rounded-lg font-medium mb-2"
                >
                  <LogIn className="w-5 h-5" />
                  Iniciar Sesión
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchDrawerOpen(true);
                }}
                className="flex items-center gap-2 w-full text-left text-[#212121] py-2 px-4 hover:bg-gray-100 rounded transition-colors font-medium mb-2 border border-gray-200 rounded-lg"
              >
                <Search className="w-5 h-5 text-[#0055a2]" />
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

      {/* Search Drawer */}
      <SearchDrawer
        isOpen={searchDrawerOpen}
        onClose={() => onSearchDrawerChange(false)}
        onOpenCart={onCartClick}
      />
    </header>
  );
};
