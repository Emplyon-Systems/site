/**
 * Converte a saída típica do fluxo n8n Emplyon (array com `data` parcialmente mesclado)
 * para o corpo esperado pela API de posts (`PATCH /posts/:id` ou equivalente).
 *
 * IMPORTANTE — Por que fica em "queue":
 * A API só sai da fila quando recebe um PATCH com `status: "ready"` (e `htmlContent` preenchido).
 * Se o n8n só devolve JSON aninhado para o HTTP Response da própria execução e não chama a sua API,
 * o post permanece em queue.
 *
 * No n8n: Code node → HTTP Request (PATCH) para `.../posts/{{ $json.postId }}` com este body e header
 * Authorization Bearer do token de automação (conforme a sua API).
 */

import { normalizeAutomationHtmlFragment } from '@/lib/parseAutomationHtml';

function asArray(x) {
  if (x == null) return [];
  return Array.isArray(x) ? x : [x];
}

/**
 * Junta partes como no exemplo:
 * `[{ "data": [ { content, slug, title, meta }, { images: [...] } ] }]`
 */
export function mergeN8nEmplyonDataParts(raw) {
  let merged = {};

  const roots = asArray(raw);
  for (const root of roots) {
    const row = root?.json !== undefined ? root.json : root;
    const parts = Array.isArray(row?.data) ? row.data : [];
    for (const part of parts) {
      if (part && typeof part === 'object') {
        merged = { ...merged, ...part };
      }
    }
  }

  if (Object.keys(merged).length === 0 && raw && typeof raw === 'object') {
    const row = raw.json !== undefined ? raw.json : raw;
    if (row && typeof row === 'object' && !Array.isArray(row.data)) {
      merged = { ...row };
    }
  }

  return merged;
}

function normalizeImages(images) {
  if (!Array.isArray(images)) return [];
  return images
    .map((im) => {
      if (typeof im === 'string') return { url: im.trim() };
      if (im && typeof im.url === 'string') return { url: im.url.trim() };
      return null;
    })
    .filter(Boolean);
}

/**
 * Objeto pronto para enviar à API de automação (PATCH).
 * @param {unknown} raw — Item(ns) n8n ou JSON já mesclado com title, content, slug, meta, images.
 * @param {{ postId?: string }} [opts]
 */
export function buildAutomationPostPatchFromN8n(raw) {
  const merged = mergeN8nEmplyonDataParts(raw);

  const title = String(merged.title || merged.headline || '').trim();
  const slug = String(merged.slug || '').trim();
  const idea =
    String(merged.meta || merged.idea || merged.description || merged.excerpt || '').trim();

  const htmlRaw = merged.content || merged.htmlContent || merged.body || '';
  const htmlContent = normalizeAutomationHtmlFragment(String(htmlRaw || ''), title);

  const images = normalizeImages(merged.images);

  const patch = {
    title,
    slug,
    htmlContent,
    idea,
    images,
    status: 'ready',
  };

  if (merged.formMode) patch.formMode = merged.formMode;

  return patch;
}

/**
 * Texto para colar num Code node do n8n (JavaScript sem imports).
 * Substitua POST_ID e TOKEN pela expressão do n8n (ex.: $('Webhook').item.json.postId).
 */
export function getN8nCodeNodeSnippet() {
  return `
// Entrada: items da execução anterior (merge do fluxo que devolve [{ data: [...] }])
const items = $input.all();
let merged = {};
for (const item of items) {
  const row = item.json;
  const parts = Array.isArray(row?.data) ? row.data : [];
  for (const part of parts) {
    if (part && typeof part === 'object') Object.assign(merged, part);
  }
}

const title = String(merged.title || '').trim();
const stripStyles = (html) => String(html || '').replace(/<style\\b[^>]*>[\\s\\S]*?<\\/style>/gi, '').trim();

function normalizeHtml(html, t) {
  let h = stripStyles(html);
  if (!h) return '<article><h1>' + escapeHtml(t) + '</h1></article>';
  const hasH1 = /<h1\\b/i.test(h);
  if (!hasH1 && t) {
    const titleEsc = escapeHtml(t);
    h = '<h1>' + titleEsc + '</h1>' + h;
    const h2Match = h.match(/<h2[^>]*>([\\s\\S]*?)<\\/h2>/i);
    if (h2Match && h2Match[1].replace(/<[^>]+>/g, '').trim().toLowerCase() === t.toLowerCase()) {
      h = h.replace(/<h2[^>]*>[\\s\\S]*?<\\/h2>/i, '');
    }
  }
  if (!/<article\\b/i.test(h)) h = '<article>' + h + '</article>';
  return h;
}

function escapeHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

const htmlContent = normalizeHtml(String(merged.content || ''), title);
const images = Array.isArray(merged.images)
  ? merged.images.map((im) =>
      typeof im === 'string' ? { url: im } : { url: String(im.url || '').trim() }).filter((x) => x.url)
  : [];

return [{
  json: {
    title,
    slug: String(merged.slug || '').trim(),
    htmlContent,
    idea: String(merged.meta || merged.description || '').trim(),
    images,
    status: 'ready',
    formMode: merged.formMode || 'production'
  }
}];
`.trim();
}
