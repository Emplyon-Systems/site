import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  ExternalLink,
  Pencil,
  Tag,
} from 'lucide-react';
import { BlogContent } from '@/components/BlogContent';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { adminGetPost, fetchRelatedPosts } from '@/lib/blogApi';

const CAT_CLASS = 'bg-coral-prime text-white';

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export function AdminPostPreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await adminGetPost(token, id);
        if (cancelled) return;
        setPost(data);
        if (data.published && data.slug) {
          try {
            const rel = await fetchRelatedPosts(data.slug);
            if (!cancelled) setRelated(Array.isArray(rel) ? rel : []);
          } catch {
            if (!cancelled) setRelated([]);
          }
        } else {
          setRelated([]);
        }
      } catch {
        if (!cancelled) navigate('/admin/blog/artigos', { replace: true });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token, id, navigate]);

  if (loading || !post) {
    return (
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
        {loading ? 'A carregar…' : 'Artigo não encontrado.'}
      </div>
    );
  }

  const categoryLabel = post.category?.name ?? 'Sem categoria';
  const publicUrl = `/blog/${post.slug}`;

  return (
    <div className="w-full pb-8">
      <div className="sticky top-0 z-20 -mx-6 mb-6 border-b border-gray-200 bg-gray-50/95 px-6 py-3 backdrop-blur">
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" className="rounded-lg" asChild>
            <Link to="/admin/blog/artigos" className="inline-flex items-center gap-2">
              <ArrowLeft className="size-4" />
              Artigos
            </Link>
          </Button>
          <div className="hidden h-6 w-px bg-gray-200 sm:block" />
          <span
            className={
              post.published
                ? 'rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800'
                : 'rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-700'
            }
          >
            {post.published ? 'Publicado' : 'Rascunho'}
          </span>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {post.published ? (
              <Button type="button" variant="outline" size="sm" className="rounded-lg" asChild>
                <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5">
                  <ExternalLink className="size-4" />
                  Ver no site
                </a>
              </Button>
            ) : null}
            <Button type="button" size="sm" className="rounded-lg bg-royal-blue text-white hover:bg-blue-600" asChild>
              <Link to={`/admin/blog/artigos/${id}/editar`} className="inline-flex items-center gap-1.5">
                <Pencil className="size-4" />
                Editar
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="relative w-full h-[40vh] min-h-[260px] max-h-[420px] overflow-hidden sm:min-h-[300px] md:h-[44vh] md:max-h-[460px]">
          <img
            src={post.coverImage || 'https://placehold.co/1200x630/e2e8f0/64748b?text=Emplyon'}
            alt={post.title}
            className="absolute inset-0 h-full w-full scale-105 object-cover"
            loading="eager"
          />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white via-white/55 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-deep-navy/95 via-deep-navy/70 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end px-4 pb-8 sm:px-8 md:pb-10 lg:px-12">
            <div className="mx-auto w-full max-w-5xl">
              <Link
                to="/admin/blog/artigos"
                className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                Todos os artigos
              </Link>

              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${CAT_CLASS}`}>
                  {categoryLabel}
                </span>
                {post.tags?.length > 0
                  ? post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-xs text-white/65 backdrop-blur-sm"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))
                  : null}
              </div>

              <h1 className="max-w-4xl font-heading text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
                {post.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/65">
                <span className="font-semibold text-white/90">{post.author}</span>
                <span className="h-1 w-1 rounded-full bg-white/35" />
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="h-1 w-1 rounded-full bg-white/35" />
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {post.readTime} de leitura
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-8 md:py-20 lg:px-12">
          <div className="flex flex-col items-start gap-12 lg:flex-row xl:gap-16">
            <article className="min-w-0 flex-1">
              <p className="mb-10 border-l-4 border-royal-blue py-1 pl-6 text-xl font-light italic leading-relaxed text-gray-600 md:text-2xl">
                {post.excerpt}
              </p>

              <BlogContent blocks={post.content} />

              <div className="relative mt-16 overflow-hidden rounded-3xl bg-deep-navy p-8 text-center md:p-12">
                <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-royal-blue/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-coral-prime/10 blur-3xl" />
                <p className="relative mb-2 text-xs font-bold uppercase tracking-widest text-white/50">Emplyon</p>
                <h2 className="relative mx-auto mb-3 max-w-sm font-heading text-2xl font-bold text-white md:text-3xl">
                  Pronto para organizar a sua escala?
                </h2>
                <p className="relative mx-auto mb-8 max-w-sm text-sm leading-relaxed text-white/60">
                  Fale com um especialista e veja como a Emplyon pode eliminar o improviso na sua operação.
                </p>
                <a
                  href="https://wa.me/5511962641923?text=Ol%C3%A1!%20Vim%20atrav%C3%A9s%20do%20blog%20da%20Emplyon%20e%20gostaria%20de%20saber%20mais."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-flex items-center gap-2 rounded-xl bg-royal-blue px-8 py-3.5 font-semibold text-white shadow-lg transition-all hover:bg-blue-600 hover:shadow-xl group"
                >
                  Falar com Especialista
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </article>

            <aside className="w-full shrink-0 lg:w-80 xl:w-96">
              <div className="lg:sticky lg:top-4 space-y-5">
                <h2 className="border-b border-gray-100 pb-3 font-heading text-base font-bold uppercase tracking-wide text-deep-navy">
                  Continue lendo
                </h2>
                {!post.published ? (
                  <p className="text-sm text-gray-500">
                    Artigo em rascunho — os relacionados só aparecem no site após publicação.
                  </p>
                ) : related.length === 0 ? (
                  <p className="text-sm text-gray-500">Nenhum artigo relacionado por agora.</p>
                ) : (
                  related.map((p) => (
                    <Link
                      key={p.id}
                      to={`/admin/blog/artigos/${p.id}`}
                      className="group flex items-start gap-4 rounded-2xl p-3 transition-colors hover:bg-gray-50"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                        <img
                          src={p.coverImage}
                          alt={p.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className={`mb-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${CAT_CLASS}`}>
                          {p.category}
                        </span>
                        <p className="font-heading text-sm font-bold leading-snug text-deep-navy line-clamp-2 transition-colors group-hover:text-royal-blue">
                          {p.title}
                        </p>
                        <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-royal-blue">
                          Ler <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
