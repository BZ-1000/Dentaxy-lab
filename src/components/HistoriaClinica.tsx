import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const HistoriaClinica = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nombre: '',
    edad: '',
    genero: '',
    antecedentes: '',
    motivoConsulta: '',
    examenClinico: ''
  });
  const [resumen, setResumen] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generarResumen = async () => {
    // Aquí simularemos la respuesta de la IA por ahora
    const resumenGenerado = `
      Paciente ${formData.nombre} de ${formData.edad} años de edad, ${formData.genero}, 
      acude a consulta por ${formData.motivoConsulta}. 
      
      Antecedentes médicos relevantes: ${formData.antecedentes}
      
      En el examen clínico se observa: ${formData.examenClinico}
    `;
    
    setResumen(resumenGenerado);
    toast({
      title: "Resumen generado",
      description: "El resumen de la historia clínica ha sido generado exitosamente.",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">Historia Clínica Odontológica</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Datos del Paciente</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Nombre del paciente"
              />
            </div>
            
            <div>
              <Label htmlFor="edad">Edad</Label>
              <Input
                id="edad"
                name="edad"
                type="number"
                value={formData.edad}
                onChange={handleInputChange}
                placeholder="Edad"
              />
            </div>
            
            <div>
              <Label htmlFor="genero">Género</Label>
              <Input
                id="genero"
                name="genero"
                value={formData.genero}
                onChange={handleInputChange}
                placeholder="Género"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Antecedentes Médicos</h2>
          <div>
            <Label htmlFor="antecedentes">Antecedentes relevantes</Label>
            <Textarea
              id="antecedentes"
              name="antecedentes"
              value={formData.antecedentes}
              onChange={handleInputChange}
              placeholder="Describa los antecedentes médicos relevantes"
              className="h-32"
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Motivo de Consulta</h2>
          <div>
            <Label htmlFor="motivoConsulta">Motivo</Label>
            <Textarea
              id="motivoConsulta"
              name="motivoConsulta"
              value={formData.motivoConsulta}
              onChange={handleInputChange}
              placeholder="Describa el motivo de consulta"
              className="h-32"
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Examen Clínico</h2>
          <div>
            <Label htmlFor="examenClinico">Hallazgos</Label>
            <Textarea
              id="examenClinico"
              name="examenClinico"
              value={formData.examenClinico}
              onChange={handleInputChange}
              placeholder="Describa los hallazgos del examen clínico"
              className="h-32"
            />
          </div>
        </Card>
      </div>

      <div className="mt-8 flex justify-center">
        <Button 
          onClick={generarResumen}
          className="bg-primary hover:bg-primary/90"
        >
          Generar Resumen
        </Button>
      </div>

      {resumen && (
        <Card className="mt-8 p-6">
          <h2 className="text-xl font-semibold mb-4">Resumen Generado</h2>
          <div className="whitespace-pre-line bg-gray-50 p-4 rounded-lg">
            {resumen}
          </div>
        </Card>
      )}
    </div>
  );
};

export default HistoriaClinica;