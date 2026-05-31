import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/app/context/AuthContext';
import { CookieConsentProvider } from '@/app/context/CookieConsentContext';
import { MainLayout } from '@/app/layouts/MainLayout';
import { HomePage } from '@/app/pages/HomePage';
import { CollectionPage } from '@/app/pages/CollectionPage';
import { ProductsPage } from '@/app/pages/ProductsPage';
import { ProductPage } from '@/app/pages/ProductPage';
import { BlogPage } from '@/app/pages/BlogPage';
import { BlogPostPage } from '@/app/pages/BlogPostPage';
import { LoginPage } from '@/app/pages/LoginPage';
import { RegisterPage } from '@/app/pages/RegisterPage';
import { PrivacyPolicyPage } from '@/app/pages/PrivacyPolicyPage';
import { CookiePolicyPage } from '@/app/pages/CookiePolicyPage';
import { AdminBannersPage } from '@/app/pages/AdminBannersPage';
import { SearchResultsPage } from '@/app/pages/SearchResultsPage';

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
              <Route path="/productos" element={<ProductsPage />} />
              <Route path="/buscar" element={<SearchResultsPage />} />
              <Route path="/categorias/:handle" element={<CollectionPage />} />
              <Route path="/producto/:handle" element={<ProductPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:blogHandle/:articleHandle" element={<BlogPostPage />} />
            </Route>
            <Route path="/admin/banners" element={<AdminBannersPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </CookieConsentProvider>
  );
}

export default App;
