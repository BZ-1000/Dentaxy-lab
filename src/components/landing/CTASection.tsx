import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  onRequestDemo?: () => void;
}

export const CTASection = ({ onRequestDemo }: CTASectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      ref={ref} 
      className="min-h-screen w-full max-w-full flex flex-col items-center justify-center bg-background px-4 sm:px-6 py-12 sm:py-16 snap-start overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center w-full max-w-2xl px-4"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-3 sm:mb-4">
          Dentaxy no reemplaza al profesional.
        </h2>
        <p className="text-xl sm:text-2xl md:text-3xl text-primary font-medium mb-8 sm:mb-10">
          Amplifica su capacidad.
        </p>
        <Button
          onClick={onRequestDemo}
          size="lg"
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-full shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
        >
          Solicitar demo institucional
        </Button>
      </motion.div>
    </section>
  );
};
