import { motion } from 'motion/react';

interface CartDrawerFooterProps {
  total: number;
  cartLoading: boolean;
  isShopifyCart: boolean;
  onCheckout: () => void;
  onClear: () => void;
}

export function CartDrawerFooter({
  total,
  cartLoading,
  isShopifyCart,
  onCheckout,
  onClear,
}: CartDrawerFooterProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.15 }}
      className="border-t border-gray-200 p-4 space-y-3"
    >
      <div className="flex items-center justify-between text-[#212121]">
        <span className="font-medium">Total:</span>
        <span className="text-[#0c3c1f] text-xl font-bold">
          ${total.toFixed(2)} MXN
        </span>
      </div>
      <button
        type="button"
        onClick={onCheckout}
        disabled={cartLoading}
        className="w-full bg-[#0c3c1f] text-white py-3 rounded-lg hover:bg-[#0a3019] transition-colors disabled:opacity-50 font-bold text-base"
      >
        {isShopifyCart ? 'Ir a pagar' : 'Finalizar Compra'}
      </button>
      <button
        type="button"
        onClick={onClear}
        disabled={cartLoading}
        className="w-full border border-gray-300 text-[#717182] py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm"
      >
        Vaciar Carrito
      </button>
    </motion.div>
  );
}
