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
    const digestivoText = formValues.digestivo.alimentacion || formValues.digestivo.masticacion || formValues.digestivo.percepcionGusto || formValues.digestivo.salivacion || formValues.digestivo.deglusion || formValues.digestivo.halitosis || formValues.digestivo.sintomasDigestivos.length > 0 || formValues.digestivo.frecuenciaEvacuacion
      ? `El paciente sigue una dieta de tipo ${formValues.digestivo.alimentacion || "[sin especificar]"}. Su patrón de masticación es ${formValues.digestivo.masticacion || "[sin especificar]"}. Manifiesta ${getPercepcionGustoText()}. La salivación es ${formValues.digestivo.salivacion || "[sin especificar]"}. Respecto a la deglución, ${getDeglusiónText()}. ${formValues.digestivo.halitosis === "si" ? "Presenta" : "No presenta"} halitosis. Ha experimentado los siguientes síntomas digestivos: ${formValues.digestivo.sintomasDigestivos.length > 0 ? formValues.digestivo.sintomasDigestivos.join(", ") : "ninguno"}. Realiza ${formValues.digestivo.frecuenciaEvacuacion || "[sin especificar]"} evacuaciones diarias.`
      : "No se reportaron alteraciones en el aparato digestivo.";

    const respiratorioText = formValues.respiratorio.tipoRespiracion || formValues.respiratorio.sintomasRespiratorios.length > 0
      ? `El tipo de respiración habitual es ${formValues.respiratorio.tipoRespiracion || "[sin especificar]"}. Presenta síntomas respiratorios como: ${formValues.respiratorio.sintomasRespiratorios.length > 0 ? formValues.respiratorio.sintomasRespiratorios.join(", ") : "ninguno"}.`
      : "No se reportaron alteraciones en el aparato respiratorio.";

    const cardiovascularText = formValues.cardiovascular.dolorPecho || formValues.cardiovascular.lipotimia || formValues.cardiovascular.ritmoCardiaco || formValues.cardiovascular.sintomasCardiovasculares.length > 0
      ? `${formValues.cardiovascular.dolorPecho === "no" ? "No refiere" : "Refiere"} dolor precordial${formValues.cardiovascular.dolorPecho === "si" ? " de tipo opresivo con irradiación a cuello, dientes o brazos" : ""}. ${formValues.cardiovascular.lipotimia === "si" ? "Ha presentado" : "No ha presentado"} episodios de lipotimia. El ritmo cardíaco es ${formValues.cardiovascular.ritmoCardiaco || "[sin especificar]"}. Sintomatología cardiovascular reportada: ${formValues.cardiovascular.sintomasCardiovasculares.length > 0 ? formValues.cardiovascular.sintomasCardiovasculares.join(", ") : "ninguna"}.`
      : "No se reportaron alteraciones en el aparato cardiovascular.";

    const genitoUrinarioText = formValues.genitoUrinario.frecuenciaUrinaria || formValues.genitoUrinario.sintomasUrinarios.length > 0 || formValues.genitoUrinario.ultimaMenstruacion || formValues.genitoUrinario.dismenorrea || formValues.genitoUrinario.ultimoParto || formValues.genitoUrinario.antecedentesObstetricos
      ? `El paciente refiere una frecuencia urinaria de ${formValues.genitoUrinario.frecuenciaUrinaria || "[sin especificar]"} veces al día. Síntomas urinarios presentes: ${formValues.genitoUrinario.sintomasUrinarios.length > 0 ? formValues.genitoUrinario.sintomasUrinarios.join(", ") : "ninguno"}. ${formValues.genitoUrinario.ultimaMenstruacion ? `En pacientes mujeres: Fecha de última menstruación: ${formValues.genitoUrinario.ultimaMenstruacion}. Dismenorrea: ${formValues.genitoUrinario.dismenorrea || "[sin especificar]"}. Último parto: ${formValues.genitoUrinario.ultimoParto || "[sin especificar]"}. Antecedentes obstétricos: ${formValues.genitoUrinario.antecedentesObstetricos || "[sin especificar]"}` : ""}`
      : "No se reportaron alteraciones en el aparato genito-urinario.";

    const endocrinoText = formValues.endocrino.sintomasEndocrinos.length > 0 || formValues.endocrino.cambiosPeso || formValues.endocrino.intolerancia || formValues.endocrino.condicionesEndocrinas
      ? `El paciente refiere los siguientes síntomas endocrinos: ${formValues.endocrino.sintomasEndocrinos.length > 0 ? formValues.endocrino.sintomasEndocrinos.join(", ") : "ninguno"}. Reporta ${getCambiosPesoText()}. ${getIntoleranciaText()}. Antecedentes patológicos conocidos: ${formValues.endocrino.condicionesEndocrinas || "ninguno"}.`
      : "No se reportaron alteraciones en el sistema endocrino.";

    const tegumentarioText = formValues.tegumentario.cambiosColoracion || formValues.tegumentario.sintomasTegumentarios.length > 0
      ? `${formValues.tegumentario.cambiosColoracion === "si" ? "Ha" : "No ha"} notado cambios en la coloración de la piel. Otros síntomas presentes: ${formValues.tegumentario.sintomasTegumentarios.length > 0 ? formValues.tegumentario.sintomasTegumentarios.join(", ") : "ninguno"}.`
      : "No se reportaron alteraciones en el sistema tegumentario.";

    const musculoEsqueleticoText = formValues.musculoEsqueletico.fracturas || formValues.musculoEsqueletico.detallesFracturas || formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.length > 0
      ? `${formValues.musculoEsqueletico.fracturas === "no" ? "No ha presentado" : "Ha presentado"} fracturas o esguinces. ${formValues.musculoEsqueletico.fracturas === "si" ? `En caso afirmativo, se registran: ${formValues.musculoEsqueletico.detallesFracturas || "[sin especificar]"}.` : ""} Sintomatología musculoesquelética actual: ${formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.length > 0 ? formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.join(", ") : "ninguna"}.`
      : "No se reportaron alteraciones en el sistema musculoesquelético.";

    const nerviosoText = formValues.nervioso.percepcionSentidos || formValues.nervioso.horasSueno || formValues.nervioso.trastornosSueno || formValues.nervioso.estadoAnimo || formValues.nervioso.parestesias
      ? `${formValues.nervioso.percepcionSentidos === "si" ? "Percibe" : "No percibe"} adecuadamente a través de los órganos de los sentidos. El patrón de sueño habitual es de ${formValues.nervioso.horasSueno || "[sin especificar]"} horas por noche. ${formValues.nervioso.trastornosSueno === "si" ? "Presenta" : "No presenta"} trastornos del sueño. Su carácter habitual se describe como ${formValues.nervioso.estadoAnimo || "[sin especificar]"}. ${formValues.nervioso.parestesias === "si" ? "Presenta" : "No presenta"} parestesias (hormigueos, adormecimiento o pérdida de sensibilidad).`
      : "No se reportaron alteraciones en el sistema nervioso.";

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

    // Cambiar al apartado de redacción IA y hacer auto scroll
    setShowForm(false);
    setTimeout(() => {
      redaccionesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const getPercepcionGustoText = () => {
    switch (formValues.digestivo.percepcionGusto) {
      case "normal":
        return "no percibir alteraciones del gusto";
      case "disminucion":
        return "hipogeusia";
      case "alterados":
        return "disgeusia (sabores metálicos, amargos, etc.)";
      default:
        return "[sin especificar]";
    }
  };

  const getDeglusiónText = () => {
    switch (formValues.digestivo.deglusion) {
      case "no":
        return "no refiere dificultad";
      case "dificultad":
        return "presenta dificultad sin dolor";
      case "dolor":
        return "presenta odinofagia";
      default:
        return "[sin especificar]";
    }
  };

  const getCambiosPesoText = () => {
    switch (formValues.endocrino.cambiosPeso) {
      case "perdida":
        return "pérdida de peso sin causa aparente";
      case "aumento":
        return "aumento de peso sin causa aparente";
      case "no":
        return "sin cambios de peso";
      default:
        return "[sin especificar]";
    }
  };

  const getIntoleranciaText = () => {
    if (formValues.endocrino.intolerancia === "no") {
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
                        <WordButton label="Blanda" isSelected={formValues.digestivo.alimentacion === "blanda"} onClick={() => handleRadioChange("digestivo", "alimentacion", "blanda")} />
                        <WordButton label="Fibrosa" isSelected={formValues.digestivo.alimentacion === "fibrosa"} onClick={() => handleRadioChange("digestivo", "alimentacion", "fibrosa")} />
                        <WordButton label="Combinada" isSelected={formValues.digestivo.alimentacion === "combinada"} onClick={() => handleRadioChange("digestivo", "alimentacion", "combinada")} />
                      </div>
                    </div>
                    <div>
                      <Label>Patrón de Masticación</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Unilateral" isSelected={formValues.digestivo.masticacion === "unilateral"} onClick={() => handleRadioChange("digestivo", "masticacion", "unilateral")} />
                        <WordButton label="Bilateral" isSelected={formValues.digestivo.masticacion === "bilateral"} onClick={() => handleRadioChange("digestivo", "masticacion", "bilateral")} />
                        <WordButton label="Anterior" isSelected={formValues.digestivo.masticacion === "anterior"} onClick={() => handleRadioChange("digestivo", "masticacion", "anterior")} />
                      </div>
                    </div>
                    <div>
                      <Label>Percepción del Gusto</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Normal" isSelected={formValues.digestivo.percepcionGusto === "normal"} onClick={() => handleRadioChange("digestivo", "percepcionGusto", "normal")} />
                        <WordButton label="Disminución" isSelected={formValues.digestivo.percepcionGusto === "disminucion"} onClick={() => handleRadioChange("digestivo", "percepcionGusto", "disminucion")} />
                        <WordButton label="Alterados" isSelected={formValues.digestivo.percepcionGusto === "alterados"} onClick={() => handleRadioChange("digestivo", "percepcionGusto", "alterados")} />
                      </div>
                    </div>
                    <div>
                      <Label>Salivación</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Normal" isSelected={formValues.digestivo.salivacion === "normal"} onClick={() => handleRadioChange("digestivo", "salivacion", "normal")} />
                        <WordButton label="Aumentada" isSelected={formValues.digestivo.salivacion === "aumentada"} onClick={() => handleRadioChange("digestivo", "salivacion", "aumentada")} />
                        <WordButton label="Disminuida" isSelected={formValues.digestivo.salivacion === "disminuida"} onClick={() => handleRadioChange("digestivo", "salivacion", "disminuida")} />
                      </div>
                    </div>
                    <div>
                      <Label>Dificultad o Dolor al Tragar</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="No" isSelected={formValues.digestivo.deglusion === "no"} onClick={() => handleRadioChange("digestivo", "deglusion", "no")} />
                        <WordButton label="Dificultad" isSelected={formValues.digestivo.deglusion === "dificultad"} onClick={() => handleRadioChange("digestivo", "deglusion", "dificultad")} />
                        <WordButton label="Dolor" isSelected={formValues.digestivo.deglusion === "dolor"} onClick={() => handleRadioChange("digestivo", "deglusion", "dolor")} />
                      </div>
                    </div>
                    <div>
                      <Label>Halitosis</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Sí" isSelected={formValues.digestivo.halitosis === "si"} onClick={() => handleRadioChange("digestivo", "halitosis", "si")} />
                        <WordButton label="No" isSelected={formValues.digestivo.halitosis === "no"} onClick={() => handleRadioChange("digestivo", "halitosis", "no")} />
                      </div>
                    </div>
                    <div>
                      <Label>Síntomas Digestivos</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Distensión Abdominal" isSelected={formValues.digestivo.sintomasDigestivos.includes("distensión abdominal")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "distensión abdominal", !formValues.digestivo.sintomasDigestivos.includes("distensión abdominal"))} />
                        <WordButton label="Estreñimiento" isSelected={formValues.digestivo.sintomasDigestivos.includes("estreñimiento")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "estreñimiento", !formValues.digestivo.sintomasDigestivos.includes("estreñimiento"))} />
                        <WordButton label="Plenitud Posprandial" isSelected={formValues.digestivo.sintomasDigestivos.includes("sensación de llenura después de comer")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "sensación de llenura después de comer", !formValues.digestivo.sintomasDigestivos.includes("sensación de llenura después de comer"))} />
                        <WordButton label="Pirosis" isSelected={formValues.digestivo.sintomasDigestivos.includes("acidez (pirosis)")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "acidez (pirosis)", !formValues.digestivo.sintomasDigestivos.includes("acidez (pirosis)"))} />
                        <WordButton label="Dolor Abdominal" isSelected={formValues.digestivo.sintomasDigestivos.includes("dolor abdominal")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "dolor abdominal", !formValues.digestivo.sintomasDigestivos.includes("dolor abdominal"))} />
                        <WordButton label="Náusea" isSelected={formValues.digestivo.sintomasDigestivos.includes("náuseas")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "náuseas", !formValues.digestivo.sintomasDigestivos.includes("náuseas"))} />
                        <WordButton label="Vómito" isSelected={formValues.digestivo.sintomasDigestivos.includes("vómitos")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "vómitos", !formValues.digestivo.sintomasDigestivos.includes("vómitos"))} />
                        <WordButton label="Reflujo" isSelected={formValues.digestivo.sintomasDigestivos.includes("reflujo")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "reflujo", !formValues.digestivo.sintomasDigestivos.includes("reflujo"))} />
                        <WordButton label="Ninguno" isSelected={formValues.digestivo.sintomasDigestivos.includes("ninguno")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "ninguno", !formValues.digestivo.sintomasDigestivos.includes("ninguno"))} />
                      </div>
                    </div>
                    <div>
                      <Label>Frecuencia de Evacuación</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Menos de 1 vez al día" isSelected={formValues.digestivo.frecuenciaEvacuacion === "menos de una vez al día"} onClick={() => handleRadioChange("digestivo", "frecuenciaEvacuacion", "menos de una vez al día")} />
                        <WordButton label="1 a 2 veces" isSelected={formValues.digestivo.frecuenciaEvacuacion === "1 a 2 veces"} onClick={() => handleRadioChange("digestivo", "frecuenciaEvacuacion", "1 a 2 veces")} />
                        <WordButton label="Más de 2 veces" isSelected={formValues.digestivo.frecuenciaEvacuacion === "más de 2 veces"} onClick={() => handleRadioChange("digestivo", "frecuenciaEvacuacion", "más de 2 veces")} />
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
                        <WordButton label="Nasal" isSelected={formValues.respiratorio.tipoRespiracion === "nasal"} onClick={() => handleRadioChange("respiratorio", "tipoRespiracion", "nasal")} />
                        <WordButton label="Bucal" isSelected={formValues.respiratorio.tipoRespiracion === "bucal"} onClick={() => handleRadioChange("respiratorio", "tipoRespiracion", "bucal")} />
                        <WordButton label="Combinada" isSelected={formValues.respiratorio.tipoRespiracion === "combinada"} onClick={() => handleRadioChange("respiratorio", "tipoRespiracion", "combinada")} />
                      </div>
                    </div>
                    <div>
                      <Label>Síntomas Respiratorios</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Obstrucción Nasal" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("obstrucción nasal")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "obstrucción nasal", !formValues.respiratorio.sintomasRespiratorios.includes("obstrucción nasal"))} />
                        <WordButton label="Rinorrea" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("secreción nasal (rinorrea)")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "secreción nasal (rinorrea)", !formValues.respiratorio.sintomasRespiratorios.includes("secreción nasal (rinorrea)"))} />
                        <WordButton label="Congestión Nasal" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("congestión nasal")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "congestión nasal", !formValues.respiratorio.sintomasRespiratorios.includes("congestión nasal"))} />
                        <WordButton label="Epistaxis" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("sangrado nasal (epistaxis)")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "sangrado nasal (epistaxis)", !formValues.respiratorio.sintomasRespiratorios.includes("sangrado nasal (epistaxis)"))} />
                        <WordButton label="Disnea" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("dificultad para respirar (disnea)")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "dificultad para respirar (disnea)", !formValues.respiratorio.sintomasRespiratorios.includes("dificultad para respirar (disnea)"))} />
                        <WordButton label="Tos" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("tos")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "tos", !formValues.respiratorio.sintomasRespiratorios.includes("tos"))} />
                        <WordButton label="Dolor Torácico" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("dolor en el pecho")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "dolor en el pecho", !formValues.respiratorio.sintomasRespiratorios.includes("dolor en el pecho"))} />
                        <WordButton label="Hernias" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("hernias")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "hernias", !formValues.respiratorio.sintomasRespiratorios.includes("hernias"))} />
                        <WordButton label="Expectoraciones" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("flemas (expectoración)")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "flemas (expectoración)", !formValues.respiratorio.sintomasRespiratorios.includes("flemas (expectoración)"))} />
                        <WordButton label="Secreciones" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("mucosidad")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "mucosidad", !formValues.respiratorio.sintomasRespiratorios.includes("mucosidad"))} />
                        <WordButton label="Cianosis" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("coloración azulada en labios o piel (cianosis)")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "coloración azulada en labios o piel (cianosis)", !formValues.respiratorio.sintomasRespiratorios.includes("coloración azulada en labios o piel (cianosis)"))} />
                        <WordButton label="Ninguno" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("ninguno")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "ninguno", !formValues.respiratorio.sintomasRespiratorios.includes("ninguno"))} />
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
                        <WordButton label="No" isSelected={formValues.cardiovascular.dolorPecho === "no"} onClick={() => handleRadioChange("cardiovascular", "dolorPecho", "no")} />
                        <WordButton label="Sí" isSelected={formValues.cardiovascular.dolorPecho === "si"} onClick={() => handleRadioChange("cardiovascular", "dolorPecho", "si")} />
                      </div>
                    </div>
                    <div>
                      <Label>Lipotimia</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Sí" isSelected={formValues.cardiovascular.lipotimia === "si"} onClick={() => handleRadioChange("cardiovascular", "lipotimia", "si")} />
                        <WordButton label="No" isSelected={formValues.cardiovascular.lipotimia === "no"} onClick={() => handleRadioChange("cardiovascular", "lipotimia", "no")} />
                      </div>
                    </div>
                    <div>
                      <Label>Ritmo Cardíaco</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Normal" isSelected={formValues.cardiovascular.ritmoCardiaco === "normal"} onClick={() => handleRadioChange("cardiovascular", "ritmoCardiaco", "normal")} />
                        <WordButton label="Rápido" isSelected={formValues.cardiovascular.ritmoCardiaco === "rápido"} onClick={() => handleRadioChange("cardiovascular", "ritmoCardiaco", "rápido")} />
                        <WordButton label="Lento" isSelected={formValues.cardiovascular.ritmoCardiaco === "lento"} onClick={() => handleRadioChange("cardiovascular", "ritmoCardiaco", "lento")} />
                      </div>
                    </div>
                    <div>
                      <Label>Síntomas Cardiovasculares</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Mareos" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("mareos")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "mareos", !formValues.cardiovascular.sintomasCardiovasculares.includes("mareos"))} />
                        <WordButton label="Edema" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("hinchazón (edema)")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "hinchazón (edema)", !formValues.cardiovascular.sintomasCardiovasculares.includes("hinchazón (edema)"))} />
                        <WordButton label="Equimosis" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("moretones (equimosis)")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "moretones (equimosis)", !formValues.cardiovascular.sintomasCardiovasculares.includes("moretones (equimosis)"))} />
                        <WordButton label="Várices" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("várices")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "várices", !formValues.cardiovascular.sintomasCardiovasculares.includes("várices"))} />
                        <WordButton label="Cefalea" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("dolor de cabeza (cefalea)")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "dolor de cabeza (cefalea)", !formValues.cardiovascular.sintomasCardiovasculares.includes("dolor de cabeza (cefalea)"))} />
                        <WordButton label="Acúfenos" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("zumbidos en los oídos (acúfenos)")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "zumbidos en los oídos (acúfenos)", !formValues.cardiovascular.sintomasCardiovasculares.includes("zumbidos en los oídos (acúfenos)"))} />
                        <WordButton label="Fosfenos" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("luces al cerrar los ojos (fosfenos)")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "luces al cerrar los ojos (fosfenos)", !formValues.cardiovascular.sintomasCardiovasculares.includes("luces al cerrar los ojos (fosfenos)"))} />
                        <WordButton label="Palpitaciones" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("palpitaciones")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "palpitaciones", !formValues.cardiovascular.sintomasCardiovasculares.includes("palpitaciones"))} />
                        <WordButton label="Ninguno" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("ninguno")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "ninguno", !formValues.cardiovascular.sintomasCardiovasculares.includes("ninguno"))} />
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
                        <WordButton label="Menos de 3 veces" isSelected={formValues.genitoUrinario.frecuenciaUrinaria === "menos de 3"} onClick={() => handleRadioChange("genitoUrinario", "frecuenciaUrinaria", "menos de 3")} />
                        <WordButton label="3 a 6 veces" isSelected={formValues.genitoUrinario.frecuenciaUrinaria === "3 a 6"} onClick={() => handleRadioChange("genitoUrinario", "frecuenciaUrinaria", "3 a 6")} />
                        <WordButton label="Más de 6 veces" isSelected={formValues.genitoUrinario.frecuenciaUrinaria === "más de 6"} onClick={() => handleRadioChange("genitoUrinario", "frecuenciaUrinaria", "más de 6")} />
                      </div>
                    </div>
                    <div>
                      <Label>Síntomas Urinarios</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Incontinencia" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("incontinencia")} onClick={() => handleCheckboxChange("genitoUrinario", "sintomasUrinarios", "incontinencia", !formValues.genitoUrinario.sintomasUrinarios.includes("incontinencia"))} />
                        <WordButton label="Disuria" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("dolor al orinar (disuria)")} onClick={() => handleCheckboxChange("genitoUrinario", "sintomasUrinarios", "dolor al orinar (disuria)", !formValues.genitoUrinario.sintomasUrinarios.includes("dolor al orinar (disuria)"))} />
                        <WordButton label="Hematuria" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("sangre en orina (hematuria)")} onClick={() => handleCheckboxChange("genitoUrinario", "sintomasUrinarios", "sangre en orina (hematuria)", !formValues.genitoUrinario.sintomasUrinarios.includes("sangre en orina (hematuria)"))} />
                        <WordButton label="Poliuria" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("orina en exceso (poliuria)")} onClick={() => handleCheckboxChange("genitoUrinario", "sintomasUrinarios", "orina en exceso (poliuria)", !formValues.genitoUrinario.sintomasUrinarios.includes("orina en exceso (poliuria)"))} />
                        <WordButton label="Nicturia" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("orinar de noche (nicturia)")} onClick={() => handleCheckboxChange("genitoUrinario", "sintomasUrinarios", "orinar de noche (nicturia)", !formValues.genitoUrinario.sintomasUrinarios.includes("orinar de noche (nicturia)"))} />
                        <WordButton label="Dolor Lumbar" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("dolor lumbar")} onClick={() => handleCheckboxChange("genitoUrinario", "sintomasUrinarios", "dolor lumbar", !formValues.genitoUrinario.sintomasUrinarios.includes("dolor lumbar"))} />
                        <WordButton label="Ninguno" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("ninguno")} onClick={() => handleCheckboxChange("genitoUrinario", "sintomasUrinarios", "ninguno", !formValues.genitoUrinario.sintomasUrinarios.includes("ninguno"))} />
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
                        <WordButton label="Sí" isSelected={formValues.genitoUrinario.dismenorrea === "si"} onClick={() => handleRadioChange("genitoUrinario", "dismenorrea", "si")} />
                        <WordButton label="No" isSelected={formValues.genitoUrinario.dismenorrea === "no"} onClick={() => handleRadioChange("genitoUrinario", "dismenorrea", "no")} />
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
                        <WordButton label="Ninguno" isSelected={formValues.genitoUrinario.antecedentesObstetricos === "ninguno"} onClick={() => handleRadioChange("genitoUrinario", "antecedentesObstetricos", "ninguno")} />
                        <WordButton label="Abortos" isSelected={formValues.genitoUrinario.antecedentesObstetricos === "abortos"} onClick={() => handleRadioChange("genitoUrinario", "antecedentesObstetricos", "abortos")} />
                        <WordButton label="Cesáreas" isSelected={formValues.genitoUrinario.antecedentesObstetricos === "cesáreas"} onClick={() => handleRadioChange("genitoUrinario", "antecedentesObstetricos", "cesáreas")} />
                        <WordButton label="Ambos" isSelected={formValues.genitoUrinario.antecedentesObstetricos === "ambos"} onClick={() => handleRadioChange("genitoUrinario", "antecedentesObstetricos", "ambos")} />
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
                        <WordButton label="Poliuria" isSelected={formValues.endocrino.sintomasEndocrinos.includes("poliuria")} onClick={() => handleCheckboxChange("endocrino", "sintomasEndocrinos", "poliuria", !formValues.endocrino.sintomasEndocrinos.includes("poliuria"))} />
                        <WordButton label="Polidipsia" isSelected={formValues.endocrino.sintomasEndocrinos.includes("polidipsia")} onClick={() => handleCheckboxChange("endocrino", "sintomasEndocrinos", "polidipsia", !formValues.endocrino.sintomasEndocrinos.includes("polidipsia"))} />
                        <WordButton label="Polifagia" isSelected={formValues.endocrino.sintomasEndocrinos.includes("polifagia")} onClick={() => handleCheckboxChange("endocrino", "sintomasEndocrinos", "polifagia", !formValues.endocrino.sintomasEndocrinos.includes("polifagia"))} />
                        <WordButton label="Exoftalmos" isSelected={formValues.endocrino.sintomasEndocrinos.includes("exoftalmos (ojos saltones)")} onClick={() => handleCheckboxChange("endocrino", "sintomasEndocrinos", "exoftalmos (ojos saltones)", !formValues.endocrino.sintomasEndocrinos.includes("exoftalmos (ojos saltones)"))} />
                        <WordButton label="Nerviosismo" isSelected={formValues.endocrino.sintomasEndocrinos.includes("nerviosismo")} onClick={() => handleCheckboxChange("endocrino", "sintomasEndocrinos", "nerviosismo", !formValues.endocrino.sintomasEndocrinos.includes("nerviosismo"))} />
                        <WordButton label="Temblores" isSelected={formValues.endocrino.sintomasEndocrinos.includes("temblores")} onClick={() => handleCheckboxChange("endocrino", "sintomasEndocrinos", "temblores", !formValues.endocrino.sintomasEndocrinos.includes("temblores"))} />
                        <WordButton label="Insomnio" isSelected={formValues.endocrino.sintomasEndocrinos.includes("insomnio")} onClick={() => handleCheckboxChange("endocrino", "sintomasEndocrinos", "insomnio", !formValues.endocrino.sintomasEndocrinos.includes("insomnio"))} />
                        <WordButton label="Ninguno" isSelected={formValues.endocrino.sintomasEndocrinos.includes("ninguno")} onClick={() => handleCheckboxChange("endocrino", "sintomasEndocrinos", "ninguno", !formValues.endocrino.sintomasEndocrinos.includes("ninguno"))} />
                      </div>
                    </div>
                    <div>
                      <Label>Cambios de Peso</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Pérdida" isSelected={formValues.endocrino.cambiosPeso === "perdida"} onClick={() => handleRadioChange("endocrino", "cambiosPeso", "perdida")} />
                        <WordButton label="Aumento" isSelected={formValues.endocrino.cambiosPeso === "aumento"} onClick={() => handleRadioChange("endocrino", "cambiosPeso", "aumento")} />
                        <WordButton label="No" isSelected={formValues.endocrino.cambiosPeso === "no"} onClick={() => handleRadioChange("endocrino", "cambiosPeso", "no")} />
                      </div>
                    </div>
                    <div>
                      <Label>Intolerancia</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Frío" isSelected={formValues.endocrino.intolerancia === "frío"} onClick={() => handleRadioChange("endocrino", "intolerancia", "frío")} />
                        <WordButton label="Calor" isSelected={formValues.endocrino.intolerancia === "calor"} onClick={() => handleRadioChange("endocrino", "intolerancia", "calor")} />
                        <WordButton label="No" isSelected={formValues.endocrino.intolerancia === "no"} onClick={() => handleRadioChange("endocrino", "intolerancia", "no")} />
                      </div>
                    </div>
                    <div>
                      <Label>Condiciones Endocrinas</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Hipotiroidismo" isSelected={formValues.endocrino.condicionesEndocrinas === "hipotiroidismo"} onClick={() => handleRadioChange("endocrino", "condicionesEndocrinas", "hipotiroidismo")} />
                        <WordButton label="Hipertiroidismo" isSelected={formValues.endocrino.condicionesEndocrinas === "hipertiroidismo"} onClick={() => handleRadioChange("endocrino", "condicionesEndocrinas", "hipertiroidismo")} />
                        <WordButton label="Ninguno" isSelected={formValues.endocrino.condicionesEndocrinas === "ninguno"} onClick={() => handleRadioChange("endocrino", "condicionesEndocrinas", "ninguno")} />
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
                        <WordButton label="Sí" isSelected={formValues.tegumentario.cambiosColoracion === "si"} onClick={() => handleRadioChange("tegumentario", "cambiosColoracion", "si")} />
                        <WordButton label="No" isSelected={formValues.tegumentario.cambiosColoracion === "no"} onClick={() => handleRadioChange("tegumentario", "cambiosColoracion", "no")} />
                      </div>
                    </div>
                    <div>
                      <Label>Síntomas Tegumentarios</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Erupciones" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("erupciones")} onClick={() => handleCheckboxChange("tegumentario", "sintomasTegumentarios", "erupciones", !formValues.tegumentario.sintomasTegumentarios.includes("erupciones"))} />
                        <WordButton label="Prurito" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("prurito (comezón)")} onClick={() => handleCheckboxChange("tegumentario", "sintomasTegumentarios", "prurito (comezón)", !formValues.tegumentario.sintomasTegumentarios.includes("prurito (comezón)"))} />
                        <WordButton label="Hiperhidrosis" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("hiperhidrosis (sudoración excesiva)")} onClick={() => handleCheckboxChange("tegumentario", "sintomasTegumentarios", "hiperhidrosis (sudoración excesiva)", !formValues.tegumentario.sintomasTegumentarios.includes("hiperhidrosis (sudoración excesiva)"))} />
                        <WordButton label="Pérdida de Pelo" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("pérdida de pelo o vello")} onClick={() => handleCheckboxChange("tegumentario", "sintomasTegumentarios", "pérdida de pelo o vello", !formValues.tegumentario.sintomasTegumentarios.includes("pérdida de pelo o vello"))} />
                        <WordButton label="Piel Seca" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("piel seca")} onClick={() => handleCheckboxChange("tegumentario", "sintomasTegumentarios", "piel seca", !formValues.tegumentario.sintomasTegumentarios.includes("piel seca"))} />
                        <WordButton label="Ninguno" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("ninguno")} onClick={() => handleCheckboxChange("tegumentario", "sintomasTegumentarios", "ninguno", !formValues.tegumentario.sintomasTegumentarios.includes("ninguno"))} />
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
                        <WordButton label="Sí" isSelected={formValues.musculoEsqueletico.fracturas === "si"} onClick={() => handleRadioChange("musculoEsqueletico", "fracturas", "si")} />
                        <WordButton label="No" isSelected={formValues.musculoEsqueletico.fracturas === "no"} onClick={() => handleRadioChange("musculoEsqueletico", "fracturas", "no")} />
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
                        <WordButton label="Deformidad Articular" isSelected={formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("deformidad articular")} onClick={() => handleCheckboxChange("musculoEsqueletico", "sintomasMusculoEsqueleticos", "deformidad articular", !formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("deformidad articular"))} />
                        <WordButton label="Dolor Articular" isSelected={formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("dolor articular")} onClick={() => handleCheckboxChange("musculoEsqueletico", "sintomasMusculoEsqueleticos", "dolor articular", !formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("dolor articular"))} />
                        <WordButton label="Limitaciones de Movimiento" isSelected={formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("limitaciones de movimiento")} onClick={() => handleCheckboxChange("musculoEsqueletico", "sintomasMusculoEsqueleticos", "limitaciones de movimiento", !formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("limitaciones de movimiento"))} />
                        <WordButton label="Ninguno" isSelected={formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("ninguno")} onClick={() => handleCheckboxChange("musculoEsqueletico", "sintomasMusculoEsqueleticos", "ninguno", !formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("ninguno"))} />
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
                        <WordButton label="Sí" isSelected={formValues.nervioso.percepcionSentidos === "si"} onClick={() => handleRadioChange("nervioso", "percepcionSentidos", "si")} />
                        <WordButton label="No" isSelected={formValues.nervioso.percepcionSentidos === "no"} onClick={() => handleRadioChange("nervioso", "percepcionSentidos", "no")} />
                      </div>
                    </div>
                    <div>
                      <Label>Horas de Sueño</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Menos de 4" isSelected={formValues.nervioso.horasSueno === "menos de 4"} onClick={() => handleRadioChange("nervioso", "horasSueno", "menos de 4")} />
                        <WordButton label="4 a 6" isSelected={formValues.nervioso.horasSueno === "4 a 6"} onClick={() => handleRadioChange("nervioso", "horasSueno", "4 a 6")} />
                        <WordButton label="7 a 8" isSelected={formValues.nervioso.horasSueno === "7 a 8"} onClick={() => handleRadioChange("nervioso", "horasSueno", "7 a 8")} />
                        <WordButton label="Más de 8" isSelected={formValues.nervioso.horasSueno === "más de 8"} onClick={() => handleRadioChange("nervioso", "horasSueno", "más de 8")} />
                      </div>
                    </div>
                    <div>
                      <Label>Trastornos del Sueño</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Sí" isSelected={formValues.nervioso.trastornosSueno === "si"} onClick={() => handleRadioChange("nervioso", "trastornosSueno", "si")} />
                        <WordButton label="No" isSelected={formValues.nervioso.trastornosSueno === "no"} onClick={() => handleRadioChange("nervioso", "trastornosSueno", "no")} />
                      </div>
                    </div>
                    <div>
                      <Label>Estado de Ánimo</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Tranquilo" isSelected={formValues.nervioso.estadoAnimo === "tranquilo"} onClick={() => handleRadioChange("nervioso", "estadoAnimo", "tranquilo")} />
                        <WordButton label="Irritable" isSelected={formValues.nervioso.estadoAnimo === "irritable"} onClick={() => handleRadioChange("nervioso", "estadoAnimo", "irritable")} />
                        <WordButton label="Aprensivo" isSelected={formValues.nervioso.estadoAnimo === "aprensivo"} onClick={() => handleRadioChange("nervioso", "estadoAnimo", "aprensivo")} />
                        <WordButton label="Alegre" isSelected={formValues.nervioso.estadoAnimo === "alegre"} onClick={() => handleRadioChange("nervioso", "estadoAnimo", "alegre")} />
                      </div>
                    </div>
                    <div>
                      <Label>Parestesias</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Sí" isSelected={formValues.nervioso.parestesias === "si"} onClick={() => handleRadioChange("nervioso", "parestesias", "si")} />
                        <WordButton label="No" isSelected={formValues.nervioso.parestesias === "no"} onClick={() => handleRadioChange("nervioso", "parestesias", "no")} />
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
