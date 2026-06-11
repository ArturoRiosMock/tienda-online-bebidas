// POST /api/checkout
// Recibe las líneas del carrito + el token del cliente logueado, calcula los
// precios de mayoreo y crea un Draft Order de Shopify con los descuentos por
// línea. Devuelve la invoiceUrl (URL de pago) a la que redirige el frontend.
//
// Si el cliente no está logueado o no pertenece a ningún grupo de mayoreo,
// responde { wholesale: false } y el frontend usa el checkout normal.
import {
  getCustomerFromToken,
  getCustomerTags,
  getVariantsInfo,
  createDraftOrder,
} from './_lib/shopify.mjs';
import { pricesForTags } from './_lib/wholesale.mjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const { customerAccessToken, lines } = body;

    if (!Array.isArray(lines) || lines.length === 0) {
      res.status(400).json({ error: 'lines requerido' });
      return;
    }

    const noWholesale = (reason) => res.status(200).json({ wholesale: false, reason });

    if (!customerAccessToken) return noWholesale('sin-sesion');

    const customer = await getCustomerFromToken(customerAccessToken);
    if (!customer?.id) return noWholesale('token-invalido');

    const tags = await getCustomerTags(customer.id);
    const prices = pricesForTags(tags); // { productLegacyId: precioMayoreo }
    if (Object.keys(prices).length === 0) return noWholesale('sin-grupo-mayoreo');

    // Precio base + id de producto de cada variante del carrito
    const variantIds = lines.map((l) => l.merchandiseId).filter(Boolean);
    const info = await getVariantsInfo(variantIds);

    let anyDiscount = false;
    const lineItems = lines.map((l) => {
      const v = info[l.merchandiseId];
      const quantity = Math.max(1, parseInt(l.quantity, 10) || 1);
      const item = { variantId: l.merchandiseId, quantity };

      if (v && v.productLegacyId != null) {
        const wholesaleUnit = prices[String(v.productLegacyId)];
        if (wholesaleUnit != null && wholesaleUnit < v.basePrice) {
          // El descuento FIXED_AMOUNT de línea en draft orders se aplica POR
          // UNIDAD, así que usamos la diferencia por unidad (no por cantidad).
          const perUnitDiscount = +(v.basePrice - wholesaleUnit).toFixed(2);
          if (perUnitDiscount > 0) {
            anyDiscount = true;
            item.appliedDiscount = {
              valueType: 'FIXED_AMOUNT',
              value: perUnitDiscount,
              title: 'Mayoreo',
              description: 'Precio de mayoreo',
            };
          }
        }
      }
      return item;
    });

    if (!anyDiscount) return noWholesale('sin-productos-con-descuento');

    const draft = await createDraftOrder({ customerId: customer.id, lineItems });
    if (!draft?.invoiceUrl) {
      res.status(502).json({ error: 'No se generó invoiceUrl' });
      return;
    }

    res.status(200).json({ wholesale: true, invoiceUrl: draft.invoiceUrl, draftName: draft.name });
  } catch (err) {
    console.error('[checkout] error:', err);
    res.status(500).json({ error: 'Error al crear el pedido de mayoreo' });
  }
}
