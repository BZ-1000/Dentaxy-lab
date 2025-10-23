import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Minus, Maximize2, X, ThermometerSun, HeartPulse } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { calculateIMC, getIMCCategory, getBPCategory, vitalSignRanges } from '@/utils/medicalRanges';

interface ExploracionFisicaProps {
  formData: FormDataState;
  handleExploracionFisicaChange: (field: string, value: any) => void;
}

const ExploracionFisica: React.FC<ExploracionFisicaProps> = ({
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
    <div
      className={`max-w-5xl mx-auto transition-all duration-300 ${
        isMaximized ? "fixed inset-6 z-[9999]" : ""
      }`}
      data-formulario-section="exploracion-fisica"
    >
      <Card
        className={`bg-gradient-to-br from-white/80 to-blue-50/70 dark:from-gray-800/80 dark:to-gray-900/80
        backdrop-blur-md border border-blue-200/40 dark:border-blue-800/30
        shadow-[0_4px_20px_rgba(0,0,0,0.1)] rounded-2xl transition-all duration-300 ${
          isMaximized ? "h-[calc(100vh-3rem)] overflow-y-auto" : "hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)]"
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-blue-200/50 dark:border-blue-800/40 bg-gradient-to-r from-blue-500/10 to-blue-100/5 rounded-t-2xl">
          <div className="flex justify-center w-full">
            <div className="flex bg-blue-100/60 dark:bg-blue-900/50 rounded-full p-0.5 sm:p-1 shadow-inner">
              <button className="px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300 text-sm font-semibold bg-blue-500 text-white shadow-md hover:scale-105">
                Formulario
              </button>
              <button className="px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300 text-sm text-blue-800 dark:text-blue-200 hover:bg-blue-300/30">
                Redacción IA
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 absolute right-4">
            <button
              onClick={handleMinimize}
              className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-all duration-200 hover:scale-110"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={handleMaximize}
              className="p-1 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-all duration-200 hover:scale-110"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleClose}
              className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200 hover:scale-110"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TITLE */}
        <div className="flex justify-start px-6 py-3 bg-blue-50/40 dark:bg-gray-800/40 border-b border-blue-200/40 dark:border-blue-900/40">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <span className="text-blue-400 font-bold">IX.</span> EXPLORACIÓN FÍSICA
          </h2>
        </div>

        {/* BODY */}
        {!isMinimized && (
          <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* IMC Section */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="peso" className="text-blue-600 dark:text-blue-300 font-medium">Peso</Label>
                    <div className="relative">
                      <Input
                        id="peso"
                        type="number"
                        step="0.1"
                        value={formData.exploracionFisica?.signosVitales?.peso || ''}
                        onChange={(e) => handleExploracionFisicaChange('signosVitales.peso', e.target.value)}
                        className="pr-12 border-blue-200 dark:border-blue-800 focus:ring-2 focus:ring-blue-400"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">kg</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="talla" className="text-blue-600 dark:text-blue-300 font-medium">Talla</Label>
                    <div className="relative">
                      <Input
                        id="talla"
                        type="text"
                        value={formData.exploracionFisica?.signosVitales?.talla || ''}
                        onChange={handleHeightInput}
                        className="pr-8 border-blue-200 dark:border-blue-800 focus:ring-2 focus:ring-blue-400"
                        placeholder="Ej: 170"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">m</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-100/60 to-blue-50/30 dark:from-blue-900/40 dark:to-gray-900/30 rounded-lg w-full px-4 py-3 shadow-inner">
                  <div className="text-sm text-gray-800 dark:text-gray-200">
                    IMC: <span className="font-semibold">{imc}</span>
                  </div>
                  <div className={`text-sm mt-1 ${getIMCCategory(imc).color}`}>
                    Categoría: {getIMCCategory(imc).label}
                  </div>
                </div>
              </div>

              {/* Vital Signs */}
              <div className="space-y-4">
                <Label className="text-blue-600 dark:text-blue-300 font-medium">Rango de edad</Label>
                <Select
                  value={ageRange}
                  onValueChange={(value: keyof typeof vitalSignRanges) => setAgeRange(value)}
                >
                  <SelectTrigger className="border-blue-200 dark:border-blue-800 focus:ring-2 focus:ring-blue-400">
                    <SelectValue placeholder="Seleccionar rango de edad" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(vitalSignRanges).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Pressure */}
              <div className="space-y-3">
                <Label htmlFor="ta" className="text-blue-600 dark:text-blue-300 font-medium">
                  Presión arterial
                </Label>
                <div className="relative">
                  <Input
                    id="ta"
                    type="text"
                    value={formData.exploracionFisica?.signosVitales?.ta || ''}
                    onChange={(e) => handleExploracionFisicaChange('signosVitales.ta', e.target.value)}
                    placeholder="120/80"
                    className="pr-16 border-blue-200 dark:border-blue-800 focus:ring-2 focus:ring-blue-400"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">mmHg</span>
                </div>
                {formData.exploracionFisica?.signosVitales?.ta && (
                  <div className={`text-sm ${getBPCategory(getBloodPressureValues(formData.exploracionFisica.signosVitales.ta).systolic, getBloodPressureValues(formData.exploracionFisica.signosVitales.ta).diastolic).color}`}>
                    {getBPCategory(getBloodPressureValues(formData.exploracionFisica.signosVitales.ta).systolic, getBloodPressureValues(formData.exploracionFisica.signosVitales.ta).diastolic).label}
                  </div>
                )}
              </div>

              {/* Pulse */}
              <div className="space-y-3">
                <Label htmlFor="pulso" className="text-blue-600 dark:text-blue-300 font-medium">Pulso</Label>
                <div className="relative">
                  <Input
                    id="pulso"
                    type="number"
                    value={formData.exploracionFisica?.signosVitales?.pulso || ''}
                    onChange={(e) => handleExploracionFisicaChange('signosVitales.pulso', e.target.value)}
                    className="pr-16 border-blue-200 dark:border-blue-800 focus:ring-2 focus:ring-blue-400"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">ppm</span>
                </div>
                <div className="text-sm text-gray-500">
                  Rango normal: {vitalSignRanges[ageRange].pulse.min}-{vitalSignRanges[ageRange].pulse.max} ppm
                </div>
              </div>

              {/* Heart Rate */}
              <div className="space-y-3">
                <Label htmlFor="fc" className="flex items-center gap-2 text-blue-600 dark:text-blue-300 font-medium">
                  <HeartPulse className="w-4 h-4 text-red-500" />
                  Frecuencia cardíaca
                </Label>
                <div className="relative">
                  <Input
                    id="fc"
                    type="number"
                    value={formData.exploracionFisica?.signosVitales?.fc || ''}
                    onChange={(e) => handleExploracionFisicaChange('signosVitales.fc', e.target.value)}
                    className="pr-16 border-blue-200 dark:border-blue-800 focus:ring-2 focus:ring-blue-400"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">lpm</span>
                </div>
                <div className="text-sm text-gray-500">
                  Rango normal: {vitalSignRanges[ageRange].heartRate.min}-{vitalSignRanges[ageRange].heartRate.max} lpm
                </div>
              </div>

              {/* Temperature */}
              <div className="space-y-3">
                <Label htmlFor="temperatura" className="flex items-center gap-2 text-blue-600 dark:text-blue-300 font-medium">
                  <ThermometerSun className="w-4 h-4 text-orange-400" />
                  Temperatura
                </Label>
                <div className="relative">
                  <Input
                    id="temperatura"
                    type="number"
                    step="0.1"
                    value={formData.exploracionFisica?.signosVitales?.temperatura || ''}
                    onChange={(e) => handleExploracionFisicaChange('signosVitales.temperatura', e.target.value)}
                    className="pr-12 border-blue-200 dark:border-blue-800 focus:ring-2 focus:ring-blue-400"
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

export default ExploracionFisica;
