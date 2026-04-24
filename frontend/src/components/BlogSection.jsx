import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';
import { getLatestPosts } from '@/data/blogPosts';

const CAT_CLASS = 'bg-coral-prime text-white';

function formatDate(iso) {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function BlogSection() {
  const latest = getLatestPosts(3);

  return (
    <section id="blog" className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="text-royal-blue font-semibold text-sm uppercase tracking-widest mb-2">Blog</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-deep-navy leading-snug">
              Conteúdo para quem<br className="hidden sm:block" /> mexe com escala e operação
            </h2>
            <p className="mt-3 text-gray-500 max-w-lg">
              Artigos curtos sobre conformidade, liderança e dados — sem jargão inútil.
            </p>
          </div>
          <Link
            to="/blog"
            className="group inline-flex items-center gap-2 text-royal-blue font-semibold text-sm hover:gap-3 transition-all shrink-0 bg-white border border-royal-blue/20 px-5 py-2.5 rounded-full hover:bg-royal-blue hover:text-white hover:border-royal-blue transition-all duration-200"
          >
            Ver todos os artigos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Cards */}
        <ul className="grid md:grid-cols-3 gap-8 list-none p-0 m-0">
          {latest.map((post, i) => {
            return (
              <li key={post.id} className={i === 0 ? 'md:col-span-1' : ''}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex flex-col h-full rounded-2xl overflow-hidden border border-gray-100 bg-white hover:border-royal-blue/30 hover:shadow-xl hover:shadow-royal-blue/5 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                    <span
                      className={`absolute bottom-3 left-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${CAT_CLASS}`}
                    >
                      {post.category}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex flex-col flex-1 p-6">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-3">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(post.date)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-base font-heading font-bold text-deep-navy group-hover:text-royal-blue transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed flex-1">
                      {post.excerpt}
                    </p>

                    {post.tags?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-royal-blue group-hover:gap-2.5 transition-all">
                      Ler artigo
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default BlogSection;
