import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MainLayout } from '@/app/layouts/MainLayout';
import { HomePage } from '@/app/pages/HomePage';
import { CollectionPage } from '@/app/pages/CollectionPage';
import { ProductPage } from '@/app/pages/ProductPage';
import { AdminBannersPage } from '@/app/pages/AdminBannersPage';
import { EventQuotePage } from '@/app/pages/EventQuotePage';
import { SobreNosotrosPage } from '@/app/pages/SobreNosotrosPage';
import { PreguntasFrecuentesPage } from '@/app/pages/PreguntasFrecuentesPage';
import { ContactoPage } from '@/app/pages/ContactoPage';
import { PolicyDocumentPage } from '@/app/pages/PolicyDocumentPage';
import { privacyPolicy, refundPolicy, termsOfService } from '@/content/mrbrown/policies';

const SHOPIFY_CHECKOUT_DOMAIN = 'mrbrownmx.myshopify.com';

function ShopifyRedirect() {
  const location = useLocation();
  window.location.href = `https://${SHOPIFY_CHECKOUT_DOMAIN}${location.pathname}${location.search}`;
  return null;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/categorias/:handle" element={<CollectionPage />} />
          <Route path="/producto/:handle" element={<ProductPage />} />
          <Route path="/cotizar-evento" element={<EventQuotePage />} />
          <Route path="/page/sobre-nosotros" element={<SobreNosotrosPage />} />
          <Route path="/sobre-nosotros" element={<Navigate to="/page/sobre-nosotros" replace />} />
          <Route path="/preguntas-frecuentes" element={<PreguntasFrecuentesPage />} />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route path="/aviso-de-privacidad" element={<PolicyDocumentPage title="Política de Privacidad" blocks={privacyPolicy} />} />
          <Route path="/politica-de-reembolso" element={<PolicyDocumentPage title="Política de Reembolso" blocks={refundPolicy} />} />
          <Route path="/terminos-de-servicio" element={<PolicyDocumentPage title="Términos del Servicio" blocks={termsOfService} />} />
        </Route>
        <Route path="/admin/banners" element={<AdminBannersPage />} />
        {/* Rutas de Shopify: redirigir checkout y carrito al dominio nativo */}
        <Route path="/cart/*" element={<ShopifyRedirect />} />
        <Route path="/checkouts/*" element={<ShopifyRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
