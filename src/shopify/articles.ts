import {
  shopifyClient,
  GET_ARTICLES,
  GET_ALL_ARTICLES,
  GET_ARTICLE_BY_HANDLE,
  GET_BLOGS,
} from './queries';
import type { BlogArticle, ShopifyArticle } from './types';

/**
 * Handle del blog por defecto en Shopify (suele llamarse "news").
 * Solo se usa como fallback al resolver un artículo por handle.
 */
export const DEFAULT_BLOG_HANDLE = 'news';

/** Si se define, limita el listado a un solo blog (opcional). */
const BLOG_HANDLE_FILTER = import.meta.env.VITE_SHOPIFY_BLOG_HANDLE as string | undefined;

/** Convierte la respuesta cruda de Shopify al tipo usado por la UI. */
function toBlogArticle(node: ShopifyArticle): BlogArticle {
  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    excerpt: (node.excerpt ?? '').trim(),
    contentHtml: node.contentHtml,
    publishedAt: node.publishedAt,
    tags: node.tags ?? [],
    authorName: node.authorV2?.name ?? undefined,
    authorBio: node.authorV2?.bio ?? undefined,
    image: node.image
      ? { url: node.image.url, alt: node.image.altText ?? node.title }
      : undefined,
    blogHandle: node.blog?.handle,
  };
}

function sortArticles(items: BlogArticle[], first: number): BlogArticle[] {
  return [...items]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, first);
}

async function getBlogHandles(): Promise<string[]> {
  try {
    const data: any = await shopifyClient.request(GET_BLOGS, { first: 20 });
    const edges = data?.blogs?.edges as { node: { handle: string } }[] | undefined;
    const handles = (edges ?? []).map((e) => e.node.handle);
    if (handles.length) return handles;
  } catch (error) {
    console.warn('[Shopify] No se pudieron listar los blogs:', error);
  }
  return [DEFAULT_BLOG_HANDLE];
}

/** Recorre cada blog y fusiona sus artículos (fallback fiable). */
async function fetchArticlesFromAllBlogs(first: number): Promise<BlogArticle[]> {
  const handles = await getBlogHandles();
  const byId = new Map<string, BlogArticle>();

  for (const blogHandle of handles) {
    try {
      const data: any = await shopifyClient.request(GET_ARTICLES, {
        first,
        blogHandle,
      });
      const edges = data?.blog?.articles?.edges as { node: ShopifyArticle }[] | undefined;
      for (const { node } of edges ?? []) {
        byId.set(node.id, toBlogArticle({
          ...node,
          blog: { handle: blogHandle, title: data.blog?.title ?? blogHandle },
        }));
      }
    } catch (error) {
      console.warn(`[Shopify] No se pudo cargar el blog "${blogHandle}":`, error);
    }
  }

  return sortArticles([...byId.values()], first);
}

/**
 * Devuelve los artículos publicados de todos los blogs (o de uno si hay filtro),
 * ordenados del más nuevo al más antiguo.
 */
export async function getArticles(
  first: number = 12,
  blogHandle?: string
): Promise<BlogArticle[]> {
  const filterBlog = blogHandle ?? BLOG_HANDLE_FILTER;

  if (filterBlog) {
    try {
      const data: any = await shopifyClient.request(GET_ARTICLES, {
        first,
        blogHandle: filterBlog,
      });
      const edges = data?.blog?.articles?.edges as { node: ShopifyArticle }[] | undefined;
      if (edges?.length) {
        return edges.map((e) =>
          toBlogArticle({
            ...e.node,
            blog: { handle: filterBlog, title: data.blog.title },
          })
        );
      }
    } catch (error) {
      console.warn(`[Shopify] No se pudo cargar el blog "${filterBlog}":`, error);
    }
  }

  try {
    const data: any = await shopifyClient.request(GET_ALL_ARTICLES, { first });
    const edges = data?.articles?.edges as { node: ShopifyArticle }[] | undefined;
    if (edges?.length) {
      return edges.map((e) => toBlogArticle(e.node));
    }
  } catch (error) {
    console.warn(
      '[Shopify] Query global de artículos no disponible, usando blogs individuales…',
      error
    );
  }

  return fetchArticlesFromAllBlogs(first);
}

/**
 * Busca un artículo por handle en todos los blogs de la tienda.
 */
export async function getArticleByHandle(articleHandle: string): Promise<BlogArticle | null> {
  const blogHandles = await getBlogHandles();
  const handlesToTry = [...new Set([DEFAULT_BLOG_HANDLE, ...blogHandles])];

  for (const blogHandle of handlesToTry) {
    try {
      const data: any = await shopifyClient.request(GET_ARTICLE_BY_HANDLE, {
        blogHandle,
        articleHandle,
      });
      const node = data?.blog?.articleByHandle as ShopifyArticle | null | undefined;
      if (node) {
        return toBlogArticle({
          ...node,
          blog: { handle: blogHandle, title: data.blog.title },
        });
      }
    } catch {
      // Probar el siguiente blog
    }
  }

  return null;
}

/** Formatea la fecha al estilo "5 de mayo de 2026" en español. */
export function formatArticleDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return '';
  }
}

/** Estima minutos de lectura usando 220 palabras por minuto. */
export function estimateReadingTime(html?: string): number {
  if (!html) return 1;
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = text ? text.split(' ').length : 0;
  return Math.max(1, Math.round(words / 220));
}
