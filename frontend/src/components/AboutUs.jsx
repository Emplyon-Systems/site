"use client";
import React, { useRef } from "react";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { ArrowRight } from "lucide-react";

export default function AboutUs() {
    const heroRef = useRef(null);
    const revealVariants = {
        visible: (i) => ({
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            transition: {
                delay: i * 0.1,
                duration: 0.3,
            },
        }),
        hidden: {
            filter: "blur(10px)",
            y: -20,
            opacity: 0,
        },
    };
    const scaleVariants = {
        visible: (i) => ({
            opacity: 1,
            filter: "blur(0px)",
            transition: {
                delay: i * 0.1,
                duration: 0.3,
            },
        }),
        hidden: {
            filter: "blur(10px)",
            opacity: 0,
        },
    };

    return (
        <section className="py-20 px-4 bg-white" ref={heroRef} id="quem-somos">
            <div className="max-w-6xl mx-auto">
                <div className="relative">

                    {/* Header with label */}


                    <TimelineContent
                        as="div"
                        animationNum={4}
                        timelineRef={heroRef}
                        customVariants={scaleVariants}
                        className="relative group w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl mb-12"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/40 to-transparent pointer-events-none z-10"></div>
                        <img
                            src="https://imgur.com/1FGURqx.png"
                            alt="Time da Emplyon"
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                        />
                    </TimelineContent>

                    {/* Stats Bar */}
                    <div className="flex flex-wrap lg:justify-start justify-between items-center py-6 text-sm border-b border-gray-100 mb-12">
                        <TimelineContent
                            as="div"
                            animationNum={5}
                            timelineRef={heroRef}
                            customVariants={revealVariants}
                            className="flex gap-4"
                        >
                            <div className="flex items-center gap-2 mb-2 sm:text-base text-xs">
                                <span className="text-gray-600">Escalas</span>
                                <span className="text-coral-prime font-bold">100%</span>
                                <span className="text-gray-600">conforme legislação</span>
                                <span className="text-gray-300">|</span>
                            </div>
                            <div className="flex items-center gap-2 mb-2 sm:text-base text-xs">
                                <span className="text-coral-prime font-bold">+5.000</span>
                                <span className="text-gray-600">Vidas Impactadas</span>
                            </div>
                        </TimelineContent>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <h1 className="sm:text-4xl md:text-5xl text-2xl !leading-[110%] font-bold text-deep-navy mb-8 font-heading">
                            <div className="flex flex-wrap text-4xl md:text-5xl font-bold text-deep-navy">
                                <VerticalCutReveal
                                    splitBy="characters"
                                    staggerDuration={0.1}
                                    staggerFrom="first"
                                    reverse={true}
                                    transition={{
                                        type: "spring",
                                        stiffness: 250,
                                        damping: 30,
                                        delay: 0.2,
                                    }}
                                    containerClassName="notranslate mr-2"
                                    translate="no"
                                >
                                    Emplyon:
                                </VerticalCutReveal>
                                <VerticalCutReveal
                                    splitBy="words"
                                    staggerDuration={0.1}
                                    staggerFrom="first"
                                    reverse={true}
                                    transition={{
                                        type: "spring",
                                        stiffness: 250,
                                        damping: 30,
                                        delay: 0.2,
                                    }}
                                >
                                    Tecnologia aplicada à gestão responsável de pessoas.
                                </VerticalCutReveal>
                            </div>
                        </h1>

                        <TimelineContent
                            as="div"
                            animationNum={9}
                            timelineRef={heroRef}
                            customVariants={revealVariants}
                            className="grid md:grid-cols-2 gap-8 text-gray-600"
                        >
                            <TimelineContent
                                as="div"
                                animationNum={10}
                                timelineRef={heroRef}
                                customVariants={revealVariants}
                                className="sm:text-base text-sm"
                            >
                                <p className="leading-relaxed text-justify mb-4">
                                    <span className="notranslate" translate="no">A Emplyon</span> nasceu para resolver um problema operacional ignorado por anos: escalas de trabalho ainda são feitas de forma manual, improvisada e sem padrão.
                                </p>
                                <p className="leading-relaxed text-justify mb-4">
                                    Nossa plataforma organiza jornadas, folgas e turnos com base em regras claras e conformidade legal, reduzindo erros humanos e retrabalho operacional.
                                </p>
                            </TimelineContent>
                            <TimelineContent
                                as="div"
                                animationNum={11}
                                timelineRef={heroRef}
                                customVariants={revealVariants}
                                className="sm:text-base text-sm"
                            >
                                <p className="leading-relaxed text-justify">
                                    Não substituímos a decisão do gestor. Entregamos estrutura, previsibilidade e controle para que decisões sejam tomadas com segurança.
                                </p>
                            </TimelineContent>
                        </TimelineContent>
                    </div>

                    <div className="md:col-span-1">
                        <div className="text-right md:text-right text-left mt-8 md:mt-0">
                            <div className="p-6 bg-deep-navy/5 border-l-4 border-coral-prime rounded-r-lg mb-8 text-left">
                                <p className="text-lg font-medium text-deep-navy italic">
                                    "Nossa missão é provar que alta performance operacional e qualidade de vida no trabalho podem — e devem — andar juntas."
                                </p>
                            </div>
                            <TimelineContent
                                as="div"
                                animationNum={12}
                                timelineRef={heroRef}
                                customVariants={revealVariants}
                                className="mb-2 flex justify-end md:justify-end justify-start"
                            >
                                <img
                                    src="/about-logo.png"
                                    alt="Emplyon Logo"
                                    className="h-8 w-auto object-contain"
                                />
                            </TimelineContent>
                            <TimelineContent
                                as="div"
                                animationNum={13}
                                timelineRef={heroRef}
                                customVariants={revealVariants}
                                className="text-gray-600 text-sm mb-8"
                            >
                                Gestão Inteligente
                            </TimelineContent>

                            <TimelineContent
                                as="div"
                                animationNum={14}
                                timelineRef={heroRef}
                                customVariants={revealVariants}
                                className="mb-6"
                            >
                                <p className="text-deep-navy font-medium mb-4">
                                    Pronto para transformar sua operação?
                                </p>
                            </TimelineContent>

                            <TimelineContent
                                as="a"
                                href="https://wa.me/5511962641923?text=Ol%C3%A1!%20Vim%20atrav%C3%A9s%20do%20site%20da%20Emplyon%20e%20gostaria%20de%20saber%20mais%20sobre%20as%20solu%C3%A7%C3%B5es%20de%20gest%C3%A3o%20inteligente." // Example placeholder
                                target="_blank"
                                animationNum={15}
                                timelineRef={heroRef}
                                customVariants={revealVariants}
                                className="bg-deep-navy hover:bg-deep-navy/90 shadow-lg shadow-deep-navy/20 border border-transparent flex w-fit ml-auto gap-2 hover:gap-4 transition-all duration-300 ease-in-out text-white px-6 py-3 rounded-lg cursor-pointer font-semibold items-center justify-center"
                            >
                                FALAR COM CONSULTOR <ArrowRight size={18} />
                            </TimelineContent>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
