import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem } from '@/app/context/CartContext';

interface CartPageLineProps {
  item: CartItem;
  disabled: boolean;
  onDec: () => void;
  onInc: () => void;
  onRemove: () => void;
}

export function CartPageLine({
  item,
  disabled,
  onDec,
  onInc,
  onRemove,
}: CartPageLineProps) {
  return (
    <li className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4">
      <img
        src={item.image || 'https://placehold.co/96x96?text=Sin+imagen'}
        alt={item.name}
        className="w-20 h-20 object-contain rounded-lg bg-gray-50 p-1 shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#212121] line-clamp-2">
          {item.name}
        </p>
        {item.cantidadLabel ? (
          <p className="text-xs text-[#717182] mt-1">{item.cantidadLabel}</p>
        ) : null}
        <p className="text-[#0c3c1f] font-bold mt-2">
          ${item.price.toFixed(2)} MXN
        </p>
        <div className="flex items-center gap-2 mt-3">
          <button
            type="button"
            onClick={onDec}
            disabled={disabled}
            className="bg-gray-50 border border-gray-200 p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-50"
            aria-label={`Disminuir cantidad de ${item.name}`}
          >
            <Minus className="w-4 h-4" aria-hidden />
          </button>
          <span className="min-w-[1.5rem] text-center text-sm font-medium">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={onInc}
            disabled={disabled}
            className="bg-gray-50 border border-gray-200 p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-50"
            aria-label={`Aumentar cantidad de ${item.name}`}
          >
            <Plus className="w-4 h-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            className="ml-auto text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-md disabled:opacity-50"
            aria-label={`Eliminar ${item.name}`}
          >
            <Trash2 className="w-4 h-4" aria-hidden />
          </button>
        </div>
      </div>
    </li>
  );
}

interface CartPageFilledProps {
  cartItems: CartItem[];
  cartLoading: boolean;
  isShopifyCart: boolean;
  total: number;
  itemId: (item: CartItem) => string | number;
  updateQuantity: (id: string | number, qty: number) => void;
  removeFromCart: (id: string | number) => void;
  onCheckout: () => void;
  onClear: () => void;
}

export function CartPageFilled({
  cartItems,
  cartLoading,
  isShopifyCart,
  total,
  itemId,
  updateQuantity,
  removeFromCart,
  onCheckout,
  onClear,
}: CartPageFilledProps) {
  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {cartItems.map((item) => (
          <CartPageLine
            key={item.lineId ?? String(item.id)}
            item={item}
            disabled={cartLoading}
            onDec={() => updateQuantity(itemId(item), item.quantity - 1)}
            onInc={() => updateQuantity(itemId(item), item.quantity + 1)}
            onRemove={() => removeFromCart(itemId(item))}
          />
        ))}
      </ul>
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div className="flex items-center justify-between text-lg">
          <span className="font-medium text-[#212121]">Total</span>
          <span className="text-[#0c3c1f] text-xl font-bold">
            ${total.toFixed(2)} MXN
          </span>
        </div>
        <button
          type="button"
          onClick={onCheckout}
          disabled={cartLoading}
          className="w-full bg-[#0c3c1f] text-white py-3.5 rounded-lg hover:bg-[#0a3019] transition-colors disabled:opacity-50 font-bold text-base"
        >
          {isShopifyCart ? 'Continuar al pago' : 'Finalizar compra'}
        </button>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/productos"
            className="flex-1 text-center border border-gray-300 text-[#212121] py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Seguir comprando
          </Link>
          <button
            type="button"
            onClick={onClear}
            disabled={cartLoading}
            className="flex-1 border border-gray-300 text-[#717182] py-2.5 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm"
          >
            Vaciar carrito
          </button>
        </div>
      </div>
    </div>
  );
}
