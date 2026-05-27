import { useState, useEffect } from 'react';
import { getAllProducts } from '@/shopify/products';
import { isShopifyConfigured } from '@/shopify/config';
import type { Product } from '@/shopify/types';

const SHOPIFY_PAGE_SIZE = 50;

/**
 * Carga el catálogo completo de Shopify (todas las páginas de la API).
 * Pensado para la página /productos con filtros y paginación en cliente.
 */
export const useShopifyProductsCatalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!isShopifyConfigured()) {
          console.warn('Shopify no está configurado.');
          setProducts([]);
          return;
        }

        const fetchedProducts = await getAllProducts(SHOPIFY_PAGE_SIZE);
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error fetching catalog:', err);
        setError('Error al cargar productos');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  return { products, loading, error };
};
