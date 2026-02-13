import { useState, useEffect } from 'react';
import { getCollections } from '@/shopify/products';
import { isShopifyConfigured } from '@/shopify/config';
import type { ShopifyCollection } from '@/shopify/types';

export interface CollectionItem {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: string | null;
}

const convertCollection = (col: ShopifyCollection): CollectionItem => ({
  id: col.id,
  title: col.title,
  handle: col.handle,
  description: col.description,
  image: col.image?.url || null,
});

export const useShopifyCollections = () => {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!isShopifyConfigured()) {
          setCollections([]);
          setLoading(false);
          return;
        }

        const raw = await getCollections(50);
        setCollections(raw.map(convertCollection));
      } catch (err) {
        console.error('Error fetching collections:', err);
        setError('Error al cargar colecciones');
        setCollections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  return { collections, loading, error };
};
