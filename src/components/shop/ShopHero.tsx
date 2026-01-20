import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Truck, Shield, Clock } from 'lucide-react';
const ShopHero = () => {
  const features = [{
    icon: Truck,
    label: 'Entrega rápida'
  }, {
    icon: Shield,
    label: 'Calidad garantizada'
  }, {
    icon: Clock,
    label: 'Atención 24/7'
  }];
  return <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
          <ShoppingBag className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-medium text-emerald-500">Tienda Exclusiva</span>
        </motion.div>

        {/* Title */}
        <motion.h1 initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.1
      }} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
          Dentaxy{' '}
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            Shop
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.2
      }} className="text-xl sm:text-2xl text-muted-foreground mb-4">
          Insumos de alta calidad para profesionales de la salud dental 
        </motion.p>

        {/* Description */}
        <motion.p initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.3
      }} className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
          Distribución confiable, rápida y pensada para clínicas, consultorios y estudiantes.
        </motion.p>

        {/* Features */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.4
      }} className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {features.map((feature, index) => <div key={index} className="flex items-center gap-2 text-muted-foreground">
              <feature.icon className="w-5 h-5 text-emerald-500" />
              <span className="text-sm sm:text-base">{feature.label}</span>
            </div>)}
        </motion.div>
      </div>
    </section>;
};
export default ShopHero;