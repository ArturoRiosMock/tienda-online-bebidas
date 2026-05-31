import { shopifyClient, GET_PRODUCTS, GET_PRODUCTS_BY_COLLECTION, GET_PRODUCT_BY_HANDLE, GET_COLLECTIONS, SEARCH_PRODUCTS, SEARCH_PRODUCTS_BY_TAG } from './queries';
import type { ShopifyProduct, ShopifyCollection, Product } from './types';

/**
 * Servicio para interactuar con Shopify Storefront API
 */

// Convierte un producto de Shopify al formato de la app
export const convertShopifyProductToAppProduct = (shopifyProduct: ShopifyProduct): Product => {
  const firstVariant = shopifyProduct.variants.edges[0]?.node;
  const firstImage = shopifyProduct.images.edges[0]?.node;
  
  const price = parseFloat(shopifyProduct.priceRange.minVariantPrice.amount);
  const compareAtPrice = firstVariant?.compareAtPrice 
    ? parseFloat(firstVariant.compareAtPrice.amount) 
    : null;

  const allImages = shopifyProduct.images.edges.map(e => e.node.url).filter(Boolean);

  return {
    id: parseInt(shopifyProduct.id.split('/').pop() || '0'),
    name: shopifyProduct.title,
    price: price,
    originalPrice: compareAtPrice || undefined,
    category: shopifyProduct.productType || 'General',
    vendor: shopifyProduct.vendor?.trim() || undefined,
    inStock: firstVariant?.availableForSale ?? true,
    description: shopifyProduct.description,
    descriptionHtml: shopifyProduct.descriptionHtml || undefined,
    image: firstImage?.url || '',
    images: allImages.length > 0 ? allImages : undefined,
    shopifyId: shopifyProduct.id,
    variantId: firstVariant?.id,
    handle: shopifyProduct.handle
  };
};

// Obtener una página de productos (cursor-based)
export const getProductsPage = async (
  first: number = 50,
  after: string | null = null
): Promise<{
  products: Product[];
  hasNextPage: boolean;
  endCursor: string | null;
}> => {
  try {
    const data: any = await shopifyClient.request(GET_PRODUCTS, {
      first,
      after: after || undefined,
    });

    const edges = data.products.edges;

    return {
      products: edges.map((edge: any) => convertShopifyProductToAppProduct(edge.node)),
      hasNextPage: data.products.pageInfo.hasNextPage,
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
    };
  } catch (error) {
    console.error('Error fetching products from Shopify:', error);
    return { products: [], hasNextPage: false, endCursor: null };
  }
};

// Obtener todos los productos paginando la Storefront API
export const getAllProducts = async (pageSize: number = 50): Promise<Product[]> => {
  const allProducts: Product[] = [];
  let after: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const page = await getProductsPage(pageSize, after);
    allProducts.push(...page.products);
    hasNextPage = page.hasNextPage;
    after = page.endCursor;

    if (hasNextPage && !after) {
      break;
    }
  }

  return allProducts;
};

// Obtener productos (primera página)
export const getProducts = async (first: number = 20): Promise<Product[]> => {
  const { products } = await getProductsPage(first);
  return products;
};

// Obtener una página de productos de una colección
export const getProductsByCollectionPage = async (
  collectionHandle: string,
  first: number = 50,
  after: string | null = null
): Promise<{
  products: Product[];
  hasNextPage: boolean;
  endCursor: string | null;
}> => {
  try {
    const data: any = await shopifyClient.request(GET_PRODUCTS_BY_COLLECTION, {
      handle: collectionHandle,
      first,
      after: after || undefined,
    });

    if (!data.collection) {
      return { products: [], hasNextPage: false, endCursor: null };
    }

    const edges = data.collection.products.edges;

    return {
      products: edges.map((edge: any) => convertShopifyProductToAppProduct(edge.node)),
      hasNextPage: data.collection.products.pageInfo.hasNextPage,
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
    };
  } catch (error) {
    console.error('Error fetching products by collection from Shopify:', error);
    return { products: [], hasNextPage: false, endCursor: null };
  }
};

// Obtener todos los productos de una colección
export const getAllProductsByCollection = async (
  collectionHandle: string,
  pageSize: number = 50
): Promise<Product[]> => {
  const allProducts: Product[] = [];
  let after: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const page = await getProductsByCollectionPage(collectionHandle, pageSize, after);
    allProducts.push(...page.products);
    hasNextPage = page.hasNextPage;
    after = page.endCursor;

    if (hasNextPage && !after) {
      break;
    }
  }

  return allProducts;
};

// Obtener productos por colección/categoría (primera página)
export const getProductsByCollection = async (collectionHandle: string, first: number = 20): Promise<Product[]> => {
  const { products } = await getProductsByCollectionPage(collectionHandle, first);
  return products;
};

// Obtener un producto por handle
export const getProductByHandle = async (handle: string): Promise<Product | null> => {
  try {
    const data: any = await shopifyClient.request(GET_PRODUCT_BY_HANDLE, { handle });
    
    if (!data.product) {
      return null;
    }

    return convertShopifyProductToAppProduct(data.product);
  } catch (error) {
    console.error('Error fetching product by handle:', error);
    return null;
  }
};

// Obtener todas las colecciones
export const getCollections = async (first: number = 20): Promise<ShopifyCollection[]> => {
  try {
    const data: any = await shopifyClient.request(GET_COLLECTIONS, { first });
    
    return data.collections.edges.map((edge: any) => edge.node);
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
};

// Obtener todos los productos de múltiples colecciones, deduplicados por ID (colección virtual)
export const getAllProductsByVirtualCollection = async (
  handles: string[],
  pageSize: number = 50,
): Promise<Product[]> => {
  const pages = await Promise.all(handles.map((h) => getAllProductsByCollection(h, pageSize)));
  const seen = new Set<string>();
  const merged: Product[] = [];

  for (const batch of pages) {
    for (const product of batch) {
      const key = product.shopifyId ?? String(product.id);
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(product);
      }
    }
  }

  return merged;
};

// Obtener productos por tag usando la Storefront Search API
export const getProductsByTag = async (tag: string, pageSize: number = 50): Promise<Product[]> => {
  const allProducts: Product[] = [];
  let after: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    try {
      const data: any = await shopifyClient.request(SEARCH_PRODUCTS_BY_TAG, {
        query: `tag:"${tag}"`,
        first: pageSize,
        after: after || undefined,
      });

      const edges = data.search.edges;
      const products = edges
        .map((e: any) => e.node)
        .filter((n: any) => n && n.id)
        .map((n: any) => convertShopifyProductToAppProduct(n));

      allProducts.push(...products);
      hasNextPage = data.search.pageInfo.hasNextPage;
      after = edges.length > 0 ? edges[edges.length - 1].cursor : null;

      if (hasNextPage && !after) break;
    } catch (error) {
      console.error('Error fetching products by tag:', error);
      break;
    }
  }

  return allProducts;
};

// Buscar productos
export const searchProducts = async (query: string, first: number = 20): Promise<Product[]> => {
  try {
    const data: any = await shopifyClient.request(SEARCH_PRODUCTS, { query, first });
    
    return data.search.edges.map((edge: any) => 
      convertShopifyProductToAppProduct(edge.node)
    );
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};

// Mapeo de categorías de la app a handles de colecciones en Shopify
// NOTA: Debes ajustar estos handles según las colecciones reales en tu tienda Shopify
export const CATEGORY_TO_COLLECTION_MAP: Record<string, string> = {
  'Whisky': 'whisky',
  'Vino': 'vino',
  'Espumante': 'espumante',
  'Licor': 'licor',
  'Gin': 'gin',
  'Vodka': 'vodka',
  'Champagne': 'champagne',
  'Miniatura': 'miniatura',
  'Jugos': 'jugos',
  'Café': 'cafe',
  'Refrescos': 'refrescos',
  'Energizantes': 'energizantes',
  'Smoothies': 'smoothies',
  'Agua': 'agua',
  'Té': 'te'
};

// Obtener productos por categoría (usando el mapeo)
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const collectionHandle = CATEGORY_TO_COLLECTION_MAP[category];
  
  if (!collectionHandle) {
    console.warn(`No collection mapping found for category: ${category}`);
    return [];
  }

  return getProductsByCollection(collectionHandle);
};
