
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

  const craneosTypes = [
    {
      type: 'Mesocefálico',
      img: '/lovable-uploads/4b2f41fa-3d14-4d72-b253-53b094c3ea33.png',
      description: 'Forma craneal intermedia, proporcionada y armoniosa. La relación entre el ancho y el largo del cráneo es equilibrada.'
    },
    {
      type: 'Dolicocéfalo',
      img: '/lovable-uploads/40014849-397d-4649-b504-ae9bbf90e571.png',
      description: 'Cráneo alargado y estrecho. El diámetro anteroposterior es mayor que el transversal.'
    },
    {
      type: 'Braquicéfalo',
      img: '/lovable-uploads/fa80bbb8-adc2-461f-8606-bd494c90a8ec.png',
      description: 'Cráneo ancho y corto. El diámetro transversal es proporcionalmente mayor que el anteroposterior.'
    }
  ];

  const perfilesTypes = [
    {
      type: 'Cóncavo',
      img: '/lovable-uploads/b8b26a5c-e938-49f5-a516-83479cf2788c.png',
      description: 'Perfil facial que presenta una depresión en la zona media.'
    },
    {
      type: 'Convexo',
      img: '/lovable-uploads/f46cdd2e-13e9-44d0-9faa-9e07d9b99814.png',
      description: 'Perfil facial que presenta una proyección hacia adelante en la zona media.'
    },
    {
      type: 'Recto',
      img: '/lovable-uploads/aee46598-7fcf-4e59-ae1a-8146ac199fe3.png',
      description: 'Perfil facial que presenta una línea recta sin proyecciones o depresiones marcadas.'
    }
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
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Cara</h3>
              
              {/* Tez */}
              <div className="space-y-2">
                <Label>Tez</Label>
                <RadioGroup
                  value={formData.examenCabeza?.tez || ''}
                  onValueChange={(value) => handleExamenCabezaChange('tez', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="clara" id="tez-clara" />
                    <Label htmlFor="tez-clara">Clara</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="morena" id="tez-morena" />
                    <Label htmlFor="tez-morena">Morena</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="oscura" id="tez-oscura" />
                    <Label htmlFor="tez-oscura">Oscura</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Estado de la piel */}
              <div className="space-y-2">
                <Label>Estado de la piel</Label>
                <RadioGroup
                  value={formData.examenCabeza?.estadoPiel || ''}
                  onValueChange={(value) => handleExamenCabezaChange('estadoPiel', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="reseca" id="piel-reseca" />
                    <Label htmlFor="piel-reseca">Reseca</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="humectada" id="piel-humectada" />
                    <Label htmlFor="piel-humectada">Humectada</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Características con detalles opcionales */}
              {['lunares', 'cicatrices', 'asimetriasFaciales', 'edema'].map((caracteristica) => (
                <div key={caracteristica} className="space-y-2">
                  <Label className="capitalize">{caracteristica.replace(/([A-Z])/g, ' $1').trim()}</Label>
                  <RadioGroup
                    value={formData.examenCabeza?.[caracteristica]?.presente ? 'si' : 'no'}
                    onValueChange={(value) => {
                      handleExamenCabezaChange(`${caracteristica}.presente`, value === 'si');
                      if (value === 'no') {
                        handleExamenCabezaChange(`${caracteristica}.detalles`, '');
                      }
                    }}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="si" id={`${caracteristica}-si`} />
                      <Label htmlFor={`${caracteristica}-si`}>Sí</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id={`${caracteristica}-no`} />
                      <Label htmlFor={`${caracteristica}-no`}>No</Label>
                    </div>
                  </RadioGroup>
                  
                  {formData.examenCabeza?.[caracteristica]?.presente && (
                    <Textarea
                      placeholder={`Describa los detalles de ${caracteristica.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                      value={formData.examenCabeza?.[caracteristica]?.detalles || ''}
                      onChange={(e) => handleExamenCabezaChange(`${caracteristica}.detalles`, e.target.value)}
                      className="mt-2"
                    />
                  )}
                </div>
              ))}

              {/* Otros hallazgos */}
              <div className="space-y-2">
                <Label>Otros hallazgos</Label>
                <Textarea
                  placeholder="Ingrese otros hallazgos relevantes"
                  value={formData.examenCabeza?.otrosHallazgos || ''}
                  onChange={(e) => handleExamenCabezaChange('otrosHallazgos', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ExamenCabeza;
