import { AppleStyleDock } from "@/components/AppleStyleDock";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
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

          <Button 
            onClick={() => navigate('/nueva-historia')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-12 py-6 text-xl rounded-xl"
          >
            Comenzar
          </Button>
        </div>
      </div>
      
      <AppleStyleDock />
      <div className="h-24" /> {/* Spacer for dock */}
    </div>
  );
};

export default Index;