import React, { useState, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { CartProvider } from '@/app/context/CartContext';
import { WishlistProvider } from '@/app/context/WishlistContext';
import { CookieConsentProvider } from '@/app/context/CookieConsentContext';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { WhatsAppButton } from '@/app/components/WhatsAppButton';
import { Cart } from '@/app/components/Cart';
import { WishlistDrawer } from '@/app/components/WishlistDrawer';
import { AddToCartAnimation } from '@/app/components/AddToCartAnimation';
import { AgeVerification } from '@/app/components/AgeVerification';
import { CookieConsent } from '@/app/components/CookieConsent';

export const MainLayout: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleCategoryClick = (collectionHandle: string) => {
    if (collectionHandle === 'Todos') {
      navigate('/productos');
    } else {
      navigate(`/categorias/${collectionHandle}`);
    }
  };

  const handleCartAnimationComplete = useCallback(() => {
    if (!isSearchDrawerOpen) {
      setIsCartOpen(true);
    }
  }, [isSearchDrawerOpen]);

  return (
    <AgeVerification>
      <CookieConsentProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden max-w-[100vw]">
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[300] focus:bg-[#0c3c1f] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FDB93A]"
              >
                Saltar al contenido principal
              </a>
              <Header
                onCartClick={() => setIsCartOpen(true)}
                onWishlistClick={() => setIsWishlistOpen(true)}
                onCategoryClick={handleCategoryClick}
                searchDrawerOpen={isSearchDrawerOpen}
                onSearchDrawerChange={setIsSearchDrawerOpen}
              />

              <main id="main-content" tabIndex={-1} className="flex-1">
                <Outlet />
              </main>

              <Footer />
              <WhatsAppButton />
              <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
              <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
              <AddToCartAnimation onAnimationComplete={handleCartAnimationComplete} />
              <CookieConsent />
            </div>
          </WishlistProvider>
        </CartProvider>
      </CookieConsentProvider>
    </AgeVerification>
  );
};
