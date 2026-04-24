import { useCallback, useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { adminCreateCategory, adminDeleteCategory, adminListCategories } from '@/lib/blogApi';

export function AdminCategoriesPage() {
  const { token } = useAuth();
  const [list, setList] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!token) {
      setList([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await adminListCategories(token);
      setList(data);
      setError('');
    } catch (e) {
      setError(e.message || 'Não foi possível carregar.');
      setList([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function onAdd(e) {
    e.preventDefault();
    if (!token) return;
    setError('');
    try {
      await adminCreateCategory(token, { name });
      setName('');
      await refresh();
    } catch (err) {
      setError(err.message || 'Não foi possível criar.');
    }
  }

  async function onDelete(id) {
    if (!window.confirm('Remover esta categoria? Artigos associados ficam sem categoria.')) return;
    if (!token) return;
    setError('');
    try {
      await adminDeleteCategory(token, id);
      await refresh();
    } catch (err) {
      setError(err.message || 'Não foi possível remover.');
    }
  }

  return (
    <div className="w-full space-y-6">
      <p className="text-sm text-gray-500">
        Organize as categorias do blog. Utilizadas nos artigos e no site.
      </p>
      <form
        onSubmit={onAdd}
        className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label htmlFor="cat-name" className="block text-sm font-medium text-gray-700">Nova categoria</label>
          <input
            id="cat-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-royal-blue/40"
            placeholder="Ex.: Compliance"
            required
          />
        </div>
        <Button type="submit" className="rounded-lg bg-royal-blue text-white hover:bg-blue-600" disabled={!token}>
          Criar
        </Button>
      </form>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <p className="px-4 py-10 text-center text-sm text-gray-500">A carregar…</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Slug</th>
                <th className="w-14 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {list.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-gray-500">
                    Nenhuma categoria. Crie a primeira acima (ex.: Geral).
                  </td>
                </tr>
              ) : (
                list.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/80">
                    <td className="px-4 py-3 font-medium text-deep-navy">{c.name}</td>
                    <td className="px-4 py-3 text-gray-600"><code className="text-xs">{c.slug}</code></td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => onDelete(c.id)}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        aria-label={`Remover ${c.name}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
