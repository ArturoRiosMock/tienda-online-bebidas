import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { MainLayout } from '@/app/layouts/MainLayout';
import { HomePage } from '@/app/pages/HomePage';
import { CollectionPage } from '@/app/pages/CollectionPage';
import { ProductPage } from '@/app/pages/ProductPage';
import { NotFoundPage } from '@/app/pages/NotFoundPage';
import { AdminBannersPage } from '@/app/pages/AdminBannersPage';
import { EventQuotePage } from '@/app/pages/EventQuotePage';
import { SobreNosotrosPage } from '@/app/pages/SobreNosotrosPage';
import { PreguntasFrecuentesPage } from '@/app/pages/PreguntasFrecuentesPage';
import { ContactoPage } from '@/app/pages/ContactoPage';
import { PolicyDocumentPage } from '@/app/pages/PolicyDocumentPage';
import { ErrorBoundary } from '@/app/components/ErrorBoundary';
import { privacyPolicy, refundPolicy, termsOfService } from '@/content/mrbrown/policies';

const SHOPIFY_CHECKOUT_DOMAIN = 'mrbrownmx.myshopify.com';

function ShopifyRedirect() {
  const location = useLocation();
  window.location.href = `https://${SHOPIFY_CHECKOUT_DOMAIN}${location.pathname}${location.search}`;
  return null;
}

/** Redirige /products/:handle (URL estándar de Shopify) → /producto/:handle */
function ProductRedirect() {
  const { handle } = useParams<{ handle: string }>();
  return <Navigate to={`/producto/${handle}`} replace />;
}

/** Redirige /collections/:handle (URL estándar de Shopify) → /categorias/:handle */
function CollectionRedirect() {
  const { handle } = useParams<{ handle: string }>();
  return <Navigate to={`/categorias/${handle}`} replace />;
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const target = document.getElementById(id);
      if (target) {
        setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 100);
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/productos" element={<CollectionPage />} />
          <Route path="/categorias/:handle" element={<CollectionPage />} />
          <Route
            path="/producto/:handle"
            element={
              <ErrorBoundary>
                <ProductPage />
              </ErrorBoundary>
            }
          />
          {/* Redirects desde URLs estándar de Shopify hacia las rutas internas */}
          <Route path="/products/:handle" element={<ProductRedirect />} />
          <Route path="/collections/:handle" element={<CollectionRedirect />} />
          <Route path="/cotizar-evento" element={<EventQuotePage />} />
          <Route path="/page/sobre-nosotros" element={<SobreNosotrosPage />} />
          <Route path="/sobre-nosotros" element={<Navigate to="/page/sobre-nosotros" replace />} />
          <Route path="/preguntas-frecuentes" element={<PreguntasFrecuentesPage />} />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route path="/aviso-de-privacidad" element={<PolicyDocumentPage title="Política de Privacidad" blocks={privacyPolicy} />} />
          <Route path="/politica-de-reembolso" element={<PolicyDocumentPage title="Política de Reembolso" blocks={refundPolicy} />} />
          <Route path="/terminos-de-servicio" element={<PolicyDocumentPage title="Términos del Servicio" blocks={termsOfService} />} />
          {/* Catch-all: cualquier ruta no reconocida → 404 */}
          <Route path="*" element={<NotFoundPage />} />
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
