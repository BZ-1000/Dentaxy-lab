import { motion } from "framer-motion";
import { BetaBanner } from "./beta-banner";
import { PlanToggle } from "./plan-toggle";
import { AnimatedPlanCard } from "./animated-plan-card";
import { cn } from "@/lib/utils";
import { Clock, Calendar, Crown, GraduationCap } from "lucide-react";

interface NewDentaxyPricingProps {
  onSelectPlan: (planId: string) => void;
  hasBetaPlan?: boolean;
  title?: string;
  description?: string;
  className?: string;
}

export function DentaxyPricing({
  onSelectPlan,
  hasBetaPlan = false,
  title = "Planes de Suscripción",
  description = "Elige el plan que mejor se adapte a tus necesidades profesionales",
  className,
}: NewDentaxyPricingProps) {

  const handleSelectBeta = () => {
    onSelectPlan('beta');
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Beta Banner */}
      <BetaBanner 
        hasBetaPlan={hasBetaPlan}
        onSelectBeta={handleSelectBeta}
      />

      {/* Title and Description */}
      <div className="text-center space-y-3 mb-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold tracking-tight text-foreground"
        >
          {title}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-sm max-w-2xl mx-auto"
        >
          {description}
        </motion.p>
      </div>

      {/* Plan Toggle */}
      <PlanToggle />

      {/* Main Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {/* Express Plan */}
        <AnimatedPlanCard
          id="express"
          name="Acceso Exprés"
          monthlyPrice="$20 MXN"
          semesterPrice="$20 MXN"
          monthlyPeriod="por día"
          semesterPeriod="por día"
          monthlyFeatures={[
            "Acceso por 24 horas",
            "3 historias clínicas por día",
            "15 usos de 'Generar Redacción'",
            "Renovación automática diaria",
            "Contadores se resetean cada día"
          ]}
          semesterFeatures={[
            "Acceso por 24 horas",
            "3 historias clínicas por día",
            "15 usos de 'Generar Redacción'",
            "Renovación automática diaria",
            "Contadores se resetean cada día"
          ]}
          description="Ideal para uso ocasional"
          onSelect={onSelectPlan}
        />

        {/* Center Plan - Monthly/Student */}
        <AnimatedPlanCard
          id="monthly_center"
          name="Plan Pro"
          monthlyPrice="$99 MXN"
          semesterPrice="$499 MXN"
          monthlyPeriod="por mes"
          semesterPeriod="por semestre"
          monthlyFeatures={[
            "Acceso completo ilimitado",
            "Historias clínicas sin límites",
            "Generación automática de redacciones",
            "Soporte prioritario 24/7",
            "Actualizaciones incluidas"
          ]}
          semesterFeatures={[
            "Acceso completo por 6 meses",
            "Todas las funciones del Plan Pro",
            "Especial para estudiantes de odontología",
            "Biblioteca educativa",
            "Casos clínicos de estudio"
          ]}
          description="El más popular entre profesionales"
          isPopular={true}
          isCenter={true}
          onSelect={onSelectPlan}
        />

        {/* Professional Plan */}
        <AnimatedPlanCard
          id="professional"
          name="Acceso Profesional"
          monthlyPrice="$59 MXN"
          semesterPrice="$59 MXN"
          monthlyPeriod="por semana"
          semesterPeriod="por semana"
          monthlyFeatures={[
            "Acceso por 7 días",
            "Historias clínicas ilimitadas",
            "Generación de redacciones ilimitada",
            "Renovación automática semanal",
            "Ideal para semanas activas"
          ]}
          semesterFeatures={[
            "Acceso por 7 días",
            "Historias clínicas ilimitadas",
            "Generación de redacciones ilimitada",
            "Renovación automática semanal",
            "Ideal para semanas activas"
          ]}
          description="Para profesionales activos"
          onSelect={onSelectPlan}
        />
      </div>
    </div>
  );
}