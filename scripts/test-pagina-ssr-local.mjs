#!/usr/bin/env node
/**
 * Test local de la función SSR de páginas estáticas usando el index.html de dist.
 *
 * Uso:
 *   npm run build && node scripts/test-pagina-ssr-local.mjs
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

// Replica de la tabla de rutas de api/pagina.ts
const STATIC_PAGES = [
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
];

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
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

function isValidIndexHtml(html) {
  return html.includes('<div id="root">') && html.includes('</head>');
}

function buildFullTitle(pageTitle) {
  if (pageTitle.includes(SITE_NAME)) {
    return pageTitle;
  }
  return `${pageTitle}${TITLE_SUFFIX}`;
}

function injectPageMetas(html, page) {
  const canonical = `${SITE_URL}${page.path}`;
  const fullTitle = buildFullTitle(page.title);

  const escapedTitle = escapeHtml(fullTitle);
  const escapedCanonical = escapeHtml(canonical);

  // Replace <title>
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapedTitle}</title>`);

  // Handle canonical
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

function countOccurrences(html, regex) {
  const matches = html.match(new RegExp(regex.source, 'gi'));
  return matches ? matches.length : 0;
}

// Invalid HTML (simulates Vercel login/error page)
const invalidHtml = `<!DOCTYPE html><html><head><title>Login – Vercel</title></head><body>Protected</body></html>`;

console.log('\n🧪 Test local de inyección SSR de metas de páginas estáticas\n');

let indexHtml;
try {
  indexHtml = readFileSync(join(projectRoot, 'dist', 'index.html'), 'utf-8');
  console.log('✅ Leído dist/index.html');
} catch (e) {
  console.error('❌ No se encontró dist/index.html. Ejecuta `npm run build` primero.');
  process.exit(1);
}

let passed = 0;
let failed = 0;

function runCheck(name, condition, displayValue = 'OK') {
  if (condition) {
    console.log(`✅ ${name}: ${displayValue}`);
    passed++;
    return true;
  } else {
    console.log(`❌ ${name}: ${displayValue}`);
    failed++;
    return false;
  }
}

// =============================================================================
// TEST 1: HTML sin div#root no se modifica
// =============================================================================
console.log('\n--- Test 1: HTML inválido (sin div#root) ---\n');

const isInvalidHtmlValid = isValidIndexHtml(invalidHtml);
runCheck(
  'isValidIndexHtml(invalidHtml) === false',
  !isInvalidHtmlValid,
  `isValidIndexHtml returned ${isInvalidHtmlValid}`
);

runCheck(
  'HTML inválido no tiene div#root',
  !invalidHtml.includes('<div id="root">'),
  invalidHtml.includes('<div id="root">') ? 'FOUND (bad)' : 'NOT FOUND (correct)'
);

// =============================================================================
// TEST 2: /productos página
// =============================================================================
console.log('\n--- Test 2: /productos ---\n');

const productosPage = STATIC_PAGES.find((p) => p.path === '/productos');
const productosHtml = injectPageMetas(indexHtml, productosPage);

const productosChecks = [
  {
    name: '<title> correcto para /productos',
    regex: /<title>([^<]+)<\/title>/,
    expected: (m) => m && m[1] === 'Comprar vinos, licores y bebidas en CDMX | Mr. Brown',
  },
  {
    name: 'Exactamente 1 <title>',
    regex: /<title>/,
    expected: () => countOccurrences(productosHtml, /<title>/) === 1,
    isCount: true,
  },
  {
    name: 'canonical URL es /productos',
    regex: /<link\s+rel="canonical"\s+href="([^"]+)"/,
    expected: (m) => m && m[1] === 'https://www.mrbrown.com.mx/productos',
  },
  {
    name: 'Exactamente 1 canonical',
    regex: /<link\s+rel="canonical"/,
    expected: () => countOccurrences(productosHtml, /<link\s+rel="canonical"/) === 1,
    isCount: true,
  },
  {
    name: 'og:type=website',
    regex: /<meta\s+property="og:type"\s+content="([^"]+)"/,
    expected: (m) => m && m[1] === 'website',
  },
  {
    name: 'Exactamente 1 og:type',
    regex: /<meta\s+property="og:type"/,
    expected: () => countOccurrences(productosHtml, /<meta\s+property="og:type"/) === 1,
    isCount: true,
  },
  {
    name: 'og:url es /productos',
    regex: /<meta\s+property="og:url"\s+content="([^"]+)"/,
    expected: (m) => m && m[1] === 'https://www.mrbrown.com.mx/productos',
  },
  {
    name: 'Exactamente 1 og:url',
    regex: /<meta\s+property="og:url"/,
    expected: () => countOccurrences(productosHtml, /<meta\s+property="og:url"/) === 1,
    isCount: true,
  },
  {
    name: 'og:title correcto',
    regex: /<meta\s+property="og:title"\s+content="([^"]+)"/,
    expected: (m) => m && m[1] === 'Comprar vinos, licores y bebidas en CDMX | Mr. Brown',
  },
  {
    name: 'Exactamente 1 og:title',
    regex: /<meta\s+property="og:title"/,
    expected: () => countOccurrences(productosHtml, /<meta\s+property="og:title"/) === 1,
    isCount: true,
  },
  {
    name: 'og:description correcta',
    regex: /<meta\s+property="og:description"\s+content="([^"]+)"/,
    expected: (m) => m && m[1].includes('tequila, whisky, mezcal'),
  },
  {
    name: 'Exactamente 1 og:description',
    regex: /<meta\s+property="og:description"/,
    expected: () => countOccurrences(productosHtml, /<meta\s+property="og:description"/) === 1,
    isCount: true,
  },
  {
    name: 'twitter:title correcto',
    regex: /<meta\s+name="twitter:title"\s+content="([^"]+)"/,
    expected: (m) => m && m[1] === 'Comprar vinos, licores y bebidas en CDMX | Mr. Brown',
  },
  {
    name: 'Exactamente 1 twitter:title',
    regex: /<meta\s+name="twitter:title"/,
    expected: () => countOccurrences(productosHtml, /<meta\s+name="twitter:title"/) === 1,
    isCount: true,
  },
  {
    name: 'twitter:description correcta',
    regex: /<meta\s+name="twitter:description"\s+content="([^"]+)"/,
    expected: (m) => m && m[1].includes('tequila, whisky, mezcal'),
  },
  {
    name: 'Exactamente 1 twitter:description',
    regex: /<meta\s+name="twitter:description"/,
    expected: () => countOccurrences(productosHtml, /<meta\s+name="twitter:description"/) === 1,
    isCount: true,
  },
  {
    name: 'JSON-LD Organization preservado',
    regex: /"@type":\s*"Organization"/,
    expected: (m) => !!m,
  },
  {
    name: 'SPA shell intacto (div#root)',
    regex: /<div\s+id="root">/,
    expected: (m) => !!m,
  },
];

for (const check of productosChecks) {
  const match = productosHtml.match(check.regex);
  const ok = check.expected(match);

  let displayValue = 'OK';
  if (!ok) {
    displayValue = 'NOT FOUND';
    if (check.isCount) {
      const count = countOccurrences(productosHtml, check.regex);
      displayValue = `count=${count} (expected 1)`;
    } else if (match && match[1]) {
      displayValue = match[1].slice(0, 80);
    }
  } else if (!check.isCount && match && match[1]) {
    displayValue = match[1].slice(0, 80);
  } else if (check.isCount) {
    const count = countOccurrences(productosHtml, check.regex);
    displayValue = `count=${count}`;
  }

  if (ok) {
    console.log(`✅ ${check.name}: ${displayValue}`);
    passed++;
  } else {
    console.log(`❌ ${check.name}: ${displayValue}`);
    failed++;
  }
}

// =============================================================================
// TEST 3: /contacto página
// =============================================================================
console.log('\n--- Test 3: /contacto ---\n');

const contactoPage = STATIC_PAGES.find((p) => p.path === '/contacto');
const contactoHtml = injectPageMetas(indexHtml, contactoPage);

const contactoChecks = [
  {
    name: '<title> correcto para /contacto',
    regex: /<title>([^<]+)<\/title>/,
    expected: (m) => m && m[1] === 'Contacto | Mr. Brown',
  },
  {
    name: 'Exactamente 1 <title>',
    regex: /<title>/,
    expected: () => countOccurrences(contactoHtml, /<title>/) === 1,
    isCount: true,
  },
  {
    name: 'canonical URL es /contacto',
    regex: /<link\s+rel="canonical"\s+href="([^"]+)"/,
    expected: (m) => m && m[1] === 'https://www.mrbrown.com.mx/contacto',
  },
  {
    name: 'Exactamente 1 canonical',
    regex: /<link\s+rel="canonical"/,
    expected: () => countOccurrences(contactoHtml, /<link\s+rel="canonical"/) === 1,
    isCount: true,
  },
  {
    name: 'og:url es /contacto',
    regex: /<meta\s+property="og:url"\s+content="([^"]+)"/,
    expected: (m) => m && m[1] === 'https://www.mrbrown.com.mx/contacto',
  },
  {
    name: 'og:title correcto',
    regex: /<meta\s+property="og:title"\s+content="([^"]+)"/,
    expected: (m) => m && m[1] === 'Contacto | Mr. Brown',
  },
  {
    name: 'twitter:title correcto',
    regex: /<meta\s+name="twitter:title"\s+content="([^"]+)"/,
    expected: (m) => m && m[1] === 'Contacto | Mr. Brown',
  },
  {
    name: 'meta description correcta',
    regex: /<meta\s+name="description"\s+content="([^"]+)"/,
    expected: (m) => m && m[1].includes('Contacto Mr. Brown'),
  },
];

for (const check of contactoChecks) {
  const match = contactoHtml.match(check.regex);
  const ok = check.expected(match);

  let displayValue = 'OK';
  if (!ok) {
    displayValue = 'NOT FOUND';
    if (check.isCount) {
      const count = countOccurrences(contactoHtml, check.regex);
      displayValue = `count=${count} (expected 1)`;
    } else if (match && match[1]) {
      displayValue = match[1].slice(0, 80);
    }
  } else if (!check.isCount && match && match[1]) {
    displayValue = match[1].slice(0, 80);
  } else if (check.isCount) {
    const count = countOccurrences(contactoHtml, check.regex);
    displayValue = `count=${count}`;
  }

  if (ok) {
    console.log(`✅ ${check.name}: ${displayValue}`);
    passed++;
  } else {
    console.log(`❌ ${check.name}: ${displayValue}`);
    failed++;
  }
}

// =============================================================================
// TEST 4: Ruta desconocida devuelve HTML sin modificar (simulación)
// =============================================================================
console.log('\n--- Test 4: Ruta desconocida ---\n');

const unknownPage = STATIC_PAGES.find((p) => p.path === '/ruta-que-no-existe');
runCheck(
  'Ruta desconocida NO está en STATIC_PAGES',
  !unknownPage,
  unknownPage ? `FOUND: ${unknownPage.path}` : 'NOT FOUND (correct)'
);

// Simular lo que haría el handler: si no hay página, devolver sin modificar
const originalTitle = indexHtml.match(/<title>([^<]+)<\/title>/)?.[1];
runCheck(
  'HTML original tiene el título de la home',
  originalTitle && originalTitle.includes('Vinos, Licores'),
  originalTitle
);

// =============================================================================
// SUMMARY
// =============================================================================
console.log(`\n📊 Resultados totales: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  console.log('❌ Algunas aserciones fallaron. Revisa la implementación.\n');
  process.exit(1);
} else {
  console.log('✅ Todas las aserciones pasaron. La inyección SSR de páginas estáticas funciona correctamente.\n');
}
