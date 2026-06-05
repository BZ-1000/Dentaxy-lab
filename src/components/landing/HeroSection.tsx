import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onExplore?: () => void;
}

export const HeroSection = ({
  onExplore
}: HeroSectionProps) => {
  return (
    <section className="relative h-screen w-full max-w-full flex flex-col items-center justify-center bg-background px-4 sm:px-6 snap-start overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }} 
        className="text-center w-full max-w-3xl relative z-10 px-4"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-tight text-foreground mb-4" style={{ fontFamily: "'Bruno Ace SC', sans-serif" }}>
          DENTAXY
          <span className="text-blue-500">.com</span>
          <span className="text-blue-500 animate-pulse">|</span>
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
    </section>
  );
};
