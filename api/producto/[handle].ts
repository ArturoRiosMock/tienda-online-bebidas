/**
 * Vercel Edge Function: SSR de metadatos para páginas de producto.
 *
 * Intercepta /producto/:handle, obtiene el producto de Shopify Storefront API
 * y sirve el index.html con las metas SEO inyectadas (title, description,
 * canonical, Open Graph, Twitter Cards, JSON-LD Product).
 *
 * Esto permite que Googlebot indexe las metas de producto sin ejecutar JS.
 *
 * IMPORTANTE: Esta función usa las mismas variables de entorno que el frontend
 * (VITE_SHOPIFY_STORE_DOMAIN, VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN). En Vercel,
 * las variables VITE_* se inyectan en runtime porque están definidas en el
 * dashboard del proyecto. Si solo necesitas build-time, funcionan igual.
 */

export const config = {
  runtime: 'edge',
};

const SITE_NAME = 'Mr. Brown';
const SITE_URL = 'https://www.mrbrown.com.mx';
const TITLE_SUFFIX = ` | ${SITE_NAME}`;

interface ShopifyProductResponse {
  data?: {
    product?: {
      id: string;
      title: string;
      description: string;
      handle: string;
      productType: string;
      vendor: string;
      tags: string[];
      seo?: {
        title?: string | null;
        description?: string | null;
      };
      priceRange: {
        minVariantPrice: {
          amount: string;
          currencyCode: string;
        };
      };
      images: {
        edges: Array<{
          node: {
            url: string;
            altText: string | null;
          };
        }>;
      };
      variants: {
        edges: Array<{
          node: {
            id: string;
            sku: string | null;
            barcode: string | null;
            availableForSale: boolean;
            price: {
              amount: string;
              currencyCode: string;
            };
          };
        }>;
      };
    } | null;
  };
  errors?: unknown;
}

const GET_PRODUCT_FOR_SEO = `
  query GetProductForSEO($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      handle
      productType
      vendor
      tags
      seo {
        title
        description
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 1) {
        edges {
          node {
            id
            sku
            barcode
            availableForSale
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function escapeJsonLd(str: string): string {
  return str.replace(/<\/script/gi, '<\\/script');
}

function truncate(text: string, max: number): string {
  if (!text) return '';
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max - 1).trimEnd()}…`;
}

interface ProductData {
  name: string;
  description: string;
  handle: string;
  price: number;
  currency: string;
  availableForSale: boolean;
  images: string[];
  sku: string | null;
  gtin: string | null;
  vendor: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  productType: string | null;
}

function buildMetaDescription(product: ProductData): string {
  if (product.seoDescription) {
    return truncate(product.seoDescription, 160);
  }
  const parts = [
    product.vendor && `Marca: ${product.vendor}.`,
    product.productType && `Tipo: ${product.productType}.`,
    `Precio $${product.price.toFixed(2)} MXN.`,
    'Compra en Mr. Brown con envío rápido en CDMX.',
    product.description ? truncate(product.description, 80) : '',
  ].filter(Boolean);
  return truncate(parts.join(' '), 160);
}

function buildProductJsonLd(product: ProductData): object {
  const canonical = `${SITE_URL}/producto/${product.handle}`;
  const availability = product.availableForSale
    ? 'https://schema.org/InStock'
    : 'https://schema.org/OutOfStock';

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    url: canonical,
    description: product.description
      ? truncate(product.description.replace(/\s+/g, ' ').trim(), 500)
      : undefined,
    offers: {
      '@type': 'Offer',
      url: canonical,
      priceCurrency: product.currency,
      price: product.price.toFixed(2),
      availability,
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  if (product.images.length > 0) {
    schema.image = product.images.slice(0, 5);
  }

  if (product.vendor) {
    schema.brand = { '@type': 'Brand', name: product.vendor };
  }

  if (product.sku) {
    schema.sku = product.sku;
  }

  if (product.gtin) {
    schema.gtin = product.gtin;
  }

  if (product.productType) {
    schema.category = product.productType;
  }

  return schema;
}

function buildFullTitle(product: ProductData): string {
  const baseTitle = product.seoTitle || product.name;
  if (baseTitle.includes(SITE_NAME)) {
    return baseTitle;
  }
  return `${baseTitle}${TITLE_SUFFIX}`;
}

function replaceOrInsertMeta(
  html: string,
  attr: 'name' | 'property',
  name: string,
  content: string
): string {
  const escapedContent = escapeHtml(content);
  const regex = new RegExp(
    `<meta\\s+${attr}="${name}"\\s+content="[^"]*"\\s*/?>`,
    'i'
  );
  const newTag = `<meta ${attr}="${name}" content="${escapedContent}" />`;

  if (regex.test(html)) {
    return html.replace(regex, newTag);
  }
  return html.replace('</head>', `    ${newTag}\n  </head>`);
}

function removeMetaIfExists(html: string, attr: 'name' | 'property', name: string): string {
  const regex = new RegExp(
    `\\s*<meta\\s+${attr}="${name}"\\s+content="[^"]*"\\s*/?>\\s*`,
    'gi'
  );
  return html.replace(regex, '\n');
}

function isValidIndexHtml(html: string): boolean {
  return html.includes('<div id="root">') && html.includes('</head>');
}

function injectProductMetas(html: string, product: ProductData): string {
  const canonical = `${SITE_URL}/producto/${product.handle}`;
  const fullTitle = buildFullTitle(product);
  const description = buildMetaDescription(product);
  const ogImage = product.images[0] || `${SITE_URL}/og-share.jpg`;
  const availability = product.availableForSale ? 'in stock' : 'out of stock';
  const jsonLd = buildProductJsonLd(product);

  const escapedTitle = escapeHtml(fullTitle);
  const escapedCanonical = escapeHtml(canonical);
  const jsonLdString = escapeJsonLd(JSON.stringify(jsonLd));
  const imageAlt = `${product.name} — Mr. Brown`;

  // Replace <title>
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapedTitle}</title>`);

  // Handle canonical: insert if missing, replace if present
  const canonicalRegex = /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i;
  const canonicalTag = `<link rel="canonical" href="${escapedCanonical}" />`;
  if (canonicalRegex.test(html)) {
    html = html.replace(canonicalRegex, canonicalTag);
  } else {
    html = html.replace('</head>', `    ${canonicalTag}\n  </head>`);
  }

  // Replace meta description
  html = replaceOrInsertMeta(html, 'name', 'description', description);

  // Replace Open Graph metas (replaceOrInsertMeta already escapes content)
  html = replaceOrInsertMeta(html, 'property', 'og:type', 'product');
  html = replaceOrInsertMeta(html, 'property', 'og:title', fullTitle);
  html = replaceOrInsertMeta(html, 'property', 'og:description', description);
  html = replaceOrInsertMeta(html, 'property', 'og:url', canonical);
  html = replaceOrInsertMeta(html, 'property', 'og:image', ogImage);
  html = replaceOrInsertMeta(html, 'property', 'og:image:alt', imageAlt);

  // Remove og:image:width and og:image:height (product images have unknown dimensions)
  html = removeMetaIfExists(html, 'property', 'og:image:width');
  html = removeMetaIfExists(html, 'property', 'og:image:height');

  // Replace Twitter Card metas
  html = replaceOrInsertMeta(html, 'name', 'twitter:title', fullTitle);
  html = replaceOrInsertMeta(html, 'name', 'twitter:description', description);
  html = replaceOrInsertMeta(html, 'name', 'twitter:image', ogImage);
  html = replaceOrInsertMeta(html, 'name', 'twitter:image:alt', imageAlt);

  // Inject product-specific OG metas
  html = replaceOrInsertMeta(
    html,
    'property',
    'product:price:amount',
    product.price.toFixed(2)
  );
  html = replaceOrInsertMeta(html, 'property', 'product:price:currency', product.currency);
  html = replaceOrInsertMeta(html, 'property', 'product:availability', availability);

  // Inject JSON-LD Product schema before </head>, marked for client detection
  const jsonLdScript = `<script type="application/ld+json" data-ssr-product="true">${jsonLdString}</script>`;
  html = html.replace('</head>', `    ${jsonLdScript}\n  </head>`);

  return html;
}

async function fetchProductFromShopify(
  handle: string,
  storeDomain: string,
  storefrontToken: string
): Promise<ProductData | null> {
  const apiUrl = `https://${storeDomain}/api/2024-10/graphql.json`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontToken,
    },
    body: JSON.stringify({
      query: GET_PRODUCT_FOR_SEO,
      variables: { handle },
    }),
  });

  if (!response.ok) {
    console.error(`[producto-ssr] Shopify HTTP error: ${response.status}`);
    return null;
  }

  const json = (await response.json()) as ShopifyProductResponse;

  if (json.errors) {
    console.error('[producto-ssr] Shopify GraphQL errors:', json.errors);
    return null;
  }

  const product = json.data?.product;
  if (!product) {
    return null;
  }

  const firstVariant = product.variants.edges[0]?.node;
  const images = product.images.edges.map((e) => e.node.url).filter(Boolean);
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const availableForSale = product.variants.edges.some((e) => e.node.availableForSale);

  return {
    name: product.title,
    description: product.description,
    handle: product.handle,
    price,
    currency: product.priceRange.minVariantPrice.currencyCode || 'MXN',
    availableForSale,
    images,
    sku: firstVariant?.sku || null,
    gtin: firstVariant?.barcode || null,
    vendor: product.vendor || null,
    seoTitle: product.seo?.title || null,
    seoDescription: product.seo?.description || null,
    productType: product.productType || null,
  };
}

async function fetchIndexHtml(req: Request): Promise<string> {
  const url = new URL(req.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  const indexUrl = `${baseUrl}/index.html`;

  const response = await fetch(indexUrl, {
    headers: {
      'User-Agent': 'Vercel-Edge-Function/SSR',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch index.html: ${response.status}`);
  }

  return response.text();
}

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const handle = pathParts[1];

  if (!handle) {
    return new Response('Not Found', { status: 404 });
  }

  const storeDomain = process.env.VITE_SHOPIFY_STORE_DOMAIN;
  const storefrontToken = process.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!storeDomain || !storefrontToken) {
    console.error(
      '[producto-ssr] Missing VITE_SHOPIFY_STORE_DOMAIN or VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN'
    );
    try {
      const html = await fetchIndexHtml(req);
      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      });
    } catch {
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  try {
    const [product, indexHtml] = await Promise.all([
      fetchProductFromShopify(handle, storeDomain, storefrontToken),
      fetchIndexHtml(req),
    ]);

    // Validate HTML before injecting metas - avoid modifying login/error pages
    if (!isValidIndexHtml(indexHtml)) {
      console.error(
        '[producto-ssr] Invalid index.html received (missing div#root or </head>). ' +
          'This may happen in Vercel Preview with Protection enabled.'
      );
      return new Response(indexHtml, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      });
    }

    if (!product) {
      return new Response(indexHtml, {
        status: 404,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      });
    }

    const finalHtml = injectProductMetas(indexHtml, product);

    return new Response(finalHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('[producto-ssr] Error:', error);

    try {
      const html = await fetchIndexHtml(req);
      // Also validate in error fallback path
      if (!isValidIndexHtml(html)) {
        console.error('[producto-ssr] Invalid HTML in error fallback path');
      }
      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      });
    } catch {
      return new Response('Internal Server Error', { status: 500 });
    }
  }
}
