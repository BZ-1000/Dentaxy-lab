import { AppleStyleDock } from "@/components/AppleStyleDock";
import HistoriaClinica from "@/components/HistoriaClinica";
import { Typewriter } from "@/components/ui/typewriter-text";
import TechBanner from "@/components/ui/tech-banner";
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
      <div className="flex-1 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white overflow-x-hidden transition-all duration-300" style={{
      marginLeft: window.innerWidth >= 768 ? sidebarCollapsed ? '72px' : '280px' : '0'
    }}>
      {/* Tech Banner - Floating over main content */}
      <TechBanner />
      
      {/* Hero Section */}
      <div className="min-h-screen relative" data-hero-section>        
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(59, 130, 246, 0.1) 2px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-2 sm:px-4 py-8 sm:py-16 bg-slate-50 max-w-full">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-8rem)] text-center">
            {/* Logo and Brand */}
            <div className="flex items-center gap-2 sm:gap-3 mb-8 sm:mb-12 mt-4 sm:mt-8">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center p-1">
                <img src="/lovable-uploads/fde8b90b-dc35-4ac3-baf8-f54862d6becb.png" alt="Dental tooth icon" className="w-full h-full object-contain" />
              </div>
              <div className="text-slate-700 font-mplus">
                <div className="text-sm sm:text-lg font-semibold leading-tight">DENTAL BASICS</div>
                <div className="text-sm sm:text-lg font-semibold leading-tight">ACADEMY</div>
              </div>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-slate-800 mb-4 sm:mb-6 px-2">
              Generador de<br />
              Historias Clínicas<br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">IA</span>
            </h1>
            
            {/* Typewriter effect */}
            <div>
              <div className="text-lg sm:text-xl md:text-2xl text-slate-600 mb-8 sm:mb-12 px-2">
                Bienvenido a nuestra Historia clínica inteligente
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="min-h-screen bg-white py-0">
        <div className="container mx-auto px-2 sm:px-4 bg-slate-50 max-w-full">
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