/** Pedido mínimo semanal antes de IVA (MXN), según política B2B de Bebify */
export const MIN_ORDER_SUBTOTAL_MXN = 3000;

export const MIN_ORDER_LABEL = '$3,000 + IVA';

export interface MinimumOrderStatus {
  meetsMinimum: boolean;
  subtotal: number;
  minimum: number;
  remaining: number;
}

export const getMinimumOrderStatus = (subtotal: number): MinimumOrderStatus => {
  const minimum = MIN_ORDER_SUBTOTAL_MXN;
  const remaining = Math.max(0, minimum - subtotal);

  return {
    meetsMinimum: subtotal >= minimum,
    subtotal,
    minimum,
    remaining,
  };
};

export const formatMinimumOrderMessage = (status: MinimumOrderStatus): string => {
  if (status.meetsMinimum) {
    return '';
  }

  return `El pedido mínimo es de ${MIN_ORDER_LABEL}. Te faltan $${status.remaining.toFixed(2)} MXN para continuar.`;
};
