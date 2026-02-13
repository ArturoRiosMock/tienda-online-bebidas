import { shopifyClient, CREATE_CART, ADD_TO_CART, UPDATE_CART_LINES, REMOVE_FROM_CART } from './queries';
import type { ShopifyCart } from './types';

/**
 * Servicio para gestionar el carrito de Shopify
 */

// Crear un nuevo carrito
export const createCart = async (): Promise<ShopifyCart | null> => {
  try {
    const data: any = await shopifyClient.request(CREATE_CART, {
      input: {
        lines: []
      }
    });

    if (data.cartCreate.userErrors.length > 0) {
      console.error('Error creating cart:', data.cartCreate.userErrors);
      return null;
    }

    return data.cartCreate.cart;
  } catch (error) {
    console.error('Error creating cart:', error);
    return null;
  }
};

// Agregar item al carrito
export const addToShopifyCart = async (
  cartId: string,
  variantId: string,
  quantity: number = 1
): Promise<ShopifyCart | null> => {
  try {
    const data: any = await shopifyClient.request(ADD_TO_CART, {
      cartId,
      lines: [
        {
          merchandiseId: variantId,
          quantity
        }
      ]
    });

    if (data.cartLinesAdd.userErrors.length > 0) {
      console.error('Error adding to cart:', data.cartLinesAdd.userErrors);
      return null;
    }

    return data.cartLinesAdd.cart;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return null;
  }
};

// Actualizar cantidad de un item en el carrito
export const updateCartLine = async (
  cartId: string,
  lineId: string,
  quantity: number
): Promise<ShopifyCart | null> => {
  try {
    const data: any = await shopifyClient.request(UPDATE_CART_LINES, {
      cartId,
      lines: [
        {
          id: lineId,
          quantity
        }
      ]
    });

    if (data.cartLinesUpdate.userErrors.length > 0) {
      console.error('Error updating cart:', data.cartLinesUpdate.userErrors);
      return null;
    }

    return data.cartLinesUpdate.cart;
  } catch (error) {
    console.error('Error updating cart:', error);
    return null;
  }
};

// Remover item del carrito
export const removeFromShopifyCart = async (
  cartId: string,
  lineIds: string[]
): Promise<ShopifyCart | null> => {
  try {
    const data: any = await shopifyClient.request(REMOVE_FROM_CART, {
      cartId,
      lineIds
    });

    if (data.cartLinesRemove.userErrors.length > 0) {
      console.error('Error removing from cart:', data.cartLinesRemove.userErrors);
      return null;
    }

    return data.cartLinesRemove.cart;
  } catch (error) {
    console.error('Error removing from cart:', error);
    return null;
  }
};

// Obtener o crear un carrito
export const getOrCreateCart = async (): Promise<ShopifyCart | null> => {
  // Intentar obtener el cartId del localStorage
  const existingCartId = localStorage.getItem('shopifyCartId');
  
  if (existingCartId) {
    // Si existe un cartId, podríamos validar que aún existe en Shopify
    // Por ahora, asumimos que es válido
    return { id: existingCartId } as ShopifyCart;
  }

  // Si no existe, crear un nuevo carrito
  const newCart = await createCart();
  
  if (newCart) {
    localStorage.setItem('shopifyCartId', newCart.id);
  }

  return newCart;
};

// Limpiar el carrito del localStorage
export const clearCart = (): void => {
  localStorage.removeItem('shopifyCartId');
};

// Redirigir al checkout de Shopify
export const redirectToCheckout = (checkoutUrl: string): void => {
  window.location.href = checkoutUrl;
};
