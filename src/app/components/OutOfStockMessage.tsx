import React from 'react';

interface OutOfStockMessageProps {
  className?: string;
  compact?: boolean;
}

export const OutOfStockMessage: React.FC<OutOfStockMessageProps> = ({
  className = '',
  compact = false,
}) => (
  <p
    className={`font-semibold text-red-600 ${compact ? 'text-xs' : 'text-sm'} ${className}`}
    role="status"
  >
    Producto agotado
  </p>
);
