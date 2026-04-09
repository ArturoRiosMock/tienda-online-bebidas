/**
 * Configuración de Shopify Storefront API
 * 
 * INSTRUCCIONES PARA CONFIGURAR:
 * 
 * 1. Ve a tu tienda de Shopify Admin
 * 2. Navega a "Aplicaciones" > "Desarrolla aplicaciones"
 * 3. Crea una nueva aplicación personalizada
 * 4. Habilita "Storefront API"
 * 5. Configura los permisos necesarios:
 *    - Read products
 *    - Read product listings
 *    - Read inventory
 *    - Read customers
 *    - Read orders
 *    - Write checkouts
 * 6. Obtén tu "Storefront API access token"
 * 7. Reemplaza los valores PLACEHOLDER abajo con tus credenciales reales
 */

function normalizeShopifyEnv(value: unknown): string {
  if (value === undefined || value === null) return '';
  return String(value)
    .replace(/\\r\\n/g, '')
    .replace(/\r\n/g, '')
    .replace(/\r/g, '')
    .replace(/\n/g, '')
    .trim();
}

const storefrontApiVersion =
  normalizeShopifyEnv(import.meta.env.VITE_SHOPIFY_STOREFRONT_API_VERSION) || '2025-10';

export const shopifyConfig = {
  // Tu dominio de Shopify (ej: "tu-tienda.myshopify.com")
  storeDomain:
    normalizeShopifyEnv(import.meta.env.VITE_SHOPIFY_STORE_DOMAIN) || 'YOUR_STORE.myshopify.com',

  // Tu Storefront API Access Token
  storefrontAccessToken:
    normalizeShopifyEnv(import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN) ||
    'YOUR_STOREFRONT_ACCESS_TOKEN',

  // Versión de la API Storefront (2024-x suele quedar obsoleto; alinear con Hydrogen ~2025.10)
  apiVersion: storefrontApiVersion,
  
  // Idioma por defecto
  language: 'ES',
  
  // País por defecto
  country: 'MX',
  
  // Moneda
  currency: 'MXN'
};

// URL completa de la API de Shopify Storefront
export const getStorefrontApiUrl = () => {
  return `https://${shopifyConfig.storeDomain}/api/${shopifyConfig.apiVersion}/graphql.json`;
};

// Función para validar la configuración
export const isShopifyConfigured = (): boolean => {
  return (
    shopifyConfig.storeDomain !== '' &&
    shopifyConfig.storeDomain !== 'YOUR_STORE.myshopify.com' &&
    shopifyConfig.storefrontAccessToken !== '' &&
    shopifyConfig.storefrontAccessToken !== 'YOUR_STOREFRONT_ACCESS_TOKEN'
  );
};
