import React, { useState, useEffect, ReactNode } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Minus, Maximize2, X, ThermometerSun, HeartPulse, Gauge, Activity, Scale, Ruler } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { calculateIMC, getIMCCategory, getBPCategory, vitalSignRanges } from '@/utils/medicalRanges';

// --- Helper Components para una mejor estructura y estética ---

// Componente para crear secciones visuales claras
const Section = ({ title, children }: { title: string, children: ReactNode }) => (
  <fieldset className="border-t border-gray-200 dark:border-gray-700 pt-4">
    <legend className="px-2 text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</legend>
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
      {children}
    </div>
  </fieldset>
);

// Componente reutilizable para cada campo de signo vital
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

// --- Componente Principal Refactorizado ---

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
  const [activeTab, setActiveTab] = useState('formulario');
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

  const handleMinimize = () => setIsMinimized(!isMinimized);
  const handleMaximize = () => setIsMaximized(!isMaximized);
  const handleClose = () => { /* Lógica para cerrar o resetear el componente */ };
  
  const getBloodPressureValues = (bpString: string) => {
    const [systolic, diastolic] = (bpString || "").split('/').map(Number);
    return { systolic: systolic || 0, diastolic: diastolic || 0 };
  };

  const { systolic, diastolic } = getBloodPressureValues(formData.exploracionFisica?.signosVitales?.ta);
  const bpCategory = getBPCategory(systolic, diastolic);

  return (
    <div className={`max-w-4xl mx-auto p-4 transition-all duration-300 ${isMaximized ? "fixed inset-0 z-50 p-4" : ""}`}>
      <Card className={`w-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl shadow-2xl rounded-2xl border border-black/5 dark:border-white/5 transition-all duration-300 ${isMaximized ? "h-full" : ""}`}>
        {/* Encabezado con Título y Controles */}
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <span className="text-blue-500 font-mono">10.</span>
            <span>Exploración Física</span>
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={handleMinimize} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors">
              <Minus className="w-4 h-4" />
            </button>
            <button onClick={handleMaximize} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors">
              <Maximize2 className="w-4 h-4" />
            </button>
            <button onClick={handleClose} className="p-1.5 rounded-full hover:bg-red-500 text-gray-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className={`transition-all duration-300 ${isMinimized ? 'max-h-0 overflow-hidden' : 'max-h-[80vh]'} ${isMaximized ? 'h-[calc(100%-4.5rem)]' : ''}`}>
          {/* Selector de Pestañas */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 max-w-sm mx-auto">
              <button
                onClick={() => setActiveTab('formulario')}
                className={`w-full px-4 py-2 text-sm font-semibold rounded-md transition-all duration-300 ${activeTab === 'formulario' ? 'bg-white dark:bg-gray-950 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-300'}`}
              >
                Formulario
              </button>
              <button
                onClick={() => setActiveTab('ia')}
                className={`w-full px-4 py-2 text-sm font-semibold rounded-md transition-all duration-300 ${activeTab === 'ia' ? 'bg-white dark:bg-gray-950 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-300'}`}
              >
                Redacción IA
              </button>
            </div>
          </div>

          <div className={`p-6 space-y-8 overflow-y-auto ${isMaximized ? 'h-[calc(100%-4rem)]' : 'max-h-[65vh]'}`}>
            
            {/* Sección de Antropometría */}
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
                onChange={(e) => handleExploracionFisicaChange('signosVitales.talla', e.target.value)}
                unit="m"
                placeholder="Ej: 1.75"
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

            {/* Sección de Signos Vitales */}
            <Section title="Signos Vitales">
              <div className="md:col-span-2">
                <Label htmlFor="age-range">Grupo de Edad del Paciente</Label>
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
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ExploracionFisica;