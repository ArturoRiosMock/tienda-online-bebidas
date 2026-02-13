import React from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Cart = ({ isOpen, onClose }: CartProps) => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    clearCart,
    goToCheckout,
    isShopifyCart,
    cartLoading,
    cartError,
  } = useCart();

  if (!isOpen) return null;

  const itemId = (item: { lineId?: string; id: number | string }) => item.lineId ?? item.id;

  const handleCheckout = () => {
    if (isShopifyCart && goToCheckout) {
      goToCheckout();
      onClose();
      return;
    }
    clearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full shadow-xl flex flex-col">
        <div className="bg-[#0c3c1f] text-white p-6 flex items-center justify-between">
          <h2>Carrito de Compras</h2>
          <button
            onClick={onClose}
            className="hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {cartError && (
          <div className="mx-4 mt-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {cartError}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {cartLoading && cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-[#717182]">
              <p>Cargando carrito...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[#717182]">
              <p>Tu carrito está vacío</p>
              <p className="text-sm mt-2">¡Agrega productos para comenzar!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => (
                <div
                  key={item.lineId ?? String(item.id)}
                  className="bg-gray-50 rounded-lg p-4 flex gap-4"
                >
                  <img
                    src={item.image || 'https://placehold.co/80x80?text=Sin+imagen'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-[#212121] mb-1">{item.name}</h3>
                    <p className="text-[#0c3c1f] mb-2">${item.price.toFixed(2)} MXN</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(itemId(item), item.quantity - 1)}
                        disabled={cartLoading}
                        className="bg-white border border-gray-200 p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-[#212121] min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(itemId(item), item.quantity + 1)}
                        disabled={cartLoading}
                        className="bg-white border border-gray-200 p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFromCart(itemId(item))}
                        disabled={cartLoading}
                        className="ml-auto text-red-500 hover:text-red-600 p-1 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between text-[#212121]">
              <span>Total:</span>
              <span className="text-[#0c3c1f]">${getTotalPrice().toFixed(2)} MXN</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={cartLoading}
              className="w-full bg-[#0c3c1f] text-white py-3 rounded-lg hover:bg-[#0a3019] transition-colors disabled:opacity-50"
            >
              {isShopifyCart ? 'Ir a pagar (Shopify)' : 'Finalizar Compra'}
            </button>
            <button
              onClick={clearCart}
              disabled={cartLoading}
              className="w-full border border-gray-300 text-[#212121] py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Vaciar Carrito
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
