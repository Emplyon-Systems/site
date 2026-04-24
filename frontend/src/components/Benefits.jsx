import React from 'react';
import { AlertTriangle, Banknote, UserMinus, Clock } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { BentoGrid } from '@/components/ui/bento-grid';
import { Globe } from '@/components/ui/globe';

const painPoints = [
    {
        icon: <AlertTriangle className="w-4 h-4 text-coral-prime" />,
        title: "Erro humano é inevitável. O risco é assumir isso como processo.",
        description: "Escalas manuais geram falhas recorrentes que expõem a empresa a passivos trabalhistas, autuações e questionamentos jurídicos.",
        status: "Risco",
        tags: ["Conformidade", "Multas"],
        hasPersistentHover: true,
        meta: "Crítico"
    },
    {
        icon: <Banknote className="w-4 h-4 text-coral-prime" />,
        title: "Horas extras sem controle não aparecem no dia. Aparecem no fechamento.",
        description: "Falta de padronização na escala dificulta o planejamento e compromete a previsibilidade da jornada.",
        status: "Perda",
        tags: ["Finanças", "Extras"],
        meta: "-$$$"
    },
    {
        icon: <UserMinus className="w-4 h-4 text-coral-prime" />,
        title: "Escalas desequilibradas desgastam quem trabalha e afastam quem fica.",
        description: "Distribuição irregular de jornadas gera sobrecarga, insatisfação e pedidos de desligamento.",
        tags: ["RH", "Retenção"],
        meta: "Alerta"
    },
    {
        icon: <Clock className="w-4 h-4 text-coral-prime" />,
        title: "Tempo de gestão não deveria ser consumido montando escala.",
        description: "Horas gastas ajustando planilhas e corrigindo erros poderiam ser usadas para gerir pessoas e operação.",
        status: "Ineficiente",
        tags: ["Gestão", "Tempo"],
        meta: "Lento"
    }
];

const Benefits = () => {
    return (
        <section id="beneficios" className="py-20 bg-gray-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <AnimatedContainer className="text-center max-w-3xl mx-auto mb-32 md:mb-64 relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-deep-navy mb-4">
                        Sua operação ainda depende de planilhas manuais e “jeitinhos” para montar escalas?
                    </h2>
                </AnimatedContainer>

                <div className="relative w-full">
                    {/* Globe Layer - Absolute behind BentoGrid */}
                    <div className="absolute top-[-300px] inset-x-0 w-full h-[1000px] z-0 opacity-40 pointer-events-none flex justify-center">
                        <Globe className="top-0" />
                        {/* Gradient masks to blend edges */}
                        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gray-50 to-transparent"></div>
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
                    </div>

                    {/* Cards Layer - Relative on top */}
                    <AnimatedContainer delay={0.2} className="relative z-10">
                        <BentoGrid items={painPoints} />
                    </AnimatedContainer>
                </div>
            </div>
        </section>
    );
};

function AnimatedContainer({ className, delay = 0.1, children }) {
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
            whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.8 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export default Benefits;
