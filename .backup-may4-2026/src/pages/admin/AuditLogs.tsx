import React from 'react';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AuditTimeline } from '@/components/admin/audit/AuditTimeline';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const AuditLogs: React.FC = () => {
  return (
    <div className="min-h-screen">
      <AdminHeader title="Auditoría y Logs" description="Registro inmutable de todas las acciones del sistema" />
      <div className="p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder="Buscar en logs..."
              className="pl-10 border-zinc-800 bg-zinc-900 text-zinc-100"
            />
          </div>
        </div>
        <AuditTimeline />
      </div>
    </div>
  );
};

export default AuditLogs;
