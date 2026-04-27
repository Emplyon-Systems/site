import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getPost } from '@/lib/postsApi';
import { AdminAutomationSubnav } from '@/components/admin/AdminAutomationSubnav';

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function parseParagraphsFromHtml(html) {
  if (!html || typeof html !== 'string' || typeof DOMParser === 'undefined') return [];
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return Array.from(doc.body.querySelectorAll('p'))
    .map((p) => p.textContent?.trim() || '')
    .filter(Boolean);
}

export function AdminAutomationPreviewPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || !postId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getPost(token, postId);
        if (!cancelled) setPost(data);
      } catch (err) {
        if (cancelled) return;
        if (err?.status === 401) {
          await logout();
          navigate('/admin/login', { replace: true });
          return;
        }
        setError(err.message || 'Nao foi possivel carregar a pre-visualizacao.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token, postId, navigate, logout]);

  const paragraphs = useMemo(() => parseParagraphsFromHtml(post?.htmlContent || ''), [post?.htmlContent]);
  const heroImage = post?.images?.[0]?.url || 'https://placehold.co/1200x630/e2e8f0/64748b?text=Emplyon';
  const displayTitle = post?.title || post?.researchQuery || 'Sem titulo';

  if (loading) {
    return (
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
        Carregando pré-visualização...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="w-full space-y-4">
        <AdminAutomationSubnav />
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
          {error || 'Post não encontrado.'}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-8 space-y-4">
      <AdminAutomationSubnav />

      <div className="sticky top-0 z-20 rounded-2xl border border-gray-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" className="rounded-lg" asChild>
            <Link to="/admin/blog/automacao/prontos" className="inline-flex items-center gap-2">
              <ArrowLeft className="size-4" />
              Prontos
            </Link>
          </Button>
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
            {post.status || 'ready'}
          </span>
          <div className="ml-auto">
            <Button type="button" size="sm" className="rounded-lg bg-royal-blue text-white hover:bg-blue-600" asChild>
              <Link to={`/admin/blog/automacao/${postId}`} className="inline-flex items-center gap-1.5">
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
            src={heroImage}
            alt={displayTitle}
            className="absolute inset-0 h-full w-full scale-105 object-cover"
            loading="eager"
          />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white via-white/55 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-deep-navy/95 via-deep-navy/70 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end px-4 pb-8 sm:px-8 md:pb-10 lg:px-12">
            <div className="mx-auto w-full max-w-5xl">
              <Link
                to="/admin/blog/automacao/prontos"
                className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                Todos os prontos
              </Link>
              <h1 className="max-w-4xl font-heading text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
                {displayTitle}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/65">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.updatedAt || post.createdAt)}
                </span>
                <span className="h-1 w-1 rounded-full bg-white/35" />
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  Automacao
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-8 md:py-20 lg:px-12">
          <article className="min-w-0 flex-1">
            {post.idea ? (
              <p className="mb-10 border-l-4 border-royal-blue py-1 pl-6 text-xl font-light italic leading-relaxed text-gray-600 md:text-2xl">
                {post.idea}
              </p>
            ) : null}
            <div className="space-y-6 text-[15px] leading-8 text-gray-700">
              {paragraphs.length > 0 ? paragraphs.map((paragraph, idx) => (
                <p key={`${postId}-p-${idx}`}>{paragraph}</p>
              )) : <p className="text-gray-500">Sem conteúdo para visualização.</p>}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
