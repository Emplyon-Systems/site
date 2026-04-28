import { apiFetchAuth } from '@/lib/api';

export const TERMINAL_AUTOMATION_STATUSES = new Set(['ready', 'error', 'published']);

export function submitPost(token, body) {
  return apiFetchAuth(token, '/posts/submit', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function listPosts(token, page = 1, perPage = 15) {
  const q = new URLSearchParams({ page: String(page), per_page: String(perPage) });
  return apiFetchAuth(token, `/posts?${q}`);
}

export async function getPost(token, postId) {
  const r = await apiFetchAuth(token, `/posts/${postId}`);
  return r.data;
}

export const getPostById = getPost;

export async function pollPostUntilTerminal(
  token,
  postId,
  { intervalMs = 2500, timeoutMs = 15 * 60 * 1000 } = {},
) {
  const startedAt = Date.now();
  let lastData = null;

  while (Date.now() - startedAt < timeoutMs) {
    const data = await getPostById(token, postId);
    lastData = data;
    const status = data?.status;
    if (TERMINAL_AUTOMATION_STATUSES.has(status)) {
      return {
        timedOut: false,
        data,
        status,
      };
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  return {
    timedOut: true,
    data: lastData,
    status: lastData?.status || null,
  };
}

export async function updatePost(token, postId, patch) {
  const r = await apiFetchAuth(token, `/posts/${postId}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
  return r.data;
}

export async function deletePost(token, postId) {
  await apiFetchAuth(token, `/posts/${postId}`, {
    method: 'DELETE',
  });
}

export async function getPrompts(token) {
  const r = await apiFetchAuth(token, '/prompts');
  return r.data;
}

export async function updatePrompts(token, body) {
  const r = await apiFetchAuth(token, '/prompts', {
    method: 'PUT',
    body: JSON.stringify(body),
  });
  return r.data;
}
