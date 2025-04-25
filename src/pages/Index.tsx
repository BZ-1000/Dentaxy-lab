
import { AppleStyleDock } from "@/components/AppleStyleDock";
import HistoriaClinica from "@/components/HistoriaClinica";
import { Typewriter } from "@/components/ui/typewriter-text";
import { useEffect, useState, useRef } from "react";

const Index = () => {
  const [offset, setOffset] = useState(0);
  const isUnloading = useRef(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Update page title
    document.title = "DENTAXY.ai";
    
    // Improved visibility state handling to completely prevent reload on tab switching
    const handleVisibilityChange = () => {
      // Do nothing special on visibility changes - this prevents auto-reloads
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Handle beforeunload event - ONLY for actual manual page reloads
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // We only want this to run when the user explicitly clicks the browser's reload button
      // or presses F5, not when switching tabs or minimizing
      if (document.visibilityState !== 'hidden') {
        // Let the default browser reload happen in this case
        return;
      } else {
        // If tab is hidden (switching tabs), prevent reload
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  return <div className="min-h-screen">
      {/* Hero Section */}
      <div className="min-h-screen relative overflow-hidden">
        {/* Background image with parallax effect */}
        <img src="/lovable-uploads/41476c1b-5cc4-4df4-aaee-20ca4676caa4.png" alt="Background" className="absolute inset-0 w-full h-full object-cover" style={{
        transform: `translateY(${offset * 0.5}px)`,
        transition: 'transform 0 ease-out'
      }} />
        
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center">
            {/* Logo and Title */}
            <div className="flex items-center gap-2 mb-12">
              <div className="w-12 h-12">
                <img src="/lovable-uploads/5636450b-9d56-40a0-b095-dd830e161077.png" alt="Dental Logo" className="w-full h-full object-contain" />
              </div>
              <div className="text-white font-mplus text-justify">
                <div className="text-lg font-semibold leading-tight">DENTAL BASICS</div>
                <div className="text-lg font-semibold leading-tight">ACADEMY</div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Generador de<br />
              Historias Clínicas<br />
              <span className="text-blue-300">IA</span>
            </h1>
            
            <Typewriter text={["Bienvenido a nuestra Historia clínica inteligente", "Registra Más...", "Escribe Menos..."]} speed={50} loop={true} className="text-xl md:text-2xl text-blue-100 mb-12" />
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="min-h-screen bg-background py-0">
        <div className="container mx-auto px-4">
          <HistoriaClinica />
        </div>
      </div>

      <AppleStyleDock />
      <div className="h-24" /> {/* Spacer for dock */}
    </div>;
};

export default Index;
