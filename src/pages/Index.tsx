import { AppleStyleDock } from "@/components/AppleStyleDock";
import HistoriaClinica from "@/components/HistoriaClinica";
import { Typewriter } from "@/components/ui/typewriter-text";

const Index = () => {
  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <div className="min-h-screen relative overflow-hidden">
        {/* Background gradient - removed dark mode variants */}
        <div className="fixed inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20" />
        
        {/* Background image with overlay - removed dark mode variants */}
        <img 
          src="/lovable-uploads/41476c1b-5cc4-4df4-aaee-20ca4676caa4.png"
          alt="Background"
          className="fixed inset-0 w-full h-full object-cover opacity-50"
        />
        
        <div className="relative z-10 w-full">
          <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
            {/* Logo and Title */}
            <div className="flex items-center gap-2 mb-12">
              <div className="w-8 h-8">
                <img 
                  src="/lovable-uploads/5636450b-9d56-40a0-b095-dd830e161077.png" 
                  alt="Dental Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-white font-mplus text-left">
                <div className="text-base font-semibold leading-tight">DENTAL BASICS</div>
                <div className="text-base font-semibold leading-tight">ACADEMY</div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Generador de<br />
              Historias Clínicas<br />
              <span className="text-blue-300">IA</span>
            </h1>
            
            <Typewriter
              text={[
                "Bienvenido a nuestra Historia clínica inteligente",
                "Registra Más...",
                "Escribe Menos..."
              ]}
              speed={100}
              loop={true}
              className="text-xl md:text-2xl text-blue-100 mb-12"
            />
          </div>
        </div>
      </div>

      {/* Form Section - This section will respond to theme changes */}
      <div className="relative z-10 bg-gray-50/95 dark:bg-gray-900/95 py-16">
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