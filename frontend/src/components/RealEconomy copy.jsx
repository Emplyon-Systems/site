import { Shield, Users, Zap, TrendingUp, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    id: 'controle',
    icon: TrendingUp,
    label: 'Visibilidade',
    title: 'Controle Operacional',
    desc: 'Centralize escalas, jornadas e folgas em um único lugar. Chega de versões paralelas e informação dispersa.',
    stat: '100%',
    statSub: 'de visibilidade da operação',
    checks: ['Escalas e jornadas centralizadas', 'Histórico completo de alterações', 'Acesso por perfil e unidade'],
    wide: true,
  },
  {
    id: 'criacao',
    icon: Zap,
    label: 'Velocidade',
    title: 'Criação Rápida de Escalas',
    desc: 'Escalas prontas em minutos, com regras e restrições aplicadas automaticamente.',
    stat: '10×',
    statSub: 'mais rápido que planilha',
    checks: [],
    wide: false,
  },
  {
    id: 'compliance',
    icon: Shield,
    label: 'Compliance',
    title: 'Conformidade Trabalhista',
    desc: 'Validação automática de jornada, folgas e descanso semanal conforme CLT e convenção coletiva.',
    stat: '0',
    statSub: 'autuações por falha na escala',
    checks: [],
    wide: false,
  },
  {
    id: 'gestao',
    icon: Users,
    label: 'Liderança',
    title: 'Gestão Sem Improviso',
    desc: 'Devolva o tempo da liderança. Gestores atuam nas pessoas, não na correção de planilhas.',
    stat: '6h',
    statSub: 'por semana devolvidas ao gestor',
    checks: ['Menos retrabalho operacional', 'Liderança focada em pessoas', 'Menos stress e turnover'],
    wide: true,
  },
];

function Card({ feature, delay = 0 }) {
  const Icon = feature.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative rounded-3xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 overflow-hidden flex flex-col p-7 md:p-9 ${
        feature.wide ? 'md:col-span-2' : ''
      }`}
    >
      {/* Glow azul no hover */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-royal-blue/0 group-hover:bg-royal-blue/20 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />

      {/* Linha decorativa superior */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Topo: ícone + label */}
      <div className="relative flex items-center justify-between mb-8">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white/[0.06] border border-white/10 text-white/80 group-hover:text-white group-hover:border-white/20 transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
          {feature.label}
        </span>
      </div>

      {/* Stat em destaque */}
      <div className="relative mb-6">
        <span className="text-5xl md:text-6xl font-heading font-bold text-white leading-none tracking-tight">
          {feature.stat}
        </span>
        <p className="mt-2 text-xs md:text-sm text-white/40 leading-snug">{feature.statSub}</p>
      </div>

      {/* Divider suave */}
      <div className="relative w-10 h-px bg-white/15 mb-6" />

      {/* Título + Desc */}
      <div className="relative flex-1">
        <h3 className="text-lg md:text-xl font-heading font-bold text-white mb-2.5 leading-snug">
          {feature.title}
        </h3>
        <p className="text-sm text-white/55 leading-relaxed">{feature.desc}</p>

        {feature.checks.length > 0 && (
          <ul className="mt-5 space-y-2.5">
            {feature.checks.map((c) => (
              <li key={c} className="flex items-center gap-2.5 text-sm text-white/60">
                <CheckCircle2 className="w-4 h-4 text-royal-blue/70 shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

const RealEconomy = () => {
  const topRow = features.filter((f) => ['controle', 'criacao'].includes(f.id));
  const bottomRow = features.filter((f) => ['compliance', 'gestao'].includes(f.id));

  return (
    <section className="bg-deep-navy py-20 md:py-28 relative overflow-hidden">
      {/* Gradiente de fundo sutil */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#011f3f] via-deep-navy to-deep-navy pointer-events-none" />

      {/* Luzes decorativas suaves */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-royal-blue/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-royal-blue/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Grade decorativa muito sutil */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_30%,#000_60%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-14 md:mb-20"
        >
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-royal-blue mb-4">
            <span className="w-6 h-px bg-royal-blue/60" />
            O Efeito <span className="notranslate" translate="no">Emplyon</span>
            <span className="w-6 h-px bg-royal-blue/60" />
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white leading-[1.1] mb-5">
            Menos improviso.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-200">
              Mais controle.
            </span>
          </h2>
          <p className="text-white/50 text-base md:text-lg max-w-xl mx-auto">
            Não é mágica, é gestão inteligente. Veja como transformamos sua realidade.
          </p>
        </motion.div>

        {/* Bento grid assimétrico 2×2 (um largo + um normal em cada linha) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {topRow.map((f, i) => (
            <Card key={f.id} feature={f} delay={i * 0.1} />
          ))}
          {bottomRow.map((f, i) => (
            <Card key={f.id} feature={f} delay={0.2 + i * 0.1} />
          ))}
        </div>

        {/* Footer com link sutil */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex justify-center"
        >
          <a
            href="#orcamento"
            className="group inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            Ver a plataforma em ação
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default RealEconomy;
