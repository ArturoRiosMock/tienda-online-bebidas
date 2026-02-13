import React, { useState } from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Cart = ({ isOpen, onClose }: CartProps) => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = () => {
    setShowCheckout(true);
    setTimeout(() => {
      clearCart();
      setShowCheckout(false);
      onClose();
      alert('¡Gracias por tu compra! Tu pedido ha sido procesado exitosamente.');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full shadow-xl flex flex-col">
        {/* Header */}
        <div className="bg-[#0c3c1f] text-white p-6 flex items-center justify-between">
          <h2>Carrito de Compras</h2>
          <button
            onClick={onClose}
            className="hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[#717182]">
              <p>Tu carrito está vacío</p>
              <p className="text-sm mt-2">¡Agrega productos para comenzar!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-lg p-4 flex gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-[#212121] mb-1">{item.name}</h3>
                    <p className="text-[#0c3c1f] mb-2">${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="bg-white border border-gray-200 p-1 rounded hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-[#212121] min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="bg-white border border-gray-200 p-1 rounded hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto text-red-500 hover:text-red-600 p-1"
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

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between text-[#212121]">
              <span>Total:</span>
              <span className="text-[#0c3c1f]">${getTotalPrice().toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={showCheckout}
              className="w-full bg-[#0c3c1f] text-white py-3 rounded-lg hover:bg-[#0a3019] transition-colors disabled:opacity-50"
            >
              {showCheckout ? 'Procesando...' : 'Finalizar Compra'}
            </button>
            <button
              onClick={clearCart}
              className="w-full border border-gray-300 text-[#212121] py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Vaciar Carrito
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
