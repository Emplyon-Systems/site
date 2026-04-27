import { apiFetchAuth } from '@/lib/api';

export function adminListContactRequests(token, page = 1, perPage = 15) {
  const q = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });
  return apiFetchAuth(token, `/admin/contact-requests?${q.toString()}`);
}
