import { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getPrompts, updatePrompts } from '@/lib/postsApi';
import { AdminAutomationSubnav } from '@/components/admin/AdminAutomationSubnav';

export function AdminAutomationSettingsPage() {
  const { token, logout } = useAuth();
  const [promptResearch, setPromptResearch] = useState('');
  const [promptImage, setPromptImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getPrompts(token);
        if (cancelled) return;
        setPromptResearch(data?.promptResearch || '');
        setPromptImage(data?.promptImage || '');
      } catch (err) {
        if (!cancelled) setError(err.message || 'Nao foi possivel carregar os prompts.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  async function onSave() {
    if (!token) return;
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      await updatePrompts(token, { promptResearch, promptImage });
      setSuccess('Prompts atualizados com sucesso.');
    } catch (err) {
      if (err?.status === 401) {
        await logout();
        return;
      }
      setError(err.message || 'Nao foi possivel salvar os prompts.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-deep-navy">Configuracao de prompts</h1>
        <p className="text-sm text-gray-500">Prompts padrao usados no fluxo de criacao automatica.</p>
      </div>

      <AdminAutomationSubnav />

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white py-14 text-center text-sm text-gray-500 shadow-sm">
          Carregando configuracoes...
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-deep-navy">Card 1 - Prompt de pesquisa</h2>
            <p className="mt-1 text-xs text-gray-500">Campo `promptResearch` de `GET/PUT /api/prompts`.</p>
            <textarea
              rows={8}
              value={promptResearch}
              onChange={(e) => setPromptResearch(e.target.value)}
              className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-royal-blue/30"
            />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-deep-navy">Card 2 - Prompt de imagem</h2>
            <p className="mt-1 text-xs text-gray-500">Campo `promptImage` de `GET/PUT /api/prompts`.</p>
            <textarea
              rows={8}
              value={promptImage}
              onChange={(e) => setPromptImage(e.target.value)}
              className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-royal-blue/30"
            />
          </div>
        </div>
      )}

      {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {success ? <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p> : null}

      <div className="flex justify-end">
        <Button
          type="button"
          disabled={loading || saving}
          className="rounded-lg bg-royal-blue text-white hover:bg-blue-600"
          onClick={onSave}
        >
          {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
          Salvar prompts
        </Button>
      </div>
    </div>
  );
}
