import { useState, useEffect } from 'react';
import { getProducts, getProductsByCategory, searchProducts } from '@/shopify/products';
import { isShopifyConfigured } from '@/shopify/config';
import type { Product } from '@/shopify/types';

// Placeholders para ejecución local (figma:asset solo funciona en Figma/Make)
import { PLACEHOLDER_IMAGES } from '@/assets/placeholders';
const imgPenafiel = PLACEHOLDER_IMAGES.agua;
const imgSprite = PLACEHOLDER_IMAGES.refresco;
const imgWhisky = PLACEHOLDER_IMAGES.whisky;

/**
 * Hook para obtener productos de Shopify
 * Incluye fallback a productos mock si Shopify no está configurado
 */

// Productos mock para desarrollo/fallback
const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Agua Peñafiel Mineral',
    price: 25.00,
    category: 'Agua',
    description: 'Agua mineral natural de manantial, 2L',
    image: imgPenafiel
  },
  {
    id: 2,
    name: 'Sprite Zero',
    price: 18.00,
    category: 'Refrescos',
    description: 'Refresco de lima-limón sin azúcar, sabor refrescante',
    image: imgSprite
  },
  {
    id: 3,
    name: 'Nikka Coffey Malt Whisky',
    price: 1299.00,
    originalPrice: 1499.00,
    category: 'Whisky',
    description: 'Whisky japonés premium de malta, destilado en alambiques Coffey',
    image: imgWhisky
  },
  {
    id: 4,
    name: 'Agua Peñafiel Mineral 2L',
    price: 25.00,
    category: 'Agua',
    description: 'Agua mineral natural de manantial con gas',
    image: imgPenafiel
  },
  {
    id: 5,
    name: 'Sprite Zero Refresco',
    price: 18.00,
    category: 'Refrescos',
    description: 'Bebida gaseosa sin calorías con sabor a lima-limón',
    image: imgSprite
  },
  {
    id: 6,
    name: 'Whisky Nikka Coffey Malt',
    price: 1299.00,
    originalPrice: 1499.00,
    category: 'Whisky',
    description: 'Destilado japonés de malta 100% con notas dulces y afrutadas',
    image: imgWhisky
  },
  {
    id: 7,
    name: 'Peñafiel Agua con Gas',
    price: 25.00,
    category: 'Agua',
    description: 'Agua mineral carbonatada natural, ideal para mezclas',
    image: imgPenafiel
  },
  {
    id: 8,
    name: 'Sprite Zero Limón',
    price: 18.00,
    category: 'Refrescos',
    description: 'Refresco sin azúcar con sabor intenso a limón',
    image: imgSprite
  }
];

export const useShopifyProducts = (category?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Verificar si Shopify está configurado
        if (!isShopifyConfigured()) {
          console.warn('Shopify no está configurado. Usando productos mock.');
          setProducts(
            category 
              ? MOCK_PRODUCTS.filter(p => p.category === category)
              : MOCK_PRODUCTS
          );
          setLoading(false);
          return;
        }

        // Obtener productos de Shopify
        let fetchedProducts: Product[];
        
        if (category) {
          fetchedProducts = await getProductsByCategory(category);
        } else {
          fetchedProducts = await getProducts(50);
        }

        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Error al cargar productos');
        // Fallback a productos mock en caso de error
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

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
          // Búsqueda mock
          const filtered = MOCK_PRODUCTS.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase())
          );
          setResults(filtered);
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

    // Debounce de 500ms
    const timeoutId = setTimeout(searchProductsAsync, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return { results, loading, error };
};