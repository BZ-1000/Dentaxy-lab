import { motion } from "framer-motion";
import { Calendar, GraduationCap } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { usePlanPeriod } from "@/contexts/PlanPeriodContext";
import confetti from "canvas-confetti";
import { useRef } from "react";

interface PlanToggleProps {
  className?: string;
}

export function PlanToggle({ className }: PlanToggleProps) {
  const { period, setPeriod } = usePlanPeriod();
  const toggleRef = useRef<HTMLDivElement>(null);

  const handleToggle = (newPeriod: 'monthly' | 'semester') => {
    if (newPeriod !== period) {
      setPeriod(newPeriod);
      
      // Confetti effect
      if (toggleRef.current) {
        const rect = toggleRef.current.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        confetti({
          particleCount: 30,
          spread: 50,
          origin: {
            x: x / window.innerWidth,
            y: y / window.innerHeight,
          },
          colors: newPeriod === 'semester' ? ["#10B981", "#059669", "#047857"] : ["#3B82F6", "#2563EB", "#1D4ED8"],
          ticks: 150,
          gravity: 1,
          decay: 0.9,
          startVelocity: 25,
        });
      }
    }
  };

  return (
    <div ref={toggleRef} className={cn("flex justify-center mb-6", className)}>
      <div className="bg-muted rounded-lg p-1 flex items-center">
        <Button
          variant={period === 'monthly' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleToggle('monthly')}
          className={cn(
            "text-xs h-8 px-4 transition-all duration-300",
            period === 'monthly' && "shadow-sm"
          )}
        >
          <Calendar className="h-3 w-3 mr-1" />
          Plan Mensual
        </Button>
        
        <motion.div
          initial={false}
          animate={{ scale: period === 'semester' ? 1.05 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant={period === 'semester' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleToggle('semester')}
            className={cn(
              "text-xs h-8 px-4 transition-all duration-300 relative",
              period === 'semester' && "bg-green-600 hover:bg-green-700 text-white shadow-sm"
            )}
          >
            <GraduationCap className="h-3 w-3 mr-1" />
            Plan de 6 Meses
            {period === 'semester' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 rounded-full"
              >
                ¡Ahorro!
              </motion.div>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}