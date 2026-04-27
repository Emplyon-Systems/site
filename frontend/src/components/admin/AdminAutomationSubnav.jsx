import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const items = [
  { to: '/admin/blog/automacao', label: 'Dashboard', end: true },
  { to: '/admin/blog/automacao/configuracao', label: 'Configuracao' },
  { to: '/admin/blog/automacao/criar', label: 'Criar post' },
  { to: '/admin/blog/automacao/na-fila', label: 'Na fila' },
  { to: '/admin/blog/automacao/prontos', label: 'Prontos' },
  { to: '/admin/blog/automacao/erros', label: 'Erros' },
];

export function AdminAutomationSubnav() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
      <nav className="flex flex-wrap gap-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => cn(
              'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-royal-blue text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-deep-navy',
            )}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
