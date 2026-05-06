import { useState, useEffect } from 'react';
import { getArticles, getArticleByHandle } from '@/shopify/blogs';
import { isShopifyConfigured } from '@/shopify/config';
import type { BlogArticle, BlogArticleDetail } from '@/shopify/types';

/** Lista de artículos del blog (cross-blog) ordenados por fecha desc */
export const useShopifyArticles = (limit: number = 30) => {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);

      if (!isShopifyConfigured()) {
        if (!cancelled) {
          setArticles([]);
          setLoading(false);
        }
        return;
      }

      try {
        const result = await getArticles(limit);
        if (!cancelled) setArticles(result);
      } catch (err) {
        console.error('Error loading articles:', err);
        if (!cancelled) setError('No pudimos cargar los artículos del blog.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [limit]);

  return { articles, loading, error };
};

/** Artículo individual identificado por blogHandle + articleHandle */
export const useShopifyArticle = (
  blogHandle: string | undefined,
  articleHandle: string | undefined
) => {
  const [article, setArticle] = useState<BlogArticleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!blogHandle || !articleHandle) {
      setArticle(null);
      setLoading(false);
      return;
    }

    const run = async () => {
      setLoading(true);
      setError(null);

      if (!isShopifyConfigured()) {
        if (!cancelled) {
          setArticle(null);
          setLoading(false);
        }
        return;
      }

      try {
        const result = await getArticleByHandle(blogHandle, articleHandle);
        if (!cancelled) {
          setArticle(result);
          if (!result) setError('Artículo no encontrado.');
        }
      } catch (err) {
        console.error('Error loading article:', err);
        if (!cancelled) setError('No pudimos cargar el artículo.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [blogHandle, articleHandle]);

  return { article, loading, error };
};
