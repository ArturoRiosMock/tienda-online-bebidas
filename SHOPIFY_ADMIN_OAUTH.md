# Access Token de Shopify Admin API (para Odoo)

Este documento describe cómo obtener un **Access Token** de la **Admin API** de Shopify mediante OAuth (client credentials). Ese token se usa en integraciones de backend como **Odoo**, no en el frontend de la tienda.

- **Storefront API** (este proyecto): productos, carrito, checkout en la web → token en `.env` como `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN`.
- **Admin API** (Odoo, ERP): órdenes, inventario, productos desde el back office → token que se obtiene con los pasos siguientes.

---

## Requisitos

1. Una app personalizada creada en tu tienda Shopify (Admin).
2. **Client ID** y **Client Secret** de esa app (Paso 1).

---

## Paso 1: Obtener Client ID y Client Secret

1. Entra en **Shopify Admin**: `https://mrbrown.myshopify.com/admin` (sustituye `mrbrown` por el nombre de tu tienda si es distinto).
2. Ve a **Configuración** → **Aplicaciones y canales de venta** → **Desarrollar aplicaciones**.
3. Crea una aplicación o abre una existente (ej: "Mr. Brown Headless Store" o una app dedicada para Odoo).
4. En la pestaña **Credenciales de API**:
   - Copia el **Client ID**.
   - Copia el **Client Secret** (puede ser necesario pulsar "Reveal" o "Ver").

No compartas el Client Secret ni lo subas al repositorio. Usa variables de entorno o un archivo `.env` que esté en `.gitignore`.

---

## Paso 2: Generar el Access Token

El token **no** se muestra en la interfaz. Hay que solicitarlo con una petición POST.

### Endpoint

```
POST https://{TU-TIENDA}.myshopify.com/admin/oauth/access_token
```

Sustituye `{TU-TIENDA}` por el subdominio de tu tienda (ej: `mrbrown`).

### Cuerpo (Body)

Tipo: **application/x-www-form-urlencoded**

| Parámetro       | Valor                |
|-----------------|----------------------|
| `client_id`     | Tu Client ID         |
| `client_secret` | Tu Client Secret     |
| `grant_type`    | `client_credentials` |

### cURL (Bash / Git Bash)

```bash
curl -X POST "https://mrbrown.myshopify.com/admin/oauth/access_token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=TU_CLIENT_ID" \
  -d "client_secret=TU_CLIENT_SECRET" \
  -d "grant_type=client_credentials"
```

Sustituye `TU_CLIENT_ID`, `TU_CLIENT_SECRET` y `mrbrown` por tus valores.

### cURL (PowerShell)

```powershell
$body = @{
  client_id     = "TU_CLIENT_ID"
  client_secret = "TU_CLIENT_SECRET"
  grant_type    = "client_credentials"
}
Invoke-RestMethod -Uri "https://mrbrown.myshopify.com/admin/oauth/access_token" -Method Post -Body $body -ContentType "application/x-www-form-urlencoded"
```

### Script del proyecto

En la raíz del proyecto hay un script que lee las credenciales de variables de entorno (no las escribas en la terminal en claro):

**Linux / macOS / Git Bash:**

```bash
SHOPIFY_STORE=mrbrown SHOPIFY_CLIENT_ID=xxx SHOPIFY_CLIENT_SECRET=yyy npm run shopify:admin-token
```

**PowerShell:**

```powershell
$env:SHOPIFY_STORE="mrbrown"; $env:SHOPIFY_CLIENT_ID="xxx"; $env:SHOPIFY_CLIENT_SECRET="yyy"; npm run shopify:admin-token
```

O define las variables en un `.env` (no subas este archivo) y cárgalas antes de ejecutar, según tu entorno. El script imprime el `access_token` en consola para copiarlo en Odoo.

---

## Paso 3: Respuesta y uso en Odoo

Shopify responde con un JSON similar a:

```json
{
  "access_token": "shpat_xxxxxxxxxxxxxxxxxxxx",
  "scope": "read_products,write_orders,..."
}
```

- Copia el valor de **`access_token`** (empieza por `shpat_`).
- Pégalo en la configuración de la conexión Shopify de **Odoo** (o del conector que uses, ej: Emipro).

---

## Notas importantes (2026)

- **Seguridad:** No subas el Client Secret ni el access token al repositorio. Usa variables de entorno o secretos en tu entorno de despliegue.
- **Expiración:** En la documentación actual de Shopify, el token obtenido con `client_credentials` puede expirar (p. ej. 24 h). Comprueba si tu conector Odoo/Emipro renueva el token automáticamente o si requiere otro flujo (p. ej. authorization code).
- **Conectores Odoo:** Si usas un conector de terceros (p. ej. Emipro), asegúrate de que esté actualizado para 2026; algunos módulos antiguos siguen pensados para el flujo de "Private Apps" que Shopify ya no ofrece.

---

## Resumen rápido

| Paso | Acción |
|------|--------|
| 1 | Shopify Admin → App → Credenciales de API → Client ID + Client Secret |
| 2 | POST a `https://{tienda}.myshopify.com/admin/oauth/access_token` con `client_id`, `client_secret`, `grant_type=client_credentials` |
| 3 | Copiar `access_token` de la respuesta y configurarlo en Odoo |
