import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface HeroSectionProps {
  onExplore?: () => void;
}

export const HeroSection = ({
  onExplore
}: HeroSectionProps) => {
  return (
    <section className="relative h-[calc(100vh-4rem)] w-full max-w-full flex flex-col items-center justify-start pt-4 sm:pt-8 md:pt-12 bg-background px-4 sm:px-6 snap-start">
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }} 
        className="text-center w-full relative z-20 px-4 flex flex-col items-center"
      >
        <h1 className="text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[16.5vw] font-black tracking-tighter text-foreground mb-0 leading-[0.85] whitespace-nowrap" style={{ fontFamily: "'Bruno Ace SC', sans-serif" }}>
          DENTAXY
        </h1>
        <p className="text-sm md:text-base tracking-[0.4em] uppercase text-muted-foreground font-semibold mb-8 sm:mb-10" style={{ fontFamily: "'Bruno Ace SC', sans-serif" }}>
          technologies
        </p>

        <p className="text-sm sm:text-base md:text-lg text-muted-foreground/80 font-light mb-8 max-w-2xl mx-auto px-4">
          No necesitas probar que eres el mejor dentista. Google ya probó que tienes el mejor sistema.
        </p>
        
        <button 
          onClick={onExplore}
          className="relative flex items-center bg-[#00E676] hover:bg-[#00C853] rounded-full p-1.5 pr-8 transition-all group shadow-lg shadow-green-400/30 mt-2"
        >
          <div className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center shrink-0">
            <ArrowUpRight className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
          </div>
          <span className="text-white font-bold ml-4 text-sm tracking-wide">Conoce Dentaxy</span>
        </button>
      </motion.div>

    </section>
  );
};
