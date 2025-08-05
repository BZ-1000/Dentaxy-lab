import { motion, AnimatePresence } from "framer-motion";
import { Check, Eye, Sparkles, TrendingUp, Star, Crown, Clock, Calendar, GraduationCap, Zap } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import NumberFlow from "@number-flow/react";
import { usePlanPeriod } from "@/contexts/PlanPeriodContext";

interface AnimatedPlanCardProps {
  id: string;
  name: string;
  monthlyPrice: string;
  semesterPrice: string;
  monthlyPeriod: string;
  semesterPeriod: string;
  monthlyFeatures: string[];
  semesterFeatures: string[];
  description: string;
  isPopular?: boolean;
  isBestValue?: boolean;
  isCenter?: boolean;
  onSelect: (planId: string) => void;
  className?: string;
}

export function AnimatedPlanCard({
  id,
  name,
  monthlyPrice,
  semesterPrice,
  monthlyPeriod,
  semesterPeriod,
  monthlyFeatures,
  semesterFeatures,
  description,
  isPopular,
  isBestValue,
  isCenter,
  onSelect,
  className
}: AnimatedPlanCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { period } = usePlanPeriod();
  
  const currentPrice = period === 'monthly' ? monthlyPrice : semesterPrice;
  const currentPeriod = period === 'monthly' ? monthlyPeriod : semesterPeriod;
  const currentFeatures = period === 'monthly' ? monthlyFeatures : semesterFeatures;
  const currentName = period === 'monthly' ? name : `${name} Semestral`;
  
  const getIcon = () => {
    if (id === 'express') return Clock;
    if (id === 'professional') return Calendar;
    if (id === 'monthly_center') return period === 'monthly' ? Crown : GraduationCap;
    return Zap;
  };
  
  const IconComponent = getIcon();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: isCenter ? 1.02 : 1
      }}
      whileHover={{ 
        scale: isCenter ? 1.05 : 1.02,
        y: -4,
        transition: { duration: 0.15 }
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "relative bg-background border rounded-lg p-4 text-center overflow-hidden",
        "hover:shadow-lg transition-all duration-300 cursor-pointer",
        isCenter && "border-2 border-primary shadow-lg bg-gradient-to-br from-primary/5 to-primary/10",
        isPopular && "border-blue-500 border-2 shadow-blue-100",
        isBestValue && "border-green-500 border-2 shadow-green-100",
        className
      )}
    >
      {/* Animated background for center card */}
      {isCenter && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-50"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}

      {/* Enhanced Popular Badge positioned outside */}
      {isPopular && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 20 }}
          className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg z-50 border border-white"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Star className="h-3 w-3 fill-current" />
          </motion.div>
          <span>Más Vendido</span>
        </motion.div>
      )}
      
      {isBestValue && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 20 }}
          className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg z-40 border border-white"
        >
          <TrendingUp className="h-3 w-3" />
          <span>Mejor Valor</span>
        </motion.div>
      )}

      <div className="relative z-10 flex flex-col h-full">
        {/* Icon with simplified animation */}
        <motion.div 
          className={cn(
            "inline-flex items-center justify-center w-10 h-10 rounded-full mb-3 mx-auto",
            period === 'semester' && isCenter ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary"
          )}
          whileHover={{ scale: 1.1, transition: { duration: 0.1 } }}
        >
          <IconComponent className="h-5 w-5" />
        </motion.div>

        {/* Plan Name simplified */}
        <motion.h3 
          key={currentName}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="text-sm font-semibold text-foreground mb-2"
        >
          {currentName}
        </motion.h3>

        {/* Price simplified */}
        <div className="mb-3">
          <motion.div 
            className="text-xl font-bold text-foreground"
            key={currentPrice}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.1 } }}
          >
            {currentPrice}
          </motion.div>
          <motion.div 
            key={currentPeriod}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="text-xs text-muted-foreground"
          >
            {currentPeriod}
          </motion.div>
          {period === 'semester' && isCenter && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              className="mt-1 inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium"
            >
              ¡Ahorra $95!
            </motion.div>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-1 mb-3 flex-1">
          <AnimatePresence mode="wait">
            {currentFeatures.slice(0, 3).map((feature, idx) => (
              <motion.li 
                key={`${period}-${feature}-${idx}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ 
                  delay: idx * 0.08,
                  duration: 0.3,
                  ease: "easeOut"
                }}
                className="flex items-start gap-1 text-xs"
              >
                <Check className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-left text-muted-foreground">{feature}</span>
              </motion.li>
            ))}
          </AnimatePresence>
          {currentFeatures.length > 3 && (
            <motion.li className="text-xs text-blue-600 font-medium">
              +{currentFeatures.length - 3} características más
            </motion.li>
          )}
        </ul>

        {/* Expanded Features */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-3"
            >
              <div className="border-t pt-2 mb-2">
                <div className="text-xs font-semibold text-foreground mb-2">Características completas:</div>
                <ul className="space-y-1">
                  {currentFeatures.map((feature, idx) => (
                    <motion.li 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-start gap-1 text-xs"
                    >
                      <Check className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-left text-muted-foreground">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <div className="space-y-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-xs h-7 flex items-center gap-1"
          >
            <Eye className="h-3 w-3" />
            {isExpanded ? "Ocultar" : "Ver más"}
          </Button>
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => onSelect(period === 'monthly' ? id : `${id}_semester`)}
              size="sm"
              className={cn(
                "w-full font-semibold transition-all duration-300 h-8 text-xs",
                isCenter && "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg"
              )}
            >
              {isCenter && <Sparkles className="h-3 w-3 mr-1" />}
              Seleccionar Plan
            </Button>
          </motion.div>
        </div>

        {/* Description */}
        <motion.p 
          className="mt-2 text-xs text-muted-foreground"
          key={description}
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
}