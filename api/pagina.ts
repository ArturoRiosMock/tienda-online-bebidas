/**
 * Vercel Edge Function: SSR de metadatos para páginas estáticas.
 *
 * Intercepta rutas estáticas como /productos, /contacto, etc., y sirve el index.html
 * con las metas SEO inyectadas (title, description, canonical, Open Graph, Twitter Cards).
 *
 * Esto permite que Googlebot indexe las metas específicas de cada página sin ejecutar JS,
 * resolviendo el problema de páginas duplicadas de la home en Search Console.
 *
 * Sigue el mismo patrón que api/producto/[handle].ts.
 */

export const config = {
  runtime: 'edge',
};

const SITE_NAME = 'Mr. Brown';
const SITE_URL = 'https://www.mrbrown.com.mx';
const TITLE_SUFFIX = ` | ${SITE_NAME}`;

/**
 * Tabla de rutas estáticas con sus metadatos SEO.
 * Para añadir una nueva página, simplemente agregar una entrada aquí.
 */
interface StaticPageMeta {
  path: string;
  title: string;
  description: string;
}

const STATIC_PAGES: StaticPageMeta[] = [
  {
    path: '/productos',
    title: 'Comprar vinos, licores y bebidas en CDMX',
    description:
      'Explora nuestra selección de tequila, whisky, mezcal, vinos, cervezas y más. Envío rápido en CDMX y zona metropolitana. Bebidas 100% originales.',
  },
  {
    path: '/contacto',
    title: 'Contacto',
    description:
      'Contacto Mr. Brown: correo, envío en 24 h en CDMX y Valle de Bravo, zonas de entrega y horarios. Atención por email y redes sociales.',
  },
  // Rutas adicionales preparadas para futuros PRs:
  // {
  //   path: '/preguntas-frecuentes',
  //   title: 'Preguntas Frecuentes',
  //   description:
  //     'Resuelve tus dudas sobre métodos de pago, envíos en CDMX, tiempos de entrega, devoluciones y compra de bebidas alcohólicas en Mr. Brown.',
  // },
  // {
  //   path: '/cotizar-evento',
  //   title: 'Cotiza tu Evento',
  //   description:
  //     'Solicita una cotización para bodas, cumpleaños, fiestas corporativas o XV años en CDMX. Barras libres, mixología y bebidas premium.',
  // },
  // {
  //   path: '/blog',
  //   title: 'Blog',
  //   description:
  //     'Cocteles, recetas, maridajes y guías para disfrutar tus bebidas favoritas. Consejos de mixología y tendencias en Mr. Brown.',
  // },
  // {
  //   path: '/page/sobre-nosotros',
  //   title: 'Sobre Nosotros',
  //   description:
  //     'Mr. Brown — House of Spirits desde 2018: curadores de experiencias premium en bebidas. Selección, mixología y barras para eventos en CDMX.',
  // },
  // {
  //   path: '/aviso-de-privacidad',
  //   title: 'Aviso de Privacidad',
  //   description:
  //     'Aviso de privacidad de Mr. Brown. Conoce cómo protegemos y tratamos tus datos personales conforme a la ley mexicana.',
  // },
  // {
  //   path: '/politica-de-reembolso',
  //   title: 'Política de Reembolso',
  //   description:
  //     'Política de reembolso y devoluciones de Mr. Brown. Conoce los plazos, condiciones y proceso para solicitar un reembolso.',
  // },
  // {
  //   path: '/terminos-de-servicio',
  //   title: 'Términos de Servicio',
  //   description:
  //     'Términos y condiciones de uso de Mr. Brown. Lee los términos legales antes de comprar en nuestra tienda en línea.',
  // },
];

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
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

function isValidIndexHtml(html: string): boolean {
  return html.includes('<div id="root">') && html.includes('</head>');
}

function buildFullTitle(pageTitle: string): string {
  if (pageTitle.includes(SITE_NAME)) {
    return pageTitle;
  }
  return `${pageTitle}${TITLE_SUFFIX}`;
}

function injectPageMetas(html: string, page: StaticPageMeta): string {
  const canonical = `${SITE_URL}${page.path}`;
  const fullTitle = buildFullTitle(page.title);

  const escapedTitle = escapeHtml(fullTitle);
  const escapedCanonical = escapeHtml(canonical);

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
  html = replaceOrInsertMeta(html, 'name', 'description', page.description);

  // Replace Open Graph metas
  html = replaceOrInsertMeta(html, 'property', 'og:type', 'website');
  html = replaceOrInsertMeta(html, 'property', 'og:title', fullTitle);
  html = replaceOrInsertMeta(html, 'property', 'og:description', page.description);
  html = replaceOrInsertMeta(html, 'property', 'og:url', canonical);

  // Replace Twitter Card metas
  html = replaceOrInsertMeta(html, 'name', 'twitter:title', fullTitle);
  html = replaceOrInsertMeta(html, 'name', 'twitter:description', page.description);

  return html;
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

function getPagePath(req: Request): string | null {
  const url = new URL(req.url);
  
  // Primero intenta obtener la ruta del query param
  const pathParam = url.searchParams.get('path');
  if (pathParam) {
    return pathParam;
  }
  
  // Fallback: obtener de x-matched-path header (Vercel lo setea)
  const matchedPath = req.headers.get('x-matched-path');
  if (matchedPath) {
    // El header puede tener el formato /api/pagina?path=/productos
    // Extraemos solo el path si viene en ese formato
    const match = matchedPath.match(/path=([^&]+)/);
    if (match) {
      return decodeURIComponent(match[1]);
    }
  }
  
  return null;
}

export default async function handler(req: Request): Promise<Response> {
  const pagePath = getPagePath(req);
  
  // Buscar la página en la tabla
  const page = pagePath ? STATIC_PAGES.find((p) => p.path === pagePath) : null;

  try {
    const indexHtml = await fetchIndexHtml(req);

    // Validar HTML antes de inyectar metas
    if (!isValidIndexHtml(indexHtml)) {
      console.error(
        '[pagina-ssr] Invalid index.html received (missing div#root or </head>). ' +
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

    // Si no hay página o la ruta no está en la tabla, devolver index.html sin modificar
    if (!page) {
      return new Response(indexHtml, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      });
    }

    // Inyectar metas específicas de la página
    const finalHtml = injectPageMetas(indexHtml, page);

    return new Response(finalHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('[pagina-ssr] Error:', error);

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
}
