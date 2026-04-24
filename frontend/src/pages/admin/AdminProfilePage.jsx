import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { apiFetchAuth } from '@/lib/api';

function PasswordInput({ id, label, value, onChange, show, onToggleShow, autoComplete }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative mt-1">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          className="w-full rounded-lg border border-gray-300 py-2 pl-3 pr-11 text-sm outline-none focus:ring-2 focus:ring-royal-blue/40"
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-deep-navy"
          aria-label={show ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'}
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </div>
  );
}

export function AdminProfilePage() {
  const { user, token, refreshUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showPassConfirm, setShowPassConfirm] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name ?? '');
      setEmail(user.email ?? '');
    }
  }, [user]);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setOk('');
    setSubmitting(true);

    const wantsPassword = password.trim().length > 0 || passwordConfirmation.trim().length > 0;

    try {
      await apiFetchAuth(token, '/me', {
        method: 'PATCH',
        body: JSON.stringify({ name, email }),
      });

      if (wantsPassword) {
        if (password.length < 8) {
          setError('A nova palavra-passe deve ter pelo menos 8 caracteres.');
          setSubmitting(false);
          return;
        }
        if (password !== passwordConfirmation) {
          setError('A confirmação da palavra-passe não coincide.');
          setSubmitting(false);
          return;
        }
        await apiFetchAuth(token, '/me/password', {
          method: 'PATCH',
          body: JSON.stringify({
            password,
            password_confirmation: passwordConfirmation,
          }),
        });
        setPassword('');
        setPasswordConfirmation('');
        setOk('Dados e palavra-passe guardados com sucesso.');
      } else {
        setOk('Dados guardados com sucesso.');
      }

      await refreshUser();
    } catch (err) {
      setError(err.message || 'Não foi possível guardar.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-none">
      <form
        onSubmit={onSubmit}
        className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <h2 className="text-lg font-semibold text-deep-navy">Dados pessoais</h2>
        <p className="mt-1 text-sm text-gray-500">
          Nome e email para iniciar sessão. Para alterar a palavra-passe, preencha os campos abaixo (mínimo 8 caracteres); deixe em branco para manter a atual.
        </p>

        <div className="mt-6 space-y-4 border-t border-gray-100 pt-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-royal-blue/40"
                required
              />
            </div>
            <div>
              <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-royal-blue/40"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-sm font-semibold text-deep-navy">Palavra-passe</h3>
            <p className="mt-0.5 text-xs text-gray-500">Opcional — só preencha se quiser definir uma nova.</p>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <PasswordInput
                id="new-password"
                label="Nova palavra-passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                show={showPass}
                onToggleShow={() => setShowPass((v) => !v)}
                autoComplete="new-password"
              />
              <PasswordInput
                id="confirm-password"
                label="Confirmar palavra-passe"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                show={showPassConfirm}
                onToggleShow={() => setShowPassConfirm((v) => !v)}
                autoComplete="new-password"
              />
            </div>
          </div>
        </div>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        {ok ? <p className="mt-4 text-sm text-emerald-700">{ok}</p> : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-royal-blue text-white hover:bg-blue-600"
          >
            {submitting ? 'A guardar…' : 'Guardar alterações'}
          </Button>
          <Button asChild variant="outline" className="rounded-lg">
            <a href="/">Ver site</a>
          </Button>
        </div>
      </form>
    </div>
  );
}
