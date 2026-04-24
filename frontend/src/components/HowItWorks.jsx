import React from 'react';
import { Bot, Link as LinkIcon, PiggyBank, Smile, Shield } from 'lucide-react';
import RadialOrbitalTimeline from '@/components/ui/radial-orbital-timeline';

const pillars = [
    {
        id: 1,
        title: "Criação Automática",
        date: "Pilar 1",
        content: <>Adeus, planilhas. O algoritmo da{' '}<span className='notranslate' translate='no'>Emplyon</span>{' '}gera a escala ideal em segundos, respeitando regras, folgas e competências técnicas de cada colaborador.</>,
        category: "Automation",
        icon: Bot,
        relatedIds: [2, 3],
        status: "completed",
        energy: 95,
    },
    {
        id: 2,
        title: "Equidade e Bem-Estar",
        date: "Pilar 2",
        content: "A tecnologia distribui folgas e finais de semana de forma justa. Isso reduz drasticamente o estresse da equipa e o turnover.",
        category: "Wellbeing",
        icon: Smile,
        relatedIds: [3],
        status: "pending",
        energy: 85,
    },
    {
        id: 3,
        title: "Segurança Jurídica",
        date: "Pilar 3",
        content: <>Blindagem total da operação. <span className='notranslate' translate='no'>A Emplyon</span> bloqueia escalas que violem a CLT ou regras sindicais específicas, protegendo a sua empresa.</>,
        category: "Compliance",
        icon: Shield,
        relatedIds: [1, 2],
        status: "pending",
        energy: 100,
    }
];

const HowItWorks = () => {
    return (
        <section id="como-funciona" className="py-20 bg-deep-navy relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-royal-blue/20 rounded-full blur-[128px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-10 md:mb-16 max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        A{' '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Inteligência Artificial</span>{' '}da{' '}<span className="notranslate" translate="no">Emplyon</span>{' '}aplicada à sua Gestão.
                    </h2>
                    <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                        <span className="notranslate" translate="no">A Emplyon</span> organiza escalas de trabalho com base em regras claras, padrões operacionais e conformidade legal.
                        A plataforma transforma processos manuais e frágeis em uma gestão estruturada, previsível e auditável.
                    </p>
                </div>

                <div className="w-full">
                    <h3 className="text-2xl md:text-3xl font-bold text-center text-coral-prime mb-4 md:mb-12">Os 3 Pilares de Eficiência da{' '}<span className="notranslate" translate="no">Emplyon</span>:</h3>
                    <RadialOrbitalTimeline timelineData={pillars} />
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
