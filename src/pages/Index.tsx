import { AppleStyleDock } from "@/components/AppleStyleDock";
import HistoriaClinica from "@/components/HistoriaClinica";
import { Typewriter } from "@/components/ui/typewriter-text";

const Index = () => {
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
            {/* Logo and Title */}
            <div className="flex items-center gap-2 mb-12">
              <div className="w-12 h-12">
                <img 
                  src="/lovable-uploads/5636450b-9d56-40a0-b095-dd830e161077.png" 
                  alt="Dental Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-white font-mplus flex flex-col">
                <Typewriter
                  text="DENTAL BASICS"
                  speed={100}
                  className="text-lg font-semibold leading-tight"
                />
                <Typewriter
                  text="ACADEMY"
                  speed={100}
                  className="text-lg font-semibold leading-tight"
                />
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