import { Heart, Menu, MessageCircle, Search, ShoppingCart, User, X } from 'lucide-react';

type Props = {
  mobileMenuOpen: boolean;
  cartCount: number;
  wishlistCount: number;
  onOpenSearch: () => void;
  onCartClick: () => void;
  onWishlistClick?: () => void;
  onToggleMenu: () => void;
  onContacto: () => void;
  onNewsletter: () => void;
};

export function HeaderToolbarIcons({
  mobileMenuOpen,
  cartCount,
  wishlistCount,
  onOpenSearch,
  onCartClick,
  onWishlistClick,
  onToggleMenu,
  onContacto,
  onNewsletter,
}: Props) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors text-[#212121]"
        onClick={onOpenSearch}
        aria-label="Abrir búsqueda"
      >
        <Search className="w-6 h-6" />
      </button>
      <button
        type="button"
        className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg transition-colors"
        onClick={onContacto}
        aria-label="Ir a contacto"
      >
        <MessageCircle className="w-6 h-6 text-[#212121]" />
      </button>
      <button
        type="button"
        className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg transition-colors"
        onClick={onNewsletter}
        aria-label="Ir al boletín"
      >
        <User className="w-6 h-6 text-[#212121]" />
      </button>
      <button
        onClick={onWishlistClick}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Favoritos"
      >
        <Heart className={`w-6 h-6 ${wishlistCount > 0 ? 'fill-red-500 text-red-500' : 'text-[#212121]'}`} />
        {wishlistCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
            {wishlistCount}
          </span>
        )}
      </button>
      <button
        onClick={onCartClick}
        data-cart-icon
        className="relative bg-[#0c3c1f] text-white p-2 rounded-lg hover:bg-[#0a3019] transition-colors"
        aria-label={`Abrir carrito de compras${cartCount > 0 ? ` (${cartCount} artículos)` : ''}`}
      >
        <ShoppingCart className="w-6 h-6" aria-hidden />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#FF6B35] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            {cartCount}
          </span>
        )}
      </button>
      <button
        type="button"
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        onClick={onToggleMenu}
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-primary-nav"
        aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú de categorías'}
      >
        {mobileMenuOpen ? <X className="w-6 h-6 text-[#212121]" /> : <Menu className="w-6 h-6 text-[#212121]" />}
      </button>
    </div>
  );
}
