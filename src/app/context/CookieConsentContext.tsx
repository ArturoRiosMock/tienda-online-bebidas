import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const STORAGE_KEY = 'mr-brown-cookie-consent';
const COOKIE_NAME = 'mr-brown-cookie-consent';
const COOKIE_DAYS = 180;
const CONSENT_VERSION = 1 as const;

export type ConsentCategory = 'essentials' | 'analytics' | 'marketing';

export interface ConsentState {
  version: typeof CONSENT_VERSION;
  essentials: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

interface CookieConsentContextValue {
  preferences: ConsentState | null;
  hasInteracted: boolean;
  isPanelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (next: { analytics: boolean; marketing: boolean }) => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const setCookie = (name: string, value: string, days: number) => {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
};

const safeGetLocal = (key: string): string | null => {
  try {
    return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
  } catch {
    return null;
  }
};

const safeSetLocal = (key: string, value: string) => {
  try {
    if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
  } catch {
    /* almacenamiento bloqueado (modo privado, cookies/storage deshabilitado) */
  }
};

const parseStored = (raw: string | null): ConsentState | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    if (parsed.version !== CONSENT_VERSION) return null;
    if (typeof parsed.analytics !== 'boolean' || typeof parsed.marketing !== 'boolean') return null;
    return {
      version: CONSENT_VERSION,
      essentials: true,
      analytics: parsed.analytics,
      marketing: parsed.marketing,
      timestamp: typeof parsed.timestamp === 'number' ? parsed.timestamp : Date.now(),
    };
  } catch {
    return null;
  }
};

const readInitialPreferences = (): ConsentState | null => {
  return parseStored(safeGetLocal(STORAGE_KEY)) ?? parseStored(getCookie(COOKIE_NAME));
};

const persist = (state: ConsentState) => {
  const serialized = JSON.stringify(state);
  safeSetLocal(STORAGE_KEY, serialized);
  setCookie(COOKIE_NAME, serialized, COOKIE_DAYS);
};

export const CookieConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<ConsentState | null>(() => readInitialPreferences());
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const acceptAll = useCallback(() => {
    const next: ConsentState = {
      version: CONSENT_VERSION,
      essentials: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    };
    persist(next);
    setPreferences(next);
    setIsPanelOpen(false);
  }, []);

  const rejectAll = useCallback(() => {
    const next: ConsentState = {
      version: CONSENT_VERSION,
      essentials: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    };
    persist(next);
    setPreferences(next);
    setIsPanelOpen(false);
  }, []);

  const savePreferences = useCallback((next: { analytics: boolean; marketing: boolean }) => {
    const merged: ConsentState = {
      version: CONSENT_VERSION,
      essentials: true,
      analytics: next.analytics,
      marketing: next.marketing,
      timestamp: Date.now(),
    };
    persist(merged);
    setPreferences(merged);
    setIsPanelOpen(false);
  }, []);

  const openPanel = useCallback(() => setIsPanelOpen(true), []);
  const closePanel = useCallback(() => setIsPanelOpen(false), []);

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      preferences,
      hasInteracted: preferences !== null,
      isPanelOpen,
      openPanel,
      closePanel,
      acceptAll,
      rejectAll,
      savePreferences,
    }),
    [preferences, isPanelOpen, openPanel, closePanel, acceptAll, rejectAll, savePreferences],
  );

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>;
};

export const useCookieConsent = (): CookieConsentContextValue => {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error('useCookieConsent debe usarse dentro de CookieConsentProvider');
  return ctx;
};

export const useHasConsent = (category: ConsentCategory): boolean => {
  const { preferences } = useCookieConsent();
  if (!preferences) return category === 'essentials';
  return preferences[category];
};
