import React from 'react';
import { cn } from '@/lib/utils';

export default function GradientCardShowcase({ cards, className }) {
    return (
        <div className={cn("flex justify-center items-center flex-wrap gap-8 py-10", className)}>
            {cards.map(({ title, desc, gradientFrom, gradientTo, icon: Icon, action }, idx) => (
                <div
                    key={idx}
                    className="group relative w-[320px] h-[400px] transition-all duration-500"
                >
                    {/* Skewed gradient panels */}
                    <span
                        className="absolute top-0 left-[20px] w-3/4 h-full rounded-2xl transform-gpu skew-x-[10deg] transition-all duration-500 group-hover:skew-x-0 group-hover:left-[10px] group-hover:w-[calc(100%-20px)]"
                        style={{
                            background: `linear-gradient(315deg, ${gradientFrom}, ${gradientTo})`,
                        }}
                    />
                    <span
                        className="absolute top-0 left-[20px] w-3/4 h-full rounded-2xl transform-gpu skew-x-[10deg] blur-[30px] transition-all duration-500 group-hover:skew-x-0 group-hover:left-[10px] group-hover:w-[calc(100%-20px)]"
                        style={{
                            background: `linear-gradient(315deg, ${gradientFrom}, ${gradientTo})`,
                        }}
                    />

                    {/* Animated blurs - Optimized: Removed backdrop-blur */}
                    <span className="pointer-events-none absolute inset-0 z-10">
                        <span className="absolute top-0 left-0 w-0 h-0 rounded-full opacity-0 bg-white/20 transition-all duration-500 group-hover:top-[-20px] group-hover:left-[20px] group-hover:w-[80px] group-hover:h-[80px] group-hover:opacity-100" />
                        <span className="absolute bottom-0 right-0 w-0 h-0 rounded-full opacity-0 bg-white/20 transition-all duration-500 delay-100 group-hover:bottom-[-20px] group-hover:right-[20px] group-hover:w-[80px] group-hover:h-[80px] group-hover:opacity-100" />
                    </span>

                    {/* Content - Optimized: Removed backdrop-blur to prevent flickering */}
                    <div className="relative z-20 left-0 h-full flex flex-col justify-between p-8 bg-white/10 border border-white/20 shadow-xl rounded-2xl text-white transform-gpu transition-all duration-500 group-hover:left-[-10px] group-hover:scale-[1.02]">
                        <div>
                            {Icon && <div className="mb-4 text-white drop-shadow-md">{Icon}</div>}
                            <h2 className="text-2xl font-bold mb-4 drop-shadow-sm">{title}</h2>
                            <p className="text-base leading-relaxed opacity-90">{desc}</p>
                        </div>
                        {action && (
                            <div className="mt-4">
                                {action}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
