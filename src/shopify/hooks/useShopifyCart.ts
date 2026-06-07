import { useState, useEffect, useCallback } from 'react';
import { getOrCreateCart, getCart, addToShopifyCart, updateCartLine, removeFromShopifyCart, redirectToCheckout } from '@/shopify/cart';
import { updateCartAttributes } from '@/shopify/mutations/cartAttributes';
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

  /** Sincroniza el carrito con Shopify (p. ej. al volver atrás desde checkout / bfcache). */
  const refreshCart = useCallback(async (): Promise<ShopifyCart | null> => {
    if (!isShopifyConfigured()) return null;

    const storedId = localStorage.getItem('shopifyCartId');
    if (storedId) {
      const fresh = await getCart(storedId);
      if (fresh) {
        setCart(fresh);
        setError(null);
        return fresh;
      }
      localStorage.removeItem('shopifyCartId');
    }

    const created = await getOrCreateCart();
    setCart(created);
    return created;
  }, []);

  // Al volver desde checkout el navegador puede restaurar la SPA desde bfcache
  // con un checkoutUrl caducado en memoria — hay que volver a pedir el carrito.
  useEffect(() => {
    if (!isShopifyConfigured()) return;

    const onPageShow = () => {
      void refreshCart();
    };

    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, [refreshCart]);

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

  // Actualizar atributos del carrito
  const updateAttributes = async (
    attributes: Array<{ key: string; value: string }>
  ): Promise<boolean> => {
    if (!cart) return false;

    setLoading(true);
    setError(null);

    try {
      const success = await updateCartAttributes(cart.id, attributes);
      if (!success) {
        setError('No se pudieron guardar los datos del evento');
        return false;
      }
      await refreshCart();
      return true;
    } catch (err) {
      console.error('Error updating cart attributes:', err);
      setError('Error al guardar datos del evento');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Ir al checkout — siempre pide checkoutUrl fresco antes de redirigir
  const goToCheckout = async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const freshCart = await refreshCart();

      if (!freshCart?.totalQuantity) {
        setError('Tu carrito está vacío');
        return false;
      }

      if (!freshCart.checkoutUrl) {
        setError('No hay URL de checkout disponible');
        return false;
      }

      redirectToCheckout(freshCart.checkoutUrl);
      return true;
    } catch (err) {
      console.error('Error going to checkout:', err);
      setError('Error al ir al checkout. Intenta de nuevo.');
      return false;
    } finally {
      setLoading(false);
    }
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
    updateAttributes,
    goToCheckout,
    refreshCart,
    getTotalItems,
    getSubtotal,
    getTotal,
    isConfigured: isShopifyConfigured()
  };
};
