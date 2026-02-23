import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';

interface FlyingItem {
  id: number;
  image: string;
  name: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface ToastData {
  id: number;
  name: string;
  image: string;
}

interface AddToCartAnimationProps {
  onAnimationComplete: () => void;
}

export const AddToCartAnimation: React.FC<AddToCartAnimationProps> = ({ onAnimationComplete }) => {
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [toast, setToast] = useState<ToastData | null>(null);
  const lastClickPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      lastClickPos.current = { x: e.clientX, y: e.clientY };
    };
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, []);

  const handleItemAdded = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail;
    const cartIcon = document.querySelector('[data-cart-icon]');
    const cartRect = cartIcon?.getBoundingClientRect();

    const endX = cartRect ? cartRect.left + cartRect.width / 2 : window.innerWidth - 60;
    const endY = cartRect ? cartRect.top + cartRect.height / 2 : 40;

    const itemId = Date.now();

    setFlyingItems(prev => [...prev, {
      id: itemId,
      image: detail.image,
      name: detail.name,
      startX: lastClickPos.current.x,
      startY: lastClickPos.current.y,
      endX,
      endY,
    }]);

    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ id: itemId, name: detail.name, image: detail.image });
    toastTimer.current = setTimeout(() => setToast(null), 2500);

    setTimeout(() => {
      setFlyingItems(prev => prev.filter(i => i.id !== itemId));
    }, 700);

    setTimeout(() => {
      cartIcon?.classList.add('cart-icon-bounce');
      setTimeout(() => cartIcon?.classList.remove('cart-icon-bounce'), 600);
    }, 500);

    setTimeout(onAnimationComplete, 800);
  }, [onAnimationComplete]);

  useEffect(() => {
    window.addEventListener('cart:item-added', handleItemAdded);
    return () => window.removeEventListener('cart:item-added', handleItemAdded);
  }, [handleItemAdded]);

  return (
    <>
      {flyingItems.map(item => (
        <motion.div
          key={item.id}
          className="fixed z-[100] pointer-events-none"
          initial={{
            left: item.startX - 25,
            top: item.startY - 25,
            scale: 1,
            opacity: 1,
          }}
          animate={{
            left: item.endX - 12,
            top: item.endY - 12,
            scale: 0.25,
            opacity: 0.7,
          }}
          transition={{ duration: 0.6, ease: [0.22, 0.68, 0, 1.1] }}
        >
          <div className="w-[50px] h-[50px] rounded-full bg-white shadow-xl border-2 border-[#0c3c1f] overflow-hidden flex items-center justify-center">
            <img src={item.image} alt="" className="w-full h-full object-contain p-1" />
          </div>
        </motion.div>
      ))}

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-20 right-4 z-[90] bg-white rounded-xl shadow-2xl border border-green-100 p-3 flex items-center gap-3 max-w-[280px]"
          >
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-green-200">
              <Check className="w-5 h-5 text-green-600" strokeWidth={3} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-green-700">Agregado al carrito</p>
              <p className="text-[11px] text-gray-500 truncate">{toast.name}</p>
            </div>
            <img src={toast.image} alt="" className="w-9 h-9 object-contain flex-shrink-0 rounded" />
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes cartBounce {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.3); }
          50% { transform: scale(0.9); }
          75% { transform: scale(1.15); }
        }
        .cart-icon-bounce {
          animation: cartBounce 0.5s ease;
        }
      `}</style>
    </>
  );
};
