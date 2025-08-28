
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Minus, Maximize2, X, ThermometerSun, HeartPulse, Activity } from "lucide-react";
import { MedicalTermTooltip } from "@/components/ui/medical-term-tooltip";
import { FormDataState } from '@/types/historiaClinica';
import { calculateIMC, getIMCCategory, getBPCategory, vitalSignRanges } from '@/utils/medicalRanges';

interface ExploracionFisicaEnhancedProps {
  formData: FormDataState;
  handleExploracionFisicaChange: (field: string, value: any) => void;
}

const ExploracionFisicaEnhanced: React.FC<ExploracionFisicaEnhancedProps> = ({
  formData,
  handleExploracionFisicaChange
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [ageRange, setAgeRange] = useState<keyof typeof vitalSignRanges>('adult');
  const [imc, setIMC] = useState(0);

  useEffect(() => {
    const weight = parseFloat(formData.exploracionFisica?.signosVitales?.peso || '0');
    const height = parseFloat(formData.exploracionFisica?.signosVitales?.talla || '0');
    const calculatedIMC = calculateIMC(weight, height);
    setIMC(calculatedIMC);
    handleExploracionFisicaChange('signosVitales.imc', calculatedIMC.toString());
  }, [formData.exploracionFisica?.signosVitales?.peso, formData.exploracionFisica?.signosVitales?.talla]);

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

  const handleHeightInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      const formattedValue = value.length === 3
        ? (parseInt(value) / 100).toFixed(2)
        : value;
      handleExploracionFisicaChange('signosVitales.talla', formattedValue);
    }
  };

  const getBloodPressureValues = (bpString: string) => {
    const [systolic, diastolic] = bpString.split('/').map(Number);
    return { systolic: systolic || 0, diastolic: diastolic || 0 };
  };

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}>
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-0.5 sm:p-1">
              <button className="px-3 sm:px-5 py-1 sm:py-1.5 rounded-full transition-all duration-300 text-xs sm:text-sm bg-blue-500 text-white shadow-md">
                Formulario
              </button>
              <button className="px-3 sm:px-5 py-1 sm:py-1.5 rounded-full transition-all duration-300 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
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
            <span className="text-gray-400">IX.</span> 
            <MedicalTermTooltip term="Exploración física" section="exploracionFisica">
              EXPLORACIÓN FÍSICA
            </MedicalTermTooltip>
          </h2>
        </div>

        {!isMinimized && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Somatometría Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  <MedicalTermTooltip term="Somatometría" section="exploracionFisica" showIcon={false}>
                    Somatometría
                  </MedicalTermTooltip>
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="peso">
                      <MedicalTermTooltip term="Peso corporal" section="exploracionFisica" showIcon={false}>
                        Peso
                      </MedicalTermTooltip>
                    </Label>
                    <div className="relative">
                      <Input
                        id="peso"
                        type="number"
                        step="0.1"
                        value={formData.exploracionFisica?.signosVitales?.peso || ''}
                        onChange={(e) => handleExploracionFisicaChange('signosVitales.peso', e.target.value)}
                        className="pr-12"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">kg</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="talla">
                      <MedicalTermTooltip term="Talla" section="exploracionFisica" showIcon={false}>
                        Talla
                      </MedicalTermTooltip>
                    </Label>
                    <div className="relative">
                      <Input
                        id="talla"
                        type="text"
                        value={formData.exploracionFisica?.signosVitales?.talla || ''}
                        onChange={handleHeightInput}
                        className="pr-8"
                        placeholder="Ej: 170"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">m</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg w-full px-4 py-3">
                  <div className="text-sm">
                    <MedicalTermTooltip term="Índice de masa corporal" section="exploracionFisica" showIcon={false}>
                      IMC
                    </MedicalTermTooltip>: <span className="font-semibold">{imc}</span>
                  </div>
                  <div className={`text-sm ${getIMCCategory(imc).color}`}>
                    Categoría: {getIMCCategory(imc).label}
                  </div>
                </div>
              </div>

              {/* Signos Vitales Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  <MedicalTermTooltip term="Signos vitales" section="exploracionFisica" showIcon={false}>
                    Signos Vitales
                  </MedicalTermTooltip>
                </h3>

                <div className="space-y-2">
                  <Label>Rango de edad</Label>
                  <Select value={ageRange} onValueChange={(value: keyof typeof vitalSignRanges) => setAgeRange(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar rango de edad" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(vitalSignRanges).map(([key, value]) => (
                        <SelectItem key={key} value={key}>{value.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Presión Arterial */}
              <div className="space-y-2">
                <Label htmlFor="ta">
                  <MedicalTermTooltip term="Presión arterial" section="exploracionFisica" showIcon={false}>
                    Presión arterial
                  </MedicalTermTooltip>
                </Label>
                <div className="relative">
                  <Input
                    id="ta"
                    type="text"
                    value={formData.exploracionFisica?.signosVitales?.ta || ''}
                    onChange={(e) => handleExploracionFisicaChange('signosVitales.ta', e.target.value)}
                    placeholder="120/80"
                    className="pr-16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">mmHg</span>
                </div>
                {formData.exploracionFisica?.signosVitales?.ta && (
                  <div className={`text-sm ${getBPCategory(getBloodPressureValues(formData.exploracionFisica.signosVitales.ta).systolic, getBloodPressureValues(formData.exploracionFisica.signosVitales.ta).diastolic).color}`}>
                    {getBPCategory(getBloodPressureValues(formData.exploracionFisica.signosVitales.ta).systolic, getBloodPressureValues(formData.exploracionFisica.signosVitales.ta).diastolic).label}
                  </div>
                )}
              </div>

              {/* Pulso */}
              <div className="space-y-2">
                <Label htmlFor="pulso">Pulso</Label>
                <div className="relative">
                  <Input
                    id="pulso"
                    type="number"
                    value={formData.exploracionFisica?.signosVitales?.pulso || ''}
                    onChange={(e) => handleExploracionFisicaChange('signosVitales.pulso', e.target.value)}
                    className="pr-16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">ppm</span>
                </div>
                <div className="text-sm text-gray-500">
                  Rango normal: {vitalSignRanges[ageRange].pulse.min}-{vitalSignRanges[ageRange].pulse.max} ppm
                </div>
              </div>

              {/* Frecuencia Cardíaca */}
              <div className="space-y-2">
                <Label htmlFor="fc" className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4" />
                  <MedicalTermTooltip term="Frecuencia cardíaca" section="exploracionFisica" showIcon={false}>
                    Frecuencia cardíaca
                  </MedicalTermTooltip>
                </Label>
                <div className="relative">
                  <Input
                    id="fc"
                    type="number"
                    value={formData.exploracionFisica?.signosVitales?.fc || ''}
                    onChange={(e) => handleExploracionFisicaChange('signosVitales.fc', e.target.value)}
                    className="pr-16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">lpm</span>
                </div>
                <div className="text-sm text-gray-500">
                  Rango normal: {vitalSignRanges[ageRange].heartRate.min}-{vitalSignRanges[ageRange].heartRate.max} lpm
                </div>
              </div>

              {/* Temperatura */}
              <div className="space-y-2">
                <Label htmlFor="temperatura" className="flex items-center gap-2">
                  <ThermometerSun className="w-4 h-4" />
                  <MedicalTermTooltip term="Temperatura corporal" section="exploracionFisica" showIcon={false}>
                    Temperatura
                  </MedicalTermTooltip>
                </Label>
                <div className="relative">
                  <Input
                    id="temperatura"
                    type="number"
                    step="0.1"
                    value={formData.exploracionFisica?.signosVitales?.temperatura || ''}
                    onChange={(e) => handleExploracionFisicaChange('signosVitales.temperatura', e.target.value)}
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">°C</span>
                </div>
                <div className="text-sm text-gray-500">
                  Rango normal: {vitalSignRanges[ageRange].temperature.min}-{vitalSignRanges[ageRange].temperature.max}°C
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ExploracionFisicaEnhanced;
