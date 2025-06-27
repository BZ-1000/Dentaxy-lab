
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ArticulacionCraneomandibularProps {
  formData: FormDataState;
  handleArticulacionCraneomandibularChange: (part: string, value: string | boolean) => void;
}

const ArticulacionCraneomandibular: React.FC<ArticulacionCraneomandibularProps> = ({
  formData,
  handleArticulacionCraneomandibularChange
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

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : "my-4"}`}>
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)]" : ""} ${isMinimized ? "h-16 overflow-hidden" : ""}`}>
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

        <div className={`flex-grow overflow-y-auto ${isMinimized ? 'hidden' : ''}`}>
          <div className="flex justify-start px-6 pt-4 pb-2">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white tracking-tight">
              <span className="text-blue-500 dark:text-blue-400 font-semibold">XI.</span> ARTICULACIÓN CRANEOMANDIBULAR
            </h2>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Apertura bucal</Label>
                  <Select
                    value={formData.articulacionCraneomandibular?.aperturaBucal || ''}
                    onValueChange={(value) => handleArticulacionCraneomandibularChange('aperturaBucal', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="limitada">Limitada</SelectItem>
                      <SelectItem value="excesiva">Excesiva</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Movimientos laterales</Label>
                  <Select
                    value={formData.articulacionCraneomandibular?.movimientosLaterales || ''}
                    onValueChange={(value) => handleArticulacionCraneomandibularChange('movimientosLaterales', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normales">Normales</SelectItem>
                      <SelectItem value="limitados">Limitados</SelectItem>
                      <SelectItem value="dolorosos">Dolorosos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ruidos articulares</Label>
                  <Select
                    value={formData.articulacionCraneomandibular?.ruidosArticulares || ''}
                    onValueChange={(value) => handleArticulacionCraneomandibularChange('ruidosArticulares', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ausentes">Ausentes</SelectItem>
                      <SelectItem value="clic">Clic</SelectItem>
                      <SelectItem value="crepitacion">Crepitación</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Dolor</Label>
                  <Select
                    value={formData.articulacionCraneomandibular?.dolor || ''}
                    onValueChange={(value) => handleArticulacionCraneomandibularChange('dolor', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ausente">Ausente</SelectItem>
                      <SelectItem value="leve">Leve</SelectItem>
                      <SelectItem value="moderado">Moderado</SelectItem>
                      <SelectItem value="severo">Severo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Observaciones adicionales</Label>
              <Textarea
                placeholder="Describa cualquier observación adicional sobre la articulación craneomandibular..."
                value={formData.articulacionCraneomandibular?.observaciones || ''}
                onChange={(e) => handleArticulacionCraneomandibularChange('observaciones', e.target.value)}
                className="min-h-[100px] mt-2"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ArticulacionCraneomandibular;
