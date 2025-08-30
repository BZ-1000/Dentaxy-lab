import React, { useState, useEffect, ReactNode } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Minus, Maximize2, X, ThermometerSun, HeartPulse, Gauge, Activity, Scale, Ruler } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { calculateIMC, getIMCCategory, getBPCategory, vitalSignRanges } from '@/utils/medicalRanges';

// --- Helper Components para la ESTÉTICA INTERNA ---

// Componente para crear secciones visuales claras DENTRO del formulario
const Section = ({ title, children }: { title: string, children: ReactNode }) => (
  <fieldset className="space-y-6">
    <legend className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</legend>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
      {children}
    </div>
  </fieldset>
);

// Componente reutilizable para CADA CAMPO de signo vital
const VitalSignInput = ({ id, label, icon, value, onChange, unit, normalRange, placeholder, type = "number", step }: {
  id: string;
  label: string;
  icon: ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  unit: string;
  normalRange?: string;
  placeholder?: string;
  type?: string;
  step?: string;
}) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
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
        className="pr-14 bg-white dark:bg-gray-800"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">{unit}</span>
    </div>
    {normalRange && <p className="text-xs text-gray-500 dark:text-gray-400">Rango normal: {normalRange}</p>}
  </div>
);


// --- Componente Principal con EXTERIOR ORIGINAL ---

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

  // Mantenemos tu manejador original para el formato de la talla
  const handleHeightInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, ''); // Permite puntos para decimales
    handleExploracionFisicaChange('signosVitales.talla', value);
  };

  const getBloodPressureValues = (bpString: string) => {
    const [systolic, diastolic] = (bpString || "").split('/').map(Number);
    return { systolic: systolic || 0, diastolic: diastolic || 0 };
  };

  const { systolic, diastolic } = getBloodPressureValues(formData.exploracionFisica?.signosVitales?.ta);
  const bpCategory = getBPCategory(systolic, diastolic);

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}>
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] flex flex-col" : ""}`}>
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
        
        <div className={`transition-all duration-300 ${isMaximized ? 'overflow-y-auto flex-grow' : ''} ${isMinimized ? 'max-h-0 overflow-hidden' : ''}`}>
            <div className="flex justify-start px-6 py-2">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="text-gray-400">IX.</span> EXPLORACIÓN FÍSICA
              </h2>
            </div>
        
            <div className="p-6 space-y-10">
              {/* --- INICIO DEL CONTENIDO MEJORADO --- */}

              <Section title="Antropometría">
                  <VitalSignInput
                      id="peso"
                      label="Peso"
                      icon={<Scale className="w-5 h-5 text-gray-400" />}
                      value={formData.exploracionFisica?.signosVitales?.peso || ''}
                      onChange={(e) => handleExploracionFisicaChange('signosVitales.peso', e.target.value)}
                      unit="kg"
                      step="0.1"
                  />
                  <VitalSignInput
                      id="talla"
                      label="Talla"
                      icon={<Ruler className="w-5 h-5 text-gray-400" />}
                      value={formData.exploracionFisica?.signosVitales?.talla || ''}
                      onChange={handleHeightInput}
                      unit="m"
                      placeholder="Ej: 1.75"
                      type="text"
                  />
                  <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                      <div className="text-center">
                          <p className="text-sm text-gray-500">IMC Calculado</p>
                          <p className="text-3xl font-bold text-gray-800 dark:text-white">{imc}</p>
                      </div>
                      <div className="w-full sm:w-px h-px sm:h-12 bg-gray-200 dark:bg-gray-700"></div>
                      <div className="flex-1">
                          <p className="text-sm text-gray-500">Categoría</p>
                          <p className={`text-lg font-semibold ${imcCategory.color}`}>{imcCategory.label}</p>
                      </div>
                  </div>
              </Section>
              
              <Section title="Signos Vitales">
                  <div className="md:col-span-2">
                      <Label htmlFor="age-range" className="text-base">Grupo de Edad del Paciente</Label>
                      <Select value={ageRange} onValueChange={(value: keyof typeof vitalSignRanges) => setAgeRange(value)}>
                          <SelectTrigger id="age-range" className="mt-2 bg-white dark:bg-gray-800">
                              <SelectValue placeholder="Seleccionar rango de edad" />
                          </SelectTrigger>
                          <SelectContent>
                              {Object.entries(vitalSignRanges).map(([key, value]) => (
                                  <SelectItem key={key} value={key}>{value.label}</SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                  </div>

                  <div>
                      <VitalSignInput
                          id="ta"
                          label="Presión Arterial"
                          icon={<Gauge className="w-5 h-5 text-gray-400" />}
                          value={formData.exploracionFisica?.signosVitales?.ta || ''}
                          onChange={(e) => handleExploracionFisicaChange('signosVitales.ta', e.target.value)}
                          unit="mmHg"
                          placeholder="120/80"
                          type="text"
                      />
                      {formData.exploracionFisica?.signosVitales?.ta && (
                          <div className="mt-2">
                              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${bpCategory.bgColor} ${bpCategory.color}`}>{bpCategory.label}</span>
                          </div>
                      )}
                  </div>
                  
                  <VitalSignInput
                      id="pulso"
                      label="Pulso"
                      icon={<Activity className="w-5 h-5 text-gray-400" />}
                      value={formData.exploracionFisica?.signosVitales?.pulso || ''}
                      onChange={(e) => handleExploracionFisicaChange('signosVitales.pulso', e.target.value)}
                      unit="ppm"
                      normalRange={`${vitalSignRanges[ageRange].pulse.min}-${vitalSignRanges[ageRange].pulse.max} ppm`}
                  />

                  <VitalSignInput
                      id="fc"
                      label="Frecuencia Cardíaca"
                      icon={<HeartPulse className="w-5 h-5 text-gray-400" />}
                      value={formData.exploracionFisica?.signosVitales?.fc || ''}
                      onChange={(e) => handleExploracionFisicaChange('signosVitales.fc', e.target.value)}
                      unit="lpm"
                      normalRange={`${vitalSignRanges[ageRange].heartRate.min}-${vitalSignRanges[ageRange].heartRate.max} lpm`}
                  />
                  
                  <VitalSignInput
                      id="temperatura"
                      label="Temperatura"
                      icon={<ThermometerSun className="w-5 h-5 text-gray-400" />}
                      value={formData.exploracionFisica?.signosVitales?.temperatura || ''}
                      onChange={(e) => handleExploracionFisicaChange('signosVitales.temperatura', e.target.value)}
                      unit="°C"
                      normalRange={`${vitalSignRanges[ageRange].temperature.min}-${vitalSignRanges[ageRange].temperature.max}°C`}
                      step="0.1"
                  />
              </Section>
              {/* --- FIN DEL CONTENIDO MEJORADO --- */}
            </div>
        </div>
      </Card>
    </div>
  );
};

export default ExploracionFisica;