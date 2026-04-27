import {
  adminListPosts,
  adminListCategories,
  adminSavePost,
  buildPostFormData,
} from '@/lib/blogApi';
import { slugify } from '@/lib/slugify';

/**
 * Extrai parágrafos do HTML gerado pela automação para os blocos do editor/blog.
 */
export function automationHtmlToBlogBlocks(html, fallbackTitle = '') {
  if (!html || typeof html !== 'string' || typeof DOMParser === 'undefined') {
    const t = fallbackTitle.trim();
    return [{ type: 'p', text: t || 'Artigo disponível na área principal.' }];
  }

  const doc = new DOMParser().parseFromString(html, 'text/html');
  const titleNode = doc.body.querySelector('h1');
  const titleFromHtml = titleNode?.textContent?.trim() || '';

  const paragraphs = Array.from(doc.body.querySelectorAll('p'))
    .map((p) => p.textContent?.trim() || '')
    .filter(Boolean);

  const normalizedTitle = (titleFromHtml || fallbackTitle || '').trim().toLowerCase();
  const cleanParagraphs = paragraphs.filter(
    (p, idx) => !(idx === 0 && p.trim().toLowerCase() === normalizedTitle),
  );

  const blocks =
    cleanParagraphs.length > 0
      ? cleanParagraphs.map((text) => ({ type: 'p', text }))
      : [{ type: 'p', text: fallbackTitle.trim() || 'Artigo disponível na área principal.' }];

  return blocks.map(({ type, text, items, src, alt, caption }) => ({
    type,
    ...(typeof text === 'string' ? { text } : {}),
    ...(Array.isArray(items) ? { items } : {}),
    ...(typeof src === 'string' ? { src } : {}),
    ...(typeof alt === 'string' ? { alt } : {}),
    ...(typeof caption === 'string' ? { caption } : {}),
  }));
}

function excerptFromAutomation(post, blocks) {
  const idea = typeof post.idea === 'string' ? post.idea.trim() : '';
  if (idea.length >= 40) return idea.slice(0, 500);

  const firstBlock = blocks.find((b) => b.type === 'p' && typeof b.text === 'string' && b.text.trim());
  const fromBody = firstBlock?.text?.trim?.() ?? '';
  if (fromBody.length >= 40) return fromBody.slice(0, 500);

  const title = post.title?.trim?.() || post.researchQuery?.trim?.() || '';
  return title.slice(0, 500);
}

/** Remove ids locais antes de gravar JSON no Laravel (opcional nos blocos). */
function stripOptionalIds(blocks) {
  return blocks.map((b) => {
    const { id: _id, ...rest } = b;
    return rest;
  });
}

/**
 * Garante um artigo Laravel (`blog_posts`) espelhando um post da automação, para aparecer em /blog.
 * Cria ou atualiza por `slug` do post de automação.
 */
export async function upsertBlogPostFromAutomation(token, automationPost) {
  if (!token || !automationPost || typeof automationPost !== 'object') {
    throw new Error('Dados inválidos para sincronizar o artigo.');
  }

  const title =
    automationPost.title?.trim() || automationPost.researchQuery?.trim() || 'Artigo';
  const slug = (automationPost.slug && automationPost.slug.trim()) || slugify(title);

  const blocks = automationHtmlToBlogBlocks(automationPost.htmlContent || '', title);
  const contentArray = stripOptionalIds(
    blocks.length ? blocks : [{ type: 'p', text: title }],
  );

  const excerpt = excerptFromAutomation(automationPost, blocks);
  const coverUrl = automationPost.images?.[0]?.url?.trim?.() || '';
  const coverImageExternal = /^https?:\/\//i.test(coverUrl) ? coverUrl : null;

  let blogCategoryId = null;
  const firstCat =
    Array.isArray(automationPost.categories) && automationPost.categories.length
      ? String(automationPost.categories[0]).trim()
      : '';
  if (firstCat) {
    try {
      const cats = await adminListCategories(token);
      if (Array.isArray(cats)) {
        const found = cats.find(
          (c) => typeof c?.name === 'string' && c.name.toLowerCase() === firstCat.toLowerCase(),
        );
        if (found?.id != null) blogCategoryId = found.id;
      }
    } catch {
      // Categorias opcionais; continua sem categoria
    }
  }

  const listRes = await adminListPosts(token, 1, 250);
  const items = Array.isArray(listRes.data) ? listRes.data : [];
  const existing = items.find((p) => p.slug === slug) || null;

  const fd = buildPostFormData({
    title,
    excerpt,
    author: 'Equipe Emplyon',
    readTime: '5 min',
    blogCategoryId,
    published: true,
    contentArray,
    coverFile: null,
    coverImageExternal,
    removeCover: false,
  });

  const id = existing?.id != null ? existing.id : null;
  return adminSavePost(token, fd, id);
}
