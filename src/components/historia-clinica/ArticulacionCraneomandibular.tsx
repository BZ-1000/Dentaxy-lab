
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';

interface ArticulacionCraneomandibularProps {
  formData: FormDataState;
  handleArticulacionCraneomandibularChange: (field: string, value: string | boolean) => void;
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
            <div className="space-y-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sinHallazgos"
                  checked={Boolean(formData.articulacionCraneomandibular?.sinHallazgos)}
                  onChange={(e) => handleArticulacionCraneomandibularChange('sinHallazgos', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="sinHallazgos" className="text-sm font-medium">Sin hallazgos</label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Apertura bucal</label>
                  <input
                    type="text"
                    value={String(formData.articulacionCraneomandibular?.aperturaBucal || '')}
                    onChange={(e) => handleArticulacionCraneomandibularChange('aperturaBucal', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Describir apertura bucal..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Movimiento lateral</label>
                  <input
                    type="text"
                    value={String(formData.articulacionCraneomandibular?.movimientoLateral || '')}
                    onChange={(e) => handleArticulacionCraneomandibularChange('movimientoLateral', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Describir movimiento lateral..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="chasquidos"
                    checked={Boolean(formData.articulacionCraneomandibular?.chasquidos)}
                    onChange={(e) => handleArticulacionCraneomandibularChange('chasquidos', e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="chasquidos" className="text-sm font-medium">Chasquidos</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="dolor"
                    checked={Boolean(formData.articulacionCraneomandibular?.dolor)}
                    onChange={(e) => handleArticulacionCraneomandibularChange('dolor', e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="dolor" className="text-sm font-medium">Dolor</label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Observaciones</label>
                <textarea
                  value={String(formData.articulacionCraneomandibular?.observaciones || '')}
                  onChange={(e) => handleArticulacionCraneomandibularChange('observaciones', e.target.value)}
                  placeholder="Observaciones adicionales sobre la ATM..."
                  className="w-full p-3 border border-gray-300 rounded-md h-20 resize-none"
                />
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ArticulacionCraneomandibular;
