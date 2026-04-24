import React from 'react';
import { Shield, Users, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import GradientCardShowcase from '@/components/ui/gradient-card-showcase';

const RealEconomy = () => {
    const cards = [
        {
            title: 'Controle Operacional',
            desc: 'Centralize escalas, jornadas e folgas em um único lugar, com visibilidade clara da operação e menos dependência de ajustes manuais.',
            gradientFrom: '#FE6959',
            gradientTo: '#FE6959',
            icon: <TrendingUp size={32} />,
            action: <span className="text-4xl font-bold">100% <span className="text-sm font-normal block">visibilidade</span></span>
        },
        {
            title: 'Criação Rápida de Escalas',
            desc: 'Escalas criadas em minutos, seguindo regras definidas pelo gestor, sem retrabalho e sem planilhas paralelas.',
            gradientFrom: '#FE6959',
            gradientTo: '#FE6959',
            icon: <Zap size={32} />
        },
        {
            title: 'Conformidade Trabalhista',
            desc: 'Validação de regras de jornada, folgas e descanso semanal conforme legislação, reduzindo risco de erros e inconsistências.',
            gradientFrom: '#FE6959',
            gradientTo: '#FE6959',
            icon: <Shield size={32} />,
            action: <span className="text-4xl font-bold">100% <span className="text-sm font-normal block">conformidade</span></span>
        },
        {
            title: 'Gestão Sem Improviso',
            desc: 'Retire a escala do improviso e devolva tempo para que gestores atuem na liderança, não na correção de planilhas.',
            gradientFrom: '#FE6959',
            gradientTo: '#FE6959',
            icon: <Users size={32} />
        },
    ];

    return (
        <section className="bg-[#012D5A] py-16 md:py-32 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl transform-gpu" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl transform-gpu" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center max-w-4xl mx-auto mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-white mb-6 font-heading tracking-tight"
                    >
                        O “Efeito{' '}<span className="notranslate" translate="no">Emplyon</span>”: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Menos improviso. Mais controle.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
                    >
                        Não é mágica, é gestão inteligente. Veja como transformamos sua realidade.
                    </motion.p>
                </div>

                <div className="mt-10">
                    <GradientCardShowcase cards={cards} />
                </div>
            </div>
        </section>
    );
};

export default RealEconomy;
