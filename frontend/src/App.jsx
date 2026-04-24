import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { BlogListPage } from '@/pages/BlogListPage';
import { BlogPostPage } from '@/pages/BlogPostPage';
import { TermsPage } from '@/pages/legal/TermsPage';
import { PrivacyPage } from '@/pages/legal/PrivacyPage';
import { CookiesPage } from '@/pages/legal/CookiesPage';
import { CookieBanner } from '@/components/CookieBanner';

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
      window.scrollTo({ top: 0, behavior: 'instant' });
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
  return (
    <>
      <HashScroller />
      <CookieBanner />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/termos" element={<TermsPage />} />
        <Route path="/privacidade" element={<PrivacyPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
      </Routes>
    </>
  );
}

export default App;
