import { shopifyClient, GET_PRODUCTS, GET_PRODUCTS_BY_COLLECTION, GET_PRODUCT_BY_HANDLE, GET_COLLECTIONS, SEARCH_PRODUCTS } from './queries';
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

  return {
    id: parseInt(shopifyProduct.id.split('/').pop() || '0'),
    name: shopifyProduct.title,
    price: price,
    originalPrice: compareAtPrice || undefined,
    category: shopifyProduct.productType || 'General',
    description: shopifyProduct.description,
    image: firstImage?.url || '',
    shopifyId: shopifyProduct.id,
    variantId: firstVariant?.id,
    handle: shopifyProduct.handle
  };
};

// Obtener todos los productos
export const getProducts = async (first: number = 20): Promise<Product[]> => {
  try {
    const data: any = await shopifyClient.request(GET_PRODUCTS, { first });
    
    return data.products.edges.map((edge: any) => 
      convertShopifyProductToAppProduct(edge.node)
    );
  } catch (error) {
    console.error('Error fetching products from Shopify:', error);
    return [];
  }
};

// Obtener productos por colección/categoría
export const getProductsByCollection = async (collectionHandle: string, first: number = 20): Promise<Product[]> => {
  try {
    const data: any = await shopifyClient.request(GET_PRODUCTS_BY_COLLECTION, {
      handle: collectionHandle,
      first
    });
    
    if (!data.collection) {
      return [];
    }

    return data.collection.products.edges.map((edge: any) => 
      convertShopifyProductToAppProduct(edge.node)
    );
  } catch (error) {
    console.error('Error fetching products by collection:', error);
    return [];
  }
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
