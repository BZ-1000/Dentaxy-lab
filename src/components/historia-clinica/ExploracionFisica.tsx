
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateExploracionFisicaReport } from '@/services/geminiService';
import { AnimatedTextareaWithTyping } from '@/components/ui/AnimatedTextareaWithTyping';
import { 
  calculateIMC, 
  getIMCCategory, 
  getBPCategory, 
  imcRanges,
  bpRanges
} from '@/utils/medicalRanges';

// Fix: Add an explicit type definition for values
interface ExploracionValues {
  ta: string;
  fc: string;
  fr: string;
  temperatura: string;
  peso: string;
  talla: string;
  imc: string;
  pulso: string;
}

const ExploracionFisica = ({ formData, handleExploracionFisicaChange }) => {
  const [activeTab, setActiveTab] = useState("formulario");
  const [redaccion, setRedaccion] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const [values, setValues] = useState<ExploracionValues>({
    ta: '',
    fc: '',
    fr: '',
    temperatura: '',
    peso: '',
    talla: '',
    imc: '',
    pulso: ''
  });
  const [status, setStatus] = useState({
    ta: 'normal',
    fc: 'normal',
    fr: 'normal',
    temperatura: 'normal',
    imc: 'normal'
  });
  
  // Update local state when formData changes
  useEffect(() => {
    if (formData?.exploracionFisica?.signosVitales) {
      setValues({
        ta: formData.exploracionFisica.signosVitales.ta || '',
        fc: formData.exploracionFisica.signosVitales.fc || '',
        fr: formData.exploracionFisica.signosVitales.fr || '',
        temperatura: formData.exploracionFisica.signosVitales.temperatura || '',
        peso: formData.exploracionFisica.signosVitales.peso || '',
        talla: formData.exploracionFisica.signosVitales.talla || '',
        imc: formData.exploracionFisica.signosVitales.imc || '',
        pulso: formData.exploracionFisica.signosVitales.pulso || ''
      });
    }
  }, [formData]);
  
  // Calculate status for each vital sign
  useEffect(() => {
    // Fix: Call updateStatus without using spread operator
    updateStatus('ta', values.ta);
    updateStatus('fc', values.fc);
    updateStatus('fr', values.fr);
    updateStatus('temperatura', values.temperatura);
    
    // Calculate IMC
    if (values.peso && values.talla) {
      try {
        const peso = parseFloat(values.peso);
        const talla = parseFloat(values.talla) / 100; // convert to meters
        if (peso > 0 && talla > 0) {
          const imc = calculateIMC(peso, talla).toString();
          setValues(prev => ({ ...prev, imc }));
          handleExploracionFisicaChange('signosVitales.imc', imc);
          updateStatus('imc', imc);
        }
      } catch (e) {
        console.error("Error calculating IMC:", e);
      }
    }
  }, [values.ta, values.fc, values.fr, values.temperatura, values.peso, values.talla]);
  
  // Update status based on medical ranges
  const updateStatus = (field: string, value: string) => {
    if (!value) {
      setStatus(prev => ({ ...prev, [field]: 'normal' }));
      return;
    }
    
    try {
      const numValue = parseFloat(value);
      
      if (field === 'imc') {
        const category = getIMCCategory(numValue);
        if (category === imcRanges.underweight) {
          setStatus(prev => ({ ...prev, [field]: 'low' }));
        } else if (category === imcRanges.normal) {
          setStatus(prev => ({ ...prev, [field]: 'normal' }));
        } else {
          setStatus(prev => ({ ...prev, [field]: 'high' }));
        }
        return;
      }
      
      if (field === 'ta') {
        // Assuming ta is in format "120/80"
        const parts = value.split('/');
        if (parts.length === 2) {
          const systolic = parseFloat(parts[0]);
          const diastolic = parseFloat(parts[1]);
          const category = getBPCategory(systolic, diastolic);
          
          if (category === bpRanges.low) {
            setStatus(prev => ({ ...prev, [field]: 'low' }));
          } else if (category === bpRanges.normal) {
            setStatus(prev => ({ ...prev, [field]: 'normal' }));
          } else {
            setStatus(prev => ({ ...prev, [field]: 'high' }));
          }
        }
        return;
      }
      
      // For other vital signs, use simple ranges
      // These are simplified ranges and should be adjusted for medical accuracy
      const ranges = {
        fc: { low: 60, high: 100 }, // heart rate
        fr: { low: 12, high: 20 },  // respiratory rate
        temperatura: { low: 36, high: 37.5 } // body temperature
      };
      
      if (field in ranges) {
        const range = ranges[field];
        if (numValue < range.low) {
          setStatus(prev => ({ ...prev, [field]: 'low' }));
        } else if (numValue > range.high) {
          setStatus(prev => ({ ...prev, [field]: 'high' }));
        } else {
          setStatus(prev => ({ ...prev, [field]: 'normal' }));
        }
      }
    } catch (e) {
      console.error(`Error updating status for ${field}:`, e);
      setStatus(prev => ({ ...prev, [field]: 'normal' }));
    }
  };
  
  // Handle input change
  const handleInputChange = (field: string, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
    handleExploracionFisicaChange(`signosVitales.${field}`, value);
  };
  
  // Handle textarea change for exploracion fields
  const handleAreaChange = (field: string, value: string) => {
    handleExploracionFisicaChange(`exploracion.${field}`, value);
  };
  
  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      const report = await generateExploracionFisicaReport(formData);
      setRedaccion(prev => ({ ...prev, exploracionFisica: report }));
      setActiveTab("redaccion");
      toast({
        title: "Redacción generada",
        description: "La redacción de la exploración física ha sido generada exitosamente."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar la redacción. Por favor, intente nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Exploración Física</CardTitle>
        <CardDescription>
          Signos vitales y exploración general del paciente
        </CardDescription>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="formulario">Formulario</TabsTrigger>
          <TabsTrigger value="redaccion">Redacción IA</TabsTrigger>
        </TabsList>
        <TabsContent value="formulario">
          <CardContent className="space-y-6">
            {/* Signos vitales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ta">Presión Arterial (TA)</Label>
                <Input
                  type="text"
                  id="ta"
                  value={values.ta}
                  onChange={(e) => handleInputChange('ta', e.target.value)}
                  placeholder="Ej: 120/80"
                />
                {status.ta !== 'normal' && (
                  <p className={`text-sm ${status.ta === 'low' ? 'text-blue-500' : 'text-red-500'}`}>
                    {status.ta === 'low' ? 'Presión arterial baja' : 'Presión arterial alta'}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="fc">Frecuencia Cardíaca (FC)</Label>
                <Input
                  type="text"
                  id="fc"
                  value={values.fc}
                  onChange={(e) => handleInputChange('fc', e.target.value)}
                  placeholder="Ej: 72"
                />
                {status.fc !== 'normal' && (
                  <p className={`text-sm ${status.fc === 'low' ? 'text-blue-500' : 'text-red-500'}`}>
                    {status.fc === 'low' ? 'Frecuencia cardíaca baja' : 'Frecuencia cardíaca alta'}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="fr">Frecuencia Respiratoria (FR)</Label>
                <Input
                  type="text"
                  id="fr"
                  value={values.fr}
                  onChange={(e) => handleInputChange('fr', e.target.value)}
                  placeholder="Ej: 16"
                />
                {status.fr !== 'normal' && (
                  <p className={`text-sm ${status.fr === 'low' ? 'text-blue-500' : 'text-red-500'}`}>
                    {status.fr === 'low' ? 'Frecuencia respiratoria baja' : 'Frecuencia respiratoria alta'}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperatura">Temperatura</Label>
                <Input
                  type="text"
                  id="temperatura"
                  value={values.temperatura}
                  onChange={(e) => handleInputChange('temperatura', e.target.value)}
                  placeholder="Ej: 36.5"
                />
                {status.temperatura !== 'normal' && (
                  <p className={`text-sm ${status.temperatura === 'low' ? 'text-blue-500' : 'text-red-500'}`}>
                    {status.temperatura === 'low' ? 'Temperatura baja' : 'Temperatura alta'}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="peso">Peso (kg)</Label>
                <Input
                  type="text"
                  id="peso"
                  value={values.peso}
                  onChange={(e) => handleInputChange('peso', e.target.value)}
                  placeholder="Ej: 70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="talla">Talla (cm)</Label>
                <Input
                  type="text"
                  id="talla"
                  value={values.talla}
                  onChange={(e) => handleInputChange('talla', e.target.value)}
                  placeholder="Ej: 175"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pulso">Pulso</Label>
                <Input
                  type="text"
                  id="pulso"
                  value={values.pulso}
                  onChange={(e) => handleInputChange('pulso', e.target.value)}
                  placeholder="Ej: 70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imc">Índice de Masa Corporal (IMC)</Label>
                <Input
                  type="text"
                  id="imc"
                  value={values.imc}
                  placeholder="Calculado automáticamente"
                  readOnly
                />
                {status.imc !== 'normal' && (
                  <p className={`text-sm ${status.imc === 'low' ? 'text-blue-500' : 'text-red-500'}`}>
                    {status.imc === 'low' ? 'Bajo peso' : 'Sobrepeso/Obesidad'}
                  </p>
                )}
              </div>
            </div>
            
            {/* Exploración */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cabeza">Cabeza</Label>
                <Textarea
                  id="cabeza"
                  placeholder="Descripción de la exploración de la cabeza"
                  value={formData?.exploracionFisica?.exploracion?.cabeza || ""}
                  onChange={(e) => handleAreaChange('cabeza', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cuello">Cuello</Label>
                <Textarea
                  id="cuello"
                  placeholder="Descripción de la exploración del cuello"
                  value={formData?.exploracionFisica?.exploracion?.cuello || ""}
                  onChange={(e) => handleAreaChange('cuello', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="torax">Tórax</Label>
                <Textarea
                  id="torax"
                  placeholder="Descripción de la exploración del tórax"
                  value={formData?.exploracionFisica?.exploracion?.torax || ""}
                  onChange={(e) => handleAreaChange('torax', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="abdomen">Abdomen</Label>
                <Textarea
                  id="abdomen"
                  placeholder="Descripción de la exploración del abdomen"
                  value={formData?.exploracionFisica?.exploracion?.abdomen || ""}
                  onChange={(e) => handleAreaChange('abdomen', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="extremidades">Extremidades</Label>
                <Textarea
                  id="extremidades"
                  placeholder="Descripción de la exploración de las extremidades"
                  value={formData?.exploracionFisica?.exploracion?.extremidades || ""}
                  onChange={(e) => handleAreaChange('extremidades', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando Redacción...
                </>
              ) : "Generar Redacción IA"}
            </Button>
          </CardFooter>
        </TabsContent>
        <TabsContent value="redaccion">
          <CardContent className="p-6">
            <div className="min-h-[200px] bg-gray-50 dark:bg-gray-900 p-4 rounded-md whitespace-pre-wrap" data-redaction-content>
              {redaccion.exploracionFisica || "No se ha generado redacción aún. Complete el formulario y genere la redacción."}
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ExploracionFisica;
