import React from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface InformacionGeneralProps {
  formData: {
    fechaCreacion: string;
    autorizo: string;
    pacienteId: string;
    pacienteNombre: string;
    alumno: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InformacionGeneral = ({ formData, handleInputChange }: InformacionGeneralProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-mplus font-normal mb-4">Información General</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          id="fechaCreacion"
          name="fechaCreacion"
          type="date"
          value={formData.fechaCreacion}
          onChange={handleInputChange}
          className="shadow-sm"
          placeholder="Fecha de Creación"
        />
        <Input
          id="autorizo"
          name="autorizo"
          value={formData.autorizo}
          onChange={handleInputChange}
          className="shadow-sm"
          placeholder="Nombre del autorizante"
        />
        <Input
          id="pacienteId"
          name="pacienteId"
          value={formData.pacienteId}
          onChange={handleInputChange}
          className="shadow-sm"
          placeholder="Número de identificación del paciente"
        />
        <Input
          id="pacienteNombre"
          name="pacienteNombre"
          value={formData.pacienteNombre}
          onChange={handleInputChange}
          className="shadow-sm"
          placeholder="Nombre completo del paciente"
        />
      </div>
    </Card>
  );
};

export default InformacionGeneral;