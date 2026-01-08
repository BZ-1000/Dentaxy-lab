import { useRef } from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { ArchitectureSection } from "@/components/landing/ArchitectureSection";
import { MotorNeuronalSection } from "@/components/landing/MotorNeuronalSection";
import { FormulariosSection } from "@/components/landing/FormulariosSection";
import { AcademiaSection } from "@/components/landing/AcademiaSection";
import { ModulosSection } from "@/components/landing/ModulosSection";
import { CTASection } from "@/components/landing/CTASection";
import { toast } from "sonner";

interface EstadisticasContentProps {
  onStartTracking?: () => void;
}

export const EstadisticasContent = ({ onStartTracking }: EstadisticasContentProps = {}) => {
  const architectureRef = useRef<HTMLDivElement>(null);

  const handleExplore = () => {
    architectureRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleRequestDemo = () => {
    toast.success("¡Solicitud recibida!", {
      description: "Nos pondremos en contacto contigo pronto.",
    });
  };

  return (
    <div className="bg-background min-h-screen overflow-y-auto scroll-smooth">
      <HeroSection onExplore={handleExplore} />
      
      <div ref={architectureRef}>
        <ArchitectureSection />
      </div>
      
      <MotorNeuronalSection />
      <FormulariosSection />
      <AcademiaSection />
      <ModulosSection />
      <CTASection onRequestDemo={handleRequestDemo} />
    </div>
  );
};
