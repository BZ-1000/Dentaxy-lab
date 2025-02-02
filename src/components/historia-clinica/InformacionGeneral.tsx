import React from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      <h3 className="text-xl font-semibold mb-4">Información General</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="fechaCreacion">Fecha de Creación</Label>
          <Input
            id="fechaCreacion"
            name="fechaCreacion"
            type="date"
            value={formData.fechaCreacion}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="autorizo">Autorizó</Label>
          <Input
            id="autorizo"
            name="autorizo"
            value={formData.autorizo}
            onChange={handleInputChange}
            placeholder="Nombre del autorizante"
          />
        </div>
        <div>
          <Label htmlFor="pacienteId">ID Paciente</Label>
          <Input
            id="pacienteId"
            name="pacienteId"
            value={formData.pacienteId}
            onChange={handleInputChange}
            placeholder="Número de identificación"
          />
        </div>
        <div>
          <Label htmlFor="pacienteNombre">Nombre del Paciente</Label>
          <Input
            id="pacienteNombre"
            name="pacienteNombre"
            value={formData.pacienteNombre}
            onChange={handleInputChange}
            placeholder="Nombre completo"
          />
        </div>
      </div>
    </Card>
  );
};

export default InformacionGeneral;