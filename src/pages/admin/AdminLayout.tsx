import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AdminSecurityProvider, useAdminSecurity } from '@/contexts/AdminSecurityContext';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const AdminLayoutContent: React.FC = () => {
  const { isAdmin, isLoading } = useAdminSecurity();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <AdminSidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <main className={cn('min-h-screen transition-all duration-300', sidebarCollapsed ? 'ml-[72px]' : 'ml-[240px]')}>
        <Outlet />
      </main>
    </div>
  );
};

export const AdminLayout: React.FC = () => {
  return (
    <AdminSecurityProvider>
      <AdminLayoutContent />
    </AdminSecurityProvider>
  );
};

export default AdminLayout;
