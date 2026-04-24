<?php

namespace Database\Seeders;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    public function run(): void
    {
        $categoryDefs = [
            ['name' => 'Geral', 'slug' => 'geral'],
            ['name' => 'Compliance', 'slug' => 'compliance'],
            ['name' => 'Gestão', 'slug' => 'gestao'],
            ['name' => 'Operação', 'slug' => 'operacao'],
            ['name' => 'Tecnologia', 'slug' => 'tecnologia'],
            ['name' => 'Pessoas', 'slug' => 'pessoas'],
            ['name' => 'Dados', 'slug' => 'dados'],
            ['name' => 'Recursos Humanos', 'slug' => 'recursos-humanos'],
        ];

        $categoryIds = [];
        foreach ($categoryDefs as $def) {
            $c = BlogCategory::query()->firstOrCreate(
                ['slug' => $def['slug']],
                ['name' => $def['name']],
            );
            $categoryIds[$def['slug']] = $c->id;
        }

        $cid = fn (string $slug) => $categoryIds[$slug] ?? null;

        $posts = [
            [
                'slug' => 'escalas-que-evitam-risco-trabalhista',
                'blog_category_slug' => 'compliance',
                'title' => 'Escalas que evitam risco trabalhista: o que a CLT exige hoje',
                'excerpt' => 'Três pontos de atenção na montagem de turnos que reduzem multas, horas extra indevidas e passivos na fiscalização.',
                'date' => '2026-04-18',
                'read_time' => '5 min',
                'cover' => 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80&auto=format&fit=crop',
                'content' => [
                    ['type' => 'p', 'text' => 'Montar a escala não é só preencher quadros. Quando a lógica dos turnos não conversa com a convenção e com a jornada real, a empresa fica exposta a questionamentos, não só de sindicatos, mas de auditoria interna e de clientes que cobram rastreabilidade.'],
                    ['type' => 'h2', 'text' => 'Intervalos e banco de horas'],
                    ['type' => 'p', 'text' => 'A forma como o intervalo e o banco de horas são controlados costuma ser o primeiro ponto vistoriado. Ter registro claro, preferencialmente vinculado a um sistema, reduz a ambiguidade e acelera a defesa em eventual contestação.'],
                    ['type' => 'ul', 'items' => [
                        'Lançar a previsão de horário antes do fechamento da folha.',
                        'Diferenciar jornada ordinária de sobreaviso, quando houver previsão contratual.',
                        'Garantir que a troca de turno fique documentada, não só em conversa informal.',
                    ]],
                    ['type' => 'p', 'text' => 'Ferramentas de gestão de escala existem exatamente para amarrar regra, registro e previsão no mesmo fluxo. Enquanto o back office não entra, o improviso vira padrão — e aí a conformidade fica no papel, não na operação.'],
                ],
            ],
            [
                'slug' => 'lideranca-escala-nao-e-planilha',
                'blog_category_slug' => 'gestao',
                'title' => 'Liderança: por que a escala não deveria viver em planilha',
                'excerpt' => 'Planilhas ajudam no protótipo, mas não escalam com o time. Veja sinais de que a operação precisa de um ponto único de verdade.',
                'date' => '2026-04-12',
                'read_time' => '4 min',
                'cover' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80&auto=format&fit=crop',
                'content' => [
                    ['type' => 'p', 'text' => 'A planilha compartilhada foi o primeiro passo de muitas empresas. O problema começa quando a versão "final" muda cinco vezes no mesmo dia e ninguém sabe qual link é o verdadeiro.'],
                    ['type' => 'h2', 'text' => 'Sinais de que o modelo estourou'],
                    ['type' => 'ul', 'items' => [
                        'Mais de um "fonte da verdade" com números diferentes.',
                        'Líderes reprocessando a mesma informação toda segunda-feira.',
                        'Colaboradores no WhatsApp pedindo "a última versão" da semana.',
                    ]],
                    ['type' => 'p', 'text' => 'Unificar a escala em um sistema com histórico e permissão por papel tira a ambiguidade. A liderança deixa de apagar incêndio e passa a acompanhar indicadores: absenteísmo, aderência e folgas planejadas.'],
                ],
            ],
            [
                'slug' => 'absenteismo-e-cobertura',
                'blog_category_slug' => 'operacao',
                'title' => 'Absenteísmo e cobertura: como enxergar o buraco antes do apagão',
                'excerpt' => 'Antecipar faltas e regiões críticas evita reforço de última hora e desgaste com o time. Boas práticas em dados e rituais de revisão.',
                'date' => '2026-04-02',
                'read_time' => '6 min',
                'cover' => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&auto=format&fit=crop',
                'content' => [
                    ['type' => 'p', 'text' => 'Cobertura reativa gera estresse, custo em hora extra e sensação de injustiça: sempre os mesmos nomes "salvando" o turno. O caminho é cruzar histórico de faltas com picos de demanda e mapear gargalos.'],
                    ['type' => 'h2', 'text' => 'Rituais simples'],
                    ['type' => 'p', 'text' => 'Uma reunião curta semanal, olhando apenas para os três turnos com maior variância, já muda o jogo. O importante é agir com pelo menos 48h de antecedência, não na hora H.'],
                    ['type' => 'p', 'text' => 'Onde a Emplyon se encaixa: consolidar a visão da semana, avisar sobre conflito de folga e deixar regras de substituição visíveis para líderes e time — tudo isso sem trocar de ferramenta a cada ajuste.'],
                ],
            ],
            [
                'slug' => 'integracao-com-erp-ou-folha',
                'blog_category_slug' => 'tecnologia',
                'title' => 'Integração com folha: quando parar de digitar a mesma coisa duas vezes',
                'excerpt' => 'Duplicar cadastro e recalcular atrasos manualmente gera erro humano. Checklist mínimo antes de chamar o time de TI ou o fornecedor da folha.',
                'date' => '2026-03-22',
                'read_time' => '5 min',
                'cover' => 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80&auto=format&fit=crop',
                'content' => [
                    ['type' => 'p', 'text' => 'Integrar escala e folha de pagamento reduz diferenças de centavos que viram ruído em fechamento. Antes de integrar, vale alinhar o dicionário de campos: o que significa "turno" no ERP e o que a operação chama de turno no chão de fábrica.'],
                    ['type' => 'h2', 'text' => 'Checklist'],
                    ['type' => 'ul', 'items' => [
                        'Mapear eventos de folga, falta, atestado e jornada extra.',
                        'Definir quem aprova exceção e em qual sistema a exceção fica logada.',
                        'Testar um ciclo de fechamento com volume reduzido antes de ir 100% produção.',
                    ]],
                ],
            ],
            [
                'slug' => 'comunicacao-escala-time',
                'blog_category_slug' => 'pessoas',
                'title' => 'Comunicação da escala: o que o time realmente precisa saber',
                'excerpt' => 'Transparência não é encher o grupo de mensagens. É publicar a lógica, o canal oficial e a janela para contestação de forma clara e única.',
                'date' => '2026-03-10',
                'read_time' => '4 min',
                'cover' => 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80&auto=format&fit=crop',
                'content' => [
                    ['type' => 'p', 'text' => 'Escala mal comunicada gera conflito entre pares, não só com a empresa. O time precisa saber: onde ver a versão vigente, até quando pode pedir ajuste e como registrar imprevistos — sem abrir 15 conversas paralelas no WhatsApp.'],
                    ['type' => 'p', 'text' => 'Ter um repositório único (mesmo que no começo seja um PDF gerado a partir de um sistema) já reduz metade do ruído. O outro 50% vem de feedback estruturado, não de áudio em grupo.'],
                ],
            ],
            [
                'slug' => 'metricas-escala-2026',
                'blog_category_slug' => 'dados',
                'title' => 'Métricas de escala que importam em 2026 (e as que enganam dashboard)',
                'excerpt' => 'Cobertura, aderência e custo por turno: como escolher o que acompanhar sem virar refém do número errado.',
                'date' => '2026-02-28',
                'read_time' => '7 min',
                'cover' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80&auto=format&fit=crop',
                'content' => [
                    ['type' => 'p', 'text' => 'KPIs bonitos no Power BI não substituem decisão. O que pesa na escala é: você cobriu o posto, respeitou a lei e o time saiu com sensação de justiça? Se o número não liga a esses três eixos, vira jogo de cifras.'],
                    ['type' => 'h2', 'text' => 'Três indicadores com bom custo'],
                    ['type' => 'ul', 'items' => [
                        'Aderência planejada vs. realizado (não punitivo, rastreável).',
                        'Custo de hora extra / sobreaviso por unidade, mês a mês.',
                        'Solicitações de troca fora de prazo, como proxy de clareza do processo.',
                    ]],
                    ['type' => 'p', 'text' => 'Refinar a escala a partir de dados leva meses, não semanas. O primeiro passo é medir de forma confiável; o segundo, cortar o que for vanity metric.'],
                ],
            ],
            [
                'slug' => 'lgpd-dados-escala-rh',
                'blog_category_slug' => 'compliance',
                'title' => 'LGPD e dados de escala: o que o RH precisa documentar',
                'excerpt' => 'Jornada, localização e exceções geram dados sensíveis. Base legal, minimização e retenção — sem juridiquês desnecessário.',
                'date' => '2026-04-22',
                'read_time' => '6 min',
                'cover' => 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80&auto=format&fit=crop',
                'content' => [
                    ['type' => 'p', 'text' => 'Sistemas de escala guardam horários, trocas e, muitas vezes, justificativas de saúde ou ausência. Isso entra no rol de tratamento que a LGPD exige mapear: finalidade, base legal e tempo de guarda.'],
                    ['type' => 'h2', 'text' => 'Práticas que facilitam auditoria'],
                    ['type' => 'ul', 'items' => [
                        'Registrar no inventário de dados quem acessa exceções (atestados, faltas justificadas).',
                        'Evitar campos "por precaução" que não servem a decisão de escala ou folha.',
                        'Definir política de exclusão para dados de colaboradores desligados, alinhada ao jurídico.',
                    ]],
                    ['type' => 'quote', 'text' => 'Privacidade não é obstáculo à operação — é critério de desenho.'],
                    ['type' => 'p', 'text' => 'Quando o DPO e o time de produto falam a mesma língua, o sistema deixa de ser "caixa preta" e vira evidência de governança.'],
                ],
            ],
            [
                'slug' => 'onboarding-temporarios-picos',
                'blog_category_slug' => 'recursos-humanos',
                'title' => 'Onboarding de temporários em picos de demanda',
                'excerpt' => 'Black Friday, safra ou campanha: como padronizar acesso, treino mínimo e escala sem perder segurança nem clima.',
                'date' => '2026-04-20',
                'read_time' => '5 min',
                'cover' => 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80&auto=format&fit=crop',
                'content' => [
                    ['type' => 'p', 'text' => 'Temporários chegam em volume e precisam operar em dias, não semanas. A escala precisa refletir quem está apto (treino, EPI, sistema) — senão o gestor improvisa no grupo de mensagens.'],
                    ['type' => 'h2', 'text' => 'Pacote mínimo viável'],
                    ['type' => 'ul', 'items' => [
                        'Checklist único por função: quem pode ser alocado em qual turno.',
                        'Canal oficial para troca de plantão (não misturar com comunicado de marketing).',
                        'Revisão diária nos três primeiros dias de pico, não só no fim da semana.',
                    ]],
                    ['type' => 'p', 'text' => 'Automatizar a publicação da escala e o aviso de mudança reduz atrito com o time fixo, que muitas vezes absorve o treino informal dos novatos.'],
                ],
            ],
            [
                'slug' => 'turnos-12x36-checklist',
                'blog_category_slug' => 'operacao',
                'title' => 'Turnos 12x36: checklist antes de mudar a operação',
                'excerpt' => 'Mudar o regime de trabalho afeta folga, custo e negociação coletiva. O que validar com engenharia, jurídico e liderança antes do corte.',
                'date' => '2026-04-15',
                'read_time' => '7 min',
                'cover' => 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&q=80&auto=format&fit=crop',
                'content' => [
                    ['type' => 'p', 'text' => 'O 12x36 é sedutor para cobertura contínua, mas exige coerência entre convenção, limite de horas e descanso entre jornadas. O erro clássico é mudar só o quadro na parede sem atualizar sistema e folha.'],
                    ['type' => 'h2', 'text' => 'Antes de publicar a nova escala'],
                    ['type' => 'ul', 'items' => [
                        'Validar interjornada e intrajornada com o jurídico trabalhista.',
                        'Simular custo de hora extra residual por atraso de handover.',
                        'Comunicar data de vigência e congelar exceções antigas numa janela curta.',
                    ]],
                    ['type' => 'hr'],
                    ['type' => 'p', 'text' => 'Depois da virada, monitore aderência ao novo padrão por duas folhas completas. Ajuste fino com dados evita que a operação volte ao "jeitinho" em silêncio.'],
                ],
            ],
        ];

        foreach ($posts as $row) {
            $publishedAt = Carbon::parse($row['date'])->startOfDay();
            $catId = $cid($row['blog_category_slug']);

            BlogPost::query()->updateOrCreate(
                ['slug' => $row['slug']],
                [
                    'blog_category_id' => $catId,
                    'title' => $row['title'],
                    'excerpt' => $row['excerpt'],
                    'author' => 'Equipe Emplyon',
                    'read_time' => $row['read_time'],
                    'cover_image_path' => null,
                    'cover_image_external' => $row['cover'],
                    'content' => $row['content'],
                    'published' => true,
                    'published_at' => $publishedAt,
                ],
            );
        }
    }
}
