import React, { useState } from 'react';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { DemoLinkCreator } from '@/components/admin/demos/DemoLinkCreator';
import { DemoLinksList } from '@/components/admin/demos/DemoLinksList';

const DemoControl: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <div className="min-h-screen">
      <AdminHeader title="Control de Demos" description="Gestiona links de demostración temporales" />
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-100">Demos Activos</h3>
          <DemoLinkCreator onCreated={() => setRefreshTrigger((p) => p + 1)} />
        </div>
        <DemoLinksList refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
};

export default DemoControl;
