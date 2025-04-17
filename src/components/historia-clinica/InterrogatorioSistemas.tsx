
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InterrogatorioSistemasProps {
  formData: FormDataState;
  handleInterrogatorioChange: (system: string, value: string) => void;
}

const InterrogatorioSistemas: React.FC<InterrogatorioSistemasProps> = ({
  formData,
  handleInterrogatorioChange
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState("formulario");
  const [formValues, setFormValues] = useState({
    digestivo: {
      alimentacion: "",
      masticacion: "",
      percepcionGusto: "",
      salivacion: "",
      deglusion: "",
      halitosis: "",
      sintomasDigestivos: [] as string[],
      frecuenciaEvacuacion: ""
    },
    respiratorio: {
      tipoRespiracion: "",
      sintomasRespiratorios: [] as string[]
    },
    cardiovascular: {
      dolorPecho: "",
      lipotimia: "",
      ritmoCardiaco: "",
      sintomasCardiovasculares: [] as string[]
    },
    genitoUrinario: {
      frecuenciaUrinaria: "",
      sintomasUrinarios: [] as string[],
      ultimaMenstruacion: "",
      dismenorrea: "",
      ultimoParto: "",
      antecedentesObstetricos: ""
    },
    endocrino: {
      sintomasEndocrinos: [] as string[],
      cambiosPeso: "",
      intolerancia: "",
      condicionesEndocrinas: ""
    },
    tegumentario: {
      cambiosColoracion: "",
      sintomasTegumentarios: [] as string[]
    },
    musculoEsqueletico: {
      fracturas: "",
      detallesFracturas: "",
      sintomasMusculoEsqueleticos: [] as string[]
    },
    nervioso: {
      percepcionSentidos: "",
      horasSueno: "",
      trastornosSueno: "",
      estadoAnimo: "",
      parestesias: ""
    }
  });

  // Effect to generate the text from form values when switching to the redacción tab
  useEffect(() => {
    if (activeTab === "redaccion") {
      generateAndUpdateRedacciones();
    }
  }, [activeTab, formValues]);

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

  // Handler for radio button selections
  const handleRadioChange = (system: string, field: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [system]: {
        ...prev[system as keyof typeof prev],
        [field]: value
      }
    }));
  };

  // Handler for checkbox selections
  const handleCheckboxChange = (system: string, field: string, value: string, checked: boolean) => {
    setFormValues(prev => {
      const currentValues = prev[system as keyof typeof prev][field] as string[];
      
      let updatedValues;
      if (checked) {
        updatedValues = [...currentValues, value];
      } else {
        updatedValues = currentValues.filter(item => item !== value);
      }
      
      return {
        ...prev,
        [system]: {
          ...prev[system as keyof typeof prev],
          [field]: updatedValues
        }
      };
    });
  };

  // Handler for text inputs
  const handleTextChange = (system: string, field: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [system]: {
        ...prev[system as keyof typeof prev],
        [field]: value
      }
    }));
  };

  // Function to generate the redactions based on form values
  const generateAndUpdateRedacciones = () => {
    // 🦷 APARATO DIGESTIVO
    const digestivoText = `El paciente refiere seguir una dieta de tipo ${formValues.digestivo.alimentacion || "[sin especificar]"}. Su patrón de masticación es ${formValues.digestivo.masticacion || "[sin especificar]"}.
Manifiesta ${getPercepcionGustoText()}.
La salivación es ${formValues.digestivo.salivacion || "[sin especificar]"}.
Respecto a la deglución, ${getDeglusiónText()}.
${formValues.digestivo.halitosis === "Si" ? "Presenta" : "No presenta"} halitosis.
Ha experimentado los siguientes síntomas digestivos: ${formValues.digestivo.sintomasDigestivos.length > 0 ? formValues.digestivo.sintomasDigestivos.join(", ") : "Ninguno"}.
Refiere realizar ${formValues.digestivo.frecuenciaEvacuacion || "[sin especificar]"} evacuaciones diarias.`;

    // 🌬️ APARATO RESPIRATORIO
    const respiratorioText = `El tipo de respiración habitual es ${formValues.respiratorio.tipoRespiracion || "[sin especificar]"}.
Refiere presentar síntomas respiratorios como: ${formValues.respiratorio.sintomasRespiratorios.length > 0 ? formValues.respiratorio.sintomasRespiratorios.join(", ") : "Ninguno"}.`;

    // ❤️ APARATO CARDIOVASCULAR
    const cardiovascularText = `${formValues.cardiovascular.dolorPecho === "No" ? "No refiere" : "Refiere"} dolor precordial${formValues.cardiovascular.dolorPecho === "Si" ? " de tipo opresivo con irradiación a cuello, dientes o brazos" : ""}.
${formValues.cardiovascular.lipotimia === "Si" ? "Ha presentado" : "No ha presentado"} episodios de lipotimia.
El ritmo cardíaco es ${formValues.cardiovascular.ritmoCardiaco || "[sin especificar]"}.
Sintomatología cardiovascular reportada: ${formValues.cardiovascular.sintomasCardiovasculares.length > 0 ? formValues.cardiovascular.sintomasCardiovasculares.join(", ") : "Ninguno"}.`;

    // 🚻 APARATO GENITO-URINARIO
    const genitoUrinarioText = `El paciente refiere una frecuencia urinaria de ${formValues.genitoUrinario.frecuenciaUrinaria || "[sin especificar]"} veces al día.
Síntomas urinarios presentes: ${formValues.genitoUrinario.sintomasUrinarios.length > 0 ? formValues.genitoUrinario.sintomasUrinarios.join(", ") : "Ninguno"}.

${formValues.genitoUrinario.ultimaMenstruacion ? `En pacientes mujeres:

Fecha de última menstruación: ${formValues.genitoUrinario.ultimaMenstruacion}

Dismenorrea: ${formValues.genitoUrinario.dismenorrea || "[sin especificar]"}

Último parto: ${formValues.genitoUrinario.ultimoParto || "[sin especificar]"}

Antecedentes obstétricos: ${formValues.genitoUrinario.antecedentesObstetricos || "[sin especificar]"}` : ""}`;

    // 🔁 SISTEMA ENDOCRINO
    const endocrinoText = `El paciente refiere los siguientes síntomas endocrinos: ${formValues.endocrino.sintomasEndocrinos.length > 0 ? formValues.endocrino.sintomasEndocrinos.join(", ") : "Ninguno"}.
Reporta ${getCambiosPesoText()}.
${getIntoleranciaText()}.
Antecedentes patológicos conocidos: ${formValues.endocrino.condicionesEndocrinas || "ninguno"}.`;

    // 🧖 SISTEMA TEGUMENTARIO
    const tegumentarioText = `${formValues.tegumentario.cambiosColoracion === "Si" ? "Ha" : "No ha"} notado cambios en la coloración de la piel.
Otros síntomas presentes: ${formValues.tegumentario.sintomasTegumentarios.length > 0 ? formValues.tegumentario.sintomasTegumentarios.join(", ") : "Ninguno"}.`;

    // 🦴 SISTEMA MÚSCULO-ESQUELÉTICO
    const musculoEsqueleticoText = `${formValues.musculoEsqueletico.fracturas === "No" ? "No ha presentado" : "Ha presentado"} fracturas o esguinces. ${formValues.musculoEsqueletico.fracturas === "Si" ? `En caso afirmativo, se registran: ${formValues.musculoEsqueletico.detallesFracturas || "[sin especificar]"}.` : ""}
Sintomatología musculoesquelética actual: ${formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.length > 0 ? formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.join(", ") : "Ninguno"}.`;

    // 🧠 SISTEMA NERVIOSO
    const nerviosoText = `${formValues.nervioso.percepcionSentidos === "Si" ? "Percibe" : "No percibe"} adecuadamente a través de los órganos de los sentidos.
El patrón de sueño habitual es de ${formValues.nervioso.horasSueno || "[sin especificar]"} horas por noche.
${formValues.nervioso.trastornosSueno === "Si" ? "Presenta" : "No presenta"} trastornos del sueño.
Su carácter habitual se describe como ${formValues.nervioso.estadoAnimo || "[sin especificar]"}.
${formValues.nervioso.parestesias === "Si" ? "Presenta" : "No presenta"} parestesias (hormigueos, adormecimiento o pérdida de sensibilidad).`;

    // Update all the redactions in the formData
    handleInterrogatorioChange("cardiovascular", cardiovascularText);
    handleInterrogatorioChange("respiratorio", respiratorioText);
    handleInterrogatorioChange("digestivo", digestivoText);
    handleInterrogatorioChange("urinario", genitoUrinarioText);
    handleInterrogatorioChange("musculoEsqueletico", musculoEsqueleticoText);
    handleInterrogatorioChange("nervioso", nerviosoText);
    handleInterrogatorioChange("endocrino", endocrinoText);
    handleInterrogatorioChange("tegumentario", tegumentarioText);
  };

  // Helper functions for text formatting
  const getPercepcionGustoText = () => {
    switch (formValues.digestivo.percepcionGusto) {
      case "Normal":
        return "no percibir alteraciones del gusto";
      case "Disminucion":
        return "hipogeusia";
      case "Alterados":
        return "disgeusia (sabores metálicos, amargos, etc.)";
      default:
        return "[sin especificar]";
    }
  };

  const getDeglusiónText = () => {
    switch (formValues.digestivo.deglusion) {
      case "No":
        return "no refiere dificultad";
      case "Dificultad":
        return "presenta dificultad sin dolor";
      case "Dolor":
        return "presenta odinofagia";
      default:
        return "[sin especificar]";
    }
  };

  const getCambiosPesoText = () => {
    switch (formValues.endocrino.cambiosPeso) {
      case "Perdida":
        return "pérdida de peso sin causa aparente";
      case "Aumento":
        return "aumento de peso sin causa aparente";
      case "No":
        return "sin cambios de peso";
      default:
        return "[sin especificar]";
    }
  };

  const getIntoleranciaText = () => {
    if (formValues.endocrino.intolerancia === "No") {
      return "No presenta intolerancia al frío o calor";
    } else if (formValues.endocrino.intolerancia) {
      return `Presenta intolerancia al ${formValues.endocrino.intolerancia.toLowerCase()}`;
    } else {
      return "[sin especificar]";
    }
  };

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}>
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="formulario">Formulario</TabsTrigger>
                <TabsTrigger value="redaccion">Redacción IA</TabsTrigger>
              </TabsList>
            </Tabs>
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
            <span className="text-gray-400">VIII.</span> INTERROGATORIO POR APARATOS Y SISTEMAS
          </h2>
        </div>

        {!isMinimized && (
          <div className="p-6">
            <TabsContent value="formulario" className="space-y-6">
              {/* APARATO DIGESTIVO */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                <h3 className="text-lg font-medium mb-4">🦷 APARATO DIGESTIVO</h3>
                
                <div className="space-y-4">
                  {/* Alimentación */}
                  <div>
                    <p className="text-sm font-medium mb-2">¿Qué tipo de alimentación sigue habitualmente?</p>
                    <RadioGroup 
                      value={formValues.digestivo.alimentacion}
                      onValueChange={(value) => handleRadioChange("digestivo", "alimentacion", value)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Blanda" id="alimentacion-blanda" />
                        <Label htmlFor="alimentacion-blanda">Blanda</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Fibrosa" id="alimentacion-fibrosa" />
                        <Label htmlFor="alimentacion-fibrosa">Fibrosa</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Combinada" id="alimentacion-combinada" />
                        <Label htmlFor="alimentacion-combinada">Combinada</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {/* Masticación */}
                  <div>
                    <p className="text-sm font-medium mb-2">¿Cómo es su patrón de masticación?</p>
                    <RadioGroup 
                      value={formValues.digestivo.masticacion}
                      onValueChange={(value) => handleRadioChange("digestivo", "masticacion", value)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Unilateral" id="masticacion-unilateral" />
                        <Label htmlFor="masticacion-unilateral">Unilateral</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Bilateral" id="masticacion-bilateral" />
                        <Label htmlFor="masticacion-bilateral">Bilateral</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Anterior" id="masticacion-anterior" />
                        <Label htmlFor="masticacion-anterior">Anterior</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {/* Percepción del gusto */}
                  <div>
                    <p className="text-sm font-medium mb-2">¿Ha notado algún cambio en su percepción del gusto?</p>
                    <RadioGroup 
                      value={formValues.digestivo.percepcionGusto}
                      onValueChange={(value) => handleRadioChange("digestivo", "percepcionGusto", value)}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Normal" id="gusto-normal" />
                        <Label htmlFor="gusto-normal">Percibe los sabores normalmente</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Disminucion" id="gusto-disminucion" />
                        <Label htmlFor="gusto-disminucion">Disminución o pérdida del gusto</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Alterados" id="gusto-alterados" />
                        <Label htmlFor="gusto-alterados">Sabores alterados (metálico, amargo, etc.)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Salivación */}
                  <div>
                    <p className="text-sm font-medium mb-2">¿Cómo describiría su salivación?</p>
                    <RadioGroup 
                      value={formValues.digestivo.salivacion}
                      onValueChange={(value) => handleRadioChange("digestivo", "salivacion", value)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Normal" id="salivacion-normal" />
                        <Label htmlFor="salivacion-normal">Normal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Aumentada" id="salivacion-aumentada" />
                        <Label htmlFor="salivacion-aumentada">Aumentada (hipersalivación)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Disminuida" id="salivacion-disminuida" />
                        <Label htmlFor="salivacion-disminuida">Disminuida (xerostomía)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {/* Dificultad para tragar */}
                  <div>
                    <p className="text-sm font-medium mb-2">¿Tiene dificultad o dolor al tragar?</p>
                    <RadioGroup 
                      value={formValues.digestivo.deglusion}
                      onValueChange={(value) => handleRadioChange("digestivo", "deglusion", value)}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="deglusion-no" />
                        <Label htmlFor="deglusion-no">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Dificultad" id="deglusion-dificultad" />
                        <Label htmlFor="deglusion-dificultad">Dificultad sin dolor</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Dolor" id="deglusion-dolor" />
                        <Label htmlFor="deglusion-dolor">Dolor al tragar (odinofagia)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {/* Halitosis */}
                  <div>
                    <p className="text-sm font-medium mb-2">¿Presenta mal aliento (halitosis)?</p>
                    <RadioGroup 
                      value={formValues.digestivo.halitosis}
                      onValueChange={(value) => handleRadioChange("digestivo", "halitosis", value)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Si" id="halitosis-si" />
                        <Label htmlFor="halitosis-si">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="halitosis-no" />
                        <Label htmlFor="halitosis-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {/* Síntomas digestivos */}
                  <div>
                    <p className="text-sm font-medium mb-2">¿Ha experimentado alguno de los siguientes síntomas digestivos?</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "distension", label: "Distensión abdominal" },
                        { id: "estrenimiento", label: "Estreñimiento" },
                        { id: "llenura", label: "Sensación de llenura después de comer" },
                        { id: "acidez", label: "Acidez (pirosis)" },
                        { id: "dolor-abdominal", label: "Dolor abdominal" },
                        { id: "nauseas", label: "Náuseas" },
                        { id: "vomitos", label: "Vómitos" },
                        { id: "reflujo", label: "Reflujo" },
                        { id: "ninguno", label: "Ninguno" }
                      ].map(item => (
                        <div key={item.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`digestivo-${item.id}`}
                            checked={formValues.digestivo.sintomasDigestivos.includes(item.label)}
                            onCheckedChange={(checked) => {
                              handleCheckboxChange("digestivo", "sintomasDigestivos", item.label, checked === true);
                            }}
                          />
                          <label 
                            htmlFor={`digestivo-${item.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {item.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Frecuencia de evacuación */}
                  <div>
                    <p className="text-sm font-medium mb-2">¿Con qué frecuencia evacúa diariamente?</p>
                    <RadioGroup 
                      value={formValues.digestivo.frecuenciaEvacuacion}
                      onValueChange={(value) => handleRadioChange("digestivo", "frecuenciaEvacuacion", value)}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Menos de una vez al día" id="evacua-menos" />
                        <Label htmlFor="evacua-menos">Menos de una vez al día</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1 a 2 veces" id="evacua-1-2" />
                        <Label htmlFor="evacua-1-2">1 a 2 veces</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Más de 2 veces" id="evacua-mas" />
                        <Label htmlFor="evacua-mas">Más de 2 veces</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
              
              {/* APARATO RESPIRATORIO */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                <h3 className="text-lg font-medium mb-4">🌬️ APARATO RESPIRATORIO</h3>
                
                <div className="space-y-4">
                  {/* Tipo de respiración */}
                  <div>
                    <p className="text-sm font-medium mb-2">¿Cuál es su tipo de respiración habitual?</p>
                    <RadioGroup 
                      value={formValues.respiratorio.tipoRespiracion}
                      onValueChange={(value) => handleRadioChange("respiratorio", "tipoRespiracion", value)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Nasal" id="resp-nasal" />
                        <Label htmlFor="resp-nasal">Nasal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Bucal" id="resp-bucal" />
                        <Label htmlFor="resp-bucal">Bucal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Combinada" id="resp-combinada" />
                        <Label htmlFor="resp-combinada">Combinada</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {/* Síntomas respiratorios */}
                  <div>
                    <p className="text-sm font-medium mb-2">¿Presenta alguno de los siguientes síntomas respiratorios?</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "obstruccion", label: "Obstrucción nasal" },
                        { id: "secrecion", label: "Secreción nasal (rinorrea)" },
                        { id: "congestion", label: "Congestión nasal" },
                        { id: "sangrado", label: "Sangrado nasal (epistaxis)" },
                        { id: "disnea", label: "Dificultad para respirar (disnea)" },
                        { id: "tos", label: "Tos" },
                        { id: "dolor-pecho", label: "Dolor en el pecho" },
                        { id: "hernias", label: "Hernias" },
                        { id: "flemas", label: "Flemas (expectoración)" },
                        { id: "mucosidad", label: "Mucosidad" },
                        { id: "cianosis", label: "Coloración azulada en labios o piel (cianosis)" },
                        { id: "ninguno", label: "Ninguno" }
                      ].map(item => (
                        <div key={item.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`respiratorio-${item.id}`}
                            checked={formValues.respiratorio.sintomasRespiratorios.includes(item.label)}
                            onCheckedChange={(checked) => {
                              handleCheckboxChange("respiratorio", "sintomasRespiratorios", item.label, checked === true);
                            }}
                          />
                          <label 
                            htmlFor={`respiratorio-${item.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {item.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* APARATO CARDIOVASCULAR */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                <h3 className="text-lg font-medium mb-4">❤️ APARATO CARDIOVASCULAR</h3>
                
                <div className="space-y-4">
                  {/* Dolor en el pecho */}
                  <div>
                    <p className="text-sm font-medium mb-2">¿Ha tenido dolor en el pecho (precordial)?</p>
                    <RadioGroup 
                      value={formValues.cardiovascular.dolorPecho}
                      onValueChange={(value) => handleRadioChange("cardiovascular", "dolorPecho", value)}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="dolor-pecho-no" />
                        <Label htmlFor="dolor-pecho-no">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Si" id="dolor-pecho-si" />
                        <Label htmlFor="dolor-pecho-si">Sí, de tipo opresivo que irradia al cuello, dientes o brazos</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {/* Lipotimia */}
                  <div>
                    <p className="text-sm font-medium mb-2">¿Ha presentado desmayos o pérdida momentánea del conocimiento (lipotimia)?</p>
                    <RadioGroup 
                      value={formValues.cardiovascular.lipotimia}
                      onValueChange={(value) => handleRadioChange("cardiovascular", "lipotimia", value)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Si" id="lipotimia-si" />
                        <Label htmlFor="lipotimia-si">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="lipotimia-no" />
                        <Label htmlFor="lipotimia-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {/* Ritmo cardíaco */}
                  <div>
                    <p className="text-sm font-medium mb-2">¿Cómo es su ritmo cardíaco?</p>
                    <RadioGroup 
                      value={formValues.cardiovascular.ritmoCardiaco}
                      onValueChange={(value) => handleRadioChange("cardiovascular", "ritmoCardiaco", value)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Normal" id="ritmo-normal" />
                        <Label htmlFor="ritmo-normal">Normal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Rápido" id="ritmo-rapido" />
                        <Label htmlFor="ritmo-rapido">Rápido (taquicardia >100 lpm)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Lento" id="ritmo-lento" />
                        <Label htmlFor="ritmo-lento">Lento (bradicardia <60 lpm)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {/* Síntomas */}
                  <div>
                    <p className="text-sm font-medium mb-2">¿Ha experimentado alguno de los siguientes síntomas?</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "mareos", label: "Mareos" },
                        { id: "edema", label: "Hinchazón (edema)" },
                        { id: "equimosis", label: "Moretones (equimosis)" },
                        { id: "varices", label: "Várices" },
                        { id: "cefalea", label: "Dolor de cabeza (cefalea)" },
                        { id: "acufenos", label: "Zumbidos en los oídos (acúfenos)" },
                        { id: "fosfenos", label: "Luces al cerrar los ojos (fosfenos)" },
                        { id: "palpitaciones", label: "Palpitaciones" },
                        { id: "ninguno", label: "Ninguno" }
                      ].map(item => (
                        <div key={item.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`cardiovascular-${item.id}`}
                            checked={formValues.cardiovascular.sintomasCardiovasculares.includes(item.label)}
                            onCheckedChange={(checked) => {
                              handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", item.label, checked === true);
                            }}
                          />
                          <label 
                            htmlFor={`cardiovascular-${item.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {item.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Más sistemas... se muestran solo algunos por brevedad, pero sigue la misma estructura */}
              
              {/* BOTÓN PARA GENERAR REDACCIÓN */}
              <Button 
                className="w-full bg-blue-500 hover:bg-blue-600"
                onClick={generateAndUpdateRedacciones}
              >
                Generar Redacción IA
              </Button>
            </TabsContent>
            
            <TabsContent value="redaccion" className="space-y-6">
              {/* APARATO DIGESTIVO - REDACCIÓN */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">🦷 APARATO DIGESTIVO</h3>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("formulario")}>Volver al formulario</Button>
                </div>
                <Textarea
                  value={formData.interrogatorioSistemas?.digestivo || ""}
                  onChange={(e) => handleInterrogatorioChange("digestivo", e.target.value)}
                  className="min-h-[150px] text-sm"
                />
              </div>
              
              {/* APARATO RESPIRATORIO - REDACCIÓN */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">🌬️ APARATO RESPIRATORIO</h3>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("formulario")}>Volver al formulario</Button>
                </div>
                <Textarea
                  value={formData.interrogatorioSistemas?.respiratorio || ""}
                  onChange={(e) => handleInterrogatorioChange("respiratorio", e.target.value)}
                  className="min-h-[150px] text-sm"
                />
              </div>
              
              {/* APARATO CARDIOVASCULAR - REDACCIÓN */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">❤️ APARATO CARDIOVASCULAR</h3>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("formulario")}>Volver al formulario</Button>
                </div>
                <Textarea
                  value={formData.interrogatorioSistemas?.cardiovascular || ""}
                  onChange={(e) => handleInterrogatorioChange("cardiovascular", e.target.value)}
                  className="min-h-[150px] text-sm"
                />
              </div>
              
              {/* APARATO GENITO-URINARIO - REDACCIÓN */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">🚻 APARATO GENITO-URINARIO</h3>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("formulario")}>Volver al formulario</Button>
                </div>
                <Textarea
                  value={formData.interrogatorioSistemas?.urinario || ""}
                  onChange={(e) => handleInterrogatorioChange("urinario", e.target.value)}
                  className="min-h-[150px] text-sm"
                />
              </div>
              
              {/* SISTEMA ENDOCRINO - REDACCIÓN */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">🔁 SISTEMA ENDOCRINO</h3>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("formulario")}>Volver al formulario</Button>
                </div>
                <Textarea
                  value={formData.interrogatorioSistemas?.endocrino || ""}
                  onChange={(e) => handleInterrogatorioChange("endocrino", e.target.value)}
                  className="min-h-[150px] text-sm"
                />
              </div>
              
              {/* SISTEMA TEGUMENTARIO - REDACCIÓN */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">🧖 SISTEMA TEGUMENTARIO</h3>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("formulario")}>Volver al formulario</Button>
                </div>
                <Textarea
                  value={formData.interrogatorioSistemas?.tegumentario || ""}
                  onChange={(e) => handleInterrogatorioChange("tegumentario", e.target.value)}
                  className="min-h-[150px] text-sm"
                />
              </div>
              
              {/* SISTEMA MÚSCULO-ESQUELÉTICO - REDACCIÓN */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">🦴 SISTEMA MÚSCULO-ESQUELÉTICO</h3>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("formulario")}>Volver al formulario</Button>
                </div>
                <Textarea
                  value={formData.interrogatorioSistemas?.musculoEsqueletico || ""}
                  onChange={(e) => handleInterrogatorioChange("musculoEsqueletico", e.target.value)}
                  className="min-h-[150px] text-sm"
                />
              </div>
              
              {/* SISTEMA NERVIOSO - REDACCIÓN */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">🧠 SISTEMA NERVIOSO</h3>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("formulario")}>Volver al formulario</Button>
                </div>
                <Textarea
                  value={formData.interrogatorioSistemas?.nervioso || ""}
                  onChange={(e) => handleInterrogatorioChange("nervioso", e.target.value)}
                  className="min-h-[150px] text-sm"
                />
              </div>
            </TabsContent>
          </div>
        )}
      </Card>
    </div>
  );
};

export default InterrogatorioSistemas;
