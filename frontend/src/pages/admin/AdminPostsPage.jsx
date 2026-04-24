import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ExternalLink, Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { adminDeletePost, adminListPosts } from '@/lib/blogApi';

/** Itens por página na grelha (3×3 em ecrãs largos). */
const PAGE_SIZE = 9;

function formatShortDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function AdminPostsPage() {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: PAGE_SIZE,
    total: 0,
  });
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setPosts([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await adminListPosts(token, page, PAGE_SIZE);
        if (cancelled) return;
        setPosts(res.data ?? []);
        if (res.meta) {
          setMeta({
            current_page: res.meta.current_page ?? 1,
            last_page: res.meta.last_page ?? 1,
            per_page: res.meta.per_page ?? PAGE_SIZE,
            total: res.meta.total ?? 0,
          });
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message || 'Não foi possível carregar.');
          setPosts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token, page]);

  async function onDelete(id, e) {
    e?.preventDefault();
    e?.stopPropagation();
    if (!window.confirm('Eliminar este artigo?')) return;
    if (!token) return;
    setError('');
    try {
      await adminDeletePost(token, id);
      const res = await adminListPosts(token, page, PAGE_SIZE);
      setPosts(res.data ?? []);
      if (res.meta) {
        setMeta({
          current_page: res.meta.current_page ?? 1,
          last_page: res.meta.last_page ?? 1,
          per_page: res.meta.per_page ?? PAGE_SIZE,
          total: res.meta.total ?? 0,
        });
        if (page > 1 && (res.data?.length ?? 0) === 0) {
          setPage((p) => Math.max(1, p - 1));
        }
      }
    } catch (err) {
      setError(err.message || 'Não foi possível eliminar.');
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          Clique num cartão para ver a pré-visualização como no site. Editar abre o mesmo editor da criação.
        </p>
        <Button asChild className="rounded-lg bg-royal-blue text-white hover:bg-blue-600">
          <Link to="/admin/blog/artigos/novo" className="inline-flex items-center gap-2">
            <Plus className="size-4" />
            Novo artigo
          </Link>
        </Button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-500 shadow-sm">
          A carregar…
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center text-gray-500 shadow-sm">
          <p className="font-medium text-deep-navy">Nenhum artigo</p>
          <p className="mt-1 text-sm">Corra o seed ou crie o primeiro artigo.</p>
          <Button asChild className="mt-6 rounded-lg bg-royal-blue text-white hover:bg-blue-600">
            <Link to="/admin/blog/artigos/novo">Novo artigo</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {posts.map((p) => (
              <Link
                key={p.id}
                to={`/admin/blog/artigos/${p.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:border-royal-blue/25 hover:shadow-lg hover:shadow-royal-blue/5"
              >
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  <img
                    src={p.coverImage || 'https://placehold.co/800x450/e2e8f0/64748b?text=Emplyon'}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-80" />
                  <span
                    className={
                      p.published
                        ? 'absolute right-3 top-3 rounded-full bg-emerald-500/95 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow'
                        : 'absolute right-3 top-3 rounded-full bg-gray-800/85 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow'
                    }
                  >
                    {p.published ? 'Publicado' : 'Rascunho'}
                  </span>
                  <span className="absolute bottom-3 left-3 rounded-full bg-coral-prime px-2.5 py-0.5 text-xs font-bold text-white shadow">
                    {p.category ?? '—'}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h2 className="line-clamp-2 font-heading text-base font-bold leading-snug text-deep-navy group-hover:text-royal-blue">
                    {p.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm text-gray-600">{p.excerpt}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="size-3.5 shrink-0" />
                      {formatShortDate(p.publishedAt)}
                    </span>
                    <span>{p.readTime}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-royal-blue">
                      <Eye className="size-3.5" />
                      Ver pré-visualização
                    </span>
                    <span className="ml-auto flex items-center gap-1">
                      {p.published ? (
                        <a
                          href={`/blog/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-deep-navy"
                          title="Abrir no site"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="size-4" />
                        </a>
                      ) : null}
                      <Link
                        to={`/admin/blog/artigos/${p.id}/editar`}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-royal-blue/10 hover:text-royal-blue"
                        title="Editar"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Pencil className="size-4" />
                      </Link>
                      <button
                        type="button"
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        title="Eliminar"
                        onClick={(e) => onDelete(p.id, e)}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {meta.last_page > 1 ? (
            <nav
              className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm text-gray-600 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              aria-label="Paginação de artigos"
            >
              <span className="text-center sm:text-left">
                Página {meta.current_page} de {meta.last_page} · {meta.total} artigo{meta.total !== 1 ? 's' : ''} · {PAGE_SIZE} por página
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  disabled={meta.current_page <= 1}
                  onClick={() => {
                    setPage((x) => Math.max(1, x - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Anterior
                </Button>
                <div className="hidden items-center gap-1 sm:flex">
                  {meta.last_page <= 15
                    ? Array.from({ length: meta.last_page }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => {
                          setPage(n);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={
                          n === meta.current_page
                            ? 'size-9 rounded-lg bg-royal-blue text-sm font-medium text-white shadow-md shadow-royal-blue/25'
                            : 'size-9 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 transition-colors hover:border-royal-blue hover:text-royal-blue'
                        }
                        aria-current={n === meta.current_page ? 'page' : undefined}
                      >
                        {n}
                      </button>
                    ))
                    : (
                      <span className="px-2 text-xs font-medium tabular-nums text-gray-500">
                        {meta.current_page} / {meta.last_page}
                      </span>
                    )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  disabled={meta.current_page >= meta.last_page}
                  onClick={() => {
                    setPage((x) => x + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Seguinte
                </Button>
              </div>
            </nav>
          ) : null}
        </>
      )}
    </div>
  );
}
