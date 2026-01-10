import React from 'react';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { RealtimeMetrics } from '@/components/admin/dashboard/RealtimeMetrics';
import { SecurityStatus } from '@/components/admin/dashboard/SecurityStatus';
import { KillSwitch } from '@/components/admin/security/KillSwitch';
import { AuditTimeline } from '@/components/admin/audit/AuditTimeline';

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen">
      <AdminHeader title="Dashboard" description="Vista general del sistema" />
      <div className="space-y-6 p-6">
        <RealtimeMetrics />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <KillSwitch />
            <div>
              <h3 className="mb-4 text-lg font-semibold text-zinc-100">Actividad Reciente</h3>
              <AuditTimeline />
            </div>
          </div>
          <SecurityStatus />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
