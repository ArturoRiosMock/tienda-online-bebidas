import { shopifyClient } from '../queries';

const CART_ATTRIBUTES_UPDATE = `
  mutation cartAttributesUpdate($attributes: [AttributeInput!]!, $cartId: ID!) {
    cartAttributesUpdate(attributes: $attributes, cartId: $cartId) {
      cart {
        id
        attributes {
          key
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const updateCartAttributes = async (
  cartId: string,
  attributes: Array<{ key: string; value: string }>
): Promise<boolean> => {
  try {
    const data: any = await shopifyClient.request(CART_ATTRIBUTES_UPDATE, {
      cartId,
      attributes,
    });

    if (data.cartAttributesUpdate.userErrors.length > 0) {
      console.error('Error updating cart attributes:', data.cartAttributesUpdate.userErrors);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating cart attributes:', error);
    return false;
  }
};
