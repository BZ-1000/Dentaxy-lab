import { AppleStyleDock } from "@/components/AppleStyleDock";
import HistoriaClinica from "@/components/HistoriaClinica";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="min-h-screen relative overflow-hidden">
        {/* Background image */}
        <img 
          src="/lovable-uploads/41476c1b-5cc4-4df4-aaee-20ca4676caa4.png"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center">
            {/* Logo */}
            <div className="w-40 h-40 mb-8">
              <img 
                src="/lovable-uploads/5636450b-9d56-40a0-b095-dd830e161077.png" 
                alt="Dental Logo" 
                className="w-full h-full object-contain"
              />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Generador de<br />
              Historias Clínicas<br />
              <span className="text-blue-300">IA</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-12">
              REGISTRA MÁS, ESCRIBE MENOS
            </p>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <svg 
                className="w-6 h-6 text-white" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <HistoriaClinica />
        </div>
      </div>
      
      <AppleStyleDock />
      <div className="h-24" /> {/* Spacer for dock */}
    </div>
  );
};

export default Index;