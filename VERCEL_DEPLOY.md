# Desplegar en Vercel

## Subir el código a GitHub (para deploy automático en cada push)

1. Crea un repositorio nuevo en [GitHub](https://github.com/new) (vacío, sin README).
2. En la raíz del proyecto ejecuta:

```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git branch -M main
git push -u origin main
```

Sustituye `TU_USUARIO` y `TU_REPO` por tu usuario de GitHub y el nombre del repo.

## Conectar con Vercel

1. Entra en [vercel.com](https://vercel.com) e inicia sesión.
2. **Add New Project** → **Import Git Repository** → elige este repo.
3. Deja **Build Command**: `npm run build` y **Output Directory**: `dist`.
4. No añadas variables de entorno todavía (la app usa datos mock).
5. **Deploy**. Vercel te dará una URL (ej. `tu-proyecto.vercel.app`).

Cada `git push` a la rama principal generará un nuevo despliegue.

## Conectar Shopify más adelante

En Vercel: **Settings** → **Environment Variables** → añade:

- `VITE_SHOPIFY_STORE_DOMAIN` = `tu-tienda.myshopify.com`
- `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN` = tu token de Storefront API

Luego redepleya el proyecto para que el build use las nuevas variables.
