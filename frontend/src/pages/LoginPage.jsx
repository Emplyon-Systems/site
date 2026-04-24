import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Seo } from '@/components/seo/Seo';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      const redirectTo = location.state?.from?.pathname || '/admin';
      navigate(redirectTo, { replace: true });
    } catch {
      setError('Email ou senha invalidos.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Seo
        title="Iniciar sessão | Emplyon"
        description="Acesso reservado ao painel administrativo Emplyon."
        path="/admin/login"
        noindex
      />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <div className="flex justify-center mb-8">
          <Link
            to="/"
            className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2"
            aria-label="Emplyon — voltar ao site"
          >
            <img src="/logo.png" alt="" className="h-10 w-auto" width={160} height={40} />
          </Link>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-royal-blue text-white hover:bg-blue-600"
          >
            {submitting ? 'A entrar...' : 'Entrar no painel'}
          </Button>
        </form>
      </div>
    </main>
    </>
  );
}
