import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { CartProvider } from '@/app/context/CartContext';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { WhatsAppButton } from '@/app/components/WhatsAppButton';
import { Cart } from '@/app/components/Cart';

export const MainLayout: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  const handleCategoryClick = (collectionHandle: string) => {
    if (collectionHandle === 'Todos') {
      navigate('/');
    } else {
      navigate(`/categorias/${collectionHandle}`);
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header
          onCartClick={() => setIsCartOpen(true)}
          onCategoryClick={handleCategoryClick}
        />

        <main className="flex-1">
          <Outlet />
        </main>

        <Footer />
        <WhatsAppButton />
        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </CartProvider>
  );
};
