// Tipos para productos de Shopify
export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  descriptionHtml: string;
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

// Tipos para Blog / Articles
export interface ShopifyImageRef {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
}

export interface ShopifyBlogRef {
  id: string;
  handle: string;
  title: string;
}

export interface ShopifyArticleListNode {
  id: string;
  handle: string;
  title: string;
  excerpt: string | null;
  excerptHtml: string | null;
  publishedAt: string;
  tags: string[];
  image: ShopifyImageRef | null;
  authorV2: { name: string } | null;
  blog: ShopifyBlogRef;
}

export interface ShopifyArticleDetail {
  id: string;
  handle: string;
  title: string;
  content: string;
  contentHtml: string;
  excerpt: string | null;
  excerptHtml: string | null;
  publishedAt: string;
  tags: string[];
  image: ShopifyImageRef | null;
  authorV2: { name: string; bio: string | null } | null;
  blog: ShopifyBlogRef;
}

/** Modelo plano que usa la app para renderizar tarjetas de artículo */
export interface BlogArticle {
  id: string;
  handle: string;
  title: string;
  excerpt: string;
  excerptHtml?: string;
  publishedAt: string;
  tags: string[];
  image: string | null;
  imageAlt: string;
  author: string | null;
  blogHandle: string;
  blogTitle: string;
}

/** Modelo plano para el detalle */
export interface BlogArticleDetail extends BlogArticle {
  contentHtml: string;
  authorBio: string | null;
}

// Tipo convertido al formato de la app
export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  /** Marca / proveedor (Shopify vendor) */
  vendor?: string;
  /** Primera variante disponible para venta */
  inStock?: boolean;
  description: string;
  descriptionHtml?: string;
  image: string;
  images?: string[];
  shopifyId?: string;
  variantId?: string;
  handle?: string;
  /** Tamaño del empaque según la variante (ej. "12 Botellas") */
  packLabel?: string;
}
