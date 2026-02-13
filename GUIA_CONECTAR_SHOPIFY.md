# Guía: Conectar tu tienda con Shopify y usar sus datos

Esta guía te lleva paso a paso para conectar el frontend (Vercel) con tu tienda Shopify y mostrar productos, precios e imágenes desde Shopify.

---

## 1. Requisitos

- Cuenta de Shopify (plan que permita ventas).
- Acceso al **Admin** de tu tienda.
- Productos y, si quieres filtrar por categoría, **colecciones** creadas.

---

## 2. Crear la app en Shopify y obtener credenciales

### 2.1 Crear la aplicación

1. Entra en tu **Shopify Admin**: `https://tu-tienda.myshopify.com/admin`
2. Ve a **Configuración** (Settings) → **Aplicaciones y canales de venta**.
3. Pulsa **Desarrollar aplicaciones** → **Crear una aplicación** → **Crear aplicación personalizada**.
4. Ponle nombre (ej: "Tienda Headless" o "Frontend Vercel") y crea la app.

### 2.2 Permisos de la Storefront API

1. En la app recién creada, abre la pestaña **Configuración**.
2. En **Storefront API**, pulsa **Configurar**.
3. Activa estos permisos (scopes):
   - `unauthenticated_read_product_listings` – leer listados de productos
   - `unauthenticated_read_product_inventory` – leer inventario
   - `unauthenticated_read_product_tags` – leer etiquetas
   - `unauthenticated_write_checkouts` – crear checkouts (carrito y pago)
   - `unauthenticated_read_checkouts` – leer checkouts
   - (Opcional) `unauthenticated_write_customers` – si más adelante quieres crear clientes
4. Guarda los cambios.

### 2.3 Instalar la app y copiar el token

1. Ve a la pestaña **Credenciales de API** (API credentials).
2. En **Storefront API access token**, pulsa **Instalar aplicación** (Install app) y confirma.
3. Copia el **Storefront API access token** (empieza por `shpat_...`) y guárdalo en un lugar seguro.
4. Anota también el **dominio de tu tienda**, por ejemplo: `mi-tienda.myshopify.com` (sin `https://`).

---

## 3. Configurar variables de entorno

Las variables se leen en build. Sin ellas, la app usa datos de prueba (mock).

### 3.1 En local (desarrollo)

En la raíz del proyecto crea o edita el archivo `.env`:

```env
VITE_SHOPIFY_STORE_DOMAIN=mi-tienda.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

- Sustituye `mi-tienda` por el subdominio real de tu tienda.
- Sustituye el valor del token por el que copiaste en el paso 2.3.

Reinicia el servidor de desarrollo (`npm run dev`) después de cambiar `.env`.

### 3.2 En Vercel (producción)

1. Entra en [vercel.com](https://vercel.com) → tu proyecto **tienda-online-bebidas**.
2. **Settings** → **Environment Variables**.
3. Añade:

   | Nombre                           | Valor                    | Entorno   |
   |----------------------------------|--------------------------|-----------|
   | `VITE_SHOPIFY_STORE_DOMAIN`      | `mi-tienda.myshopify.com`| Production (y Preview si quieres) |
   | `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | `shpat_...` (tu token) | Production (y Preview si quieres) |

4. Guarda.
5. Ve a **Deployments** → en el último deployment pulsa los tres puntos → **Redeploy** para que el próximo build use las variables.

---

## 4. Colecciones en Shopify (categorías en la tienda)

Para que el filtro por categoría en la web coincida con Shopify, las colecciones deben usar estos **handles** (identificadores en la URL):

| Categoría en la web | Handle en Shopify |
|---------------------|-------------------|
| Whisky              | `whisky`          |
| Vino                | `vino`            |
| Espumante           | `espumante`       |
| Licor               | `licor`           |
| Gin                 | `gin`             |
| Vodka               | `vodka`           |
| Champagne           | `champagne`       |
| Miniatura           | `miniatura`       |
| Agua                | `agua`            |
| Refrescos           | `refrescos`       |
| Jugos               | `jugos`           |
| Café                | `cafe`            |
| Té                  | `te`              |

Cómo crear o ajustar una colección:

1. En Shopify Admin: **Productos** → **Colecciones** → **Crear colección** (o editar una existente).
2. En **URL y SEO** (o en la URL de la colección), el handle es la parte final; debe ser exactamente el de la tabla (ej: `whisky`, `vino`).
3. Asigna los productos que correspondan a cada colección.

Si usas otros nombres de categoría en la web, hay que mapearlos en el código en [`src/shopify/products.ts`](src/shopify/products.ts) en `CATEGORY_TO_COLLECTION_MAP`.

---

## 5. Qué datos se traen de Shopify

Con las variables configuradas y el código actual:

- **Productos:** nombre, descripción, precio, precio comparado (tachado), imagen principal, tipo de producto (categoría), variante por defecto.
- **Listado:** todos los productos o los de una colección (según el filtro de categoría).
- **Búsqueda:** si en el futuro conectas el campo de búsqueda al hook `useShopifySearch`, los resultados pueden venir de Shopify.

El **checkout** (pago y datos de envío) siempre ocurre en Shopify: el botón “Finalizar compra” puede llevar a la URL de checkout de Shopify cuando integres el carrito con la Storefront API (ver más abajo).

---

## 6. Comprobar que está conectado

- **En local:** con `.env` configurado y `npm run dev`, al abrir la tienda deberías ver los productos de tu tienda, no los 12 de prueba.
- **En Vercel:** después de redeploy con las variables, la URL de producción debe mostrar los mismos productos que en Shopify.

Si sigues viendo productos mock, revisa:

- Que no haya espacios o comillas de más en el dominio o el token en `.env` / Vercel.
- Que la app en Shopify tenga los permisos de Storefront API indicados y esté instalada.
- Consola del navegador (F12) por errores de red o de GraphQL.

---

## 7. Carrito y checkout con Shopify (opcional, siguiente paso)

Hoy el carrito de la interfaz es local (estado en React). Para que “Agregar al carrito” y “Finalizar compra” usen el carrito y checkout de Shopify:

- Hay que usar en la UI el hook [`useShopifyCart`](src/shopify/hooks/useShopifyCart.ts): `addItem(variantId, cantidad)`, y mostrar el contenido del carrito de Shopify y su `checkoutUrl`.
- Los productos que vienen de Shopify ya incluyen `variantId`; ese es el que debes pasar a `addItem`.

Puedes dejar el carrito local para pruebas y más adelante sustituirlo o combinarlo con `useShopifyCart` para que todo el flujo sea en Shopify.

---

## 8. Resumen rápido

| Paso | Dónde | Acción |
|------|--------|--------|
| 1 | Shopify Admin | Crear app → Storefront API → permisos → Instalar app → copiar token y dominio |
| 2 | Local | Crear `.env` con `VITE_SHOPIFY_STORE_DOMAIN` y `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN` |
| 3 | Vercel | Settings → Environment Variables → mismas variables → Redeploy |
| 4 | Shopify | Crear/editar colecciones con los handles de la tabla (whisky, vino, etc.) |
| 5 | Web | Ver productos reales en local y en la URL de Vercel |

Con esto la tienda queda conectada a Shopify y trayendo todos los datos de productos desde tu tienda.

---

## 9. Qué hace ya el código

- **Listado de productos:** [`App.tsx`](src/app/App.tsx) usa el hook `useShopifyProducts`. Si las variables de entorno están configuradas, los productos del grid y el filtro por categoría salen de tu tienda Shopify. Si no, se muestran datos de prueba.
- **Imágenes y precios:** Se usan la imagen principal y el precio (y precio comparado si existe) que devuelve la Storefront API.
- **Categorías:** El filtro por categoría (Whisky, Vino, etc.) usa las colecciones de Shopify según el mapa en [`src/shopify/products.ts`](src/shopify/products.ts) (`CATEGORY_TO_COLLECTION_MAP`).
