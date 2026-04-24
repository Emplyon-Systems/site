import React from 'react';
import { ArrowRight } from 'lucide-react';

const CallToAction = () => {
    return (
        <section className="py-20 bg-deep-navy relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-royal-blue/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-coral-prime/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

            {/* Custom Background Image */}
            <div
                className="absolute inset-0 z-0 opacity-40 blur-sm pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage: 'url("https://i.imgur.com/1FGURqx.png")', // Using direct image link if possible, assuming user provided imgur link works as image source. The user link was https://imgur.com/1FGURqx so likely https://i.imgur.com/1FGURqx.png or .jpg. I will try to use the generic link but usually specifically distinct files needed. Actually Imgur page links don't work in bg, need direct link.
                    // User gave: https://imgur.com/1FGURqx
                    // Direct link usually: https://i.imgur.com/1FGURqx.png
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold font-heading text-white mb-6 leading-tight">
                    Quanto tempo sua liderança ainda perde montando escala ?
                </h2>
                <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                    Veja como <span className="notranslate" translate="no">a Emplyon</span> organiza escalas com regras claras, conformidade legal e menos improviso no dia a dia da operação.
                </p>

                <a
                    href="https://wa.me/5511962641923?text=Ol%C3%A1!%20Vim%20atrav%C3%A9s%20do%20site%20da%20Emplyon%20e%20gostaria%20de%20saber%20mais%20sobre%20as%20solu%C3%A7%C3%B5es%20de%20gest%C3%A3o%20inteligente."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-royal-blue hover:bg-blue-600 text-white px-10 py-5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 hover:ring-4 ring-blue-500/30 group"
                >
                    Falar com Especialista
                    <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </a>

            </div>
        </section>
    );
};

export default CallToAction;
