import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { Seo } from '@/components/seo/Seo';

export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Seo
        title="Painel administrativo | Emplyon"
        description="Gestão de blog, categorias e utilizadores — área restrita."
        path="/admin"
        noindex
      />
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
