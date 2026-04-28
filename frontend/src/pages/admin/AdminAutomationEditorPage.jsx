import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Loader2, Plus, RefreshCw, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getPost, updatePost } from '@/lib/postsApi';
import { upsertBlogPostFromAutomation } from '@/lib/syncAutomationBlogPost';
import { AdminAutomationSubnav } from '@/components/admin/AdminAutomationSubnav';
import { slugify } from '@/lib/slugify';
import { parseHtmlToStructuredFields as parseAutomationHtmlFields } from '@/lib/parseAutomationHtml';
import { ArticleBlockEditor } from '@/components/admin/article-editor/ArticleBlockEditor';
import { BlogContent } from '@/components/BlogContent';
import { ensureBlockIds } from '@/lib/articleBlocks';

const STATUS_OPTIONS = ['queue', 'processing', 'ready', 'error', 'published'];
const FORM_MODE_OPTIONS = ['test', 'production'];

function parseHtmlToStructuredFields(html, fallbackTitle = '') {
  const parsed = parseAutomationHtmlFields(html, fallbackTitle);
  return {
    ...parsed,
    blocks: ensureBlockIds(parsed.blocks?.length ? parsed.blocks : [{ type: 'p', text: '' }]),
  };
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildHtmlFromStructuredFields({ title, headText, blocks = [] }) {
  const safeTitle = escapeHtml(title);
  const safeHead = headText.trim() ? `<p>${escapeHtml(headText)}</p>` : '';
  const paragraphs = blocks
    .map((b) => {
      if (b.type === 'h2') return `<h2>${escapeHtml(b.text || '')}</h2>`;
      if (b.type === 'ul') return `<ul>${(b.items || []).map((i) => `<li>${escapeHtml(i || '')}</li>`).join('')}</ul>`;
      if (b.type === 'quote') return `<blockquote>${escapeHtml(b.text || '')}</blockquote>`;
      if (b.type === 'hr') return '<hr />';
      if (b.type === 'image' && b.src) {
        const alt = escapeHtml(b.alt || '');
        const caption = b.caption ? `<figcaption>${escapeHtml(b.caption)}</figcaption>` : '';
        return `<figure><img src="${escapeHtml(b.src)}" alt="${alt}" />${caption}</figure>`;
      }
      return `<p>${escapeHtml(b.text || '')}</p>`;
    })
    .join('');
  return `<article><h1>${safeTitle}</h1>${safeHead}${paragraphs}</article>`;
}

function formatPreviewDate() {
  return new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function normalizeImages(images) {
  if (!Array.isArray(images)) return [];
  return images
    .map((img) => (typeof img?.url === 'string' ? img.url.trim() : ''))
    .filter(Boolean);
}

function buildInitialForm(data) {
  const parsed = parseHtmlToStructuredFields(data?.htmlContent || '', data?.title || '');
  return {
    title: data?.title || '',
    idea: data?.idea || data?.meta || '',
    headText: parsed.headText || '',
    blocks: parsed.blocks,
    status: data?.status || 'queue',
    formMode: data?.formMode || 'test',
    images: normalizeImages(data?.images),
  };
}

export function AdminAutomationEditorPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const { postId } = useParams();
  const [form, setForm] = useState(() => buildInitialForm({}));
  const [initialForm, setInitialForm] = useState(() => buildInitialForm({}));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncingPublic, setSyncingPublic] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!token || !postId) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      setSuccess('');
      try {
        const data = await getPost(token, postId);
        if (cancelled) return;
        const initial = buildInitialForm(data);
        setInitialForm(initial);
        setForm(initial);
      } catch (err) {
        if (cancelled) return;
        if (err?.status === 401) {
          await logout();
          navigate('/admin/login', { replace: true });
          return;
        }
        if (err?.status === 404) {
          setError('Post nao encontrado ou sem permissao para acesso.');
          return;
        }
        setError(err.message || 'Nao foi possivel carregar o detalhe do post.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, postId, navigate, logout]);

  const hasChanges = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(initialForm),
    [form, initialForm],
  );
  const previewBlocks = useMemo(
    () => (Array.isArray(form.blocks) ? form.blocks.map((b) => ({ ...b, id: undefined })) : []),
    [form.blocks],
  );
  const resolvedSlug = useMemo(() => slugify(form.title || ''), [form.title]);
  const initialResolvedSlug = useMemo(() => slugify(initialForm.title || ''), [initialForm.title]);
  const coverDisplay = form.images[0] || '';

  function onChange(field, value) {
    setSuccess('');
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function onChangeImage(idx, value) {
    setSuccess('');
    setForm((prev) => {
      const next = [...prev.images];
      next[idx] = value;
      return { ...prev, images: next };
    });
  }

  function addImage() {
    setSuccess('');
    setForm((prev) => ({ ...prev, images: [...prev.images, ''] }));
  }

  function removeImage(idx) {
    setSuccess('');
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token || !postId) {
      setError('Sessao invalida.');
      return;
    }

    const patch = {};
    if (form.title !== initialForm.title) patch.title = form.title;
    if (resolvedSlug !== initialResolvedSlug) patch.slug = resolvedSlug;
    const currentHtml = buildHtmlFromStructuredFields(form);
    const initialHtml = buildHtmlFromStructuredFields(initialForm);
    if (currentHtml !== initialHtml) patch.htmlContent = currentHtml;
    if (form.status !== initialForm.status) patch.status = form.status;
    if (form.formMode !== initialForm.formMode) patch.formMode = form.formMode;

    const cleanCurrentImages = form.images.map((url) => url.trim()).filter(Boolean);
    const cleanInitialImages = initialForm.images.map((url) => url.trim()).filter(Boolean);
    if (JSON.stringify(cleanCurrentImages) !== JSON.stringify(cleanInitialImages)) {
      patch.images = cleanCurrentImages.map((url) => ({ url }));
    }

    if (Object.keys(patch).length === 0) {
      setSuccess('Nenhuma alteracao para salvar.');
      return;
    }

    setSaving(true);
    try {
      const updated = await updatePost(token, postId, patch);
      const nextInitial = buildInitialForm(updated ?? {
        ...form,
        htmlContent: currentHtml,
        images: cleanCurrentImages.map((url) => ({ url })),
      });
      setInitialForm(nextInitial);
      setForm(nextInitial);
      const shouldSyncBlog =
        updated?.status === 'published' || form.status === 'published' || nextInitial.status === 'published';
      if (shouldSyncBlog) {
        try {
          const forBlog = await getPost(token, postId);
          await upsertBlogPostFromAutomation(token, forBlog);
          setSuccess('Post atualizado e blog público sincronizado.');
        } catch (syncErr) {
          setSuccess('Alterações guardadas na automação.');
          setError(
            syncErr?.message ||
              'Não foi possível atualizar o artigo no blog público.',
          );
        }
      } else {
        setSuccess('Post atualizado com sucesso.');
      }
    } catch (err) {
      if (err?.status === 401) {
        await logout();
        navigate('/admin/login', { replace: true });
        return;
      }
      if (err?.status === 404) {
        setError('Post nao encontrado ou sem permissao para atualizar.');
        return;
      }
      setError(err.message || 'Erro ao salvar alteracoes.');
    } finally {
      setSaving(false);
    }
  }

  async function onSyncPublicBlog() {
    if (!token || !postId || form.status !== 'published') return;
    setError('');
    setSuccess('');
    setSyncingPublic(true);
    try {
      const forBlog = await getPost(token, postId);
      await upsertBlogPostFromAutomation(token, forBlog);
      setSuccess('Artigo sincronizado com o blog público (/blog).');
    } catch (syncErr) {
      setError(syncErr?.message || 'Não foi possível atualizar o blog público.');
    } finally {
      setSyncingPublic(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-500 shadow-sm">
        Carregando detalhes...
      </div>
    );
  }

  return (
    <div className="w-full pb-16">
      <AdminAutomationSubnav />
      <form onSubmit={onSubmit}>
        <div className="sticky top-0 z-30 -mx-4 mb-6 mt-4 border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/80 sm:-mx-6 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" variant="outline" size="sm" className="rounded-lg" asChild>
              <Link to="/admin/blog/automacao/prontos" className="inline-flex items-center gap-2">
                <ArrowLeft className="size-4" />
                Prontos
              </Link>
            </Button>
            <div className="hidden h-6 w-px bg-gray-200 sm:block" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-deep-navy">Editar artigo (automação)</p>
              <p className="truncate text-xs text-gray-500">
                postId: {postId} · /blog/{resolvedSlug || '...'}
              </p>
            </div>
            {form.status === 'published' ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={syncingPublic || saving}
                onClick={onSyncPublicBlog}
                className="rounded-lg shrink-0"
                title="Publica/atualiza este artigo na listagem pública do blog"
              >
                {syncingPublic ? (
                  <Loader2 className="mr-1.5 size-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-1.5 size-4" />
                )}
                Blog público
              </Button>
            ) : null}
            <Button
              type="submit"
              size="sm"
              disabled={saving || !hasChanges}
              className="rounded-lg bg-royal-blue text-white hover:bg-blue-600"
            >
              {saving ? <Loader2 className="mr-1.5 size-4 animate-spin" /> : <Save className="mr-1.5 size-4" />}
              Guardar
            </Button>
          </div>
        </div>

        {error ? (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        ) : null}
        {success ? (
          <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7 xl:col-span-8">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Título</label>
              <input
                value={form.title}
                onChange={(e) => onChange('title', e.target.value)}
                className="mt-2 w-full border-0 border-b-2 border-transparent bg-transparent text-2xl font-bold text-deep-navy outline-none transition-colors placeholder:text-gray-300 focus:border-royal-blue/40 sm:text-3xl"
                placeholder="Título do artigo"
              />
              <p className="mt-3 text-xs text-gray-500">
                Endereço do artigo{' '}
                <code className="rounded-md bg-gray-100 px-1.5 py-0.5 font-mono text-gray-700">
                  /blog/{resolvedSlug || '...'}
                </code>
                {' '}— slug automático (somente leitura).
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Head (abertura)</label>
              <p className="mt-1 text-xs text-gray-400">Resumo inicial do artigo.</p>
              <textarea
                value={form.headText}
                onChange={(e) => onChange('headText', e.target.value)}
                rows={3}
                className="mt-3 w-full resize-y rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm leading-relaxed text-deep-navy outline-none focus:border-royal-blue/40 focus:bg-white focus:ring-2 focus:ring-royal-blue/15"
                placeholder="Introdução do artigo..."
              />
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Corpo do artigo</h2>
                <p className="mt-1 text-xs text-gray-400">
                  Mesmo editor por blocos do artigo manual (parágrafo, título, lista, citação, imagem e separador).
                </p>
              </div>
              <ArticleBlockEditor
                blocks={form.blocks}
                onChange={(next) => onChange('blocks', next)}
              />
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-deep-navy">Pré-visualização do artigo</h2>
              <p className="mt-1 text-xs text-gray-500">Mesma proposta visual de prévia usada no fluxo de artigos.</p>
              <article className="mt-5 overflow-hidden rounded-2xl border border-gray-100 bg-white">
                <div className="relative h-[220px] w-full overflow-hidden sm:h-[280px]">
                  {coverDisplay ? (
                    <img src={coverDisplay} alt={form.title || 'Capa'} className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-deep-navy via-deep-navy to-royal-blue/90" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/90 via-deep-navy/60 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                    <h1 className="max-w-4xl font-heading text-2xl font-bold leading-tight text-white sm:text-3xl">
                      {form.title || 'Título do post'}
                    </h1>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/70">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="size-4" />
                        {formatPreviewDate()}
                      </span>
                      <span className="size-1 rounded-full bg-white/35" />
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="size-4" />
                        Leitura estimada
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-7">
                  {form.headText.trim() ? (
                    <p className="mb-8 border-l-4 border-royal-blue py-1 pl-5 text-lg font-light italic leading-relaxed text-gray-600">
                      {form.headText}
                    </p>
                  ) : null}
                  {previewBlocks.length > 0 ? (
                    <BlogContent blocks={previewBlocks} />
                  ) : (
                    <p className="text-gray-400">(Sem conteúdo principal preenchido.)</p>
                  )}
                </div>
              </article>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-5 xl:col-span-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-deep-navy">Identidade do post</h2>
              <label className="mt-4 block text-xs font-medium text-gray-600">Slug</label>
              <input
                value={resolvedSlug}
                readOnly
                className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 outline-none"
              />
              <label className="mt-4 block text-xs font-medium text-gray-600">Ideia (somente leitura)</label>
              <textarea
                value={form.idea}
                readOnly
                rows={4}
                className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 outline-none"
              />
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-deep-navy">Status e modo</h2>
              <label className="mt-4 block text-xs font-medium text-gray-600">Status</label>
              <select
                value={form.status}
                onChange={(e) => onChange('status', e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-royal-blue/30"
              >
                {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>

              <label className="mt-4 block text-xs font-medium text-gray-600">Modo</label>
              <select
                value={form.formMode}
                onChange={(e) => onChange('formMode', e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-royal-blue/30"
              >
                {FORM_MODE_OPTIONS.map((mode) => <option key={mode} value={mode}>{mode}</option>)}
              </select>
            </div>

            <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-deep-navy">Imagens</h2>
                <Button type="button" size="sm" variant="outline" className="rounded-lg" onClick={addImage}>
                  <Plus className="mr-1 size-4" />
                  URL
                </Button>
              </div>
              {form.images.length === 0 ? (
                <p className="text-xs text-gray-500">Sem imagens. Ao salvar, a lista será substituída.</p>
              ) : (
                form.images.map((url, idx) => (
                  <div key={`${postId}-img-${idx}`} className="flex items-center gap-2">
                    <input
                      value={url}
                      onChange={(e) => onChangeImage(idx, e.target.value)}
                      placeholder="https://site.com/imagem.jpg"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-royal-blue/30"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="rounded-lg"
                      onClick={() => removeImage(idx)}
                      aria-label="Remover imagem"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
