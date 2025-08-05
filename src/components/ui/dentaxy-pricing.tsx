"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Star, Clock, Calendar, Crown, GraduationCap, Zap, Eye, Sparkles, TrendingUp } from "lucide-react";
import { useState, useRef } from "react";
import confetti from "canvas-confetti";

interface DentaxyPlan {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  isPopular?: boolean;
  isBestValue?: boolean;
  isAvailable?: boolean;
  icon: any;
  billingType: 'one-time' | 'recurring';
  savings?: string;
  detailedFeatures?: string[];
}

interface DentaxyPricingProps {
  plans: DentaxyPlan[];
  onSelectPlan: (planId: string) => void;
  title?: string;
  description?: string;
  className?: string;
}

export function DentaxyPricing({
  plans,
  onSelectPlan,
  title = "Planes de Suscripción",
  description = "Elige el plan que mejor se adapte a tus necesidades profesionales",
  className,
}: DentaxyPricingProps) {
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const switchRef = useRef<HTMLButtonElement>(null);

  const handleSelectPlan = (planId: string) => {
    if (switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      confetti({
        particleCount: 40,
        spread: 60,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle"],
      });
    }
    onSelectPlan(planId);
  };

  const toggleExpanded = (planId: string) => {
    setExpandedPlan(expandedPlan === planId ? null : planId);
  };

  return (
    <div className={cn("w-full", className)}>
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-72 overflow-y-auto">
        {plans.map((plan, index) => {
          const IconComponent = plan.icon;
          const isExpanded = expandedPlan === plan.id;
          
          return (
            <motion.div
              key={plan.id}
              initial={{ y: 30, opacity: 0, scale: 0.9 }}
              animate={{ 
                y: 0, 
                opacity: 1, 
                scale: plan.isPopular || plan.isBestValue ? 1.05 : 1,
              }}
              whileHover={{ 
                scale: plan.isPopular || plan.isBestValue ? 1.08 : 1.02,
                y: -5
              }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className={cn(
                "rounded-lg border bg-background p-2 sm:p-3 text-center relative flex flex-col overflow-hidden min-h-[280px] sm:min-h-[320px]",
                "hover:shadow-lg transition-all duration-300 cursor-pointer w-full max-w-[180px] sm:max-w-[200px] mx-auto",
                plan.isPopular && "border-blue-500 border-2 shadow-blue-100 bg-gradient-to-br from-blue-50/50 to-blue-100/30",
                plan.isBestValue && "border-green-500 border-2 shadow-green-100 bg-gradient-to-br from-green-50/50 to-green-100/30",
                !plan.isAvailable && "opacity-75"
              )}
            >
              {/* Animated Background Effects */}
              {plan.isPopular && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              )}
              
              {plan.isBestValue && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              )}

              {/* Popular Badge with Animation */}
              {plan.isPopular && (
                <motion.div 
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Star className="h-3 w-3 fill-current" />
                  </motion.div>
                  Más Vendido
                </motion.div>
              )}
              
              {/* Best Value Badge with Animation */}
              {plan.isBestValue && (
                <motion.div 
                  initial={{ scale: 0, rotate: 10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <TrendingUp className="h-3 w-3" />
                  </motion.div>
                  Mejor Valor
                </motion.div>
              )}

              <div className="flex-1 flex flex-col relative z-10">
                {/* Icon with Animation */}
                <motion.div 
                  className={cn(
                    "inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full mb-2 mx-auto",
                    plan.isPopular ? "bg-blue-100 text-blue-600" :
                    plan.isBestValue ? "bg-green-100 text-green-600" :
                    "bg-gray-100 text-gray-600"
                  )}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                </motion.div>

                {/* Plan Name */}
                <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-1 leading-tight">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="mb-2">
                  {plan.originalPrice && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-muted-foreground line-through mb-1"
                    >
                      {plan.originalPrice}
                    </motion.div>
                  )}
                  <motion.div 
                    className="text-lg sm:text-xl font-bold text-foreground"
                    whileHover={{ scale: 1.1 }}
                  >
                    {plan.price}
                  </motion.div>
                  <div className="text-xs text-muted-foreground">
                    {plan.period}
                  </div>
                  {plan.savings && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                      className="mt-1 inline-block bg-green-100 text-green-800 px-1 py-0.5 rounded-full text-xs font-medium"
                    >
                      {plan.savings}
                    </motion.div>
                  )}
                </div>

                {/* Features (Compact) */}
                <ul className="space-y-1 mb-3 flex-1">
                  {plan.features.slice(0, 3).map((feature, idx) => (
                    <motion.li 
                      key={idx} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                      className="flex items-start gap-1 text-xs"
                    >
                      <Check className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-left text-muted-foreground">{feature}</span>
                    </motion.li>
                  ))}
                  {plan.features.length > 3 && (
                    <motion.li 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-blue-600 font-medium"
                    >
                      +{plan.features.length - 3} características más
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
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden mb-3"
                    >
                      <div className="border-t pt-2 mb-2">
                        <div className="text-xs font-semibold text-foreground mb-2">Características completas:</div>
                        <ul className="space-y-1">
                          {plan.features.map((feature, idx) => (
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
                    onClick={() => toggleExpanded(plan.id)}
                    className="w-full text-xs h-7 flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    {isExpanded ? "Ocultar" : "Ver más"}
                  </Button>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      ref={plan.isPopular ? switchRef : undefined}
                      onClick={() => handleSelectPlan(plan.id)}
                      disabled={!plan.isAvailable}
                      size="sm"
                      className={cn(
                        "w-full font-semibold transition-all duration-300 h-8 text-xs",
                        plan.isPopular && "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg",
                        plan.isBestValue && "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg",
                        !plan.isPopular && !plan.isBestValue && "bg-primary hover:bg-primary/90"
                      )}
                    >
                      {plan.isPopular && <Sparkles className="h-3 w-3 mr-1" />}
                      {plan.isBestValue && <TrendingUp className="h-3 w-3 mr-1" />}
                      {plan.buttonText}
                    </Button>
                  </motion.div>
                </div>

                {/* Description */}
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-2 text-xs text-muted-foreground"
                >
                  {plan.description}
                </motion.p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}