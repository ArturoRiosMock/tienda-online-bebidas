import { useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { useCart } from '@/app/context/CartContext';
import { useDocumentMeta } from '@/app/hooks/useDocumentMeta';
import { PurchaseTypeDialog, type EventFormData } from '@/app/components/PurchaseTypeDialog';
import { confirmCartCheckout } from '@/app/components/purchase/confirmCartCheckout';
import { useSharedCartImport } from '@/app/components/purchase/useSharedCartImport';
import { CartPageFilled } from '@/app/components/purchase/CartPageFilled';
import {
  CartPageEmpty,
  CartPageLoading,
} from '@/app/components/purchase/CartPageStates';

function CartPageContent({
  isLoading,
  hasItems,
  filled,
}: {
  isLoading: boolean;
  hasItems: boolean;
  filled: ReactNode;
}) {
  if (isLoading) return <CartPageLoading />;
  if (!hasItems) return <CartPageEmpty />;
  return <>{filled}</>;
}

export function CartPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const cartLinkId = searchParams.get('cart_link_id');
  const cart = useCart();
  const { importState, importError } = useSharedCartImport(
    cartLinkId,
    cart.importSharedCart,
    searchParams,
    setSearchParams,
  );
  const [showPurchaseType, setShowPurchaseType] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useDocumentMeta({
    title: 'Carrito de compras',
    description:
      'Revisa los productos en tu carrito y continúa al pago en Mr. Brown.',
    canonicalPath: '/cart',
  });

  const itemId = (item: { lineId?: string; id: number | string }) =>
    item.lineId ?? item.id;

  const handleCheckout = () => {
    if (cart.isShopifyCart && cart.goToCheckout) {
      setShowPurchaseType(true);
      return;
    }
    cart.clearCart();
  };

  const handleConfirm = (eventData: EventFormData | null) => {
    setCheckoutLoading(true);
    return confirmCartCheckout({
      eventData,
      updateAttributes: cart.updateAttributes,
      goToCheckout: cart.goToCheckout,
      onSuccess: () => setShowPurchaseType(false),
    }).finally(() => setCheckoutLoading(false));
  };

  const isLoading =
    importState === 'loading' ||
    (!cartLinkId &&
      cart.cartLoading &&
      cart.cartItems.length === 0 &&
      importState === 'idle');
  const displayError = importError || cart.cartError;

  return (
    <div className="min-h-[60vh] bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumbs
            items={[
              { label: 'Inicio', to: '/' },
              { label: 'Carrito', to: '/cart' },
            ]}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingBag className="w-7 h-7 text-[#0c3c1f]" aria-hidden />
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0c3c1f]">
            Carrito de compras
            {cart.getTotalItems() > 0 ? ` (${cart.getTotalItems()})` : ''}
          </h1>
        </div>

        {importState === 'loading' ? (
          <div className="mb-6 rounded-xl border border-[#0c3c1f]/20 bg-[#0c3c1f]/5 px-4 py-3 text-sm text-[#0c3c1f]">
            Importando carrito compartido…
          </div>
        ) : null}

        {displayError ? (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {displayError}
          </div>
        ) : null}

        <CartPageContent
          isLoading={isLoading && cart.cartItems.length === 0}
          hasItems={cart.cartItems.length > 0}
          filled={
            <CartPageFilled
              cartItems={cart.cartItems}
              cartLoading={cart.cartLoading}
              isShopifyCart={cart.isShopifyCart}
              total={cart.getTotalPrice()}
              itemId={itemId}
              updateQuantity={cart.updateQuantity}
              removeFromCart={cart.removeFromCart}
              onCheckout={handleCheckout}
              onClear={cart.clearCart}
            />
          }
        />
      </div>

      <PurchaseTypeDialog
        open={showPurchaseType}
        onClose={() => setShowPurchaseType(false)}
        onConfirm={handleConfirm}
        loading={checkoutLoading}
        error={cart.cartError}
      />
    </div>
  );
}
