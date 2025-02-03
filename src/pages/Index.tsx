import { AppleStyleDock } from "@/components/AppleStyleDock";
import HistoriaClinica from "@/components/HistoriaClinica";
import { Typewriter } from "@/components/ui/typewriter-text";
import { motion, useScroll, useTransform } from "framer-motion";

const Index = () => {
  const { scrollY } = useScroll();
  
  // Transform values based on scroll
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.2]);
  const titleY = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section - Theme independent */}
      <div className="min-h-screen relative overflow-hidden">
        {/* Background base color and gradient */}
        <motion.div 
          className="absolute inset-0" 
          style={{
            background: 'linear-gradient(135deg, #1a1464 0%, #3b2b8f 100%)',
            y: backgroundY,
            scale: scale
          }} 
        />
        
        {/* Geometric shapes overlay */}
        <motion.div 
          className="absolute inset-0" 
          style={{ opacity, y: backgroundY }}
        >
          <img 
            src="/lovable-uploads/3a220d7e-3577-4b59-97fb-69bed16a40b0.png"
            alt="Background Pattern"
            className="w-full h-full object-cover opacity-50"
          />
        </motion.div>
        
        <motion.div className="relative z-10 w-full" style={{ y: titleY }}>
          <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
            {/* Logo and Title */}
            <motion.div 
              className="flex items-center gap-2 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16">
                <img 
                  src="/lovable-uploads/5636450b-9d56-40a0-b095-dd830e161077.png" 
                  alt="Dental Logo" 
                  className="w-full h-full object-contain brightness-0 invert"
                />
              </div>
              <div className="text-white font-mplus text-left">
                <div className="text-xl font-semibold leading-tight">DENTAL BASICS</div>
                <div className="text-xl font-semibold leading-tight">ACADEMY</div>
              </div>
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Generador de<br />
              Historias Clínicas<br />
              <span className="text-[#8BB8FE]">IA</span>
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Typewriter
                text={[
                  "Registra Más...",
                  "Escribe Menos..."
                ]}
                speed={100}
                loop={true}
                className="text-xl md:text-2xl text-white/90 mb-12"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Form Section - This section will respond to theme changes */}
      <div className="relative z-10 bg-background py-16">
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