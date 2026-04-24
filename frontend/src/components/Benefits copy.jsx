import { motion, useReducedMotion } from 'framer-motion';
import { AlertTriangle, Banknote, UserMinus, Clock, ArrowRight } from 'lucide-react';

const problems = [
  {
    icon: AlertTriangle,
    number: '01',
    label: 'Compliance',
    title: 'Erro humano é inevitável. O risco é assumir isso como processo.',
    description: 'Escalas manuais geram falhas recorrentes que expõem a empresa a passivos trabalhistas, autuações e questionamentos jurídicos.',
    stat: '68%',
    statLabel: 'das empresas têm infrações trabalhistas por falha na escala',
    color: { dot: 'bg-rose-500', badge: 'bg-rose-50 text-rose-600', border: 'border-rose-100', icon: 'text-rose-500 bg-rose-50' },
  },
  {
    icon: Banknote,
    number: '02',
    label: 'Finanças',
    title: 'Horas extras sem controle não aparecem no dia. Aparecem no fechamento.',
    description: 'Falta de padronização na escala dificulta o planejamento e compromete a previsibilidade da folha de pagamento.',
    stat: '23%',
    statLabel: 'do custo operacional é consumido por horas extra não planejadas',
    color: { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-600', border: 'border-amber-100', icon: 'text-amber-500 bg-amber-50' },
  },
  {
    icon: UserMinus,
    number: '03',
    label: 'Pessoas',
    title: 'Escalas desequilibradas desgastam quem trabalha e afastam quem fica.',
    description: 'Distribuição irregular de jornadas gera sobrecarga, insatisfação e aumento nos pedidos de desligamento.',
    stat: '2.4x',
    statLabel: 'maior turnover em empresas com gestão manual de escala',
    color: { dot: 'bg-violet-500', badge: 'bg-violet-50 text-violet-600', border: 'border-violet-100', icon: 'text-violet-500 bg-violet-50' },
  },
  {
    icon: Clock,
    number: '04',
    label: 'Gestão',
    title: 'Tempo de liderança não deveria ser consumido montando escala.',
    description: 'Horas gastas ajustando planilhas e corrigindo erros poderiam ser usadas para gerir pessoas e operação.',
    stat: '6h',
    statLabel: 'por semana gastas por líderes apenas para montar e corrigir escalas',
    color: { dot: 'bg-blue-500', badge: 'bg-blue-50 text-blue-600', border: 'border-blue-100', icon: 'text-blue-500 bg-blue-50' },
  },
];

function AnimatedItem({ children, delay = 0 }) {
  const reduce = useReducedMotion();
  if (reduce) return <div>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const Benefits = () => {
  return (
    <section id="beneficios" className="py-24 bg-white relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:64px_64px] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <AnimatedItem>
          <div className="max-w-2xl mb-16 md:mb-20">
            <span className="inline-block text-royal-blue font-semibold text-sm uppercase tracking-widest mb-3">Por que mudar?</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-deep-navy leading-tight">
              Sua operação ainda depende de planilhas e{' '}
              <span className="text-coral-prime">"jeitinhos"</span>?
            </h2>
          </div>
        </AnimatedItem>

        {/* Cards em grid assimétrico */}
        <div className="grid md:grid-cols-2 gap-px bg-gray-100 rounded-3xl overflow-hidden shadow-sm">
          {problems.map((p, i) => {
            const Icon = p.icon;
            return (
              <AnimatedItem key={p.number} delay={i * 0.1}>
                <div className="group bg-white h-full p-8 md:p-10 hover:bg-gray-50/80 transition-colors duration-300 relative">

                  {/* Número de fundo decorativo */}
                  <span className="absolute top-6 right-8 text-8xl font-heading font-black text-gray-50 select-none pointer-events-none leading-none group-hover:text-gray-100 transition-colors">
                    {p.number}
                  </span>

                  {/* Topo: ícone + label */}
                  <div className="flex items-center gap-3 mb-6 relative">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${p.color.icon}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${p.color.badge}`}>
                      {p.label}
                    </span>
                  </div>

                  {/* Título */}
                  <h3 className="text-xl md:text-2xl font-heading font-bold text-deep-navy leading-snug mb-4 relative max-w-sm">
                    {p.title}
                  </h3>

                  {/* Descrição */}
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8 relative max-w-sm">
                    {p.description}
                  </p>

                  {/* Stat em destaque */}
                  <div className={`relative flex items-start gap-4 p-4 rounded-2xl border ${p.color.border} bg-white`}>
                    <span className={`text-4xl md:text-5xl font-heading font-black ${p.color.badge.split(' ')[1]} leading-none shrink-0`}>
                      {p.stat}
                    </span>
                    <p className="text-xs text-gray-500 leading-snug mt-1.5 max-w-[160px]">
                      {p.statLabel}
                    </p>
                  </div>
                </div>
              </AnimatedItem>
            );
          })}
        </div>

        {/* Footer CTA */}
        <AnimatedItem delay={0.5}>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 px-2">
            <p className="text-gray-500 text-sm md:text-base max-w-md text-center sm:text-left">
              A <span className="notranslate font-semibold text-deep-navy" translate="no">Emplyon</span> resolve cada um desses pontos com automação, regras e visibilidade em tempo real.
            </p>
            <a
              href="#como-funciona"
              className="inline-flex items-center gap-2 text-royal-blue font-semibold text-sm hover:gap-3 transition-all group shrink-0"
            >
              Ver como funciona
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </AnimatedItem>
      </div>
    </section>
  );
};

export default Benefits;
