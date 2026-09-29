#!/usr/bin/env node
/**
 * Script de test para verificar que la función Edge de SSR inyecta
 * correctamente las metas de producto en el HTML.
 *
 * Uso (con el servidor de desarrollo corriendo en vercel dev):
 *   node scripts/test-producto-ssr.mjs [handle]
 *
 * Uso con Vercel Preview:
 *   PREVIEW_URL=https://xxxx.vercel.app node scripts/test-producto-ssr.mjs [handle]
 *
 * Ejemplo:
 *   node scripts/test-producto-ssr.mjs tequila-don-julio-70-anejo-700-ml
 */

const handle = process.argv[2] || 'tequila-don-julio-70-anejo-700-ml';
const baseUrl = process.env.PREVIEW_URL || 'http://localhost:3000';
const url = `${baseUrl}/producto/${handle}`;

console.log(`\n🔍 Testing SSR for: ${url}\n`);

function countOccurrences(html, regex) {
  const matches = html.match(new RegExp(regex.source, 'gi'));
  return matches ? matches.length : 0;
}

async function test() {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      },
    });

    console.log(`Status: ${response.status}`);
    console.log(`Content-Type: ${response.headers.get('content-type')}`);
    console.log(`Cache-Control: ${response.headers.get('cache-control')}\n`);

    const html = await response.text();

    const checks = [
      {
        name: '<title> del producto',
        regex: /<title>([^<]+)<\/title>/,
        expected: (m) => m && !m[1].includes('Vinos, Licores y más'),
      },
      {
        name: 'Exactamente 1 <title>',
        regex: /<title>/,
        expected: () => countOccurrences(html, /<title>/) === 1,
        isCount: true,
      },
      {
        name: 'canonical URL',
        regex: /<link\s+rel="canonical"\s+href="([^"]+)"/,
        expected: (m) => m && m[1].includes(`/producto/${handle}`),
      },
      {
        name: 'Exactamente 1 canonical',
        regex: /<link\s+rel="canonical"/,
        expected: () => countOccurrences(html, /<link\s+rel="canonical"/) === 1,
        isCount: true,
      },
      {
        name: 'og:type=product',
        regex: /<meta\s+property="og:type"\s+content="([^"]+)"/,
        expected: (m) => m && m[1] === 'product',
      },
      {
        name: 'og:url del producto',
        regex: /<meta\s+property="og:url"\s+content="([^"]+)"/,
        expected: (m) => m && m[1].includes(`/producto/${handle}`),
      },
      {
        name: 'Exactamente 1 og:url',
        regex: /<meta\s+property="og:url"/,
        expected: () => countOccurrences(html, /<meta\s+property="og:url"/) === 1,
        isCount: true,
      },
      {
        name: 'og:image definido',
        regex: /<meta\s+property="og:image"\s+content="([^"]+)"/,
        expected: (m) => m && m[1].length > 0,
      },
      {
        name: 'product:price:amount',
        regex: /<meta\s+property="product:price:amount"\s+content="([^"]+)"/,
        expected: (m) => m && parseFloat(m[1]) > 0,
      },
      {
        name: 'product:price:currency=MXN',
        regex: /<meta\s+property="product:price:currency"\s+content="([^"]+)"/,
        expected: (m) => m && m[1] === 'MXN',
      },
      {
        name: 'product:availability',
        regex: /<meta\s+property="product:availability"\s+content="([^"]+)"/,
        expected: (m) => m && (m[1] === 'in stock' || m[1] === 'out of stock'),
      },
      {
        name: 'JSON-LD Product (data-ssr-product)',
        regex: /<script\s+type="application\/ld\+json"\s+data-ssr-product="true">([^<]+)<\/script>/,
        expected: (m) => {
          if (!m) return false;
          try {
            const json = JSON.parse(m[1]);
            return json['@type'] === 'Product' && json.offers?.price;
          } catch {
            return false;
          }
        },
      },
      {
        name: 'Exactamente 1 JSON-LD Product',
        regex: /data-ssr-product="true"/,
        expected: () => countOccurrences(html, /data-ssr-product="true"/) === 1,
        isCount: true,
      },
      {
        name: 'JSON-LD Organization preservado',
        regex: /<script\s+type="application\/ld\+json">\s*\{[^}]*"@type":\s*"Organization"/,
        expected: (m) => !!m,
      },
      {
        name: 'No hay JSON-LD Organization duplicado',
        regex: /"@type":\s*"Organization"/,
        expected: () => countOccurrences(html, /"@type":\s*"Organization"/) === 1,
        isCount: true,
      },
      {
        name: 'twitter:title',
        regex: /<meta\s+name="twitter:title"\s+content="([^"]+)"/,
        expected: (m) => m && !m[1].includes('Vinos, Licores y más'),
      },
      {
        name: 'SPA shell intact (div#root)',
        regex: /<div\s+id="root">/,
        expected: (m) => !!m,
      },
      {
        name: 'Vite script intact',
        regex: /<script\s+type="module"\s+src="[^"]*main/,
        expected: (m) => !!m,
      },
    ];

    let passed = 0;
    let failed = 0;

    for (const check of checks) {
      const match = html.match(check.regex);
      const ok = check.expected(match);

      if (ok) {
        let displayValue = 'OK';
        if (!check.isCount && match && match[1]) {
          displayValue = match[1].slice(0, 60);
        } else if (check.isCount) {
          const count = countOccurrences(html, check.regex);
          displayValue = `count=${count}`;
        }
        console.log(`✅ ${check.name}: ${displayValue}`);
        passed++;
      } else {
        let displayValue = 'NOT FOUND';
        if (check.isCount) {
          const count = countOccurrences(html, check.regex);
          displayValue = `count=${count} (expected 1)`;
        } else if (match && match[1]) {
          displayValue = match[1].slice(0, 60);
        }
        console.log(`❌ ${check.name}: ${displayValue}`);
        failed++;
      }
    }

    console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Tip: Make sure vercel dev is running (or set PREVIEW_URL for deployed preview)\n');
    process.exit(1);
  }
}

test();
