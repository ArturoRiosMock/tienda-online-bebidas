import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, User, Tag, Newspaper } from 'lucide-react';
import { useShopifyArticle } from '@/shopify/hooks/useShopifyBlog';

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

export const BlogPostPage: React.FC = () => {
  const { blogHandle, articleHandle } = useParams<{
    blogHandle: string;
    articleHandle: string;
  }>();
  const { article, loading, error } = useShopifyArticle(blogHandle, articleHandle);

  return (
    <section className="py-10 sm:py-14 bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-[#0055a2] font-medium text-sm mb-6 hover:gap-3 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al blog
        </Link>

        {loading && (
          <div className="space-y-5">
            <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
            <div className="h-10 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
            <div className="aspect-[16/9] bg-gray-100 rounded-xl animate-pulse" />
            <div className="space-y-3 pt-4">
              <div className="h-3 bg-gray-100 rounded animate-pulse" />
              <div className="h-3 bg-gray-100 rounded animate-pulse" />
              <div className="h-3 bg-gray-100 rounded w-5/6 animate-pulse" />
            </div>
          </div>
        )}

        {!loading && (error || !article) && (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#0055a2]/10 rounded-full mb-4">
              <Newspaper className="w-7 h-7 text-[#0055a2]" />
            </div>
            <h1 className="text-xl font-semibold text-[#212121] mb-2">
              Artículo no disponible
            </h1>
            <p className="text-[#717182] mb-6">
              {error || 'No encontramos este artículo. Es posible que haya sido movido o aún no esté publicado.'}
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 bg-[#0055a2] text-white px-5 py-2.5 rounded-lg hover:bg-[#003d7a] transition-colors text-sm font-medium"
            >
              Ver todos los artículos
            </Link>
          </div>
        )}

        {!loading && article && (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block bg-[#0055a2]/10 text-[#0055a2] text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {article.blogTitle}
            </span>

            <h1 className="text-3xl sm:text-4xl font-bold text-[#212121] leading-tight mb-4">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-[#717182] mb-8">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(article.publishedAt)}
              </span>
              {article.author && (
                <span className="inline-flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {article.author}
                </span>
              )}
            </div>

            {article.image && (
              <div className="rounded-2xl overflow-hidden mb-8 bg-gray-100">
                <img
                  src={article.image}
                  alt={article.imageAlt}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            <div
              className="blog-content text-[#212121] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />

            {article.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-gray-200">
                <p className="text-xs uppercase tracking-wider text-[#717182] font-semibold mb-3">
                  Etiquetas
                </p>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 bg-gray-100 text-[#212121] text-xs px-3 py-1.5 rounded-full"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {article.author && article.authorBio && (
              <div className="mt-10 bg-white border border-gray-100 rounded-2xl p-6">
                <p className="text-xs uppercase tracking-wider text-[#0055a2] font-semibold mb-2">
                  Sobre el autor
                </p>
                <p className="font-semibold text-[#212121] mb-1">{article.author}</p>
                <p className="text-sm text-[#717182] leading-relaxed">{article.authorBio}</p>
              </div>
            )}
          </motion.article>
        )}
      </div>

      <style>{`
        .blog-content p { margin-bottom: 1.25rem; }
        .blog-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 2rem 0 1rem;
          color: #212121;
        }
        .blog-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 1.5rem 0 0.75rem;
          color: #212121;
        }
        .blog-content a { color: #0055a2; text-decoration: underline; }
        .blog-content a:hover { color: #003d7a; }
        .blog-content ul,
        .blog-content ol { padding-left: 1.5rem; margin-bottom: 1.25rem; }
        .blog-content ul { list-style-type: disc; }
        .blog-content ol { list-style-type: decimal; }
        .blog-content li { margin-bottom: 0.5rem; }
        .blog-content img { border-radius: 0.75rem; margin: 1.5rem 0; max-width: 100%; height: auto; }
        .blog-content blockquote {
          border-left: 4px solid #0055a2;
          padding: 0.5rem 1rem;
          margin: 1.5rem 0;
          background: #f0f7ff;
          color: #212121;
          font-style: italic;
        }
        .blog-content iframe { width: 100%; aspect-ratio: 16/9; border-radius: 0.75rem; margin: 1.5rem 0; }
      `}</style>
    </section>
  );
};
