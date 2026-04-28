import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <p className="text-7xl font-bold text-[#0c3c1f] mb-4">404</p>
        <h1 className="text-xl font-semibold text-[#212121] mb-2">Página no encontrada</h1>
        <p className="text-[#717182] text-sm mb-6">
          La dirección{' '}
          <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded break-all">
            {pathname}
          </span>{' '}
          no existe en la tienda.
        </p>
        <Link
          to="/"
          className="inline-block bg-[#0c3c1f] text-white px-8 py-3 rounded-lg hover:bg-[#0a3019] transition-colors font-medium"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};
