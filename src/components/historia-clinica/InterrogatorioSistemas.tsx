
import React, { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X, Copy, CheckCircle, Eraser } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AnimatedTextarea } from "@/components/ui/animated-textarea";

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
  const [showForm, setShowForm] = useState(true);
  const [redacciones, setRedacciones] = useState({
    digestivo: "",
    respiratorio: "",
    cardiovascular: "",
    genitoUrinario: "",
    endocrino: "",
    tegumentario: "",
    musculoEsqueletico: "",
    nervioso: ""
  });
  const [copied, setCopied] = useState<Record<string, boolean>>({});
  const formRef = useRef<HTMLDivElement>(null);
  const redaccionesRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (showForm === false) {
      generateAndUpdateRedacciones();
    }
  }, [showForm, formValues]);

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

  const handleRadioChange = (system: string, field: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [system]: {
        ...prev[system as keyof typeof prev],
        [field]: value
      }
    }));
  };

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

  const handleTextChange = (system: string, field: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [system]: {
        ...prev[system as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const generateAndUpdateRedacciones = () => {
    const digestivoText = `El paciente refiere seguir una dieta de tipo ${formValues.digestivo.alimentacion || "[sin especificar]"}. Su patrón de masticación es ${formValues.digestivo.masticacion || "[sin especificar]"}.
Manifiesta ${getPercepcionGustoText()}.
La salivación es ${formValues.digestivo.salivacion || "[sin especificar]"}.
Respecto a la deglución, ${getDeglusiónText()}.
${formValues.digestivo.halitosis === "Si" ? "Presenta" : "No presenta"} halitosis.
Ha experimentado los siguientes síntomas digestivos: ${formValues.digestivo.sintomasDigestivos.length > 0 ? formValues.digestivo.sintomasDigestivos.join(", ") : "Ninguno"}.
Refiere realizar ${formValues.digestivo.frecuenciaEvacuacion || "[sin especificar]"} evacuaciones diarias.`;

    const respiratorioText = `El tipo de respiración habitual es ${formValues.respiratorio.tipoRespiracion || "[sin especificar]"}.
Refiere presentar síntomas respiratorios como: ${formValues.respiratorio.sintomasRespiratorios.length > 0 ? formValues.respiratorio.sintomasRespiratorios.join(", ") : "Ninguno"}.`;

    const cardiovascularText = `${formValues.cardiovascular.dolorPecho === "No" ? "No refiere" : "Refiere"} dolor precordial${formValues.cardiovascular.dolorPecho === "Si" ? " de tipo opresivo con irradiación a cuello, dientes o brazos" : ""}.
${formValues.cardiovascular.lipotimia === "Si" ? "Ha presentado" : "No ha presentado"} episodios de lipotimia.
El ritmo cardíaco es ${formValues.cardiovascular.ritmoCardiaco || "[sin especificar]"}.
Sintomatología cardiovascular reportada: ${formValues.cardiovascular.sintomasCardiovasculares.length > 0 ? formValues.cardiovascular.sintomasCardiovasculares.join(", ") : "Ninguno"}.`;

    const genitoUrinarioText = `El paciente refiere una frecuencia urinaria de ${formValues.genitoUrinario.frecuenciaUrinaria || "[sin especificar]"} veces al día.
Síntomas urinarios presentes: ${formValues.genitoUrinario.sintomasUrinarios.length > 0 ? formValues.genitoUrinario.sintomasUrinarios.join(", ") : "Ninguno"}.

${formValues.genitoUrinario.ultimaMenstruacion ? `En pacientes mujeres:

Fecha de última menstruación: ${formValues.genitoUrinario.ultimaMenstruacion}

Dismenorrea: ${formValues.genitoUrinario.dismenorrea || "[sin especificar]"}

Último parto: ${formValues.genitoUrinario.ultimoParto || "[sin especificar]"}

Antecedentes obstétricos: ${formValues.genitoUrinario.antecedentesObstetricos || "[sin especificar]"}` : ""}`;

    const endocrinoText = `El paciente refiere los siguientes síntomas endocrinos: ${formValues.endocrino.sintomasEndocrinos.length > 0 ? formValues.endocrino.sintomasEndocrinos.join(", ") : "Ninguno"}.
Reporta ${getCambiosPesoText()}.
${getIntoleranciaText()}.
Antecedentes patológicos conocidos: ${formValues.endocrino.condicionesEndocrinas || "ninguno"}.`;

    const tegumentarioText = `${formValues.tegumentario.cambiosColoracion === "Si" ? "Ha" : "No ha"} notado cambios en la coloración de la piel.
Otros síntomas presentes: ${formValues.tegumentario.sintomasTegumentarios.length > 0 ? formValues.tegumentario.sintomasTegumentarios.join(", ") : "Ninguno"}.`;

    const musculoEsqueleticoText = `${formValues.musculoEsqueletico.fracturas === "No" ? "No ha presentado" : "Ha presentado"} fracturas o esguinces. ${formValues.musculoEsqueletico.fracturas === "Si" ? `En caso afirmativo, se registran: ${formValues.musculoEsqueletico.detallesFracturas || "[sin especificar]"}.` : ""}
Sintomatología musculoesquelética actual: ${formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.length > 0 ? formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.join(", ") : "Ninguno"}.`;

    const nerviosoText = `${formValues.nervioso.percepcionSentidos === "Si" ? "Percibe" : "No percibe"} adecuadamente a través de los órganos de los sentidos.
El patrón de sueño habitual es de ${formValues.nervioso.horasSueno || "[sin especificar]"} horas por noche.
${formValues.nervioso.trastornosSueno === "Si" ? "Presenta" : "No presenta"} trastornos del sueño.
Su carácter habitual se describe como ${formValues.nervioso.estadoAnimo || "[sin especificar]"}.
${formValues.nervioso.parestesias === "Si" ? "Presenta" : "No presenta"} parestesias (hormigueos, adormecimiento o pérdida de sensibilidad).`;

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

    handleInterrogatorioChange("digestivo", digestivoText);
    handleInterrogatorioChange("respiratorio", respiratorioText);
    handleInterrogatorioChange("cardiovascular", cardiovascularText);
    handleInterrogatorioChange("genitoUrinario", genitoUrinarioText);
    handleInterrogatorioChange("endocrino", endocrinoText);
    handleInterrogatorioChange("tegumentario", tegumentarioText);
    handleInterrogatorioChange("musculoEsqueletico", musculoEsqueleticoText);
    handleInterrogatorioChange("nervioso", nerviosoText);
  };

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

  const handleCopy = (section: string) => {
    navigator.clipboard.writeText(redacciones[section]);
    setCopied(prev => ({
      ...prev,
      [section]: true
    }));
    setTimeout(() => setCopied(prev => ({
      ...prev,
      [section]: false
    })), 2000);
  };

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}>
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
              <button onClick={() => setShowForm(true)} className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${showForm ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}>
                Formulario
              </button>
              <button onClick={() => setShowForm(false)} className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${!showForm ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}>
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

        <div ref={redaccionesRef} className="flex justify-start px-6 py-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-gray-400">IX.</span> INTERROGATORIO POR APARATOS Y SISTEMAS
          </h2>
        </div>

        {!isMinimized && (
          <div className="p-6" ref={formRef}>
            {showForm ? (
              <div className="space-y-6">
                {/* APARATO DIGESTIVO */}
                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-2 text-justify">Aparato Digestivo</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tipo de Alimentación</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Blanda" isSelected={formValues.digestivo.alimentacion === "Blanda"} onClick={() => handleRadioChange("digestivo", "alimentacion", "Blanda")} />
                        <WordButton label="Fibrosa" isSelected={formValues.digestivo.alimentacion === "Fibrosa"} onClick={() => handleRadioChange("digestivo", "alimentacion", "Fibrosa")} />
                        <WordButton label="Combinada" isSelected={formValues.digestivo.alimentacion === "Combinada"} onClick={() => handleRadioChange("digestivo", "alimentacion", "Combinada")} />
                      </div>
                    </div>
                    <div>
                      <Label>Patrón de Masticación</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Unilateral" isSelected={formValues.digestivo.masticacion === "Unilateral"} onClick={() => handleRadioChange("digestivo", "masticacion", "Unilateral")} />
                        <WordButton label="Bilateral" isSelected={formValues.digestivo.masticacion === "Bilateral"} onClick={() => handleRadioChange("digestivo", "masticacion", "Bilateral")} />
                        <WordButton label="Anterior" isSelected={formValues.digestivo.masticacion === "Anterior"} onClick={() => handleRadioChange("digestivo", "masticacion", "Anterior")} />
                      </div>
                    </div>
                    <div>
                      <Label>Percepción del Gusto</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Normal" isSelected={formValues.digestivo.percepcionGusto === "Normal"} onClick={() => handleRadioChange("digestivo", "percepcionGusto", "Normal")} />
                        <WordButton label="Disminución" isSelected={formValues.digestivo.percepcionGusto === "Disminucion"} onClick={() => handleRadioChange("digestivo", "percepcionGusto", "Disminucion")} />
                        <WordButton label="Alterados" isSelected={formValues.digestivo.percepcionGusto === "Alterados"} onClick={() => handleRadioChange("digestivo", "percepcionGusto", "Alterados")} />
                      </div>
                    </div>
                    <div>
                      <Label>Salivación</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Normal" isSelected={formValues.digestivo.salivacion === "Normal"} onClick={() => handleRadioChange("digestivo", "salivacion", "Normal")} />
                        <WordButton label="Aumentada" isSelected={formValues.digestivo.salivacion === "Aumentada"} onClick={() => handleRadioChange("digestivo", "salivacion", "Aumentada")} />
                        <WordButton label="Disminuida" isSelected={formValues.digestivo.salivacion === "Disminuida"} onClick={() => handleRadioChange("digestivo", "salivacion", "Disminuida")} />
                      </div>
                    </div>
                    <div>
                      <Label>Dificultad o Dolor al Tragar</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="No" isSelected={formValues.digestivo.deglusion === "No"} onClick={() => handleRadioChange("digestivo", "deglusion", "No")} />
                        <WordButton label="Dificultad" isSelected={formValues.digestivo.deglusion === "Dificultad"} onClick={() => handleRadioChange("digestivo", "deglusion", "Dificultad")} />
                        <WordButton label="Dolor" isSelected={formValues.digestivo.deglusion === "Dolor"} onClick={() => handleRadioChange("digestivo", "deglusion", "Dolor")} />
                      </div>
                    </div>
                    <div>
                      <Label>Halitosis</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Sí" isSelected={formValues.digestivo.halitosis === "Si"} onClick={() => handleRadioChange("digestivo", "halitosis", "Si")} />
                        <WordButton label="No" isSelected={formValues.digestivo.halitosis === "No"} onClick={() => handleRadioChange("digestivo", "halitosis", "No")} />
                      </div>
                    </div>
                    <div>
                      <Label>Síntomas Digestivos</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Distensión Abdominal" isSelected={formValues.digestivo.sintomasDigestivos.includes("Distensión abdominal")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "Distensión abdominal", !formValues.digestivo.sintomasDigestivos.includes("Distensión abdominal"))} />
                        <WordButton label="Estreñimiento" isSelected={formValues.digestivo.sintomasDigestivos.includes("Estreñimiento")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "Estreñimiento", !formValues.digestivo.sintomasDigestivos.includes("Estreñimiento"))} />
                        <WordButton label="Plenitud Posprandial" isSelected={formValues.digestivo.sintomasDigestivos.includes("Sensación de llenura después de comer")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "Sensación de llenura después de comer", !formValues.digestivo.sintomasDigestivos.includes("Sensación de llenura después de comer"))} />
                        <WordButton label="Pirosis" isSelected={formValues.digestivo.sintomasDigestivos.includes("Acidez (pirosis)")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "Acidez (pirosis)", !formValues.digestivo.sintomasDigestivos.includes("Acidez (pirosis)"))} />
                        <WordButton label="Dolor Abdominal" isSelected={formValues.digestivo.sintomasDigestivos.includes("Dolor abdominal")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "Dolor abdominal", !formValues.digestivo.sintomasDigestivos.includes("Dolor abdominal"))} />
                        <WordButton label="Náusea" isSelected={formValues.digestivo.sintomasDigestivos.includes("Náuseas")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "Náuseas", !formValues.digestivo.sintomasDigestivos.includes("Náuseas"))} />
                        <WordButton label="Vómito" isSelected={formValues.digestivo.sintomasDigestivos.includes("Vómitos")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "Vómitos", !formValues.digestivo.sintomasDigestivos.includes("Vómitos"))} />
                        <WordButton label="Reflujo" isSelected={formValues.digestivo.sintomasDigestivos.includes("Reflujo")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "Reflujo", !formValues.digestivo.sintomasDigestivos.includes("Reflujo"))} />
                        <WordButton label="Ninguno" isSelected={formValues.digestivo.sintomasDigestivos.includes("Ninguno")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "Ninguno", !formValues.digestivo.sintomasDigestivos.includes("Ninguno"))} />
                      </div>
                    </div>
                    <div>
                      <Label>Frecuencia de Evacuación</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Menos de 1 vez al día" isSelected={formValues.digestivo.frecuenciaEvacuacion === "Menos de una vez al día"} onClick={() => handleRadioChange("digestivo", "frecuenciaEvacuacion", "Menos de una vez al día")} />
                        <WordButton label="1 a 2 veces" isSelected={formValues.digestivo.frecuenciaEvacuacion === "1 a 2 veces"} onClick={() => handleRadioChange("digestivo", "frecuenciaEvacuacion", "1 a 2 veces")} />
                        <WordButton label="Más de 2 veces" isSelected={formValues.digestivo.frecuenciaEvacuacion === "Más de 2 veces"} onClick={() => handleRadioChange("digestivo", "frecuenciaEvacuacion", "Más de 2 veces")} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* APARATO RESPIRATORIO */}
                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-2 text-justify">Aparato Respiratorio</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tipo de Respiración</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Nasal" isSelected={formValues.respiratorio.tipoRespiracion === "Nasal"} onClick={() => handleRadioChange("respiratorio", "tipoRespiracion", "Nasal")} />
                        <WordButton label="Bucal" isSelected={formValues.respiratorio.tipoRespiracion === "Bucal"} onClick={() => handleRadioChange("respiratorio", "tipoRespiracion", "Bucal")} />
                        <WordButton label="Combinada" isSelected={formValues.respiratorio.tipoRespiracion === "Combinada"} onClick={() => handleRadioChange("respiratorio", "tipoRespiracion", "Combinada")} />
                      </div>
                    </div>
                    <div>
                      <Label>Síntomas Respiratorios</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Obstrucción Nasal" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Obstrucción nasal")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Obstrucción nasal", !formValues.respiratorio.sintomasRespiratorios.includes("Obstrucción nasal"))} />
                        <WordButton label="Rinorrea" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Secreción nasal (rinorrea)")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Secreción nasal (rinorrea)", !formValues.respiratorio.sintomasRespiratorios.includes("Secreción nasal (rinorrea)"))} />
                        <WordButton label="Congestión Nasal" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Congestión nasal")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Congestión nasal", !formValues.respiratorio.sintomasRespiratorios.includes("Congestión nasal"))} />
                        <WordButton label="Epistaxis" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Sangrado nasal (epistaxis)")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Sangrado nasal (epistaxis)", !formValues.respiratorio.sintomasRespiratorios.includes("Sangrado nasal (epistaxis)"))} />
                        <WordButton label="Disnea" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Dificultad para respirar (disnea)")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Dificultad para respirar (disnea)", !formValues.respiratorio.sintomasRespiratorios.includes("Dificultad para respirar (disnea)"))} />
                        <WordButton label="Tos" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Tos")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Tos", !formValues.respiratorio.sintomasRespiratorios.includes("Tos"))} />
                        <WordButton label="Dolor Torácico" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Dolor en el pecho")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Dolor en el pecho", !formValues.respiratorio.sintomasRespiratorios.includes("Dolor en el pecho"))} />
                        <WordButton label="Hernias" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Hernias")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Hernias", !formValues.respiratorio.sintomasRespiratorios.includes("Hernias"))} />
                        <WordButton label="Expectoraciones" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Flemas (expectoración)")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Flemas (expectoración)", !formValues.respiratorio.sintomasRespiratorios.includes("Flemas (expectoración)"))} />
                        <WordButton label="Secreciones" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Mucosidad")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Mucosidad", !formValues.respiratorio.sintomasRespiratorios.includes("Mucosidad"))} />
                        <WordButton label="Cianosis" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Coloración azulada en labios o piel (cianosis)")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Coloración azulada en labios o piel (cianosis)", !formValues.respiratorio.sintomasRespiratorios.includes("Coloración azulada en labios o piel (cianosis)"))} />
                        <WordButton label="Ninguno" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Ninguno")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Ninguno", !formValues.respiratorio.sintomasRespiratorios.includes("Ninguno"))} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* APARATO CARDIOVASCULAR */}
                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-2 text-justify">Aparato Cardiovascular</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Dolor en el Pecho</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="No" isSelected={formValues.cardiovascular.dolorPecho === "No"} onClick={() => handleRadioChange("cardiovascular", "dolorPecho", "No")} />
                        <WordButton label="Sí" isSelected={formValues.cardiovascular.dolorPecho === "Si"} onClick={() => handleRadioChange("cardiovascular", "dolorPecho", "Si")} />
                      </div>
                    </div>
                    <div>
                      <Label>Lipotimia</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Sí" isSelected={formValues.cardiovascular.lipotimia === "Si"} onClick={() => handleRadioChange("cardiovascular", "lipotimia", "Si")} />
                        <WordButton label="No" isSelected={formValues.cardiovascular.lipotimia === "No"} onClick={() => handleRadioChange("cardiovascular", "lipotimia", "No")} />
                      </div>
                    </div>
                    <div>
                      <Label>Ritmo Cardíaco</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Normal" isSelected={formValues.cardiovascular.ritmoCardiaco === "Normal"} onClick={() => handleRadioChange("cardiovascular", "ritmoCardiaco", "Normal")} />
                        <WordButton label="Rápido" isSelected={formValues.cardiovascular.ritmoCardiaco === "Rápido"} onClick={() => handleRadioChange("cardiovascular", "ritmoCardiaco", "Rápido")} />
                        <WordButton label="Lento" isSelected={formValues.cardiovascular.ritmoCardiaco === "Lento"} onClick={() => handleRadioChange("cardiovascular", "ritmoCardiaco", "Lento")} />
                      </div>
                    </div>
                    <div>
                      <Label>Síntomas Cardiovasculares</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Mareos" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Mareos")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "Mareos", !formValues.cardiovascular.sintomasCardiovasculares.includes("Mareos"))} />
                        <WordButton label="Edema" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Hinchazón (edema)")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "Hinchazón (edema)", !formValues.cardiovascular.sintomasCardiovasculares.includes("Hinchazón (edema)"))} />
                        <WordButton label="Equimosis" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Moretones (equimosis)")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "Moretones (equimosis)", !formValues.cardiovascular.sintomasCardiovasculares.includes("Moretones (equimosis)"))} />
                        <WordButton label="Várices" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Várices")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "Várices", !formValues.cardiovascular.sintomasCardiovasculares.includes("Várices"))} />
                        <WordButton label="Cefalea" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Dolor de cabeza (cefalea)")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "Dolor de cabeza (cefalea)", !formValues.cardiovascular.sintomasCardiovasculares.includes("Dolor de cabeza (cefalea)"))} />
                        <WordButton label="Acúfenos" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Zumbidos en los oídos (acúfenos)")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "Zumbidos en los oídos (acúfenos)", !formValues.cardiovascular.sintomasCardiovasculares.includes("Zumbidos en los oídos (acúfenos)"))} />
                        <WordButton label="Fosfenos" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Luces al cerrar los ojos (fosfenos)")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "Luces al cerrar los ojos (fosfenos)", !formValues.cardiovascular.sintomasCardiovasculares.includes("Luces al cerrar los ojos (fosfenos)"))} />
                        <WordButton label="Palpitaciones" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Palpitaciones")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "Palpitaciones", !formValues.cardiovascular.sintomasCardiovasculares.includes("Palpitaciones"))} />
                        <WordButton label="Ninguno" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Ninguno")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "Ninguno", !formValues.cardiovascular.sintomasCardiovasculares.includes("Ninguno"))} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* APARATO GENITO-URINARIO */}
                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-2 text-justify">Aparato Genito-Urinario</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Frecuencia Urinaria</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Menos de 3 veces" isSelected={formValues.genitoUrinario.frecuenciaUrinaria === "Menos de 3"} onClick={() => handleRadioChange("genitoUrinario", "frecuenciaUrinaria", "Menos de 3")} />
                        <WordButton label="3 a 6 veces" isSelected={formValues.genitoUrinario.frecuenciaUrinaria === "3 a 6"} onClick={() => handleRadioChange("genitoUrinario", "frecuenciaUrinaria", "3 a 6")} />
                        <WordButton label="Más de 6 veces" isSelected={formValues.genitoUrinario.frecuenciaUrinaria === "Más de 6"} onClick={() => handleRadioChange("genitoUrinario", "frecuenciaUrinaria", "Más de 6")} />
                      </div>
                    </div>
                    <div>
                      <Label>Síntomas Urinarios</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Incontinencia" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("Incontinencia")} onClick={() => handleCheckboxChange("genitoUrinario", "sintomasUrinarios", "Incontinencia", !formValues.genitoUrinario.sintomasUrinarios.includes("Incontinencia"))} />
                        <WordButton label="Disuria" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("Dolor al orinar (disuria)")} onClick={() => handleCheckboxChange("genitoUrinario", "sintomasUrinarios", "Dolor al orinar (disuria)", !formValues.genitoUrinario.sintomasUrinarios.includes("Dolor al orinar (disuria)"))} />
                        <WordButton label="Hematuria" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("Sangre en orina (hematuria)")} onClick={() => handleCheckboxChange("genitoUrinario", "sintomasUrinarios", "Sangre en orina (hematuria)", !formValues.genitoUrinario.sintomasUrinarios.includes("Sangre en orina (hematuria)"))} />
                        <WordButton label="Poliuria" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("Orina en exceso (poliuria)")} onClick={() => handleCheckboxChange("genitoUrinario", "sintomasUrinarios", "Orina en exceso (poliuria)", !formValues.genitoUrinario.sintomasUrinarios.includes("Orina en exceso (poliuria)"))} />
                        <WordButton label="Nicturia" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("Orinar de noche (nicturia)")} onClick={() => handleCheckboxChange("genitoUrinario", "sintomasUrinarios", "Orinar de noche (nicturia)", !formValues.genitoUrinario.sintomasUrinarios.includes("Orinar de noche (nicturia)"))} />
                        <WordButton label="Dolor Lumbar" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("Dolor lumbar")} onClick={() => handleCheckboxChange("genitoUrinario", "sintomasUrinarios", "Dolor lumbar", !formValues.genitoUrinario.sintomasUrinarios.includes("Dolor lumbar"))} />
                        <WordButton label="Ninguno" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("Ninguno")} onClick={() => handleCheckboxChange("genitoUrinario", "sintomasUrinarios", "Ninguno", !formValues.genitoUrinario.sintomasUrinarios.includes("Ninguno"))} />
                      </div>
                    </div>
                    <div>
                      <Label>Fecha de Última Menstruación</Label>
                      <input
                        type="text"
                        value={formValues.genitoUrinario.ultimaMenstruacion}
                        onChange={(e) => handleTextChange("genitoUrinario", "ultimaMenstruacion", e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <Label>Dismenorrea</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Sí" isSelected={formValues.genitoUrinario.dismenorrea === "Si"} onClick={() => handleRadioChange("genitoUrinario", "dismenorrea", "Si")} />
                        <WordButton label="No" isSelected={formValues.genitoUrinario.dismenorrea === "No"} onClick={() => handleRadioChange("genitoUrinario", "dismenorrea", "No")} />
                      </div>
                    </div>
                    <div>
                      <Label>Fecha de Último Parto</Label>
                      <input
                        type="text"
                        value={formValues.genitoUrinario.ultimoParto}
                        onChange={(e) => handleTextChange("genitoUrinario", "ultimoParto", e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <Label>Antecedentes Obstétricos</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Ninguno" isSelected={formValues.genitoUrinario.antecedentesObstetricos === "Ninguno"} onClick={() => handleRadioChange("genitoUrinario", "antecedentesObstetricos", "Ninguno")} />
                        <WordButton label="Abortos" isSelected={formValues.genitoUrinario.antecedentesObstetricos === "Abortos"} onClick={() => handleRadioChange("genitoUrinario", "antecedentesObstetricos", "Abortos")} />
                        <WordButton label="Cesáreas" isSelected={formValues.genitoUrinario.antecedentesObstetricos === "Cesáreas"} onClick={() => handleRadioChange("genitoUrinario", "antecedentesObstetricos", "Cesáreas")} />
                        <WordButton label="Ambos" isSelected={formValues.genitoUrinario.antecedentesObstetricos === "Ambos"} onClick={() => handleRadioChange("genitoUrinario", "antecedentesObstetricos", "Ambos")} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SISTEMA ENDOCRINO */}
                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-2 text-justify">Sistema Endocrino</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Síntomas Endocrinos</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Poliuria" isSelected={formValues.endocrino.sintomasEndocrinos.includes("Poliuria")} onClick={() => handleCheckboxChange("endocrino", "sintomasEndocrinos", "Poliuria", !formValues.endocrino.sintomasEndocrinos.includes("Poliuria"))} />
                        <WordButton label="Polidipsia" isSelected={formValues.endocrino.sintomasEndocrinos.includes("Polidipsia")} onClick={() => handleCheckboxChange("endocrino", "sintomasEndocrinos", "Polidipsia", !formValues.endocrino.sintomasEndocrinos.includes("Polidipsia"))} />
                        <WordButton label="Polifagia" isSelected={formValues.endocrino.sintomasEndocrinos.includes("Polifagia")} onClick={() => handleCheckboxChange("endocrino", "sintomasEndocrinos", "Polifagia", !formValues.endocrino.sintomasEndocrinos.includes("Polifagia"))} />
                        <WordButton label="Exoftalmos" isSelected={formValues.endocrino.sintomasEndocrinos.includes("Exoftalmos (ojos saltones)")} onClick={() => handleCheckboxChange("endocrino", "sintomasEndocrinos", "Exoftalmos (ojos saltones)", !formValues.endocrino.sintomasEndocrinos.includes("Exoftalmos (ojos saltones)"))} />
                        <WordButton label="Nerviosismo" isSelected={formValues.endocrino.sintomasEndocrinos.includes("Nerviosismo")} onClick={() => handleCheckboxChange("endocrino", "sintomasEndocrinos", "Nerviosismo", !formValues.endocrino.sintomasEndocrinos.includes("Nerviosismo"))} />
                        <WordButton label="Temblores" isSelected={formValues.endocrino.sintomasEndocrinos.includes("Temblores")} onClick={() => handleCheckboxChange("endocrino", "sintomasEndocrinos", "Temblores", !formValues.endocrino.sintomasEndocrinos.includes("Temblores"))} />
                        <WordButton label="Insomnio" isSelected={formValues.endocrino.sintomasEndocrinos.includes("Insomnio")} onClick={() => handleCheckboxChange("endocrino", "sintomasEndocrinos", "Insomnio", !formValues.endocrino.sintomasEndocrinos.includes("Insomnio"))} />
                        <WordButton label="Ninguno" isSelected={formValues.endocrino.sintomasEndocrinos.includes("Ninguno")} onClick={() => handleCheckboxChange("endocrino", "sintomasEndocrinos", "Ninguno", !formValues.endocrino.sintomasEndocrinos.includes("Ninguno"))} />
                      </div>
                    </div>
                    <div>
                      <Label>Cambios de Peso</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Pérdida" isSelected={formValues.endocrino.cambiosPeso === "Perdida"} onClick={() => handleRadioChange("endocrino", "cambiosPeso", "Perdida")} />
                        <WordButton label="Aumento" isSelected={formValues.endocrino.cambiosPeso === "Aumento"} onClick={() => handleRadioChange("endocrino", "cambiosPeso", "Aumento")} />
                        <WordButton label="No" isSelected={formValues.endocrino.cambiosPeso === "No"} onClick={() => handleRadioChange("endocrino", "cambiosPeso", "No")} />
                      </div>
                    </div>
                    <div>
                      <Label>Intolerancia</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Frío" isSelected={formValues.endocrino.intolerancia === "Frío"} onClick={() => handleRadioChange("endocrino", "intolerancia", "Frío")} />
                        <WordButton label="Calor" isSelected={formValues.endocrino.intolerancia === "Calor"} onClick={() => handleRadioChange("endocrino", "intolerancia", "Calor")} />
                        <WordButton label="No" isSelected={formValues.endocrino.intolerancia === "No"} onClick={() => handleRadioChange("endocrino", "intolerancia", "No")} />
                      </div>
                    </div>
                    <div>
                      <Label>Condiciones Endocrinas</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Hipotiroidismo" isSelected={formValues.endocrino.condicionesEndocrinas === "Hipotiroidismo"} onClick={() => handleRadioChange("endocrino", "condicionesEndocrinas", "Hipotiroidismo")} />
                        <WordButton label="Hipertiroidismo" isSelected={formValues.endocrino.condicionesEndocrinas === "Hipertiroidismo"} onClick={() => handleRadioChange("endocrino", "condicionesEndocrinas", "Hipertiroidismo")} />
                        <WordButton label="Ninguno" isSelected={formValues.endocrino.condicionesEndocrinas === "Ninguno"} onClick={() => handleRadioChange("endocrino", "condicionesEndocrinas", "Ninguno")} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SISTEMA TEGUMENTARIO */}
                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-2 text-justify">Sistema Tegumentario</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Cambios en la Coloración de la Piel</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Sí" isSelected={formValues.tegumentario.cambiosColoracion === "Si"} onClick={() => handleRadioChange("tegumentario", "cambiosColoracion", "Si")} />
                        <WordButton label="No" isSelected={formValues.tegumentario.cambiosColoracion === "No"} onClick={() => handleRadioChange("tegumentario", "cambiosColoracion", "No")} />
                      </div>
                    </div>
                    <div>
                      <Label>Síntomas Tegumentarios</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Erupciones" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("Erupciones")} onClick={() => handleCheckboxChange("tegumentario", "sintomasTegumentarios", "Erupciones", !formValues.tegumentario.sintomasTegumentarios.includes("Erupciones"))} />
                        <WordButton label="Prurito" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("Prurito (comezón)")} onClick={() => handleCheckboxChange("tegumentario", "sintomasTegumentarios", "Prurito (comezón)", !formValues.tegumentario.sintomasTegumentarios.includes("Prurito (comezón)"))} />
                        <WordButton label="Hiperhidrosis" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("Hiperhidrosis (sudoración excesiva)")} onClick={() => handleCheckboxChange("tegumentario", "sintomasTegumentarios", "Hiperhidrosis (sudoración excesiva)", !formValues.tegumentario.sintomasTegumentarios.includes("Hiperhidrosis (sudoración excesiva)"))} />
                        <WordButton label="Pérdida de Pelo" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("Pérdida de pelo o vello")} onClick={() => handleCheckboxChange("tegumentario", "sintomasTegumentarios", "Pérdida de pelo o vello", !formValues.tegumentario.sintomasTegumentarios.includes("Pérdida de pelo o vello"))} />
                        <WordButton label="Piel Seca" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("Piel seca")} onClick={() => handleCheckboxChange("tegumentario", "sintomasTegumentarios", "Piel seca", !formValues.tegumentario.sintomasTegumentarios.includes("Piel seca"))} />
                        <WordButton label="Ninguno" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("Ninguno")} onClick={() => handleCheckboxChange("tegumentario", "sintomasTegumentarios", "Ninguno", !formValues.tegumentario.sintomasTegumentarios.includes("Ninguno"))} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SISTEMA MÚSCULO-ESQUELÉTICO */}
                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-2 text-justify">Sistema Músculo-Esquelético</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Fracturas o Esguinces</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Sí" isSelected={formValues.musculoEsqueletico.fracturas === "Si"} onClick={() => handleRadioChange("musculoEsqueletico", "fracturas", "Si")} />
                        <WordButton label="No" isSelected={formValues.musculoEsqueletico.fracturas === "No"} onClick={() => handleRadioChange("musculoEsqueletico", "fracturas", "No")} />
                      </div>
                    </div>
                    <div>
                      <Label>Detalles de Fracturas</Label>
                      <input
                        type="text"
                        value={formValues.musculoEsqueletico.detallesFracturas}
                        onChange={(e) => handleTextChange("musculoEsqueletico", "detallesFracturas", e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <Label>Síntomas Musculoesqueléticos</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Deformidad Articular" isSelected={formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Deformidad articular")} onClick={() => handleCheckboxChange("musculoEsqueletico", "sintomasMusculoEsqueleticos", "Deformidad articular", !formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Deformidad articular"))} />
                        <WordButton label="Dolor Articular" isSelected={formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Dolor articular")} onClick={() => handleCheckboxChange("musculoEsqueletico", "sintomasMusculoEsqueleticos", "Dolor articular", !formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Dolor articular"))} />
                        <WordButton label="Limitaciones de Movimiento" isSelected={formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Limitaciones de movimiento")} onClick={() => handleCheckboxChange("musculoEsqueletico", "sintomasMusculoEsqueleticos", "Limitaciones de movimiento", !formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Limitaciones de movimiento"))} />
                        <WordButton label="Ninguno" isSelected={formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Ninguno")} onClick={() => handleCheckboxChange("musculoEsqueletico", "sintomasMusculoEsqueleticos", "Ninguno", !formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Ninguno"))} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SISTEMA NERVIOSO */}
                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-2 text-justify">Sistema Nervioso</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Percepción de los Sentidos</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Sí" isSelected={formValues.nervioso.percepcionSentidos === "Si"} onClick={() => handleRadioChange("nervioso", "percepcionSentidos", "Si")} />
                        <WordButton label="No" isSelected={formValues.nervioso.percepcionSentidos === "No"} onClick={() => handleRadioChange("nervioso", "percepcionSentidos", "No")} />
                      </div>
                    </div>
                    <div>
                      <Label>Horas de Sueño</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Menos de 4" isSelected={formValues.nervioso.horasSueno === "Menos de 4"} onClick={() => handleRadioChange("nervioso", "horasSueno", "Menos de 4")} />
                        <WordButton label="4 a 6" isSelected={formValues.nervioso.horasSueno === "4 a 6"} onClick={() => handleRadioChange("nervioso", "horasSueno", "4 a 6")} />
                        <WordButton label="7 a 8" isSelected={formValues.nervioso.horasSueno === "7 a 8"} onClick={() => handleRadioChange("nervioso", "horasSueno", "7 a 8")} />
                        <WordButton label="Más de 8" isSelected={formValues.nervioso.horasSueno === "Más de 8"} onClick={() => handleRadioChange("nervioso", "horasSueno", "Más de 8")} />
                      </div>
                    </div>
                    <div>
                      <Label>Trastornos del Sueño</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Sí" isSelected={formValues.nervioso.trastornosSueno === "Si"} onClick={() => handleRadioChange("nervioso", "trastornosSueno", "Si")} />
                        <WordButton label="No" isSelected={formValues.nervioso.trastornosSueno === "No"} onClick={() => handleRadioChange("nervioso", "trastornosSueno", "No")} />
                      </div>
                    </div>
                    <div>
                      <Label>Estado de Ánimo</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Tranquilo" isSelected={formValues.nervioso.estadoAnimo === "Tranquilo"} onClick={() => handleRadioChange("nervioso", "estadoAnimo", "Tranquilo")} />
                        <WordButton label="Irritable" isSelected={formValues.nervioso.estadoAnimo === "Irritable"} onClick={() => handleRadioChange("nervioso", "estadoAnimo", "Irritable")} />
                        <WordButton label="Aprensivo" isSelected={formValues.nervioso.estadoAnimo === "Aprensivo"} onClick={() => handleRadioChange("nervioso", "estadoAnimo", "Aprensivo")} />
                        <WordButton label="Alegre" isSelected={formValues.nervioso.estadoAnimo === "Alegre"} onClick={() => handleRadioChange("nervioso", "estadoAnimo", "Alegre")} />
                      </div>
                    </div>
                    <div>
                      <Label>Parestesias</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Sí" isSelected={formValues.nervioso.parestesias === "Si"} onClick={() => handleRadioChange("nervioso", "parestesias", "Si")} />
                        <WordButton label="No" isSelected={formValues.nervioso.parestesias === "No"} onClick={() => handleRadioChange("nervioso", "parestesias", "No")} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <Button onClick={generateAndUpdateRedacciones} className="bg-blue-500 hover:bg-blue-600 text-white">
                    Generar Redacción IA
                  </Button>
                  <Button onClick={() => {
                    setFormValues({
                      digestivo: {
                        alimentacion: "",
                        masticacion: "",
                        percepcionGusto: "",
                        salivacion: "",
                        deglusion: "",
                        halitosis: "",
                        sintomasDigestivos: [],
                        frecuenciaEvacuacion: ""
                      },
                      respiratorio: {
                        tipoRespiracion: "",
                        sintomasRespiratorios: []
                      },
                      cardiovascular: {
                        dolorPecho: "",
                        lipotimia: "",
                        ritmoCardiaco: "",
                        sintomasCardiovasculares: []
                      },
                      genitoUrinario: {
                        frecuenciaUrinaria: "",
                        sintomasUrinarios: [],
                        ultimaMenstruacion: "",
                        dismenorrea: "",
                        ultimoParto: "",
                        antecedentesObstetricos: ""
                      },
                      endocrino: {
                        sintomasEndocrinos: [],
                        cambiosPeso: "",
                        intolerancia: "",
                        condicionesEndocrinas: ""
                      },
                      tegumentario: {
                        cambiosColoracion: "",
                        sintomasTegumentarios: []
                      },
                      musculoEsqueletico: {
                        fracturas: "",
                        detallesFracturas: "",
                        sintomasMusculoEsqueleticos: []
                      },
                      nervioso: {
                        percepcionSentidos: "",
                        horasSueno: "",
                        trastornosSueno: "",
                        estadoAnimo: "",
                        parestesias: ""
                      }
                    });
                    setShowForm(true);
                  }} variant="outline" className="ml-4 flex items-center gap-2">
                    <Eraser className="w-4 h-4" />
                    Limpiar formulario
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Redacción IA */}
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">Aparato Digestivo</h4>
                    <button onClick={() => handleCopy('digestivo')} className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                      {copied.digestivo ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <AnimatedTextarea
                    content={redacciones.digestivo}
                    className="min-h-[150px] bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-300 dark:border-gray-600 w-full resize-none text-sm"
                    readOnly
                    textAlign="justify"
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">Aparato Respiratorio</h4>
                    <button onClick={() => handleCopy('respiratorio')} className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                      {copied.respiratorio ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <AnimatedTextarea
                    content={redacciones.respiratorio}
                    className="min-h-[150px] bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-300 dark:border-gray-600 w-full resize-none text-sm"
                    readOnly
                    textAlign="justify"
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">Aparato Cardiovascular</h4>
                    <button onClick={() => handleCopy('cardiovascular')} className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                      {copied.cardiovascular ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <AnimatedTextarea
                    content={redacciones.cardiovascular}
                    className="min-h-[150px] bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-300 dark:border-gray-600 w-full resize-none text-sm"
                    readOnly
                    textAlign="justify"
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">Aparato Genito-Urinario</h4>
                    <button onClick={() => handleCopy('genitoUrinario')} className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                      {copied.genitoUrinario ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <AnimatedTextarea
                    content={redacciones.genitoUrinario}
                    className="min-h-[150px] bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-300 dark:border-gray-600 w-full resize-none text-sm"
                    readOnly
                    textAlign="justify"
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">Sistema Endocrino</h4>
                    <button onClick={() => handleCopy('endocrino')} className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                      {copied.endocrino ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <AnimatedTextarea
                    content={redacciones.endocrino}
                    className="min-h-[150px] bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-300 dark:border-gray-600 w-full resize-none text-sm"
                    readOnly
                    textAlign="justify"
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">Sistema Tegumentario</h4>
                    <button onClick={() => handleCopy('tegumentario')} className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                      {copied.tegumentario ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <AnimatedTextarea
                    content={redacciones.tegumentario}
                    className="min-h-[150px] bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-300 dark:border-gray-600 w-full resize-none text-sm"
                    readOnly
                    textAlign="justify"
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">Sistema Músculo-Esquelético</h4>
                    <button onClick={() => handleCopy('musculoEsqueletico')} className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                      {copied.musculoEsqueletico ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <AnimatedTextarea
                    content={redacciones.musculoEsqueletico}
                    className="min-h-[150px] bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-300 dark:border-gray-600 w-full resize-none text-sm"
                    readOnly
                    textAlign="justify"
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">Sistema Nervioso</h4>
                    <button onClick={() => handleCopy('nervioso')} className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                      {copied.nervioso ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <AnimatedTextarea
                    content={redacciones.nervioso}
                    className="min-h-[150px] bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-300 dark:border-gray-600 w-full resize-none text-sm"
                    readOnly
                    textAlign="justify"
                  />
                </div>

                <div className="flex justify-center">
                  <Button onClick={() => setShowForm(true)} variant="outline" className="text-blue-500 border-blue-500">
                    Volver al Formulario
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

// Componente WordButton para reemplazar los checkboxes
const WordButton = ({
  label,
  isSelected,
  onClick
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return <button onClick={onClick} className={`px-2 py-1 text-xs rounded-md transition-colors mb-1 mr-1 ${isSelected ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
      {label}
    </button>;
};

export default InterrogatorioSistemas;
