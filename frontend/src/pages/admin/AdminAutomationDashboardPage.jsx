import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock3, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { listPosts } from '@/lib/postsApi';
import { AdminAutomationSubnav } from '@/components/admin/AdminAutomationSubnav';

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-deep-navy">{value}</p>
        </div>
        <div className="flex size-11 items-center justify-center rounded-xl bg-royal-blue/10 text-royal-blue">
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}

export function AdminAutomationDashboardPage() {
  const { token } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const response = await listPosts(token, 1, 200);
        if (!cancelled) setRows(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Nao foi possivel carregar os indicadores.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  const counters = useMemo(() => {
    const tally = { queue: 0, ready: 0, published: 0, error: 0 };
    rows.forEach((item) => {
      if (item.status in tally) tally[item.status] += 1;
    });
    return tally;
  }, [rows]);

  return (
    <div className="w-full space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-deep-navy">Automacao de posts</h1>
        <p className="text-sm text-gray-500">Dashboard de acompanhamento das acoes do fluxo IA.</p>
      </div>

      <AdminAutomationSubnav />

      {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Na Fila" value={loading ? '...' : counters.queue} icon={Clock3} />
        <StatCard title="Prontos" value={loading ? '...' : counters.ready} icon={CheckCircle2} />
        <StatCard title="Publicados" value={loading ? '...' : counters.published} icon={Upload} />
        <StatCard title="Erros" value={loading ? '...' : counters.error} icon={AlertTriangle} />
      </div>
    </div>
  );
}
