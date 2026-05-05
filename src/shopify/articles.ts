import { shopifyClient, GET_ARTICLES, GET_ALL_ARTICLES, GET_ARTICLE_BY_HANDLE } from './queries';
import type { BlogArticle, ShopifyArticle } from './types';

/**
 * Handle del blog principal en Shopify. Por defecto Shopify crea uno con
 * handle "news"; si tu tienda usa otro handle, ajústalo aquí o pásalo
 * explícitamente a las funciones.
 */
export const DEFAULT_BLOG_HANDLE = 'news';

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

/**
 * Devuelve los artículos publicados, ordenados del más nuevo al más antiguo.
 * Intenta primero el blog principal (`DEFAULT_BLOG_HANDLE`); si no existe o
 * no devuelve resultados, hace fallback a `articles` global (todos los blogs).
 */
export async function getArticles(
  first: number = 12,
  blogHandle: string = DEFAULT_BLOG_HANDLE
): Promise<BlogArticle[]> {
  try {
    const data: any = await shopifyClient.request(GET_ARTICLES, { first, blogHandle });
    const edges = data?.blog?.articles?.edges as { node: ShopifyArticle }[] | undefined;

    if (edges?.length) {
      return edges.map((e) => toBlogArticle({ ...e.node, blog: { handle: blogHandle, title: data.blog.title } }));
    }
  } catch (error) {
    console.warn(`[Shopify] No se pudo cargar el blog "${blogHandle}", probando articles global…`, error);
  }

  try {
    const data: any = await shopifyClient.request(GET_ALL_ARTICLES, { first });
    const edges = data?.articles?.edges as { node: ShopifyArticle }[] | undefined;
    return (edges ?? []).map((e) => toBlogArticle(e.node));
  } catch (error) {
    console.error('[Shopify] Error obteniendo artículos:', error);
    return [];
  }
}

/**
 * Busca un artículo por su handle. Si no se conoce el blog, se itera sobre los
 * artículos globales hasta encontrarlo (sólo se hace cuando el blog principal
 * no contiene el handle solicitado).
 */
export async function getArticleByHandle(
  articleHandle: string,
  blogHandle: string = DEFAULT_BLOG_HANDLE
): Promise<BlogArticle | null> {
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
  } catch (error) {
    console.warn(
      `[Shopify] No se encontró el artículo "${articleHandle}" en el blog "${blogHandle}". Probando búsqueda global…`,
      error
    );
  }

  try {
    const fallback = await getArticles(50);
    return fallback.find((a) => a.handle === articleHandle) ?? null;
  } catch (error) {
    console.error('[Shopify] Error en fallback de artículos:', error);
    return null;
  }
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
