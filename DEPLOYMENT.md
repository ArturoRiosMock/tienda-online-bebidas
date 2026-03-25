# Estructura de Despliegues

## IMPORTANTE — Dos proyectos, un repositorio

Este repositorio GitHub contiene **DOS proyectos distintos** en ramas separadas.
**NUNCA mezclar los deploys.**

---

### 1. Mr. Brown → rama `master`

| Campo              | Valor                                                  |
|--------------------|--------------------------------------------------------|
| Descripción        | Tienda online headless de bebidas premium (Mr. Brown)  |
| Rama Git           | `master`                                               |
| Directorio local   | `C:\Users\User\Tienda online de bebidas (1)`           |
| Proyecto Vercel    | `tienda-online-bebidas`                                |
| URL producción     | https://www.mrbrown.com.mx                             |
| Shopify store      | `mrbrownmx.myshopify.com`                              |
| Deploy             | `npx vercel --prod --yes` desde el directorio de arriba|

### 2. Bebify → rama `bebify`

| Campo              | Valor                                                  |
|--------------------|--------------------------------------------------------|
| Descripción        | Plataforma B2B de bebidas (Bebify)                     |
| Rama Git           | `bebify`                                               |
| Directorio local   | `C:\Users\User\Tienda-bebify` (git worktree)           |
| Proyecto Vercel    | `bebify-store`                                         |
| URL producción     | https://bebify-store.vercel.app                        |
| Deploy             | `npx vercel --prod --yes` desde el directorio de arriba|

---

## Reglas críticas

1. **NUNCA** hacer deploy de `master` al proyecto `bebify-store`
2. **NUNCA** hacer deploy de `bebify` al proyecto `tienda-online-bebidas`
3. Antes de hacer `npx vercel --prod`, verificar con `npx vercel ls` que estás en el proyecto correcto
4. El archivo `.vercel/project.json` en cada directorio define a qué proyecto Vercel está vinculado

## Notas técnicas — Mr. Brown (Headless)

- El dominio `mrbrown.com.mx` apunta a **Vercel**, NO a Shopify
- El checkout de Shopify SIEMPRE debe redirigir a `mrbrownmx.myshopify.com` (no al dominio custom)
- WhatsApp: `+52 1 55 1501 2488`
