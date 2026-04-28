import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { pollPostUntilTerminal, submitPost } from '@/lib/postsApi';
import { AdminAutomationSubnav } from '@/components/admin/AdminAutomationSubnav';
import { adminListCategories } from '@/lib/blogApi';

export function AdminAutomationCreatePage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [researchQuery, setResearchQuery] = useState('');
  const [formMode, setFormMode] = useState('test');
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState('');
  const [createdPostId, setCreatedPostId] = useState('');
  const [automationStatus, setAutomationStatus] = useState('');
  const [polling, setPolling] = useState(false);
  const [pollingTimedOut, setPollingTimedOut] = useState(false);
  const [pollingError, setPollingError] = useState('');

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      setCategoriesLoading(true);
      try {
        const data = await adminListCategories(token);
        if (cancelled) return;
        setCategories(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setCategories([]);
      } finally {
        if (!cancelled) setCategoriesLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  useEffect(() => {
    let cancelled = false;
    if (!token || !createdPostId) return () => { cancelled = true; };

    (async () => {
      setPolling(true);
      setPollingTimedOut(false);
      setPollingError('');
      try {
        const result = await pollPostUntilTerminal(token, createdPostId, {
          intervalMs: 2500,
          timeoutMs: 15 * 60 * 1000,
        });
        if (cancelled) return;
        if (result?.status) setAutomationStatus(result.status);
        if (result?.timedOut) {
          setPollingTimedOut(true);
          return;
        }
        if (result?.status === 'error') {
          const msg = result?.data?.errorMessage || result?.data?.error_message || '';
          if (msg) setPollingError(msg);
        }
      } catch (err) {
        if (cancelled) return;
        if (err?.status === 401) {
          await logout();
          navigate('/admin/login', { replace: true });
          return;
        }
        setPollingError(err.message || 'Nao foi possivel consultar o status da automacao.');
      } finally {
        if (!cancelled) setPolling(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, createdPostId, navigate, logout]);

  const selectedCategoryNames = useMemo(() => {
    if (selectedCategoryIds.length === 0) return [];
    const selectedSet = new Set(selectedCategoryIds);
    return categories
      .filter((c) => selectedSet.has(String(c.id)))
      .map((c) => c.name)
      .filter(Boolean);
  }, [categories, selectedCategoryIds]);

  function onCategoryToggle(categoryId) {
    setSelectedCategoryIds((prev) => {
      const sid = String(categoryId);
      if (prev.includes(sid)) return prev.filter((id) => id !== sid);
      return [...prev, sid];
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setCreatedPostId('');
    setAutomationStatus('');
    setPollingError('');
    setPollingTimedOut(false);

    if (!token) {
      setError('Sessao invalida. Entre novamente para continuar.');
      return;
    }

    setLoading(true);
    try {
      const response = await submitPost(token, {
        researchQuery: researchQuery.trim(),
        formMode,
        categories: selectedCategoryNames,
      });
      setCreatedPostId(response.postId || '');
      setAutomationStatus(response.status || 'queue');
    } catch (err) {
      if (err?.status === 401) {
        await logout();
        navigate('/admin/login', { replace: true });
        return;
      }
      setError(err.message || 'Nao foi possivel enviar a solicitacao.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-deep-navy">Nova automacao de post</h1>
          <p className="text-sm text-gray-500">
            Envia a solicitacao para o fluxo IA/n8n gerar o conteudo. Os prompts sao lidos da Configuracao.
          </p>
        </div>
        <Button asChild variant="outline" className="rounded-lg">
          <Link to="/admin/blog/automacao/na-fila" className="inline-flex items-center gap-2">
            <ArrowLeft className="size-4" />
            Voltar para fila
          </Link>
        </Button>
      </div>

      <AdminAutomationSubnav />

      <form
        onSubmit={onSubmit}
        className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">Tema de pesquisa *</label>
          <input
            value={researchQuery}
            onChange={(e) => setResearchQuery(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-royal-blue/30"
            placeholder="Ex.: Tendencias de RH em 2026"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Modo</label>
          <select
            value={formMode}
            onChange={(e) => setFormMode(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-royal-blue/30"
          >
            <option value="test">test</option>
            <option value="production">production</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Categorias</label>
          <p className="mt-1 text-xs text-gray-500">
            Selecione uma ou mais categorias para enviar em <code>categories</code> no body.
          </p>
          <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50/60 p-3">
            {categoriesLoading ? (
              <p className="text-sm text-gray-500">Carregando categorias...</p>
            ) : categories.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhuma categoria cadastrada.</p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {categories.map((category) => {
                  const categoryId = String(category.id);
                  const checked = selectedCategoryIds.includes(categoryId);
                  return (
                    <label
                      key={categoryId}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onCategoryToggle(category.id)}
                        className="size-4 rounded border-gray-300 text-royal-blue focus:ring-royal-blue"
                      />
                      <span>{category.name}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        ) : null}

        {createdPostId ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-800">
            <p className="font-medium">Solicitacao criada com sucesso.</p>
            <p className="mt-1 break-all">
              postId: <code className="rounded bg-emerald-100 px-1.5 py-0.5">{createdPostId}</code>
            </p>
            <p className="mt-1">
              Status: <code className="rounded bg-emerald-100 px-1.5 py-0.5">{automationStatus || 'queue'}</code>
            </p>
            {polling ? (
              <p className="mt-2 inline-flex items-center gap-2 text-emerald-900">
                <Loader2 className="size-4 animate-spin" />
                Acompanhando processamento (fila/processando)...
              </p>
            ) : null}
            {pollingTimedOut ? (
              <p className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-2 py-1.5 text-amber-800">
                O acompanhamento automatico atingiu 15 minutos. Abra o detalhe para consultar novamente.
              </p>
            ) : null}
            {pollingError ? (
              <p className="mt-2 rounded-md border border-red-200 bg-red-50 px-2 py-1.5 text-red-700">
                {pollingError}
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <Button asChild size="sm" className="rounded-lg bg-royal-blue text-white hover:bg-blue-600">
                <Link to={`/admin/blog/automacao/${createdPostId}`}>Abrir detalhe</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="rounded-lg">
                <Link to="/admin/blog/automacao/na-fila">Ir para listagem</Link>
              </Button>
            </div>
          </div>
        ) : null}

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading || !researchQuery.trim()}
            className="rounded-lg bg-royal-blue text-white hover:bg-blue-600"
          >
            {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Send className="mr-2 size-4" />}
            Enviar para automacao
          </Button>
        </div>
      </form>
    </div>
  );
}
