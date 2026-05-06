import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Newspaper, ArrowRight, Calendar, User, Tag, Sparkles } from 'lucide-react';
import { useShopifyArticles } from '@/shopify/hooks/useShopifyBlog';
import type { BlogArticle } from '@/shopify/types';

const formatDate = (iso: string): string => {
  try {
    return new Date(iso).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
};

const ArticleCard: React.FC<{ article: BlogArticle; featured?: boolean }> = ({
  article,
  featured = false,
}) => {
  const href = `/blog/${article.blogHandle}/${article.handle}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow ${
        featured ? 'lg:flex lg:items-stretch' : ''
      }`}
    >
      <Link
        to={href}
        className={`block ${featured ? 'lg:w-1/2 lg:flex-shrink-0' : ''}`}
      >
        <div
          className={`relative w-full overflow-hidden bg-gray-100 ${
            featured ? 'aspect-[4/3] lg:aspect-auto lg:h-full' : 'aspect-[16/10]'
          }`}
        >
          {article.image ? (
            <img
              src={article.image}
              alt={article.imageAlt}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#0055a2]/5">
              <Newspaper className="w-12 h-12 text-[#0055a2]/30" />
            </div>
          )}
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-[#0055a2] text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            {article.blogTitle}
          </span>
        </div>
      </Link>

      <div className={`p-5 sm:p-6 ${featured ? 'lg:w-1/2 lg:flex lg:flex-col lg:justify-center' : ''}`}>
        <div className="flex items-center gap-3 text-xs text-[#717182] mb-3 flex-wrap">
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(article.publishedAt)}
          </span>
          {article.author && (
            <span className="inline-flex items-center gap-1">
              <User className="w-3 h-3" />
              {article.author}
            </span>
          )}
        </div>

        <h3
          className={`text-[#212121] font-semibold mb-3 line-clamp-2 group-hover:text-[#0055a2] transition-colors ${
            featured ? 'text-2xl sm:text-3xl' : 'text-lg'
          }`}
        >
          <Link to={href}>{article.title}</Link>
        </h3>

        {article.excerpt && (
          <p
            className={`text-[#717182] leading-relaxed mb-4 ${
              featured ? 'line-clamp-4 text-base' : 'line-clamp-3 text-sm'
            }`}
          >
            {article.excerpt}
          </p>
        )}

        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-gray-100 text-[#717182] px-2 py-1 rounded"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <Link
          to={href}
          className="inline-flex items-center gap-1 text-[#0055a2] font-medium text-sm hover:gap-2 transition-all"
        >
          Leer artículo <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.article>
  );
};

export const BlogPage: React.FC = () => {
  const { articles, loading, error } = useShopifyArticles(30);
  const [activeBlog, setActiveBlog] = useState<string>('all');

  const blogTabs = useMemo(() => {
    const map = new Map<string, string>();
    articles.forEach((a) => map.set(a.blogHandle, a.blogTitle));
    return Array.from(map.entries()).map(([handle, title]) => ({ handle, title }));
  }, [articles]);

  const filtered = useMemo(() => {
    if (activeBlog === 'all') return articles;
    return articles.filter((a) => a.blogHandle === activeBlog);
  }, [articles, activeBlog]);

  const [featured, ...rest] = filtered;

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-[#0055a2]/10 text-[#0055a2] px-4 py-2 rounded-full mb-4">
            <Newspaper className="w-4 h-4" />
            <span className="text-sm font-medium">Blog Bebify</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#212121] mb-3">
            Tendencias, guías y novedades
          </h1>
          <p className="text-[#717182] max-w-2xl mx-auto leading-relaxed">
            Contenido pensado para tu negocio: del mercado de bebidas mexicano a la
            operación diaria de tu centro de consumo.
          </p>
        </motion.div>

        {!loading && blogTabs.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              type="button"
              onClick={() => setActiveBlog('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeBlog === 'all'
                  ? 'bg-[#0055a2] text-white'
                  : 'bg-white text-[#212121] border border-gray-200 hover:border-[#0055a2] hover:text-[#0055a2]'
              }`}
            >
              Todos
            </button>
            {blogTabs.map((b) => (
              <button
                key={b.handle}
                type="button"
                onClick={() => setActiveBlog(b.handle)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeBlog === b.handle
                    ? 'bg-[#0055a2] text-white'
                    : 'bg-white text-[#212121] border border-gray-200 hover:border-[#0055a2] hover:text-[#0055a2]'
                }`}
              >
                {b.title}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="aspect-[16/10] bg-gray-100 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-gray-100 rounded w-1/3 animate-pulse" />
                  <div className="h-5 bg-gray-100 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded w-5/6 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-6 text-center">
            {error}
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="text-center bg-white rounded-2xl border border-gray-100 p-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#0055a2]/10 text-[#0055a2] px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Próximamente</span>
            </div>
            <h2 className="text-xl font-semibold text-[#212121] mb-2">
              Aún no hay artículos publicados
            </h2>
            <p className="text-[#717182]">
              Estamos preparando contenido. Vuelve pronto para encontrar artículos del
              equipo Bebify.
            </p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            {featured && (
              <div className="mb-10">
                <ArticleCard article={featured} featured />
              </div>
            )}

            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
