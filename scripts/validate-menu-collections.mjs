/**
 * Verifica que todos los handles del menú de navegación existan como
 * colecciones en Shopify (o estén declarados como virtuales/tag en collectionRoutes).
 *
 * Uso:
 *   VITE_SHOPIFY_STORE_DOMAIN=xxx.myshopify.com \
 *   VITE_SHOPIFY_STOREFRONT_TOKEN=xxx \
 *   node scripts/validate-menu-collections.mjs
 */

import 'dotenv/config';

const STORE_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

if (!STORE_DOMAIN || !TOKEN) {
  console.error('❌ Faltan variables de entorno: VITE_SHOPIFY_STORE_DOMAIN y VITE_SHOPIFY_STOREFRONT_TOKEN');
  process.exit(1);
}

// Handles especiales que no necesitan colección real en Shopify
const VIRTUAL_HANDLES = new Set(['espumosos']);
const TAG_HANDLES = new Set(['jerez']);
const SKIP_HANDLES = new Set(['Todos', ...VIRTUAL_HANDLES, ...TAG_HANDLES]);

// ── Menú (duplicado mínimo para no requerir compilación TS) ──────────────────
const MENU_ITEMS = [
  { type: 'link', handle: 'Todos' },
  { type: 'accordion', parentHandle: 'destilados', children: [
    { handle: 'tequila' }, { handle: 'whisky' }, { handle: 'ron' }, { handle: 'brandy' },
    { handle: 'vodka' }, { handle: 'cognac' }, { handle: 'mezcal' }, { handle: 'ginebra' },
    { handle: 'jerez' }, { handle: 'aperitivo' }, { handle: 'destilados-sin-alcohol' },
  ]},
  { type: 'accordion', parentHandle: 'vinos', children: [
    { handle: 'vino-tinto' }, { handle: 'vino-blanco-1' }, { handle: 'vino-rosado' },
    { handle: 'espumosos' }, { handle: 'champagne' },
  ]},
  { type: 'accordion', parentHandle: 'cerveza', children: [
    { handle: 'cerveza-artesanal' }, { handle: 'cerveza-importada' }, { handle: 'cerveza-nacional' },
  ]},
  { type: 'accordion', parentHandle: 'refrescos', children: [
    { handle: 'canada-dry' }, { handle: 'coca-cola' }, { handle: 'fresca' },
    { handle: 'sidral-mundet' }, { handle: 'sprite' }, { handle: 'otros-refrescos' },
  ]},
  { type: 'accordion', parentHandle: 'aguas', children: [
    { handle: 'agua-de-sabor' }, { handle: 'agua-mineral' },
    { handle: 'agua-natural' }, { handle: 'agua-tonica' },
  ]},
  { type: 'accordion', parentHandle: 'otros', children: [
    { handle: 'bebida-energeticas' }, { handle: 'jarabes' },
    { handle: 'jugos' }, { handle: 'leche' },
  ]},
];

// Colecciones reales referenciadas por virtuales
const VIRTUAL_SUB_HANDLES = ['vino-blanco-espumoso', 'vino-rosado-espumoso', 'vino-tinto-espumoso'];

function collectHandles() {
  const handles = new Set();
  for (const item of MENU_ITEMS) {
    if (item.type === 'accordion') {
      handles.add(item.parentHandle);
      for (const child of item.children) handles.add(child.handle);
    }
  }
  for (const h of VIRTUAL_SUB_HANDLES) handles.add(h);
  return handles;
}

async function fetchCollection(handle) {
  const query = `
    query CheckCollection($handle: String!) {
      collection(handle: $handle) {
        title
        productsCount { count }
      }
    }
  `;
  const res = await fetch(`https://${STORE_DOMAIN}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query, variables: { handle } }),
  });
  const json = await res.json();
  return json.data?.collection ?? null;
}

async function main() {
  const handles = collectHandles();
  console.log(`\n🔍 Validando ${handles.size} handles del menú contra Shopify...\n`);

  const results = { ok: [], missing: [], empty: [], skipped: [] };

  for (const handle of handles) {
    if (SKIP_HANDLES.has(handle)) {
      results.skipped.push(handle);
      continue;
    }

    const col = await fetchCollection(handle);

    if (!col) {
      results.missing.push(handle);
      console.log(`  ❌ MISSING   ${handle}`);
    } else if (col.productsCount?.count === 0) {
      results.empty.push({ handle, title: col.title });
      console.log(`  ⚠️  EMPTY     ${handle}  («${col.title}» — 0 productos)`);
    } else {
      results.ok.push({ handle, title: col.title, count: col.productsCount?.count });
      console.log(`  ✅ OK        ${handle}  («${col.title}» — ${col.productsCount?.count} productos)`);
    }
  }

  console.log('\n── Resumen ──────────────────────────────────────');
  console.log(`  ✅ OK:      ${results.ok.length}`);
  console.log(`  ⚠️  Vacíos:  ${results.empty.length}  ${results.empty.map(e => e.handle).join(', ')}`);
  console.log(`  ❌ Missing: ${results.missing.length}  ${results.missing.join(', ')}`);
  console.log(`  ⏭  Saltados: ${results.skipped.length}  (virtual/tag/Todos)\n`);

  if (results.missing.length > 0 || results.empty.length > 0) {
    process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
