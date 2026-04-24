import { slugify } from '@/lib/slugify';

const CAT_KEY = 'emplyon_blog_categories_v1';
const POST_KEY = 'emplyon_blog_posts_v1';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event('emplyon-blog'));
}

function ensureSeed() {
  const cats = readJson(CAT_KEY, null);
  if (!cats || cats.length === 0) {
    writeJson(CAT_KEY, [
      { id: 'cat-geral', name: 'Geral', slug: 'geral', createdAt: new Date().toISOString() },
    ]);
  }
  const posts = readJson(POST_KEY, null);
  if (!posts) writeJson(POST_KEY, []);
}

export function getCategories() {
  ensureSeed();
  return readJson(CAT_KEY, []);
}

export function addCategory({ name }) {
  ensureSeed();
  const list = getCategories();
  const slug = slugify(name);
  if (!slug) throw new Error('Nome inválido');
  if (list.some((c) => c.slug === slug)) throw new Error('Já existe uma categoria com este nome.');
  const row = {
    id: `cat-${crypto.randomUUID()}`,
    name: name.trim(),
    slug,
    createdAt: new Date().toISOString(),
  };
  list.push(row);
  writeJson(CAT_KEY, list);
  return row;
}

export function deleteCategory(id) {
  const list = getCategories().filter((c) => c.id !== id);
  writeJson(CAT_KEY, list);
  const posts = getPosts().map((p) => (p.categoryId === id ? { ...p, categoryId: null } : p));
  writeJson(POST_KEY, posts);
}

export function getPosts() {
  ensureSeed();
  return readJson(POST_KEY, []);
}

export function getPostById(id) {
  return getPosts().find((p) => p.id === id) ?? null;
}

export function deletePost(id) {
  writeJson(
    POST_KEY,
    getPosts().filter((p) => p.id !== id),
  );
}

const defaultContent = () => [
  { type: 'p', text: 'Escreva o primeiro parágrafo do artigo aqui.' },
];

export function savePost(payload) {
  const list = getPosts();
  const now = new Date().toISOString();
  const slug = slugify(payload.title || '');
  if (!slug) throw new Error('Título inválido para gerar o URL (slug).');

  if (payload.id) {
    const idx = list.findIndex((p) => p.id === payload.id);
    if (idx === -1) throw new Error('Artigo não encontrado.');
    const other = list.filter((p) => p.id !== payload.id);
    if (other.some((p) => p.slug === slug)) throw new Error('Já existe um artigo com este slug.');
    const prev = list[idx];
    let content = defaultContent();
    try {
      content = JSON.parse(payload.contentJson || '[]');
      if (!Array.isArray(content)) content = defaultContent();
    } catch {
      content = defaultContent();
    }
    const updated = {
      ...prev,
      title: payload.title.trim(),
      slug,
      excerpt: payload.excerpt.trim(),
      author: payload.author.trim() || 'Equipe Emplyon',
      readTime: payload.readTime.trim() || '5 min',
      coverImage: payload.coverImage.trim() || '',
      categoryId: payload.categoryId || null,
      tags: [],
      content,
      published: Boolean(payload.published),
      publishedAt: payload.published ? (prev.publishedAt || now) : null,
      updatedAt: now,
    };
    list[idx] = updated;
    writeJson(POST_KEY, list);
    return updated;
  }

  if (list.some((p) => p.slug === slug)) throw new Error('Já existe um artigo com este slug.');
  let content = defaultContent();
  try {
    content = JSON.parse(payload.contentJson || '[]');
    if (!Array.isArray(content)) content = defaultContent();
  } catch {
    content = defaultContent();
  }
  const row = {
    id: `post-${crypto.randomUUID()}`,
    title: payload.title.trim(),
    slug,
    excerpt: payload.excerpt.trim(),
    author: payload.author.trim() || 'Equipe Emplyon',
    readTime: payload.readTime.trim() || '5 min',
    coverImage: payload.coverImage.trim() || '',
    categoryId: payload.categoryId || null,
    tags: [],
    content,
    published: Boolean(payload.published),
    publishedAt: payload.published ? now : null,
    createdAt: now,
    updatedAt: now,
  };
  list.push(row);
  writeJson(POST_KEY, list);
  return row;
}

export function getCategoryName(categoryId) {
  if (!categoryId) return '—';
  const c = getCategories().find((x) => x.id === categoryId);
  return c?.name ?? '—';
}
