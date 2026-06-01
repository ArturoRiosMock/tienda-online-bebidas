import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchCustomerOrdersPage, type CustomerOrder } from '@/shopify/customerOrders';

const ORDERS_PAGE_SIZE = 10;

export const useCustomerOrders = (customerAccessToken: string | undefined) => {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [numberOfOrders, setNumberOfOrders] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const endCursorRef = useRef<string | null>(null);

  const fetchPage = useCallback(async (token: string, after: string | null, append: boolean) => {
    if (!token || token === 'demo-token') {
      setOrders([]);
      setNumberOfOrders(0);
      setHasNextPage(false);
      endCursorRef.current = null;
      setError(null);
      return;
    }

    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const page = await fetchCustomerOrdersPage(token, ORDERS_PAGE_SIZE, after);

      if (!page) {
        if (!append) {
          setOrders([]);
          setNumberOfOrders(0);
          setError('No pudimos cargar tus pedidos. Vuelve a iniciar sesión.');
        }
        return;
      }

      setNumberOfOrders(page.numberOfOrders);
      setOrders((prev) => (append ? [...prev, ...page.orders] : page.orders));
      setHasNextPage(page.hasNextPage);
      endCursorRef.current = page.endCursor;
    } catch {
      setError('Error al cargar pedidos.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    if (!customerAccessToken) {
      setOrders([]);
      setNumberOfOrders(0);
      setError(null);
      endCursorRef.current = null;
      return;
    }

    endCursorRef.current = null;
    fetchPage(customerAccessToken, null, false);
  }, [customerAccessToken, fetchPage]);

  const loadMore = useCallback(() => {
    if (!customerAccessToken || !hasNextPage || loadingMore) {
      return;
    }

    fetchPage(customerAccessToken, endCursorRef.current, true);
  }, [customerAccessToken, hasNextPage, loadingMore, fetchPage]);

  const refresh = useCallback(() => {
    if (!customerAccessToken) {
      return;
    }

    endCursorRef.current = null;
    fetchPage(customerAccessToken, null, false);
  }, [customerAccessToken, fetchPage]);

  return {
    orders,
    numberOfOrders,
    loading,
    loadingMore,
    error,
    hasNextPage,
    loadMore,
    refresh,
  };
};
