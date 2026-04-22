import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useShopifyProducts } from '@/shopify/hooks/useShopifyProducts';
import { ProductCard } from '@/app/components/ProductCard';

interface Brand {
  id: string;
  name: string;
  /** Handle de la colección en Shopify (Admin → Colecciones → URL/manejo) */
  handle: string;
  /** Título exacto de la colección en Admin, como fallback por si el handle no coincide */
  titleFallback?: string;
  image: string;
}

const brands: Brand[] = [
  {
    id: 'la-madrilena',
    name: 'La Madrileña',
    handle: 'la-madrilena',
    titleFallback: 'La Madrileña',
    image: '/brands/la-madrilena.png',
  },
  {
    id: 'felix',
    name: 'Félix',
    handle: 'felix',
    titleFallback: 'Félix',
    image: '/brands/felix.png',
  },
  {
    id: 'condesa-gin',
    name: 'Condesa Gin',
    handle: 'condesa-gin',
    titleFallback: 'Condesa Gin',
    image: '/brands/condesa-gin.png',
  },
  {
    id: 'casa-del-agua',
    name: 'Casa del Agua',
    handle: 'casa-del-agua',
    titleFallback: 'Casa del Agua',
    image: '/brands/casa-del-agua.png',
  },
  {
    id: 'casa-bacardi',
    name: 'Casa Bacardi',
    handle: 'casa-bacardi',
    titleFallback: 'Casa Bacardi',
    image: '/brands/casa-bacardi.png',
  },
];

export const BrandsSection = () => {
  const [selectedBrand, setSelectedBrand] = useState<Brand>(brands[0]);
  const navigate = useNavigate();
  const { products, loading, error } = useShopifyProducts(
    selectedBrand.handle,
    selectedBrand.titleFallback ?? selectedBrand.name
  );

  const visibleProducts = products.slice(0, 6);

  return (
    <section className="bg-gray-50 py-8 md:py-12 overflow-hidden">
      <div className="container mx-auto px-3 sm:px-4 max-w-[100vw]">
        <h2 className="text-[#212121] mb-6 sm:mb-8 text-lg sm:text-2xl">Grandes Marcas</h2>

        {/* Chips de marcas */}
        <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 brands-scroll">
          {brands.map((brand) => (
            <motion.button
              key={brand.id}
              type="button"
              onClick={() => setSelectedBrand(brand)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all shrink-0 ${
                selectedBrand.id === brand.id ? 'ring-2 ring-[#0c3c1f] ring-offset-2' : ''
              }`}
              aria-pressed={selectedBrand.id === brand.id}
            >
              <div className="relative w-28 h-16 sm:w-40 sm:h-24">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end justify-center pb-1.5 sm:pb-2">
                  <span className="text-white text-xs sm:text-sm font-semibold text-center px-1 drop-shadow">
                    {brand.name}
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Contenido de la marca seleccionada */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedBrand.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6"
          >
            {/* Banner de la marca */}
            <div className="md:col-span-3">
              <button
                type="button"
                onClick={() => navigate(`/categorias/${selectedBrand.handle}`)}
                className="group relative block w-full rounded-lg overflow-hidden shadow-lg h-44 md:h-full md:min-h-[380px]"
              >
                <img
                  src={selectedBrand.image}
                  alt={selectedBrand.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
                <div className="absolute inset-0 flex flex-col items-center justify-end p-4 md:p-6 text-center">
                  <h3 className="text-white text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg">
                    {selectedBrand.name}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 text-white/95 text-xs md:text-sm font-semibold">
                    Ver colección
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </div>
              </button>
            </div>

            {/* Productos de la marca */}
            <div className="md:col-span-9">
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-60 sm:h-80 bg-gray-200 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full min-h-[200px] p-6 text-center bg-white rounded-lg">
                  <p className="text-[#717182]">No se pudo cargar la colección. Intenta más tarde.</p>
                </div>
              ) : visibleProducts.length === 0 ? (
                <div className="flex items-center justify-center h-full min-h-[200px] p-6 text-center bg-white rounded-lg">
                  <p className="text-[#717182]">
                    Aún no hay productos publicados en {selectedBrand.name}.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
                  {visibleProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={() => navigate(`/producto/${product.handle || product.id}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`
        .brands-scroll::-webkit-scrollbar { display: none; }
        .brands-scroll { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
    </section>
  );
};
