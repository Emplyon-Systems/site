/** Base URL dos pedidos (proxy em desenvolvimento; VITE_API_BASE_URL em produção). */
const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '')
  || (import.meta.env.DEV ? '/api' : 'http://localhost/api');

export const API_BASE_URL = rawBaseUrl;

function formatApiError(body) {
  if (typeof body !== 'object' || body === null) {
    return 'Não foi possível completar o pedido.';
  }
  if (typeof body.message === 'string' && body.message) {
    return body.message;
  }
  if (body.errors && typeof body.errors === 'object') {
    for (const msgs of Object.values(body.errors)) {
      if (Array.isArray(msgs) && msgs[0]) return msgs[0];
    }
  }
  return 'Não foi possível completar o pedido.';
}

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers = {
    Accept: 'application/json',
    ...(options.headers || {}),
  };
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  if (isFormData) {
    delete headers['Content-Type'];
  }

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (e) {
    const err = new Error(
      e?.message?.includes('fetch')
        ? 'Sem ligação. Verifique a rede e tente novamente.'
        : 'Não foi possível completar o pedido.',
    );
    err.cause = e;
    throw err;
  }

  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    let message;
    if (typeof body === 'object') {
      message = formatApiError(body);
    } else if (typeof body === 'string' && body.trim()) {
      message = response.status >= 500
        ? `Algo correu mal (${response.status}). Tente novamente.`
        : `Pedido inválido (${response.status}). Tente novamente.`;
    } else {
      message = `Erro HTTP ${response.status}.`;
    }
    const err = new Error(message);
    err.status = response.status;
    err.body = typeof body === 'object' ? body : null;
    throw err;
  }

  return body;
}

/** Pedidos com token de sessão (Authorization Bearer). */
export function apiFetchAuth(token, path, options = {}) {
  return apiFetch(path, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
