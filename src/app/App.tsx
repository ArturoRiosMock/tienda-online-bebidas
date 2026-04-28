import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/app/context/AuthContext';
import { CookieConsentProvider } from '@/app/context/CookieConsentContext';
import { MainLayout } from '@/app/layouts/MainLayout';
import { HomePage } from '@/app/pages/HomePage';
import { CollectionPage } from '@/app/pages/CollectionPage';
import { ProductPage } from '@/app/pages/ProductPage';
import { LoginPage } from '@/app/pages/LoginPage';
import { RegisterPage } from '@/app/pages/RegisterPage';
import { PrivacyPolicyPage } from '@/app/pages/PrivacyPolicyPage';
import { CookiePolicyPage } from '@/app/pages/CookiePolicyPage';
import { AdminBannersPage } from '@/app/pages/AdminBannersPage';

function App() {
  return (
    <CookieConsentProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/aviso-de-privacidad" element={<PrivacyPolicyPage />} />
            <Route path="/politica-de-cookies" element={<CookiePolicyPage />} />
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/categorias/:handle" element={<CollectionPage />} />
              <Route path="/producto/:handle" element={<ProductPage />} />
            </Route>
            <Route path="/admin/banners" element={<AdminBannersPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </CookieConsentProvider>
  );
}

export default App;
