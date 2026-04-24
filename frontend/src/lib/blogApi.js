import { apiFetch, apiFetchAuth } from '@/lib/api';

/** @param {string} token */
export async function adminListCategories(token) {
  const r = await apiFetchAuth(token, '/admin/blog/categories');
  return r.data;
}

/** @param {string} token @param {{ name: string }} body */
export async function adminCreateCategory(token, body) {
  const r = await apiFetchAuth(token, '/admin/blog/categories', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return r.data;
}

/** @param {string} token @param {number|string} id */
export async function adminDeleteCategory(token, id) {
  await apiFetchAuth(token, `/admin/blog/categories/${id}`, { method: 'DELETE' });
}

/** @param {string} token */
export async function adminListPosts(token, page = 1, perPage = 15) {
  const q = new URLSearchParams({ page: String(page), per_page: String(perPage) });
  return apiFetchAuth(token, `/admin/blog/posts?${q}`);
}

/** @param {string} token @param {number|string} id */
export async function adminGetPost(token, id) {
  const r = await apiFetchAuth(token, `/admin/blog/posts/${id}`);
  return r.data;
}

/**
 * @param {string} token
 * @param {FormData} formData
 * @param {number|string|null} id - null = criar
 */
export async function adminSavePost(token, formData, id = null) {
  if (id == null) {
    const r = await apiFetchAuth(token, '/admin/blog/posts', {
      method: 'POST',
      body: formData,
    });
    return r.data;
  }
  const r = await apiFetchAuth(token, `/admin/blog/posts/${id}`, {
    method: 'PATCH',
    body: formData,
  });
  return r.data;
}

/** @param {string} token @param {number|string} id */
export async function adminDeletePost(token, id) {
  await apiFetchAuth(token, `/admin/blog/posts/${id}`, { method: 'DELETE' });
}

/** @param {string} token @param {File} file */
export async function adminUploadBlogImage(token, file) {
  const fd = new FormData();
  fd.append('image', file);
  const r = await apiFetchAuth(token, '/admin/blog/upload', {
    method: 'POST',
    body: fd,
  });
  return r.url;
}

export async function fetchPublicCategories() {
  const r = await apiFetch('/blog/categories');
  return r.data;
}

export async function fetchPublicPosts({ page = 1, perPage = 8, categorySlug = '', search = '' } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });
  if (categorySlug) params.set('category_slug', categorySlug);
  if (search.trim()) params.set('search', search.trim());
  return apiFetch(`/blog/posts?${params}`);
}

export async function fetchPublicPost(slug) {
  const r = await apiFetch(`/blog/posts/${encodeURIComponent(slug)}`);
  return r.data;
}

export async function fetchRelatedPosts(slug) {
  const r = await apiFetch(`/blog/posts/${encodeURIComponent(slug)}/related`);
  return r.data;
}

/**
 * Monta FormData para criar/atualizar post.
 * @param {object} opts
 */
export function buildPostFormData({
  title,
  excerpt,
  author,
  readTime,
  blogCategoryId,
  published,
  contentArray,
  coverFile = null,
  coverImageExternal = null,
  removeCover = false,
}) {
  const fd = new FormData();
  fd.append('title', title);
  fd.append('excerpt', excerpt);
  fd.append('author', author || '');
  fd.append('read_time', readTime || '');
  if (blogCategoryId != null && blogCategoryId !== '') {
    fd.append('blog_category_id', String(blogCategoryId));
  }
  fd.append('published', published ? '1' : '0');
  fd.append('content', JSON.stringify(contentArray));
  if (coverFile) {
    fd.append('cover', coverFile);
  } else if (coverImageExternal && /^https?:\/\//i.test(coverImageExternal)) {
    fd.append('cover_image_external', coverImageExternal);
  }
  if (removeCover) {
    fd.append('remove_cover', '1');
  }
  return fd;
}
