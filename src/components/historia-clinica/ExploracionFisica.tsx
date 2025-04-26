
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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

  // Parse blood pressure string into systolic and diastolic values
  const parseBP = (bp: string): { systolic: number, diastolic: number } | null => {
    const match = bp.match(/^(\d+)\/(\d+)$/);
    if (!match) return null;
    return {
      systolic: parseInt(match[1]),
      diastolic: parseInt(match[2])
    };
  };

  const getBPStatus = (bp: string) => {
    const values = parseBP(bp);
    if (!values) return null;
    return getBPCategory(values.systolic, values.diastolic);
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
            <span className="text-gray-400">IX.</span> EXPLORACIÓN FÍSICA
          </h2>
        </div>

        {!isMinimized && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* IMC Section */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="peso">Peso</Label>
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
                    <Label htmlFor="talla">Talla</Label>
                    <div className="relative">
                      <Input
                        id="talla"
                        type="number"
                        step="0.01"
                        value={formData.exploracionFisica?.signosVitales?.talla || ''}
                        onChange={(e) => handleExploracionFisicaChange('signosVitales.talla', e.target.value)}
                        className="pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">m</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="text-sm">IMC: <span className="font-semibold">{imc}</span></div>
                  <div className={`text-sm ${getIMCCategory(imc).color}`}>
                    Categoría: {getIMCCategory(imc).label}
                  </div>
                </div>
              </div>

              {/* Vital Signs Section */}
              <div className="space-y-4">
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

              {/* Blood Pressure */}
              <div className="space-y-2">
                <Label htmlFor="ta">Presión arterial</Label>
                <div className="relative">
                  <Textarea
                    id="ta"
                    value={formData.exploracionFisica?.signosVitales?.ta || ''}
                    onChange={(e) => handleExploracionFisicaChange('signosVitales.ta', e.target.value)}
                    placeholder="120/80"
                    className="resize-none h-[42px] py-2"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">mmHg</span>
                </div>
                {formData.exploracionFisica?.signosVitales?.ta && getBPStatus(formData.exploracionFisica.signosVitales.ta) && (
                  <div className={`text-sm ${getBPStatus(formData.exploracionFisica.signosVitales.ta)?.color}`}>
                    {getBPStatus(formData.exploracionFisica.signosVitales.ta)?.label}
                  </div>
                )}
              </div>

              {/* Pulse */}
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

              {/* Heart Rate */}
              <div className="space-y-2">
                <Label htmlFor="fc" className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4" />
                  Frecuencia cardíaca
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

              {/* Temperature */}
              <div className="space-y-2">
                <Label htmlFor="temperatura" className="flex items-center gap-2">
                  <ThermometerSun className="w-4 h-4" />
                  Temperatura
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

export default ExploracionFisica;
