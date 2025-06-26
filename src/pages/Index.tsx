
import { AppleStyleDock } from "@/components/AppleStyleDock";
import HistoriaClinica from "@/components/HistoriaClinica";
import { Typewriter } from "@/components/ui/typewriter-text";
import TechBanner from "@/components/ui/tech-banner";
import { AnalysisModeProvider } from "@/contexts/AnalysisModeContext";
import { useEffect, useState } from "react";

function IndexContent() {
  useEffect(() => {
    document.title = "DENTAXY.ai";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white">
      {/* Tech Banner */}
      <TechBanner />
      
      {/* Hero Section - No animations */}
      <div className="min-h-screen relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, rgba(59, 130, 246, 0.1) 2px, transparent 0)`,
              backgroundSize: '50px 50px'
            }}
          ></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-16 bg-slate-50">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center">
            {/* Logo and Brand - No animation */}
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center p-1">
                <img 
                  src="/lovable-uploads/fde8b90b-dc35-4ac3-baf8-f54862d6becb.png" 
                  alt="Dental tooth icon"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-slate-700 font-mplus">
                <div className="text-lg font-semibold leading-tight">DENTAL BASICS</div>
                <div className="text-lg font-semibold leading-tight">ACADEMY</div>
              </div>
            </div>

            {/* Main Title - No animation */}
            <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-6">
              Generador de<br />
              Historias Clínicas<br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">IA</span>
            </h1>
            
            {/* Typewriter effect - No animation */}
            <div>
              <div className="text-xl md:text-2xl text-slate-600 mb-12">
                Bienvenido a nuestra Historia clínica inteligente
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section - No animations */}
      <div className="min-h-screen bg-white py-0">
        <div className="container mx-auto px-4 bg-slate-50">
          <HistoriaClinica />
        </div>
      </div>

      <AppleStyleDock />
      <div className="h-24" />
    </div>
  );
}

const Index = () => {
  return (
    <AnalysisModeProvider>
      <IndexContent />
    </AnalysisModeProvider>
  );
};

export default Index;
