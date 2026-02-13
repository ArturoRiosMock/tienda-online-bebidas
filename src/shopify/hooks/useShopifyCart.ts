import { useState, useEffect } from 'react';
import { getOrCreateCart, addToShopifyCart, updateCartLine, removeFromShopifyCart, redirectToCheckout } from '@/shopify/cart';
import { isShopifyConfigured } from '@/shopify/config';
import type { ShopifyCart } from '@/shopify/types';

/**
 * Hook para gestionar el carrito de Shopify
 */

export const useShopifyCart = () => {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar o recuperar el carrito
  useEffect(() => {
    const initCart = async () => {
      if (!isShopifyConfigured()) {
        console.warn('Shopify no está configurado. El carrito no funcionará con Shopify.');
        return;
      }

      setLoading(true);
      const existingCart = await getOrCreateCart();
      setCart(existingCart);
      setLoading(false);
    };

    initCart();
  }, []);

  // Agregar producto al carrito
  const addItem = async (variantId: string, quantity: number = 1) => {
    if (!isShopifyConfigured()) {
      console.warn('Shopify no configurado');
      return;
    }

    if (!cart) {
      const newCart = await getOrCreateCart();
      if (!newCart) {
        setError('No se pudo crear el carrito');
        return;
      }
      setCart(newCart);
    }

    setLoading(true);
    setError(null);

    try {
      const updatedCart = await addToShopifyCart(cart!.id, variantId, quantity);
      if (updatedCart) {
        setCart(updatedCart);
      } else {
        setError('No se pudo agregar el producto');
      }
    } catch (err) {
      console.error('Error adding item to cart:', err);
      setError('Error al agregar producto');
    } finally {
      setLoading(false);
    }
  };

  // Actualizar cantidad de un item
  const updateItem = async (lineId: string, quantity: number) => {
    if (!isShopifyConfigured() || !cart) return;

    setLoading(true);
    setError(null);

    try {
      const updatedCart = await updateCartLine(cart.id, lineId, quantity);
      if (updatedCart) {
        setCart(updatedCart);
      } else {
        setError('No se pudo actualizar el producto');
      }
    } catch (err) {
      console.error('Error updating cart item:', err);
      setError('Error al actualizar producto');
    } finally {
      setLoading(false);
    }
  };

  // Remover item del carrito
  const removeItem = async (lineId: string) => {
    if (!isShopifyConfigured() || !cart) return;

    setLoading(true);
    setError(null);

    try {
      const updatedCart = await removeFromShopifyCart(cart.id, [lineId]);
      if (updatedCart) {
        setCart(updatedCart);
      } else {
        setError('No se pudo remover el producto');
      }
    } catch (err) {
      console.error('Error removing item from cart:', err);
      setError('Error al remover producto');
    } finally {
      setLoading(false);
    }
  };

  // Vaciar carrito (remover todas las líneas)
  const removeAllItems = async (lineIds: string[]) => {
    if (!isShopifyConfigured() || !cart || lineIds.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const updatedCart = await removeFromShopifyCart(cart.id, lineIds);
      if (updatedCart) {
        setCart(updatedCart);
      } else {
        setError('No se pudo vaciar el carrito');
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Error al vaciar carrito');
    } finally {
      setLoading(false);
    }
  };

  // Ir al checkout
  const goToCheckout = () => {
    if (!cart?.checkoutUrl) {
      setError('No hay URL de checkout disponible');
      return;
    }
    redirectToCheckout(cart.checkoutUrl);
  };

  // Obtener total de items
  const getTotalItems = (): number => {
    return cart?.totalQuantity || 0;
  };

  // Obtener subtotal
  const getSubtotal = (): number => {
    if (!cart?.cost?.subtotalAmount) return 0;
    return parseFloat(cart.cost.subtotalAmount.amount);
  };

  // Obtener total
  const getTotal = (): number => {
    if (!cart?.cost?.totalAmount) return 0;
    return parseFloat(cart.cost.totalAmount.amount);
  };

  return {
    cart,
    loading,
    error,
    addItem,
    updateItem,
    removeItem,
    removeAllItems,
    goToCheckout,
    getTotalItems,
    getSubtotal,
    getTotal,
    isConfigured: isShopifyConfigured()
  };
};
