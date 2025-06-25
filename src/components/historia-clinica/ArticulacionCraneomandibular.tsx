
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';

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
            <span className="text-gray-400">XI.</span> ARTICULACIÓN CRANEOMANDIBULAR
          </h2>
        </div>

        {!isMinimized && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Función Articular</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Apertura bucal (mm)</label>
                  <input
                    type="number"
                    value={formData.articulacionCraneomandibular?.aperturaBucal || ''}
                    onChange={(e) => handleArticulacionCraneomandibularChange('aperturaBucal', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Normal: 40-45 mm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Patrón de apertura</label>
                  <select 
                    value={formData.articulacionCraneomandibular?.patronApertura || ''}
                    onChange={(e) => handleArticulacionCraneomandibularChange('patronApertura', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="recto">Recto</option>
                    <option value="desviacion-derecha">Desviación a la derecha</option>
                    <option value="desviacion-izquierda">Desviación a la izquierda</option>
                    <option value="zigzag">En zigzag</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Dolor durante movimientos</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.articulacionCraneomandibular?.dolorMovimientos || false}
                        onChange={(e) => handleArticulacionCraneomandibularChange('dolorMovimientos', e.target.checked)}
                        className="mr-2"
                      />
                      Presente durante masticación o habla
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Ruidos Articulares</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Chasquidos</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.articulacionCraneomandibular?.chasquidos || false}
                        onChange={(e) => handleArticulacionCraneomandibularChange('chasquidos', e.target.checked)}
                        className="mr-2"
                      />
                      Chasquidos durante apertura/cierre
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Crepitación</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.articulacionCraneomandibular?.crepitacion || false}
                        onChange={(e) => handleArticulacionCraneomandibularChange('crepitacion', e.target.checked)}
                        className="mr-2"
                      />
                      Crepitación (ruido como arena)
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Limitación de movimiento</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.articulacionCraneomandibular?.limitacionMovimiento || false}
                        onChange={(e) => handleArticulacionCraneomandibularChange('limitacionMovimiento', e.target.checked)}
                        className="mr-2"
                      />
                      Trismus o limitación de apertura
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Observaciones adicionales</label>
              <textarea 
                value={formData.articulacionCraneomandibular?.observaciones || ''}
                onChange={(e) => handleArticulacionCraneomandibularChange('observaciones', e.target.value)}
                placeholder="Describe cualquier hallazgo adicional de la ATM..."
                className="w-full mt-2 p-3 border border-gray-300 rounded-md h-20 resize-none"
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ArticulacionCraneomandibular;
