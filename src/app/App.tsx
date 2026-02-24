import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/app/layouts/MainLayout';
import { HomePage } from '@/app/pages/HomePage';
import { CollectionPage } from '@/app/pages/CollectionPage';
import { ProductPage } from '@/app/pages/ProductPage';
import { AdminBannersPage } from '@/app/pages/AdminBannersPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/categorias/:handle" element={<CollectionPage />} />
          <Route path="/producto/:handle" element={<ProductPage />} />
        </Route>
        <Route path="/admin/banners" element={<AdminBannersPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
