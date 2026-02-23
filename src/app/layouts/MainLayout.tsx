import React, { useState, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { CartProvider } from '@/app/context/CartContext';
import { WishlistProvider } from '@/app/context/WishlistContext';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { WhatsAppButton } from '@/app/components/WhatsAppButton';
import { Cart } from '@/app/components/Cart';
import { WishlistDrawer } from '@/app/components/WishlistDrawer';
import { AddToCartAnimation } from '@/app/components/AddToCartAnimation';

export const MainLayout: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const navigate = useNavigate();

  const handleCategoryClick = (collectionHandle: string) => {
    if (collectionHandle === 'Todos') {
      navigate('/');
    } else {
      navigate(`/categorias/${collectionHandle}`);
    }
  };

  const handleCartAnimationComplete = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  return (
    <CartProvider>
      <WishlistProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden max-w-[100vw]">
          <Header
            onCartClick={() => setIsCartOpen(true)}
            onWishlistClick={() => setIsWishlistOpen(true)}
            onCategoryClick={handleCategoryClick}
          />

          <main className="flex-1">
            <Outlet />
          </main>

          <Footer />
          <WhatsAppButton />
          <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
          <AddToCartAnimation onAnimationComplete={handleCartAnimationComplete} />
        </div>
      </WishlistProvider>
    </CartProvider>
  );
};
