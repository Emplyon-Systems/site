import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, CalendarDays, FileText, FolderTree, TrendingUp } from 'lucide-react';
import { getAnalyticsSummary } from '@/lib/localAnalytics';
import { useAuth } from '@/contexts/AuthContext';
import { adminListCategories, adminListPosts } from '@/lib/blogApi';

function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-deep-navy">{value}</p>
          {hint ? <div className="mt-1 text-xs text-gray-400">{hint}</div> : null}
        </div>
        <div className="flex size-11 items-center justify-center rounded-xl bg-royal-blue/10 text-royal-blue">
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}

export function AdminDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState(() => getAnalyticsSummary());
  const [postsCount, setPostsCount] = useState(0);
  const [catsCount, setCatsCount] = useState(0);

  useEffect(() => {
    function refreshAnalytics() {
      setStats(getAnalyticsSummary());
    }
    refreshAnalytics();
    window.addEventListener('emplyon-analytics', refreshAnalytics);
    return () => window.removeEventListener('emplyon-analytics', refreshAnalytics);
  }, []);

  useEffect(() => {
    if (!token) {
      setPostsCount(0);
      setCatsCount(0);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const [cats, postsRes] = await Promise.all([
          adminListCategories(token),
          adminListPosts(token, 1, 1),
        ]);
        if (cancelled) return;
        setCatsCount(Array.isArray(cats) ? cats.length : 0);
        setPostsCount(postsRes.meta?.total ?? 0);
      } catch {
        if (!cancelled) {
          setPostsCount(0);
          setCatsCount(0);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  const weekTotal = stats.last7Days.reduce((a, d) => a + d.count, 0);
  const maxBar = Math.max(...stats.last7Days.map((d) => d.count), 1);

  return (
    <div className="w-full space-y-8">
      <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-sm text-amber-900">
        <strong className="font-semibold">Nota:</strong>
        {' '}
        as visualizações abaixo são estimativas neste navegador. Os totais de artigos e categorias atualizam quando inicia sessão.
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Eye}
          label="Visualizações (total)"
          value={stats.totalPageviews.toLocaleString('pt-PT')}
          hint="Desde a primeira visita neste navegador"
        />
        <StatCard
          icon={CalendarDays}
          label="Hoje"
          value={stats.todayPageviews.toLocaleString('pt-PT')}
          hint="Páginas vistas neste dispositivo"
        />
        <StatCard
          icon={FileText}
          label="Artigos no blog"
          value={postsCount.toLocaleString('pt-PT')}
          hint={(
            <Link to="/admin/blog/artigos" className="text-royal-blue hover:underline">
              Gerir artigos
            </Link>
          )}
        />
        <StatCard
          icon={FolderTree}
          label="Categorias"
          value={catsCount.toLocaleString('pt-PT')}
          hint={(
            <Link to="/admin/blog/categorias" className="text-royal-blue hover:underline">
              Gerir categorias
            </Link>
          )}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="size-5 text-royal-blue" />
            <h2 className="text-base font-semibold text-deep-navy">Últimos 7 dias</h2>
            <span className="ml-auto text-sm text-gray-500">{weekTotal} vistas</span>
          </div>
          <div className="flex h-40 items-end gap-2">
            {stats.last7Days.map((d) => {
              const h = Math.round((d.count / maxBar) * 100);
              const dayLabel = d.date.slice(8, 10);
              return (
                <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full max-w-8 rounded-t-md bg-royal-blue/85 transition-all"
                    style={{ height: `${Math.max(h, 4)}%` }}
                    title={`${d.date}: ${d.count}`}
                  />
                  <span className="text-[10px] text-gray-400">{dayLabel}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-deep-navy">Páginas mais vistas neste navegador</h2>
          {stats.topPaths.length === 0 ? (
            <p className="text-sm text-gray-500">Ainda não há dados. Navegue pelo site para ver estatísticas.</p>
          ) : (
            <ul className="space-y-3">
              {stats.topPaths.map((row) => (
                <li key={row.path} className="flex items-center justify-between gap-3 text-sm">
                  <code className="truncate rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">{row.path}</code>
                  <span className="shrink-0 font-semibold tabular-nums text-deep-navy">{row.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
