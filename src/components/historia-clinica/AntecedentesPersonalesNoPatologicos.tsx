import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Minus, Maximize2, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface AntecedentesPersonalesNoPatologicosProps {
  formData: FormDataState;
  handleAntecedenteChange: (field: string, value: any) => void;
  toggleService: (service: string) => void;
}

const AntecedentesPersonalesNoPatologicos: React.FC<AntecedentesPersonalesNoPatologicosProps> = ({ formData, handleAntecedenteChange, toggleService }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showForm, setShowForm] = useState(true);

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

  const WordButton = ({
    word,
    type,
    isActive,
    onToggle
  }: {
    word: string;
    type: string;
    isActive: boolean;
    onToggle: () => void;
  }) => (
    <button
      onClick={onToggle}
      className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-blue-500 text-white shadow-md transform scale-105"
          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
      }`}
    >
      {word}
    </button>
  );

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}>
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-0.5 sm:p-1">
              <button
                onClick={() => setShowForm(true)}
                className={`px-3 sm:px-5 py-1 sm:py-1.5 rounded-full transition-all duration-300 text-xs sm:text-sm ${showForm ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}
              >
                Formulario
              </button>
              <button
                onClick={() => setShowForm(false)}
                className={`px-3 sm:px-5 py-1 sm:py-1.5 rounded-full transition-all duration-300 text-xs sm:text-sm ${!showForm ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}
              >
                Redacción IA
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={handleMinimize} className="p-0.5 sm:p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors">
              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button onClick={handleMaximize} className="p-0.5 sm:p-1 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors">
              <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button onClick={handleClose} className="p-0.5 sm:p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        <div className="flex justify-start px-6 py-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-gray-400">III.</span> ANTECEDENTES PERSONALES NO PATOLÓGICOS
          </h2>
        </div>

        {!isMinimized && (
          <div className="p-6">
            {showForm ? (
              <div className="space-y-6">
                <div>
                  <Label className="block text-sm font-medium mb-1">Tabaquismo:</Label>
                  <div className="flex gap-2">
                    <WordButton
                      word="Nunca"
                      type="tabaquismo"
                      isActive={formData.antecedentesPersonalesNoPatologicos.tabaquismo === 'nunca'}
                      onToggle={() => handleAntecedenteChange('tabaquismo', 'nunca')}
                    />
                    <WordButton
                      word="Ocasional"
                      type="tabaquismo"
                      isActive={formData.antecedentesPersonalesNoPatologicos.tabaquismo === 'ocasional'}
                      onToggle={() => handleAntecedenteChange('tabaquismo', 'ocasional')}
                    />
                    <WordButton
                      word="Diario"
                      type="tabaquismo"
                      isActive={formData.antecedentesPersonalesNoPatologicos.tabaquismo === 'diario'}
                      onToggle={() => handleAntecedenteChange('tabaquismo', 'diario')}
                    />
                  </div>
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-1">Alcoholismo:</Label>
                  <div className="flex gap-2">
                    <WordButton
                      word="Nunca"
                      type="alcoholismo"
                      isActive={formData.antecedentesPersonalesNoPatologicos.alcoholismo === 'nunca'}
                      onToggle={() => handleAntecedenteChange('alcoholismo', 'nunca')}
                    />
                    <WordButton
                      word="Ocasional"
                      type="alcoholismo"
                      isActive={formData.antecedentesPersonalesNoPatologicos.alcoholismo === 'ocasional'}
                      onToggle={() => handleAntecedenteChange('alcoholismo', 'ocasional')}
                    />
                    <WordButton
                      word="Diario"
                      type="alcoholismo"
                      isActive={formData.antecedentesPersonalesNoPatologicos.alcoholismo === 'diario'}
                      onToggle={() => handleAntecedenteChange('alcoholismo', 'diario')}
                    />
                  </div>
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-1">Toxicomanías:</Label>
                  <div className="flex gap-2">
                    <WordButton
                      word="Nunca"
                      type="toxicomanias"
                      isActive={formData.antecedentesPersonalesNoPatologicos.toxicomanias === 'nunca'}
                      onToggle={() => handleAntecedenteChange('toxicomanias', 'nunca')}
                    />
                    <WordButton
                      word="Ocasional"
                      type="toxicomanias"
                      isActive={formData.antecedentesPersonalesNoPatologicos.toxicomanias === 'ocasional'}
                      onToggle={() => handleAntecedenteChange('toxicomanias', 'ocasional')}
                    />
                    <WordButton
                      word="Diario"
                      type="toxicomanias"
                      isActive={formData.antecedentesPersonalesNoPatologicos.toxicomanias === 'diario'}
                      onToggle={() => handleAntecedenteChange('toxicomanias', 'diario')}
                    />
                  </div>
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-1">Higiene bucal:</Label>
                  <div className="flex gap-2">
                    <WordButton
                      word="Buena"
                      type="higieneBucal"
                      isActive={formData.antecedentesPersonalesNoPatologicos.higieneBucal === 'buena'}
                      onToggle={() => handleAntecedenteChange('higieneBucal', 'buena')}
                    />
                    <WordButton
                      word="Regular"
                      type="higieneBucal"
                      isActive={formData.antecedentesPersonalesNoPatologicos.higieneBucal === 'regular'}
                      onToggle={() => handleAntecedenteChange('higieneBucal', 'regular')}
                    />
                    <WordButton
                      word="Mala"
                      type="higieneBucal"
                      isActive={formData.antecedentesPersonalesNoPatologicos.higieneBucal === 'mala'}
                      onToggle={() => handleAntecedenteChange('higieneBucal', 'mala')}
                    />
                  </div>
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-1">Tipo de alimentación:</Label>
                  <div className="flex gap-2">
                    <WordButton
                      word="Buena"
                      type="alimentacion"
                      isActive={formData.antecedentesPersonalesNoPatologicos.alimentacion === 'buena'}
                      onToggle={() => handleAntecedenteChange('alimentacion', 'buena')}
                    />
                    <WordButton
                      word="Regular"
                      type="alimentacion"
                      isActive={formData.antecedentesPersonalesNoPatologicos.alimentacion === 'regular'}
                      onToggle={() => handleAntecedenteChange('alimentacion', 'regular')}
                    />
                    <WordButton
                      word="Mala"
                      type="alimentacion"
                      isActive={formData.antecedentesPersonalesNoPatologicos.alimentacion === 'mala'}
                      onToggle={() => handleAntecedenteChange('alimentacion', 'mala')}
                    />
                  </div>
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-1">Actividad física:</Label>
                  <div className="flex gap-2">
                    <WordButton
                      word="Activo"
                      type="actividadFisica"
                      isActive={formData.antecedentesPersonalesNoPatologicos.actividadFisica === 'activo'}
                      onToggle={() => handleAntecedenteChange('actividadFisica', 'activo')}
                    />
                    <WordButton
                      word="Sedentario"
                      type="actividadFisica"
                      isActive={formData.antecedentesPersonalesNoPatologicos.actividadFisica === 'sedentario'}
                      onToggle={() => handleAntecedenteChange('actividadFisica', 'sedentario')}
                    />
                  </div>
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-1">Servicios básicos en domicilio:</Label>
                  <div className="flex gap-2">
                    <WordButton
                      word="Si"
                      type="serviciosBasicos"
                      isActive={formData.antecedentesPersonalesNoPatologicos.serviciosBasicos === 'si'}
                      onToggle={() => handleAntecedenteChange('serviciosBasicos', 'si')}
                    />
                    <WordButton
                      word="No"
                      type="serviciosBasicos"
                      isActive={formData.antecedentesPersonalesNoPatologicos.serviciosBasicos === 'no'}
                      onToggle={() => handleAntecedenteChange('serviciosBasicos', 'no')}
                    />
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button onClick={() => setShowForm(false)}>
                    Generar Redacción IA
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Tabaquismo:</Label>
                    <Textarea value={formData.antecedentesPersonalesNoPatologicos.tabaquismo || ''} readOnly />
                  </div>
                  <div>
                    <Label>Alcoholismo:</Label>
                    <Textarea value={formData.antecedentesPersonalesNoPatologicos.alcoholismo || ''} readOnly />
                  </div>
                  <div>
                    <Label>Toxicomanías:</Label>
                    <Textarea value={formData.antecedentesPersonalesNoPatologicos.toxicomanias || ''} readOnly />
                  </div>
                  <div>
                    <Label>Higiene bucal:</Label>
                    <Textarea value={formData.antecedentesPersonalesNoPatologicos.higieneBucal || ''} readOnly />
                  </div>
                  <div>
                    <Label>Tipo de alimentación:</Label>
                    <Textarea value={formData.antecedentesPersonalesNoPatologicos.alimentacion || ''} readOnly />
                  </div>
                  <div>
                    <Label>Actividad física:</Label>
                    <Textarea value={formData.antecedentesPersonalesNoPatologicos.actividadFisica || ''} readOnly />
                  </div>
                  <div>
                    <Label>Servicios básicos en domicilio:</Label>
                    <Textarea value={formData.antecedentesPersonalesNoPatologicos.serviciosBasicos || ''} readOnly />
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button onClick={() => setShowForm(true)}>
                    Volver al Formulario
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AntecedentesPersonalesNoPatologicos;
