import { useState, useEffect } from 'react';
import { getProducts, getProductsByCollection, searchProducts } from '@/shopify/products';
import { isShopifyConfigured } from '@/shopify/config';
import type { Product } from '@/shopify/types';

/**
 * Hook para obtener productos de Shopify.
 * Recibe un collectionHandle opcional. Si se pasa, filtra por colección;
 * si no, trae todos los productos.
 */
export const useShopifyProducts = (collectionHandle?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!isShopifyConfigured()) {
          console.warn('Shopify no está configurado.');
          setProducts([]);
          setLoading(false);
          return;
        }

        let fetchedProducts: Product[];

        if (collectionHandle) {
          fetchedProducts = await getProductsByCollection(collectionHandle, 50);
        } else {
          fetchedProducts = await getProducts(50);
        }

        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Error al cargar productos');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [collectionHandle]);

  return { products, loading, error };
};

export const useShopifySearch = (query: string) => {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const searchProductsAsync = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!isShopifyConfigured()) {
          setResults([]);
        } else {
          const searchResults = await searchProducts(query, 20);
          setResults(searchResults);
        }
      } catch (err) {
        console.error('Error searching products:', err);
        setError('Error en la búsqueda');
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchProductsAsync, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return { results, loading, error };
};