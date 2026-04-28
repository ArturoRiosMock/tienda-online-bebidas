import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

type ConsentValue = 'all' | 'none' | null;

const STORAGE_KEY = 'bebify-cookie-consent';

interface CookieConsentContextType {
  consent: ConsentValue;
  acceptAll: () => void;
  rejectAll: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

const loadStoredConsent = (): ConsentValue => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'all' || stored === 'none') return stored;
    return null;
  } catch {
    return null;
  }
};

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;

const injectGoogleAnalytics = (id: string) => {
  if (document.getElementById('ga-script')) return;

  const scriptSrc = document.createElement('script');
  scriptSrc.id = 'ga-script';
  scriptSrc.async = true;
  scriptSrc.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(scriptSrc);

  const scriptInit = document.createElement('script');
  scriptInit.id = 'ga-init';
  scriptInit.text = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${id}');
  `;
  document.head.appendChild(scriptInit);
};

const injectMetaPixel = (pixelId: string) => {
  if (document.getElementById('meta-pixel-script')) return;

  const script = document.createElement('script');
  script.id = 'meta-pixel-script';
  script.text = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${pixelId}');
    fbq('track', 'PageView');
  `;
  document.head.appendChild(script);

  const noscript = document.createElement('noscript');
  noscript.id = 'meta-pixel-noscript';
  const img = document.createElement('img');
  img.height = 1;
  img.width = 1;
  img.style.display = 'none';
  img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
  noscript.appendChild(img);
  document.head.appendChild(noscript);
};

const loadTrackers = () => {
  if (GA_ID) injectGoogleAnalytics(GA_ID);
  if (META_PIXEL_ID) injectMetaPixel(META_PIXEL_ID);
};

export const CookieConsentProvider = ({ children }: { children: ReactNode }) => {
  const [consent, setConsent] = useState<ConsentValue>(loadStoredConsent);

  useEffect(() => {
    if (consent === 'all') {
      loadTrackers();
    }
  }, [consent]);

  const acceptAll = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, 'all');
    } catch { /* silently ignore */ }
    setConsent('all');
  }, []);

  const rejectAll = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, 'none');
    } catch { /* silently ignore */ }
    setConsent('none');
  }, []);

  return (
    <CookieConsentContext.Provider value={{ consent, acceptAll, rejectAll }}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error('useCookieConsent must be used within CookieConsentProvider');
  return ctx;
};
