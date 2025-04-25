
import { AppleStyleDock } from "@/components/AppleStyleDock";
import HistoriaClinica from "@/components/HistoriaClinica";
import { Typewriter } from "@/components/ui/typewriter-text";
import { useEffect, useState, useRef } from "react";

const Index = () => {
  const [offset, setOffset] = useState(0);
  const isUnloading = useRef(false);
  const pageActive = useRef(true);
  
  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Update page title
    document.title = "DENTAXY.ai";
    
    // Prevent any automatic reloads when switching tabs
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        pageActive.current = false;
        console.log("Page hidden - saving state");
        
        // Page is now hidden (user switched tabs or minimized)
        // Don't do anything that would cause a refresh
        
        // Create a "last active time" timestamp
        sessionStorage.setItem('lastActive', Date.now().toString());
      } else {
        pageActive.current = true;
        console.log("Page visible again");
        
        // Check how long the page was inactive
        const lastActive = sessionStorage.getItem('lastActive');
        if (lastActive) {
          const timeDiff = Date.now() - parseInt(lastActive);
          console.log(`Page was inactive for: ${timeDiff/1000} seconds`);
          
          // If it was inactive for a very long time (e.g., 4 hours), we could
          // prompt the user to refresh, but we won't do that automatically
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also handle beforeunload to prevent accidental refreshes
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isUnloading.current) {
        // This is a user-initiated page refresh or navigation away
        // For form pages, we might want to confirm they want to leave
        const message = "¿Estás seguro que deseas salir? Los datos no guardados pueden perderse.";
        e.returnValue = message;
        return message;
      }
      return null;
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
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
