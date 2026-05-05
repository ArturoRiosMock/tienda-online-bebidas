import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, CalendarDays, Clock, Share2, User } from 'lucide-react';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { JsonLd } from '@/app/components/JsonLd';
import { useDocumentMeta } from '@/app/hooks/useDocumentMeta';
import {
  estimateReadingTime,
  formatArticleDate,
  getArticleByHandle,
  getArticles,
} from '@/shopify/articles';
import type { BlogArticle } from '@/shopify/types';
import { absoluteUrl } from '@/content/mrbrown/seo-defaults';
import { NotFoundPage } from '@/app/pages/NotFoundPage';

export const ArticlePage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [related, setRelated] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!handle) return;
    let active = true;
    setLoading(true);
    setArticle(null);

    Promise.all([getArticleByHandle(handle), getArticles(8)])
      .then(([found, all]) => {
        if (!active) return;
        setArticle(found);
        setRelated(all.filter((a) => a.handle !== handle).slice(0, 3));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [handle]);

  useDocumentMeta(
    article
      ? {
          title: article.title,
          description:
            article.excerpt || `${article.title} — Mr. Brown — House of Spirits`,
          canonicalPath: `/blog/${article.handle}`,
          ogType: 'article',
          ogImage: article.image?.url,
          imageAlt: article.image?.alt,
        }
      : { title: 'Cargando artículo…', canonicalPath: `/blog/${handle ?? ''}` }
  );

  if (loading) return <ArticleSkeleton />;
  if (!article) return <NotFoundPage />;

  const readingTime = estimateReadingTime(article.contentHtml ?? article.excerpt);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    image: article.image?.url ? [article.image.url] : undefined,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: article.authorName
      ? { '@type': 'Person', name: article.authorName }
      : undefined,
    description: article.excerpt || undefined,
    mainEntityOfPage: absoluteUrl(`/blog/${article.handle}`),
  };

  const handleShare = async () => {
    const url = absoluteUrl(`/blog/${article.handle}`);
    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, text: article.excerpt, url });
        return;
      } catch {
        /* el usuario canceló: caemos al copy-to-clipboard */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* sin clipboard, no hacemos nada */
    }
  };

  return (
    <>
      <JsonLd schema={schema} />

      <article className="bg-white">
        <header className="relative bg-gradient-to-r from-[#0c3c1f] to-[#1a5c35] overflow-hidden">
          <div className="absolute inset-0 opacity-10" aria-hidden>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
              }}
            />
          </div>
          <div className="container mx-auto px-4 py-12 md:py-16 relative z-10 max-w-4xl">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden />
              Volver al blog
            </Link>
            {article.tags?.[0] && (
              <p className="text-[#FDB93A] font-bold text-xs tracking-widest uppercase mb-3">
                {article.tags[0]}
              </p>
            )}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl"
            >
              {article.title}
            </motion.h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-white/80 text-sm mt-6">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4" aria-hidden />
                {formatArticleDate(article.publishedAt)}
              </span>
              {article.authorName && (
                <span className="inline-flex items-center gap-1.5">
                  <User className="w-4 h-4" aria-hidden />
                  {article.authorName}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" aria-hidden />
                {readingTime} min de lectura
              </span>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 pt-6 max-w-4xl">
          <Breadcrumbs
            items={[
              { label: 'Inicio', to: '/' },
              { label: 'Blog', to: '/blog' },
              { label: article.title },
            ]}
          />
        </div>

        {article.image && (
          <div className="container mx-auto px-4 mt-6 max-w-4xl">
            <img
              src={article.image.url}
              alt={article.image.alt}
              className="w-full rounded-2xl object-cover max-h-[460px]"
              loading="eager"
            />
          </div>
        )}

        <div className="container mx-auto px-4 py-10 md:py-14 max-w-3xl">
          {article.contentHtml ? (
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />
          ) : (
            <p className="text-[#717182] italic">
              Este artículo aún no tiene contenido publicado.
            </p>
          )}

          <div className="mt-10 pt-6 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 bg-[#0c3c1f] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#0a3019] transition-colors"
            >
              <Share2 className="w-4 h-4" aria-hidden />
              Compartir
            </button>
            {article.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs uppercase tracking-widest font-semibold text-[#0c3c1f] bg-[#0c3c1f]/10 rounded-full px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {article.authorName && article.authorBio && (
            <div className="mt-10 bg-gray-50 border border-gray-100 rounded-2xl p-6">
              <h3 className="text-sm uppercase tracking-widest font-bold text-[#0c3c1f] mb-2">
                Sobre el autor
              </h3>
              <p className="font-bold text-[#212121] mb-1">{article.authorName}</p>
              <p className="text-[#717182] text-sm leading-relaxed">{article.authorBio}</p>
            </div>
          )}
        </div>

        {related.length > 0 && (
          <section className="bg-gray-50 border-t border-gray-100">
            <div className="container mx-auto px-4 py-12 max-w-6xl">
              <h2 className="text-2xl font-bold text-[#212121] mb-6">
                Sigue leyendo
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.handle}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-[#0c3c1f]/5">
                      {post.image ? (
                        <img
                          src={post.image.url}
                          alt={post.image.alt}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#0c3c1f] to-[#1a5c35] flex items-center justify-center text-white p-4">
                          <span className="font-bold text-center line-clamp-3">{post.title}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-[#212121] mb-1 group-hover:text-[#0c3c1f] transition-colors leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-xs text-[#717182]">
                        {formatArticleDate(post.publishedAt)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </>
  );
};

const ArticleSkeleton: React.FC = () => (
  <div className="bg-white">
    <div className="bg-gradient-to-r from-[#0c3c1f] to-[#1a5c35] py-16">
      <div className="container mx-auto px-4 max-w-4xl space-y-4">
        <div className="h-4 w-24 bg-white/20 animate-pulse rounded" />
        <div className="h-10 w-3/4 bg-white/20 animate-pulse rounded" />
        <div className="h-4 w-1/2 bg-white/20 animate-pulse rounded" />
      </div>
    </div>
    <div className="container mx-auto px-4 py-10 max-w-3xl space-y-3">
      <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
      <div className="h-4 w-11/12 bg-gray-200 animate-pulse rounded" />
      <div className="h-4 w-10/12 bg-gray-200 animate-pulse rounded" />
      <div className="h-4 w-9/12 bg-gray-200 animate-pulse rounded" />
    </div>
  </div>
);
