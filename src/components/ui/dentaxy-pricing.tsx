"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Star, Clock, Calendar, Crown, GraduationCap, Zap } from "lucide-react";
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
  const switchRef = useRef<HTMLButtonElement>(null);

  const handleSelectPlan = (planId: string) => {
    if (switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      confetti({
        particleCount: 30,
        spread: 50,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"],
        ticks: 150,
        gravity: 1,
        decay: 0.94,
        startVelocity: 25,
        shapes: ["circle"],
      });
    }
    onSelectPlan(planId);
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 max-h-96 overflow-y-auto">
        {plans.map((plan, index) => {
          const IconComponent = plan.icon;
          
          return (
            <motion.div
              key={plan.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className={cn(
                "rounded-xl border bg-background p-6 text-center relative flex flex-col",
                plan.isPopular && "border-blue-500 border-2 shadow-lg",
                plan.isBestValue && "border-green-500 border-2 shadow-lg",
                !plan.isAvailable && "opacity-75",
                "hover:shadow-md transition-all duration-200"
              )}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  Más Vendido
                </div>
              )}
              
              {/* Best Value Badge */}
              {plan.isBestValue && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Mejor Valor
                </div>
              )}

              <div className="flex-1 flex flex-col">
                {/* Icon */}
                <div className={cn(
                  "inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 mx-auto",
                  plan.isPopular ? "bg-blue-100 text-blue-600" :
                  plan.isBestValue ? "bg-green-100 text-green-600" :
                  "bg-gray-100 text-gray-600"
                )}>
                  <IconComponent className="h-6 w-6" />
                </div>

                {/* Plan Name */}
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="mb-4">
                  {plan.originalPrice && (
                    <div className="text-sm text-muted-foreground line-through mb-1">
                      {plan.originalPrice}
                    </div>
                  )}
                  <div className="text-2xl font-bold text-foreground">
                    {plan.price}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {plan.period}
                  </div>
                  {plan.savings && (
                    <div className="mt-2 inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      {plan.savings}
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-left text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <Button
                  ref={plan.isPopular ? switchRef : undefined}
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={!plan.isAvailable}
                  className={cn(
                    "w-full font-semibold transition-all duration-200",
                    plan.isPopular && "bg-blue-600 hover:bg-blue-700 text-white",
                    plan.isBestValue && "bg-green-600 hover:bg-green-700 text-white",
                    !plan.isPopular && !plan.isBestValue && "bg-primary hover:bg-primary/90"
                  )}
                >
                  {plan.buttonText}
                </Button>

                {/* Description */}
                <p className="mt-3 text-xs text-muted-foreground">
                  {plan.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}