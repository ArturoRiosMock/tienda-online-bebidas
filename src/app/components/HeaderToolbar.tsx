import { Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '@/app/context/CartContext';
import { useWishlist } from '@/app/context/WishlistContext';
import { HeaderToolbarIcons } from '@/app/components/HeaderToolbarIcons';
import { PLACEHOLDER_IMAGES } from '@/assets/placeholders';

const logo = PLACEHOLDER_IMAGES.logo;

type Props = {
  mobileMenuOpen: boolean;
  onToggleMenu: () => void;
  onOpenSearch: () => void;
  onCartClick: () => void;
  onWishlistClick?: () => void;
  onCloseMenu: () => void;
};

export function HeaderToolbar({
  mobileMenuOpen,
  onToggleMenu,
  onOpenSearch,
  onCartClick,
  onWishlistClick,
  onCloseMenu,
}: Props) {
  const { getTotalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const goHome = () => {
    navigate('/');
    onCloseMenu();
  };

  const goNewsletter = () => {
    if (location.pathname === '/') {
      document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    navigate('/#newsletter');
  };

  return (
    <div className="border-b border-gray-200">
      <div className="container mx-auto px-3 sm:px-4 max-w-[100vw]">
        <div className="flex items-center justify-between py-3 sm:py-4 gap-2 sm:gap-4 min-w-0">
          <button type="button" onClick={goHome} className="flex-shrink-0" aria-label="Ir al inicio">
            <img src={logo} alt="Mr. Brown" className="h-9 sm:h-10 md:h-12 max-h-12 object-contain" />
          </button>
          <button
            onClick={onOpenSearch}
            className="flex-1 max-w-xl hidden md:flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-400 hover:border-gray-400 transition-colors cursor-text bg-transparent"
          >
            <Search className="w-4 h-4" />
            <span>¿Qué estás buscando?</span>
          </button>
          <HeaderToolbarIcons
            mobileMenuOpen={mobileMenuOpen}
            cartCount={getTotalItems()}
            wishlistCount={wishlistCount}
            onOpenSearch={onOpenSearch}
            onCartClick={onCartClick}
            onWishlistClick={onWishlistClick}
            onToggleMenu={onToggleMenu}
            onContacto={() => navigate('/contacto')}
            onNewsletter={goNewsletter}
          />
        </div>
      </div>
    </div>
  );
}
