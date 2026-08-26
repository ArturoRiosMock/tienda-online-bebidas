import { Minus, Plus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import type { CartItem } from '@/app/context/CartContext';

interface CartDrawerLineProps {
  item: CartItem;
  disabled: boolean;
  onDec: () => void;
  onInc: () => void;
  onRemove: () => void;
}

export function CartDrawerLine({
  item,
  disabled,
  onDec,
  onInc,
  onRemove,
}: CartDrawerLineProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.9 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="bg-gray-50 rounded-xl p-3 flex gap-3 border border-gray-100"
    >
      <img
        src={item.image || 'https://placehold.co/80x80?text=Sin+imagen'}
        alt={item.name}
        className="w-18 h-18 object-contain rounded-lg bg-white p-1"
      />
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-[#212121] line-clamp-2 mb-1">
          {item.name}
        </h3>
        {item.cantidadLabel ? (
          <p className="text-xs text-[#717182] mb-1">
            <span className="font-semibold text-[#212121]">Cantidad:</span>{' '}
            {item.cantidadLabel}
          </p>
        ) : null}
        <p className="text-[#0c3c1f] font-bold mb-2">
          ${item.price.toFixed(2)} MXN
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDec}
            disabled={disabled}
            className="bg-white border border-gray-200 p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
            aria-label={`Disminuir cantidad de ${item.name}`}
          >
            <Minus className="w-3.5 h-3.5" aria-hidden />
          </button>
          <span className="text-[#212121] font-medium min-w-[1.5rem] text-center text-sm">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={onInc}
            disabled={disabled}
            className="bg-white border border-gray-200 p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
            aria-label={`Aumentar cantidad de ${item.name}`}
          >
            <Plus className="w-3.5 h-3.5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            className="ml-auto text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-md disabled:opacity-50"
            aria-label={`Eliminar ${item.name} del carrito`}
          >
            <Trash2 className="w-4 h-4" aria-hidden />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
