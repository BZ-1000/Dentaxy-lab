import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X, Mic } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { VoiceInput } from '@/components/ui/voice-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ExamenCabezaProps {
  formData: FormDataState;
  handleExamenCabezaChange: (part: string, value: string | boolean) => void;
}

const ExamenCabeza: React.FC<ExamenCabezaProps> = ({
  formData,
  handleExamenCabezaChange
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [selectedCraneoTipo, setSelectedCraneoTipo] = useState<string>('');
  const [selectedPerfilTipo, setSelectedPerfilTipo] = useState<string>('');
  const [showVoiceInput, setShowVoiceInput] = useState(false);

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

  const handleVoiceTranscription = (text: string) => {
    handleExamenCabezaChange('otrosHallazgos', text);
    setShowVoiceInput(false);
  };

  const craneosTypes = [
    {
      type: 'Mesocefálico',
      img: '/lovable-uploads/mesocefalo.png',
      description: 'Forma craneal intermedia, proporcionada y armoniosa. La relación entre el ancho y el largo del cráneo es equilibrada.'
    },
    {
      type: 'Dolicocéfalo',
      img: '/dolicocefalo.png',
      description: 'Cráneo alargado y estrecho. El diámetro anteroposterior es mayor que el transversal.'
    },
    {
      type: 'Braquicéfalo',
      img: '/braquicefalo.png',
      description: 'Cráneo ancho y corto. El diámetro transversal es proporcionalmente mayor que el anteroposterior.'
    }
  ];

  const perfilesTypes = [
    {
      type: 'Cóncavo',
      img: '/concavo.png',
      description: 'Perfil facial que presenta una depresión en la zona media.'
    },
    {
      type: 'Convexo',
      img: '/convexo.png',
      description: 'Perfil facial que presenta una proyección hacia adelante en la zona media.'
    },
    {
      type: 'Recto',
      img: '/recto.png',
      description: 'Perfil facial que presenta una línea recta sin proyecciones o depresiones marcadas.'
    }
  ];

  // Initialize nested objects if they don't exist
  const getNestedValue = (path: string, defaultValue: any = '') => {
    if (!formData.examenCabeza) return defaultValue;

    const parts = path.split('.');
    let current: any = formData.examenCabeza;

    for (const part of parts) {
      if (!current[part]) return defaultValue;
      current = current[part];
    }

    return current;
  };

  const caracteristicasFaciales = [
    { id: 'lunares', label: 'Lunares' },
    { id: 'cicatrices', label: 'Cicatrices' },
    { id: 'asimetriasFaciales', label: 'Asimetrías Faciales' },
    { id: 'edema', label: 'Edema' }
  ];

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
            <span className="text-gray-400">X.</span> EXAMEN DE CABEZA
          </h2>
        </div>

        {!isMinimized && (
          <div className="p-6 space-y-8">
            {/* Tipos de Cráneo */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tipos de Cráneo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {craneosTypes.map((craneo) => (
                  <div
                    key={craneo.type}
                    className={`relative cursor-pointer transition-all duration-300 rounded-lg overflow-hidden ${
                      selectedCraneoTipo === craneo.type
                        ? 'ring-2 ring-blue-500 shadow-lg transform scale-105'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => {
                      setSelectedCraneoTipo(craneo.type);
                      handleExamenCabezaChange('tipoCraneo', craneo.type);
                    }}
                  >
                    <img
                      src={craneo.img}
                      alt={craneo.type}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4 bg-white dark:bg-gray-800">
                      <h4 className="font-semibold text-center mb-2">{craneo.type}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{craneo.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tipos de Perfil */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tipos de Perfil Facial</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {perfilesTypes.map((perfil) => (
                  <div
                    key={perfil.type}
                    className={`relative cursor-pointer transition-all duration-300 rounded-lg overflow-hidden ${
                      selectedPerfilTipo === perfil.type
                        ? 'ring-2 ring-blue-500 shadow-lg transform scale-105'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => {
                      setSelectedPerfilTipo(perfil.type);
                      handleExamenCabezaChange('tipoPerfil', perfil.type);
                    }}
                  >
                    <img
                      src={perfil.img}
                      alt={perfil.type}
                      className="w-full h-48 object-contain"
                    />
                    <div className="p-4 bg-white dark:bg-gray-800">
                      <h4 className="font-semibold text-center mb-2">{perfil.type}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{perfil.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Características Faciales */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Cara</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tez - Dropdown */}
                <div className="space-y-2">
                  <Label>Tez</Label>
                  <Select
                    value={formData.examenCabeza?.tez || ''}
                    onValueChange={(value) => handleExamenCabezaChange('tez', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione la tez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clara">Clara</SelectItem>
                      <SelectItem value="morena">Morena</SelectItem>
                      <SelectItem value="oscura">Oscura</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Estado de la piel - Dropdown */}
                <div className="space-y-2">
                  <Label>Estado de la piel</Label>
                  <Select
                    value={formData.examenCabeza?.estadoPiel || ''}
                    onValueChange={(value) => handleExamenCabezaChange('estadoPiel', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione el estado de la piel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reseca">Reseca</SelectItem>
                      <SelectItem value="humectada">Humectada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Características con detalles opcionales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {caracteristicasFaciales.map((caracteristica) => (
                  <div key={caracteristica.id} className="space-y-2">
                    <Label>{caracteristica.label}</Label>
                    <Select
                      value={(formData.examenCabeza?.[caracteristica.id]?.presente ? 'si' : 'no') || 'no'}
                      onValueChange={(value) => {
                        handleExamenCabezaChange(`${caracteristica.id}.presente`, value === 'si');
                        if (value === 'no') {
                          handleExamenCabezaChange(`${caracteristica.id}.detalles`, '');
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="si">Sí</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>

                    {formData.examenCabeza?.[caracteristica.id]?.presente && (
                      <Textarea
                        placeholder={`Describa los detalles de ${caracteristica.label.toLowerCase()}`}
                        value={formData.examenCabeza?.[caracteristica.id]?.detalles || ''}
                        onChange={(e) => handleExamenCabezaChange(`${caracteristica.id}.detalles`, e.target.value)}
                        className="mt-2"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Otros hallazgos con botón de voz a texto */}
              <div className="space-y-2">
                <Label>Otros hallazgos</Label>
                <div className="relative">
                  <Textarea
                    placeholder="Ingrese otros hallazgos relevantes"
                    value={formData.examenCabeza?.otrosHallazgos || ''}
                    onChange={(e) => handleExamenCabezaChange('otrosHallazgos', e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowVoiceInput(true)}
                    className="absolute right-2 top-2 p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                    aria-label="Usar reconocimiento de voz"
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                </div>

                {showVoiceInput && (
                  <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                    <VoiceInput onTranscriptionComplete={handleVoiceTranscription} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ExamenCabeza;
