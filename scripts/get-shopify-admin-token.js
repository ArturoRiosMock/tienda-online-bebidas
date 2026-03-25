/**
 * Obtiene un Access Token de la Admin API de Shopify vía OAuth client_credentials.
 * Uso: SHOPIFY_STORE=mrbrown SHOPIFY_CLIENT_ID=xxx SHOPIFY_CLIENT_SECRET=yyy node scripts/get-shopify-admin-token.js
 *
 * Variables de entorno:
 *   SHOPIFY_STORE         - Subdominio de la tienda (ej: mrbrown para mrbrown.myshopify.com)
 *   SHOPIFY_CLIENT_ID     - Client ID de la app en Shopify Admin
 *   SHOPIFY_CLIENT_SECRET - Client Secret de la app
 *
 * Requiere Node 18+ (fetch nativo).
 */

const store = process.env.SHOPIFY_STORE;
const clientId = process.env.SHOPIFY_CLIENT_ID;
const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

if (!store || !clientId || !clientSecret) {
  console.error('Faltan variables de entorno.');
  console.error('Uso: SHOPIFY_STORE=mrbrown SHOPIFY_CLIENT_ID=xxx SHOPIFY_CLIENT_SECRET=yyy node scripts/get-shopify-admin-token.js');
  process.exit(1);
}

const url = `https://${store}.myshopify.com/admin/oauth/access_token`;
const body = new URLSearchParams({
  client_id: clientId,
  client_secret: clientSecret,
  grant_type: 'client_credentials',
});

async function getAccessToken() {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  const raw = await response.text();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    console.error('La respuesta no es JSON. Status:', response.status);
    console.error('URL usada:', url);
    console.error('Primeros 300 caracteres:', raw.slice(0, 300));
    process.exit(1);
  }

  if (!response.ok) {
    console.error('Error al obtener el token:', response.status, data);
    process.exit(1);
  }

  if (data.access_token) {
    console.log('Access Token (copiar para Odoo):');
    console.log(data.access_token);
    if (data.scope) console.log('Scope:', data.scope);
  } else {
    console.error('La respuesta no incluye access_token:', data);
    process.exit(1);
  }
}

getAccessToken().catch((err) => {
  console.error(err);
  process.exit(1);
});
