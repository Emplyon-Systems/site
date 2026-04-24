import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { BlogContent } from '@/components/BlogContent';
import { WhatsAppWidget } from '@/components/WhatsAppWidget';
import { getPostBySlug, getAllPosts } from '@/data/blogPosts';
import Footer from '@/components/Footer';

function formatDate(iso) {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export function BlogPostPage() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);
  const all = getAllPosts();
  const related = all.filter((p) => p.id !== post?.id).slice(0, 2);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-deep-navy">
      <SiteHeader />
      <article className="pt-24 md:pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-royal-blue transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Todos os artigos
          </Link>

          <p className="text-coral-prime font-semibold text-sm mb-2">{post.category}</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-deep-navy text-balance leading-tight">
            {post.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span>{post.author}</span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(post.date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readTime} de leitura
            </span>
          </div>

          <p className="mt-8 text-lg text-gray-600 leading-relaxed border-l-4 border-royal-blue/40 pl-4">
            {post.excerpt}
          </p>

          <div className="mt-10">
            <BlogContent blocks={post.content} />
          </div>
        </div>

        {related.length > 0 && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-16 border-t border-gray-200">
            <h2 className="text-xl font-heading font-bold text-deep-navy mb-6">Continue lendo</h2>
            <ul className="space-y-4 list-none p-0 m-0">
              {related.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/blog/${p.slug}`}
                    className="block p-4 rounded-xl border border-gray-100 bg-white hover:border-royal-blue/30 transition-colors"
                  >
                    <span className="text-xs text-coral-prime font-medium">{p.category}</span>
                    <p className="font-heading font-bold text-deep-navy mt-1">{p.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
      <WhatsAppWidget />
      <Footer />
    </div>
  );
}

export default BlogPostPage;
