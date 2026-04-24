import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  X,
  Tag,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { WhatsAppWidget } from '@/components/WhatsAppWidget';
import { getAllPosts, getAllCategories } from '@/data/blogPosts';
import Footer from '@/components/Footer';

const POSTS_PER_PAGE = 4;

const CATEGORY_COLORS = {
  Compliance:  { bg: 'bg-blue-100',   text: 'text-blue-700',   border: 'border-blue-200',   dot: 'bg-blue-500'   },
  Gestão:      { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
  Operação:    { bg: 'bg-emerald-100',text: 'text-emerald-700',border: 'border-emerald-200',dot: 'bg-emerald-500' },
  Tecnologia:  { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500'  },
  Pessoas:     { bg: 'bg-rose-100',   text: 'text-rose-700',   border: 'border-rose-200',   dot: 'bg-rose-500'   },
  Dados:       { bg: 'bg-amber-100',  text: 'text-amber-700',  border: 'border-amber-200',  dot: 'bg-amber-500'  },
};

function formatDate(iso) {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function CategoryBadge({ category, size = 'sm' }) {
  const colors = CATEGORY_COLORS[category] ?? {
    bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-400',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${colors.bg} ${colors.text} ${colors.border} ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {category}
    </span>
  );
}

function BlogCard({ post, featured = false }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className={`group flex flex-col rounded-2xl overflow-hidden border border-gray-100 bg-white hover:border-royal-blue/30 hover:shadow-xl hover:shadow-royal-blue/5 transition-all duration-300 ${
        featured ? 'md:flex-row' : ''
      }`}
    >
      {/* Image */}
      <div className={`relative overflow-hidden bg-gray-100 ${featured ? 'md:w-1/2 h-56 md:h-auto' : 'h-48'}`}>
        <img
          src={post.coverImage}
          alt={post.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <CategoryBadge category={post.category} />
        </div>
      </div>

      {/* Body */}
      <div className={`flex flex-col flex-1 p-6 ${featured ? '' : ''}`}>
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(post.date)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime} de leitura
          </span>
        </div>

        <h2
          className={`font-heading font-bold text-deep-navy group-hover:text-royal-blue transition-colors leading-snug line-clamp-2 ${
            featured ? 'text-2xl md:text-3xl' : 'text-lg'
          }`}
        >
          {post.title}
        </h2>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1">{post.excerpt}</p>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">{post.author}</span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-royal-blue group-hover:gap-2 transition-all">
            Ler artigo
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function Pagination({ currentPage, totalPages, onPage }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Paginação">
      <button
        onClick={() => onPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:border-royal-blue hover:text-royal-blue disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Página anterior"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPage(p)}
          aria-current={p === currentPage ? 'page' : undefined}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
            p === currentPage
              ? 'bg-royal-blue text-white shadow-md shadow-royal-blue/30'
              : 'border border-gray-200 text-gray-600 hover:border-royal-blue hover:text-royal-blue'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:border-royal-blue hover:text-royal-blue disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Próxima página"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}

export function BlogListPage() {
  const allPosts = getAllPosts();
  const categories = getAllCategories();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return allPosts.filter((p) => {
      const matchCat = activeCategory ? p.category === activeCategory : true;
      const matchQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [allPosts, query, activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  useEffect(() => { setPage(1); }, [query, activeCategory]);

  const handleCategoryToggle = (cat) => {
    setActiveCategory((prev) => (prev === cat ? '' : cat));
  };

  const clearFilters = () => {
    setQuery('');
    setActiveCategory('');
  };

  const hasFilters = query || activeCategory;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-deep-navy">
      <SiteHeader />

      {/* Espaço branco acima do hero para o header transparente não sobrepor o azul escuro */}
      <div className="h-20 md:h-24 bg-white" />

      {/* Hero */}
      <div className="relative bg-deep-navy pt-10 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-deep-navy via-[#013a73] to-[#0179FE]/30 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-royal-blue/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-coral-prime/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-royal-blue/80 font-semibold text-sm uppercase tracking-widest mb-3">Blog Emplyon</p>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white text-balance leading-tight">
            Conteúdo para quem<br className="hidden md:block" /> gere escalas de verdade
          </h1>
          <p className="mt-4 text-lg text-white/60 max-w-xl mx-auto">
            Artigos sobre conformidade, liderança e dados — sem jargão desnecessário.
          </p>

          {/* Search */}
          <div className="mt-8 relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar artigos, tags..."
              className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-royal-blue focus:bg-white/15 transition-all backdrop-blur-sm text-base"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                aria-label="Limpar pesquisa"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters & Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Category chips */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button
            onClick={() => setActiveCategory('')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              !activeCategory
                ? 'bg-deep-navy text-white border-deep-navy shadow-md'
                : 'bg-white text-gray-600 border-gray-200 hover:border-deep-navy hover:text-deep-navy'
            }`}
          >
            Todos ({allPosts.length})
          </button>
          {categories.map((cat) => {
            const count = allPosts.filter((p) => p.category === cat).length;
            const colors = CATEGORY_COLORS[cat];
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryToggle(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  isActive
                    ? `${colors.bg} ${colors.text} ${colors.border} shadow-md`
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-800'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Results count + clear */}
        <div className="flex items-center justify-between mb-6 min-h-[28px]">
          <p className="text-sm text-gray-500">
            {filtered.length === 0
              ? 'Nenhum artigo encontrado'
              : `${filtered.length} artigo${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`}
            {activeCategory && <span className="font-medium text-gray-700"> em <em>{activeCategory}</em></span>}
          </p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-coral-prime transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Limpar filtros
            </button>
          )}
        </div>

        {/* Grid */}
        {paginated.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-xl font-heading font-bold text-deep-navy">Nenhum resultado</p>
            <p className="mt-2 text-gray-500">Tente outro termo ou remova os filtros.</p>
            <button
              onClick={clearFilters}
              className="mt-6 inline-flex items-center gap-2 bg-royal-blue text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Ver todos os artigos
            </button>
          </div>
        ) : (
          <>
            {/* Featured (first on page 1 with no active filter) */}
            {page === 1 && !hasFilters && paginated.length > 0 ? (
              <div className="space-y-6">
                <BlogCard post={paginated[0]} featured />
                {paginated.length > 1 && (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginated.slice(1).map((post) => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginated.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPage={(p) => {
            setPage(p);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>

      <WhatsAppWidget />
      <Footer />
    </div>
  );
}

export default BlogListPage;
