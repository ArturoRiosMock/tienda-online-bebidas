import { useEffect, useState } from 'react';
import { useCart } from '@/app/context/CartContext';
import { PurchaseTypeDialog, type EventFormData } from './PurchaseTypeDialog';
import { CartShell } from '@/app/components/purchase/CartShell';
import { confirmCartCheckout } from '@/app/components/purchase/confirmCartCheckout';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Cart = ({ isOpen, onClose }: CartProps) => {
  const cart = useCart();
  const [showPurchaseType, setShowPurchaseType] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    const reset = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      setCheckoutLoading(false);
      setShowPurchaseType(false);
    };
    window.addEventListener('pageshow', reset);
    return () => window.removeEventListener('pageshow', reset);
  }, []);

  const itemId = (item: { lineId?: string; id: number | string }) =>
    item.lineId ?? item.id;

  const handleCheckout = () => {
    if (cart.isShopifyCart && cart.goToCheckout) {
      setShowPurchaseType(true);
      return;
    }
    cart.clearCart();
    onClose();
  };

  const closeCartFlow = () => {
    setShowPurchaseType(false);
    onClose();
  };

  const handleConfirm = (eventData: EventFormData | null) => {
    setCheckoutLoading(true);
    return confirmCartCheckout({
      eventData,
      updateAttributes: cart.updateAttributes,
      goToCheckout: cart.goToCheckout,
      onSuccess: closeCartFlow,
    }).finally(() => setCheckoutLoading(false));
  };

  return (
    <>
      <CartShell
        isOpen={isOpen}
        onClose={onClose}
        cartItems={cart.cartItems}
        cartLoading={cart.cartLoading}
        cartError={cart.cartError}
        totalItems={cart.getTotalItems()}
        totalPrice={cart.getTotalPrice()}
        isShopifyCart={cart.isShopifyCart}
        onCheckout={handleCheckout}
        onClear={cart.clearCart}
        itemId={itemId}
        updateQuantity={cart.updateQuantity}
        removeFromCart={cart.removeFromCart}
      />
      <PurchaseTypeDialog
        open={showPurchaseType}
        onClose={() => setShowPurchaseType(false)}
        onConfirm={handleConfirm}
        loading={checkoutLoading}
        error={cart.cartError}
        onLeaveToQuote={closeCartFlow}
      />
    </>
  );
};
