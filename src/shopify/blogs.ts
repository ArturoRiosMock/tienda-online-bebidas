import { shopifyClient, GET_ARTICLES, GET_ARTICLE_BY_HANDLE } from './queries';
import type {
  ShopifyArticleListNode,
  ShopifyArticleDetail,
  BlogArticle,
  BlogArticleDetail,
} from './types';

const stripHtml = (html: string | null | undefined): string => {
  if (!html) return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const truncate = (text: string, max: number): string => {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
};

const toBlogArticle = (node: ShopifyArticleListNode): BlogArticle => {
  const excerpt =
    (node.excerpt && node.excerpt.trim()) ||
    truncate(stripHtml(node.excerptHtml), 200);

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    excerpt,
    excerptHtml: node.excerptHtml ?? undefined,
    publishedAt: node.publishedAt,
    tags: node.tags ?? [],
    image: node.image?.url ?? null,
    imageAlt: node.image?.altText ?? node.title,
    author: node.authorV2?.name ?? null,
    blogHandle: node.blog.handle,
    blogTitle: node.blog.title,
  };
};

const toBlogArticleDetail = (node: ShopifyArticleDetail): BlogArticleDetail => {
  const excerpt =
    (node.excerpt && node.excerpt.trim()) ||
    truncate(stripHtml(node.excerptHtml), 200);

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    excerpt,
    excerptHtml: node.excerptHtml ?? undefined,
    publishedAt: node.publishedAt,
    tags: node.tags ?? [],
    image: node.image?.url ?? null,
    imageAlt: node.image?.altText ?? node.title,
    author: node.authorV2?.name ?? null,
    authorBio: node.authorV2?.bio ?? null,
    blogHandle: node.blog.handle,
    blogTitle: node.blog.title,
    contentHtml: node.contentHtml,
  };
};

/** Devuelve los artículos publicados más recientes de todos los blogs */
export const getArticles = async (first: number = 30): Promise<BlogArticle[]> => {
  try {
    const data: any = await shopifyClient.request(GET_ARTICLES, { first });
    const edges = data?.articles?.edges ?? [];
    return edges.map((e: { node: ShopifyArticleListNode }) => toBlogArticle(e.node));
  } catch (error) {
    console.error('Error fetching articles from Shopify:', error);
    return [];
  }
};

/** Devuelve un artículo por su blog y handle */
export const getArticleByHandle = async (
  blogHandle: string,
  articleHandle: string
): Promise<BlogArticleDetail | null> => {
  try {
    const data: any = await shopifyClient.request(GET_ARTICLE_BY_HANDLE, {
      blogHandle,
      articleHandle,
    });
    const article = data?.blog?.articleByHandle;
    if (!article) return null;
    return toBlogArticleDetail(article as ShopifyArticleDetail);
  } catch (error) {
    console.error('Error fetching article from Shopify:', error);
    return null;
  }
};
