import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

export function CartPageEmpty() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
      <ShoppingBag
        className="w-16 h-16 text-gray-200 mx-auto mb-4"
        aria-hidden
      />
      <p className="text-lg text-[#717182] mb-6">
        Tu carrito está vacío en este momento.
      </p>
      <Link
        to="/productos"
        className="inline-block bg-[#0c3c1f] text-white px-6 py-3 rounded-lg hover:bg-[#0a3019] transition-colors font-medium"
      >
        Continuar comprando
      </Link>
    </div>
  );
}

export function CartPageLoading() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-[#717182]">
      Cargando carrito…
    </div>
  );
}
