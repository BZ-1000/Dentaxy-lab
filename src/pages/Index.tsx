
import { AppleStyleDock } from "@/components/AppleStyleDock";
import HistoriaClinica from "@/components/HistoriaClinica";
import { Typewriter } from "@/components/ui/typewriter-text";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [offset, setOffset] = useState(0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth/login');
        return;
      }
      setLoading(false);
    };
    
    checkAuth();
    
    const handleScroll = () => {
      setOffset(window.pageYOffset);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [navigate]);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>;
  }
  
  return <div className="min-h-screen">
      {/* Hero Section */}
      <div className="min-h-screen relative overflow-hidden">
        {/* Background image with parallax effect */}
        <img src="/lovable-uploads/41476c1b-5cc4-4df4-aaee-20ca4676caa4.png" alt="Background" className="absolute inset-0 w-full h-full object-cover" style={{
        transform: `translateY(${offset * 0.5}px)`,
        transition: 'transform 0.1s ease-out'
      }} />
        
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center">
            {/* Logo and Title */}
            <div className="flex items-center gap-2 mb-12">
              <div className="w-12 h-12">
                <img src="/lovable-uploads/5636450b-9d56-40a0-b095-dd830e161077.png" alt="Dental Logo" className="w-full h-full object-contain" />
              </div>
              <div className="text-white font-mplus text-xs sm:text-sm md:text-base">
                <div className="font-medium leading-tight tracking-wide">DENTAL BASICS</div>
                <div className="font-medium leading-tight tracking-wide">ACADEMY</div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Generador de<br />
              Historias Clínicas<br />
              <span className="text-blue-300">IA</span>
            </h1>
            
            <Typewriter text={["Bienvenido a nuestra Historia clínica inteligente", "Registra Más...", "Escribe Menos..."]} speed={100} loop={true} className="text-xl md:text-2xl text-blue-100 mb-12" />
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
