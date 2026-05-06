/**
 * Parser HTML da automação (WordPress / IA): extrai blocos para o editor e para o blog público.
 */

/** Remove blocos <style> que às vezes vêm no HTML gerado. */
export function stripAutomationStyleTags(html) {
  if (!html || typeof html !== 'string') return '';
  return html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').trim();
}

function normalizeHeadingText(s) {
  return String(s || '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

/**
 * Garante um H1 para compatibilidade com o editor antigo e remove H2 duplicado do título.
 * Envolve em <article> se o fragmento não tiver estrutura semântica.
 */
export function normalizeAutomationHtmlFragment(html, title = '') {
  const stripped = stripAutomationStyleTags(html);
  if (!stripped || typeof DOMParser === 'undefined') {
    const safeTitle = String(title || '').trim();
    return safeTitle ? `<article><h1>${escapeHtmlMinimal(safeTitle)}</h1></article>` : '';
  }

  const doc = new DOMParser().parseFromString(stripped, 'text/html');
  const titleNorm = normalizeHeadingText(title);

  if (!doc.body.querySelector('h1') && title) {
    const h1 = doc.createElement('h1');
    h1.textContent = title.trim();
    doc.body.insertBefore(h1, doc.body.firstChild);
    const firstH2 = doc.body.querySelector('h2');
    if (
      firstH2 &&
      titleNorm &&
      normalizeHeadingText(firstH2.textContent || '') === titleNorm
    ) {
      firstH2.remove();
    }
  }

  if (!doc.body.querySelector('article')) {
    const art = doc.createElement('article');
    while (doc.body.firstChild) {
      art.appendChild(doc.body.firstChild);
    }
    doc.body.appendChild(art);
  }

  return doc.body.innerHTML;
}

function escapeHtmlMinimal(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Campo head + blocos para AdminAutomationEditorPage.
 * O primeiro <p> passa a ser só “Head (abertura)”; o restante da sequência vira blocos (inclui h2, listas).
 */
export function parseHtmlToStructuredFields(html, fallbackTitle = '') {
  if (!html || typeof html !== 'string' || typeof DOMParser === 'undefined') {
    return {
      headText: '',
      contentText: '',
      blocks: [{ type: 'p', text: fallbackTitle.trim() || '' }],
    };
  }

  const doc = new DOMParser().parseFromString(stripAutomationStyleTags(html), 'text/html');
  const candidates = doc.body.querySelectorAll('h1, h2, h3, h4, p, ul, blockquote');
  const titleHint = fallbackTitle.trim();

  let headText = '';
  let sawFirstP = false;
  const blocks = [];

  for (const el of candidates) {
    if (el.tagName.toLowerCase() !== 'ul' && el.closest('ul')) continue;

    const tag = el.tagName.toLowerCase();

    if (tag === 'h1') continue;

    if (tag === 'h2' || tag === 'h3' || tag === 'h4') {
      const text = el.textContent?.trim() || '';
      if (titleHint && normalizeHeadingText(text) === normalizeHeadingText(titleHint)) {
        continue;
      }
      blocks.push({ type: 'h2', text });
      continue;
    }

    if (tag === 'p') {
      const parts = splitIntoParts(el);
      if (!parts.length) continue;
      if (!sawFirstP) {
        headText = parts[0];
        sawFirstP = true;
        for (const text of parts.slice(1)) {
          blocks.push({ type: 'p', text });
        }
        continue;
      }
      for (const text of parts) {
        blocks.push({ type: 'p', text });
      }
      continue;
    }

    if (tag === 'ul') {
      const items = Array.from(el.querySelectorAll(':scope > li'))
        .map((li) => li.textContent?.trim() || '')
        .filter(Boolean);
      if (items.length) blocks.push({ type: 'ul', items });
      continue;
    }

    if (tag === 'blockquote') {
      const text = el.textContent?.trim() || '';
      if (text) blocks.push({ type: 'quote', text });
    }
  }

  const bodyBlocks =
    blocks.length > 0 ? blocks : [{ type: 'p', text: fallbackTitle.trim() || '' }];

  return {
    headText,
    contentText: bodyBlocks
      .filter((b) => b.type === 'p')
      .map((b) => b.text)
      .join('\n\n'),
    blocks: bodyBlocks,
  };
}

/**
 * Extrai o texto de um elemento preservando quebras de linha geradas por <br>.
 * O textContent nativo ignora <br>, perdendo a separação entre parágrafos inline.
 */
function getTextWithBreaks(el) {
  let out = '';
  for (const node of el.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      out += node.textContent;
    } else if (node.nodeName.toLowerCase() === 'br') {
      out += '\n';
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      out += getTextWithBreaks(node);
    }
  }
  return out;
}

/**
 * Divide o texto de um elemento em partes separadas por quebras duplas.
 * Permite que um único <p> com <br><br> ou \n\n produza múltiplos blocos p.
 */
function splitIntoParts(el) {
  const raw = getTextWithBreaks(el);
  return raw
    .split(/\n{2,}/)
    .map((s) => s.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

/**
 * Blog público: converte HTML da automação em blocos JSON (parágrafos + listas + subtítulos).
 */
export function automationHtmlToBlogBlocks(html, fallbackTitle = '') {
  if (!html || typeof html !== 'string' || typeof DOMParser === 'undefined') {
    const t = fallbackTitle.trim();
    return [{ type: 'p', text: t || 'Artigo disponível na área principal.' }];
  }

  const doc = new DOMParser().parseFromString(stripAutomationStyleTags(html), 'text/html');
  const titleFromH1 = doc.body.querySelector('h1')?.textContent?.trim() || '';
  const normalizedTitle = (titleFromH1 || fallbackTitle || '').trim().toLowerCase();
  const blocks = [];

  const candidates = doc.body.querySelectorAll('h1, h2, h3, h4, p, ul, ol, blockquote, div');

  for (const el of candidates) {
    const tag = el.tagName.toLowerCase();

    // Evitar processar elementos filhos de listas
    if (tag !== 'ul' && tag !== 'ol' && el.closest('ul, ol')) continue;

    // Evitar processar divs aninhados (só o div mais externo com texto direto)
    if (tag === 'div' && el.closest('div')) continue;

    if (tag === 'h1') continue;

    if (tag === 'h2' || tag === 'h3' || tag === 'h4') {
      const text = el.textContent?.trim() || '';
      if (
        titleFromH1 &&
        normalizeHeadingText(text) === normalizeHeadingText(titleFromH1) &&
        blocks.length === 0
      ) {
        continue;
      }
      if (text) blocks.push({ type: 'h2', text });
      continue;
    }

    if (tag === 'p' || tag === 'div') {
      // Para divs, só processar se não contém blocos-filhos reconhecidos
      if (tag === 'div' && el.querySelector('h2, h3, h4, p, ul, ol, blockquote')) continue;

      // Divide em partes para lidar com <br><br> ou \n\n dentro de um único elemento
      const parts = splitIntoParts(el);
      for (const text of parts) {
        const skipDup =
          blocks.length === 0 &&
          text.toLowerCase() === normalizedTitle &&
          normalizedTitle.length > 0;
        if (!skipDup) blocks.push({ type: 'p', text });
      }
      continue;
    }

    if (tag === 'ul' || tag === 'ol') {
      const items = Array.from(el.querySelectorAll(':scope > li'))
        .map((li) => li.textContent?.trim() || '')
        .filter(Boolean);
      if (items.length) blocks.push({ type: tag === 'ol' ? 'ol' : 'ul', items });
      continue;
    }

    if (tag === 'blockquote') {
      const text = el.textContent?.trim() || '';
      if (text) blocks.push({ type: 'quote', text });
    }
  }

  const result =
    blocks.length > 0
      ? blocks
      : [{ type: 'p', text: fallbackTitle.trim() || 'Artigo disponível na área principal.' }];

  return result.map(({ type, text, items }) => ({
    type,
    ...(typeof text === 'string' ? { text } : {}),
    ...(Array.isArray(items) ? { items } : {}),
  }));
}
