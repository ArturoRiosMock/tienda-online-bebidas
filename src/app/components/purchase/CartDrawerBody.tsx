import { ShoppingBag } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import type { CartItem } from '@/app/context/CartContext';
import { CartDrawerLine } from './CartDrawerLine';

interface CartDrawerBodyProps {
  cartItems: CartItem[];
  cartLoading: boolean;
  itemId: (item: CartItem) => string | number;
  updateQuantity: (id: string | number, qty: number) => void;
  removeFromCart: (id: string | number) => void;
}

export function CartDrawerBody({
  cartItems,
  cartLoading,
  itemId,
  updateQuantity,
  removeFromCart,
}: CartDrawerBodyProps) {
  if (cartLoading && cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-[#717182]">
        <p>Cargando carrito...</p>
      </div>
    );
  }
  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-[#717182]">
        <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
        <p className="text-lg">Tu carrito está vacío</p>
        <p className="text-sm mt-2">¡Agrega productos para comenzar!</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {cartItems.map((item) => (
          <CartDrawerLine
            key={item.lineId ?? String(item.id)}
            item={item}
            disabled={cartLoading}
            onDec={() => updateQuantity(itemId(item), item.quantity - 1)}
            onInc={() => updateQuantity(itemId(item), item.quantity + 1)}
            onRemove={() => removeFromCart(itemId(item))}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
