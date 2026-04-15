import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Sparkles } from 'lucide-react';
export const HeroAcademico: React.FC = () => {
  return <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container px-4">
        {/* Logos */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }} className="flex items-center justify-center gap-6 md:gap-10 mb-12">
          <div className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-emerald-500" />
            <span className="text-2xl md:text-3xl font-black tracking-tight">DENTAXY</span>
          </div>
          <div className="h-10 w-px bg-border" />
          <img src="/logos/uao-uaz-logo.svg" alt="UAO UAZ" className="h-14 md:h-20 object-contain" />
        </motion.div>

        {/* Main Title */}
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        delay: 0.2
      }} className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4">
            <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              UAO
            </span>
            <span className="ml-3 text-sky-600">SYNC</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium">
            Infraestructura Académica para Práctica Clínica Real
          </p>
        </motion.div>

        {/* Narrative */}
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        duration: 0.8,
        delay: 0.4
      }} className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-lg md:text-xl text-muted-foreground/80 leading-relaxed italic">
            "Cada nodo representa una clínica real. Cada dato tiene propósito. 
            Cada conexión es trazable. Donde la formación clínica deja de ser teoría."
          </p>
        </motion.div>

        {/* Status indicators */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.6
      }} className="flex items-center justify-center gap-4 md:gap-6 flex-wrap">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <Shield className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-600">Sesión Zero-Trust Verificada</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
            <Zap className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-600">4 Nodos Activos</span>
          </div>
        </motion.div>
      </div>
    </section>;
};