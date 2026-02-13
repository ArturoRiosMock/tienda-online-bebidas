import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductDetail } from '@/app/components/ProductDetail';
import { getProductByHandle } from '@/shopify/products';
import { useShopifyProducts } from '@/shopify/hooks/useShopifyProducts';
import type { Product } from '@/shopify/types';

export const ProductPage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { products: allProducts } = useShopifyProducts();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!handle) return;
      setLoading(true);
      setError(null);
      try {
        const fetched = await getProductByHandle(handle);
        if (fetched) {
          setProduct(fetched);
        } else {
          setError('Producto no encontrado');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [handle]);

  const handleProductClick = (p: Product) => {
    navigate(`/producto/${p.handle || p.id}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-lg p-6">
          <div className="h-[400px] bg-gray-100 rounded-lg animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />
            <div className="h-32 bg-gray-100 rounded animate-pulse" />
            <div className="h-12 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-[#717182] text-lg mb-4">{error || 'Producto no encontrado'}</p>
        <button
          onClick={() => navigate('/')}
          className="inline-block bg-[#0c3c1f] text-white px-6 py-3 rounded-lg hover:bg-[#0a3019] transition-colors font-medium"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <ProductDetail
      product={product}
      allProducts={allProducts}
      onBack={() => navigate(-1)}
      onProductClick={handleProductClick}
    />
  );
};
