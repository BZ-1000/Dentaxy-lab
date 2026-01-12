import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowLeft, Building2 } from 'lucide-react';
import { ClinicaUAO } from '@/data/clinicasUAO';
import { Button } from '@/components/ui/button';

interface ClinicaHeaderProps {
  clinica: ClinicaUAO;
  onBack: () => void;
}

export const ClinicaHeader: React.FC<ClinicaHeaderProps> = ({ clinica, onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-card border-b border-border/50"
    >
      <div className="container px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold">{clinica.nombre}</h1>
                  {clinica.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-primary/10 text-primary">
                      {clinica.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{clinica.subtitulo}</p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{clinica.ubicacion}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{clinica.horario}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Conectada</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
