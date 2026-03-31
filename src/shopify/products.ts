import { shopifyClient, GET_PRODUCTS, GET_PRODUCTS_BY_COLLECTION, GET_PRODUCT_BY_HANDLE, GET_COLLECTIONS, SEARCH_PRODUCTS } from './queries';
import type { ShopifyProduct, ShopifyCollection, Product, ShopifyVariant } from './types';

/**
 * Servicio para interactuar con Shopify Storefront API
 */

/** Valor de la opción de variante "Cantidad" (Shopify), reutilizable en carrito y productos */
export function cantidadLabelFromOptions(
  options: Array<{ name: string; value: string }> | undefined | null
): string | undefined {
  if (!options?.length) return undefined;
  const hit = options.find((o) => o.name.trim().toLowerCase() === 'cantidad');
  const v = hit?.value?.trim();
  return v || undefined;
}

function cantidadFromVariant(variant: ShopifyVariant | undefined): string | undefined {
  return cantidadLabelFromOptions(variant?.selectedOptions);
}

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
    description: shopifyProduct.description,
    descriptionHtml: shopifyProduct.descriptionHtml || undefined,
    image: firstImage?.url || '',
    images: allImages.length > 0 ? allImages : undefined,
    shopifyId: shopifyProduct.id,
    variantId: firstVariant?.id,
    handle: shopifyProduct.handle,
    cantidadLabel: cantidadFromVariant(firstVariant),
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

/**
 * Busca el handle real en Storefront API por título exacto (ignora mayúsculas).
 * Útil si el handle manual en código no coincide con el de Admin.
 */
export const findCollectionHandleByTitle = async (collectionTitle: string): Promise<string | null> => {
  try {
    const collections = await getCollections(250);
    const target = collectionTitle.trim().toLowerCase();
    const hit = collections.find((c) => c.title.trim().toLowerCase() === target);
    return hit?.handle ?? null;
  } catch {
    return null;
  }
};

export type GetProductsByCollectionOptions = {
  /** Si la colección no existe con este handle o viene vacía, reintenta con el handle del título en Admin */
  titleFallback?: string;
};

// Obtener productos por colección/categoría
export const getProductsByCollection = async (
  collectionHandle: string,
  first: number = 20,
  options?: GetProductsByCollectionOptions
): Promise<Product[]> => {
  try {
    const data: any = await shopifyClient.request(GET_PRODUCTS_BY_COLLECTION, {
      handle: collectionHandle,
      first
    });

    if (!data.collection) {
      if (options?.titleFallback) {
        const resolved = await findCollectionHandleByTitle(options.titleFallback);
        if (resolved && resolved !== collectionHandle) {
          return getProductsByCollection(resolved, first);
        }
      }
      console.warn(
        `[Shopify] No existe colección con handle "${collectionHandle}" en Storefront API. Revisa el handle en Admin o la publicación al canal de tienda.`
      );
      return [];
    }

    const edges: unknown[] = data.collection.products?.edges ?? [];
    if (edges.length === 0 && options?.titleFallback) {
      const resolved = await findCollectionHandleByTitle(options.titleFallback);
      if (resolved && resolved !== collectionHandle) {
        return getProductsByCollection(resolved, first);
      }
    }

    return (edges as { node: ShopifyProduct }[]).map((edge) => convertShopifyProductToAppProduct(edge.node));
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
