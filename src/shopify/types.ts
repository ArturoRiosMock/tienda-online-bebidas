// Tipos para productos de Shopify
export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  productType: string;
  vendor: string;
  tags: string[];
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: ShopifyVariant;
    }>;
  };
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice: {
    amount: string;
    currencyCode: string;
  } | null;
  availableForSale: boolean;
  image: {
    url: string;
    altText: string | null;
  } | null;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

// Tipo para colecciones
export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: {
    url: string;
    altText: string | null;
  } | null;
  products: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
  };
}

// Tipos para el carrito
export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  cost: {
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalTaxAmount: {
      amount: string;
      currencyCode: string;
    } | null;
  };
  lines: {
    edges: Array<{
      node: ShopifyCartLine;
    }>;
  };
  totalQuantity: number;
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      id: string;
      title: string;
      handle: string;
    };
    image: {
      url: string;
      altText: string | null;
    } | null;
    price: {
      amount: string;
      currencyCode: string;
    };
  };
}

// Tipo para checkout
export interface ShopifyCheckout {
  id: string;
  webUrl: string;
  ready: boolean;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
}

// Tipo convertido al formato de la app
export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  description: string;
  image: string;
  shopifyId?: string;
  variantId?: string;
  handle?: string;
}
