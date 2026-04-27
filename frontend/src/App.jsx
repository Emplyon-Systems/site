import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { BlogListPage } from '@/pages/BlogListPage';
import { BlogPostPage } from '@/pages/BlogPostPage';
import { TermsPage } from '@/pages/legal/TermsPage';
import { PrivacyPage } from '@/pages/legal/PrivacyPage';
import { CookiesPage } from '@/pages/legal/CookiesPage';
import { LoginPage } from '@/pages/LoginPage';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminProfilePage } from '@/pages/admin/AdminProfilePage';
import { AdminCategoriesPage } from '@/pages/admin/AdminCategoriesPage';
import { AdminPostsPage } from '@/pages/admin/AdminPostsPage';
import { AdminPostEditorPage } from '@/pages/admin/AdminPostEditorPage';
import { AdminPostPreviewPage } from '@/pages/admin/AdminPostPreviewPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminContactRequestsPage } from '@/pages/admin/AdminContactRequestsPage';
import { CookieBanner } from '@/components/CookieBanner';
import { PageViewTracker } from '@/components/PageViewTracker';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Após cada navegação, verifica se há um hash na URL e faz scroll
 * até o elemento correspondente. Tenta várias vezes (até 1 s) para
 * aguardar os componentes lazy terminarem de renderizar.
 */
function HashScroller() {
  const location = useLocation();
  const timerRef = useRef(null);

  useEffect(() => {
    const hash = location.hash;
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    const id = hash.replace('#', '');
    let attempts = 0;
    const maxAttempts = 20;

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const el = document.getElementById(id);
      if (el) {
        clearInterval(timerRef.current);
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (++attempts >= maxAttempts) {
        clearInterval(timerRef.current);
      }
    }, 50);

    return () => clearInterval(timerRef.current);
  }, [location]);

  return null;
}

function App() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const trackPublic = !location.pathname.startsWith('/admin');

  function RequireAuth({ children }) {
    if (loading) {
      return <div className="min-h-screen grid place-items-center">Carregando...</div>;
    }

    return isAuthenticated ? children : (
      <Navigate to="/admin/login" replace state={{ from: location }} />
    );
  }

  return (
    <>
      <HashScroller />
      {trackPublic ? <PageViewTracker /> : null}
      <CookieBanner />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/termos" element={<TermsPage />} />
        <Route path="/privacidade" element={<PrivacyPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="/login" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={(
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          )}
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="usuarios" element={<AdminUsersPage />} />
          <Route path="contatos" element={<AdminContactRequestsPage />} />
          <Route path="perfil" element={<AdminProfilePage />} />
          <Route path="blog/categorias" element={<AdminCategoriesPage />} />
          <Route path="blog/artigos" element={<AdminPostsPage />} />
          <Route path="blog/artigos/novo" element={<AdminPostEditorPage />} />
          <Route path="blog/artigos/:id/editar" element={<AdminPostEditorPage />} />
          <Route path="blog/artigos/:id" element={<AdminPostPreviewPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
