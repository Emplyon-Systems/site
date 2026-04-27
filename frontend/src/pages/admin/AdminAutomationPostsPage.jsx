import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Eye, Loader2, Pencil, Plus, Search, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getPost, listPosts, updatePost } from '@/lib/postsApi';
import { upsertBlogPostFromAutomation } from '@/lib/syncAutomationBlogPost';
import { AdminAutomationSubnav } from '@/components/admin/AdminAutomationSubnav';

const PAGE_SIZE = 15;
const STATUS_OPTIONS = ['all', 'queue', 'processing', 'ready', 'error', 'published'];

function formatDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function AdminAutomationPostsPage({
  fixedStatus = null,
  title = 'Blog / Automacao',
  description = 'Fila de posts gerados por IA e status de processamento.',
  cardView = false,
}) {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: PAGE_SIZE,
  });
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [publishingIds, setPublishingIds] = useState([]);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const response = await listPosts(token, page, PAGE_SIZE);
        if (cancelled) return;
        setRows(Array.isArray(response.data) ? response.data : []);
        setMeta({
          current_page: response.meta?.current_page ?? 1,
          last_page: response.meta?.last_page ?? 1,
          total: response.meta?.total ?? 0,
          per_page: response.meta?.per_page ?? PAGE_SIZE,
        });
      } catch (err) {
        if (cancelled) return;
        if (err?.status === 401) {
          await logout();
          navigate('/admin/login', { replace: true });
          return;
        }
        setError(err.message || 'Nao foi possivel carregar os posts.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, page, navigate, logout]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((item) => {
      const effectiveStatus = fixedStatus || statusFilter;
      const matchesStatus = effectiveStatus === 'all' || item.status === effectiveStatus;
      if (!matchesStatus) return false;
      if (!q) return true;
      const title = (item.title || '').toLowerCase();
      const query = (item.researchQuery || '').toLowerCase();
      return title.includes(q) || query.includes(q);
    });
  }, [rows, search, statusFilter]);

  const totalLabel = fixedStatus === 'ready' ? 'post(s) pronto(s)' : 'registro(s)';

  function isPublishing(id) {
    return publishingIds.includes(String(id));
  }

  async function onPublish(postId, e) {
    e?.preventDefault();
    e?.stopPropagation();
    if (!token) return;
    setError('');
    setPublishingIds((prev) => [...prev, String(postId)]);
    try {
      await updatePost(token, postId, { status: 'published' });
      const fresh = await getPost(token, postId);
      await upsertBlogPostFromAutomation(token, fresh);
      const response = await listPosts(token, page, PAGE_SIZE);
      setRows(Array.isArray(response.data) ? response.data : []);
      setMeta({
        current_page: response.meta?.current_page ?? 1,
        last_page: response.meta?.last_page ?? 1,
        total: response.meta?.total ?? 0,
        per_page: response.meta?.per_page ?? PAGE_SIZE,
      });
    } catch (err) {
      if (err?.status === 401) {
        await logout();
        navigate('/admin/login', { replace: true });
        return;
      }
      setError(
        err.message ||
          'Não foi possível publicar ou sincronizar com o blog. O post pode estar publicado na automação, mas ainda não no site.',
      );
    } finally {
      setPublishingIds((prev) => prev.filter((id) => id !== String(postId)));
    }
  }

  return (
    <div className="w-full space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-deep-navy">{title}</h1>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <Button asChild className="rounded-lg bg-royal-blue text-white hover:bg-blue-600">
          <Link to="/admin/blog/automacao/criar" className="inline-flex items-center gap-2">
            <Plus className="size-4" />
            Nova solicitacao
          </Link>
        </Button>
      </div>

      <AdminAutomationSubnav />

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="relative md:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por titulo ou tema de pesquisa"
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-royal-blue/30"
            />
          </div>
          {fixedStatus ? (
            <div className="flex h-full items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600">
              Filtro fixo: <span className="ml-1 font-semibold text-deep-navy">{fixedStatus}</span>
            </div>
          ) : (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-royal-blue/30"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status === 'all' ? 'Todos os status' : status}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      {cardView ? (
        loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-500 shadow-sm">
            Carregando...
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-500 shadow-sm">
            Nenhum post encontrado com os filtros atuais.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredRows.map((item) => (
              <Link
                key={item.id}
                to={`/admin/blog/automacao/${item.id}/preview`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:border-royal-blue/25 hover:shadow-lg hover:shadow-royal-blue/5"
              >
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  <img
                    src={item.images?.[0]?.url || 'https://placehold.co/800x450/e2e8f0/64748b?text=Emplyon'}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-80" />
                  <span className="absolute right-3 top-3 rounded-full bg-emerald-500/95 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow">
                    Pronto
                  </span>
                  <span className="absolute bottom-3 left-3 rounded-full bg-coral-prime px-2.5 py-0.5 text-xs font-bold text-white shadow">
                    Automacao
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h2 className="line-clamp-2 font-heading text-base font-bold leading-snug text-deep-navy group-hover:text-royal-blue">
                    {item.title || item.researchQuery || 'Sem titulo'}
                  </h2>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm text-gray-600">{item.idea || item.researchQuery || '—'}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="size-3.5 shrink-0" />
                      {formatDateTime(item.updatedAt)}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-royal-blue">
                      <Eye className="size-3.5" />
                      Ver pré-visualização
                    </span>
                    <span className="ml-auto flex items-center gap-1">
                      {fixedStatus === 'ready' ? (
                        <button
                          type="button"
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-50"
                          title="Publicar no blog"
                          disabled={isPublishing(item.id)}
                          onClick={(e) => onPublish(item.id, e)}
                        >
                          {isPublishing(item.id) ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Upload className="size-4" />
                          )}
                        </button>
                      ) : null}
                      <Link
                        to={`/admin/blog/automacao/${item.id}/preview`}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-deep-navy"
                        title="Pré-visualização"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Eye className="size-4" />
                      </Link>
                      <Link
                        to={`/admin/blog/automacao/${item.id}`}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-royal-blue/10 hover:text-royal-blue"
                        title="Editar"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Pencil className="size-4" />
                      </Link>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3">Titulo/Tema</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Atualizado</th>
                <th className="px-4 py-3">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">Carregando...</td>
                </tr>
              ) : filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    Nenhum post encontrado com os filtros atuais.
                  </td>
                </tr>
              ) : (
                filteredRows.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-deep-navy">{item.title || item.researchQuery || 'Sem titulo'}</p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">{item.researchQuery || '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                        {item.status || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{formatDateTime(item.updatedAt)}</td>
                    <td className="px-4 py-3">
                      <Button asChild size="sm" variant="outline" className="rounded-lg">
                        <Link to={`/admin/blog/automacao/${item.id}`} className="inline-flex items-center gap-2">
                          <Eye className="size-4" />
                          Ver / editar
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
        <span>
          Pagina {meta.current_page} de {meta.last_page} · {meta.total} {totalLabel}
        </span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-lg"
            disabled={meta.current_page <= 1 || loading}
            onClick={() => setPage((x) => Math.max(1, x - 1))}
          >
            Anterior
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-lg"
            disabled={meta.current_page >= meta.last_page || loading}
            onClick={() => setPage((x) => x + 1)}
          >
            Proxima
          </Button>
        </div>
      </div>
    </div>
  );
}
