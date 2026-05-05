import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, CalendarDays, Clock, User } from 'lucide-react';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { useDocumentMeta } from '@/app/hooks/useDocumentMeta';
import { getArticles, formatArticleDate, estimateReadingTime } from '@/shopify/articles';
import type { BlogArticle } from '@/shopify/types';

export const BlogPage: React.FC = () => {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useDocumentMeta({
    title: 'Blog',
    description:
      'Mr. Brown — Blog: cocteles, recetas, maridajes y guías para disfrutar tus bebidas favoritas.',
    canonicalPath: '/blog',
  });

  useEffect(() => {
    let active = true;
    setLoading(true);
    getArticles(24)
      .then((data) => {
        if (active) setArticles(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const [featured, ...rest] = articles;

  return (
    <>
      <section className="relative bg-gradient-to-r from-[#0c3c1f] to-[#1a5c35] overflow-hidden">
        <div className="absolute inset-0 opacity-10" aria-hidden>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
            }}
          />
        </div>
        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[#FDB93A] font-bold text-sm tracking-widest uppercase mb-3">
              Mr. Brown — Diario
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Blog: cocteles, recetas y experiencias
            </h1>
            <p className="text-white/80 text-lg max-w-2xl">
              Inspiración para tus eventos, guías de maridaje y novedades del
              mundo de las bebidas premium.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 pt-6">
        <Breadcrumbs
          items={[
            { label: 'Inicio', to: '/' },
            { label: 'Blog' },
          ]}
        />
      </div>

      <section className="container mx-auto px-4 py-10 md:py-14">
        {loading ? (
          <BlogSkeleton />
        ) : articles.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {featured && <FeaturedArticleCard article={featured} />}

            {rest.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-[#212121] mb-6">
                  Más entradas
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
};

const FeaturedArticleCard: React.FC<{ article: BlogArticle }> = ({ article }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 lg:gap-10 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
    >
      <Link
        to={`/blog/${article.handle}`}
        className="block aspect-[16/10] lg:aspect-auto overflow-hidden bg-[#0c3c1f]/5"
      >
        {article.image ? (
          <img
            src={article.image.url}
            alt={article.image.alt}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            loading="eager"
          />
        ) : (
          <PlaceholderCover title={article.title} />
        )}
      </Link>

      <div className="flex flex-col justify-center p-6 lg:p-10">
        {article.tags?.[0] && (
          <span className="inline-block w-fit text-xs uppercase tracking-widest font-bold text-[#0c3c1f] bg-[#0c3c1f]/10 rounded-full px-3 py-1 mb-3">
            {article.tags[0]}
          </span>
        )}
        <h2 className="text-2xl md:text-3xl font-bold text-[#212121] mb-3 leading-tight">
          <Link to={`/blog/${article.handle}`} className="hover:text-[#0c3c1f] transition-colors">
            {article.title}
          </Link>
        </h2>
        {article.excerpt && (
          <p className="text-[#717182] leading-relaxed mb-5 line-clamp-3">
            {article.excerpt}
          </p>
        )}
        <ArticleMeta article={article} />
        <Link
          to={`/blog/${article.handle}`}
          className="mt-6 inline-flex w-fit items-center gap-2 bg-[#0c3c1f] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#0a3019] transition-colors"
        >
          Leer artículo
          <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
      </div>
    </motion.article>
  );
};

const ArticleCard: React.FC<{ article: BlogArticle }> = ({ article }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <Link
        to={`/blog/${article.handle}`}
        className="block aspect-[16/10] overflow-hidden bg-[#0c3c1f]/5"
      >
        {article.image ? (
          <img
            src={article.image.url}
            alt={article.image.alt}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <PlaceholderCover title={article.title} />
        )}
      </Link>
      <div className="flex flex-col p-5 flex-1">
        {article.tags?.[0] && (
          <span className="inline-block w-fit text-[10px] uppercase tracking-widest font-bold text-[#0c3c1f] bg-[#0c3c1f]/10 rounded-full px-2 py-0.5 mb-2">
            {article.tags[0]}
          </span>
        )}
        <h3 className="text-lg font-bold text-[#212121] mb-2 leading-snug">
          <Link to={`/blog/${article.handle}`} className="hover:text-[#0c3c1f] transition-colors">
            {article.title}
          </Link>
        </h3>
        {article.excerpt && (
          <p className="text-[#717182] text-sm leading-relaxed mb-4 line-clamp-3">
            {article.excerpt}
          </p>
        )}
        <div className="mt-auto">
          <ArticleMeta article={article} compact />
        </div>
      </div>
    </motion.article>
  );
};

const ArticleMeta: React.FC<{ article: BlogArticle; compact?: boolean }> = ({ article, compact }) => {
  const sizeClasses = compact ? 'text-xs gap-3' : 'text-sm gap-4';
  const iconSize = compact ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <div className={`flex flex-wrap items-center text-[#717182] ${sizeClasses}`}>
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays className={iconSize} aria-hidden />
        {formatArticleDate(article.publishedAt)}
      </span>
      {article.authorName && (
        <span className="inline-flex items-center gap-1.5">
          <User className={iconSize} aria-hidden />
          {article.authorName}
        </span>
      )}
      <span className="inline-flex items-center gap-1.5">
        <Clock className={iconSize} aria-hidden />
        {estimateReadingTime(article.contentHtml ?? article.excerpt)} min
      </span>
    </div>
  );
};

const PlaceholderCover: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0c3c1f] to-[#1a5c35] text-white p-6">
    <span className="font-bold text-lg text-center line-clamp-3">{title}</span>
  </div>
);

const BlogSkeleton: React.FC = () => (
  <div className="space-y-10">
    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 lg:gap-10 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <div className="aspect-[16/10] bg-gray-200 animate-pulse" />
      <div className="p-6 lg:p-10 space-y-4">
        <div className="h-4 w-24 bg-gray-200 animate-pulse rounded-full" />
        <div className="h-8 w-3/4 bg-gray-200 animate-pulse rounded" />
        <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
        <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded" />
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
          <div className="aspect-[16/10] bg-gray-200 animate-pulse" />
          <div className="p-5 space-y-3">
            <div className="h-5 w-3/4 bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
    <h2 className="text-2xl font-bold text-[#212121] mb-2">
      Aún no hay artículos publicados
    </h2>
    <p className="text-[#717182] max-w-md mx-auto mb-6">
      Cuando publiques una entrada en el blog de tu tienda Shopify aparecerá
      aquí automáticamente.
    </p>
    <Link
      to="/"
      className="inline-flex items-center gap-2 bg-[#0c3c1f] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#0a3019] transition-colors"
    >
      Volver al inicio
      <ArrowRight className="w-4 h-4" aria-hidden />
    </Link>
  </div>
);
