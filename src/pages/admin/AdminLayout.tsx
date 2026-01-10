import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAdminAuthContext } from '@/contexts/AdminAuthContext';
import { AdminSecurityProvider } from '@/contexts/AdminSecurityContext';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAdminAuthContext();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <AdminSecurityProvider>
      <div className="min-h-screen bg-zinc-950">
        <AdminSidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className={cn('min-h-screen transition-all duration-300', sidebarCollapsed ? 'ml-[72px]' : 'ml-[240px]')}>
          <Outlet />
        </main>
      </div>
    </AdminSecurityProvider>
  );
};

export default AdminLayout;
