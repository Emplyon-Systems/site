import React, { Suspense } from 'react';
import GenerativeMountainScene from '@/components/ui/mountain-scene';
import { SiteHeader } from '@/components/SiteHeader';
import { Button } from '@/components/ui/button';
import { AnimatedGroup } from '@/components/ui/animated-group';

import { ContainerScroll } from '@/components/ui/container-scroll-animation';

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
};

export function HeroSection() {
    return (
        <>
            <SiteHeader />
            <main className="relative overflow-hidden bg-white pt-0 md:pt-0">
                <div className="absolute inset-0 z-0">
                    <Suspense fallback={<div className="w-full h-full bg-slate-50" />}>
                        <GenerativeMountainScene />
                    </Suspense>
                </div>
                <section className="relative pt-20 md:pt-0">
                    <ContainerScroll
                        titleComponent={
                            <div className="flex flex-col items-center justify-center">
                                <AnimatedGroup variants={transitionVariants}>
                                    <h1
                                        className="mt-2 md:mt-8 max-w-4xl mx-auto text-balance text-3xl md:text-5xl lg:mt-16 xl:text-6xl font-heading font-bold text-deep-navy tracking-tight">
                                        Escalas mal feitas geram erro, retrabalho e risco trabalhista.
                                    </h1>
                                    <p
                                        className="mx-auto mt-8 max-w-2xl text-balance text-lg text-gray-600 font-light text-center notranslate"
                                        translate="no">
                                        A Emplyon elimina improvisos na escala, garante conformidade com a lei e reduz o tempo perdido com ajustes manuais.
                                    </p>
                                </AnimatedGroup>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-8 md:mt-12 flex flex-col items-center justify-center gap-4 md:flex-row">
                                    <div
                                        key={1}
                                        className="p-1 rounded-[14px] via-royal-blue/20">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="rounded-xl px-8 text-base shadow-xl bg-royal-blue hover:bg-royal-blue/90 text-white">
                                            <a href="#orcamento">
                                                <span className="text-nowrap">Falar com Especialista</span>
                                            </a>
                                        </Button>
                                    </div>
                                </AnimatedGroup>
                            </div>
                        }
                    >
                        <div className="w-full h-auto md:h-full bg-transparent md:bg-white p-0 md:p-4 flex flex-col items-center justify-center">
                            {/* Mock Dashboard UI adapted for the card */}
                            <img
                                src="https://i.imgur.com/SRAPmWV.png"
                                alt="Plataforma Emplyon"
                                className="w-full h-full object-contain"
                                fetchPriority="high"
                                loading="eager"
                            />
                        </div>
                    </ContainerScroll>
                </section>

            </main>
        </>
    );
}
