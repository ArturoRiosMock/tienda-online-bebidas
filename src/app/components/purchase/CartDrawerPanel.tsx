import { X, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import type { CartItem } from '@/app/context/CartContext';
import { CartDrawerBody } from './CartDrawerBody';
import { CartDrawerFooter } from './CartDrawerFooter';

interface CartDrawerPanelProps {
  cartItems: CartItem[];
  cartLoading: boolean;
  cartError: string | null;
  totalItems: number;
  totalPrice: number;
  isShopifyCart: boolean;
  onClose: () => void;
  onCheckout: () => void;
  onClear: () => void;
  itemId: (item: CartItem) => string | number;
  updateQuantity: (id: string | number, qty: number) => void;
  removeFromCart: (id: string | number) => void;
}

export function CartDrawerPanel({
  cartItems,
  cartLoading,
  cartError,
  totalItems,
  totalPrice,
  isShopifyCart,
  onClose,
  onCheckout,
  onClear,
  itemId,
  updateQuantity,
  removeFromCart,
}: CartDrawerPanelProps) {
  return (
    <motion.div
      key="cart-drawer"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
    >
      <div className="bg-[#0c3c1f] text-white p-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          <h2 className="text-lg font-bold">Carrito ({totalItems})</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="hover:bg-white/10 p-2 rounded-lg transition-colors"
          aria-label="Cerrar carrito"
        >
          <X className="w-5 h-5" aria-hidden />
        </button>
      </div>

      {cartError ? (
        <div className="mx-4 mt-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {cartError}
        </div>
      ) : null}

      <div className="flex-1 overflow-y-auto p-4">
        <CartDrawerBody
          cartItems={cartItems}
          cartLoading={cartLoading}
          itemId={itemId}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
        />
      </div>

      {cartItems.length > 0 ? (
        <CartDrawerFooter
          total={totalPrice}
          cartLoading={cartLoading}
          isShopifyCart={isShopifyCart}
          onCheckout={onCheckout}
          onClear={onClear}
        />
      ) : null}
    </motion.div>
  );
}
