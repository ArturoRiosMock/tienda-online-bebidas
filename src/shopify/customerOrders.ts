import { getStorefrontApiUrl, shopifyConfig, isShopifyConfigured } from './config';

export interface CustomerOrderLineItem {
  title: string;
  quantity: number;
}

export interface CustomerOrder {
  id: string;
  name: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  statusUrl: string;
  totalPrice: number;
  currencyCode: string;
  lineItems: CustomerOrderLineItem[];
}

export interface CustomerOrdersPage {
  orders: CustomerOrder[];
  hasNextPage: boolean;
  endCursor: string | null;
  numberOfOrders: number;
}

const GET_CUSTOMER_ORDERS = `
  query GetCustomerOrders($customerAccessToken: String!, $first: Int!, $after: String) {
    customer(customerAccessToken: $customerAccessToken) {
      numberOfOrders
      orders(first: $first, sortKey: PROCESSED_AT, reverse: true, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            name
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            statusUrl
            currentTotalPrice {
              amount
              currencyCode
            }
            lineItems(first: 8) {
              edges {
                node {
                  title
                  quantity
                }
              }
            }
          }
        }
      }
    }
  }
`;

const FINANCIAL_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pago pendiente',
  AUTHORIZED: 'Autorizado',
  PARTIALLY_PAID: 'Pago parcial',
  PAID: 'Pagado',
  PARTIALLY_REFUNDED: 'Reembolso parcial',
  REFUNDED: 'Reembolsado',
  VOIDED: 'Anulado',
};

const FULFILLMENT_STATUS_LABELS: Record<string, string> = {
  UNFULFILLED: 'Sin surtir',
  PARTIAL: 'Surtido parcial',
  FULFILLED: 'Surtido',
  RESTOCKED: 'Reingresado',
  IN_PROGRESS: 'En proceso',
  ON_HOLD: 'En espera',
  OPEN: 'Abierto',
  PENDING_FULFILLMENT: 'Pendiente de surtido',
  SCHEDULED: 'Programado',
};

export const getFinancialStatusLabel = (status: string): string =>
  FINANCIAL_STATUS_LABELS[status] ?? status.replace(/_/g, ' ').toLowerCase();

export const getFulfillmentStatusLabel = (status: string): string =>
  FULFILLMENT_STATUS_LABELS[status] ?? status.replace(/_/g, ' ').toLowerCase();

export const formatOrderDate = (iso: string): string => {
  try {
    return new Date(iso).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
};

export const fetchCustomerOrdersPage = async (
  customerAccessToken: string,
  first: number = 10,
  after: string | null = null,
): Promise<CustomerOrdersPage | null> => {
  if (!isShopifyConfigured() || !customerAccessToken || customerAccessToken === 'demo-token') {
    return null;
  }

  try {
    const response = await fetch(getStorefrontApiUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': shopifyConfig.storefrontAccessToken,
      },
      body: JSON.stringify({
        query: GET_CUSTOMER_ORDERS,
        variables: {
          customerAccessToken,
          first,
          after: after || undefined,
        },
      }),
    });

    const data = await response.json();

    if (data?.errors?.length) {
      console.error('Error fetching customer orders:', data.errors);
      return null;
    }

    const customer = data?.data?.customer;
    if (!customer) {
      return null;
    }

    const edges = customer.orders?.edges ?? [];

    return {
      numberOfOrders: customer.numberOfOrders ?? edges.length,
      orders: edges.map(({ node }: { node: Record<string, unknown> }) => {
        const price = node.currentTotalPrice as { amount: string; currencyCode: string };
        const lineEdges = (node.lineItems as { edges: Array<{ node: CustomerOrderLineItem }> })?.edges ?? [];

        return {
          id: node.id as string,
          name: node.name as string,
          orderNumber: node.orderNumber as number,
          processedAt: node.processedAt as string,
          financialStatus: node.financialStatus as string,
          fulfillmentStatus: node.fulfillmentStatus as string,
          statusUrl: node.statusUrl as string,
          totalPrice: parseFloat(price.amount),
          currencyCode: price.currencyCode,
          lineItems: lineEdges.map(({ node: line }) => ({
            title: line.title,
            quantity: line.quantity,
          })),
        };
      }),
      hasNextPage: customer.orders?.pageInfo?.hasNextPage ?? false,
      endCursor: customer.orders?.pageInfo?.endCursor ?? null,
    };
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return null;
  }
};
