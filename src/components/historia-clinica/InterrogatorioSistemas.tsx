import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormDataState } from '@/types/historiaClinica';
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from '@/hooks/use-theme';

interface InterrogatorioSistemasProps {
  formData: FormDataState;
  handleInterrogatorioChange: (system: string, value: string) => void;
}

const InterrogatorioSistemas = ({ formData, handleInterrogatorioChange }: InterrogatorioSistemasProps) => {
  const { toast } = useToast();
  const { theme } = useTheme();
  const [showForm, setShowForm] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [redacciones, setRedacciones] = useState({
    digestivo: '',
    respiratorio: '',
    cardiovascular: '',
    genitoUrinario: '',
    endocrino: '',
    tegumentario: '',
    musculoEsqueletico: '',
    nervioso: ''
  });

  const [formValues, setFormValues] = useState({
    digestivo: {
      alimentacion: '',
      masticacion: '',
      percepcionGusto: '',
      percepcionGustoEspecificaciones: '',
      salivacion: '',
      deglusion: '',
      deglusiónEspecificaciones: '',
      halitosis: '',
      halitosisEspecificaciones: '',
      sintomasDigestivos: [] as string[],
      cambiosApetito: '',
      habitosAlimenticios: '',
      colorEvacuaciones: '',
      hematemesis: '',
      frecuenciaEvacuacion: '',
      frecuenciaEvacuacionEspecificaciones: ''
    },
    respiratorio: {
      tipoRespiracion: '',
      sintomasRespiratorios: [] as string[],
      apneaSuenio: '',
      oxigenoSuplementario: '',
      tosExpectoracion: ''
    },
    cardiovascular: {
      dolorPecho: '',
      lipotimia: '',
      ritmoCardiaco: '',
      sintomasCardiovasculares: [] as string[],
      presionArterial: '',
      antecedentesInfarto: '',
      fatigaEsfuerzo: ''
    },
    genitoUrinario: {
      frecuenciaUrinaria: '',
      sintomasUrinarios: [] as string[],
      urgenciaUrinaria: '',
      chorroUrinarioDebil: '',
      chorroUrinarioIntermitente: '',
      flujoVaginalUretral: '',
      infeccionesUrinarias: '',
      ultimaMenstruacion: '',
      dismenorrea: '',
      duracionMenstruacion: '',
      ultimoParto: '',
      antecedentesObstetricos: ''
    },
    endocrino: {
      sintomasEndocrinos: [] as string[],
      sudoracionNocturna: '',
      hirsutismo: '',
      galactorrea: '',
      cambiosRitmoMenstrual: '',
      cambiosPeso: '',
      intoleranciaFrio: '',
      intoleranciaCalor: '',
      condicionesEndocrinas: ''
    },
    tegumentario: {
      cambiosColoracion: '',
      cambiosColoracionEspecificaciones: '',
      sintomasTegumentarios: [] as string[],
      cambiosUnas: '',
      cambiosLunares: '',
      lesionesPigmentadas: ''
    },
    musculoEsqueletico: {
      fracturas: '',
      detallesFracturas: '',
      sintomasMusculoEsqueleticos: [] as string[],
      rigidezMatutina: '',
      debilidadMuscular: '',
      limitacionesMovimiento: ''
    },
    nervioso: {
      percepcionSentidos: '',
      horasSueno: '',
      trastornosSueno: '',
      trastornosSuenoEspecificaciones: '',
      estadoAnimo: '',
      parestesias: '',
      otrosSintomasNeurologicos: [] as string[]
    }
  });

  useEffect(() => {
    // Inicializar con los valores del formData si existen
    if (formData.interrogatorioSistemas) {
      const { digestivo, respiratorio, cardiovascular, urinario, musculoEsqueletico, nervioso, endocrino, tegumentario } = formData.interrogatorioSistemas;
      
      setRedacciones({
        digestivo: digestivo || '',
        respiratorio: respiratorio || '',
        cardiovascular: cardiovascular || '',
        genitoUrinario: urinario || '',
        endocrino: endocrino || '',
        tegumentario: tegumentario || '',
        musculoEsqueletico: musculoEsqueletico || '',
        nervioso: nervioso || ''
      });
    }
  }, [formData.interrogatorioSistemas]);

  const handleInputChange = (system: string, field: string, value: string | string[] | boolean) => {
    setFormValues(prev => ({
      ...prev,
      [system]: {
        ...prev[system as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleCheckboxChange = (system: string, field: string, value: string) => {
    setFormValues(prev => {
      const currentSystem = prev[system as keyof typeof prev] as any;
      const currentValues = currentSystem[field] as string[];
      
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [system]: {
            ...currentSystem,
            [field]: currentValues.filter(v => v !== value)
          }
        };
      } else {
        return {
          ...prev,
          [system]: {
            ...currentSystem,
            [field]: [...currentValues, value]
          }
        };
      }
    });
  };

  const getPercepcionGustoText = () => {
    switch (formValues.digestivo.percepcionGusto) {
      case 'Normal':
        return 'percepción normal del gusto';
      case 'Alterada':
        return 'percepción alterada del gusto';
      case 'Ausente':
        return 'ausencia de percepción del gusto';
      default:
        return '[percepción del gusto sin especificar]';
    }
  };

  const getDeglusiónText = () => {
    switch (formValues.digestivo.deglusion) {
      case 'Normal':
        return 'presenta deglución normal';
      case 'Dificultad':
        return `presenta dificultad para deglutir${formValues.digestivo.deglusiónEspecificaciones ? `: ${formValues.digestivo.deglusiónEspecificaciones}` : ''}`;
      case 'Dolor':
        return `presenta dolor al deglutir${formValues.digestivo.deglusiónEspecificaciones ? `: ${formValues.digestivo.deglusiónEspecificaciones}` : ''}`;
      default:
        return '[deglución sin especificar]';
    }
  };

  const getCambiosPesoText = () => {
    switch (formValues.endocrino.cambiosPeso) {
      case 'Aumento':
        return 'aumento de peso';
      case 'Pérdida':
        return 'pérdida de peso';
      case 'Sin cambios':
        return 'sin cambios significativos de peso';
      default:
        return '[cambios de peso sin especificar]';
    }
  };

  const getIntoleranciaText = () => {
    if (formValues.endocrino.intoleranciaFrio === 'Sí' && formValues.endocrino.intoleranciaCalor === 'Sí') {
      return 'Presenta intolerancia tanto al frío como al calor';
    } else if (formValues.endocrino.intoleranciaFrio === 'Sí') {
      return 'Presenta intolerancia al frío';
    } else if (formValues.endocrino.intoleranciaCalor === 'Sí') {
      return 'Presenta intolerancia al calor';
    } else {
      return 'No presenta intolerancia al frío ni al calor';
    }
  };

  const generateAndUpdateRedacciones = () => {
    // Aparato Digestivo
    let digestivoText = `El paciente refiere alimentación de tipo ${formValues.digestivo.alimentacion || "[sin especificar]"}. Su patrón de masticación es ${formValues.digestivo.masticacion || "[sin especificar]"}. Manifiesta ${getPercepcionGustoText()}. ${formValues.digestivo.percepcionGustoEspecificaciones ? `Especificaciones: ${formValues.digestivo.percepcionGustoEspecificaciones}.` : ''} La salivación es ${formValues.digestivo.salivacion || "[sin especificar]"}. Respecto a la deglución, ${getDeglusiónText()}. ${formValues.digestivo.halitosis === "Sí" ? "Presenta halitosis." : "No presenta halitosis."} ${formValues.digestivo.halitosis === "Sí" ? `Especificaciones: ${formValues.digestivo.halitosisEspecificaciones}.` : ''} Ha experimentado los siguientes síntomas digestivos: ${formValues.digestivo.sintomasDigestivos.length > 0 ? formValues.digestivo.sintomasDigestivos.join(", ") : "ninguno"}. ${formValues.digestivo.cambiosApetito ? `Cambios en el apetito: ${formValues.digestivo.cambiosApetito}.` : ''} ${formValues.digestivo.habitosAlimenticios ? `Hábitos alimenticios: ${formValues.digestivo.habitosAlimenticios}.` : ''} El color de las evacuaciones es ${formValues.digestivo.colorEvacuaciones || "[sin especificar]"}. ${formValues.digestivo.hematemesis === "Sí" ? "Presenta hematemesis." : "No presenta hematemesis."} Realiza ${formValues.digestivo.frecuenciaEvacuacion || "[sin especificar]"} evacuaciones diarias. ${formValues.digestivo.frecuenciaEvacuacion === "Otra" ? `Especificaciones: ${formValues.digestivo.frecuenciaEvacuacionEspecificaciones}.` : ''}`;

    // Aparato Respiratorio
    let respiratorioText = `El tipo de respiración habitual es ${formValues.respiratorio.tipoRespiracion || "[sin especificar]"}. Presenta síntomas respiratorios como: ${formValues.respiratorio.sintomasRespiratorios.length > 0 ? formValues.respiratorio.sintomasRespiratorios.join(", ") : "ninguno"}. ${formValues.respiratorio.apneaSuenio === "Sí" ? "Presenta apnea del sueño." : "No presenta apnea del sueño."} ${formValues.respiratorio.oxigenoSuplementario === "Sí" ? "Usa oxígeno suplementario." : "No usa oxígeno suplementario."} ${formValues.respiratorio.tosExpectoracion ? `Tos con expectoración: ${formValues.respiratorio.tosExpectoracion}.` : ''}`;

    // Aparato Cardiovascular
    let cardiovascularText = `${formValues.cardiovascular.dolorPecho === "No" ? "No refiere" : "Refiere"} dolor en el pecho. ${formValues.cardiovascular.lipotimia === "Sí" ? "Ha presentado" : "No ha presentado"} episodios de lipotimia. El ritmo cardíaco es ${formValues.cardiovascular.ritmoCardiaco || "[sin especificar]"}. Sintomatología cardiovascular reportada: ${formValues.cardiovascular.sintomasCardiovasculares.length > 0 ? formValues.cardiovascular.sintomasCardiovasculares.join(", ") : "ninguna"}. ${formValues.cardiovascular.presionArterial ? `Presión arterial conocida: ${formValues.cardiovascular.presionArterial}.` : ''} ${formValues.cardiovascular.antecedentesInfarto === "Sí" ? "Tiene antecedentes de infarto o enfermedad coronaria." : "No tiene antecedentes de infarto o enfermedad coronaria."} ${formValues.cardiovascular.fatigaEsfuerzo === "Sí" ? "Presenta fatiga fácil con esfuerzo leve." : "No presenta fatiga fácil con esfuerzo leve."}`;

    // Aparato Genito-Urinario
    let genitoUrinarioText = `El paciente refiere una frecuencia urinaria de ${formValues.genitoUrinario.frecuenciaUrinaria || "[sin especificar]"} veces al día. Síntomas urinarios presentes: ${formValues.genitoUrinario.sintomasUrinarios.length > 0 ? formValues.genitoUrinario.sintomasUrinarios.join(", ") : "ninguno"}. ${formValues.genitoUrinario.urgenciaUrinaria === "Sí" ? "Presenta urgencia urinaria." : "No presenta urgencia urinaria."} ${formValues.genitoUrinario.chorroUrinarioDebil === "Sí" ? "Presenta chorro urinario débil." : "No presenta chorro urinario débil."} ${formValues.genitoUrinario.chorroUrinarioIntermitente === "Sí" ? "Presenta chorro urinario intermitente." : "No presenta chorro urinario intermitente."} ${formValues.genitoUrinario.flujoVaginalUretral === "Sí" ? "Presenta flujo vaginal/uretral anormal." : "No presenta flujo vaginal/uretral anormal."} ${formValues.genitoUrinario.infeccionesUrinarias === "Sí" ? "Presenta infecciones urinarias frecuentes." : "No presenta infecciones urinarias frecuentes."} ${formValues.genitoUrinario.ultimaMenstruacion ? `En pacientes mujeres: Fecha de última menstruación: ${formValues.genitoUrinario.ultimaMenstruacion}.` : ""} ${formValues.genitoUrinario.dismenorrea ? `Dismenorrea: ${formValues.genitoUrinario.dismenorrea}.` : ''} ${formValues.genitoUrinario.duracionMenstruacion ? `Días de duración de menstruación: ${formValues.genitoUrinario.duracionMenstruacion}.` : ''} ${formValues.genitoUrinario.ultimoParto ? `Fecha de último parto: ${formValues.genitoUrinario.ultimoParto}.` : ''} Antecedentes obstétricos: ${formValues.genitoUrinario.antecedentesObstetricos || "ninguno"}.`;

    // Sistema Endocrino
    let endocrinoText = `El paciente refiere los siguientes síntomas endocrinos: ${formValues.endocrino.sintomasEndocrinos.length > 0 ? formValues.endocrino.sintomasEndocrinos.join(", ") : "ninguno"}. ${formValues.endocrino.sudoracionNocturna === "Sí" ? "Presenta sudoración excesiva nocturna." : "No presenta sudoración excesiva nocturna."} ${formValues.endocrino.hirsutismo === "Sí" ? "Presenta hirsutismo." : "No presenta hirsutismo."} ${formValues.endocrino.galactorrea === "Sí" ? "Presenta galactorrea." : "No presenta galactorrea."} ${formValues.endocrino.cambiosRitmoMenstrual ? `Cambios en el ritmo menstrual: ${formValues.endocrino.cambiosRitmoMenstrual}.` : ''} Reporta ${getCambiosPesoText()}. ${getIntoleranciaText()}. Antecedentes patológicos conocidos: ${formValues.endocrino.condicionesEndocrinas || "ninguno"}.`;

    // Sistema Tegumentario
    let tegumentarioText = `${formValues.tegumentario.cambiosColoracion === "Sí" ? "Ha notado cambios en la coloración de la piel." : "No ha notado cambios en la coloración de la piel."} ${formValues.tegumentario.cambiosColoracion === "Sí" ? `Especificaciones: ${formValues.tegumentario.cambiosColoracionEspecificaciones}.` : ''} Otros síntomas presentes: ${formValues.tegumentario.sintomasTegumentarios.length > 0 ? formValues.tegumentario.sintomasTegumentarios.join(", ") : "ninguno"}. ${formValues.tegumentario.cambiosUnas ? `Cambios en uñas: ${formValues.tegumentario.cambiosUnas}.` : ''} ${formValues.tegumentario.cambiosLunares === "Sí" ? "Presenta cambios en lunares." : "No presenta cambios en lunares."} ${formValues.tegumentario.lesionesPigmentadas === "Sí" ? "Presenta lesiones pigmentadas." : "No presenta lesiones pigmentadas."}`;

    // Sistema Musculo Esquelético
    let musculoEsqueleticoText = `${formValues.musculoEsqueletico.fracturas === "No" ? "No ha presentado" : "Ha presentado"} fracturas o esguinces. ${formValues.musculoEsqueletico.fracturas === "Sí" ? `En caso afirmativo, se registran: ${formValues.musculoEsqueletico.detallesFracturas || "[sin especificar]"}.` : ""} Sintomatología musculoesquelética actual: ${formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.length > 0 ? formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.join(", ") : "ninguna"}. ${formValues.musculoEsqueletico.rigidezMatutina ? `Rigidez matutina: ${formValues.musculoEsqueletico.rigidezMatutina}.` : ''} ${formValues.musculoEsqueletico.debilidadMuscular ? `Debilidad muscular: ${formValues.musculoEsqueletico.debilidadMuscular}.` : ''} ${formValues.musculoEsqueletico.limitacionesMovimiento ? `Limitaciones de movimiento: ${formValues.musculoEsqueletico.limitacionesMovimiento}.` : ''}.`;

    // Sistema Nervioso
    let nerviosoText = `${formValues.nervioso.percepcionSentidos === "Sí" ? "Percibe" : "No percibe"} adecuadamente a través de los órganos de los sentidos. El patrón de sueño habitual es de ${formValues.nervioso.horasSueno || "[sin especificar]"} horas por noche. ${formValues.nervioso.trastornosSueno === "Sí" ? "Presenta trastornos del sueño." : "No presenta trastornos del sueño."} ${formValues.nervioso.trastornosSueno === "Sí" ? `Especificaciones: ${formValues.nervioso.trastornosSuenoEspecificaciones}.` : ''} Su carácter habitual se describe como ${formValues.nervioso.estadoAnimo || "[sin especificar]"}. ${formValues.nervioso.parestesias === "Sí" ? "Presenta" : "No presenta"} parestesias (hormigueos, adormecimiento o pérdida de sensibilidad). Otros síntomas neurológicos: ${formValues.nervioso.otrosSintomasNeurologicos.length > 0 ? formValues.nervioso.otrosSintomasNeurologicos.join(", ") : "ninguno"}.`;

    // Cerrar con el texto especial si todos los síntomas están en "Ninguno" o "ninguno"
    if (formValues.digestivo.sintomasDigestivos.map(s => s.toLowerCase()).includes("ninguno")) {
      digestivoText += " El paciente niega alteraciones relacionadas al sistema digestivo. Se interrogó específicamente sobre distensión abdominal, estreñimiento, plenitud posprandial, pirosis, dolor abdominal, náuseas, vómito y reflujo.";
    }
    if (formValues.respiratorio.sintomasRespiratorios.map(s => s.toLowerCase()).includes("ninguno")) {
      respiratorioText += " El paciente niega alteraciones relacionadas al sistema respiratorio. Se interrogó específicamente sobre obstrucción nasal, rinorrea, congestión nasal, epistaxis, disnea, tos, dolor torácico, hernias, expectoraciones, secreciones y cianosis.";
    }
    if (formValues.cardiovascular.sintomasCardiovasculares.map(s => s.toLowerCase()).includes("ninguna")) {
      cardiovascularText += " El paciente niega alteraciones relacionadas al sistema cardiovascular. Se exploró la frecuencia urinaria, síntomas urinarios, urgencia urinaria, fuerza del chorro, infecciones recurrentes y flujo anormal.";
    }
    if (formValues.genitoUrinario.sintomasUrinarios.map(s => s.toLowerCase()).includes("ninguno")) {
      genitoUrinarioText += " El paciente niega alteraciones relacionadas al aparato genito-urinario. Se exploró la frecuencia urinaria, síntomas urinarios, urgencia urinaria, fuerza del chorro, infecciones recurrentes y flujo anormal.";
    }
    if (formValues.endocrino.sintomasEndocrinos.map(s => s.toLowerCase()).includes("ninguno")) {
      endocrinoText += " El paciente niega alteraciones relacionadas al sistema endocrino. Se indagó sobre poliuria, polidipsia, polifagia, exoftalmos, nerviosismo, temblores, insomnio, cambios de peso e intolerancia al frío o calor.";
    }
    if (formValues.tegumentario.sintomasTegumentarios.map(s => s.toLowerCase()).includes("ninguno")) {
      tegumentarioText += " El paciente niega alteraciones relacionadas al sistema tegumentario. Se investigó presencia de erupciones, prurito, hiperhidrosis, pérdida de cabello y piel seca.";
    }
    if (formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.map(s => s.toLowerCase()).includes("ninguna")) {
      musculoEsqueleticoText += " El paciente niega alteraciones relacionadas al sistema músculo-esquelético. Se interrogó sobre fracturas, esguinces, deformidad o dolor articular, rigidez matutina, calambres musculares y limitaciones de movimiento.";
    }
    if (formValues.nervioso.otrosSintomasNeurologicos.map(s => s.toLowerCase()).includes("ninguno")) {
      nerviosoText += " El paciente niega alteraciones relacionadas al sistema nervioso. Se preguntó sobre trastornos del sueño, estado de ánimo, parestesias, convulsiones, temblores, problemas de memoria, personalidad y coordinación.";
    }

    // Establecer los textos en estado o manejo
    setRedacciones({
      digestivo: digestivoText,
      respiratorio: respiratorioText,
      cardiovascular: cardiovascularText,
      genitoUrinario: genitoUrinarioText,
      endocrino: endocrinoText,
      tegumentario: tegumentarioText,
      musculoEsqueletico: musculoEsqueleticoText,
      nervioso: nerviosoText
    });

    // Actualizar cada sección con el texto generado
    handleInterrogatorioChange("digestivo", digestivoText);
    handleInterrogatorioChange("respiratorio", respiratorioText);
    handleInterrogatorioChange("cardiovascular", cardiovascularText);
    handleInterrogatorioChange("genitoUrinario", genitoUrinarioText);
    handleInterrogatorioChange("endocrino", endocrinoText);
    handleInterrogatorioChange("tegumentario", tegumentarioText);
    handleInterrogatorioChange("musculoEsqueletico", musculoEsqueleticoText);
    handleInterrogatorioChange("nervioso", nerviosoText);

    // Cambiar al apartado de redacción IA y hacer auto scroll
    setShowForm(false);
  };

  const handleGenerateRedaction = async () => {
    setIsGenerating(true);
    try {
      // Simular un tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 1500));
      generateAndUpdateRedacciones();
      toast({
        title: "Redacción generada",
        description: "La redacción IA ha sido generada exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar la redacción. Intente nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Interrogatorio por Sistemas</CardTitle>
        <CardDescription>
          Información sobre el estado de salud por sistemas del paciente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={showForm ? "form" : "redaction"} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="form" onClick={() => setShowForm(true)}>Formulario</TabsTrigger>
            <TabsTrigger value="redaction" onClick={() => setShowForm(false)}>Redacción IA</TabsTrigger>
          </TabsList>
          
          <TabsContent value="form" className="space-y-6">
            <Tabs defaultValue="digestivo" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="digestivo">Digestivo</TabsTrigger>
                <TabsTrigger value="respiratorio">Respiratorio</TabsTrigger>
                <TabsTrigger value="cardiovascular">Cardiovascular</TabsTrigger>
                <TabsTrigger value="genitoUrinario">Genito-Urinario</TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="endocrino">Endocrino</TabsTrigger>
                <TabsTrigger value="tegumentario">Tegumentario</TabsTrigger>
                <TabsTrigger value="musculoEsqueletico">Músculo-Esquelético</TabsTrigger>
                <TabsTrigger value="nervioso">Nervioso</TabsTrigger>
              </TabsList>
              
              {/* Aparato Digestivo */}
              <TabsContent value="digestivo" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="alimentacion">Tipo de alimentación</Label>
                    <Select 
                      value={formValues.digestivo.alimentacion} 
                      onValueChange={(value) => handleInputChange('digestivo', 'alimentacion', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Regular">Regular</SelectItem>
                        <SelectItem value="Vegetariana">Vegetariana</SelectItem>
                        <SelectItem value="Vegana">Vegana</SelectItem>
                        <SelectItem value="Keto">Keto</SelectItem>
                        <SelectItem value="Baja en carbohidratos">Baja en carbohidratos</SelectItem>
                        <SelectItem value="Alta en proteínas">Alta en proteínas</SelectItem>
                        <SelectItem value="Mediterránea">Mediterránea</SelectItem>
                        <SelectItem value="Otra">Otra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="masticacion">Patrón de masticación</Label>
                    <Select 
                      value={formValues.digestivo.masticacion} 
                      onValueChange={(value) => handleInputChange('digestivo', 'masticacion', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Normal">Normal</SelectItem>
                        <SelectItem value="Rápido">Rápido</SelectItem>
                        <SelectItem value="Lento">Lento</SelectItem>
                        <SelectItem value="Dificultoso">Dificultoso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="percepcionGusto">Percepción del gusto</Label>
                    <RadioGroup 
                      value={formValues.digestivo.percepcionGusto} 
                      onValueChange={(value) => handleInputChange('digestivo', 'percepcionGusto', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Normal" id="gustoNormal" />
                        <Label htmlFor="gustoNormal">Normal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Alterada" id="gustoAlterada" />
                        <Label htmlFor="gustoAlterada">Alterada</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Ausente" id="gustoAusente" />
                        <Label htmlFor="gustoAusente">Ausente</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {formValues.digestivo.percepcionGusto === 'Alterada' && (
                    <div className="space-y-2">
                      <Label htmlFor="percepcionGustoEspecificaciones">Especificaciones</Label>
                      <Input 
                        id="percepcionGustoEspecificaciones" 
                        value={formValues.digestivo.percepcionGustoEspecificaciones} 
                        onChange={(e) => handleInputChange('digestivo', 'percepcionGustoEspecificaciones', e.target.value)}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="salivacion">Salivación</Label>
                    <Select 
                      value={formValues.digestivo.salivacion} 
                      onValueChange={(value) => handleInputChange('digestivo', 'salivacion', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Normal">Normal</SelectItem>
                        <SelectItem value="Aumentada">Aumentada</SelectItem>
                        <SelectItem value="Disminuida">Disminuida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="deglusion">Deglución</Label>
                    <RadioGroup 
                      value={formValues.digestivo.deglusion} 
                      onValueChange={(value) => handleInputChange('digestivo', 'deglusion', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Normal" id="deglNormal" />
                        <Label htmlFor="deglNormal">Normal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Dificultad" id="deglDificultad" />
                        <Label htmlFor="deglDificultad">Dificultad</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Dolor" id="deglDolor" />
                        <Label htmlFor="deglDolor">Dolor</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {(formValues.digestivo.deglusion === 'Dificultad' || formValues.digestivo.deglusion === 'Dolor') && (
                    <div className="space-y-2">
                      <Label htmlFor="deglusiónEspecificaciones">Especificaciones</Label>
                      <Input 
                        id="deglusiónEspecificaciones" 
                        value={formValues.digestivo.deglusiónEspecificaciones} 
                        onChange={(e) => handleInputChange('digestivo', 'deglusiónEspecificaciones', e.target.value)}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="halitosis">Halitosis</Label>
                    <RadioGroup 
                      value={formValues.digestivo.halitosis} 
                      onValueChange={(value) => handleInputChange('digestivo', 'halitosis', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sí" id="halitosisSi" />
                        <Label htmlFor="halitosisSi">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="halitosisNo" />
                        <Label htmlFor="halitosisNo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {formValues.digestivo.halitosis === 'Sí' && (
                    <div className="space-y-2">
                      <Label htmlFor="halitosisEspecificaciones">Especificaciones</Label>
                      <Input 
                        id="halitosisEspecificaciones" 
                        value={formValues.digestivo.halitosisEspecificaciones} 
                        onChange={(e) => handleInputChange('digestivo', 'halitosisEspecificaciones', e.target.value)}
                      />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Síntomas digestivos</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="ninguno" 
                        checked={formValues.digestivo.sintomasDigestivos.includes('Ninguno')} 
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleInputChange('digestivo', 'sintomasDigestivos', ['Ninguno']);
                          } else {
                            handleInputChange('digestivo', 'sintomasDigestivos', []);
                          }
                        }}
                      />
                      <Label htmlFor="ninguno">Ninguno</Label>
                    </div>
                    {['Distensión abdominal', 'Estreñimiento', 'Plenitud posprandial', 'Pirosis', 'Dolor abdominal', 'Náuseas', 'Vómito', 'Reflujo'].map((sintoma) => (
                      <div key={sintoma} className="flex items-center space-x-2">
                        <Checkbox 
                          id={sintoma} 
                          checked={formValues.digestivo.sintomasDigestivos.includes(sintoma)} 
                          onCheckedChange={(checked) => {
                            if (checked) {
                              if (formValues.digestivo.sintomasDigestivos.includes('Ninguno')) {
                                handleInputChange('digestivo', 'sintomasDigestivos', [sintoma]);
                              } else {
                                handleCheckboxChange('digestivo', 'sintomasDigestivos', sintoma);
                              }
                            } else {
                              handleCheckboxChange('digestivo', 'sintomasDigestivos', sintoma);
                            }
                          }}
                          disabled={formValues.digestivo.sintomasDigestivos.includes('Ninguno') && sintoma !== 'Ninguno'}
                        />
                        <Label htmlFor={sintoma}>{sintoma}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cambiosApetito">Cambios en el apetito</Label>
                    <Input 
                      id="cambiosApetito" 
                      value={formValues.digestivo.cambiosApetito} 
                      onChange={(e) => handleInputChange('digestivo', 'cambiosApetito', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="habitosAlimenticios">Hábitos alimenticios</Label>
                    <Input 
                      id="habitosAlimenticios" 
                      value={formValues.digestivo.habitosAlimenticios} 
                      onChange={(e) => handleInputChange('digestivo', 'habitosAlimenticios', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="colorEvacuaciones">Color de las evacuaciones</Label>
                    <Select 
                      value={formValues.digestivo.colorEvacuaciones} 
                      onValueChange={(value) => handleInputChange('digestivo', 'colorEvacuaciones', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Marrón">Marrón</SelectItem>
                        <SelectItem value="Negro">Negro</SelectItem>
                        <SelectItem value="Amarillo">Amarillo</SelectItem>
                        <SelectItem value="Verde">Verde</SelectItem>
                        <SelectItem value="Rojo">Rojo</SelectItem>
                        <SelectItem value="Pálido">Pálido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hematemesis">Hematemesis</Label>
                    <RadioGroup 
                      value={formValues.digestivo.hematemesis} 
                      onValueChange={(value) => handleInputChange('digestivo', 'hematemesis', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sí" id="hematemesisSi" />
                        <Label htmlFor="hematemesisSi">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="hematemesisNo" />
                        <Label htmlFor="hematemesisNo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="frecuenciaEvacuacion">Frecuencia de evacuación</Label>
                    <Select 
                      value={formValues.digestivo.frecuenciaEvacuacion} 
                      onValueChange={(value) => handleInputChange('digestivo', 'frecuenciaEvacuacion', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 vez al día</SelectItem>
                        <SelectItem value="2">2 veces al día</SelectItem>
                        <SelectItem value="3">3 veces al día</SelectItem>
                        <SelectItem value="Cada 2 días">Cada 2 días</SelectItem>
                        <SelectItem value="Cada 3 días">Cada 3 días</SelectItem>
                        <SelectItem value="Otra">Otra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {formValues.digestivo.frecuenciaEvacuacion === 'Otra' && (
                    <div className="space-y-2">
                      <Label htmlFor="frecuenciaEvacuacionEspecificaciones">Especificaciones</Label>
                      <Input 
                        id="frecuenciaEvacuacionEspecificaciones" 
                        value={formValues.digestivo.frecuenciaEvacuacionEspecificaciones} 
                        onChange={(e) => handleInputChange('digestivo', 'frecuenciaEvacuacionEspecificaciones', e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* Aparato Respiratorio */}
              <TabsContent value="respiratorio" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipoRespiracion">Tipo de respiración</Label>
                    <Select 
                      value={formValues.respiratorio.tipoRespiracion} 
                      onValueChange={(value) => handleInputChange('respiratorio', 'tipoRespiracion', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nasal">Nasal</SelectItem>
                        <SelectItem value="Bucal">Bucal</SelectItem>
                        <SelectItem value="Mixta">Mixta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="apneaSuenio">Apnea del sueño</Label>
                    <RadioGroup 
                      value={formValues.respiratorio.apneaSuenio} 
                      onValueChange={(value) => handleInputChange('respiratorio', 'apneaSuenio', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sí" id="apneaSi" />
                        <Label htmlFor="apneaSi">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="apneaNo" />
                        <Label htmlFor="apneaNo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="oxigenoSuplementario">Uso de oxígeno suplementario</Label>
                    <RadioGroup 
                      value={formValues.respiratorio.oxigenoSuplementario} 
                      onValueChange={(value) => handleInputChange('respiratorio', 'oxigenoSuplementario', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sí" id="oxigenoSi" />
                        <Label htmlFor="oxigenoSi">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="oxigenoNo" />
                        <Label htmlFor="oxigenoNo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tosExpectoracion">Tos con expectoración</Label>
                    <Input 
                      id="tosExpectoracion" 
                      value={formValues.respiratorio.tosExpectoracion} 
                      onChange={(e) => handleInputChange('respiratorio', 'tosExpectoracion', e.target.value)}
                      placeholder="Describa características"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Síntomas respiratorios</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="ningunoResp" 
                        checked={formValues.respiratorio.sintomasRespiratorios.includes('Ninguno')} 
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleInputChange('respiratorio', 'sintomasRespiratorios', ['Ninguno']);
                          } else {
                            handleInputChange('respiratorio', 'sintomasRespiratorios', []);
                          }
                        }}
                      />
                      <Label htmlFor="ningunoResp">Ninguno</Label>
                    </div>
                    {['Obstrucción nasal', 'Rinorrea', 'Congestión nasal', 'Epistaxis', 'Disnea', 'Tos', 'Dolor torácico', 'Hernias', 'Expectoraciones', 'Secreciones', 'Cianosis'].map((sintoma) => (
                      <div key={sintoma} className="flex items-center space-x-2">
                        <Checkbox 
                          id={sintoma} 
                          checked={formValues.respiratorio.sintomasRespiratorios.includes(sintoma)} 
                          onCheckedChange={(checked) => {
                            if (checked) {
                              if (formValues.respiratorio.sintomasRespiratorios.includes('Ninguno')) {
                                handleInputChange('respiratorio', 'sintomasRespiratorios', [sintoma]);
                              } else {
                                handleCheckboxChange('respiratorio', 'sintomasRespiratorios', sintoma);
                              }
                            } else {
                              handleCheckboxChange('respiratorio', 'sintomasRespiratorios', sintoma);
                            }
                          }}
                          disabled={formValues.respiratorio.sintomasRespiratorios.includes('Ninguno') && sintoma !== 'Ninguno'}
                        />
                        <Label htmlFor={sintoma}>{sintoma}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              {/* Aparato Cardiovascular */}
              <TabsContent value="cardiovascular" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dolorPecho">Dolor en el pecho</Label>
                    <RadioGroup 
                      value={formValues.cardiovascular.dolorPecho} 
                      onValueChange={(value) => handleInputChange('cardiovascular', 'dolorPecho', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sí" id="dolorPechoSi" />
                        <Label htmlFor="dolorPechoSi">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="dolorPechoNo" />
                        <Label htmlFor="dolorPechoNo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lipotimia">Lipotimia (desmayos)</Label>
                    <RadioGroup 
                      value={formValues.cardiovascular.lipotimia} 
                      onValueChange={(value) => handleInputChange('cardiovascular', 'lipotimia', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sí" id="lipotimiaSi" />
                        <Label htmlFor="lipotimiaSi">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="lipotimiaNo" />
                        <Label htmlFor="lipotimiaNo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ritmoCardiaco">Ritmo cardíaco</Label>
                    <Select 
                      value={formValues.cardiovascular.ritmoCardiaco} 
                      onValueChange={(value) => handleInputChange('cardiovascular', 'ritmoCardiaco', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Regular">Regular</SelectItem>
                        <SelectItem value="Irregular">Irregular</SelectItem>
                        <SelectItem value="Taquicardia">Taquicardia</SelectItem>
                        <SelectItem value="Bradicardia">Bradicardia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="presionArterial">Presión arterial conocida</Label>
                    <Input 
                      id="presionArterial" 
                      value={formValues.cardiovascular.presionArterial} 
                      onChange={(e) => handleInputChange('cardiovascular', 'presionArterial', e.target.value)}
                      placeholder="Ej: 120/80 mmHg"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="antecedentesInfarto">Antecedentes de infarto o enfermedad coronaria</Label>
                    <RadioGroup 
                      value={formValues.cardiovascular.antecedentesInfarto} 
                      onValueChange={(value) => handleInputChange('cardiovascular', 'antecedentesInfarto', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sí" id="infartoSi" />
                        <Label htmlFor="infartoSi">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="infartoNo" />
                        <Label htmlFor="infartoNo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fatigaEsfuerzo">Fatiga fácil con esfuerzo leve</Label>
                    <RadioGroup 
                      value={formValues.cardiovascular.fatigaEsfuerzo} 
                      onValueChange={(value) => handleInputChange('cardiovascular', 'fatigaEsfuerzo', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sí" id="fatigaSi" />
                        <Label htmlFor="fatigaSi">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="fatigaNo" />
                        <Label htmlFor="fatigaNo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Sintomatología cardiovascular</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="ningunaCardio" 
                        checked={formValues.cardiovascular.sintomasCardiovasculares.includes('Ninguna')} 
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleInputChange('cardiovascular', 'sintomasCardiovasculares', ['Ninguna']);
                          } else {
                            handleInputChange('cardiovascular', 'sintomasCardiovasculares', []);
                          }
                        }}
                      />
                      <Label htmlFor="ningunaCardio">Ninguna</Label>
                    </div>
                    {['Palpitaciones', 'Disnea', 'Edema', 'Cianosis', 'Claudicación', 'Dolor torácico', 'Síncope', 'Mareos', 'Taquicardia'].map((sintoma) => (
                      <div key={sintoma} className="flex items-center space-x-2">
                        <Checkbox 
                          id={sintoma} 
                          checked={formValues.cardiovascular.sintomasCardiovasculares.includes(sintoma)} 
                          onCheckedChange={(checked) => {
                            if (checked) {
                              if (formValues.cardiovascular.sintomasCardiovasculares.includes('Ninguna')) {
                                handleInputChange('cardiovascular', 'sintomasCardiovasculares', [sintoma]);
                              } else {
                                handleCheckboxChange('cardiovascular', 'sintomasCardiovasculares', sintoma);
                              }
                            } else {
                              handleCheckboxChange('cardiovascular', 'sintomasCardiovasculares', sintoma);
                            }
                          }}
                          disabled={formValues.cardiovascular.sintomasCardiovasculares.includes('Ninguna') && sintoma !== 'Ninguna'}
                        />
                        <Label htmlFor={sintoma}>{sintoma}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              {/* Aparato Genito-Urinario */}
              <TabsContent value="genitoUrinario" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="frecuenciaUrinaria">Frecuencia urinaria (veces al día)</Label>
                    <Input 
                      id="frecuenciaUrinaria" 
                      value={formValues.genitoUrinario.frecuenciaUrinaria} 
                      onChange={(e) => handleInputChange('genitoUrinario', 'frecuenciaUrinaria', e.target.value)}
                      type="number"
                      min="1"
                      max="20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="urgenciaUrinaria">Urgencia urinaria</Label>
                    <RadioGroup 
                      value={formValues.genitoUrinario.urgenciaUrinaria} 
                      onValueChange={(value) => handleInputChange('genitoUrinario', 'urgenciaUrinaria', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sí" id="urgenciaSi" />
                        <Label htmlFor="urgenciaSi">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="urgenciaNo" />
                        <Label htmlFor="urgenciaNo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="chorroUrinarioDebil">Chorro urinario débil</Label>
                    <RadioGroup 
                      value={formValues.genitoUrinario.chorroUrinarioDebil} 
                      onValueChange={(value) => handleInputChange('genitoUrinario', 'chorroUrinarioDebil', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sí" id="chorroDebilSi" />
                        <Label htmlFor="chorroDebilSi">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="chorroDebilNo" />
                        <Label htmlFor="chorroDebilNo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="chorroUrinarioIntermitente">Chorro urinario intermitente</Label>
                    <RadioGroup 
                      value={formValues.genitoUrinario.chorroUrinarioIntermitente} 
                      onValueChange={(value) => handleInputChange('genitoUrinario', 'chorroUrinarioIntermitente', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sí" id="chorroIntermitenteSi" />
                        <Label htmlFor="chorroIntermitenteSi">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="chorroIntermitenteNo" />
                        <Label htmlFor="chorroIntermitenteNo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="flujoVaginalUretral">Flujo vaginal/uretral anormal</Label>
                    <RadioGroup 
                      value={formValues.genitoUrinario.flujoVaginalUretral} 
                      onValueChange={(value) => handleInputChange('genitoUrinario', 'flujoVaginalUretral', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sí" id="flujoSi" />
                        <Label htmlFor="flujoSi">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="flujoNo" />
                        <Label htmlFor="flujoNo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="infeccionesUrinarias">Infecciones urinarias frecuentes</Label>
                    <RadioGroup 
                      value={formValues.genitoUrinario.infeccionesUrinarias} 
                      onValueChange={(value) => handleInputChange('genitoUrinario', 'infeccionesUrinarias', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sí" id="infeccionesSi" />
                        <Label htmlFor="infeccionesSi">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="infeccionesNo" />
                        <Label htmlFor="infeccionesNo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Síntomas urinarios</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="ningunoUrinario" 
                        checked={formValues.genitoUrinario.sintomasUrinarios.includes('Ninguno')} 
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleInputChange('genitoUrinario', 'sintomasUrinarios', ['Ninguno']);
                          } else {
                            handleInputChange('genitoUrinario', 'sintomasUrinarios', []);
                          }
                        }}
                      />
                      <Label htmlFor="ningunoUrinario">Ninguno</Label>
                    </div>
                    {['Disuria', 'Poliuria', 'Oliguria', 'Nicturia', 'Hematuria', 'Incontinencia', 'Retención', 'Tenesmo vesical', 'Dolor lumbar'].map((sintoma) => (
                      <div key={sintoma} className="flex items-center space-x-2">
                        <Checkbox 
                          id={sintoma} 
                          checked={formValues.genitoUrinario.sintomasUrinarios.includes(sintoma)} 
                          onCheckedChange={(checked) => {
                            if (checked) {
                              if (formValues.genitoUrinario.sintomasUrinarios.includes('Ninguno')) {
                                handleInputChange('genitoUrinario', 'sintomasUrinarios', [sintoma]);
                              } else {
                                handleCheckboxChange('genitoUrinario', 'sintomasUrinarios', sintoma);
                              }
                            } else {
                              handleCheckboxChange('genitoUrinario', 'sintomasUrinarios', sintoma);
                            }
                          }}
                          disabled={formValues.genitoUrinario.sintomasUrinarios.includes('Ninguno') && sintoma !== 'Ninguno'}
                        />
                        <Label htmlFor={sintoma}>{sintoma}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ultimaMenstruacion">Fecha de última menstruación (mujeres)</Label>
                    <Input 
                      id="ultimaMenstruacion" 
                      value={formValues.genitoUrinario.ultimaMenstruacion} 
                      onChange={(e) => handleInputChange('genitoUrinario', 'ultimaMenstruacion', e.target.value)}
                      type="date"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dismenorrea">Dismenorrea (mujeres)</Label>
                    <Select 
                      value={formValues.genitoUrinario.dismenorrea} 
                      onValueChange={(value) => handleInputChange('genitoUrinario', 'dismenorrea', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No aplica">No aplica</SelectItem>
                        <SelectItem value="No presenta">No presenta</SelectItem>
                        <SelectItem value="Leve">Leve</SelectItem>
                        <SelectItem value="Moderada">Moderada</SelectItem>
                        <SelectItem value="Severa">Severa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duracionMenstruacion">Días de duración de menstruación (mujeres)</Label>
                    <Input 
                      id="duracionMenstruacion" 
                      value={formValues.genitoUrinario.duracionMenstruacion} 
                      onChange={(e) => handleInputChange('genitoUrinario', 'duracionMenstruacion', e.target.value)}
                      type="number"
                      min="0"
                      max="15"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ultimoParto">Fecha de último parto (mujeres)</Label>
                    <Input 
                      id="ultimoParto" 
                      value={formValues.genitoUrinario.ultimoParto} 
                      onChange={(e) => handleInputChange('genitoUrinario', 'ultimoParto', e.target.value)}
                      type="date"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="antecedentesObstetricos">Antecedentes obstétricos</Label>
                    <Textarea 
                      id="antecedentesObstetricos" 
                      value={formValues.genitoUrinario.antecedentesObstetricos} 
                      onChange={(e) => handleInputChange('genitoUrinario', 'antecedentesObstetricos', e.target.value)}
                      placeholder="Describa antecedentes obstétricos relevantes"
                    />
                  </div>
                </div>
              </TabsContent>
              
              {/* Sistema Endocrino */}
              <TabsContent value="endocrino" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sudoracionNocturna">Sudoración excesiva nocturna</Label>
                    <RadioGroup 
                      value={formValues.endocrino.sudoracionNocturna} 
                      onValueChange={(value) => handleInputChange('endocrino', 'sudoracionNocturna', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sí" id="sudoracionSi" />
                        <Label htmlFor="sudoracionSi">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="sudoracionNo" />
                        <Label htmlFor="sudoracionNo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hirsutismo">Hirsutismo</Label>
                    <RadioGroup 
                      value={formValues.endocrino.hirsutismo} 
                      onValueChange={(value) => handleInputChange('endocrino', 'hirsutismo', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sí" id="hirsutismoSi" />
                        <Label htmlFor="hirsutismoSi">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="hirsutismoNo" />
                        <Label htmlFor="hirsutismoNo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="galactorrea">Galactorrea</Label>
                    <RadioGroup 
                      value={formValues.endocrino.galactorrea} 
                      onValueChange={(value) => handleInputChange('endocrino', 'galactorrea', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sí" id="galactorreaSi" />
                        <Label htmlFor="galactorreaSi">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="galactorreaNo" />
                        <Label htmlFor="galactorreaNo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cambiosRitmoMenstrual">Cambios en el ritmo menstrual</Label>
                    <Input 
                      id="cambiosRitmoMenstrual" 
                      value={formValues.endocrino.cambiosRitmoMenstrual} 
                      onChange={(e) => handleInputChange('endocrino', 'cambiosRitmoMenstrual', e.target.value)}
                      placeholder="Describa los cambios"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cambiosPeso">Cambios de peso</Label>
                    <RadioGroup 
                      value={formValues.endocrino.cambiosPeso} 
                      onValueChange={(value) => handleInputChange('endocrino', 'cambiosPeso', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Aumento" id="aumentoPeso" />
                        <Label htmlFor="aumentoPeso">Aumento</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Pérdida" id="perdidaPeso" />
                        <Label htmlFor="perdidaPeso">Pérdida</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sin cambios" id="sinCambiosPeso" />
                        <Label htmlFor="sinCambiosPeso">Sin cambios</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="intoleranciaFrio">Intolerancia al frío</Label>
                    <RadioGroup 
                      value={formValues.endocrino.intoleranciaFrio} 
                      onValueChange={(value) => handleInputChange('endocrino', 'intoleranciaFrio', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sí" id="intoleranciaFrioSi" />
                        <Label htmlFor="intoleranciaFrioSi">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="intoleranciaFrioNo" />
                        <Label htmlFor="intoleranciaFrioNo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="intoleranciaCalor">Intolerancia al calor</Label>
                    <RadioGroup 
                      value={formValues.endocrino.intoleranciaCalor} 
                      onValueChange={(value) => handleInputChange('endocrino', 'intoleranciaCalor', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sí" id="intoleranciaCalorSi" />
                        <Label htmlFor="intoleranciaCalorSi">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="intoleranciaCalorNo" />
                        <Label htmlFor="intoleranciaCalorNo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="condicionesEndocrinas">Condiciones endocrinas conocidas</Label>
                    <Textarea 
                      id="condicionesEndocrinas" 
                      value={formValues.endocrino.condicionesEndocrinas} 
                      onChange={(e) => handleInputChange('endocrino', 'condicionesEndocrinas', e.target.value)}
                      placeholder="Describa condiciones endocrinas conocidas"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Síntomas endocrinos</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="ningunoEndocrino" 
                        checked={formValues.endocrino.sintomasEndocrinos.includes('Ninguno')} 
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleInputChange('endocrino', 'sintomasEndocrinos', ['Ninguno']);
                          } else {
                            handleInputChange('endocrino', 'sintomasEndocrinos', []);
                          }
                        }}
                      />
                      <Label htmlFor="ningunoEndocrino">Ninguno</Label>
                    </div>
                    {['Poliuria', 'Polidipsia', 'Polifagia', 'Exoftalmos', 'Nerviosismo', 'Temblores', 'Insomnio', 'Fatiga', 'Debilidad', 'Cambios en la piel'].map((sintoma) => (
                      <div key={sintoma} className="flex items-center space-x-2">
                        <Checkbox 
                          id={sintoma} 
                          checked={formValues.endocrino.sintomasEndocrinos.includes(sintoma)} 
                          onCheckedChange={(checked) => {
                            if (checked) {
                              if (formValues.endocrino.sintomasEndocrinos.includes('Ninguno')) {
                                handleInputChange('endocrino', 'sintomasEndocrinos', [sintoma]);
                              } else {
                                handleCheckboxChange('endocrino', 'sintomasEndocrinos', sintoma);
                              }
                            } else {
                              handleCheckboxChange('endocrino', 'sintomasEndocrinos', sintoma);
                            }
                          }}
                          disabled={formValues.endocrino.sintomasEndocrinos.includes('Ninguno') && sintoma !== 'Ninguno'}
                        />
                        <Label htmlFor={sintoma}>{sintoma}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              {/* Sistema Tegumentario */}
              <TabsContent value="tegumentario" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cambiosColoracion">Cambios en la coloración de la piel</Label>
                    <RadioGroup 
                      value={formValues.tegumentario.cambiosColoracion} 
                      onValueChange={(value) => handleInputChange('tegumentario', 'cambiosColoracion', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sí" id="cambiosColoracionSi" />
                        <Label htmlFor="cambiosColoracionSi">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="cambiosColoracionNo" />
                        <Label htmlFor="cambiosColoracionNo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {formValues.tegumentario.cambiosColoracion === 'Sí' && (
                    <div className="space-y-2">
                      <Label htmlFor="cambiosColoracionEspecificaciones">Especificaciones</Label>
                      <Input 
                        id="cambiosColoracionEspecificaciones" 
                        value={formValues.tegumentario.cambiosColoracionEspecificaciones} 
                        onChange={(e) => handleInputChange('tegumentario', 'cambiosColoracionEspecificaciones', e.target.value)}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="cambiosUnas">Cambios en uñas</Label>
                    <Input 
                      id="cambiosUnas" 
                      value={formValues.tegumentario.cambiosUnas} 
                      onChange={(e) => handleInputChange('tegumentario', 'cambiosUnas', e.target.value)}
                      placeholder="Describa los cambios"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cambiosLunares">Cambios en lunares</Label>
                    <RadioGroup 
                      value={formValues.tegumentario.cambiosLunares} 
                      onValueChange={(value) => handleInputChange('tegumentario', 'cambiosLunares', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sí" id="cambiosLunaresSi" />
                        <Label htmlFor="cambiosLunaresSi">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="cambiosLunaresNo" />
                        <Label htmlFor="cambiosLunaresNo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lesionesPigmentadas">Lesiones pigmentadas</Label>
                    <RadioGroup 
                      value={formValues.tegumentario.lesionesPigmentadas} 
                      onValueChange={(value) => handleInputChange('tegumentario', 'lesionesPigmentadas', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sí" id="lesionesPigmentadasSi" />
                        <Label htmlFor="lesionesPigmentadasSi">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="lesionesPigmentadasNo" />
                        <Label htmlFor="lesionesPigmentadasNo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Síntomas tegumentarios</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="ningunoTegumentario" 
                        checked={formValues.tegumentario.sintomasTegumentarios.includes('Ninguno')} 
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleInputChange('tegumentario', 'sintomasTegumentarios', ['Ninguno']);
                          } else {
                            handleInputChange('tegumentario', 'sintomasTegumentarios', []);
                          }
                        }}
                      />
                      <Label htmlFor="ningunoTegumentario">Ninguno</Label>
                    </div>
                    {['Erupciones', 'Prurito', 'Hiperhidrosis', 'Pérdida de cabello', 'Piel seca', 'Descamación', 'Acné', 'Dermatitis', 'Urticaria'].map((sintoma) => (
                      <div key={sintoma} className="flex items-center space-x-2">
                        <Checkbox 
                          id={sintoma} 
                          checked={formValues.tegumentario.sintomasTegumentarios.includes(sintoma)} 
                          onCheckedChange={(checked) => {
                            if (checked) {
                              if (formValues.tegumentario.sintomasTegumentarios.includes('Ninguno')) {
                                handleInputChange('tegumentario', 'sintomasTegumentarios', [sintoma]);
                              } else {
                                handleCheckboxChange('tegumentario', 'sintomasTegumentarios', sintoma);
                              }
                            } else {
                              handleCheckboxChange('tegumentario', 'sintomasTegumentarios', sintoma);
                            }
                          }}
                          disabled={formValues.tegumentario.sintomasTegumentarios.includes('Ninguno') && sintoma !== 'Ninguno'}
                        />
                        <Label htmlFor={sintoma}>{sintoma}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              {/* Sistema Músculo-Esquelético */}
              <TabsContent value="musculoEsqueletico" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fracturas">Fracturas o esguinces previos</Label>
                    <RadioGroup 
                      value={formValues.musculoEsqueletico.fracturas} 
                      onValueChange={(value) => handleInputChange('musculoEsqueletico', 'fracturas', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sí" id="fracturasSi" />
                        <Label htmlFor="fracturasSi">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="fracturasNo" />
                        <Label htmlFor="fracturasNo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {formValues.musculoEsqueletico.fracturas === 'Sí' && (
                    <div className="space-y-2">
                      <Label htmlFor="detallesFracturas">Detalles de fracturas o esguinces</Label>
                      <Textarea 
                        id="detallesFracturas" 
                        value={formValues.musculoEsqueletico.detallesFracturas} 
                        onChange={(e) => handleInputChange('musculoEsqueletico', 'detallesFracturas', e.target.value)}
                        placeholder="Describa las fracturas o esguinces previos"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="rigidezMatutina">Rigidez matutina</Label>
                    <Input 
                      id="rigidezMatutina" 
                      value={formValues.musculoEsqueletico.rigidezMatutina} 
                      onChange={(e) => handleInputChange('musculoEsqueletico', 'rigidezMatutina', e.target.value)}
                      placeholder="Describa la rigidez matutina"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="debilidadMuscular">Debilidad muscular</Label>
                    <Input 
                      id="debilidadMuscular" 
                      value={formValues.musculoEsqueletico.debilidadMuscular} 
                      onChange={(e) => handleInputChange('musculoEsqueletico', 'debilidadMuscular', e.target.value)}
                      placeholder="Describa la debilidad muscular"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="limitacionesMovimiento">Limitaciones de movimiento</Label>
                    <Input 
                      id="limitacionesMovimiento" 
                      value={formValues.musculoEsqueletico.limitacionesMovimiento} 
                      onChange={(e) => handleInputChange('musculoEsqueletico', 'limitacionesMovimiento', e.target.value)}
                      placeholder="Describa las limitaciones de movimiento"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Sintomatología musculoesquelética</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="ningunaMusculo" 
                        checked={formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes('Ninguna')} 
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleInputChange('musculoEsqueletico', 'sintomasMusculoEsqueleticos', ['Ninguna']);
                          } else {
                            handleInputChange('musculoEsqueletico', 'sintomasMusculoEsqueleticos', []);
                          }
                        }}
                      />
                      <Label htmlFor="ningunaMusculo">Ninguna</Label>
                    </div>
                    {['Dolor articular', 'Deformidad articular', 'Rigidez matutina', 'Calambres musculares', 'Debilidad muscular', 'Limitación de movimiento', 'Dolor muscular', 'Inflamación articular', 'Crepitación'].map((sintoma) => (
                      <div key={sintoma} className="flex items-center space-x-2">
                        <Checkbox 
                          id={sintoma} 
                          checked={formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes(sintoma)} 
                          onCheckedChange={(checked) => {
                            if (checked) {
                              if (formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes('Ninguna')) {
                                handleInputChange('musculoEsqueletico', 'sintomasMusculoEsqueleticos', [sintoma]);
                              } else {
                                handleCheckboxChange('musculoEsqueletico', 'sintomasMusculoEsqueleticos', sintoma);
                              }
                            } else {
                              handleCheckboxChange('musculoEsqueletico', 'sintomasMusculoEsqueleticos', sintoma);
                            }
                          }}
                          disabled={formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes('Ninguna') && sintoma !== 'Ninguna'}
                        />
                        <Label htmlFor={sintoma}>{sintoma}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              {/* Sistema Nervioso */}
              <TabsContent value="nervioso" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="percepcionSentidos">Percepción adecuada a través de los órganos de los sentidos</Label>
                    <RadioGroup 
                      value={formValues.nervioso.percepcionSentidos} 
                      onValueChange={(value) => handleInputChange('nervioso', 'percepcionSentidos', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sí" id="percepcionSentidosSi" />
                        <Label htmlFor="percepcionSentidosSi">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="percepcionSentidosNo" />
                        <Label htmlFor="percepcionSentidosNo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="horasSueno">Horas de sueño por noche</Label>
                    <Input 
                      id="horasSueno" 
                      value={formValues.nervioso.horasSueno} 
                      onChange={(e) => handleInputChange('nervioso', 'horasSueno', e.target.value)}
                      type="number"
                      min="0"
                      max="24"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="trastornosSueno">Trastornos del sueño</Label>
                    <RadioGroup 
                      value={formValues.nervioso.trastornosSueno} 
                      onValueChange={(value) => handleInputChange('nervioso', 'trastornosSueno', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sí" id="trastornosSuenoSi" />
                        <Label htmlFor="trastornosSuenoSi">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="trastornosSuenoNo" />
                        <Label htmlFor="trastornosSuenoNo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {formValues.nervioso.trastornosSueno === 'Sí' && (
                    <div className="space-y-2">
                      <Label htmlFor="trastornosSuenoEspecificaciones">Especificaciones</Label>
                      <Input 
                        id="trastornosSuenoEspecificaciones" 
                        value={formValues.nervioso.trastornosSuenoEspecificaciones} 
                        onChange={(e) => handleInputChange('nervioso', 'trastornosSuenoEspecificaciones', e.target.value)}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="estadoAnimo">Estado de ánimo habitual</Label>
                    <Select 
                      value={formValues.nervioso.estadoAnimo} 
                      onValueChange={(value) => handleInputChange('nervioso', 'estadoAnimo', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Estable">Estable</SelectItem>
                        <SelectItem value="Irritable">Irritable</SelectItem>
                        <SelectItem value="Depresivo">Depresivo</SelectItem>
                        <SelectItem value="Ansioso">Ansioso</SelectItem>
                        <SelectItem value="Eufórico">Eufórico</SelectItem>
                        <SelectItem value="Variable">Variable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="parestesias">Parestesias (hormigueos, adormecimiento)</Label>
                    <RadioGroup 
                      value={formValues.nervioso.parestesias} 
                      onValueChange={(value) => handleInputChange('nervioso', 'parestesias', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sí" id="parestesiasSi" />
                        <Label htmlFor="parestesiasSi">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="parestesiasNo" />
                        <Label htmlFor="parestesiasNo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Otros síntomas neurológicos</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="ningunoNervioso" 
                        checked={formValues.nervioso.otrosSintomasNeurologicos.includes('Ninguno')} 
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleInputChange('nervioso', 'otrosSintomasNeurologicos', ['Ninguno']);
                          } else {
                            handleInputChange('nervioso', 'otrosSintomasNeurologicos', []);
                          }
                        }}
                      />
                      <Label htmlFor="ningunoNervioso">Ninguno</Label>
                    </div>
                    {['Convulsiones', 'Temblores', 'Problemas de memoria', 'Problemas de personalidad', 'Problemas de coordinación', 'Cefalea', 'Mareos', 'Vértigo', 'Alteraciones visuales', 'Alteraciones auditivas'].map((sintoma) => (
                      <div key={sintoma} className="flex items-center space-x-2">
                        <Checkbox 
                          id={sintoma} 
                          checked={formValues.nervioso.otrosSintomasNeurologicos.includes(sintoma)} 
                          onCheckedChange={(checked) => {
                            if (checked) {
                              if (formValues.nervioso.otrosSintomasNeurologicos.includes('Ninguno')) {
                                handleInputChange('nervioso', 'otrosSintomasNeurologicos', [sintoma]);
                              } else {
                                handleCheckboxChange('nervioso', 'otrosSintomasNeurologicos', sintoma);
                              }
                            } else {
                              handleCheckboxChange('nervioso', 'otrosSintomasNeurologicos', sintoma);
                            }
                          }}
                          disabled={formValues.nervioso.otrosSintomasNeurologicos.includes('Ninguno') && sintoma !== 'Ninguno'}
                        />
                        <Label htmlFor={sintoma}>{sintoma}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-center mt-6">
              <Button 
                onClick={handleGenerateRedaction} 
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generar Redacción IA
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="redaction" className="space-y-6">
            <Tabs defaultValue="digestivo" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="digestivo">Digestivo</TabsTrigger>
                <TabsTrigger value="respiratorio">Respiratorio</TabsTrigger>
                <TabsTrigger value="cardiovascular">Cardiovascular</TabsTrigger>
                <TabsTrigger value="genitoUrinario">Genito-Urinario</TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="endocrino">Endocrino</TabsTrigger>
                <TabsTrigger value="tegumentario">Tegumentario</TabsTrigger>
                <TabsTrigger value="musculoEsqueletico">Músculo-Esquelético</TabsTrigger>
                <TabsTrigger value="nervioso">Nervioso</TabsTrigger>
              </TabsList>
              
              <TabsContent value="digestivo">
                <Card>
                  <CardHeader>
                    <CardTitle>Aparato Digestivo</CardTitle>
                    <CardDescription>Redacción generada por IA</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md min-h-[150px] whitespace-pre-wrap" data-redaction-content>
                      {redacciones.digestivo || "No hay redacción generada. Por favor, complete el formulario y genere la redacción."}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="respiratorio">
                <Card>
                  <CardHeader>
                    <CardTitle>Aparato Respiratorio</CardTitle>
                    <CardDescription>Redacción generada por IA</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md min-h-[150px] whitespace-pre-wrap" data-redaction-content>
                      {redacciones.respiratorio || "No hay redacción generada. Por favor, complete el formulario y genere la redacción."}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="cardiovascular">
                <Card>
                  <CardHeader>
                    <CardTitle>Aparato Cardiovascular</CardTitle>
                    <CardDescription>Redacción generada por IA</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md min-h-[150px] whitespace-pre-wrap" data-redaction-content>
                      {redacciones.cardiovascular || "No hay redacción generada. Por favor, complete el formulario y genere la redacción."}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="genitoUrinario">
                <Card>
                  <CardHeader>
                    <CardTitle>Aparato Genito-Urinario</CardTitle>
                    <CardDescription>Redacción generada por IA</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md min-h-[150px] whitespace-pre-wrap" data-redaction-content>
                      {redacciones.genitoUrinario || "No hay redacción generada. Por favor, complete el formulario y genere la redacción."}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="endocrino">
                <Card>
                  <CardHeader>
                    <CardTitle>Sistema Endocrino</CardTitle>
                    <CardDescription>Redacción generada por IA</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md min-h-[150px] whitespace-pre-wrap" data-redaction-content>
                      {redacciones.endocrino || "No hay redacción generada. Por favor, complete el formulario y genere la redacción."}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="tegumentario">
                <Card>
                  <CardHeader>
                    <CardTitle>Sistema Tegumentario</CardTitle>
                    <CardDescription>Redacción generada por IA</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md min-h-[150px] whitespace-pre-wrap" data-redaction-content>
                      {redacciones.tegumentario || "No hay redacción generada. Por favor, complete el formulario y genere la redacción."}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="musculoEsqueletico">
                <Card>
                  <CardHeader>
                    <CardTitle>Sistema Músculo-Esquelético</CardTitle>
                    <CardDescription>Redacción generada por IA</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md min-h-[150px] whitespace-pre-wrap" data-redaction-content>
                      {redacciones.musculoEsqueletico || "No hay redacción generada. Por favor, complete el formulario y genere la redacción."}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="nervioso">
                <Card>
                  <CardHeader>
                    <CardTitle>Sistema Nervioso</CardTitle>
                    <CardDescription>Redacción generada por IA</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md min-h-[150px] whitespace-pre-wrap" data-redaction-content>
                      {redacciones.nervioso || "No hay redacción generada. Por favor, complete el formulario y genere la redacción."}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-center mt-6">
              <Button 
                onClick={() => setShowForm(true)} 
                variant="outline" 
                className="mr-2"
              >
                Volver al Formulario
              </Button>
              <Button 
                onClick={handleGenerateRedaction} 
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Regenerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Regenerar Redacción
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InterrogatorioSistemas;
