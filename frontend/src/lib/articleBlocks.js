/** Tipos de bloco alinhados com `BlogContent` + extensões (quote, hr, image). */

export function newBlock(type) {
  const id = `blk-${crypto.randomUUID()}`;
  switch (type) {
    case 'h2':
      return { id, type: 'h2', text: '' };
    case 'ul':
      return { id, type: 'ul', items: [''] };
    case 'quote':
      return { id, type: 'quote', text: '' };
    case 'hr':
      return { id, type: 'hr' };
    case 'image':
      return { id, type: 'image', src: '', alt: '', caption: '' };
    default:
      return { id, type: 'p', text: '' };
  }
}

export function ensureBlockIds(blocks) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return [newBlock('p')];
  }
  return blocks.map((b) => ({
    ...b,
    id: b.id ?? `blk-${crypto.randomUUID()}`,
  }));
}

export function convertBlock(block, newType) {
  if (block.type === newType) return { ...block };

  const id = block.id ?? `blk-${crypto.randomUUID()}`;
  const text = typeof block.text === 'string' ? block.text : '';
  const items = Array.isArray(block.items) ? block.items : [];
  const src = typeof block.src === 'string' ? block.src : '';
  const alt = typeof block.alt === 'string' ? block.alt : '';
  const caption = typeof block.caption === 'string' ? block.caption : '';

  if (newType === 'p') {
    if (block.type === 'image') {
      return {
        id,
        type: 'p',
        text: [caption, alt].filter(Boolean).join('\n\n') || '',
      };
    }
    return {
      id,
      type: 'p',
      text: text || items.filter(Boolean).join('\n\n'),
    };
  }
  if (newType === 'h2') {
    if (block.type === 'image') {
      return { id, type: 'h2', text: caption || alt || '' };
    }
    return {
      id,
      type: 'h2',
      text: text || items[0] || '',
    };
  }
  if (newType === 'ul') {
    if (block.type === 'image') {
      const line = caption || alt;
      return { id, type: 'ul', items: line ? [line] : [''] };
    }
    const lines = text ? text.split(/\n+/).map((s) => s.trim()).filter(Boolean) : items.filter(Boolean);
    return {
      id,
      type: 'ul',
      items: lines.length ? lines : [''],
    };
  }
  if (newType === 'quote') {
    if (block.type === 'image') {
      return { id, type: 'quote', text: caption || alt || '' };
    }
    return {
      id,
      type: 'quote',
      text: text || items.join(' '),
    };
  }
  if (newType === 'hr') {
    return { id, type: 'hr' };
  }
  if (newType === 'image') {
    return {
      id,
      type: 'image',
      src: block.type === 'image' ? src : '',
      alt: block.type === 'image'
        ? alt
        : (text || items.join(' ') || '').slice(0, 500),
      caption: block.type === 'image' ? caption : '',
    };
  }
  return { id, type: 'p', text: text || '' };
}

const BLOCK_LABELS = {
  p: 'Parágrafo',
  h2: 'Título (H2)',
  ul: 'Lista com marcadores',
  quote: 'Citação',
  hr: 'Separador',
  image: 'Imagem',
};

export function blockTypeLabel(type) {
  return BLOCK_LABELS[type] ?? type;
}

export function countWordsInBlocks(blocks) {
  if (!Array.isArray(blocks)) return 0;
  let n = 0;
  for (const b of blocks) {
    if (b.type === 'p' || b.type === 'h2' || b.type === 'quote') {
      n += countWords(b.text || '');
    }
    if (b.type === 'ul' && Array.isArray(b.items)) {
      for (const li of b.items) {
        n += countWords(li || '');
      }
    }
    if (b.type === 'image' && typeof b.caption === 'string') {
      n += countWords(b.caption);
    }
  }
  return n;
}

function countWords(s) {
  return String(s)
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function suggestReadMinutes(blocks, excerpt = '') {
  const w = countWordsInBlocks(blocks) + countWords(excerpt || '');
  return Math.max(1, Math.round(w / 200));
}
