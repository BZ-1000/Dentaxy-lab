import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowRight, Zap, Users, Stethoscope } from 'lucide-react';
import { ClinicaUAO } from '@/data/clinicasUAO';
import { cn } from '@/lib/utils';

interface ClinicaCardProps {
  clinica: ClinicaUAO;
  onClick: () => void;
  index: number;
}

const iconsByType = {
  integracion: Zap,
  universitaria: Stethoscope,
  alto_flujo: Users,
  comunitaria: Users
};

export const ClinicaCard: React.FC<ClinicaCardProps> = ({ clinica, onClick, index }) => {
  const Icon = iconsByType[clinica.tipo];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={onClick}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-2xl",
        "bg-card border border-border/50",
        "hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5",
        "transition-all duration-300"
      )}
    >
      {/* Badge */}
      {clinica.badge && (
        <div className="absolute top-4 right-4 z-10">
          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
            {clinica.badge}
          </span>
        </div>
      )}

      {/* Glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      </div>

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className={cn(
            "p-3 rounded-xl",
            "bg-gradient-to-br from-primary/10 to-primary/5",
            "group-hover:from-primary/20 group-hover:to-primary/10",
            "transition-colors duration-300"
          )}>
            <Icon className="h-6 w-6 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-foreground mb-1">
              {clinica.nombre}
            </h3>
            <p className="text-sm text-muted-foreground">
              {clinica.subtitulo}
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{clinica.ubicacion}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span>{clinica.horario}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground/80 mb-4 line-clamp-2">
          {clinica.descripcion}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div className={cn(
              "h-2 w-2 rounded-full",
              clinica.activa ? "bg-emerald-500" : "bg-muted"
            )} />
            <span className="text-xs text-muted-foreground">
              {clinica.activa ? 'Activa' : 'Inactiva'}
            </span>
          </div>
          
          <div className="flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
            <span>Entrar</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
