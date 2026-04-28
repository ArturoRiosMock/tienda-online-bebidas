# Estructura de Despliegues

## IMPORTANTE — Dos proyectos, un repositorio

Este repositorio GitHub (`ArturoRiosMock/tienda-online-bebidas`) contiene **DOS proyectos distintos** en ramas separadas. **NUNCA mezclar los deploys.**

Para evitar confusiones se usa **`git worktree`**: una carpeta por rama, cada una con su propio `.vercel/project.json` apuntando a su proyecto Vercel correcto. Así `npx vercel --prod` siempre deploya al lugar correcto.

---

### 1. Mr. Brown → rama `master`

| Campo            | Valor                                                  |
|------------------|--------------------------------------------------------|
| Descripción      | Tienda online headless de bebidas premium (Mr. Brown)  |
| Rama Git         | `master`                                               |
| Directorio local | `~/Trabajo/mrbrown`                                    |
| Proyecto Vercel  | `tienda-online-bebidas`                                |
| URL producción   | https://www.mrbrown.com.mx                             |
| Shopify store    | `mrbrownmx.myshopify.com`                              |

### 2. Bebify → rama `bebify`

| Campo            | Valor                                                                |
|------------------|----------------------------------------------------------------------|
| Descripción      | Plataforma B2B de bebidas (Bebify)                                   |
| Rama Git         | `bebify`                                                             |
| Directorio local | `~/Trabajo/bebify-store` (git worktree de `~/Trabajo/mrbrown`)       |
| Proyecto Vercel  | `bebify-store`                                                       |
| URL producción   | https://bebify-store-chrsitans-projects-7d675a91.vercel.app          |

Vercel scope: `chrsitans-projects-7d675a91`.

---

## Setup inicial (solo una vez por máquina)

```bash
# 1. Clonar como Mr. Brown
git clone https://github.com/ArturoRiosMock/tienda-online-bebidas.git ~/Trabajo/mrbrown
cd ~/Trabajo/mrbrown
npm install
npx vercel link --yes --project tienda-online-bebidas --scope chrsitans-projects-7d675a91
npx vercel env pull .env --environment=production --yes

# 2. Crear worktree de Bebify
git worktree add ../bebify-store bebify
cd ../bebify-store
npm install
npx vercel link --yes --project bebify-store --scope chrsitans-projects-7d675a91
npx vercel env pull .env --environment=production --yes
```

A partir de ahí cada carpeta queda independiente y se abre en su propia ventana de Cursor.

## Reglas críticas

1. **NUNCA** hacer deploy de `master` al proyecto `bebify-store`.
2. **NUNCA** hacer deploy de `bebify` al proyecto `tienda-online-bebidas`.
3. Una ventana de Cursor = una carpeta = una rama. **Nunca** cambiar de rama dentro de una misma carpeta.
4. Si querés llevar un cambio de una rama a la otra, usar `git cherry-pick` o `git merge` — no `git checkout` en la misma carpeta.

## Verificación previa al deploy (correr SIEMPRE antes de `vercel --prod`)

```bash
git branch --show-current && cat .vercel/project.json | grep projectName
```

Esperado por carpeta:

| Carpeta                    | Salida esperada                                     |
|----------------------------|-----------------------------------------------------|
| `~/Trabajo/mrbrown`        | `master` + `"projectName":"tienda-online-bebidas"`  |
| `~/Trabajo/bebify-store`   | `bebify` + `"projectName":"bebify-store"`           |

Si matchea, podés correr:

```bash
npx vercel --prod --yes
```

## Workflow diario

```bash
# Terminal/Cursor 1 — Mr. Brown
cd ~/Trabajo/mrbrown
npm run dev               # http://localhost:5173 (o 5174)
git pull origin master
# ...editar...
git add -A && git commit -m "Mr Brown: ..."
git push origin master
npx vercel --prod --yes   # → mrbrown.com.mx

# Terminal/Cursor 2 — Bebify
cd ~/Trabajo/bebify-store
npm run dev               # http://localhost:5173 (o 5174)
git pull origin bebify
# ...editar...
git add -A && git commit -m "Bebify: ..."
git push origin bebify
npx vercel --prod --yes   # → bebify-store.vercel.app
```

## Notas técnicas — Mr. Brown (Headless)

- El dominio `mrbrown.com.mx` apunta a **Vercel**, NO a Shopify.
- El checkout de Shopify SIEMPRE debe redirigir a `mrbrownmx.myshopify.com` (no al dominio custom).
- WhatsApp: `+52 1 55 1501 2488`.
