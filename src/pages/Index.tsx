
import { lazy, Suspense } from "react";
import { AppleStyleDock } from "@/components/AppleStyleDock";
import { Typewriter } from "@/components/ui/typewriter-text";
import LoadingScreen from "@/components/ui/loading-screen";
import { useEffect, useState } from "react";

// Lazy load HistoriaClinica since it's not needed immediately
const HistoriaClinica = lazy(() => import("@/components/HistoriaClinica"));

const Index = () => {
  const [offset, setOffset] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset);
    };
    window.addEventListener('scroll', handleScroll);
    
    document.title = "DENTAXY.ai";
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="min-h-screen relative overflow-hidden">
        {/* Background image with preload and loading optimization */}
        <img 
          src="/lovable-uploads/41476c1b-5cc4-4df4-aaee-20ca4676caa4.png" 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover" 
          style={{
            transform: `translateY(${offset * 0.5}px)`,
            transition: 'transform 0 ease-out'
          }}
          loading="eager"
          fetchPriority="high"
        />
        
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center">
            {/* Logo and Title */}
            <div className="flex items-center gap-2 mb-12">
              <div className="w-12 h-12">
                <img 
                  src="/lovable-uploads/5636450b-9d56-40a0-b095-dd830e161077.png" 
                  alt="Dental Logo" 
                  className="w-full h-full object-contain"
                  loading="eager"
                  fetchPriority="high"
                />
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

      {/* Form Section - Lazy loaded */}
      <div className="min-h-screen bg-background py-0">
        <div className="container mx-auto px-4">
          <Suspense fallback={<LoadingScreen />}>
            <HistoriaClinica />
          </Suspense>
        </div>
      </div>

      <AppleStyleDock />
      <div className="h-24" /> {/* Spacer for dock */}
    </div>
  );
};

export default Index;
