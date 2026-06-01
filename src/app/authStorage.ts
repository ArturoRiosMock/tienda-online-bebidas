export const AUTH_STORAGE_KEY = 'bebify-auth';

export interface StoredAuthUser {
  email: string;
  firstName?: string;
  lastName?: string;
  accessToken: string;
}

export function loadStoredAuthUser(): StoredAuthUser | null {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function getStoredCustomerAccessToken(): string | null {
  const token = loadStoredAuthUser()?.accessToken ?? null;
  if (!token || token === 'demo-token') return null;
  return token;
}
