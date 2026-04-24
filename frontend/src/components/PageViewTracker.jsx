import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { recordPageView } from '@/lib/localAnalytics';

/**
 * Contabiliza visitas ao site público (localStorage — demo até existir API).
 */
export function PageViewTracker() {
  const location = useLocation();
  const lastRef = useRef('');

  useEffect(() => {
    const path = `${location.pathname}${location.search || ''}`;
    if (path === lastRef.current) return;
    lastRef.current = path;
    recordPageView(path);
  }, [location.pathname, location.search]);

  return null;
}
