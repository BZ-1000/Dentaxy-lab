
import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";
import { Button } from "@/components/ui/button";
import { Minus, Maximize2, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';

interface Props {
  formData: FormDataState;
  handleInputChange: (section: string, field: string, value: any) => void;
}

const AntecedentesPersonalesNoPatologicos = ({
  formData,
  handleInputChange,
}: Props) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const formRef = useRef(null);

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    setIsMaximized(false);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    setIsMinimized(false);
  };

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}>
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Antecedentes Personales No Patológicos</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleMinimize}>
              <Minus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleMaximize}>
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <div className="p-6" ref={formRef}>
            <div className="space-y-6">
              {/* Higiene Personal */}
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Higiene Personal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Frecuencia de Baño */}
                  <div>
                    <Label>Frecuencia de Baño</Label>
                    <Select 
                      value={formData.higienePersonal?.frecuenciaBano}
                      onValueChange={(value) => handleInputChange('higienePersonal', 'frecuenciaBano', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diario">Diario</SelectItem>
                        <SelectItem value="cada tercer día">Cada tercer día</SelectItem>
                        <SelectItem value="semanal">Semanal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Cambio de Ropa (Movido al lugar de Aseo de Manos) */}
                  <div>
                    <Label>Aseo de Manos</Label>
                    <Select
                      value={formData.higienePersonal?.aseoManos}
                      onValueChange={(value) => handleInputChange('higienePersonal', 'aseoManos', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="antes-despues-comida">Antes y después de comer</SelectItem>
                        <SelectItem value="despues-sanitario">Después de ir al sanitario</SelectItem>
                        <SelectItem value="ocasional">Ocasional</SelectItem>
                        <SelectItem value="nunca">Nunca</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Aseo de Manos (Movido al lugar de Cambio de Ropa) */}
                  <div>
                    <Label>Cambio de Ropa</Label>
                    <Select
                      value={formData.higienePersonal?.cambioRopa}
                      onValueChange={(value) => handleInputChange('higienePersonal', 'cambioRopa', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diario">Diario</SelectItem>
                        <SelectItem value="cada-tercer-dia">Cada tercer día</SelectItem>
                        <SelectItem value="semanal">Semanal</SelectItem>
                        <SelectItem value="quincenal">Quincenal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AntecedentesPersonalesNoPatologicos;
