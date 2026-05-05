import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowRight, Zap, Users, Stethoscope, Link2 } from 'lucide-react';
import { ClinicaUAO } from '@/data/clinicasUAO';
import { cn } from '@/lib/utils';

interface ClinicaCardProps {
  clinica: ClinicaUAO;
  onClick: () => void;
  index: number;
}

const iconsByType = {
  integracion: Link2,
  universitaria: Stethoscope,
  alto_flujo: Zap,
  comunitaria: Users
};

const accentColors = {
  emerald: {
    gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
    border: 'hover:border-emerald-500/40',
    glow: 'group-hover:shadow-emerald-500/20',
    icon: 'text-emerald-500',
    iconBg: 'bg-emerald-500/10',
    badge: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    button: 'bg-emerald-500 hover:bg-emerald-600'
  },
  blue: {
    gradient: 'from-blue-500/20 via-blue-500/5 to-transparent',
    border: 'hover:border-blue-500/40',
    glow: 'group-hover:shadow-blue-500/20',
    icon: 'text-blue-500',
    iconBg: 'bg-blue-500/10',
    badge: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    button: 'bg-blue-500 hover:bg-blue-600'
  },
  violet: {
    gradient: 'from-violet-500/20 via-violet-500/5 to-transparent',
    border: 'hover:border-violet-500/40',
    glow: 'group-hover:shadow-violet-500/20',
    icon: 'text-violet-500',
    iconBg: 'bg-violet-500/10',
    badge: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
    button: 'bg-violet-500 hover:bg-violet-600'
  },
  amber: {
    gradient: 'from-amber-500/20 via-amber-500/5 to-transparent',
    border: 'hover:border-amber-500/40',
    glow: 'group-hover:shadow-amber-500/20',
    icon: 'text-amber-500',
    iconBg: 'bg-amber-500/10',
    badge: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    button: 'bg-amber-500 hover:bg-amber-600'
  }
};

export const ClinicaCard: React.FC<ClinicaCardProps> = ({ clinica, onClick, index }) => {
  const Icon = iconsByType[clinica.tipo];
  const colors = accentColors[clinica.accentColor] || accentColors.emerald;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      onClick={onClick}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-3xl",
        "bg-card border-2 border-border/50",
        colors.border,
        "hover:shadow-2xl",
        colors.glow,
        "transition-all duration-500 ease-out",
        "min-h-[380px] flex flex-col"
      )}
    >
      {/* Gradient overlay */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        colors.gradient
      )} />

      {/* Active indicator - pulsing dot */}
      <div className="absolute top-6 right-6 z-10">
        <div className={cn(
          "h-3 w-3 rounded-full",
          clinica.activa ? "bg-emerald-500" : "bg-muted"
        )}>
          {clinica.activa && (
            <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative flex flex-col h-full p-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className={cn(
            "p-4 rounded-2xl",
            colors.iconBg,
            "group-hover:scale-110 transition-transform duration-300"
          )}>
            <Icon className={cn("h-8 w-8", colors.icon)} />
          </div>
          
          {clinica.badge && (
            <span className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-full border",
              colors.badge
            )}>
              {clinica.badge}
            </span>
          )}
        </div>

        {/* Title & Subtitle */}
        <div className="mb-2">
          <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
            {clinica.nombre}
          </h3>
          <p className={cn("text-sm font-semibold uppercase tracking-wider mt-1", colors.icon)}>
            {clinica.subtitulo}
          </p>
        </div>

        {/* Tagline */}
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">
          {clinica.tagline}
        </p>

        {/* Narrative - The soul of the card */}
        <p className="text-base text-foreground/80 leading-relaxed mb-6 flex-grow">
          {clinica.narrativa}
        </p>

        {/* Metadata */}
        <div className="space-y-2 mb-6 pt-4 border-t border-border/50">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{clinica.ubicacion}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span>{clinica.horario}</span>
          </div>
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "w-full py-4 px-6 rounded-xl",
            "text-white font-semibold",
            "flex items-center justify-center gap-2",
            "transition-all duration-300",
            colors.button
          )}
        >
          <span>Entrar al nodo</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </motion.div>
  );
};
