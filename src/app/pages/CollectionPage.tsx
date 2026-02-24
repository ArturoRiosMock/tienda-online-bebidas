import React, { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { ProductCard } from '@/app/components/ProductCard';
import { AdBanner, getInlineAdSlots } from '@/app/components/AdBanner';
import { useShopifyProducts } from '@/shopify/hooks/useShopifyProducts';
import { useShopifyCollections } from '@/shopify/hooks/useShopifyCollections';

type GridItem =
  | { kind: 'product'; product: ReturnType<typeof useShopifyProducts>['products'][number] }
  | { kind: 'ad'; slotId: string };

export const CollectionPage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const { products, loading, error } = useShopifyProducts(handle);
  const { collections } = useShopifyCollections();

  const currentCollection = collections.find((c) => c.handle === handle);
  const collectionTitle = currentCollection?.title || handle?.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || 'Colección';

  const inlineAds = useMemo(() => getInlineAdSlots('collection'), []);

  const gridItems = useMemo<GridItem[]>(() => {
    const items: GridItem[] = [];
    let adIndex = 0;
    let productIndex = 0;
    let position = 0;

    while (productIndex < products.length || adIndex < inlineAds.length) {
      if (adIndex < inlineAds.length && position === inlineAds[adIndex].position - 1) {
        items.push({ kind: 'ad', slotId: inlineAds[adIndex].slotId });
        adIndex++;
        position++;
        continue;
      }

      if (productIndex < products.length) {
        items.push({ kind: 'product', product: products[productIndex] });
        productIndex++;
        position++;
      } else {
        break;
      }
    }

    return items;
  }, [products, inlineAds]);

  return (
    <div className="min-h-[60vh]">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-[#717182]">
            <Link to="/" className="hover:text-[#0c3c1f] transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#0c3c1f] font-medium">{collectionTitle}</span>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-[#0c3c1f] mb-2">{collectionTitle}</h1>
          {currentCollection?.description && (
            <p className="text-[#717182] max-w-2xl">{currentCollection.description}</p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 pt-4 pb-0">
        <AdBanner slotId="collection-header-below" variant="leaderboard" />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          <aside className="hidden lg:block">
            <div className="sticky top-4 space-y-6">
              <div>
                <h3 className="text-[#0c3c1f] font-bold mb-4 text-sm uppercase tracking-wide">Categorías</h3>
                <nav className="space-y-1">
                  <Link
                    to="/"
                    className="block px-3 py-2 text-sm rounded-lg text-[#212121] hover:bg-gray-100 hover:text-[#0c3c1f] transition-colors"
                  >
                    Todos los Productos
                  </Link>
                  {collections
                    .filter((c) => c.handle !== 'ofertas-relampago')
                    .map((col) => (
                      <Link
                        key={col.id}
                        to={`/categorias/${col.handle}`}
                        className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                          col.handle === handle
                            ? 'bg-[#0c3c1f] text-white font-medium'
                            : 'text-[#212121] hover:bg-gray-100 hover:text-[#0c3c1f]'
                        }`}
                      >
                        {col.title}
                      </Link>
                    ))}
                </nav>
              </div>

              <AdBanner slotId="collection-sidebar-skyscraper" variant="sidebar" />
            </div>
          </aside>

          <div>
            <div className="flex items-center justify-between mb-6">
              {!loading && (
                <p className="text-[#717182] text-sm">{products.length} productos encontrados</p>
              )}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-60 sm:h-80 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-[#717182] text-lg mb-4">No se encontraron productos en esta colección.</p>
                <Link
                  to="/"
                  className="inline-block bg-[#0c3c1f] text-white px-6 py-3 rounded-lg hover:bg-[#0a3019] transition-colors font-medium"
                >
                  Ver todos los productos
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-6">
                {gridItems.map((item, i) =>
                  item.kind === 'product' ? (
                    <ProductCard
                      key={`p-${item.product.id}`}
                      product={item.product}
                      onClick={() => navigate(`/producto/${item.product.handle || item.product.id}`)}
                    />
                  ) : (
                    <AdBanner key={`ad-${item.slotId}-${i}`} slotId={item.slotId} variant="inline-card" />
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
