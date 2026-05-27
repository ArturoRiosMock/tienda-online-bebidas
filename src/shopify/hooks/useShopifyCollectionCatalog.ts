import { useState, useEffect } from 'react';
import { getAllProductsByCollection } from '@/shopify/products';
import { isShopifyConfigured } from '@/shopify/config';
import type { Product } from '@/shopify/types';

const SHOPIFY_PAGE_SIZE = 50;

/**
 * Carga todos los productos de una colección de Shopify (paginación API completa).
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

        const fetchedProducts = await getAllProductsByCollection(collectionHandle, SHOPIFY_PAGE_SIZE);
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
