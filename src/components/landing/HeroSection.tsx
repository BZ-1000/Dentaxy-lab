import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Typewriter } from "@/components/ui/typewriter-text";
import { ChevronDown } from "lucide-react";
import { BackgroundBeams } from "@/components/ui/background-beams";

interface HeroSectionProps {
  onExplore?: () => void;
}

export const HeroSection = ({ onExplore }: HeroSectionProps) => {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center bg-background px-6 snap-start overflow-hidden">
      {/* Animated Background */}
      <BackgroundBeams className="z-0" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl relative z-10"
      >
        <h1 className="text-6xl md:text-8xl font-black tracking-tight text-foreground mb-4">
          DENTAXY
          <Typewriter 
            text={[".ai", ".com"]} 
            speed={100} 
            deleteSpeed={80} 
            delay={12000} 
            loop={true} 
            className="text-blue-500" 
          />
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-light mb-6">
          Inteligencia artificial aplicada a la odontología
        </p>
        <p className="text-sm md:text-base text-muted-foreground/70 max-w-xl mx-auto mb-10 leading-relaxed">
          Una plataforma modular que conecta datos clínicos, educación y automatización 
          en un solo ecosistema.
        </p>
        <Button
          onClick={onExplore}
          size="lg"
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-base rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          Explorar cómo funciona
        </Button>
      </motion.div>

      {/* Animated scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
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