import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, FolderTree, MessagesSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { adminListCategories, adminListPosts } from '@/lib/blogApi';
import { adminListContactRequests } from '@/lib/contactRequestsApi';

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
  const [postsCount, setPostsCount] = useState(0);
  const [catsCount, setCatsCount] = useState(0);
  const [contactsCount, setContactsCount] = useState(0);
  const [latestPosts, setLatestPosts] = useState([]);

  useEffect(() => {
    if (!token) {
      setPostsCount(0);
      setCatsCount(0);
      setContactsCount(0);
      setLatestPosts([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const [cats, postsRes, contactsRes] = await Promise.all([
          adminListCategories(token),
          adminListPosts(token, 1, 3),
          adminListContactRequests(token, 1, 1),
        ]);
        if (cancelled) return;
        setCatsCount(Array.isArray(cats) ? cats.length : 0);
        setPostsCount(postsRes.meta?.total ?? 0);
        setContactsCount(contactsRes.meta?.total ?? 0);
        setLatestPosts(Array.isArray(postsRes.data) ? postsRes.data.slice(0, 3) : []);
      } catch {
        if (!cancelled) {
          setPostsCount(0);
          setCatsCount(0);
          setContactsCount(0);
          setLatestPosts([]);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  function formatDate(iso) {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleString('pt-PT', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '—';
    }
  }

  return (
    <div className="w-full space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={FileText}
          label="Artigos no blog"
          value={postsCount.toLocaleString('pt-PT')}
          hint={(
            <Link to="/admin/blog/artigos" className="text-royal-blue hover:underline">
              Ver listagem
            </Link>
          )}
        />
        <StatCard
          icon={FolderTree}
          label="Categorias"
          value={catsCount.toLocaleString('pt-PT')}
          hint={(
            <Link to="/admin/blog/categorias" className="text-royal-blue hover:underline">
              Ver categorias
            </Link>
          )}
        />
        <StatCard
          icon={MessagesSquare}
          label="Contatos recebidos"
          value={contactsCount.toLocaleString('pt-PT')}
          hint={(
            <Link to="/admin/contatos" className="text-royal-blue hover:underline">
              Ver contatos
            </Link>
          )}
        />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-deep-navy">Últimos 3 posts</h2>
          <Link to="/admin/blog/artigos" className="text-sm font-medium text-royal-blue hover:underline">
            Ver todos
          </Link>
        </div>
        {latestPosts.length === 0 ? (
          <p className="text-sm text-gray-500">Ainda não há artigos.</p>
        ) : (
          <ul className="space-y-3">
            {latestPosts.map((post) => (
              <li key={post.id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate font-medium text-deep-navy">{post.title}</p>
                  <p className="text-xs text-gray-500">{formatDate(post.created_at)}</p>
                </div>
                <Link to={`/admin/blog/artigos/${post.id}`} className="shrink-0 text-sm text-royal-blue hover:underline">
                  Ver
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
