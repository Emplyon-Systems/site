import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

/** Títulos por URL — não usar useMatches() com BrowserRouter (só com Data Router). */
const TITLE_BY_PATH = [
  [/^\/admin\/blog\/artigos\/[^/]+\/editar$/, 'Editar artigo'],
  [/^\/admin\/blog\/artigos\/novo$/, 'Novo artigo'],
  [/^\/admin\/blog\/artigos\/\d+$/, 'Pré-visualização do artigo'],
  [/^\/admin\/blog\/artigos$/, 'Artigos'],
  [/^\/admin\/blog\/categorias$/, 'Categorias do blog'],
  [/^\/admin\/usuarios$/, 'Usuarios'],
  [/^\/admin\/perfil$/, 'Meu perfil'],
  [/^\/admin\/?$/, 'Painel'],
];

export function AdminTopbar() {
  const location = useLocation();
  const title = TITLE_BY_PATH.find(([re]) => re.test(location.pathname))?.[1] ?? 'Painel';
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (!menuRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  async function onLogout() {
    setOpen(false);
    await logout();
    navigate('/admin/login', { replace: true });
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white/90 px-6 backdrop-blur-md">
      <h1 className="text-lg font-semibold text-deep-navy">{title}</h1>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 py-1.5 pl-3 pr-2 text-left text-sm font-medium text-deep-navy transition-colors hover:bg-gray-100"
        >
          <span className="max-w-[140px] truncate hidden sm:inline">{user?.name ?? 'Admin'}</span>
          <span className="flex size-8 items-center justify-center rounded-full bg-royal-blue text-xs font-bold text-white">
            {(user?.name || user?.email || '?').slice(0, 1).toUpperCase()}
          </span>
          <ChevronDown className={cn('size-4 text-gray-500 transition-transform', open && 'rotate-180')} />
        </button>

        {open ? (
          <div className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
            <div className="border-b border-gray-100 px-3 py-2">
              <p className="truncate text-sm font-semibold text-deep-navy">{user?.name}</p>
              <p className="truncate text-xs text-gray-500">{user?.email}</p>
            </div>
            <Link
              to="/admin/perfil"
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              <User className="size-4 text-gray-400" />
              Meu perfil
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="size-4" />
              Sair
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
