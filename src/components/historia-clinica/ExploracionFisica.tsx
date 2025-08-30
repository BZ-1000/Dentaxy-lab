import React, { useState, useEffect, ReactNode } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Minus, Maximize2, X, ThermometerSun, HeartPulse, Gauge, Activity, Scale, Ruler } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { calculateIMC, getIMCCategory, getBPCategory, vitalSignRanges } from '@/utils/medicalRanges';

// --- Helper Component para un campo de input con estilo compacto ---
const CompactVitalInput = ({ id, label, icon, value, onChange, unit, placeholder, type = "number", step }: {
  id: string;
  label: string;
  icon: ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  unit: string;
  placeholder?: string;
  type?: string;
  step?: string;
}) => (
  <Card className="p-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
    <Label htmlFor={id} className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
      {icon}
      {label}
    </Label>
    <div className="relative">
      <Input
        id={id}
        type={type}
        step={step}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-8 text-sm pr-10 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
      />
      <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-gray-500">{unit}</span>
    </div>
  </Card>
);

// --- Componente Principal ---

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
  const [imcCategory, setImcCategory] = useState(getIMCCategory(0));

  useEffect(() => {
    const weight = parseFloat(formData.exploracionFisica?.signosVitales?.peso || '0');
    const height = parseFloat(formData.exploracionFisica?.signosVitales?.talla || '0');
    const calculatedIMC = calculateIMC(weight, height);
    setIMC(calculatedIMC);
    setImcCategory(getIMCCategory(calculatedIMC));
    handleExploracionFisicaChange('signosVitales.imc', calculatedIMC.toString());
  }, [formData.exploracionFisica?.signosVitales?.peso, formData.exploracionFisica?.signosVitales?.talla]);

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (isMaximized) setIsMaximized(false);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (isMinimized) setIsMinimized(false);
  };

  const handleClose = () => { /* Tu lógica de cierre original */ };

  const handleHeightInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, '');
    handleExploracionFisicaChange('signosVitales.talla', value);
  };

  const getBloodPressureValues = (bpString: string) => {
    const [systolic, diastolic] = (bpString || "").split('/').map(Number);
    return { systolic: systolic || 0, diastolic: diastolic || 0 };
  };

  const { systolic, diastolic } = getBloodPressureValues(formData.exploracionFisica?.signosVitales?.ta);
  const bpCategory = getBPCategory(systolic, diastolic);

  return (
    // DIV EXTERNO ORIGINAL CON SUS CLASES Y SOMBRAS
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}>
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] flex flex-col" : ""}`}>
        {/* ENCABEZADO ORIGINAL */}
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
        
        {/* CONTENIDO PRINCIPAL, AQUÍ SE APLICAN LAS MEJORAS ESTÉTICAS Y DE COMPRESIÓN */}
        <div className={`transition-all duration-300 ${isMaximized ? 'overflow-y-auto flex-grow' : ''} ${isMinimized ? 'max-h-0 overflow-hidden' : ''}`}>
            <div className="flex justify-start px-6 py-2">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="text-gray-400">IX.</span> EXPLORACIÓN FÍSICA
              </h2>
            </div>
        
            <div className="p-6 space-y-8"> {/* Espacio entre secciones */}

              {/* SECCIÓN DE ANTROPOMETRÍA */}
              <div className="border-b border-gray-100 dark:border-gray-700/50 pb-6 mb-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Antropometría</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <CompactVitalInput
                      id="peso"
                      label="Peso"
                      icon={<Scale className="w-4 h-4 text-blue-500" />}
                      value={formData.exploracionFisica?.signosVitales?.peso || ''}
                      onChange={(e) => handleExploracionFisicaChange('signosVitales.peso', e.target.value)}
                      unit="kg"
                      step="0.1"
                  />
                  <CompactVitalInput
                      id="talla"
                      label="Talla"
                      icon={<Ruler className="w-4 h-4 text-blue-500" />}
                      value={formData.exploracionFisica?.signosVitales?.talla || ''}
                      onChange={handleHeightInput}
                      unit="m"
                      placeholder="1.75"
                      type="text"
                  />

                  {/* Recuadro de IMC */}
                  <Card className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2 p-3 bg-gradient-to-r from-blue-50 dark:from-gray-700 to-blue-100 dark:to-gray-800 border-blue-200 dark:border-gray-600 shadow-md flex items-center gap-4 animate-fade-in">
                    <div className="bg-blue-200 dark:bg-blue-600 p-2 rounded-full">
                      <Scale className="w-5 h-5 text-blue-700 dark:text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">IMC:</p>
                      <p className="text-xl font-bold text-blue-800 dark:text-blue-200">{imc}</p>
                    </div>
                    <div className="ml-auto">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${imcCategory.bgColor} ${imcCategory.color}`}>{imcCategory.label}</span>
                    </div>
                  </Card>
                </div>
              </div>

              {/* SECCIÓN DE SIGNOS VITALES */}
              <div className="space-y-6"> {/* Espacio dentro de la sección */}
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Signos Vitales</h3>
                
                {/* Selector de Rango de Edad */}
                <Card className="p-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
                  <Label htmlFor="age-range" className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Grupo de Edad del Paciente</Label>
                  <Select value={ageRange} onValueChange={(value: keyof typeof vitalSignRanges) => setAgeRange(value)}>
                      <SelectTrigger id="age-range" className="h-8 text-sm bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0">
                          <SelectValue placeholder="Seleccionar rango de edad" />
                      </SelectTrigger>
                      <SelectContent>
                          {Object.entries(vitalSignRanges).map(([key, value]) => (
                              <SelectItem key={key} value={key}>{value.label}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                </Card>

                {/* Campos de Signos Vitales en Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Presión Arterial */}
                  <Card className="p-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
                    <Label htmlFor="ta" className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      <Gauge className="w-4 h-4 text-purple-500" />
                      Presión Arterial
                    </Label>
                    <div className="relative mb-2">
                      <Input
                        id="ta"
                        type="text"
                        value={formData.exploracionFisica?.signosVitales?.ta || ''}
                        onChange={(e) => handleExploracionFisicaChange('signosVitales.ta', e.target.value)}
                        placeholder="120/80"
                        className="h-8 text-sm pr-12 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                      />
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-gray-500">mmHg</span>
                    </div>
                    {formData.exploracionFisica?.signosVitales?.ta && (
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${bpCategory.bgColor} ${bpCategory.color}`}>{bpCategory.label}</span>
                    )}
                  </Card>
                  
                  <CompactVitalInput
                      id="pulso"
                      label="Pulso"
                      icon={<Activity className="w-4 h-4 text-orange-500" />}
                      value={formData.exploracionFisica?.signosVitales?.pulso || ''}
                      onChange={(e) => handleExploracionFisicaChange('signosVitales.pulso', e.target.value)}
                      unit="ppm"
                      normalRange={`${vitalSignRanges[ageRange].pulse.min}-${vitalSignRanges[ageRange].pulse.max} ppm`}
                  />

                  <CompactVitalInput
                      id="fc"
                      label="Frecuencia Cardíaca"
                      icon={<HeartPulse className="w-4 h-4 text-red-500" />}
                      value={formData.exploracionFisica?.signosVitales?.fc || ''}
                      onChange={(e) => handleExploracionFisicaChange('signosVitales.fc', e.target.value)}
                      unit="lpm"
                      normalRange={`${vitalSignRanges[ageRange].heartRate.min}-${vitalSignRanges[ageRange].heartRate.max} lpm`}
                  />
                  
                  <CompactVitalInput
                      id="temperatura"
                      label="Temperatura"
                      icon={<ThermometerSun className="w-4 h-4 text-green-500" />}
                      value={formData.exploracionFisica?.signosVitales?.temperatura || ''}
                      onChange={(e) => handleExploracionFisicaChange('signosVitales.temperatura', e.target.value)}
                      unit="°C"
                      normalRange={`${vitalSignRanges[ageRange].temperature.min}-${vitalSignRanges[ageRange].temperature.max}°C`}
                      step="0.1"
                  />
                </div>
              </div>
            </div>
        </div>
      </Card>
    </div>
  );
};

export default ExploracionFisica;