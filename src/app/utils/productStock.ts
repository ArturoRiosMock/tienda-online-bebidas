/** Producto disponible para venta (Shopify availableForSale). */
export const isProductInStock = (product: { inStock?: boolean }): boolean =>
  product.inStock !== false;
