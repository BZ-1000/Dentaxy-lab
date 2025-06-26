
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white overflow-x-hidden">
      {/* Tech Banner - Floating over main content */}
      <TechBanner />
      
      {/* Hero Section - Compact for mobile */}
      <div className="relative">        
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
        
        <div className="relative z-10 container mx-auto px-3 sm:px-4 py-8 sm:py-16 bg-slate-50">
          <div className="flex flex-col items-center justify-center min-h-[40vh] sm:min-h-[calc(100vh-8rem)] text-center max-w-4xl mx-auto">
            {/* Logo and Brand - Smaller on mobile */}
            <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-12 mt-4 sm:mt-8">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center p-1">
                <img 
                  src="/lovable-uploads/fde8b90b-dc35-4ac3-baf8-f54862d6becb.png" 
                  alt="Dental tooth icon"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-slate-700 font-mplus">
                <div className="text-sm sm:text-lg font-semibold leading-tight">DENTAL BASICS</div>
                <div className="text-sm sm:text-lg font-semibold leading-tight">ACADEMY</div>
              </div>
            </div>

            {/* Main Title - Responsive sizing */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-slate-800 mb-3 sm:mb-6 leading-tight px-2">
              Generador de<br />
              Historias Clínicas<br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">IA</span>
            </h1>
            
            {/* Typewriter effect - Smaller on mobile */}
            <div className="px-4">
              <div className="text-base sm:text-xl md:text-2xl text-slate-600 mb-6 sm:mb-12">
                Bienvenido a nuestra Historia clínica inteligente
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section - Full width with proper mobile padding */}
      <div className="bg-white py-0">
        <div className="w-full max-w-full px-2 sm:px-4 bg-slate-50">
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
