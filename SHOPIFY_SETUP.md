# Configuración de Shopify Headless

Este proyecto está preparado para funcionar como un Shopify Headless, conectándose a tu tienda Shopify a través de la Storefront API.

## 📋 Requisitos Previos

1. Una tienda de Shopify (plan básico o superior)
2. Acceso al Admin de Shopify
3. Productos y colecciones configurados en tu tienda

## 🔧 Configuración Paso a Paso

### 1. Crear una App Personalizada en Shopify

1. Ve a tu **Shopify Admin**
2. Navega a **Configuración** > **Aplicaciones y canales de venta**
3. Haz clic en **Desarrollar aplicaciones**
4. Clic en **Crear una aplicación**
5. Dale un nombre (ej: "Mr. Brown Headless Store")

### 2. Configurar Permisos de Storefront API

1. En tu aplicación, ve a la pestaña **Configuración**
2. En la sección **Storefront API**, haz clic en **Configurar**
3. Habilita los siguientes permisos:
   - ✅ `unauthenticated_read_product_listings` - Leer listados de productos
   - ✅ `unauthenticated_read_product_inventory` - Leer inventario
   - ✅ `unauthenticated_read_product_tags` - Leer etiquetas de productos
   - ✅ `unauthenticated_write_checkouts` - Crear checkouts
   - ✅ `unauthenticated_read_checkouts` - Leer checkouts
   - ✅ `unauthenticated_write_customers` - Crear clientes (opcional)

4. Guarda los cambios

### 3. Obtener Credenciales

1. Ve a la pestaña **Credenciales de API**
2. En **Storefront API access token**, haz clic en **Instalar aplicación**
3. Copia el **Storefront API access token** generado
4. Guarda también el **nombre de tu tienda** (ej: `mi-tienda.myshopify.com`)

### 4. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Shopify Configuration
VITE_SHOPIFY_STORE_DOMAIN=tu-tienda.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=tu_token_aqui
```

**⚠️ IMPORTANTE:** 
- Reemplaza `tu-tienda` con el nombre real de tu tienda
- Reemplaza `tu_token_aqui` con el token que copiaste
- No compartas estas credenciales públicamente
- Agrega `.env` a tu `.gitignore`

### 5. Configurar Colecciones en Shopify

Para que las categorías funcionen correctamente, crea colecciones en Shopify con estos handles:

| Categoría en la App | Handle en Shopify |
|---------------------|-------------------|
| Whisky              | `whisky`          |
| Vino                | `vino`            |
| Espumante           | `espumante`       |
| Licor               | `licor`           |
| Gin                 | `gin`             |
| Vodka               | `vodka`           |
| Champagne           | `champagne`       |
| Miniatura           | `miniatura`       |

**Cómo crear una colección:**
1. En Shopify Admin, ve a **Productos** > **Colecciones**
2. Crea una nueva colección
3. En **Handle**, usa los valores de la tabla (ej: `whisky`, `vino`)
4. Agrega productos a cada colección

## 🛠️ Estructura del Proyecto Shopify

```
/src/shopify/
├── config.ts              # Configuración y credenciales
├── types.ts               # Tipos TypeScript de Shopify
├── queries.ts             # Queries y Mutations GraphQL
├── products.ts            # Servicio de productos
├── cart.ts                # Servicio de carrito
└── hooks/
    ├── useShopifyProducts.ts  # Hook para productos
    └── useShopifyCart.ts      # Hook para carrito
```

## 🚀 Uso en la Aplicación

### Obtener Productos

```typescript
import { useShopifyProducts } from '@/shopify/hooks/useShopifyProducts';

function ProductList() {
  const { products, loading, error } = useShopifyProducts();
  
  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

### Filtrar por Categoría

```typescript
const { products } = useShopifyProducts('Whisky');
```

### Gestionar Carrito

```typescript
import { useShopifyCart } from '@/shopify/hooks/useShopifyCart';

function Cart() {
  const { cart, addItem, removeItem, goToCheckout } = useShopifyCart();
  
  const handleAddToCart = async (variantId: string) => {
    await addItem(variantId, 1);
  };
  
  return (
    <button onClick={goToCheckout}>
      Finalizar Compra
    </button>
  );
}
```

## 🔄 Modo Desarrollo (Sin Shopify)

Si no configuras las credenciales, la app funcionará con productos mock para desarrollo. Configura Shopify solo cuando estés listo para conectarte a tu tienda real.

## ✅ Verificar Configuración

Para verificar que todo está correctamente configurado:

```typescript
import { isShopifyConfigured } from '@/shopify/config';

if (isShopifyConfigured()) {
  console.log('✅ Shopify está configurado');
} else {
  console.log('⚠️ Usando datos mock - configura Shopify');
}
```

## 📝 Notas Importantes

1. **Precios en MXN:** Asegúrate de que tu tienda Shopify esté configurada con MXN como moneda principal
2. **Imágenes:** Los productos deben tener imágenes configuradas en Shopify
3. **Inventario:** El sistema respeta el stock disponible en Shopify
4. **Checkout:** Los pagos se procesan en Shopify, no en esta aplicación
5. **Testing:** Usa el modo de prueba de Shopify para testing

## 🆘 Solución de Problemas

### Error: "Products no cargan"
- Verifica que las credenciales en `.env` sean correctas
- Confirma que la app tiene los permisos correctos
- Revisa la consola del navegador para errores

### Error: "No se pueden agregar productos al carrito"
- Verifica que el producto tenga variantes disponibles
- Confirma que el inventario no esté en 0
- Revisa que el permiso `unauthenticated_write_checkouts` esté habilitado

### Error: "Colecciones vacías"
- Verifica que las colecciones existan en Shopify
- Confirma que los handles coincidan (ver tabla arriba)
- Asegúrate de que las colecciones tengan productos

## 📚 Recursos

- [Shopify Storefront API Docs](https://shopify.dev/docs/api/storefront)
- [Hydrogen React](https://shopify.dev/docs/custom-storefronts/hydrogen-react)
- [GraphQL Admin](https://shopify.dev/docs/admin-api/graphql)

---

**¿Necesitas ayuda?** Revisa la documentación oficial de Shopify o contacta al equipo de desarrollo.
