import { motion, AnimatePresence } from 'motion/react';
import type { CartItem } from '@/app/context/CartContext';
import { CartDrawerPanel } from './CartDrawerPanel';

interface CartShellProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  cartLoading: boolean;
  cartError: string | null;
  totalItems: number;
  totalPrice: number;
  isShopifyCart: boolean;
  onCheckout: () => void;
  onClear: () => void;
  itemId: (item: CartItem) => string | number;
  updateQuantity: (id: string | number, qty: number) => void;
  removeFromCart: (id: string | number) => void;
}

export function CartShell(props: CartShellProps) {
  const { isOpen, onClose, ...panel } = props;
  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            key="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <CartDrawerPanel {...panel} onClose={onClose} />
        </>
      ) : null}
    </AnimatePresence>
  );
}
