import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, EyeOff, Pencil, Trash2, UserPlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetchAuth } from '@/lib/api';

function formatDate(iso) {
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

export function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: null,
    to: null,
  });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  /** null = criar; número = editar esse id */
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showPassConfirm, setShowPassConfirm] = useState(false);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = useCallback(async (p, pp) => {
    if (!token) {
      setLoading(false);
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await apiFetchAuth(
        token,
        `/admin/users?page=${p}&per_page=${pp}`,
      );
      setUsers(res.data ?? []);
      const m = res.meta;
      if (m) {
        setMeta({
          current_page: m.current_page ?? 1,
          last_page: m.last_page ?? 1,
          per_page: m.per_page ?? pp,
          total: m.total ?? 0,
          from: m.from ?? null,
          to: m.to ?? null,
        });
        if (m.current_page > m.last_page && m.last_page >= 1) {
          setPage(m.last_page);
        }
      }
    } catch (e) {
      setError(e.message || 'Não foi possível carregar os usuarios.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers(page, perPage);
  }, [page, perPage, fetchUsers]);

  useEffect(() => {
    if (!modalOpen) return;
    function onKey(e) {
      if (e.key === 'Escape') setModalOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [modalOpen]);

  function openModal() {
    setEditingId(null);
    setName('');
    setEmail('');
    setPassword('');
    setPasswordConfirmation('');
    setShowPass(false);
    setShowPassConfirm(false);
    setFormError('');
    setModalOpen(true);
  }

  function openEditModal(u) {
    setEditingId(u.id);
    setName(u.name ?? '');
    setEmail(u.email ?? '');
    setPassword('');
    setPasswordConfirmation('');
    setShowPass(false);
    setShowPassConfirm(false);
    setFormError('');
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setFormError('');
  }

  const isEdit = editingId != null;

  async function onSubmitUser(e) {
    e.preventDefault();
    setFormError('');

    if (isEdit) {
      const hasPass = password.length > 0 || passwordConfirmation.length > 0;
      if (hasPass) {
        if (password.length < 8) {
          setFormError('A nova palavra-passe deve ter pelo menos 8 caracteres.');
          return;
        }
        if (password !== passwordConfirmation) {
          setFormError('As palavras-passe não coincidem.');
          return;
        }
      }
    } else if (password !== passwordConfirmation) {
      setFormError('As palavras-passe não coincidem.');
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit) {
        const body = { name, email };
        if (password) {
          body.password = password;
          body.password_confirmation = passwordConfirmation;
        }
        await apiFetchAuth(token, `/admin/users/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify(body),
        });
        closeModal();
        await fetchUsers(page, perPage);
      } else {
        await apiFetchAuth(token, '/admin/users', {
          method: 'POST',
          body: JSON.stringify({
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
          }),
        });
        closeModal();
        if (page !== 1) {
          setPage(1);
        } else {
          await fetchUsers(1, perPage);
        }
      }
    } catch (err) {
      setFormError(err.message || (isEdit ? 'Erro ao atualizar usuario.' : 'Erro ao criar usuario.'));
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(id) {
    if (!window.confirm('Remover este usuario? Não poderá voltar a iniciar sessão.')) return;
    setError('');
    try {
      await apiFetchAuth(token, `/admin/users/${id}`, { method: 'DELETE' });
      await fetchUsers(page, perPage);
    } catch (e) {
      setError(e.message || 'Não foi possível remover.');
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-lg font-semibold text-deep-navy">Usuarios</h2>
          <p className="text-sm text-gray-500">
            Outros usuarios do painel — a sua conta em Meu perfil. Total: {meta.total ?? 0} usuario(s).
          </p>
        </div>
        <Button
          type="button"
          onClick={openModal}
          className="shrink-0 rounded-lg bg-royal-blue text-white hover:bg-blue-600"
        >
          <span className="inline-flex items-center gap-2">
            <UserPlus className="size-4" />
            Novo usuario
          </span>
        </Button>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <p className="px-6 py-10 text-center text-sm text-gray-500">A carregar…</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-6 py-3">Nome</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Criado em</th>
                    <th className="w-14 px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                        Nenhum usuario nesta página.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/80">
                        <td className="px-6 py-3 font-medium text-deep-navy">
                          {u.name}
                        </td>
                        <td className="px-6 py-3 text-gray-600">{u.email}</td>
                        <td className="px-6 py-3 text-gray-500">{formatDate(u.created_at)}</td>
                        <td className="px-6 py-3">
                          <div className="flex items-center justify-end gap-0.5">
                            <button
                              type="button"
                              onClick={() => openEditModal(u)}
                              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-royal-blue/10 hover:text-royal-blue"
                              aria-label={`Editar ${u.name}`}
                            >
                              <Pencil className="size-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDelete(u.id)}
                              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                              aria-label={`Remover ${u.name}`}
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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

      {modalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-user-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Fechar"
            onClick={closeModal}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 id="modal-user-title" className="text-lg font-semibold text-deep-navy">
                  {isEdit ? 'Editar usuario' : 'Novo usuario'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {isEdit
                    ? 'Altere nome, email ou palavra-passe (opcional).'
                    : 'Acesso ao painel em /admin/login'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-deep-navy"
                aria-label="Fechar"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={onSubmitUser} className="space-y-4">
              <div>
                <label htmlFor="modal-u-name" className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  id="modal-u-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-royal-blue/40"
                  required
                />
              </div>
              <div>
                <label htmlFor="modal-u-email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  id="modal-u-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-royal-blue/40"
                  required
                />
              </div>
              <div>
                <label htmlFor="modal-u-pass" className="block text-sm font-medium text-gray-700">Palavra-passe</label>
                <div className="relative mt-1">
                  <input
                    id="modal-u-pass"
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2 pl-3 pr-11 text-sm outline-none focus:ring-2 focus:ring-royal-blue/40"
                    minLength={isEdit ? undefined : 8}
                    required={!isEdit}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
                    aria-label={showPass ? 'Ocultar' : 'Mostrar'}
                  >
                    {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  {isEdit ? 'Opcional. Mínimo 8 caracteres se alterar.' : 'Mínimo 8 caracteres.'}
                </p>
              </div>
              <div>
                <label htmlFor="modal-u-pass2" className="block text-sm font-medium text-gray-700">Confirmar palavra-passe</label>
                <div className="relative mt-1">
                  <input
                    id="modal-u-pass2"
                    type={showPassConfirm ? 'text' : 'password'}
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2 pl-3 pr-11 text-sm outline-none focus:ring-2 focus:ring-royal-blue/40"
                    minLength={isEdit ? undefined : 8}
                    required={!isEdit}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassConfirm((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
                    aria-label={showPassConfirm ? 'Ocultar confirmação' : 'Mostrar confirmação'}
                  >
                    {showPassConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
              <div className="flex flex-wrap justify-end gap-2 pt-2">
                <Button type="button" variant="outline" className="rounded-lg" onClick={closeModal}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-royal-blue text-white hover:bg-blue-600"
                >
                  {submitting ? (isEdit ? 'A guardar…' : 'A criar…') : (isEdit ? 'Guardar' : 'Criar')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
