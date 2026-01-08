import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollIndicator } from "./ScrollIndicator";

interface HeroSectionProps {
  onExplore?: () => void;
}

export const HeroSection = ({ onExplore }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl"
      >
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-foreground mb-4">
          Dentaxy
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

      <ScrollIndicator />
    </section>
  );
};
