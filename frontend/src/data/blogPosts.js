/**
 * Posts fictícios — substituir por API quando o backend existir.
 * Manter `id` e `slug` estáveis para URLs e SEO.
 */

const posts = [
  {
    id: '1',
    slug: 'escalas-que-evitam-risco-trabalhista',
    title: 'Escalas que evitam risco trabalhista: o que a CLT exige hoje',
    excerpt:
      'Três pontos de atenção na montagem de turnos que reduzem multas, horas extra indevidas e passivos na fiscalização.',
    date: '2026-04-18',
    author: 'Equipe Emplyon',
    readTime: '5 min',
    category: 'Compliance',
    tags: ['CLT', 'Turnos', 'Fiscalização'],
    coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80&auto=format&fit=crop',
    content: [
      { type: 'p', text: 'Montar a escala não é só preencher quadros. Quando a lógica dos turnos não conversa com a convenção e com a jornada real, a empresa fica exposta a questionamentos, não só de sindicatos, mas de auditoria interna e de clientes que cobram rastreabilidade.' },
      { type: 'h2', text: 'Intervalos e banco de horas' },
      { type: 'p', text: 'A forma como o intervalo e o banco de horas são controlados costuma ser o primeiro ponto vistoriado. Ter registro claro, preferencialmente vinculado a um sistema, reduz a ambiguidade e acelera a defesa em eventual contestação.' },
      { type: 'ul', items: [
        'Lançar a previsão de horário antes do fechamento da folha.',
        'Diferenciar jornada ordinária de sobreaviso, quando houver previsão contratual.',
        'Garantir que a troca de turno fique documentada, não só em conversa informal.',
      ] },
      { type: 'p', text: 'Ferramentas de gestão de escala existem exatamente para amarrar regra, registro e previsão no mesmo fluxo. Enquanto o back office não entra, o improviso vira padrão — e aí a conformidade fica no papel, não na operação.' },
    ],
  },
  {
    id: '2',
    slug: 'lideranca-escala-nao-e-planilha',
    title: 'Liderança: por que a escala não deveria viver em planilha',
    excerpt:
      'Planilhas ajudam no protótipo, mas não escalam com o time. Veja sinais de que a operação precisa de um ponto único de verdade.',
    date: '2026-04-12',
    author: 'Equipe Emplyon',
    readTime: '4 min',
    category: 'Gestão',
    tags: ['Liderança', 'Processos', 'Planilha'],
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&auto=format&fit=crop',
    content: [
      { type: 'p', text: 'A planilha compartilhada foi o primeiro passo de muitas empresas. O problema começa quando a versão "final" muda cinco vezes no mesmo dia e ninguém sabe qual link é o verdadeiro.' },
      { type: 'h2', text: 'Sinais de que o modelo estourou' },
      { type: 'ul', items: [
        'Mais de um "fonte da verdade" com números diferentes.',
        'Líderes reprocessando a mesma informação toda segunda-feira.',
        'Colaboradores no WhatsApp pedindo "a última versão" da semana.',
      ] },
      { type: 'p', text: 'Unificar a escala em um sistema com histórico e permissão por papel tira a ambiguidade. A liderança deixa de apagar incêndio e passa a acompanhar indicadores: absenteísmo, aderência e folgas planejadas.' },
    ],
  },
  {
    id: '3',
    slug: 'absenteismo-e-cobertura',
    title: 'Absenteísmo e cobertura: como enxergar o buraco antes do apagão',
    excerpt:
      'Antecipar faltas e regiões críticas evita reforço de última hora e desgaste com o time. Boas práticas em dados e rituais de revisão.',
    date: '2026-04-02',
    author: 'Equipe Emplyon',
    readTime: '6 min',
    category: 'Operação',
    tags: ['Absenteísmo', 'Cobertura', 'Turnos'],
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80&auto=format&fit=crop',
    content: [
      { type: 'p', text: 'Cobertura reativa gera estresse, custo em hora extra e sensação de injustiça: sempre os mesmos nomes "salvando" o turno. O caminho é cruzar histórico de faltas com picos de demanda e mapear gargalos.' },
      { type: 'h2', text: 'Rituais simples' },
      { type: 'p', text: 'Uma reunião curta semanal, olhando apenas para os três turnos com maior variância, já muda o jogo. O importante é agir com pelo menos 48h de antecedência, não na hora H.' },
      { type: 'p', text: 'Onde a Emplyon se encaixa: consolidar a visão da semana, avisar sobre conflito de folga e deixar regras de substituição visíveis para líderes e time — tudo isso sem trocar de ferramenta a cada ajuste.' },
    ],
  },
  {
    id: '4',
    slug: 'integracao-com-erp-ou-folha',
    title: 'Integração com folha: quando parar de digitar a mesma coisa duas vezes',
    excerpt:
      'Duplicar cadastro e recalcular atrasos manualmente gera erro humano. Checklist mínimo antes de chamar o time de TI ou o fornecedor da folha.',
    date: '2026-03-22',
    author: 'Equipe Emplyon',
    readTime: '5 min',
    category: 'Tecnologia',
    tags: ['ERP', 'Integração', 'Automação'],
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80&auto=format&fit=crop',
    content: [
      { type: 'p', text: 'Integrar escala e folha de pagamento reduz diferenças de centavos que viram ruído em fechamento. Antes de integrar, vale alinhar o dicionário de campos: o que significa "turno" no ERP e o que a operação chama de turno no chão de fábrica.' },
      { type: 'h2', text: 'Checklist' },
      { type: 'ul', items: [
        'Mapear eventos de folga, falta, atestado e jornada extra.',
        'Definir quem aprova exceção e em qual sistema a exceção fica logada.',
        'Testar um ciclo de fechamento com volume reduzido antes de ir 100% produção.',
      ] },
    ],
  },
  {
    id: '5',
    slug: 'comunicacao-escala-time',
    title: 'Comunicação da escala: o que o time realmente precisa saber',
    excerpt:
      'Transparência não é encher o grupo de mensagens. É publicar a lógica, o canal oficial e a janela para contestação de forma clara e única.',
    date: '2026-03-10',
    author: 'Equipe Emplyon',
    readTime: '4 min',
    category: 'Pessoas',
    tags: ['Comunicação', 'Equipe', 'Gestão'],
    coverImage: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80&auto=format&fit=crop',
    content: [
      { type: 'p', text: 'Escala mal comunicada gera conflito entre pares, não só com a empresa. O time precisa saber: onde ver a versão vigente, até quando pode pedir ajuste e como registrar imprevistos — sem abrir 15 conversas paralelas no WhatsApp.' },
      { type: 'p', text: 'Ter um repositório único (mesmo que no começo seja um PDF gerado a partir de um sistema) já reduz metade do ruído. O outro 50% vem de feedback estruturado, não de áudio em grupo.' },
    ],
  },
  {
    id: '6',
    slug: 'metricas-escala-2026',
    title: 'Métricas de escala que importam em 2026 (e as que enganam dashboard)',
    excerpt:
      'Cobertura, aderência e custo por turno: como escolher o que acompanhar sem virar refém do número errado.',
    date: '2026-02-28',
    author: 'Equipe Emplyon',
    readTime: '7 min',
    category: 'Dados',
    tags: ['KPIs', 'Analytics', 'Dashboard'],
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&auto=format&fit=crop',
    content: [
      { type: 'p', text: 'KPIs bonitos no Power BI não substituem decisão. O que pesa na escala é: você cobriu o posto, respeitou a lei e o time saiu com sensação de justiça? Se o número não liga a esses três eixos, vira jogo de cifras.' },
      { type: 'h2', text: 'Três indicadores com bom custo' },
      { type: 'ul', items: [
        'Aderência planejada vs. realizado (não punitivo, rastreável).',
        'Custo de hora extra / sobreaviso por unidade, mês a mês.',
        'Solicitações de troca fora de prazo, como proxy de clareza do processo.',
      ] },
      { type: 'p', text: 'Refinar a escala a partir de dados leva meses, não semanas. O primeiro passo é medir de forma confiável; o segundo, cortar o que for vanity metric.' },
    ],
  },
];

export function getAllPosts() {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug) {
  return posts.find((p) => p.slug === slug) ?? null;
}

export function getPostById(id) {
  return posts.find((p) => p.id === id) ?? null;
}

/** Últimos N posts por data (mais recentes primeiro) */
export function getLatestPosts(n = 3) {
  return getAllPosts().slice(0, n);
}

/** Todas as categorias únicas */
export function getAllCategories() {
  return [...new Set(posts.map((p) => p.category))].sort();
}
