import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, FolderTree, ExternalLink, Users, MessagesSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const linkClass = ({ isActive }) =>
  cn(
    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
    isActive
      ? 'bg-royal-blue text-white shadow-sm'
      : 'text-gray-600 hover:bg-gray-100 hover:text-deep-navy',
  );

export function AdminSidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-gray-100 px-4">
        <img src="/logo.png" alt="" className="h-8 w-auto" />
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        <NavLink to="/admin" end className={linkClass}>
          <LayoutDashboard className="size-4 shrink-0 opacity-90" />
          Painel
        </NavLink>
        <NavLink to="/admin/usuarios" className={linkClass}>
          <Users className="size-4 shrink-0 opacity-90" />
          Usuarios
        </NavLink>
        <NavLink to="/admin/contatos" className={linkClass}>
          <MessagesSquare className="size-4 shrink-0 opacity-90" />
          Contatos
        </NavLink>

        <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Blog</p>
        <NavLink to="/admin/blog/artigos" className={linkClass}>
          <FileText className="size-4 shrink-0 opacity-90" />
          Artigos
        </NavLink>
        <NavLink to="/admin/blog/categorias" className={linkClass}>
          <FolderTree className="size-4 shrink-0 opacity-90" />
          Categorias
        </NavLink>
      </nav>

      <div className="border-t border-gray-100 p-3">
        <a
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-deep-navy"
        >
          <ExternalLink className="size-4" />
          Ver site
        </a>
      </div>
    </aside>
  );
}
