// Prueba end-to-end de la lógica de mayoreo contra las APIs reales.
// Uso: node scripts/test-wholesale.mjs
import { adminGraphql, getVariantsInfo, createDraftOrder } from '../api/_lib/shopify.mjs';
import { pricesForTags, GROUPS } from '../api/_lib/wholesale.mjs';

const log = (...a) => console.log(...a);

// 1) Buscar un cliente que tenga alguno de los tags de mayoreo
const tags = Object.keys(GROUPS);
let customer = null;
for (const tag of tags) {
  const data = await adminGraphql(
    `query($q: String!) { customers(first: 1, query: $q) { edges { node { id email tags } } } }`,
    { q: `tag:'${tag}'` },
  );
  const node = data?.customers?.edges?.[0]?.node;
  if (node) { customer = node; break; }
}
if (!customer) { log('No encontré ningún cliente con tag de mayoreo.'); process.exit(1); }
log('Cliente de prueba:', customer.email, '| tags:', customer.tags);

// 2) Resolver su lista de precios de mayoreo
const prices = pricesForTags(customer.tags);
const productIds = Object.keys(prices);
log('Productos con precio de mayoreo para este cliente:', productIds.length);

// 3) Elegir un producto de su lista y obtener su primera variante + precio base
const targetProductId = productIds[0];
const prodData = await adminGraphql(
  `query($id: ID!) {
     product(id: $id) {
       title
       variants(first: 1) { edges { node { id price } } }
     }
   }`,
  { id: `gid://shopify/Product/${targetProductId}` },
);
const variant = prodData?.product?.variants?.edges?.[0]?.node;
log(`Producto: ${prodData?.product?.title}`);
log(`  precio base Shopify: ${variant.price}`);
log(`  precio mayoreo SAMI: ${prices[targetProductId]}`);

const basePrice = parseFloat(variant.price);
const wholesaleUnit = prices[targetProductId];
const quantity = 2;
const lineDiscount = +((basePrice - wholesaleUnit) * quantity).toFixed(2);
log(`  cantidad: ${quantity} -> descuento de línea: ${lineDiscount}`);

if (lineDiscount <= 0) { log('Sin descuento positivo, abortando prueba.'); process.exit(0); }

// 4) Crear el draft order con el descuento por línea
const draft = await createDraftOrder({
  customerId: customer.id,
  lineItems: [
    {
      variantId: variant.id,
      quantity,
      appliedDiscount: {
        valueType: 'FIXED_AMOUNT',
        value: lineDiscount,
        title: 'Mayoreo',
        description: 'Precio de mayoreo SAMI (headless)',
      },
    },
  ],
  note: 'PRUEBA automática — borrar',
});

log('\n✅ Draft order creado:');
log('   id:', draft.id);
log('   nombre:', draft.name);
log('   total:', JSON.stringify(draft.totalPriceSet?.presentmentMoney));
log('   esperado (2 x mayoreo):', (wholesaleUnit * quantity).toFixed(2));
log('   invoiceUrl (URL de pago):', draft.invoiceUrl);
log('\n   (Para borrarlo: DELETE draftOrder', draft.id, ')');
