import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SyncedTypewriter } from "@/components/ui/synced-typewriter";
import { ChevronDown } from "lucide-react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { MatrixCounter } from "./MatrixCounter";

interface HeroSectionProps {
  onExplore?: () => void;
}

export const HeroSection = ({
  onExplore
}: HeroSectionProps) => {
  return (
    <section className="relative h-screen w-full max-w-full flex flex-col items-center justify-center bg-background px-4 sm:px-6 snap-start overflow-hidden">
      {/* Animated Background */}
      <BackgroundBeams className="z-0" />
      
      {/* Matrix Counter */}
      <MatrixCounter />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }} 
        className="text-center w-full max-w-3xl relative z-10 px-4"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-tight text-foreground mb-4" style={{ fontFamily: "'Bruno Ace SC', sans-serif" }}>
          DENTAXY
          <SyncedTypewriter className="text-blue-500" />
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-light mb-4 sm:mb-6">
          De datos clínicos a decisiones inteligentes
        </p>
        <p className="text-sm md:text-base text-muted-foreground/70 max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
          Automatización clínica, redacción médica con IA y visualización avanzada integradas en una arquitectura odontológica inteligente.
        </p>
        <Button 
          onClick={onExplore} 
          size="lg" 
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          Explorar cómo funciona
        </Button>
      </motion.div>

      {/* Animated scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 1, duration: 0.5 }} 
        className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div 
          animate={{ y: [0, 8, 0] }} 
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} 
          className="flex flex-col items-center gap-2 text-muted-foreground/50"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
};
