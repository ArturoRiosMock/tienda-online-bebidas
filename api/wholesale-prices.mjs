// POST /api/wholesale-prices
// Recibe el token del cliente + una lista de variantes y devuelve el precio de
// mayoreo de cada una (para mostrarlo en el carrito / fichas de producto).
// { wholesale: boolean, prices: { [variantGid]: precioMayoreoUnitario } }
import { getCustomerFromToken, getCustomerTags, getVariantsInfo } from './_lib/shopify.mjs';
import { pricesForTags } from './_lib/wholesale.mjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const { customerAccessToken, variantIds } = body;

    if (!customerAccessToken || !Array.isArray(variantIds) || variantIds.length === 0) {
      res.status(200).json({ wholesale: false, prices: {} });
      return;
    }

    const customer = await getCustomerFromToken(customerAccessToken);
    if (!customer?.id) {
      res.status(200).json({ wholesale: false, prices: {} });
      return;
    }

    const tags = await getCustomerTags(customer.id);
    const groupPrices = pricesForTags(tags);
    if (Object.keys(groupPrices).length === 0) {
      res.status(200).json({ wholesale: false, prices: {} });
      return;
    }

    const info = await getVariantsInfo(variantIds);
    const prices = {};
    for (const vid of variantIds) {
      const v = info[vid];
      if (v && v.productLegacyId != null) {
        const wholesaleUnit = groupPrices[String(v.productLegacyId)];
        if (wholesaleUnit != null && wholesaleUnit < v.basePrice) {
          prices[vid] = wholesaleUnit;
        }
      }
    }

    res.status(200).json({ wholesale: true, prices });
  } catch (err) {
    console.error('[wholesale-prices] error:', err);
    res.status(200).json({ wholesale: false, prices: {} });
  }
}
