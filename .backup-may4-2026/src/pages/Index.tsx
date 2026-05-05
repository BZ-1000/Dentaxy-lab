import { AppleStyleDock } from "@/components/AppleStyleDock";
import HistoriaClinica from "@/components/HistoriaClinica";
import { AnalysisModeProvider } from "@/contexts/AnalysisModeContext";
import { useGlobalMetrics } from "@/hooks/useGlobalMetrics";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
function IndexContent() {
  // Initialize metrics tracking for all visitors
  useGlobalMetrics();
  const [formSidebarOpen, setFormSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const stored = localStorage.getItem('sidebar_collapsed');
    return stored === 'true';
  });
  useEffect(() => {
    document.title = "DENTAXY.ai";

    // Listen for sidebar state changes
    const handleSidebarStateChange = (event: CustomEvent) => {
      setSidebarCollapsed(event.detail.collapsed);
    };
    window.addEventListener('sidebar-state-change', handleSidebarStateChange as EventListener);
    return () => {
      window.removeEventListener('sidebar-state-change', handleSidebarStateChange as EventListener);
    };
  }, []);
  return <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 min-h-screen bg-slate-50 overflow-x-hidden transition-all duration-300" style={{
      marginLeft: window.innerWidth >= 768 ? sidebarCollapsed ? '72px' : '280px' : '0'
    }}>
      {/* Form Section - Primary content */}
      <div className="min-h-screen py-4">
        <div className="container mx-auto px-2 sm:px-4 max-w-full">
          <HistoriaClinica formSidebarOpen={formSidebarOpen} onFormSidebarChange={setFormSidebarOpen} />
        </div>
      </div>

        <AppleStyleDock onOpenFormularios={() => setFormSidebarOpen(true)} />
        <div className="h-16 sm:h-24" />
      </div>
    </div>;
}
const Index = () => {
  return <AnalysisModeProvider>
      <IndexContent />
    </AnalysisModeProvider>;
};
export default Index;