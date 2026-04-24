import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X, Check, Settings2, ChevronDown, ChevronUp } from 'lucide-react';

const STORAGE_KEY = 'emplyon_cookie_consent';

function loadConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveConsent(prefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...prefs, savedAt: Date.now() }));
  } catch { /* noop */ }
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [prefs, setPrefs] = useState({ essential: true, analytics: false, marketing: false });

  useEffect(() => {
    const consent = loadConsent();
    if (!consent) {
      // Pequeno delay para não aparecer instantaneamente no carregamento
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  if (!visible) return null;

  const acceptAll = () => {
    const full = { essential: true, analytics: true, marketing: true };
    saveConsent(full);
    setVisible(false);
  };

  const acceptEssential = () => {
    const essential = { essential: true, analytics: false, marketing: false };
    saveConsent(essential);
    setVisible(false);
  };

  const savePrefs = () => {
    saveConsent(prefs);
    setVisible(false);
  };

  const toggle = (key) => {
    if (key === 'essential') return; // Essenciais não podem ser desligados
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  };

  return (
    <>
      {/* Overlay translúcido (só no mobile) */}
      <div className="fixed inset-0 bg-black/20 z-[998] md:hidden" onClick={acceptEssential} />

      {/* Banner */}
      <div
        role="dialog"
        aria-label="Preferências de cookies"
        className="fixed bottom-0 inset-x-0 md:bottom-6 md:left-auto md:right-6 md:max-w-sm z-[999] shadow-2xl"
      >
        <div className="bg-white border border-gray-100 rounded-t-3xl md:rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-royal-blue/10 rounded-xl flex items-center justify-center">
                <Cookie className="w-4 h-4 text-royal-blue" />
              </div>
              <span className="font-heading font-bold text-deep-navy text-sm">Cookies</span>
            </div>
            <button
              onClick={acceptEssential}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              aria-label="Aceitar apenas essenciais e fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Corpo */}
          <div className="px-5 pb-2">
            <p className="text-xs text-gray-500 leading-relaxed">
              Usamos cookies para melhorar sua experiência, analisar o tráfego e personalizar conteúdo.{' '}
              <Link to="/cookies" className="text-royal-blue hover:underline">
                Saiba mais
              </Link>
              .
            </p>

            {/* Preferências expandidas */}
            {expanded && (
              <div className="mt-4 space-y-3 border-t border-gray-50 pt-4">
                {[
                  { key: 'essential', label: 'Essenciais', desc: 'Necessários para o site funcionar.', locked: true },
                  { key: 'analytics', label: 'Analytics', desc: 'Ajudam a melhorar o site.', locked: false },
                  { key: 'marketing', label: 'Marketing', desc: 'Anúncios personalizados.', locked: false },
                ].map(({ key, label, desc, locked }) => (
                  <div key={key} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-deep-navy">{label}</p>
                      <p className="text-xs text-gray-400">{desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggle(key)}
                      aria-pressed={prefs[key]}
                      disabled={locked}
                      className={`relative shrink-0 w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue ${
                        prefs[key] ? 'bg-royal-blue' : 'bg-gray-200'
                      } ${locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                          prefs[key] ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Toggle personalizar */}
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-3 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Settings2 className="w-3.5 h-3.5" />
              {expanded ? 'Ocultar preferências' : 'Personalizar'}
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Botões */}
          <div className="px-5 pb-5 pt-3 flex flex-col sm:flex-row gap-2 mt-1">
            <button
              onClick={acceptEssential}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Só essenciais
            </button>
            {expanded ? (
              <button
                onClick={savePrefs}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-deep-navy text-white text-xs font-semibold hover:bg-blue-900 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                Salvar
              </button>
            ) : (
              <button
                onClick={acceptAll}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-royal-blue text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                Aceitar tudo
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CookieBanner;
