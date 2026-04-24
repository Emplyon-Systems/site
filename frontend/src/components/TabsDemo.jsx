"use client";

import { Tabs } from "@/components/ui/tabs";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

export function TabsDemo() {
    const [titleNumber, setTitleNumber] = useState(0);
    const titles = useMemo(
        () => ["transforma processos", "elimina planilhas", "reduz custos", "otimiza escalas"],
        []
    );

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (titleNumber === titles.length - 1) {
                setTitleNumber(0);
            } else {
                setTitleNumber(titleNumber + 1);
            }
        }, 2000);
        return () => clearTimeout(timeoutId);
    }, [titleNumber, titles]);

    const tabs = [
        {
            title: "Tela Inicial",
            value: "product",
            content: (
                <div className="w-full h-full flex items-center justify-center p-2">
                    <div className="relative p-2 md:p-4 bg-deep-navy rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 shadow-2xl shadow-blue-500/20">
                        <img
                            src="https://i.imgur.com/xbhcLrh.png"
                            alt="Tela Inicial"
                            className="rounded-lg md:rounded-[1.5rem] max-h-[25rem] md:max-h-[45rem] w-auto block"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "Geração de Escala",
            value: "services",
            content: (
                <div className="w-full h-full flex items-center justify-center p-2">
                    <div className="relative p-2 md:p-4 bg-deep-navy rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 shadow-2xl shadow-blue-500/20">
                        <img
                            src="https://i.imgur.com/ffhDPrm.png"
                            alt="Geração de Escala"
                            className="rounded-lg md:rounded-[1.5rem] max-h-[25rem] md:max-h-[45rem] w-auto block"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "Escalas",
            value: "playground",
            content: (
                <div className="w-full h-full flex items-center justify-center p-2">
                    <div className="relative p-2 md:p-4 bg-deep-navy rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 shadow-2xl shadow-blue-500/20">
                        <img
                            src="https://i.imgur.com/Odka8UZ.png"
                            alt="Escalas"
                            className="rounded-lg md:rounded-[1.5rem] max-h-[25rem] md:max-h-[45rem] w-auto block"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "Setores",
            value: "content",
            content: (
                <div className="w-full h-full flex items-center justify-center p-2">
                    <div className="relative p-2 md:p-4 bg-deep-navy rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 shadow-2xl shadow-blue-500/20">
                        <img
                            src="https://i.imgur.com/35hX9h2.png"
                            alt="Setores"
                            className="rounded-lg md:rounded-[1.5rem] max-h-[25rem] md:max-h-[45rem] w-auto block"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "Financeiro",
            value: "finance",
            content: (
                <div className="w-full h-full flex items-center justify-center p-2">
                    <div className="relative p-2 md:p-4 bg-deep-navy rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 shadow-2xl shadow-blue-500/20">
                        <img
                            src="https://i.imgur.com/SRAPmWV.png"
                            alt="Financeiro"
                            className="rounded-lg md:rounded-[1.5rem] max-h-[25rem] md:max-h-[45rem] w-auto block"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "Colaboradores",
            value: "employees",
            content: (
                <div className="w-full h-full flex items-center justify-center p-2">
                    <div className="relative p-2 md:p-4 bg-deep-navy rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 shadow-2xl shadow-blue-500/20">
                        <img
                            src="https://i.imgur.com/c2mPRVx.png"
                            alt="Colaboradores"
                            className="rounded-lg md:rounded-[1.5rem] max-h-[25rem] md:max-h-[45rem] w-auto block"
                        />
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className="h-[45rem] md:h-[60rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full items-center justify-center mt-10 mb-40">
            <h2 className="text-3xl md:text-5xl font-bold text-deep-navy mb-8 mx-auto text-center w-full">
                <span className="text-deep-navy">O software que</span>
                <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1 h-24 md:h-32">
                    &nbsp;
                    {titles.map((title, index) => (
                        <motion.span
                            key={index}
                            className="absolute font-semibold text-royal-blue whitespace-nowrap w-full left-0 top-0 text-center"
                            initial={{ opacity: 0, y: 50 }}
                            transition={{ type: "spring", stiffness: 50 }}
                            animate={
                                titleNumber === index
                                    ? {
                                        y: 0,
                                        opacity: 1,
                                    }
                                    : {
                                        y: titleNumber > index ? -50 : 50,
                                        opacity: 0,
                                    }
                            }
                        >
                            {title}
                        </motion.span>
                    ))}
                </span>
            </h2>
            <Tabs tabs={tabs} />
        </div>
    );
}


