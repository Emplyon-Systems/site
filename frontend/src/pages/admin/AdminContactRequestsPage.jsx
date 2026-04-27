import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, Mail, Phone, Building2, Users, MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { adminListContactRequests } from '@/lib/contactRequestsApi';

function formatDateTime(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('pt-PT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

const PER_PAGE_OPTIONS = [10, 15, 25, 50];

export function AdminContactRequestsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    from: null,
    to: null,
  });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchItems = useCallback(async (p, pp) => {
    if (!token) {
      setLoading(false);
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await adminListContactRequests(token, p, pp);
      setItems(res.data ?? []);
      setMeta({
        current_page: res.meta?.current_page ?? 1,
        last_page: res.meta?.last_page ?? 1,
        total: res.meta?.total ?? 0,
        from: res.meta?.from ?? null,
        to: res.meta?.to ?? null,
      });
    } catch (e) {
      setError(e.message || 'Não foi possível carregar os contatos.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchItems(page, perPage);
  }, [page, perPage, fetchItems]);

  useEffect(() => {
    if (!selectedItem) return;
    function onKeyDown(event) {
      if (event.key === 'Escape') setSelectedItem(null);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [selectedItem]);

  return (
    <div className="w-full space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-sm">
        <h2 className="text-lg font-semibold text-deep-navy">Falar com especialista</h2>
        <p className="text-sm text-gray-500">
          Leads recebidos pelo formulário do site. Total: {meta.total ?? 0}.
        </p>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <p className="px-6 py-10 text-center text-sm text-gray-500">A carregar…</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              {items.length === 0 ? (
                <p className="px-6 py-10 text-center text-sm text-gray-500">Nenhum envio encontrado.</p>
              ) : (
                <table className="w-full min-w-[820px] text-left text-sm">
                  <thead className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-6 py-3">Nome</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Telefone</th>
                      <th className="px-6 py-3">Empresa</th>
                      <th className="px-6 py-3">Recebido em</th>
                      <th className="w-24 px-6 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/80">
                        <td className="px-6 py-3 font-medium text-deep-navy">{item.name}</td>
                        <td className="px-6 py-3 text-gray-600">{item.email}</td>
                        <td className="px-6 py-3 text-gray-600">{item.phone}</td>
                        <td className="px-6 py-3 text-gray-600">{item.company}</td>
                        <td className="px-6 py-3 text-gray-500">{formatDateTime(item.created_at)}</td>
                        <td className="px-6 py-3">
                          <div className="flex justify-end">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="rounded-lg"
                              onClick={() => setSelectedItem(item)}
                            >
                              <Eye className="mr-1 size-4" />
                              Ver
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="flex flex-col gap-4 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <span>
                  {meta.total === 0
                    ? 'Sem registos'
                    : meta.from != null && meta.to != null
                      ? `Mostrando ${meta.from}–${meta.to} de ${meta.total}`
                      : `${meta.total} registo(s)`}
                </span>
                <label className="inline-flex items-center gap-2">
                  <span className="text-gray-500">Por página</span>
                  <select
                    value={perPage}
                    onChange={(e) => {
                      setPerPage(Number(e.target.value));
                      setPage(1);
                    }}
                    className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-royal-blue/40"
                  >
                    {PER_PAGE_OPTIONS.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="size-4" />
                  Anterior
                </Button>
                <span className="px-2 text-sm tabular-nums text-gray-600">
                  Página {meta.current_page} de {Math.max(meta.last_page, 1)}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  disabled={page >= meta.last_page || loading}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Seguinte
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {selectedItem ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-request-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Fechar detalhes do contato"
            onClick={() => setSelectedItem(null)}
          />
          <div className="relative w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 id="contact-request-title" className="text-lg font-semibold text-deep-navy">
                  Detalhes do contato
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Recebido em {formatDateTime(selectedItem.created_at)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-deep-navy"
                aria-label="Fechar"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
              <p className="inline-flex items-center gap-2"><strong>Nome:</strong> {selectedItem.name}</p>
              <p className="inline-flex items-center gap-2"><Mail className="size-4" />{selectedItem.email}</p>
              <p className="inline-flex items-center gap-2"><Phone className="size-4" />{selectedItem.phone}</p>
              <p className="inline-flex items-center gap-2"><Building2 className="size-4" />{selectedItem.company}</p>
              <p className="inline-flex items-center gap-2"><Users className="size-4" />{selectedItem.employees || 'Não informado'}</p>
            </div>

            <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
              <p className="mb-1 inline-flex items-center gap-1 font-medium text-deep-navy">
                <MessageSquare className="size-4" />
                Mensagem
              </p>
              <p>{selectedItem.message || 'Sem mensagem.'}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
