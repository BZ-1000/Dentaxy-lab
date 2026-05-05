import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAdminAuthContext } from '@/contexts/AdminAuthContext';
import { AdminSecurityProvider } from '@/contexts/AdminSecurityContext';
import { PanelLockProvider, usePanelLockContext } from '@/contexts/PanelLockContext';
import { BiometricLockScreen } from '@/components/admin/security/BiometricLockScreen';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const AdminLayoutContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAdminAuthContext();
  const { isLocked } = usePanelLockContext();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fafafa]">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-900" />
      </div>
    );
  }

  // Pequeña espera adicional para asegurar que la sesión se ha cargado completamente
  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <AdminSecurityProvider>
      {/* Lock Screen - se renderiza encima de todo si está bloqueado */}
      {isLocked && (
        <BiometricLockScreen onUnlock={() => {
          console.log('Panel unlocked successfully');
        }} />
      )}

      <div className="relative min-h-screen overflow-hidden bg-[#fafafa] font-sans selection:bg-zinc-900 selection:text-white">
        {/* Background Ambient Effects (Shared with Login for consistency) */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-[10%] top-[10%] h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-blue-100/30 to-purple-100/30 blur-[120px]" />
          <div className="absolute -right-[5%] bottom-[5%] h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-emerald-100/30 to-sky-100/30 blur-[120px]" />
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.015] mix-blend-multiply" />
        </div>

        <AdminSidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

        <main
          className={cn(
            'relative z-10 min-h-screen transition-all duration-300 ease-out-expo',
            sidebarCollapsed ? 'ml-[100px]' : 'ml-[290px]'
          )}
        >
          <div className="py-8 pr-8">
            <Outlet />
          </div>
        </main>
      </div>
    </AdminSecurityProvider>
  );
};

const AdminLayout: React.FC = () => {
  return (
    <PanelLockProvider
      options={{
        inactivityTimeout: 5 * 60 * 1000, // 5 minutos por defecto
        onLock: (reason) => {
          console.log('Panel locked:', reason);
        },
        onUnlock: () => {
          console.log('Panel unlocked');
        }
      }}
    >
      <AdminLayoutContent />
    </PanelLockProvider>
  );
};

export default AdminLayout;
