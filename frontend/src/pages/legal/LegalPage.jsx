import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { WhatsAppWidget } from '@/components/WhatsAppWidget';
import Footer from '@/components/Footer';

/**
 * Layout base compartilhado pelas páginas legais (Termos, Privacidade, Cookies).
 */
export function LegalPage({ title, lastUpdated, children }) {
  return (
    <div className="min-h-screen bg-white font-sans text-deep-navy">
      <SiteHeader />

      {/* Hero simples */}
      <div className="bg-gray-50 border-b border-gray-100 pt-28 md:pt-32 pb-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-royal-blue transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </Link>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-deep-navy">{title}</h1>
          {lastUpdated && (
            <p className="mt-2 text-sm text-gray-400">Última atualização: {lastUpdated}</p>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="prose-legal">{children}</div>
      </main>

      <WhatsAppWidget />
      <Footer />
    </div>
  );
}

/* Helpers de tipografia para manter consistência sem Tailwind Typography */
export function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl md:text-2xl font-heading font-bold text-deep-navy mb-3 pb-2 border-b border-gray-100">
        {title}
      </h2>
      <div className="space-y-3 text-gray-600 text-base leading-relaxed">{children}</div>
    </section>
  );
}

export function P({ children }) {
  return <p className="text-gray-600 text-base leading-relaxed">{children}</p>;
}

export function Ul({ items }) {
  return (
    <ul className="mt-2 space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-gray-600 text-base">
          <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-royal-blue" />
          {item}
        </li>
      ))}
    </ul>
  );
}
