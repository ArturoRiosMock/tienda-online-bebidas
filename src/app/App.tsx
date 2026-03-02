import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/app/context/AuthContext';
import { MainLayout } from '@/app/layouts/MainLayout';
import { HomePage } from '@/app/pages/HomePage';
import { CollectionPage } from '@/app/pages/CollectionPage';
import { ProductPage } from '@/app/pages/ProductPage';
import { LoginPage } from '@/app/pages/LoginPage';
import { AdminBannersPage } from '@/app/pages/AdminBannersPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/categorias/:handle" element={<CollectionPage />} />
            <Route path="/producto/:handle" element={<ProductPage />} />
          </Route>
          <Route path="/admin/banners" element={<AdminBannersPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
