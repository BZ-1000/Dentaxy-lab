import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { clinicasUAO } from '@/data/clinicasUAO';
import { ClinicaCard } from './ClinicaCard';
import { useAcademico } from '@/contexts/AcademicoContext';

export const ClinicasGrid: React.FC = () => {
  const navigate = useNavigate();
  const { navegarAClinica } = useAcademico();

  const handleClinicaClick = (clinicaId: string) => {
    navegarAClinica(clinicaId);
    navigate(`/academico/${clinicaId}`);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Selecciona una Clínica
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Cada clínica representa un nodo del ecosistema UAO. 
          Todas conectadas, todas estandarizadas.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clinicasUAO.map((clinica, index) => (
          <ClinicaCard
            key={clinica.id}
            clinica={clinica}
            index={index}
            onClick={() => handleClinicaClick(clinica.id)}
          />
        ))}
      </div>

      {/* Mensaje implícito */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <p className="text-xs text-muted-foreground/60 italic">
          Los datos clínicos generados pueden agruparse por clínica, programa o zona geográfica.
        </p>
      </motion.div>
    </div>
  );
};
