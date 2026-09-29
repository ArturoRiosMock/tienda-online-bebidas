#!/usr/bin/env node
/**
 * Test local de la función SSR producto usando el index.html de dist
 * y un mock de la respuesta de Shopify.
 *
 * Uso:
 *   npm run build && node scripts/test-producto-ssr-local.mjs
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const SITE_NAME = 'Mr. Brown';
const SITE_URL = 'https://www.mrbrown.com.mx';
const TITLE_SUFFIX = ` | ${SITE_NAME}`;

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function escapeJsonLd(str) {
  return str.replace(/<\/script/gi, '<\\/script');
}

function truncate(text, max) {
  if (!text) return '';
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max - 1).trimEnd()}…`;
}

function buildMetaDescription(product) {
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

function buildProductJsonLd(product) {
  const canonical = `${SITE_URL}/producto/${product.handle}`;
  const availability = product.availableForSale
    ? 'https://schema.org/InStock'
    : 'https://schema.org/OutOfStock';

  const schema = {
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

function buildFullTitle(product) {
  const baseTitle = product.seoTitle || product.name;
  if (baseTitle.includes(SITE_NAME)) {
    return baseTitle;
  }
  return `${baseTitle}${TITLE_SUFFIX}`;
}

function replaceOrInsertMeta(html, attr, name, content) {
  const escapedContent = escapeHtml(content);
  const regex = new RegExp(`<meta\\s+${attr}="${name}"\\s+content="[^"]*"\\s*/?>`, 'i');
  const newTag = `<meta ${attr}="${name}" content="${escapedContent}" />`;

  if (regex.test(html)) {
    return html.replace(regex, newTag);
  }
  return html.replace('</head>', `    ${newTag}\n  </head>`);
}

function removeMetaIfExists(html, attr, name) {
  const regex = new RegExp(`\\s*<meta\\s+${attr}="${name}"\\s+content="[^"]*"\\s*/?>\\s*`, 'gi');
  return html.replace(regex, '\n');
}

function injectProductMetas(html, product) {
  const canonical = `${SITE_URL}/producto/${product.handle}`;
  const fullTitle = buildFullTitle(product);
  const description = buildMetaDescription(product);
  const ogImage = product.images[0] || `${SITE_URL}/og-share.jpg`;
  const availability = product.availableForSale ? 'in stock' : 'out of stock';
  const jsonLd = buildProductJsonLd(product);

  const escapedTitle = escapeHtml(fullTitle);
  const escapedCanonical = escapeHtml(canonical);
  const escapedImageAlt = escapeHtml(`${product.name} — Mr. Brown`);
  const jsonLdString = escapeJsonLd(JSON.stringify(jsonLd));

  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapedTitle}</title>`);

  const canonicalRegex = /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i;
  const canonicalTag = `<link rel="canonical" href="${escapedCanonical}" />`;
  if (canonicalRegex.test(html)) {
    html = html.replace(canonicalRegex, canonicalTag);
  } else {
    html = html.replace('</head>', `    ${canonicalTag}\n  </head>`);
  }

  html = replaceOrInsertMeta(html, 'name', 'description', description);
  html = replaceOrInsertMeta(html, 'property', 'og:type', 'product');
  html = replaceOrInsertMeta(html, 'property', 'og:title', fullTitle);
  html = replaceOrInsertMeta(html, 'property', 'og:description', description);
  html = replaceOrInsertMeta(html, 'property', 'og:url', canonical);
  html = replaceOrInsertMeta(html, 'property', 'og:image', ogImage);
  html = replaceOrInsertMeta(html, 'property', 'og:image:alt', escapedImageAlt);

  html = removeMetaIfExists(html, 'property', 'og:image:width');
  html = removeMetaIfExists(html, 'property', 'og:image:height');

  html = replaceOrInsertMeta(html, 'name', 'twitter:title', fullTitle);
  html = replaceOrInsertMeta(html, 'name', 'twitter:description', description);
  html = replaceOrInsertMeta(html, 'name', 'twitter:image', ogImage);
  html = replaceOrInsertMeta(html, 'name', 'twitter:image:alt', `${product.name} — Mr. Brown`);

  html = replaceOrInsertMeta(html, 'property', 'product:price:amount', product.price.toFixed(2));
  html = replaceOrInsertMeta(html, 'property', 'product:price:currency', product.currency);
  html = replaceOrInsertMeta(html, 'property', 'product:availability', availability);

  const jsonLdScript = `<script type="application/ld+json" data-ssr-product="true">${jsonLdString}</script>`;
  html = html.replace('</head>', `    ${jsonLdScript}\n  </head>`);

  return html;
}

function countOccurrences(html, regex) {
  const matches = html.match(new RegExp(regex.source, 'gi'));
  return matches ? matches.length : 0;
}

const mockProduct = {
  name: 'Tequila Don Julio 70 Añejo 700 ml',
  description: 'Un tequila añejo cristalino con notas de vainilla, caramelo y agave. Perfecto para disfrutar solo o en cocteles premium.',
  handle: 'tequila-don-julio-70-anejo-700-ml',
  price: 1299.00,
  currency: 'MXN',
  availableForSale: true,
  images: [
    'https://cdn.shopify.com/s/files/1/1234/5678/products/don-julio-70.jpg',
    'https://cdn.shopify.com/s/files/1/1234/5678/products/don-julio-70-back.jpg',
  ],
  sku: 'DTE-BA-075',
  gtin: '7501035010123',
  vendor: 'Casa Don Julio',
  seoTitle: null,
  seoDescription: null,
  productType: 'Tequila',
};

console.log('\n🧪 Test local de inyección SSR de metas de producto\n');

let indexHtml;
try {
  indexHtml = readFileSync(join(projectRoot, 'dist', 'index.html'), 'utf-8');
  console.log('✅ Leído dist/index.html');
} catch (e) {
  console.error('❌ No se encontró dist/index.html. Ejecuta `npm run build` primero.');
  process.exit(1);
}

console.log(`\n📦 Producto mock: ${mockProduct.name}`);
console.log(`   Handle: ${mockProduct.handle}`);
console.log(`   Precio: $${mockProduct.price} ${mockProduct.currency}\n`);

const resultHtml = injectProductMetas(indexHtml, mockProduct);

const checks = [
  {
    name: '<title> contiene nombre del producto',
    regex: /<title>([^<]+)<\/title>/,
    expected: (m) => m && m[1].includes('Tequila Don Julio'),
  },
  {
    name: 'Exactamente 1 <title>',
    regex: /<title>/,
    expected: () => countOccurrences(resultHtml, /<title>/) === 1,
    isCount: true,
  },
  {
    name: 'canonical URL apunta al producto',
    regex: /<link\s+rel="canonical"\s+href="([^"]+)"/,
    expected: (m) => m && m[1] === 'https://www.mrbrown.com.mx/producto/tequila-don-julio-70-anejo-700-ml',
  },
  {
    name: 'Exactamente 1 canonical',
    regex: /<link\s+rel="canonical"/,
    expected: () => countOccurrences(resultHtml, /<link\s+rel="canonical"/) === 1,
    isCount: true,
  },
  {
    name: 'og:type=product',
    regex: /<meta\s+property="og:type"\s+content="([^"]+)"/,
    expected: (m) => m && m[1] === 'product',
  },
  {
    name: 'og:url apunta al producto',
    regex: /<meta\s+property="og:url"\s+content="([^"]+)"/,
    expected: (m) => m && m[1].includes('/producto/tequila-don-julio'),
  },
  {
    name: 'Exactamente 1 og:url',
    regex: /<meta\s+property="og:url"/,
    expected: () => countOccurrences(resultHtml, /<meta\s+property="og:url"/) === 1,
    isCount: true,
  },
  {
    name: 'og:image es la imagen del producto',
    regex: /<meta\s+property="og:image"\s+content="([^"]+)"/,
    expected: (m) => m && m[1].includes('don-julio-70.jpg'),
  },
  {
    name: 'No hay og:image:width (removido)',
    regex: /<meta\s+property="og:image:width"/,
    expected: () => countOccurrences(resultHtml, /<meta\s+property="og:image:width"/) === 0,
    isCount: true,
    expectZero: true,
  },
  {
    name: 'No hay og:image:height (removido)',
    regex: /<meta\s+property="og:image:height"/,
    expected: () => countOccurrences(resultHtml, /<meta\s+property="og:image:height"/) === 0,
    isCount: true,
    expectZero: true,
  },
  {
    name: 'product:price:amount=1299.00',
    regex: /<meta\s+property="product:price:amount"\s+content="([^"]+)"/,
    expected: (m) => m && m[1] === '1299.00',
  },
  {
    name: 'product:price:currency=MXN',
    regex: /<meta\s+property="product:price:currency"\s+content="([^"]+)"/,
    expected: (m) => m && m[1] === 'MXN',
  },
  {
    name: 'product:availability=in stock',
    regex: /<meta\s+property="product:availability"\s+content="([^"]+)"/,
    expected: (m) => m && m[1] === 'in stock',
  },
  {
    name: 'JSON-LD Product con data-ssr-product',
    regex: /<script\s+type="application\/ld\+json"\s+data-ssr-product="true">([^<]+)<\/script>/,
    expected: (m) => {
      if (!m) return false;
      try {
        const json = JSON.parse(m[1]);
        return (
          json['@type'] === 'Product' &&
          json.name === mockProduct.name &&
          json.offers?.price === '1299.00' &&
          json.offers?.availability === 'https://schema.org/InStock'
        );
      } catch {
        return false;
      }
    },
  },
  {
    name: 'Exactamente 1 JSON-LD Product (data-ssr-product)',
    regex: /data-ssr-product="true"/,
    expected: () => countOccurrences(resultHtml, /data-ssr-product="true"/) === 1,
    isCount: true,
  },
  {
    name: 'JSON-LD Organization preservado',
    regex: /"@type":\s*"Organization"/,
    expected: (m) => !!m,
  },
  {
    name: 'Exactamente 1 JSON-LD Organization',
    regex: /"@type":\s*"Organization"/,
    expected: () => countOccurrences(resultHtml, /"@type":\s*"Organization"/) === 1,
    isCount: true,
  },
  {
    name: 'twitter:title actualizado',
    regex: /<meta\s+name="twitter:title"\s+content="([^"]+)"/,
    expected: (m) => m && m[1].includes('Tequila Don Julio'),
  },
  {
    name: 'twitter:image actualizado',
    regex: /<meta\s+name="twitter:image"\s+content="([^"]+)"/,
    expected: (m) => m && m[1].includes('don-julio-70.jpg'),
  },
  {
    name: 'SPA shell intacto (div#root)',
    regex: /<div\s+id="root">/,
    expected: (m) => !!m,
  },
  {
    name: 'Script de Vite intacto',
    regex: /<script\s+type="module"/,
    expected: (m) => !!m,
  },
];

let passed = 0;
let failed = 0;

console.log('--- Resultados de aserciones ---\n');

for (const check of checks) {
  const match = resultHtml.match(check.regex);
  const ok = check.expected(match);

  if (ok) {
    let displayValue = 'OK';
    if (!check.isCount && match && match[1]) {
      displayValue = match[1].slice(0, 70);
    } else if (check.isCount) {
      const count = countOccurrences(resultHtml, check.regex);
      displayValue = `count=${count}`;
    }
    console.log(`✅ ${check.name}: ${displayValue}`);
    passed++;
  } else {
    let displayValue = 'NOT FOUND';
    if (check.isCount) {
      const count = countOccurrences(resultHtml, check.regex);
      const expectedCount = check.expectZero ? 0 : 1;
      displayValue = `count=${count} (expected ${expectedCount})`;
    } else if (match && match[1]) {
      displayValue = match[1].slice(0, 70);
    }
    console.log(`❌ ${check.name}: ${displayValue}`);
    failed++;
  }
}

console.log(`\n📊 Resultados: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  console.log('❌ Algunas aserciones fallaron. Revisa la implementación.\n');
  process.exit(1);
} else {
  console.log('✅ Todas las aserciones pasaron. La inyección SSR funciona correctamente.\n');
}
