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
    <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0">
      <h3 className="text-2xl font-mplus font-normal mb-6 text-gray-800 dark:text-gray-100">Información General</h3>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex items-center justify-center gap-3 h-[38px]">
          <Label htmlFor="fechaCreacion" className="text-muted-foreground text-sm">
            Fecha de realización
          </Label>
          <Input
            id="fechaCreacion"
            name="fechaCreacion"
            type="date"
            value={formData.fechaCreacion}
            onChange={handleInputChange}
            className="shadow-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/50 w-48"
            placeholder="Fecha de Creación"
          />
        </div>
        <Input
          id="autorizo"
          name="autorizo"
          value={formData.autorizo}
          onChange={handleInputChange}
          className="shadow-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/50"
          placeholder="Nombre del autorizante"
        />
        <Input
          id="pacienteId"
          name="pacienteId"
          value={formData.pacienteId}
          onChange={handleInputChange}
          className="shadow-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/50"
          placeholder="Número de identificación del paciente"
        />
        <Input
          id="pacienteNombre"
          name="pacienteNombre"
          value={formData.pacienteNombre}
          onChange={handleInputChange}
          className="shadow-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/50"
          placeholder="Nombre completo del paciente"
        />
      </div>
    </Card>
  );
};

export default InformacionGeneral;