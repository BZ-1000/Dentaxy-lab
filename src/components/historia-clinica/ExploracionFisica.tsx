
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Minus, Maximize2, X, ThermometerSun, HeartPulse, Scale, Ruler, Activity, Heart, Copy, Sparkles, Wind } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { calculateIMC, getIMCCategory, getBPCategory, vitalSignRanges } from '@/utils/medicalRanges';
import { Button } from '@/components/ui/button';

interface ExploracionFisicaProps {
  formData: FormDataState;
  handleExploracionFisicaChange: (field: string, value: any) => void;
  onRedaccionGenerada?: (text: string | React.ReactNode, plainText?: string) => void;
  onToggleViewMode?: () => void;
}

const ExploracionFisica: React.FC<ExploracionFisicaProps> = ({
  formData,
  handleExploracionFisicaChange,
  onRedaccionGenerada,
  onToggleViewMode
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [ageRange, setAgeRange] = useState<keyof typeof vitalSignRanges>('adult');
  const [imc, setIMC] = useState(0);
  const [activeTab, setActiveTab] = useState('formulario'); // Added activeTab state
  const [redaccionContent, setRedaccionContent] = useState<React.ReactNode>('');

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

  const generarRedaccion = () => {
    const sv = formData.exploracionFisica?.signosVitales || {} as any;
    const bpVals = sv.ta ? (() => {
      const [s, d] = sv.ta.split('/').map(Number);
      return { systolic: s || 0, diastolic: d || 0 };
    })() : null;
    const bpCat = bpVals ? getBPCategory(bpVals.systolic, bpVals.diastolic) : null;
    const imcCat = getIMCCategory(imc);

    const rows = [
      { param: 'Tensión arterial',      valor: sv.ta           || '—', unidad: 'mmHg', categoria: bpCat?.label },
      { param: 'Pulso',                 valor: sv.pulso        || '—', unidad: 'ppm'  },
      { param: 'Frecuencia cardíaca',   valor: sv.fc           || '—', unidad: 'lpm'  },
      { param: 'Frecuencia respiratoria',valor: sv.fr         || '—', unidad: 'rpm'  },
      { param: 'Temperatura',           valor: sv.temperatura  || '—', unidad: '°C'   },
      { param: 'Peso',                  valor: sv.peso         || '—', unidad: 'kg'   },
      { param: 'Talla',                 valor: sv.talla        || '—', unidad: 'm'    },
      { param: 'IMC',                   valor: imc > 0 ? imc.toFixed(1) : '—', unidad: 'kg/m²', categoria: imcCat.label },
    ];

    const reactContent = (
      <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
        <table className="w-full border-collapse">
          <tbody>
            {rows.map((f, i) => (
              <tr key={i} className={i % 2 !== 0 ? 'bg-gray-50/50 dark:bg-white/5' : ''}>
                <td className="w-[38%] py-3 pr-4 align-top border-b border-gray-200 dark:border-white/10 font-mono text-[11px] font-medium tracking-wider text-gray-500 uppercase">
                  {f.param}
                </td>
                <td className="py-3 pl-4 align-top border-b border-gray-200 dark:border-white/10 text-[14px] font-light text-gray-800 dark:text-gray-200">
                  {f.valor} {f.unidad} {f.categoria ? <span className="opacity-70">({f.categoria})</span> : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    // Also support string version for plain text/copy if needed by other systems
    const htmlString = `<table style="width:100%;border-collapse:collapse;">
      <tbody>${rows.map((f, i) => {
        const bg = i % 2 !== 0 ? ' style="background:#f9fafb;"' : '';
        const displayVal = `${f.valor} ${f.unidad} ${f.categoria ? `(${f.categoria})` : ''}`;
        return `<tr${bg}>
          <td style="font-family:'DM Mono',monospace;font-size:11px;font-weight:500;letter-spacing:0.04em;color:#888;text-transform:uppercase;width:38%;padding:11px 16px 11px 0;vertical-align:top;border-bottom:1px solid #e5e7eb;">${f.param}</td>
          <td style="font-size:14px;font-weight:300;color:#3a3a3a;padding:11px 0 11px 16px;vertical-align:top;border-bottom:1px solid #e5e7eb;">${displayVal}</td>
        </tr>`;
      }).join('')}</tbody>
    </table>`;

    setRedaccionContent(reactContent as any);
    if (onRedaccionGenerada) onRedaccionGenerada(reactContent as any, htmlString);
    setActiveTab('redaccion');
  };

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`} data-formulario-section="exploracion-fisica">
      <div className="w-full bg-transparent">


        {!isMinimized && (
          <>
            {activeTab === 'formulario' ? (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* IMC Section */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="peso" className="flex items-center gap-2">
                          <Scale className="w-4 h-4" style={{ color: '#3B82F6', strokeWidth: 2 }} />
                          Peso
                        </Label>
                        <div className="relative">
                          <Input
                            id="peso"
                            type="number"
                            step="0.1"
                            inputMode="numeric"
                            value={formData.exploracionFisica?.signosVitales?.peso || ''}
                            onChange={(e) => handleExploracionFisicaChange('signosVitales.peso', e.target.value)}
                            className="pr-20"
                          />
                          <span className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500">kg</span>
                          <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(formData.exploracionFisica?.signosVitales?.peso || '')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          >
                            <Copy className="w-3.5 h-3.5 text-gray-500" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="talla" className="flex items-center gap-2">
                          <Ruler className="w-4 h-4" style={{ color: '#10B981', strokeWidth: 2 }} />
                          Talla
                        </Label>
                        <div className="relative">
                          <Input
                            id="talla"
                            type="text"
                            inputMode="numeric"
                            value={formData.exploracionFisica?.signosVitales?.talla || ''}
                            onChange={handleHeightInput}
                            className="pr-16"
                            placeholder="Ej: 170"
                          />
                          <span className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500">m</span>
                          <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(formData.exploracionFisica?.signosVitales?.talla || '')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          >
                            <Copy className="w-3.5 h-3.5 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-transparent dark:bg-gray-900 rounded-lg w-full px-4 py-3">
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
                    <Label htmlFor="ta" className="flex items-center gap-2">
                      <Activity className="w-4 h-4" style={{ color: '#EF4444', strokeWidth: 2 }} />
                      Presión arterial
                    </Label>
                    <div className="relative">
                      <Input
                        id="ta"
                        type="text"
                        value={formData.exploracionFisica?.signosVitales?.ta || ''}
                        onChange={(e) => handleExploracionFisicaChange('signosVitales.ta', e.target.value)}
                        placeholder="120/80"
                        className="pr-24"
                      />
                      <span className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500">mmHg</span>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(formData.exploracionFisica?.signosVitales?.ta || '')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <Copy className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                    </div>
                    {formData.exploracionFisica?.signosVitales?.ta && (
                      <div className={`text-sm ${getBPCategory(getBloodPressureValues(formData.exploracionFisica.signosVitales.ta).systolic, getBloodPressureValues(formData.exploracionFisica.signosVitales.ta).diastolic).color}`}>
                        {getBPCategory(getBloodPressureValues(formData.exploracionFisica.signosVitales.ta).systolic, getBloodPressureValues(formData.exploracionFisica.signosVitales.ta).diastolic).label}
                      </div>
                    )}
                  </div>

                  {/* Pulse */}
                  <div className="space-y-2">
                    <Label htmlFor="pulso" className="flex items-center gap-2">
                      <Heart className="w-4 h-4" style={{ color: '#EC4899', strokeWidth: 2 }} />
                      Pulso
                    </Label>
                    <div className="relative">
                      <Input
                        id="pulso"
                        type="number"
                        value={formData.exploracionFisica?.signosVitales?.pulso || ''}
                        onChange={(e) => handleExploracionFisicaChange('signosVitales.pulso', e.target.value)}
                        className="pr-24"
                      />
                      <span className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500">ppm</span>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(formData.exploracionFisica?.signosVitales?.pulso || '')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <Copy className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-500">
                      Rango normal: {vitalSignRanges[ageRange].pulse.min}-{vitalSignRanges[ageRange].pulse.max} ppm
                    </div>
                  </div>

                  {/* Heart Rate */}
                  <div className="space-y-2">
                    <Label htmlFor="fc" className="flex items-center gap-2">
                      <HeartPulse className="w-4 h-4" style={{ color: '#8B5CF6', strokeWidth: 2 }} />
                      Frecuencia cardíaca
                    </Label>
                    <div className="relative">
                      <Input
                        id="fc"
                        type="number"
                        value={formData.exploracionFisica?.signosVitales?.fc || ''}
                        onChange={(e) => handleExploracionFisicaChange('signosVitales.fc', e.target.value)}
                        className="pr-24"
                      />
                      <span className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500">lpm</span>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(formData.exploracionFisica?.signosVitales?.fc || '')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <Copy className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-500">
                      Rango normal: {vitalSignRanges[ageRange].heartRate.min}-{vitalSignRanges[ageRange].heartRate.max} lpm
                    </div>
                  </div>

                  {/* Respiratory Rate */}
                  <div className="space-y-2">
                    <Label htmlFor="fr" className="flex items-center gap-2">
                      <Wind className="w-4 h-4" style={{ color: '#06B6D4', strokeWidth: 2 }} />
                      Frecuencia respiratoria
                    </Label>
                    <div className="relative">
                      <Input
                        id="fr"
                        type="number"
                        value={formData.exploracionFisica?.signosVitales?.fr || ''}
                        onChange={(e) => handleExploracionFisicaChange('signosVitales.fr', e.target.value)}
                        className="pr-24"
                      />
                      <span className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500">rpm</span>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(formData.exploracionFisica?.signosVitales?.fr || '')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <Copy className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-500">
                      Rango normal: {vitalSignRanges[ageRange].respiratoryRate.min}-{vitalSignRanges[ageRange].respiratoryRate.max} rpm
                    </div>
                  </div>

                  {/* Temperature */}
                  <div className="space-y-2">
                    <Label htmlFor="temperatura" className="flex items-center gap-2">
                      <ThermometerSun className="w-4 h-4" style={{ color: '#F59E0B', strokeWidth: 2 }} />
                      Temperatura
                    </Label>
                    <div className="relative">
                      <Input
                        id="temperatura"
                        type="number"
                        step="0.1"
                        value={formData.exploracionFisica?.signosVitales?.temperatura || ''}
                        onChange={(e) => handleExploracionFisicaChange('signosVitales.temperatura', e.target.value)}
                        className="pr-20"
                      />
                      <span className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500">°C</span>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(formData.exploracionFisica?.signosVitales?.temperatura || '')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <Copy className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-500">
                      Rango normal: {vitalSignRanges[ageRange].temperature.min}-{vitalSignRanges[ageRange].temperature.max}°C
                    </div>
                  </div>
                </div>

                <div className="flex justify-end items-center gap-3 pt-6 mt-6 border-t border-gray-100 dark:border-gray-700/50">
                  {onToggleViewMode && (
                    <Button
                      variant="outline"
                      onClick={generarRedaccion}
                      className="hidden data-trigger-generation text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Ver Redacción IA
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div
                  className="bg-transparent dark:bg-gray-900 rounded-lg p-4 min-h-[200px] whitespace-pre-wrap"
                  style={{
                    whiteSpace: "pre-wrap",
                  }}
                  data-redaction-content
                >
                  {redaccionContent ||
                    "No se ha generado redacción aún. Utilice el botón 'Ver Redacción IA' en la pestaña de Formulario."}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ExploracionFisica;
