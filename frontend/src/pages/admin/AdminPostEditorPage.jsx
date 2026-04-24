import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CalendarClock,
  Clock,
  Eye,
  ImagePlus,
  Link2,
  Monitor,
  Save,
  Sparkles,
  X,
} from 'lucide-react';
import { ArticleBlockEditor } from '@/components/admin/article-editor/ArticleBlockEditor';
import { BlogContent } from '@/components/BlogContent';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  adminGetPost,
  adminListCategories,
  adminSavePost,
  adminUploadBlogImage,
  buildPostFormData,
} from '@/lib/blogApi';
import {
  ensureBlockIds,
  newBlock,
  suggestReadMinutes,
} from '@/lib/articleBlocks';
import { slugify } from '@/lib/slugify';

function stripBlockId(block) {
  const copy = { ...block };
  delete copy.id;
  return copy;
}

function parseBlocksFromPost(content) {
  return ensureBlockIds(Array.isArray(content) ? content : [newBlock('p')]);
}

function categoryNameFromList(list, cid) {
  if (cid == null || cid === '') return '—';
  const c = list.find((x) => String(x.id) === String(cid));
  return c?.name ?? '—';
}

const PREVIEW_CAT_CLASS = 'bg-coral-prime text-white';

function formatPreviewDate() {
  return new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function AdminPostEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const { token } = useAuth();
  const coverFileRef = useRef(null);
  const dropRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [author, setAuthor] = useState('Equipe Emplyon');
  const [readTime, setReadTime] = useState('5 min');
  const [readTimeManual, setReadTimeManual] = useState(false);
  const [coverImage, setCoverImage] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [coverBlobUrl, setCoverBlobUrl] = useState(null);
  const [removeCover, setRemoveCover] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [blocks, setBlocks] = useState(() => ensureBlockIds([{ type: 'p', text: '' }]));
  const [published, setPublished] = useState(false);
  const [error, setError] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!coverFile) {
      setCoverBlobUrl(null);
      return;
    }
    const u = URL.createObjectURL(coverFile);
    setCoverBlobUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [coverFile]);

  useEffect(() => {
    if (!token) {
      setPageLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setPageLoading(true);
      setError('');
      try {
        const cats = await adminListCategories(token);
        if (cancelled) return;
        setCategories(cats);
        if (isNew) {
          setCategoryId((prev) => (prev || (cats[0]?.id != null ? String(cats[0].id) : '')));
          setPageLoading(false);
          return;
        }
        const post = await adminGetPost(token, id);
        if (cancelled) return;
        /* eslint-disable react-hooks/set-state-in-effect */
        setTitle(post.title);
        setExcerpt(post.excerpt);
        setAuthor(post.author);
        setReadTime(post.readTime);
        setReadTimeManual(true);
        setCoverImage(post.coverImage || '');
        setCoverFile(null);
        setRemoveCover(false);
        setCategoryId(post.categoryId != null ? String(post.categoryId) : (cats[0]?.id != null ? String(cats[0].id) : ''));
        setBlocks(parseBlocksFromPost(post.content));
        setPublished(Boolean(post.published));
        /* eslint-enable react-hooks/set-state-in-effect */
      } catch {
        if (!cancelled) navigate('/admin/blog/artigos', { replace: true });
      } finally {
        if (!cancelled) setPageLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, id, isNew, navigate]);

  useEffect(() => {
    if (!previewOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKey(e) {
      if (e.key === 'Escape') setPreviewOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [previewOpen]);

  const suggestedMin = useMemo(
    () => suggestReadMinutes(blocks, excerpt),
    [blocks, excerpt],
  );

  const resolvedSlug = useMemo(() => slugify(title), [title]);
  const resolvedReadTime = readTimeManual ? readTime : `${suggestedMin} min`;

  function applySuggestedReadTime() {
    setReadTimeManual(false);
  }

  function onCoverPicked(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Use uma imagem (JPEG, PNG, WebP, etc.).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Ficheiro demasiado grande (máx. 5 MB).');
      return;
    }
    setError('');
    setCoverFile(file);
    setCoverImage('');
    setRemoveCover(false);
  }

  function onCoverInputChange(e) {
    const f = e.target.files?.[0];
    onCoverPicked(f);
    e.target.value = '';
  }

  function clearCover() {
    setCoverImage('');
    setCoverFile(null);
    setRemoveCover(true);
    if (coverFileRef.current) coverFileRef.current.value = '';
  }

  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;
    function prevent(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    function onDragOver(e) {
      prevent(e);
      setDragOver(true);
    }
    function onDragLeave(e) {
      prevent(e);
      setDragOver(false);
    }
    function onDrop(e) {
      prevent(e);
      setDragOver(false);
      const f = e.dataTransfer?.files?.[0];
      onCoverPicked(f);
    }
    el.addEventListener('dragover', onDragOver);
    el.addEventListener('dragleave', onDragLeave);
    el.addEventListener('drop', onDrop);
    return () => {
      el.removeEventListener('dragover', onDragOver);
      el.removeEventListener('dragleave', onDragLeave);
      el.removeEventListener('drop', onDrop);
    };
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    if (!token) {
      setError('Sessão inválida.');
      return;
    }
    let file = coverFile;
    if (!file && coverImage?.startsWith('data:')) {
      try {
        const res = await fetch(coverImage);
        const blob = await res.blob();
        file = new File([blob], 'cover.jpg', { type: blob.type || 'image/jpeg' });
      } catch {
        setError('Não foi possível processar a imagem de capa.');
        return;
      }
    }
    let external = null;
    if (!file && coverImage && /^https?:\/\//i.test(coverImage)) {
      try {
        const u = new URL(coverImage);
        // Não tratar ficheiros em /storage/ como URL externa (evita apagar o path no servidor).
        if (!u.pathname.startsWith('/storage/')) {
          external = coverImage;
        }
      } catch {
        external = coverImage;
      }
    }
    const fd = buildPostFormData({
      title,
      excerpt,
      author,
      readTime: resolvedReadTime,
      blogCategoryId: categoryId || null,
      published,
      contentArray: blocks.map(stripBlockId),
      coverFile: file,
      coverImageExternal: external,
      removeCover: !isNew && removeCover,
    });
    try {
      await adminSavePost(token, fd, isNew ? null : id);
      navigate('/admin/blog/artigos');
    } catch (err) {
      setError(err.message || 'Erro ao guardar.');
    }
  }

  const previewBlocks = useMemo(
    () => blocks.map(stripBlockId),
    [blocks],
  );

  const hasCategories = categories.length > 0;
  const coverDisplay = coverBlobUrl || coverImage;
  const previewCategoryLabel = categoryNameFromList(categories, categoryId);
  const previewCategoryDisplay =
    previewCategoryLabel === '—' ? 'Sem categoria' : previewCategoryLabel;

  const uploadBodyImage = token
    ? (f) => adminUploadBlogImage(token, f)
    : undefined;

  if (pageLoading) {
    return (
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
        A carregar…
      </div>
    );
  }

  return (
    <div className="w-full pb-16">
      <form onSubmit={onSubmit}>
        {/* Barra fixa */}
        <div className="sticky top-0 z-30 -mx-4 mb-6 border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/80 sm:-mx-6 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" variant="outline" size="sm" className="rounded-lg" asChild>
              <Link to="/admin/blog/artigos" className="inline-flex items-center gap-2">
                <ArrowLeft className="size-4" />
                Artigos
              </Link>
            </Button>
            <div className="hidden h-6 w-px bg-gray-200 sm:block" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-deep-navy">
                {isNew ? 'Novo artigo' : 'Editar artigo'}
              </p>
              <p className="truncate text-xs text-gray-500">
                {published ? 'Publicado no site' : 'Rascunho'}
                {resolvedSlug ? ` · /blog/${resolvedSlug}` : ''}
              </p>
            </div>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-deep-navy shadow-sm">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="size-3.5 rounded border-gray-300 text-royal-blue focus:ring-royal-blue"
              />
              Publicado
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-lg"
              onClick={() => setPreviewOpen(true)}
              title="Pré-visualizar como no site"
            >
              <Monitor className="mr-1.5 size-4" />
              Pré-visualizar
            </Button>
            <Button
              type="submit"
              size="sm"
              className="rounded-lg bg-royal-blue text-white hover:bg-blue-600"
            >
              <Save className="mr-1.5 size-4" />
              Guardar
            </Button>
          </div>
        </div>

        {error ? (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Coluna principal — conteúdo */}
          <div className="space-y-6 lg:col-span-7 xl:col-span-8">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Título</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2 w-full border-0 border-b-2 border-transparent bg-transparent text-2xl font-bold text-deep-navy outline-none transition-colors placeholder:text-gray-300 focus:border-royal-blue/40 sm:text-3xl"
                placeholder="Título forte e claro"
                required
              />
              <p className="mt-3 text-xs text-gray-500">
                Endereço do artigo{' '}
                <code className="rounded-md bg-gray-100 px-1.5 py-0.5 font-mono text-gray-700">
                  /blog/{resolvedSlug || '…'}
                </code>
                {' '}— gerada automaticamente a partir do título.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Resumo</label>
              <p className="mt-1 text-xs text-gray-400">Aparece em listagens, SEO e partilhas sociais.</p>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={4}
                className="mt-3 w-full resize-y rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm leading-relaxed text-deep-navy outline-none focus:border-royal-blue/40 focus:bg-white focus:ring-2 focus:ring-royal-blue/15"
                placeholder="Duas ou três frases que descrevem o artigo."
                required
              />
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Corpo do artigo</h2>
                  <p className="mt-1 text-xs text-gray-400">
                    Parágrafos, títulos, listas, citações, imagens (ficheiro ou URL) e separadores.
                  </p>
                </div>
              </div>
              <ArticleBlockEditor
                blocks={blocks}
                onChange={setBlocks}
                uploadImageFile={uploadBodyImage}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-5 xl:col-span-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-deep-navy">
                <ImagePlus className="size-4 text-royal-blue" />
                Imagem de capa
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Envie um ficheiro ou indique o endereço da imagem (https).
              </p>

              <div
                ref={dropRef}
                className={`mt-4 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
                  dragOver ? 'border-royal-blue bg-royal-blue/5' : 'border-gray-200 bg-gray-50/50'
                }`}
              >
                {coverDisplay ? (
                  <div className="relative mx-auto max-w-sm">
                    <img src={coverDisplay} alt="" className="max-h-48 w-full rounded-lg object-cover shadow-md" />
                    <button
                      type="button"
                      onClick={clearCover}
                      className="absolute right-2 top-2 rounded-lg bg-white/90 p-1.5 text-gray-700 shadow hover:bg-white"
                      aria-label="Remover imagem"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-medium text-gray-600">Arraste uma imagem ou clique para escolher</p>
                    <p className="mt-1 text-xs text-gray-400">PNG, JPG ou WebP · até 5 MB</p>
                  </>
                )}
                <input
                  ref={coverFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onCoverInputChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 rounded-lg"
                  onClick={() => coverFileRef.current?.click()}
                >
                  Escolher ficheiro
                </Button>
              </div>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-400">ou URL (avançado)</span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="relative min-w-0 flex-1">
                  <Link2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                  <input
                    value={(coverFile || coverImage.startsWith('data:')) ? '' : coverImage}
                    onChange={(e) => {
                      setCoverFile(null);
                      setRemoveCover(false);
                      setCoverImage(e.target.value);
                    }}
                    className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-royal-blue/30"
                    placeholder="https://…"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-deep-navy">Organização</h2>
              {!hasCategories ? (
                <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
                  Crie primeiro uma categoria em{' '}
                  <Link to="/admin/blog/categorias" className="font-semibold text-royal-blue underline">
                    Categorias do blog
                  </Link>
                  .
                </p>
              ) : null}
              <label className="mt-4 block text-xs font-medium text-gray-600">Categoria</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-royal-blue/30"
                disabled={!hasCategories}
              >
                <option value="">— Sem categoria —</option>
                {categories.map((c) => (
                  <option key={c.id} value={String(c.id)}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-deep-navy">Autor e leitura</h2>
              <label className="mt-4 block text-xs font-medium text-gray-600">Autor</label>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-royal-blue/30"
              />

              <div className="mt-4 flex flex-wrap items-end gap-3">
                <div className="min-w-[8rem] flex-1">
                  <label className="block text-xs font-medium text-gray-600">Tempo de leitura</label>
                  <input
                    value={resolvedReadTime}
                    onChange={(e) => {
                      setReadTimeManual(true);
                      setReadTime(e.target.value);
                    }}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-royal-blue/30"
                    placeholder="5 min"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg shrink-0"
                  onClick={applySuggestedReadTime}
                >
                  <Sparkles className="mr-1 size-3.5" />
                  Sugerir ({suggestedMin} min)
                </Button>
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                <CalendarClock className="size-3.5 shrink-0" />
                Estimativa ~200 palavras/min. a partir do resumo e dos blocos.
              </p>
            </div>

            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-4 text-center">
              <Eye className="mx-auto size-8 text-gray-300" aria-hidden />
              <p className="mt-2 text-xs text-gray-500">
                Veja o artigo como no site — botão <strong className="text-deep-navy">Pré-visualizar</strong> na barra acima.
              </p>
            </div>
          </div>
        </div>
      </form>

      {previewOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="post-preview-title"
        >
          <button
            type="button"
            className="fixed inset-0 cursor-default"
            aria-label="Fechar pré-visualização"
            onClick={() => setPreviewOpen(false)}
          />
          <div className="relative z-10 my-2 w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
            <div className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-gray-100 bg-white/95 px-4 py-3 backdrop-blur sm:px-5">
              <p id="post-preview-title" className="text-sm font-semibold text-deep-navy">
                Pré-visualização do artigo
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-lg"
                onClick={() => setPreviewOpen(false)}
              >
                <X className="mr-1 size-4" />
                Fechar
              </Button>
            </div>

            <div className="max-h-[min(85vh,1100px)] overflow-y-auto">
              <div className="min-h-screen bg-white font-sans text-deep-navy">
                {/* Hero — mesmo raciocínio que BlogPostPage */}
                <div className="relative h-[240px] min-h-[220px] w-full overflow-hidden sm:h-[300px] md:h-[340px]">
                  {coverDisplay ? (
                    <img
                      src={coverDisplay}
                      alt={title || 'Capa do artigo'}
                      className="absolute inset-0 h-full w-full scale-105 object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-deep-navy via-deep-navy to-royal-blue/90" />
                  )}
                  <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white via-white/50 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-deep-navy/95 via-deep-navy/70 to-transparent" />

                  <div className="absolute inset-0 flex flex-col justify-end px-4 pb-8 sm:px-8 sm:pb-10 md:px-12">
                    <div className="mx-auto w-full max-w-5xl">
                      <span className="pointer-events-none inline-flex items-center gap-1.5 text-sm text-white/70">
                        <ArrowLeft className="size-4" />
                        Todos os artigos
                      </span>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${PREVIEW_CAT_CLASS}`}
                        >
                          {previewCategoryDisplay}
                        </span>
                      </div>

                      <h1 className="mt-4 max-w-4xl font-heading text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
                        {title || 'Título do artigo'}
                      </h1>

                      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/65">
                        <span className="font-semibold text-white/90">{author || 'Autor'}</span>
                        <span className="size-1 rounded-full bg-white/35" />
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="size-4" />
                          {formatPreviewDate()}
                        </span>
                        <span className="size-1 rounded-full bg-white/35" />
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="size-4" />
                          {resolvedReadTime} de leitura
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8 md:py-14 lg:px-12">
                  <div className="flex flex-col items-start gap-12 lg:flex-row xl:gap-16">
                    <article className="min-w-0 flex-1">
                      {excerpt ? (
                        <p className="mb-10 border-l-4 border-royal-blue py-1 pl-6 text-lg font-light italic leading-relaxed text-gray-600 md:text-xl">
                          {excerpt}
                        </p>
                      ) : (
                        <p className="mb-10 border-l-4 border-gray-200 py-1 pl-6 text-sm italic text-gray-400">
                          (Sem resumo — no site o lead aparece aqui.)
                        </p>
                      )}

                      <BlogContent blocks={previewBlocks} />

                      <div className="relative mt-14 overflow-hidden rounded-3xl bg-deep-navy p-8 text-center md:p-10">
                        <div className="pointer-events-none absolute -right-12 -top-12 size-52 rounded-full bg-royal-blue/20 blur-3xl" />
                        <p className="relative mb-2 text-xs font-bold uppercase tracking-widest text-white/50">
                          Pré-visualização
                        </p>
                        <p className="relative text-sm text-white/60">
                          Bloco promocional do site (CTA) — só exemplo no editor.
                        </p>
                      </div>
                    </article>

                    <aside className="w-full shrink-0 lg:w-72 xl:w-80">
                      <div className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50/80 p-4 lg:sticky lg:top-4">
                        <h2 className="border-b border-gray-200 pb-3 font-heading text-sm font-bold uppercase tracking-wide text-deep-navy">
                          Continue lendo
                        </h2>
                        <p className="text-xs text-gray-500">
                          No site aparecem artigos relacionados. Placeholder:
                        </p>
                        {[1, 2].map((n) => (
                          <div
                            key={n}
                            className="flex gap-3 rounded-xl border border-gray-100 bg-white p-3 opacity-80"
                          >
                            <div className="size-16 shrink-0 rounded-lg bg-gray-200" />
                            <div className="min-w-0 flex-1 space-y-2 pt-0.5">
                              <div className="h-2 w-16 rounded bg-coral-prime/40" />
                              <div className="h-3 w-full rounded bg-gray-200" />
                              <div className="h-3 w-2/3 rounded bg-gray-100" />
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-royal-blue">
                                Ler <ArrowRight className="size-3" />
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </aside>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
