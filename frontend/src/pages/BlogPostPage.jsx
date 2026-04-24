import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Tag, ArrowRight } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { BlogContent } from '@/components/BlogContent';
import { WhatsAppWidget } from '@/components/WhatsAppWidget';
import { getPostBySlug, getAllPosts } from '@/data/blogPosts';
import Footer from '@/components/Footer';

const CAT_CLASS = 'bg-coral-prime text-white';
const CAT_CLASS_DARK = 'bg-coral-prime text-white';

function formatDate(iso) {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export function BlogPostPage() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);
  const all = getAllPosts();
  const related = all.filter((p) => p.id !== post?.id).slice(0, 3);

  if (!post) return <Navigate to="/blog" replace />;


  return (
    <div className="min-h-screen bg-white font-sans text-deep-navy">
      <SiteHeader />

      {/* ── Hero Banner (tela cheia) ── */}
      <div className="relative w-full h-[62vh] min-h-[440px] md:h-[72vh] overflow-hidden">
        <img
          src={post.coverImage}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover scale-105"
          loading="eager"
        />
        {/* Gradiente branco no topo → protege o nav */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white via-white/55 to-transparent" />
        {/* Gradiente escuro na base → área do título */}
        <div className="absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-deep-navy/95 via-deep-navy/70 to-transparent" />

        {/* Conteúdo do banner */}
        <div className="absolute inset-0 flex flex-col justify-end pb-12 md:pb-16 px-4 sm:px-8 lg:px-12">
          <div className="max-w-5xl mx-auto w-full">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-medium transition-colors mb-5"
            >
              <ArrowLeft className="w-4 h-4" />
              Todos os artigos
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${CAT_CLASS_DARK}`}>
                {post.category}
              </span>
              {post.tags?.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 text-xs text-white/65 bg-white/10 border border-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight max-w-4xl">
              {post.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/65">
              <span className="font-semibold text-white/90">{post.author}</span>
              <span className="w-1 h-1 rounded-full bg-white/35" />
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(post.date)}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/35" />
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.readTime} de leitura
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Layout de artigo: coluna de leitura + sidebar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-14 md:py-20">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-16 items-start">

          {/* Coluna principal */}
          <article className="flex-1 min-w-0">
            {/* Lead */}
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed border-l-4 border-royal-blue pl-6 py-1 mb-10 font-light italic">
              {post.excerpt}
            </p>

            <BlogContent blocks={post.content} />

            {/* CTA */}
            <div className="mt-16 rounded-3xl bg-deep-navy p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-52 h-52 bg-royal-blue/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-coral-prime/10 rounded-full blur-3xl pointer-events-none" />
              <p className="relative text-white/50 text-xs font-bold uppercase tracking-widest mb-2">Emplyon</p>
              <h2 className="relative text-2xl md:text-3xl font-heading font-bold text-white mb-3 max-w-sm mx-auto">
                Pronto para organizar a sua escala?
              </h2>
              <p className="relative text-white/60 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
                Fale com um especialista e veja como a Emplyon pode eliminar o improviso na sua operação.
              </p>
              <a
                href="https://wa.me/5511962641923?text=Ol%C3%A1!%20Vim%20atrav%C3%A9s%20do%20blog%20da%20Emplyon%20e%20gostaria%20de%20saber%20mais."
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center gap-2 bg-royal-blue hover:bg-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all group"
              >
                Falar com Especialista
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </article>

          {/* Sidebar — artigos relacionados */}
          {related.length > 0 && (
            <aside className="w-full lg:w-80 xl:w-96 shrink-0">
              <div className="lg:sticky lg:top-28 space-y-5">
                <h2 className="text-base font-heading font-bold text-deep-navy uppercase tracking-wide border-b border-gray-100 pb-3">
                  Continue lendo
                </h2>
                {related.map((p) => {
                  return (
                    <Link
                      key={p.id}
                      to={`/blog/${p.slug}`}
                      className="group flex gap-4 items-start p-3 rounded-2xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                        <img
                          src={p.coverImage}
                          alt={p.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold mb-1 ${CAT_CLASS}`}>
                          {p.category}
                        </span>
                        <p className="font-heading font-bold text-deep-navy text-sm leading-snug line-clamp-2 group-hover:text-royal-blue transition-colors">
                          {p.title}
                        </p>
                        <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-royal-blue">
                          Ler <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </aside>
          )}
        </div>
      </div>

      <WhatsAppWidget />
      <Footer />
    </div>
  );
}

export default BlogPostPage;
