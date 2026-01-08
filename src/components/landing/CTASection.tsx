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
    <section ref={ref} className="h-screen flex flex-col items-center justify-center bg-background px-6 snap-start">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
          Dentaxy no reemplaza al profesional.
        </h2>
        <p className="text-2xl md:text-3xl text-primary font-medium mb-10">
          Amplifica su capacidad.
        </p>
        <Button
          onClick={onRequestDemo}
          size="lg"
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-base rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          Solicitar demo institucional
        </Button>
      </motion.div>
    </section>
  );
};
