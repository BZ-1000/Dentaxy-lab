import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClinicaCard } from './ClinicaCard';
import { clinicasUAO } from '@/data/clinicasUAO';

export const ClinicasGrid: React.FC = () => {
  const navigate = useNavigate();

  const handleClinicaClick = (clinicaId: string) => {
    navigate(`/academico/${clinicaId}`);
  };

  return (
    <section className="py-8">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3">
          Red de Nodos Clínicos
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Selecciona un nodo para acceder a su infraestructura clínica
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {clinicasUAO.map((clinica, index) => (
          <ClinicaCard
            key={clinica.id}
            clinica={clinica}
            onClick={() => handleClinicaClick(clinica.id)}
            index={index}
          />
        ))}
      </div>

      {/* Bottom note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 text-center"
      >
        <p className="text-xs text-muted-foreground/60 italic max-w-lg mx-auto">
          Los datos clínicos generados se agrupan por clínica, programa o zona geográfica. 
          Trazabilidad completa desde el primer click.
        </p>
      </motion.div>
    </section>
  );
};
