"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const testimonials = [
    {
        id: 1,
        quote: <><span className='notranslate' translate='no'>A Emplyon</span> transformou completamente nossa gestão de escalas. Reduzimos custos e ganhamos uma agilidade que não achávamos ser possível.</>,
        author: "DBG Performance",
        role: "Parceiro Estratégico",
        avatar: "/dbg-logo-v2.png",
    },
    {
        id: 2,
        quote: "Simplesmente brilhante. A facilidade de integração com nossos sistemas de ponto e a redução de horas extras foi imediata.",
        author: "Belvanna",
        role: "Parceiro Estratégico",
        avatar: "/belvanna-logo.png",
    },
]

export function Testimonials() {
    const [activeIndex, setActiveIndex] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    const [displayedQuote, setDisplayedQuote] = useState(testimonials[0].quote)
    const [displayedRole, setDisplayedRole] = useState(testimonials[0].role)


    const handleSelect = (index) => {
        if (index === activeIndex || isAnimating) return
        setIsAnimating(true)

        setTimeout(() => {
            setDisplayedQuote(testimonials[index].quote)
            setDisplayedRole(testimonials[index].role)
            setActiveIndex(index)
            setTimeout(() => setIsAnimating(false), 400)
        }, 200)
    }

    return (
        <div className="flex flex-col items-center gap-12 py-24 bg-white overflow-hidden">
            {/* Section Header */}
            <div className="flex flex-col items-center text-center px-4 mb-4">
                <span className="px-4 py-1.5 rounded-full bg-deep-navy/5 text-deep-navy text-[10px] font-bold tracking-[0.2em] uppercase mb-4 border border-deep-navy/10">
                    Testemunhos
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-deep-navy mb-4 tracking-tight">
                    Resultados que <span className="text-deep-navy/70 italic font-serif">inspiram</span>
                </h2>
                <div className="w-12 h-1 bg-deep-navy/20 rounded-full mb-6" />
                <p className="text-gray-500 max-w-xl text-sm md:text-base font-light leading-relaxed">
                    Veja como estamos transformando a gestão de escalas e a eficiência operacional de empresas que são referência no mercado.
                </p>
            </div>

            {/* Quote Container */}
            <div className="relative px-8">
                <span className="absolute -left-2 -top-6 text-7xl font-serif text-deep-navy/10 select-none pointer-events-none">
                    "
                </span>

                <p
                    className={cn(
                        "text-2xl md:text-3xl font-light text-deep-navy text-center max-w-lg leading-relaxed transition-all duration-400 ease-out",
                        isAnimating ? "opacity-0 blur-sm scale-[0.98]" : "opacity-100 blur-0 scale-100",
                    )}
                >
                    {displayedQuote}
                </p>

                <span className="absolute -right-2 -bottom-8 text-7xl font-serif text-deep-navy/10 select-none pointer-events-none">
                    "
                </span>
            </div>

            <div className="flex flex-col items-center gap-6 mt-2">
                {/* Role text */}
                <p
                    className={cn(
                        "text-xs text-gray-500 tracking-[0.2em] uppercase transition-all duration-500 ease-out",
                        isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0",
                    )}
                >
                    {displayedRole}
                </p>

                <div className="flex items-center justify-center gap-8 md:gap-12">
                    {testimonials.map((testimonial, index) => {
                        const isActive = activeIndex === index

                        return (
                            <button
                                key={testimonial.id}
                                onClick={() => handleSelect(index)}
                                className={cn(
                                    "relative group transition-all duration-300 ease-in-out cursor-pointer",
                                    isActive
                                        ? "opacity-100 scale-110 filter-none"
                                        : "opacity-40 hover:opacity-100 hover:scale-105 grayscale"
                                )}
                            >
                                <div className="w-48 h-24 md:w-64 md:h-32 relative flex items-center justify-center">
                                    <img
                                        src={testimonial.avatar || "/placeholder.svg"}
                                        alt={testimonial.author}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
