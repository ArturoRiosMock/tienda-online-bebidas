import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { isShopifyConfigured, getStorefrontApiUrl, shopifyConfig } from '@/shopify/config';

export interface AuthUser {
  email: string;
  firstName?: string;
  lastName?: string;
  accessToken: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AUTH_STORAGE_KEY = 'bebify-auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const loadStoredAuth = (): AuthUser | null => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const saveAuth = (user: AuthUser | null) => {
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch { /* silently ignore */ }
};

async function shopifyCustomerLogin(email: string, password: string): Promise<{ user: AuthUser | null; error: string | null }> {
  const query = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  try {
    const response = await fetch(getStorefrontApiUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': shopifyConfig.storefrontAccessToken,
      },
      body: JSON.stringify({
        query,
        variables: { input: { email, password } },
      }),
    });

    const data = await response.json();
    const result = data?.data?.customerAccessTokenCreate;

    if (result?.customerUserErrors?.length > 0) {
      return { user: null, error: result.customerUserErrors[0].message };
    }

    if (result?.customerAccessToken?.accessToken) {
      const customerData = await fetchCustomerInfo(result.customerAccessToken.accessToken);
      return {
        user: {
          email: customerData?.email ?? email,
          firstName: customerData?.firstName ?? '',
          lastName: customerData?.lastName ?? '',
          accessToken: result.customerAccessToken.accessToken,
        },
        error: null,
      };
    }

    return { user: null, error: 'Error al iniciar sesión. Verifica tus credenciales.' };
  } catch {
    return { user: null, error: 'Error de conexión con el servidor.' };
  }
}

async function fetchCustomerInfo(accessToken: string) {
  const query = `
    query {
      customer(customerAccessToken: "${accessToken}") {
        email
        firstName
        lastName
      }
    }
  `;

  try {
    const response = await fetch(getStorefrontApiUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': shopifyConfig.storefrontAccessToken,
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    return data?.data?.customer ?? null;
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(loadStoredAuth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    saveAuth(user);
  }, [user]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    if (isShopifyConfigured()) {
      const result = await shopifyCustomerLogin(email, password);
      setLoading(false);
      if (result.user) {
        setUser(result.user);
        return true;
      }
      setError(result.error);
      return false;
    }

    // Demo mode: accept any email/password combo with basic validation
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);

    if (!email || !password) {
      setError('Ingresa tu correo y contraseña.');
      return false;
    }

    if (password.length < 4) {
      setError('Contraseña incorrecta.');
      return false;
    }

    setUser({
      email,
      firstName: email.split('@')[0],
      accessToken: 'demo-token',
    });
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      error,
      login,
      logout,
      clearError,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
