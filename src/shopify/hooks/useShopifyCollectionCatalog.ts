import { useState, useEffect } from 'react';
import { fetchProductsByHandle } from '@/shopify/products';
import { isShopifyConfigured } from '@/shopify/config';
import type { Product } from '@/shopify/types';

const SHOPIFY_PAGE_SIZE = 50;

/**
 * Carga todos los productos de una colección de Shopify.
 *
 * Admite tres modos según el handle:
 * - Colección virtual (ej. "espumosos"): combina múltiples colecciones reales.
 * - Colección por tag (ej. "jerez"): usa la Storefront Search API con filtro de tag.
 * - Colección normal: consulta directa por handle a la Storefront API.
 */
export const useShopifyCollectionCatalog = (collectionHandle?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollection = async () => {
      if (!collectionHandle) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setProducts([]);

      try {
        if (!isShopifyConfigured()) {
          console.warn('Shopify no está configurado.');
          setProducts([]);
          return;
        }

        const fetchedProducts = await fetchProductsByHandle(collectionHandle, SHOPIFY_PAGE_SIZE);
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error fetching collection catalog:', err);
        setError('Error al cargar productos');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [collectionHandle]);

  return { products, loading, error };
};
