
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormDataState } from '@/types/historiaClinica';

interface AntecedentesAlergicosProps {
  formData: FormDataState;
  onChange?: (data: any) => void;
}

const AntecedentesAlergicos: React.FC<AntecedentesAlergicosProps> = ({
  formData,
  onChange
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    setIsMaximized(false);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    setIsMinimized(false);
  };

  const handleClose = () => {
    setIsMinimized(false);
    setIsMaximized(false);
  };

  const handleAntecedenteAlergicoChange = (field: string, value: any) => {
    if (!onChange) return;
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      onChange({
        antecedentesAlergicos: {
          ...formData.antecedentesAlergicos,
          [parent]: {
            ...formData.antecedentesAlergicos?.[parent],
            [child]: value
          }
        }
      });
    } else {
      onChange({
        antecedentesAlergicos: {
          ...formData.antecedentesAlergicos,
          [field]: value
        }
      });
    }
  };

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}>
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
              <button className="px-5 py-1.5 rounded-full transition-all duration-300 text-sm bg-blue-500 text-white shadow-md">
                Formulario
              </button>
              <button className="px-5 py-1.5 rounded-full transition-all duration-300 text-sm text-gray-700 dark:text-gray-300">
                Redacción IA
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleMinimize} className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors">
              <Minus className="w-4 h-4" />
            </button>
            <button onClick={handleMaximize} className="p-1 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors">
              <Maximize2 className="w-4 h-4" />
            </button>
            <button onClick={handleClose} className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex justify-start px-6 py-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-gray-400">V.</span> ANTECEDENTES ALÉRGICOS
          </h2>
        </div>

        {!isMinimized && (
          <div className="p-6 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-medium mb-4">Medicamentos</h3>
              
              <div className="flex items-center space-x-4 mb-4">
                <Switch 
                  id="es_alergico_medicamentos" 
                  checked={formData.antecedentesAlergicos?.medicamentos?.es_alergico || false}
                  onCheckedChange={(checked) => handleAntecedenteAlergicoChange('medicamentos.es_alergico', checked)}
                />
                <Label htmlFor="es_alergico_medicamentos">Alergia a medicamentos</Label>
              </div>
              
              {formData.antecedentesAlergicos?.medicamentos?.es_alergico && (
                <div className="space-y-4 pl-10">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label>¿Cuáles?</Label>
                      <Textarea 
                        value={formData.antecedentesAlergicos?.medicamentos?.cuales || ''}
                        onChange={(e) => handleAntecedenteAlergicoChange('medicamentos.cuales', e.target.value)}
                        placeholder="Escriba los medicamentos a los que es alérgico"
                      />
                    </div>
                    
                    <div>
                      <Label>Tipo de reacción</Label>
                      <Input 
                        value={formData.antecedentesAlergicos?.medicamentos?.tipo_reaccion || ''}
                        onChange={(e) => handleAntecedenteAlergicoChange('medicamentos.tipo_reaccion', e.target.value)}
                        placeholder="Ej. Erupción cutánea, dificultad para respirar"
                      />
                    </div>
                    
                    <div>
                      <Label>Severidad</Label>
                      <Select 
                        value={formData.antecedentesAlergicos?.medicamentos?.severidad || ''}
                        onValueChange={(value) => handleAntecedenteAlergicoChange('medicamentos.severidad', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione la severidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="leve">Leve</SelectItem>
                          <SelectItem value="moderada">Moderada</SelectItem>
                          <SelectItem value="severa">Severa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-medium mb-4">Alimentos</h3>
              
              <div className="flex items-center space-x-4 mb-4">
                <Switch 
                  id="es_alergico_alimentos" 
                  checked={formData.antecedentesAlergicos?.alimentos?.es_alergico || false}
                  onCheckedChange={(checked) => handleAntecedenteAlergicoChange('alimentos.es_alergico', checked)}
                />
                <Label htmlFor="es_alergico_alimentos">Alergia a alimentos</Label>
              </div>
              
              {formData.antecedentesAlergicos?.alimentos?.es_alergico && (
                <div className="space-y-4 pl-10">
                  <div>
                    <Label>¿Cuáles?</Label>
                    <Textarea 
                      value={formData.antecedentesAlergicos?.alimentos?.cuales || ''}
                      onChange={(e) => handleAntecedenteAlergicoChange('alimentos.cuales', e.target.value)}
                      placeholder="Escriba los alimentos a los que es alérgico"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-medium mb-4">Látex</h3>
              
              <div className="flex items-center space-x-4 mb-4">
                <Switch 
                  id="es_alergico_latex" 
                  checked={formData.antecedentesAlergicos?.latex?.es_alergico || false}
                  onCheckedChange={(checked) => handleAntecedenteAlergicoChange('latex.es_alergico', checked)}
                />
                <Label htmlFor="es_alergico_latex">Alergia al látex</Label>
              </div>
              
              {formData.antecedentesAlergicos?.latex?.es_alergico && (
                <div className="space-y-4 pl-10">
                  <div>
                    <Label>Descripción de la reacción</Label>
                    <Textarea 
                      value={formData.antecedentesAlergicos?.latex?.descripcion_reaccion || ''}
                      onChange={(e) => handleAntecedenteAlergicoChange('latex.descripcion_reaccion', e.target.value)}
                      placeholder="Describa la reacción alérgica al látex"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AntecedentesAlergicos;
