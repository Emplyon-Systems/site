/**
 * URL canónica do site (produção). Em dev, ainda assim usada para og:url e JSON-LD.
 * Defina VITE_SITE_URL no build de produção se o domínio for outro.
 */
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://www.emplyon.com').replace(/\/$/, '');

/** Imagem OG padrão (absoluta). Substitua por asset em /public quando tiver 1200×630. */
export const DEFAULT_OG_IMAGE = 'https://i.imgur.com/SRAPmWV.png';

export const SITE_NAME = 'Emplyon';

export const DEFAULT_DESCRIPTION =
  'Elimine o caos das escalas manuais. A Emplyon garante conformidade trabalhista, reduz custos operacionais e otimiza a gestão de equipas com inteligência artificial.';

export const DEFAULT_KEYWORDS =
  'gestão de escalas, escalas de trabalho, conformidade trabalhista, controle de ponto, RH, gestão de pessoas, automação de escalas, Emplyon';

/** Garante URL absoluta para Open Graph e schema.org */
export function absoluteUrl(href) {
  if (href == null || href === '') return DEFAULT_OG_IMAGE;
  const s = String(href).trim();
  if (/^https?:\/\//i.test(s)) return s;
  const path = s.startsWith('/') ? s : `/${s}`;
  return `${SITE_URL}${path}`;
}

export function canonicalUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${p === '//' ? '/' : p}`;
}
