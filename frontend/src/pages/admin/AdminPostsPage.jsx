import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ExternalLink, Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { adminDeletePost, adminListPosts } from '@/lib/blogApi';
import { deletePost as deleteAutomationPost, listPosts as listAutomationPosts } from '@/lib/postsApi';

/** Itens por página na grelha (3×3 em ecrãs largos). */
const PAGE_SIZE = 9;

function normalizeSlug(s) {
  if (typeof s !== 'string' || !s.trim()) return '';
  return s.trim().toLowerCase();
}

/** Slugs dos posts de automação — espelhos Laravel com o mesmo slug são omitidos para não duplicar nem aparecer como manual. */
function automationSlugSet(automationItems) {
  const set = new Set();
  for (const a of automationItems) {
    const n = normalizeSlug(a?.slug);
    if (n) set.add(n);
  }
  return set;
}

function mergeManualAndAutomationLists(manualItems, automationItems, mapManualPostFn, mapAutomationPostFn, detectSourceFn) {
  const slugSet = automationSlugSet(automationItems);
  const filteredManual = manualItems.filter((item) => {
    const n = normalizeSlug(item?.slug);
    if (!n) return true;
    return !slugSet.has(n);
  });

  const mappedManual = filteredManual.map((item) => {
    const source = detectSourceFn(item);
    return source === 'ia' ? mapAutomationPostFn(item) : mapManualPostFn(item);
  });
  const mappedAutomation = automationItems.map(mapAutomationPostFn);

  const mergedMap = new Map();
  [...mappedManual, ...mappedAutomation].forEach((item) => {
    if (!mergedMap.has(item.id)) mergedMap.set(item.id, item);
  });
  return Array.from(mergedMap.values()).sort((a, b) => {
    const da = new Date(a.dateIso || 0).getTime();
    const db = new Date(b.dateIso || 0).getTime();
    return db - da;
  });
}

function formatShortDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function AdminPostsPage() {
  const { token } = useAuth();
  const [allPosts, setAllPosts] = useState([]);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: PAGE_SIZE,
    total: 0,
  });
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  function detectSource(post) {
    if (post?.source === 'ia' || post?.source === 'automation') return 'ia';
    if (post?.isAutomation === true || post?.origin === 'automation') return 'ia';
    if (typeof post?.researchQuery === 'string' && post.researchQuery.trim()) return 'ia';
    return 'manual';
  }

  function mapManualPost(post) {
    return {
      id: `manual:${post.id}`,
      rawId: post.id,
      sourceType: 'manual',
      title: post.title,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      published: Boolean(post.published),
      categoryLabel: post.category ?? '—',
      dateIso: post.publishedAt,
      readTime: post.readTime,
      slug: post.slug,
      previewTo: `/admin/blog/artigos/${post.id}`,
      editTo: `/admin/blog/artigos/${post.id}/editar`,
    };
  }

  function mapAutomationPost(post) {
    const status = post.status || 'queue';
    return {
      id: `ia:${post.id}`,
      rawId: post.id,
      sourceType: 'ia',
      title: post.title || post.researchQuery || 'Sem título',
      excerpt: post.idea || post.researchQuery || 'Conteúdo criado por automação.',
      coverImage: post.images?.[0]?.url || '',
      published: status === 'published',
      categoryLabel: Array.isArray(post.categories) && post.categories.length > 0 ? post.categories[0] : 'Automação',
      dateIso: post.updatedAt || post.createdAt,
      readTime: status,
      slug: post.slug,
      previewTo: `/admin/blog/automacao/${post.id}/preview`,
      editTo: `/admin/blog/automacao/${post.id}`,
    };
  }

  useEffect(() => {
    if (!token) {
      setAllPosts([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const [manualResult, automationResult] = await Promise.allSettled([
          adminListPosts(token, 1, 200),
          listAutomationPosts(token, 1, 200),
        ]);
        if (cancelled) return;
        const manualRes = manualResult.status === 'fulfilled' ? manualResult.value : { data: [] };
        const automationRes = automationResult.status === 'fulfilled' ? automationResult.value : { data: [] };
        const manualItems = Array.isArray(manualRes.data) ? manualRes.data : [];
        const automationItems = Array.isArray(automationRes.data) ? automationRes.data : [];

        const merged = mergeManualAndAutomationLists(
          manualItems,
          automationItems,
          mapManualPost,
          mapAutomationPost,
          detectSource,
        );
        setAllPosts(merged);

        const total = merged.length;
        const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
        const safePage = Math.min(page, lastPage);
        if (page !== safePage) setPage(safePage);
        setMeta({
          current_page: safePage,
          last_page: lastPage,
          per_page: PAGE_SIZE,
          total,
        });

        if (manualResult.status === 'rejected' && automationResult.status === 'rejected') {
          setError('Não foi possível carregar posts manuais nem de automação.');
        } else if (manualResult.status === 'rejected') {
          setError('Não foi possível carregar posts manuais. Exibindo automação.');
        } else if (automationResult.status === 'rejected') {
          setError('Não foi possível carregar posts de automação. Exibindo apenas manuais.');
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message || 'Não foi possível carregar.');
          setAllPosts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token, page]);

  const posts = allPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function onDelete(id, e) {
    e?.preventDefault();
    e?.stopPropagation();
    if (!window.confirm('Eliminar este artigo?')) return;
    if (!token) return;
    setError('');
    try {
      await adminDeletePost(token, id);
      const [manualResult, automationResult] = await Promise.allSettled([
        adminListPosts(token, 1, 200),
        listAutomationPosts(token, 1, 200),
      ]);
      const manualRes = manualResult.status === 'fulfilled' ? manualResult.value : { data: [] };
      const automationRes = automationResult.status === 'fulfilled' ? automationResult.value : { data: [] };
      const manualItems = Array.isArray(manualRes.data) ? manualRes.data : [];
      const automationItems = Array.isArray(automationRes.data) ? automationRes.data : [];
      const merged = mergeManualAndAutomationLists(
        manualItems,
        automationItems,
        mapManualPost,
        mapAutomationPost,
        detectSource,
      );
      setAllPosts(merged);
      const total = merged.length;
      const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
      if (page > lastPage) setPage(lastPage);
      setMeta({
        current_page: Math.min(page, lastPage),
        last_page: lastPage,
        per_page: PAGE_SIZE,
        total,
      });
    } catch (err) {
      setError(err.message || 'Não foi possível eliminar.');
    }
  }

  async function onDeleteAutomation(id, e) {
    e?.preventDefault();
    e?.stopPropagation();
    if (!window.confirm('Eliminar este post de automação?')) return;
    if (!token) return;
    setError('');
    try {
      await deleteAutomationPost(token, id);
      const [manualResult, automationResult] = await Promise.allSettled([
        adminListPosts(token, 1, 200),
        listAutomationPosts(token, 1, 200),
      ]);
      const manualRes = manualResult.status === 'fulfilled' ? manualResult.value : { data: [] };
      const automationRes = automationResult.status === 'fulfilled' ? automationResult.value : { data: [] };
      const manualItems = Array.isArray(manualRes.data) ? manualRes.data : [];
      const automationItems = Array.isArray(automationRes.data) ? automationRes.data : [];
      const merged = mergeManualAndAutomationLists(
        manualItems,
        automationItems,
        mapManualPost,
        mapAutomationPost,
        detectSource,
      );
      setAllPosts(merged);
      const total = merged.length;
      const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
      if (page > lastPage) setPage(lastPage);
      setMeta({
        current_page: Math.min(page, lastPage),
        last_page: lastPage,
        per_page: PAGE_SIZE,
        total,
      });
    } catch (err) {
      setError(err.message || 'Não foi possível eliminar post de automação.');
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
                to={p.previewTo}
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
                    {p.categoryLabel ?? '—'}
                  </span>
                  <span className="absolute bottom-3 right-3 rounded-full bg-black/65 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow">
                    {p.sourceType === 'ia' ? 'ia' : 'manual'}
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
                      {formatShortDate(p.dateIso)}
                    </span>
                    <span>{p.readTime}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-royal-blue">
                      <Eye className="size-3.5" />
                      Ver pré-visualização
                    </span>
                    <span className="ml-auto flex items-center gap-1">
                      {p.published && p.slug ? (
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
                        to={p.editTo}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-royal-blue/10 hover:text-royal-blue"
                        title="Editar"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Pencil className="size-4" />
                      </Link>
                      {p.sourceType === 'manual' ? (
                        <button
                          type="button"
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Eliminar"
                          onClick={(e) => onDelete(p.rawId, e)}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Eliminar post IA"
                          onClick={(e) => onDeleteAutomation(p.rawId, e)}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      )}
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
                Página {meta.current_page} de {meta.last_page} · {meta.total} artigo{meta.total !== 1 ? 's' : ''} · {meta.per_page ?? PAGE_SIZE} por página
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
