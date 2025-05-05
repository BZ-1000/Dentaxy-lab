import React, { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X, Copy, CheckCircle, Eraser } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica'; // Asegúrate que esta ruta sea correcta
import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox"; // No se usa directamente si solo usas WordButton para checkboxes
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AnimatedTextarea } from "@/components/ui/animated-textarea"; // Asegúrate que esta ruta sea correcta

interface InterrogatorioSistemasProps {
  formData: FormDataState;
  handleInterrogatorioChange: (system: string, value: string) => void;
}

const InterrogatorioSistemas: React.FC<InterrogatorioSistemasProps> = ({
  formData, // formData no se usa directamente en este componente, considera si es necesario
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
      percepcionGustoEspecificaciones: "",
      salivacion: "",
      deglusion: "",
      halitosis: "",
      halitosisEspecificaciones: "",
      sintomasDigestivos: [] as string[],
      cambiosApetito: "",
      habitosAlimenticios: "", // Campo clave para modificación
      colorEvacuaciones: "",
      hematemesis: "",
      frecuenciaEvacuacion: "",
      frecuenciaEvacuacionEspecificaciones: ""
    },
    respiratorio: {
      tipoRespiracion: "",
      sintomasRespiratorios: [] as string[],
      apneaSuenio: "",
      oxigenoSuplementario: "",
      tosExpectoracion: "" // Campo clave para modificación
    },
    cardiovascular: {
      dolorPecho: "",
      lipotimia: "",
      ritmoCardiaco: "",
      sintomasCardiovasculares: [] as string[],
      presionArterial: "",
      antecedentesInfarto: "",
      fatigaEsfuerzo: ""
    },
    genitoUrinario: {
      frecuenciaUrinaria: "",
      sintomasUrinarios: [] as string[],
      urgenciaUrinaria: "",
      chorroUrinarioDebil: "",
      chorroUrinarioIntermitente: "",
      flujoVaginalUretral: "",
      infeccionesUrinarias: "",
      ultimaMenstruacion: "",
      dismenorrea: "",
      duracionMenstruacion: "",
      ultimoParto: "",
      antecedentesObstetricos: ""
    },
    endocrino: {
      sintomasEndocrinos: [] as string[],
      sudoracionNocturna: "",
      hirsutismo: "",
      galactorrea: "",
      cambiosRitmoMenstrual: "", // Campo clave para modificación
      cambiosPeso: "",
      intolerancia: "",
      condicionesEndocrinas: ""
    },
    tegumentario: {
      cambiosColoracion: "",
      cambiosColoracionEspecificaciones: "",
      sintomasTegumentarios: [] as string[],
      cambiosUnas: "", // Campo clave para modificación
      cambiosLunares: "",
      lesionesPigmentadas: ""
    },
    musculoEsqueletico: {
      fracturas: "",
      detallesFracturas: "",
      sintomasMusculoEsqueleticos: [] as string[],
      rigidezMatutina: "", // Campo clave para modificación
      debilidadMuscular: "",
      limitacionesMovimiento: ""
    },
    nervioso: {
      percepcionSentidos: "",
      horasSueno: "",
      trastornosSueno: "",
      trastornosSuenoEspecificaciones: "",
      estadoAnimo: "",
      parestesias: "",
      otrosSintomasNeurologicos: [] as string[]
    }
  });

  useEffect(() => {
    if (showForm === false) {
      generateAndUpdateRedacciones();
    }
  }, [showForm]); // Ejecutar solo cuando showForm cambia a false

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
      const currentSystemValues = prev[system as keyof typeof prev];
      const currentFieldValues = currentSystemValues[field as keyof typeof currentSystemValues] as string[];

      let updatedValues: string[];

      if (value === "Ninguno") {
          // Si se selecciona "Ninguno", y estaba deseleccionado, el nuevo valor es solo ["Ninguno"]
          // Si se selecciona "Ninguno" y ya estaba seleccionado, se deselecciona (queda vacío)
          updatedValues = checked ? [value] : [];
      } else {
          let intermediateValues: string[];
          if (checked) {
              // Si se selecciona otra opción, agregarla y quitar "Ninguno" si estaba presente
              intermediateValues = [...currentFieldValues.filter(item => item !== "Ninguno"), value];
          } else {
              // Si se deselecciona otra opción, simplemente quitarla
              intermediateValues = currentFieldValues.filter(item => item !== value);
          }
          // Si después de la operación el array queda vacío y antes había algo, o si se quita la última opción que no era "Ninguno"
          // podrías opcionalmente seleccionar "Ninguno" automáticamente, o dejarlo vacío.
          // Por ahora, lo dejamos vacío si no hay selecciones activas.
          updatedValues = intermediateValues;
      }

      return {
          ...prev,
          [system]: {
              ...currentSystemValues,
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
    // --- Digestivo ---
    let digestivoText = `El paciente refiere alimentación de tipo ${formValues.digestivo.alimentacion || "[sin especificar]"}. Su patrón de masticación es ${formValues.digestivo.masticacion || "[sin especificar]"}. Manifiesta ${getPercepcionGustoText()}. ${formValues.digestivo.percepcionGustoEspecificaciones ? `Especificaciones: ${formValues.digestivo.percepcionGustoEspecificaciones}.` : ''} La salivación ${getSalivacionText()}. Respecto a la deglución, ${getDeglusiónText()}. ${formValues.digestivo.halitosis === "Sí" ? `Presenta halitosis${formValues.digestivo.halitosisEspecificaciones ? ` (${formValues.digestivo.halitosisEspecificaciones})` : ''}.` : "No presenta halitosis."}`;

    if (formValues.digestivo.sintomasDigestivos.length === 0 || formValues.digestivo.sintomasDigestivos.includes("Ninguno")) {
        digestivoText += " El paciente niega alteraciones relevantes relacionadas al sistema digestivo. Se interrogó específicamente sobre distensión abdominal, estreñimiento, plenitud posprandial, pirosis, dolor abdominal, náuseas, vómito y reflujo.";
    } else {
        digestivoText += ` Ha experimentado los siguientes síntomas digestivos: ${formValues.digestivo.sintomasDigestivos.join(", ")}.`;
    }

    digestivoText += ` ${formValues.digestivo.cambiosApetito ? `Cambios en el apetito: ${formValues.digestivo.cambiosApetito}.` : 'Sin cambios relevantes en el apetito.'}`;

    // *** Modificación Hábitos Alimenticios ***
    if (!formValues.digestivo.habitosAlimenticios || formValues.digestivo.habitosAlimenticios === "Ninguno") {
        digestivoText += " Sin habitos alimenticios relevantes, se interrogo especificamente por: ingesta nocturna, picoteo frecuente, ayuno prolongado.";
    } else {
        digestivoText += ` Hábitos alimenticios: ${formValues.digestivo.habitosAlimenticios}.`;
    }

    digestivoText += ` El color de las evacuaciones es ${getColorEvacuacionesText()}. ${formValues.digestivo.hematemesis === "Sí" ? "Presenta hematemesis." : "No presenta hematemesis."} Realiza ${formValues.digestivo.frecuenciaEvacuacion || "[sin especificar]"} evacuaciones diarias${formValues.digestivo.frecuenciaEvacuacion === "Otra" ? ` (${formValues.digestivo.frecuenciaEvacuacionEspecificaciones})` : ''}.`;

    // --- Respiratorio ---
    let respiratorioText = `El tipo de respiración habitual es ${formValues.respiratorio.tipoRespiracion || "[sin especificar]"}.`;
    if (formValues.respiratorio.sintomasRespiratorios.length === 0 || formValues.respiratorio.sintomasRespiratorios.includes("Ninguno")) {
        respiratorioText += " El paciente niega alteraciones relevantes relacionadas al sistema respiratorio. Se interrogó específicamente sobre obstrucción nasal, rinorrea, congestión nasal, epistaxis, disnea, tos, dolor torácico, hernias, expectoraciones, secreciones y cianosis.";
    } else {
        respiratorioText += ` Presenta síntomas respiratorios como: ${formValues.respiratorio.sintomasRespiratorios.join(", ")}.`;
    }
    respiratorioText += ` ${formValues.respiratorio.apneaSuenio === "Sí" ? "Presenta apnea del sueño." : "No presenta apnea del sueño."} ${formValues.respiratorio.oxigenoSuplementario === "Sí" ? "Usa oxígeno suplementario." : "No usa oxígeno suplementario."}`;
    // *** Modificación Tos con expectoración ***
    if (formValues.respiratorio.tosExpectoracion) {
        respiratorioText += ` Tos: ${formValues.respiratorio.tosExpectoracion}.`;
    } else {
        respiratorioText += " No refiere tos con expectoración."; // O puedes omitirlo si no se selecciona nada
    }


    // --- Cardiovascular ---
    let cardiovascularText = `${formValues.cardiovascular.dolorPecho === "No" ? "No refiere" : "Refiere"} dolor en el pecho. ${formValues.cardiovascular.lipotimia === "Sí" ? "Ha presentado" : "No ha presentado"} episodios de lipotimia. El ritmo cardíaco es ${formValues.cardiovascular.ritmoCardiaco || "[sin especificar]"}.`;
    if (formValues.cardiovascular.sintomasCardiovasculares.length === 0 || formValues.cardiovascular.sintomasCardiovasculares.includes("Ninguno")) {
        cardiovascularText += " El paciente niega alteraciones relevantes relacionadas al sistema cardiovascular. Se interrogó específicamente sobre mareos, edema, equimosis, várices, cefalea, acúfenos, fosfenos y palpitaciones.";
    } else {
        cardiovascularText += ` Sintomatología cardiovascular reportada: ${formValues.cardiovascular.sintomasCardiovasculares.join(", ")}.`;
    }
    cardiovascularText += ` ${formValues.cardiovascular.presionArterial ? `Presión arterial conocida: ${formValues.cardiovascular.presionArterial}.` : 'Presión arterial no especificada.'} ${formValues.cardiovascular.antecedentesInfarto === "Sí" ? "Tiene antecedentes de infarto o enfermedad coronaria." : "No tiene antecedentes de infarto o enfermedad coronaria."} ${formValues.cardiovascular.fatigaEsfuerzo === "Sí" ? "Presenta fatiga fácil con esfuerzo leve." : "No presenta fatiga fácil con esfuerzo leve."}`;

    // --- Genito-Urinario ---
    let genitoUrinarioText = `El paciente refiere una frecuencia urinaria de ${formValues.genitoUrinario.frecuenciaUrinaria || "[sin especificar]"} veces al día.`;
    if (formValues.genitoUrinario.sintomasUrinarios.length === 0 || formValues.genitoUrinario.sintomasUrinarios.includes("Ninguno")) {
        genitoUrinarioText += " El paciente niega alteraciones relevantes relacionadas al aparato genito-urinario. Se exploró la frecuencia urinaria, síntomas urinarios, urgencia urinaria, fuerza del chorro, infecciones recurrentes y flujo anormal.";
    } else {
        genitoUrinarioText += ` Síntomas urinarios presentes: ${formValues.genitoUrinario.sintomasUrinarios.join(", ")}.`;
    }
    genitoUrinarioText += ` ${formValues.genitoUrinario.urgenciaUrinaria === "Sí" ? "Presenta urgencia urinaria." : "No presenta urgencia urinaria."} ${formValues.genitoUrinario.chorroUrinarioDebil === "Sí" ? "Presenta chorro urinario débil." : "No presenta chorro urinario débil."} ${formValues.genitoUrinario.chorroUrinarioIntermitente === "Sí" ? "Presenta chorro urinario intermitente." : "No presenta chorro urinario intermitente."} ${formValues.genitoUrinario.flujoVaginalUretral === "Sí" ? "Presenta flujo vaginal/uretral anormal." : "No presenta flujo vaginal/uretral anormal."} ${formValues.genitoUrinario.infeccionesUrinarias === "Sí" ? "Presenta infecciones urinarias frecuentes." : "No presenta infecciones urinarias frecuentes."}`;
    if (formValues.genitoUrinario.ultimaMenstruacion) { // Asumiendo que solo se llena para mujeres
        genitoUrinarioText += ` Fecha de última menstruación: ${formValues.genitoUrinario.ultimaMenstruacion}.`;
        genitoUrinarioText += ` ${formValues.genitoUrinario.dismenorrea ? `Dismenorrea: ${formValues.genitoUrinario.dismenorrea}.` : ''}`;
        genitoUrinarioText += ` ${formValues.genitoUrinario.duracionMenstruacion ? `Días de duración de menstruación: ${formValues.genitoUrinario.duracionMenstruacion}.` : ''}`;
        genitoUrinarioText += ` ${formValues.genitoUrinario.ultimoParto ? `Fecha de último parto: ${formValues.genitoUrinario.ultimoParto}.` : ''}`;
        genitoUrinarioText += ` Antecedentes obstétricos: ${formValues.genitoUrinario.antecedentesObstetricos || "ninguno"}.`;
    }

    // --- Endocrino ---
    let endocrinoText = "";
    if (formValues.endocrino.sintomasEndocrinos.length === 0 || formValues.endocrino.sintomasEndocrinos.includes("Ninguno")) {
        endocrinoText += "El paciente niega alteraciones relevantes relacionadas al sistema endocrino. Se indagó sobre poliuria, polidipsia, polifagia, exoftalmos, nerviosismo, temblores, insomnio, cambios de peso e intolerancia al frío o calor.";
    } else {
        endocrinoText += `El paciente refiere los siguientes síntomas endocrinos: ${formValues.endocrino.sintomasEndocrinos.join(", ")}.`;
    }
    endocrinoText += ` ${formValues.endocrino.sudoracionNocturna === "Sí" ? "Presenta sudoración excesiva nocturna." : "No presenta sudoración excesiva nocturna."} ${formValues.endocrino.hirsutismo === "Sí" ? "Presenta hirsutismo." : "No presenta hirsutismo."} ${formValues.endocrino.galactorrea === "Sí" ? "Presenta galactorrea." : "No presenta galactorrea."}`;
    // *** Modificación Ritmo Menstrual ***
    if (formValues.endocrino.cambiosRitmoMenstrual) {
        endocrinoText += ` Cambios en el ritmo menstrual: ${formValues.endocrino.cambiosRitmoMenstrual}.`;
    } else {
         // Si el campo es relevante solo para mujeres, podrías añadir una condición
         // endocrinoText += " Ritmo menstrual no aplica o no especificado.";
    }
    endocrinoText += ` Reporta ${getCambiosPesoText()}. ${getIntoleranciaText()}. Antecedentes patológicos endocrinos conocidos: ${formValues.endocrino.condicionesEndocrinas || "ninguno"}.`;

    // --- Tegumentario ---
    let tegumentarioText = `${formValues.tegumentario.cambiosColoracion === "Sí" ? `Ha notado cambios en la coloración de la piel${formValues.tegumentario.cambiosColoracionEspecificaciones ? ` (${formValues.tegumentario.cambiosColoracionEspecificaciones})` : ''}.` : "No ha notado cambios en la coloración de la piel."}`;
    if (formValues.tegumentario.sintomasTegumentarios.length === 0 || formValues.tegumentario.sintomasTegumentarios.includes("Ninguno")) {
        tegumentarioText += " El paciente niega otras alteraciones relevantes relacionadas al sistema tegumentario. Se investigó presencia de erupciones, prurito, hiperhidrosis, pérdida de cabello y piel seca.";
    } else {
        tegumentarioText += ` Otros síntomas presentes: ${formValues.tegumentario.sintomasTegumentarios.join(", ")}.`;
    }
    // *** Modificación Cambios en Uñas ***
    if (formValues.tegumentario.cambiosUnas) {
        tegumentarioText += ` Cambios en uñas: ${formValues.tegumentario.cambiosUnas}.`;
    } else {
        tegumentarioText += " No refiere cambios en uñas."; // O puedes omitirlo
    }
    tegumentarioText += ` ${formValues.tegumentario.cambiosLunares === "Sí" ? "Presenta cambios en lunares." : "No presenta cambios en lunares."} ${formValues.tegumentario.lesionesPigmentadas === "Sí" ? "Presenta lesiones pigmentadas." : "No presenta lesiones pigmentadas."}`;

    // --- Músculo-Esquelético ---
    let musculoEsqueleticoText = `${formValues.musculoEsqueletico.fracturas === "No" ? "No ha presentado" : "Ha presentado"} fracturas o esguinces${formValues.musculoEsqueletico.fracturas === "Sí" ? ` (${formValues.musculoEsqueletico.detallesFracturas || "sin especificar"})` : ''}.`;
    if (formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.length === 0 || formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Ninguno")) {
        musculoEsqueleticoText += " El paciente niega otras alteraciones relevantes relacionadas al sistema músculo-esquelético. Se interrogó sobre deformidad o dolor articular, rigidez matutina, calambres musculares y limitaciones de movimiento.";
    } else {
        musculoEsqueleticoText += ` Sintomatología musculoesquelética actual: ${formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.join(", ")}.`;
    }
    // *** Modificación Rigidez Matutina ***
    if (formValues.musculoEsqueletico.rigidezMatutina) {
        musculoEsqueleticoText += ` Rigidez matutina: ${formValues.musculoEsqueletico.rigidezMatutina}.`;
    } else {
        // Podrías agregar "No refiere rigidez matutina" o simplemente omitir si no se selecciona.
         musculoEsqueleticoText += " No refiere rigidez matutina.";
    }
    musculoEsqueleticoText += ` ${formValues.musculoEsqueletico.debilidadMuscular ? `Debilidad muscular: ${formValues.musculoEsqueletico.debilidadMuscular}.` : 'No refiere debilidad muscular.'} ${formValues.musculoEsqueletico.limitacionesMovimiento ? `Limitaciones de movimiento: ${formValues.musculoEsqueletico.limitacionesMovimiento}.` : 'No refiere limitaciones de movimiento.'}`;

    // --- Nervioso ---
    let nerviosoText = `${formValues.nervioso.percepcionSentidos === "Sí" ? "Percibe" : "No percibe"} adecuadamente a través de los órganos de los sentidos. El patrón de sueño habitual es de ${formValues.nervioso.horasSueno || "[sin especificar]"} horas por noche. ${formValues.nervioso.trastornosSueno === "Sí" ? `Presenta trastornos del sueño (${formValues.nervioso.trastornosSuenoEspecificaciones || 'sin especificar'}).` : "No presenta trastornos del sueño."} Su carácter habitual se describe como ${formValues.nervioso.estadoAnimo || "[sin especificar]"}. ${formValues.nervioso.parestesias === "Sí" ? "Presenta" : "No presenta"} parestesias.`;
    if (formValues.nervioso.otrosSintomasNeurologicos.length === 0 || formValues.nervioso.otrosSintomasNeurologicos.includes("Ninguno")) {
        nerviosoText += " El paciente niega otras alteraciones relevantes relacionadas al sistema nervioso. Se preguntó sobre convulsiones, temblores, problemas de memoria, personalidad y coordinación.";
    } else {
        nerviosoText += ` Otros síntomas neurológicos: ${formValues.nervioso.otrosSintomasNeurologicos.join(", ")}.`;
    }

    // --- Actualizar estado y props ---
    const newRedacciones = {
        digestivo: digestivoText,
        respiratorio: respiratorioText,
        cardiovascular: cardiovascularText,
        genitoUrinario: genitoUrinarioText,
        endocrino: endocrinoText,
        tegumentario: tegumentarioText,
        musculoEsqueletico: musculoEsqueleticoText,
        nervioso: nerviosoText
    };

    setRedacciones(newRedacciones);

    // Llamar a handleInterrogatorioChange para cada sistema
    Object.entries(newRedacciones).forEach(([system, value]) => {
        handleInterrogatorioChange(system, value);
    });

    // Cambiar al apartado de redacción IA y hacer auto scroll
    setShowForm(false);
    setTimeout(() => {
      redaccionesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Funciones auxiliares para texto (sin cambios)
   const getPercepcionGustoText = () => {
     switch (formValues.digestivo.percepcionGusto) {
       case "Normal": return "no percibir alteraciones del gusto";
       case "Disminucion": return "hipogeusia";
       case "Alterados": return "disgeusia (sabores metálicos, amargos, etc.)";
       default: return "[sin especificar]";
     }
   };
   const getSalivacionText = () => {
     switch (formValues.digestivo.salivacion) {
       case "Normal": return "se encuentra presente en cantidad y consistencia adecuadas";
       case "Aumentada": return "aumentada";
       case "Disminuida": return "disminuida";
       default: return "[sin especificar]";
     }
   };
   const getDeglusiónText = () => {
     switch (formValues.digestivo.deglusion) {
       case "No": return "no refiere dificultad";
       case "Dificultad": return "presenta dificultad sin dolor";
       case "Dolor": return "presenta odinofagia";
       default: return "[sin especificar]";
     }
   };
   const getColorEvacuacionesText = () => {
     switch (formValues.digestivo.colorEvacuaciones) {
       case "Normal": return "marron y bien formado";
       case "Oscuras": return "oscuras";
       case "Claras": return "claras";
       case "Presencia de moco": return "con presencia de moco";
       default: return "[sin especificar]";
     }
   };
   const getCambiosPesoText = () => {
     switch (formValues.endocrino.cambiosPeso) {
       case "Perdida": return "pérdida de peso sin causa aparente";
       case "Aumento": return "aumento de peso sin causa aparente";
       case "No": return "sin cambios de peso";
       default: return "[sin especificar]";
     }
   };
   const getIntoleranciaText = () => {
     if (formValues.endocrino.intolerancia === "No") {
       return "No presenta intolerancia al frío o calor";
     } else if (formValues.endocrino.intolerancia) {
       return `Presenta intolerancia al ${formValues.endocrino.intolerancia.toLowerCase()}`;
     } else {
       return "[sin especificar intolerancia]";
     }
   };

  const handleCopy = (section: keyof typeof redacciones) => { // Tipado más estricto
    navigator.clipboard.writeText(redacciones[section]);
    setCopied(prev => ({
      ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}), // Resetea todos a false
      [section]: true // Pone el actual a true
    }));
    setTimeout(() => setCopied(prev => ({
      ...prev,
      [section]: false
    })), 2000);
  };

   const resetForm = () => {
     setFormValues({
         digestivo: { alimentacion: "", masticacion: "", percepcionGusto: "", percepcionGustoEspecificaciones: "", salivacion: "", deglusion: "", halitosis: "", halitosisEspecificaciones: "", sintomasDigestivos: [], cambiosApetito: "", habitosAlimenticios: "", colorEvacuaciones: "", hematemesis: "", frecuenciaEvacuacion: "", frecuenciaEvacuacionEspecificaciones: "" },
         respiratorio: { tipoRespiracion: "", sintomasRespiratorios: [], apneaSuenio: "", oxigenoSuplementario: "", tosExpectoracion: "" },
         cardiovascular: { dolorPecho: "", lipotimia: "", ritmoCardiaco: "", sintomasCardiovasculares: [], presionArterial: "", antecedentesInfarto: "", fatigaEsfuerzo: "" },
         genitoUrinario: { frecuenciaUrinaria: "", sintomasUrinarios: [], urgenciaUrinaria: "", chorroUrinarioDebil: "", chorroUrinarioIntermitente: "", flujoVaginalUretral: "", infeccionesUrinarias: "", ultimaMenstruacion: "", dismenorrea: "", duracionMenstruacion: "", ultimoParto: "", antecedentesObstetricos: "" },
         endocrino: { sintomasEndocrinos: [], sudoracionNocturna: "", hirsutismo: "", galactorrea: "", cambiosRitmoMenstrual: "", cambiosPeso: "", intolerancia: "", condicionesEndocrinas: "" },
         tegumentario: { cambiosColoracion: "", cambiosColoracionEspecificaciones: "", sintomasTegumentarios: [], cambiosUnas: "", cambiosLunares: "", lesionesPigmentadas: "" },
         musculoEsqueletico: { fracturas: "", detallesFracturas: "", sintomasMusculoEsqueleticos: [], rigidezMatutina: "", debilidadMuscular: "", limitacionesMovimiento: "" },
         nervioso: { percepcionSentidos: "", horasSueno: "", trastornosSueno: "", trastornosSuenoEspecificaciones: "", estadoAnimo: "", parestesias: "", otrosSintomasNeurologicos: [] }
     });
     // Opcionalmente, resetear redacciones también
     setRedacciones({ digestivo: "", respiratorio: "", cardiovascular: "", genitoUrinario: "", endocrino: "", tegumentario: "", musculoEsqueletico: "", nervioso: "" });
     // Opcionalmente, volver a la vista de formulario
     // setShowForm(true);
 };


  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50 bg-white dark:bg-gray-800" : ""}`}>
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm z-10">
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
              <button onClick={() => setShowForm(true)} className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${showForm ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}>
                Formulario
              </button>
              <button onClick={generateAndUpdateRedacciones} disabled={showForm} className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${!showForm ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}>
                 Redacción IA
               </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
             {/* Botones de minimizar, maximizar, cerrar */}
             <button onClick={handleMinimize} className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"> <Minus className="w-4 h-4" /> </button>
             <button onClick={handleMaximize} className="p-1 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors"> <Maximize2 className="w-4 h-4" /> </button>
             <button onClick={handleClose} className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"> <X className="w-4 h-4" /> </button>
          </div>
        </div>

        <div ref={redaccionesRef} className="flex justify-start px-6 py-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-gray-400">IX.</span> INTERROGATORIO POR APARATOS Y SISTEMAS
          </h2>
        </div>

        {!isMinimized && (
          <div className={`p-6 ${isMaximized ? 'pb-16' : ''}`} ref={formRef}> {/* Añadir padding bottom si está maximizado para evitar solapamiento con botón flotante si existiera */}
            {showForm ? (
              <div className="space-y-6">
                {/* --- APARATO DIGESTIVO --- */}
                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-3 text-justify">Aparato Digestivo</h4>
                  <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                      {/* Tipo de Alimentación */}
                      <div>
                          <Label className="block mb-1 text-sm font-medium">Tipo de Alimentación</Label>
                          <div className="flex flex-wrap gap-2">
                              <WordButton label="Blanda" isSelected={formValues.digestivo.alimentacion === "Blanda"} onClick={() => handleRadioChange("digestivo", "alimentacion", "Blanda")} />
                              <WordButton label="Fibrosa" isSelected={formValues.digestivo.alimentacion === "Fibrosa"} onClick={() => handleRadioChange("digestivo", "alimentacion", "Fibrosa")} />
                              <WordButton label="Combinada" isSelected={formValues.digestivo.alimentacion === "Combinada"} onClick={() => handleRadioChange("digestivo", "alimentacion", "Combinada")} />
                          </div>
                      </div>
                      {/* Patrón de Masticación */}
                      <div>
                          <Label className="block mb-1 text-sm font-medium">Patrón de Masticación</Label>
                          <div className="flex flex-wrap gap-2">
                              <WordButton label="Unilateral" isSelected={formValues.digestivo.masticacion === "Unilateral"} onClick={() => handleRadioChange("digestivo", "masticacion", "Unilateral")} />
                              <WordButton label="Bilateral" isSelected={formValues.digestivo.masticacion === "Bilateral"} onClick={() => handleRadioChange("digestivo", "masticacion", "Bilateral")} />
                              <WordButton label="Anterior" isSelected={formValues.digestivo.masticacion === "Anterior"} onClick={() => handleRadioChange("digestivo", "masticacion", "Anterior")} />
                          </div>
                      </div>
                      {/* Percepción del Gusto */}
                      <div>
                          <Label className="block mb-1 text-sm font-medium">Percepción del Gusto</Label>
                          <div className="flex flex-wrap gap-2">
                              <WordButton label="Normal" isSelected={formValues.digestivo.percepcionGusto === "Normal"} onClick={() => handleRadioChange("digestivo", "percepcionGusto", "Normal")} />
                              <WordButton label="Disminución" isSelected={formValues.digestivo.percepcionGusto === "Disminucion"} onClick={() => handleRadioChange("digestivo", "percepcionGusto", "Disminucion")} />
                              <WordButton label="Alterados" isSelected={formValues.digestivo.percepcionGusto === "Alterados"} onClick={() => handleRadioChange("digestivo", "percepcionGusto", "Alterados")} />
                          </div>
                           {formValues.digestivo.percepcionGusto === "Alterados" && (
                             <Textarea placeholder="Especifique alteraciones del gusto..." value={formValues.digestivo.percepcionGustoEspecificaciones} onChange={(e) => handleTextChange("digestivo", "percepcionGustoEspecificaciones", e.target.value)} className="w-full mt-2" rows={2}/>
                           )}
                      </div>
                      {/* Salivación */}
                      <div>
                          <Label className="block mb-1 text-sm font-medium">Salivación</Label>
                          <div className="flex flex-wrap gap-2">
                              <WordButton label="Normal" isSelected={formValues.digestivo.salivacion === "Normal"} onClick={() => handleRadioChange("digestivo", "salivacion", "Normal")} />
                              <WordButton label="Aumentada" isSelected={formValues.digestivo.salivacion === "Aumentada"} onClick={() => handleRadioChange("digestivo", "salivacion", "Aumentada")} />
                              <WordButton label="Disminuida" isSelected={formValues.digestivo.salivacion === "Disminuida"} onClick={() => handleRadioChange("digestivo", "salivacion", "Disminuida")} />
                          </div>
                      </div>
                      {/* Deglución */}
                      <div>
                          <Label className="block mb-1 text-sm font-medium">Dificultad o Dolor al Tragar (Deglución)</Label>
                          <div className="flex flex-wrap gap-2">
                              <WordButton label="No" isSelected={formValues.digestivo.deglusion === "No"} onClick={() => handleRadioChange("digestivo", "deglusion", "No")} />
                              <WordButton label="Dificultad (sin dolor)" isSelected={formValues.digestivo.deglusion === "Dificultad"} onClick={() => handleRadioChange("digestivo", "deglusion", "Dificultad")} />
                              <WordButton label="Dolor (Odinofagia)" isSelected={formValues.digestivo.deglusion === "Dolor"} onClick={() => handleRadioChange("digestivo", "deglusion", "Dolor")} />
                          </div>
                      </div>
                      {/* Halitosis */}
                      <div>
                          <Label className="block mb-1 text-sm font-medium">Halitosis (mal aliento)</Label>
                          <div className="flex flex-wrap gap-2">
                              <WordButton label="Sí" isSelected={formValues.digestivo.halitosis === "Sí"} onClick={() => handleRadioChange("digestivo", "halitosis", "Sí")} />
                              <WordButton label="No" isSelected={formValues.digestivo.halitosis === "No"} onClick={() => handleRadioChange("digestivo", "halitosis", "No")} />
                          </div>
                          {formValues.digestivo.halitosis === "Sí" && (
                             <div className="mt-2 flex flex-wrap gap-2">
                               <WordButton label="Solo por las mañanas" isSelected={formValues.digestivo.halitosisEspecificaciones === "Solo por las mañanas"} onClick={() => handleRadioChange("digestivo", "halitosisEspecificaciones", "Solo por las mañanas")} />
                               <WordButton label="Todo el tiempo" isSelected={formValues.digestivo.halitosisEspecificaciones === "Todo el tiempo"} onClick={() => handleRadioChange("digestivo", "halitosisEspecificaciones", "Todo el tiempo")} />
                             </div>
                           )}
                      </div>
                      {/* Síntomas Digestivos (Checkbox group) */}
                      <div className="md:col-span-2">
                          <Label className="block mb-1 text-sm font-medium">Síntomas Digestivos</Label>
                          <div className="flex flex-wrap gap-2">
                              <WordButton label="Distensión Abdominal" isSelected={formValues.digestivo.sintomasDigestivos.includes("Distensión abdominal")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "Distensión abdominal", !formValues.digestivo.sintomasDigestivos.includes("Distensión abdominal"))} />
                              <WordButton label="Estreñimiento" isSelected={formValues.digestivo.sintomasDigestivos.includes("Estreñimiento")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "Estreñimiento", !formValues.digestivo.sintomasDigestivos.includes("Estreñimiento"))} />
                              <WordButton label="Plenitud Posprandial" isSelected={formValues.digestivo.sintomasDigestivos.includes("Sensación de llenura después de comer")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "Sensación de llenura después de comer", !formValues.digestivo.sintomasDigestivos.includes("Sensación de llenura después de comer"))} />
                              <WordButton label="Pirosis (Acidez)" isSelected={formValues.digestivo.sintomasDigestivos.includes("Acidez (pirosis)")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "Acidez (pirosis)", !formValues.digestivo.sintomasDigestivos.includes("Acidez (pirosis)"))} />
                              <WordButton label="Dolor Abdominal" isSelected={formValues.digestivo.sintomasDigestivos.includes("Dolor abdominal")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "Dolor abdominal", !formValues.digestivo.sintomasDigestivos.includes("Dolor abdominal"))} />
                              <WordButton label="Náusea" isSelected={formValues.digestivo.sintomasDigestivos.includes("Náuseas")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "Náuseas", !formValues.digestivo.sintomasDigestivos.includes("Náuseas"))} />
                              <WordButton label="Vómito" isSelected={formValues.digestivo.sintomasDigestivos.includes("Vómitos")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "Vómitos", !formValues.digestivo.sintomasDigestivos.includes("Vómitos"))} />
                              <WordButton label="Reflujo" isSelected={formValues.digestivo.sintomasDigestivos.includes("Reflujo")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "Reflujo", !formValues.digestivo.sintomasDigestivos.includes("Reflujo"))} />
                              <WordButton label="Ninguno" isSelected={formValues.digestivo.sintomasDigestivos.includes("Ninguno")} onClick={() => handleCheckboxChange("digestivo", "sintomasDigestivos", "Ninguno", !formValues.digestivo.sintomasDigestivos.includes("Ninguno"))} />
                          </div>
                      </div>
                       {/* Cambios en el apetito */}
                       <div>
                           <Label className="block mb-1 text-sm font-medium">Cambios en el apetito</Label>
                           <div className="flex flex-wrap gap-2">
                               <WordButton label="Aumentado" isSelected={formValues.digestivo.cambiosApetito === "Aumentado"} onClick={() => handleRadioChange("digestivo", "cambiosApetito", "Aumentado")} />
                               <WordButton label="Disminuido" isSelected={formValues.digestivo.cambiosApetito === "Disminuido"} onClick={() => handleRadioChange("digestivo", "cambiosApetito", "Disminuido")} />
                               <WordButton label="Sin cambios" isSelected={formValues.digestivo.cambiosApetito === "Sin cambios"} onClick={() => handleRadioChange("digestivo", "cambiosApetito", "Sin cambios")} />
                           </div>
                       </div>
                       {/* Hábitos alimenticios */}
                       <div>
                           <Label className="block mb-1 text-sm font-medium">Hábitos alimenticios</Label>
                           <div className="flex flex-wrap gap-2">
                               <WordButton label="Ingesta nocturna" isSelected={formValues.digestivo.habitosAlimenticios === "Ingesta nocturna"} onClick={() => handleRadioChange("digestivo", "habitosAlimenticios", "Ingesta nocturna")} />
                               <WordButton label="Picoteo frecuente" isSelected={formValues.digestivo.habitosAlimenticios === "Picoteo frecuente"} onClick={() => handleRadioChange("digestivo", "habitosAlimenticios", "Picoteo frecuente")} />
                               <WordButton label="Ayuno prolongado" isSelected={formValues.digestivo.habitosAlimenticios === "Ayuno prolongado"} onClick={() => handleRadioChange("digestivo", "habitosAlimenticios", "Ayuno prolongado")} />
                               {/* La opción "Ninguno" ahora controla el texto en la redacción */}
                               <WordButton label="Ninguno" isSelected={formValues.digestivo.habitosAlimenticios === "Ninguno"} onClick={() => handleRadioChange("digestivo", "habitosAlimenticios", "Ninguno")} />
                           </div>
                       </div>
                       {/* Color de las evacuaciones */}
                       <div>
                           <Label className="block mb-1 text-sm font-medium">Color de las evacuaciones</Label>
                           <div className="flex flex-wrap gap-2">
                               <WordButton label="Normal (marrón)" isSelected={formValues.digestivo.colorEvacuaciones === "Normal"} onClick={() => handleRadioChange("digestivo", "colorEvacuaciones", "Normal")} />
                               <WordButton label="Oscuras (Melena)" isSelected={formValues.digestivo.colorEvacuaciones === "Oscuras"} onClick={() => handleRadioChange("digestivo", "colorEvacuaciones", "Oscuras")} />
                               <WordButton label="Claras (Acolia)" isSelected={formValues.digestivo.colorEvacuaciones === "Claras"} onClick={() => handleRadioChange("digestivo", "colorEvacuaciones", "Claras")} />
                               <WordButton label="Con moco" isSelected={formValues.digestivo.colorEvacuaciones === "Presencia de moco"} onClick={() => handleRadioChange("digestivo", "colorEvacuaciones", "Presencia de moco")} />
                           </div>
                       </div>
                       {/* Hematemesis */}
                       <div>
                           <Label className="block mb-1 text-sm font-medium">Hematemesis (vómito con sangre)</Label>
                           <div className="flex flex-wrap gap-2">
                               <WordButton label="Sí" isSelected={formValues.digestivo.hematemesis === "Sí"} onClick={() => handleRadioChange("digestivo", "hematemesis", "Sí")} />
                               <WordButton label="No" isSelected={formValues.digestivo.hematemesis === "No"} onClick={() => handleRadioChange("digestivo", "hematemesis", "No")} />
                           </div>
                       </div>
                       {/* Frecuencia de Evacuación */}
                       <div>
                           <Label className="block mb-1 text-sm font-medium">Frecuencia de Evacuación Diaria</Label>
                           <div className="flex flex-wrap gap-2">
                               <WordButton label="Menos de 1 vez" isSelected={formValues.digestivo.frecuenciaEvacuacion === "Menos de una vez al día"} onClick={() => handleRadioChange("digestivo", "frecuenciaEvacuacion", "Menos de una vez al día")} />
                               <WordButton label="1 a 2 veces" isSelected={formValues.digestivo.frecuenciaEvacuacion === "1 a 2 veces"} onClick={() => handleRadioChange("digestivo", "frecuenciaEvacuacion", "1 a 2 veces")} />
                               <WordButton label="Más de 2 veces" isSelected={formValues.digestivo.frecuenciaEvacuacion === "Más de 2 veces"} onClick={() => handleRadioChange("digestivo", "frecuenciaEvacuacion", "Más de 2 veces")} />
                               <WordButton label="Otra" isSelected={formValues.digestivo.frecuenciaEvacuacion === "Otra"} onClick={() => handleRadioChange("digestivo", "frecuenciaEvacuacion", "Otra")} />
                           </div>
                            {formValues.digestivo.frecuenciaEvacuacion === "Otra" && (
                              <Textarea placeholder="Especifique frecuencia..." value={formValues.digestivo.frecuenciaEvacuacionEspecificaciones} onChange={(e) => handleTextChange("digestivo", "frecuenciaEvacuacionEspecificaciones", e.target.value)} className="w-full mt-2" rows={2}/>
                            )}
                       </div>
                  </div>
                </div>

                {/* --- APARATO RESPIRATORIO --- */}
                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold mb-3 text-justify">Aparato Respiratorio</h4>
                    <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                        {/* Tipo de Respiración */}
                        <div>
                            <Label className="block mb-1 text-sm font-medium">Tipo de Respiración Habitual</Label>
                            <div className="flex flex-wrap gap-2">
                                <WordButton label="Nasal" isSelected={formValues.respiratorio.tipoRespiracion === "Nasal"} onClick={() => handleRadioChange("respiratorio", "tipoRespiracion", "Nasal")} />
                                <WordButton label="Bucal" isSelected={formValues.respiratorio.tipoRespiracion === "Bucal"} onClick={() => handleRadioChange("respiratorio", "tipoRespiracion", "Bucal")} />
                                <WordButton label="Combinada" isSelected={formValues.respiratorio.tipoRespiracion === "Combinada"} onClick={() => handleRadioChange("respiratorio", "tipoRespiracion", "Combinada")} />
                            </div>
                        </div>
                        {/* Síntomas Respiratorios (Checkbox group) */}
                        <div className="md:col-span-2">
                            <Label className="block mb-1 text-sm font-medium">Síntomas Respiratorios</Label>
                            <div className="flex flex-wrap gap-2">
                                <WordButton label="Obstrucción Nasal" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Obstrucción nasal")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Obstrucción nasal", !formValues.respiratorio.sintomasRespiratorios.includes("Obstrucción nasal"))} />
                                <WordButton label="Rinorrea" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Secreción nasal (rinorrea)")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Secreción nasal (rinorrea)", !formValues.respiratorio.sintomasRespiratorios.includes("Secreción nasal (rinorrea)"))} />
                                <WordButton label="Congestión Nasal" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Congestión nasal")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Congestión nasal", !formValues.respiratorio.sintomasRespiratorios.includes("Congestión nasal"))} />
                                <WordButton label="Epistaxis" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Sangrado nasal (epistaxis)")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Sangrado nasal (epistaxis)", !formValues.respiratorio.sintomasRespiratorios.includes("Sangrado nasal (epistaxis)"))} />
                                <WordButton label="Disnea" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Dificultad para respirar (disnea)")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Dificultad para respirar (disnea)", !formValues.respiratorio.sintomasRespiratorios.includes("Dificultad para respirar (disnea)"))} />
                                <WordButton label="Tos" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Tos")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Tos", !formValues.respiratorio.sintomasRespiratorios.includes("Tos"))} />
                                <WordButton label="Dolor Torácico" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Dolor en el pecho")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Dolor en el pecho", !formValues.respiratorio.sintomasRespiratorios.includes("Dolor en el pecho"))} />
                                <WordButton label="Expectoración" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Flemas (expectoración)")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Flemas (expectoración)", !formValues.respiratorio.sintomasRespiratorios.includes("Flemas (expectoración)"))} />
                                <WordButton label="Cianosis" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Coloración azulada en labios o piel (cianosis)")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Coloración azulada en labios o piel (cianosis)", !formValues.respiratorio.sintomasRespiratorios.includes("Coloración azulada en labios o piel (cianosis)"))} />
                                <WordButton label="Ninguno" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Ninguno")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Ninguno", !formValues.respiratorio.sintomasRespiratorios.includes("Ninguno"))} />
                            </div>
                        </div>
                        {/* Apnea del sueño */}
                        <div>
                            <Label className="block mb-1 text-sm font-medium">Apnea del sueño (ronquido o pausas)</Label>
                            <div className="flex flex-wrap gap-2">
                                <WordButton label="Sí" isSelected={formValues.respiratorio.apneaSuenio === "Sí"} onClick={() => handleRadioChange("respiratorio", "apneaSuenio", "Sí")} />
                                <WordButton label="No" isSelected={formValues.respiratorio.apneaSuenio === "No"} onClick={() => handleRadioChange("respiratorio", "apneaSuenio", "No")} />
                            </div>
                        </div>
                        {/* Uso de oxígeno suplementario */}
                        <div>
                            <Label className="block mb-1 text-sm font-medium">Uso de oxígeno suplementario</Label>
                            <div className="flex flex-wrap gap-2">
                                <WordButton label="Sí" isSelected={formValues.respiratorio.oxigenoSuplementario === "Sí"} onClick={() => handleRadioChange("respiratorio", "oxigenoSuplementario", "Sí")} />
                                <WordButton label="No" isSelected={formValues.respiratorio.oxigenoSuplementario === "No"} onClick={() => handleRadioChange("respiratorio", "oxigenoSuplementario", "No")} />
                            </div>
                        </div>
                        {/* Tos con expectoración */}
                        <div>
                            <Label className="block mb-1 text-sm font-medium">Tos con expectoración</Label>
                            <div className="flex flex-wrap gap-2">
                                <WordButton label="Transparente" isSelected={formValues.respiratorio.tosExpectoracion === "Transparente"} onClick={() => handleRadioChange("respiratorio", "tosExpectoracion", "Transparente")} />
                                <WordButton label="Amarilla" isSelected={formValues.respiratorio.tosExpectoracion === "Amarilla"} onClick={() => handleRadioChange("respiratorio", "tosExpectoracion", "Amarilla")} />
                                <WordButton label="Verdosa" isSelected={formValues.respiratorio.tosExpectoracion === "Verdosa"} onClick={() => handleRadioChange("respiratorio", "tosExpectoracion", "Verdosa")} />
                                <WordButton label="Hemoptoica (con sangre)" isSelected={formValues.respiratorio.tosExpectoracion === "Hemoptoica"} onClick={() => handleRadioChange("respiratorio", "tosExpectoracion", "Hemoptoica")} />
                                {/* *** Nueva Opción *** */}
                                <WordButton label="No presenta tos con expectoracion" isSelected={formValues.respiratorio.tosExpectoracion === "No presenta tos con expectoracion"} onClick={() => handleRadioChange("respiratorio", "tosExpectoracion", "No presenta tos con expectoracion")} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- APARATO CARDIOVASCULAR --- */}
                 <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                     <h4 className="text-lg font-semibold mb-3 text-justify">Aparato Cardiovascular</h4>
                     <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                         {/* Dolor en el Pecho */}
                         <div>
                             <Label className="block mb-1 text-sm font-medium">Dolor en el Pecho (Angina)</Label>
                             <div className="flex flex-wrap gap-2">
                                 <WordButton label="Sí" isSelected={formValues.cardiovascular.dolorPecho === "Sí"} onClick={() => handleRadioChange("cardiovascular", "dolorPecho", "Sí")} />
                                 <WordButton label="No" isSelected={formValues.cardiovascular.dolorPecho === "No"} onClick={() => handleRadioChange("cardiovascular", "dolorPecho", "No")} />
                             </div>
                         </div>
                         {/* Lipotimia */}
                         <div>
                             <Label className="block mb-1 text-sm font-medium">Lipotimia (Desmayos o Síncope)</Label>
                             <div className="flex flex-wrap gap-2">
                                 <WordButton label="Sí" isSelected={formValues.cardiovascular.lipotimia === "Sí"} onClick={() => handleRadioChange("cardiovascular", "lipotimia", "Sí")} />
                                 <WordButton label="No" isSelected={formValues.cardiovascular.lipotimia === "No"} onClick={() => handleRadioChange("cardiovascular", "lipotimia", "No")} />
                             </div>
                         </div>
                         {/* Ritmo Cardíaco */}
                         <div>
                             <Label className="block mb-1 text-sm font-medium">Percepción del Ritmo Cardíaco</Label>
                             <div className="flex flex-wrap gap-2">
                                 <WordButton label="Normal" isSelected={formValues.cardiovascular.ritmoCardiaco === "Normal"} onClick={() => handleRadioChange("cardiovascular", "ritmoCardiaco", "Normal")} />
                                 <WordButton label="Rápido (Taquicardia)" isSelected={formValues.cardiovascular.ritmoCardiaco === "Rápido"} onClick={() => handleRadioChange("cardiovascular", "ritmoCardiaco", "Rápido")} />
                                 <WordButton label="Lento (Bradicardia)" isSelected={formValues.cardiovascular.ritmoCardiaco === "Lento"} onClick={() => handleRadioChange("cardiovascular", "ritmoCardiaco", "Lento")} />
                                  <WordButton label="Irregular (Arritmia)" isSelected={formValues.cardiovascular.ritmoCardiaco === "Irregular"} onClick={() => handleRadioChange("cardiovascular", "ritmoCardiaco", "Irregular")} />
                             </div>
                         </div>
                         {/* Síntomas Cardiovasculares (Checkbox group) */}
                         <div className="md:col-span-2">
                             <Label className="block mb-1 text-sm font-medium">Otros Síntomas Cardiovasculares</Label>
                             <div className="flex flex-wrap gap-2">
                                 <WordButton label="Mareos" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Mareos")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "Mareos", !formValues.cardiovascular.sintomasCardiovasculares.includes("Mareos"))} />
                                 <WordButton label="Edema (Hinchazón)" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Hinchazón (edema)")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "Hinchazón (edema)", !formValues.cardiovascular.sintomasCardiovasculares.includes("Hinchazón (edema)"))} />
                                 <WordButton label="Equimosis (Moretones)" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Moretones (equimosis)")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "Moretones (equimosis)", !formValues.cardiovascular.sintomasCardiovasculares.includes("Moretones (equimosis)"))} />
                                 <WordButton label="Várices" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Várices")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "Várices", !formValues.cardiovascular.sintomasCardiovasculares.includes("Várices"))} />
                                 <WordButton label="Cefalea (Dolor de cabeza)" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Dolor de cabeza (cefalea)")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "Dolor de cabeza (cefalea)", !formValues.cardiovascular.sintomasCardiovasculares.includes("Dolor de cabeza (cefalea)"))} />
                                 <WordButton label="Acúfenos (Zumbidos)" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Zumbidos en los oídos (acúfenos)")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "Zumbidos en los oídos (acúfenos)", !formValues.cardiovascular.sintomasCardiovasculares.includes("Zumbidos en los oídos (acúfenos)"))} />
                                 <WordButton label="Fosfenos (Luces)" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Luces al cerrar los ojos (fosfenos)")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "Luces al cerrar los ojos (fosfenos)", !formValues.cardiovascular.sintomasCardiovasculares.includes("Luces al cerrar los ojos (fosfenos)"))} />
                                 <WordButton label="Palpitaciones" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Palpitaciones")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "Palpitaciones", !formValues.cardiovascular.sintomasCardiovasculares.includes("Palpitaciones"))} />
                                 <WordButton label="Ninguno" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Ninguno")} onClick={() => handleCheckboxChange("cardiovascular", "sintomasCardiovasculares", "Ninguno", !formValues.cardiovascular.sintomasCardiovasculares.includes("Ninguno"))} />
                             </div>
                         </div>
                         {/* Presión arterial conocida */}
                         <div>
                             <Label className="block mb-1 text-sm font-medium">Presión arterial conocida</Label>
                             <div className="flex flex-wrap gap-2">
                                 <WordButton label="Alta (Hipertensión)" isSelected={formValues.cardiovascular.presionArterial === "Alta"} onClick={() => handleRadioChange("cardiovascular", "presionArterial", "Alta")} />
                                 <WordButton label="Baja (Hipotensión)" isSelected={formValues.cardiovascular.presionArterial === "Baja"} onClick={() => handleRadioChange("cardiovascular", "presionArterial", "Baja")} />
                                 <WordButton label="Normal" isSelected={formValues.cardiovascular.presionArterial === "Normal"} onClick={() => handleRadioChange("cardiovascular", "presionArterial", "Normal")} />
                                 <WordButton label="Desconocida" isSelected={formValues.cardiovascular.presionArterial === "Desconocida"} onClick={() => handleRadioChange("cardiovascular", "presionArterial", "Desconocida")} />
                             </div>
                         </div>
                         {/* Antecedentes de infarto */}
                         <div>
                             <Label className="block mb-1 text-sm font-medium">Antecedentes de infarto o enf. coronaria</Label>
                             <div className="flex flex-wrap gap-2">
                                 <WordButton label="Sí" isSelected={formValues.cardiovascular.antecedentesInfarto === "Sí"} onClick={() => handleRadioChange("cardiovascular", "antecedentesInfarto", "Sí")} />
                                 <WordButton label="No" isSelected={formValues.cardiovascular.antecedentesInfarto === "No"} onClick={() => handleRadioChange("cardiovascular", "antecedentesInfarto", "No")} />
                             </div>
                         </div>
                         {/* Fatiga con esfuerzo leve */}
                         <div>
                             <Label className="block mb-1 text-sm font-medium">Fatiga fácil con esfuerzo leve</Label>
                             <div className="flex flex-wrap gap-2">
                                 <WordButton label="Sí" isSelected={formValues.cardiovascular.fatigaEsfuerzo === "Sí"} onClick={() => handleRadioChange("cardiovascular", "fatigaEsfuerzo", "Sí")} />
                                 <WordButton label="No" isSelected={formValues.cardiovascular.fatigaEsfuerzo === "No"} onClick={() => handleRadioChange("cardiovascular", "fatigaEsfuerzo", "No")} />
                             </div>
                         </div>
                     </div>
                 </div>

                {/* --- APARATO GENITO-URINARIO --- */}
                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                     <h4 className="text-lg font-semibold mb-3 text-justify">Aparato Genito-Urinario</h4>
                     <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                         {/* Frecuencia Urinaria */}
                         <div>
                             <Label className="block mb-1 text-sm font-medium">Frecuencia Urinaria Diaria</Label>
                             <div className="flex flex-wrap gap-2">
                                 <WordButton label="Normal (4-7 veces)" isSelected={formValues.genitoUrinario.frecuenciaUrinaria === "Normal (4-7)"} onClick={() => handleRadioChange("genitoUrinario", "frecuenciaUrinaria", "Normal (4-7)")} />
                                 <WordButton label="Aumentada (>7 veces)" isSelected={formValues.genitoUrinario.frecuenciaUrinaria === "Aumentada (>7)"} onClick={() => handleRadioChange("genitoUrinario", "frecuenciaUrinaria", "Aumentada (>7)")} />
                                 <WordButton label="Disminuida (<4 veces)" isSelected={formValues.genitoUrinario.frecuenciaUrinaria === "Disminuida (<4)"} onClick={() => handleRadioChange("genitoUrinario", "frecuenciaUrinaria", "Disminuida (<4)")} />
                             </div>
                         </div>
                         {/* Síntomas Urinarios (Checkbox group) */}
                         <div className="md:col-span-2">
                             <Label className="block mb-1 text-sm font-medium">Síntomas Urinarios</Label>
                             <div className="flex flex-wrap gap-2">
                                 <WordButton label="Incontinencia" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("Incontinencia")} onClick={() => handleCheckboxChange("genitoUrinario", "sintomasUrinarios", "Incontinencia", !formValues.genitoUrinario.sintomasUrinarios.includes("Incontinencia"))} />
                                 <WordButton label="Disuria (Dolor/Ardor)" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("Dolor al orinar (disuria)")} onClick={() => handleCheckboxChange("genitoUrinario", "sintomasUrinarios", "Dolor al orinar (disuria)", !formValues.genitoUrinario.sintomasUrinarios.includes("Dolor al orinar (disuria)"))} />
                                 <WordButton label="Hematuria (Sangre)" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("Sangre en orina (hematuria)")} onClick={() => handleCheckboxChange("genitoUrinario", "sintomasUrinarios", "Sangre en orina (hematuria)", !formValues.genitoUrinario.sintomasUrinarios.includes("Sangre en orina (hematuria)"))} />
                                 <WordButton label="Poliuria (Orina excesiva)" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("Orina en exceso (poliuria)")} onClick={() => handleCheckboxChange("genitoUrinario", "sintomasUrinarios", "Orina en exceso (poliuria)", !formValues.genitoUrinario.sintomasUrinarios.includes("Orina en exceso (poliuria)"))} />
                                 <WordButton label="Nicturia (Orinar de noche)" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("Orinar de noche (nicturia)")} onClick={() => handleCheckboxChange("genitoUrinario", "sintomasUrinarios", "Orinar de noche (nicturia)", !formValues.genitoUrinario.sintomasUrinarios.includes("Orinar de noche (nicturia)"))} />
                                 <WordButton label="Dolor Lumbar/Renal" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("Dolor lumbar")} onClick={() => handleCheckboxChange("genitoUrinario", "sintomasUrinarios", "Dolor lumbar", !formValues.genitoUrinario.sintomasUrinarios.includes("Dolor lumbar"))} />
                                  <WordButton label="Tenesmo Vesical" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("Tenesmo vesical")} onClick={() => handleCheckboxChange("genitoUrinario", "sintomasUrinarios", "Tenesmo vesical", !formValues.genitoUrinario.sintomasUrinarios.includes("Tenesmo vesical"))} />
                                 <WordButton label="Ninguno" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("Ninguno")} onClick={() => handleCheckboxChange("genitoUrinario", "sintomasUrinarios", "Ninguno", !formValues.genitoUrinario.sintomasUrinarios.includes("Ninguno"))} />
                             </div>
                         </div>
                          {/* Urgencia urinaria */}
                         <div>
                             <Label className="block mb-1 text-sm font-medium">Urgencia urinaria</Label>
                             <div className="flex flex-wrap gap-2">
                                 <WordButton label="Sí" isSelected={formValues.genitoUrinario.urgenciaUrinaria === "Sí"} onClick={() => handleRadioChange("genitoUrinario", "urgenciaUrinaria", "Sí")} />
                                 <WordButton label="No" isSelected={formValues.genitoUrinario.urgenciaUrinaria === "No"} onClick={() => handleRadioChange("genitoUrinario", "urgenciaUrinaria", "No")} />
                             </div>
                         </div>
                         {/* Chorro urinario débil */}
                         <div>
                             <Label className="block mb-1 text-sm font-medium">Chorro urinario débil</Label>
                             <div className="flex flex-wrap gap-2">
                                 <WordButton label="Sí" isSelected={formValues.genitoUrinario.chorroUrinarioDebil === "Sí"} onClick={() => handleRadioChange("genitoUrinario", "chorroUrinarioDebil", "Sí")} />
                                 <WordButton label="No" isSelected={formValues.genitoUrinario.chorroUrinarioDebil === "No"} onClick={() => handleRadioChange("genitoUrinario", "chorroUrinarioDebil", "No")} />
                             </div>
                         </div>
                         {/* Chorro urinario intermitente */}
                         <div>
                             <Label className="block mb-1 text-sm font-medium">Chorro urinario intermitente</Label>
                             <div className="flex flex-wrap gap-2">
                                 <WordButton label="Sí" isSelected={formValues.genitoUrinario.chorroUrinarioIntermitente === "Sí"} onClick={() => handleRadioChange("genitoUrinario", "chorroUrinarioIntermitente", "Sí")} />
                                 <WordButton label="No" isSelected={formValues.genitoUrinario.chorroUrinarioIntermitente === "No"} onClick={() => handleRadioChange("genitoUrinario", "chorroUrinarioIntermitente", "No")} />
                             </div>
                         </div>
                         {/* Flujo vaginal/uretral anormal */}
                         <div>
                             <Label className="block mb-1 text-sm font-medium">Flujo vaginal/uretral anormal</Label>
                             <div className="flex flex-wrap gap-2">
                                 <WordButton label="Sí" isSelected={formValues.genitoUrinario.flujoVaginalUretral === "Sí"} onClick={() => handleRadioChange("genitoUrinario", "flujoVaginalUretral", "Sí")} />
                                 <WordButton label="No" isSelected={formValues.genitoUrinario.flujoVaginalUretral === "No"} onClick={() => handleRadioChange("genitoUrinario", "flujoVaginalUretral", "No")} />
                             </div>
                         </div>
                         {/* Infecciones urinarias frecuentes */}
                         <div>
                             <Label className="block mb-1 text-sm font-medium">Infecciones urinarias frecuentes</Label>
                             <div className="flex flex-wrap gap-2">
                                 <WordButton label="Sí" isSelected={formValues.genitoUrinario.infeccionesUrinarias === "Sí"} onClick={() => handleRadioChange("genitoUrinario", "infeccionesUrinarias", "Sí")} />
                                 <WordButton label="No" isSelected={formValues.genitoUrinario.infeccionesUrinarias === "No"} onClick={() => handleRadioChange("genitoUrinario", "infeccionesUrinarias", "No")} />
                             </div>
                         </div>
                         {/* --- Sección solo mujeres --- */}
                         <div className="md:col-span-2 mt-4 border-t pt-4 border-gray-300 dark:border-gray-600">
                             <h5 className="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-400">Información Gineco-Obstétrica (si aplica)</h5>
                             <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                                 <div>
                                     <Label htmlFor="ultimaMenstruacion" className="block mb-1 text-sm font-medium">Fecha de Última Menstruación (FUM)</Label>
                                     <input id="ultimaMenstruacion" type="date" value={formValues.genitoUrinario.ultimaMenstruacion} onChange={(e) => handleTextChange("genitoUrinario", "ultimaMenstruacion", e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700"/>
                                 </div>
                                 <div>
                                     <Label className="block mb-1 text-sm font-medium">Dismenorrea (Dolor Menstrual)</Label>
                                     <div className="flex flex-wrap gap-2">
                                         <WordButton label="Sí" isSelected={formValues.genitoUrinario.dismenorrea === "Sí"} onClick={() => handleRadioChange("genitoUrinario", "dismenorrea", "Sí")} />
                                         <WordButton label="No" isSelected={formValues.genitoUrinario.dismenorrea === "No"} onClick={() => handleRadioChange("genitoUrinario", "dismenorrea", "No")} />
                                     </div>
                                 </div>
                                 <div>
                                     <Label className="block mb-1 text-sm font-medium">Días de Duración del Ciclo</Label>
                                     <div className="flex flex-wrap gap-2">
                                          <WordButton label="Regular (25-35 días)" isSelected={formValues.genitoUrinario.duracionMenstruacion === "Regular"} onClick={() => handleRadioChange("genitoUrinario", "duracionMenstruacion", "Regular")} />
                                          <WordButton label="Irregular" isSelected={formValues.genitoUrinario.duracionMenstruacion === "Irregular"} onClick={() => handleRadioChange("genitoUrinario", "duracionMenstruacion", "Irregular")} />
                                          {/* Podrías agregar campo de texto si es irregular */}
                                     </div>
                                 </div>
                                 <div>
                                     <Label htmlFor="ultimoParto" className="block mb-1 text-sm font-medium">Fecha de Último Parto (FUP)</Label>
                                     <input id="ultimoParto" type="date" value={formValues.genitoUrinario.ultimoParto} onChange={(e) => handleTextChange("genitoUrinario", "ultimoParto", e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700"/>
                                 </div>
                                 <div className="md:col-span-2">
                                     <Label className="block mb-1 text-sm font-medium">Antecedentes Obstétricos (Gesta, Para, Cesárea, Aborto)</Label>
                                      <Textarea placeholder="Ej: G3 P2 C1 A0" value={formValues.genitoUrinario.antecedentesObstetricos} onChange={(e) => handleTextChange("genitoUrinario", "antecedentesObstetricos", e.target.value)} className="w-full mt-1" rows={2}/>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>

                {/* --- SISTEMA ENDOCRINO --- */}
                 <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                     <h4 className="text-lg font-semibold mb-3 text-justify">Sistema Endocrino</h4>
                     <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                         {/* Síntomas Endocrinos (Checkbox group) */}
                         <div className="md:col-span-2">
                             <Label className="block mb-1 text-sm font-medium">Síntomas Clásicos (Diabetes/Tiroides)</Label>
                             <div className="flex flex-wrap gap-2">
                                 <WordButton label="Poliuria (Orinar mucho)" isSelected={formValues.endocrino.sintomasEndocrinos.includes("Poliuria")} onClick={() => handleCheckboxChange("endocrino", "sintomasEndocrinos", "Poliuria", !formValues.endocrino.sintomasEndocrinos.includes("Poliuria"))} />
                                 <WordButton label="Polidipsia (Sed excesiva)" isSelected={formValues.endocrino.sintomasEndocrinos.includes("Polidipsia")} onClick={() => handleCheckboxChange("endocrino", "sintomasEndocrinos", "Polidipsia", !formValues.endocrino.sintomasEndocrinos.includes("Polidipsia"))} />
                                 <WordButton label="Polifagia (Hambre excesiva)" isSelected={formValues.endocrino.sintomasEndocrinos.includes("Polifagia")} onClick={() => handleCheckboxChange("endocrino", "sintomasEndocrinos", "Polifagia", !formValues.endocrino.sintomasEndocrinos.includes("Polifagia"))} />
                                 <WordButton label="Exoftalmos (Ojos saltones)" isSelected={formValues.endocrino.sintomasEndocrinos.includes("Exoftalmos (ojos saltones)")} onClick={() => handleCheckboxChange("endocrino", "sintomasEndocrinos", "Exoftalmos (ojos saltones)", !formValues.endocrino.sintomasEndocrinos.includes("Exoftalmos (ojos saltones)"))} />
                                 <WordButton label="Nerviosismo/Ansiedad" isSelected={formValues.endocrino.sintomasEndocrinos.includes("Nerviosismo")} onClick={() => handleCheckboxChange("endocrino", "sintomasEndocrinos", "Nerviosismo", !formValues.endocrino.sintomasEndocrinos.includes("Nerviosismo"))} />
                                 <WordButton label="Temblores" isSelected={formValues.endocrino.sintomasEndocrinos.includes("Temblores")} onClick={() => handleCheckboxChange("endocrino", "sintomasEndocrinos", "Temblores", !formValues.endocrino.sintomasEndocrinos.includes("Temblores"))} />
                                 <WordButton label="Insomnio" isSelected={formValues.endocrino.sintomasEndocrinos.includes("Insomnio")} onClick={() => handleCheckboxChange("endocrino", "sintomasEndocrinos", "Insomnio", !formValues.endocrino.sintomasEndocrinos.includes("Insomnio"))} />
                                 <WordButton label="Ninguno" isSelected={formValues.endocrino.sintomasEndocrinos.includes("Ninguno")} onClick={() => handleCheckboxChange("endocrino", "sintomasEndocrinos", "Ninguno", !formValues.endocrino.sintomasEndocrinos.includes("Ninguno"))} />
                             </div>
                         </div>
                         {/* Sudoración nocturna */}
                         <div>
                             <Label className="block mb-1 text-sm font-medium">Sudoración excesiva nocturna</Label>
                             <div className="flex flex-wrap gap-2">
                                 <WordButton label="Sí" isSelected={formValues.endocrino.sudoracionNocturna === "Sí"} onClick={() => handleRadioChange("endocrino", "sudoracionNocturna", "Sí")} />
                                 <WordButton label="No" isSelected={formValues.endocrino.sudoracionNocturna === "No"} onClick={() => handleRadioChange("endocrino", "sudoracionNocturna", "No")} />
                             </div>
                         </div>
                         {/* Hirsutismo */}
                         <div>
                             <Label className="block mb-1 text-sm font-medium">Hirsutismo (vello excesivo en mujeres)</Label>
                             <div className="flex flex-wrap gap-2">
                                 <WordButton label="Sí" isSelected={formValues.endocrino.hirsutismo === "Sí"} onClick={() => handleRadioChange("endocrino", "hirsutismo", "Sí")} />
                                 <WordButton label="No" isSelected={formValues.endocrino.hirsutismo === "No"} onClick={() => handleRadioChange("endocrino", "hirsutismo", "No")} />
                             </div>
                         </div>
                         {/* Galactorrea */}
                         <div>
                             <Label className="block mb-1 text-sm font-medium">Galactorrea (secreción mamaria)</Label>
                             <div className="flex flex-wrap gap-2">
                                 <WordButton label="Sí" isSelected={formValues.endocrino.galactorrea === "Sí"} onClick={() => handleRadioChange("endocrino", "galactorrea", "Sí")} />
                                 <WordButton label="No" isSelected={formValues.endocrino.galactorrea === "No"} onClick={() => handleRadioChange("endocrino", "galactorrea", "No")} />
                             </div>
                         </div>
                         {/* Cambios en el ritmo menstrual */}
                         <div>
                             <Label className="block mb-1 text-sm font-medium">Cambios en el ritmo menstrual (mujeres)</Label>
                             <div className="flex flex-wrap gap-2">
                                 <WordButton label="Retrasos (Oligomenorrea)" isSelected={formValues.endocrino.cambiosRitmoMenstrual === "Retrasos"} onClick={() => handleRadioChange("endocrino", "cambiosRitmoMenstrual", "Retrasos")} />
                                 <WordButton label="Ausencia (Amenorrea)" isSelected={formValues.endocrino.cambiosRitmoMenstrual === "Amenorrea"} onClick={() => handleRadioChange("endocrino", "cambiosRitmoMenstrual", "Amenorrea")} />
                                 <WordButton label="Ciclos cortos (Polimenorrea)" isSelected={formValues.endocrino.cambiosRitmoMenstrual === "Ciclos cortos"} onClick={() => handleRadioChange("endocrino", "cambiosRitmoMenstrual", "Ciclos cortos")} />
                                  {/* *** Nueva Opción *** */}
                                 <WordButton label="Sin cambios en el ritmo menstrual" isSelected={formValues.endocrino.cambiosRitmoMenstrual === "Sin cambios en el ritmo menstrual"} onClick={() => handleRadioChange("endocrino", "cambiosRitmoMenstrual", "Sin cambios en el ritmo menstrual")} />
                             </div>
                         </div>
                         {/* Cambios de Peso */}
                         <div>
                             <Label className="block mb-1 text-sm font-medium">Cambios de Peso Inexplicados</Label>
                             <div className="flex flex-wrap gap-2">
                                 <WordButton label="Pérdida" isSelected={formValues.endocrino.cambiosPeso === "Perdida"} onClick={() => handleRadioChange("endocrino", "cambiosPeso", "Perdida")} />
                                 <WordButton label="Aumento" isSelected={formValues.endocrino.cambiosPeso === "Aumento"} onClick={() => handleRadioChange("endocrino", "cambiosPeso", "Aumento")} />
                                 <WordButton label="No" isSelected={formValues.endocrino.cambiosPeso === "No"} onClick={() => handleRadioChange("endocrino", "cambiosPeso", "No")} />
                             </div>
                         </div>
                         {/* Intolerancia Frío/Calor */}
                         <div>
                             <Label className="block mb-1 text-sm font-medium">Intolerancia al Frío o Calor</Label>
                             <div className="flex flex-wrap gap-2">
                                 <WordButton label="Frío" isSelected={formValues.endocrino.intolerancia === "Frío"} onClick={() => handleRadioChange("endocrino", "intolerancia", "Frío")} />
                                 <WordButton label="Calor" isSelected={formValues.endocrino.intolerancia === "Calor"} onClick={() => handleRadioChange("endocrino", "intolerancia", "Calor")} />
                                 <WordButton label="No" isSelected={formValues.endocrino.intolerancia === "No"} onClick={() => handleRadioChange("endocrino", "intolerancia", "No")} />
                             </div>
                         </div>
                         {/* Condiciones Endocrinas */}
                         <div>
                             <Label className="block mb-1 text-sm font-medium">Condiciones Endocrinas Conocidas</Label>
                             <div className="flex flex-wrap gap-2">
                                 <WordButton label="Hipotiroidismo" isSelected={formValues.endocrino.condicionesEndocrinas === "Hipotiroidismo"} onClick={() => handleRadioChange("endocrino", "condicionesEndocrinas", "Hipotiroidismo")} />
                                 <WordButton label="Hipertiroidismo" isSelected={formValues.endocrino.condicionesEndocrinas === "Hipertiroidismo"} onClick={() => handleRadioChange("endocrino", "condicionesEndocrinas", "Hipertiroidismo")} />
                                  <WordButton label="Diabetes Mellitus" isSelected={formValues.endocrino.condicionesEndocrinas === "Diabetes Mellitus"} onClick={() => handleRadioChange("endocrino", "condicionesEndocrinas", "Diabetes Mellitus")} />
                                 <WordButton label="Otra" isSelected={formValues.endocrino.condicionesEndocrinas === "Otra"} onClick={() => handleRadioChange("endocrino", "condicionesEndocrinas", "Otra")} />
                                 <WordButton label="Ninguno" isSelected={formValues.endocrino.condicionesEndocrinas === "Ninguno"} onClick={() => handleRadioChange("endocrino", "condicionesEndocrinas", "Ninguno")} />
                             </div>
                             {/* Podrías agregar Textarea si selecciona Otra */}
                         </div>
                     </div>
                 </div>

                {/* --- SISTEMA TEGUMENTARIO --- */}
                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                     <h4 className="text-lg font-semibold mb-3 text-justify">Sistema Tegumentario (Piel y Anexos)</h4>
                     <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                         {/* Cambios en la Coloración de la Piel */}
                         <div>
                             <Label className="block mb-1 text-sm font-medium">Cambios en la Coloración de la Piel</Label>
                             <div className="flex flex-wrap gap-2">
                                 <WordButton label="Sí" isSelected={formValues.tegumentario.cambiosColoracion === "Sí"} onClick={() => handleRadioChange("tegumentario", "cambiosColoracion", "Sí")} />
                                 <WordButton label="No" isSelected={formValues.tegumentario.cambiosColoracion === "No"} onClick={() => handleRadioChange("tegumentario", "cambiosColoracion", "No")} />
                             </div>
                             {formValues.tegumentario.cambiosColoracion === "Sí" && (
                               <Textarea placeholder="Especifique cambios (ictericia, palidez, cianosis...)" value={formValues.tegumentario.cambiosColoracionEspecificaciones} onChange={(e) => handleTextChange("tegumentario", "cambiosColoracionEspecificaciones", e.target.value)} className="w-full mt-2" rows={2}/>
                             )}
                         </div>
                         {/* Síntomas Tegumentarios (Checkbox group) */}
                         <div className="md:col-span-2">
                             <Label className="block mb-1 text-sm font-medium">Otros Síntomas en Piel</Label>
                             <div className="flex flex-wrap gap-2">
                                 <WordButton label="Erupciones/Ronchas" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("Erupciones")} onClick={() => handleCheckboxChange("tegumentario", "sintomasTegumentarios", "Erupciones", !formValues.tegumentario.sintomasTegumentarios.includes("Erupciones"))} />
                                 <WordButton label="Prurito (Comezón)" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("Prurito (comezón)")} onClick={() => handleCheckboxChange("tegumentario", "sintomasTegumentarios", "Prurito (comezón)", !formValues.tegumentario.sintomasTegumentarios.includes("Prurito (comezón)"))} />
                                 <WordButton label="Hiperhidrosis (Sudoración excesiva)" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("Hiperhidrosis (sudoración excesiva)")} onClick={() => handleCheckboxChange("tegumentario", "sintomasTegumentarios", "Hiperhidrosis (sudoración excesiva)", !formValues.tegumentario.sintomasTegumentarios.includes("Hiperhidrosis (sudoración excesiva)"))} />
                                 <WordButton label="Pérdida de Pelo/Vello (Alopecia)" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("Pérdida de pelo o vello")} onClick={() => handleCheckboxChange("tegumentario", "sintomasTegumentarios", "Pérdida de pelo o vello", !formValues.tegumentario.sintomasTegumentarios.includes("Pérdida de pelo o vello"))} />
                                 <WordButton label="Piel Seca (Xerosis)" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("Piel seca")} onClick={() => handleCheckboxChange("tegumentario", "sintomasTegumentarios", "Piel seca", !formValues.tegumentario.sintomasTegumentarios.includes("Piel seca"))} />
                                 <WordButton label="Ninguno" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("Ninguno")} onClick={() => handleCheckboxChange("tegumentario", "sintomasTegumentarios", "Ninguno", !formValues.tegumentario.sintomasTegumentarios.includes("Ninguno"))} />
                             </div>
                         </div>
                         {/* Cambios en uñas */}
                         <div>
                             <Label className="block mb-1 text-sm font-medium">Cambios en Uñas</Label>
                             <div className="flex flex-wrap gap-2">
                                 <WordButton label="Frágiles" isSelected={formValues.tegumentario.cambiosUnas === "Frágiles"} onClick={() => handleRadioChange("tegumentario", "cambiosUnas", "Frágiles")} />
                                 <WordButton label="Quebradizas" isSelected={formValues.tegumentario.cambiosUnas === "Quebradizas"} onClick={() => handleRadioChange("tegumentario", "cambiosUnas", "Quebradizas")} />
                                 <WordButton label="Deformadas" isSelected={formValues.tegumentario.cambiosUnas === "Deformadas"} onClick={() => handleRadioChange("tegumentario", "cambiosUnas", "Deformadas")} />
                                  {/* *** Nueva Opción *** */}
                                 <WordButton label="Sin cambios" isSelected={formValues.tegumentario.cambiosUnas === "Sin cambios"} onClick={() => handleRadioChange("tegumentario", "cambiosUnas", "Sin cambios")} />
                             </div>
                         </div>
                         {/* Cambios en lunares */}
                         <div>
                             <Label className="block mb-1 text-sm font-medium">Cambios recientes en Lunares</Label>
                             <div className="flex flex-wrap gap-2">
                                 <WordButton label="Sí" isSelected={formValues.tegumentario.cambiosLunares === "Sí"} onClick={() => handleRadioChange("tegumentario", "cambiosLunares", "Sí")} />
                                 <WordButton label="No" isSelected={formValues.tegumentario.cambiosLunares === "No"} onClick={() => handleRadioChange("tegumentario", "cambiosLunares", "No")} />
                             </div>
                         </div>
                         {/* Lesiones pigmentadas */}
                         <div>
                             <Label className="block mb-1 text-sm font-medium">Aparición de Lesiones Pigmentadas Nuevas</Label>
                             <div className="flex flex-wrap gap-2">
                                 <WordButton label="Sí" isSelected={formValues.tegumentario.lesionesPigmentadas === "Sí"} onClick={() => handleRadioChange("tegumentario", "lesionesPigmentadas", "Sí")} />
                                 <WordButton label="No" isSelected={formValues.tegumentario.lesionesPigmentadas === "No"} onClick={() => handleRadioChange("tegumentario", "lesionesPigmentadas", "No")} />
                             </div>
                         </div>
                     </div>
                 </div>

                {/* --- SISTEMA MÚSCULO-ESQUELÉTICO --- */}
                 <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                     <h4 className="text-lg font-semibold mb-3 text-justify">Sistema Músculo-Esquelético</h4>
                     <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                         {/* Fracturas o Esguinces */}
                         <div>
                             <Label className="block mb-1 text-sm font-medium">Antecedentes de Fracturas o Esguinces</Label>
                             <div className="flex flex-wrap gap-2">
                                 <WordButton label="Sí" isSelected={formValues.musculoEsqueletico.fracturas === "Sí"} onClick={() => handleRadioChange("musculoEsqueletico", "fracturas", "Sí")} />
                                 <WordButton label="No" isSelected={formValues.musculoEsqueletico.fracturas === "No"} onClick={() => handleRadioChange("musculoEsqueletico", "fracturas", "No")} />
                             </div>
                         </div>
                         {/* Detalles de Fracturas */}
                         <div>
                             <Label className="block mb-1 text-sm font-medium">Detalles (si hubo fracturas/esguinces)</Label>
                              <Textarea placeholder="Tipo, localización, fecha..." value={formValues.musculoEsqueletico.detallesFracturas} onChange={(e) => handleTextChange("musculoEsqueletico", "detallesFracturas", e.target.value)} className="w-full mt-1" rows={2} disabled={formValues.musculoEsqueletico.fracturas !== 'Sí'}/>
                         </div>
                         {/* Síntomas Musculoesqueléticos (Checkbox group) */}
                         <div className="md:col-span-2">
                             <Label className="block mb-1 text-sm font-medium">Síntomas Musculoesqueléticos Actuales</Label>
                             <div className="flex flex-wrap gap-2">
                                 <WordButton label="Dolor Articular (Artralgia)" isSelected={formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Dolor articular")} onClick={() => handleCheckboxChange("musculoEsqueletico", "sintomasMusculoEsqueleticos", "Dolor articular", !formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Dolor articular"))} />
                                 <WordButton label="Dolor Muscular (Mialgia)" isSelected={formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Dolor muscular")} onClick={() => handleCheckboxChange("musculoEsqueletico", "sintomasMusculoEsqueleticos", "Dolor muscular", !formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Dolor muscular"))} />
                                  <WordButton label="Inflamación Articular" isSelected={formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Inflamación articular")} onClick={() => handleCheckboxChange("musculoEsqueletico", "sintomasMusculoEsqueleticos", "Inflamación articular", !formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Inflamación articular"))} />
                                 <WordButton label="Deformidad Articular" isSelected={formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Deformidad articular")} onClick={() => handleCheckboxChange("musculoEsqueletico", "sintomasMusculoEsqueleticos", "Deformidad articular", !formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Deformidad articular"))} />
                                 <WordButton label="Calambres Frecuentes" isSelected={formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Calambres musculares frecuentes")} onClick={() => handleCheckboxChange("musculoEsqueletico", "sintomasMusculoEsqueleticos", "Calambres musculares frecuentes", !formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Calambres musculares frecuentes"))} />
                                 <WordButton label="Ninguno" isSelected={formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Ninguno")} onClick={() => handleCheckboxChange("musculoEsqueletico", "sintomasMusculoEsqueleticos", "Ninguno", !formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Ninguno"))} />
                             </div>
                         </div>
                         {/* Rigidez matutina */}
                         <div>
                             <Label className="block mb-1 text-sm font-medium">Rigidez Matutina (Duración)</Label>
                             <div className="flex flex-wrap gap-2">
                                 <WordButton label="Menos de 30 min" isSelected={formValues.musculoEsqueletico.rigidezMatutina === "Menos de 30 min"} onClick={() => handleRadioChange("musculoEsqueletico", "rigidezMatutina", "Menos de 30 min")} />
                                 <WordButton label="Más de 30 min" isSelected={formValues.musculoEsqueletico.rigidezMatutina === "Más de 30 min"} onClick={() => handleRadioChange("musculoEsqueletico", "rigidezMatutina", "Más de 30 min")} />
                                  {/* *** Nueva Opción *** */}
                                 <WordButton label="No presenta rigidez matutina" isSelected={formValues.musculoEsqueletico.rigidezMatutina === "No presenta rigidez matutina"} onClick={() => handleRadioChange("musculoEsqueletico", "rigidezMatutina", "No presenta rigidez matutina")} />
                             </div>
                         </div>
                         {/* Debilidad muscular */}
                         <div>
                             <Label className="block mb-1 text-sm font-medium">Debilidad Muscular</Label>
                             <div className="flex flex-wrap gap-2">
                                 <WordButton label="Generalizada" isSelected={formValues.musculoEsqueletico.debilidadMuscular === "Generalizada"} onClick={() => handleRadioChange("musculoEsqueletico", "debilidadMuscular", "Generalizada")} />
                                 <WordButton label="Localizada" isSelected={formValues.musculoEsqueletico.debilidadMuscular === "Localizada"} onClick={() => handleRadioChange("musculoEsqueletico", "debilidadMuscular", "Localizada")} />
                                 <WordButton label="No" isSelected={formValues.musculoEsqueletico.debilidadMuscular === "No"} onClick={() => handleRadioChange("musculoEsqueletico", "debilidadMuscular", "No")} />
                             </div>
                              {/* Podrías agregar Textarea si es localizada */}
                         </div>
                         {/* Limitaciones de Movimiento */}
                         <div className="md:col-span-2">
                             <Label className="block mb-1 text-sm font-medium">Limitaciones de Movimiento</Label>
                              <Textarea placeholder="Articulaciones afectadas, tipo de limitación..." value={formValues.musculoEsqueletico.limitacionesMovimiento} onChange={(e) => handleTextChange("musculoEsqueletico", "limitacionesMovimiento", e.target.value)} className="w-full mt-1" rows={2}/>
                         </div>
                     </div>
                 </div>

                {/* --- SISTEMA NERVIOSO --- */}
                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold mb-3 text-justify">Sistema Nervioso</h4>
                    <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                        {/* Percepción de los Sentidos */}
                        <div>
                            <Label className="block mb-1 text-sm font-medium">Alteración en Órganos de los Sentidos</Label>
                             <div className="flex flex-wrap gap-2">
                                <WordButton label="Visión" isSelected={formValues.nervioso.percepcionSentidos === "Visión"} onClick={() => handleRadioChange("nervioso", "percepcionSentidos", "Visión")} />
                                <WordButton label="Audición" isSelected={formValues.nervioso.percepcionSentidos === "Audición"} onClick={() => handleRadioChange("nervioso", "percepcionSentidos", "Audición")} />
                                <WordButton label="Olfato" isSelected={formValues.nervioso.percepcionSentidos === "Olfato"} onClick={() => handleRadioChange("nervioso", "percepcionSentidos", "Olfato")} />
                                <WordButton label="Gusto" isSelected={formValues.nervioso.percepcionSentidos === "Gusto"} onClick={() => handleRadioChange("nervioso", "percepcionSentidos", "Gusto")} />
                                <WordButton label="Tacto" isSelected={formValues.nervioso.percepcionSentidos === "Tacto"} onClick={() => handleRadioChange("nervioso", "percepcionSentidos", "Tacto")} />
                                <WordButton label="Ninguna" isSelected={formValues.nervioso.percepcionSentidos === "Ninguna"} onClick={() => handleRadioChange("nervioso", "percepcionSentidos", "Ninguna")} />
                            </div>
                        </div>
                        {/* Horas de Sueño */}
                        <div>
                            <Label className="block mb-1 text-sm font-medium">Horas de Sueño Habituales por Noche</Label>
                            <div className="flex flex-wrap gap-2">
                                <WordButton label="Menos de 4" isSelected={formValues.nervioso.horasSueno === "Menos de 4"} onClick={() => handleRadioChange("nervioso", "horasSueno", "Menos de 4")} />
                                <WordButton label="4 a 6" isSelected={formValues.nervioso.horasSueno === "4 a 6"} onClick={() => handleRadioChange("nervioso", "horasSueno", "4 a 6")} />
                                <WordButton label="7 a 8" isSelected={formValues.nervioso.horasSueno === "7 a 8"} onClick={() => handleRadioChange("nervioso", "horasSueno", "7 a 8")} />
                                <WordButton label="Más de 8" isSelected={formValues.nervioso.horasSueno === "Más de 8"} onClick={() => handleRadioChange("nervioso", "horasSueno", "Más de 8")} />
                            </div>
                        </div>
                        {/* Trastornos del Sueño */}
                        <div>
                            <Label className="block mb-1 text-sm font-medium">Trastornos del Sueño</Label>
                            <div className="flex flex-wrap gap-2">
                                <WordButton label="Sí" isSelected={formValues.nervioso.trastornosSueno === "Sí"} onClick={() => handleRadioChange("nervioso", "trastornosSueno", "Sí")} />
                                <WordButton label="No" isSelected={formValues.nervioso.trastornosSueno === "No"} onClick={() => handleRadioChange("nervioso", "trastornosSueno", "No")} />
                            </div>
                            {formValues.nervioso.trastornosSueno === "Sí" && (
                              <Textarea placeholder="Insomnio, somnolencia diurna, pesadillas..." value={formValues.nervioso.trastornosSuenoEspecificaciones} onChange={(e) => handleTextChange("nervioso", "trastornosSuenoEspecificaciones", e.target.value)} className="w-full mt-2" rows={2}/>
                            )}
                        </div>
                        {/* Estado de Ánimo */}
                        <div>
                            <Label className="block mb-1 text-sm font-medium">Estado de Ánimo Predominante</Label>
                            <div className="flex flex-wrap gap-2">
                                <WordButton label="Tranquilo/Eutímico" isSelected={formValues.nervioso.estadoAnimo === "Tranquilo"} onClick={() => handleRadioChange("nervioso", "estadoAnimo", "Tranquilo")} />
                                <WordButton label="Irritable" isSelected={formValues.nervioso.estadoAnimo === "Irritable"} onClick={() => handleRadioChange("nervioso", "estadoAnimo", "Irritable")} />
                                <WordButton label="Ansioso/Aprensivo" isSelected={formValues.nervioso.estadoAnimo === "Aprensivo"} onClick={() => handleRadioChange("nervioso", "estadoAnimo", "Aprensivo")} />
                                <WordButton label="Triste/Deprimido" isSelected={formValues.nervioso.estadoAnimo === "Triste"} onClick={() => handleRadioChange("nervioso", "estadoAnimo", "Triste")} />
                                <WordButton label="Variable" isSelected={formValues.nervioso.estadoAnimo === "Variable"} onClick={() => handleRadioChange("nervioso", "estadoAnimo", "Variable")} />
                            </div>
                        </div>
                        {/* Parestesias */}
                        <div>
                            <Label className="block mb-1 text-sm font-medium">Parestesias (Hormigueo/Adormecimiento)</Label>
                            <div className="flex flex-wrap gap-2">
                                <WordButton label="Sí" isSelected={formValues.nervioso.parestesias === "Sí"} onClick={() => handleRadioChange("nervioso", "parestesias", "Sí")} />
                                <WordButton label="No" isSelected={formValues.nervioso.parestesias === "No"} onClick={() => handleRadioChange("nervioso", "parestesias", "No")} />
                            </div>
                             {/* Podrías agregar Textarea para localización si es Sí */}
                        </div>
                        {/* Otros Síntomas Neurológicos (Checkbox group) */}
                        <div className="md:col-span-2">
                            <Label className="block mb-1 text-sm font-medium">Otros Síntomas Neurológicos</Label>
                            <div className="flex flex-wrap gap-2">
                                <WordButton label="Convulsiones" isSelected={formValues.nervioso.otrosSintomasNeurologicos.includes("Convulsiones")} onClick={() => handleCheckboxChange("nervioso", "otrosSintomasNeurologicos", "Convulsiones", !formValues.nervioso.otrosSintomasNeurologicos.includes("Convulsiones"))} />
                                <WordButton label="Temblores (no asociados a nerviosismo)" isSelected={formValues.nervioso.otrosSintomasNeurologicos.includes("Temblores")} onClick={() => handleCheckboxChange("nervioso", "otrosSintomasNeurologicos", "Temblores", !formValues.nervioso.otrosSintomasNeurologicos.includes("Temblores"))} />
                                <WordButton label="Problemas de Memoria/Concentración" isSelected={formValues.nervioso.otrosSintomasNeurologicos.includes("Problemas de memoria o concentración")} onClick={() => handleCheckboxChange("nervioso", "otrosSintomasNeurologicos", "Problemas de memoria o concentración", !formValues.nervioso.otrosSintomasNeurologicos.includes("Problemas de memoria o concentración"))} />
                                <WordButton label="Cambios de Personalidad/Comportamiento" isSelected={formValues.nervioso.otrosSintomasNeurologicos.includes("Cambios de personalidad o comportamiento")} onClick={() => handleCheckboxChange("nervioso", "otrosSintomasNeurologicos", "Cambios de personalidad o comportamiento", !formValues.nervioso.otrosSintomasNeurologicos.includes("Cambios de personalidad o comportamiento"))} />
                                <WordButton label="Problemas de Coordinación/Equilibrio" isSelected={formValues.nervioso.otrosSintomasNeurologicos.includes("Coordinación motora alterada")} onClick={() => handleCheckboxChange("nervioso", "otrosSintomasNeurologicos", "Coordinación motora alterada", !formValues.nervioso.otrosSintomasNeurologicos.includes("Coordinación motora alterada"))} />
                                <WordButton label="Vértigo/Mareo Intenso" isSelected={formValues.nervioso.otrosSintomasNeurologicos.includes("Vértigo")} onClick={() => handleCheckboxChange("nervioso", "otrosSintomasNeurologicos", "Vértigo", !formValues.nervioso.otrosSintomasNeurologicos.includes("Vértigo"))} />
                                <WordButton label="Ninguno" isSelected={formValues.nervioso.otrosSintomasNeurologicos.includes("Ninguno")} onClick={() => handleCheckboxChange("nervioso", "otrosSintomasNeurologicos", "Ninguno", !formValues.nervioso.otrosSintomasNeurologicos.includes("Ninguno"))} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center items-center gap-4 pt-4">
                  <Button onClick={generateAndUpdateRedacciones} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow hover:shadow-md transition-all duration-300">
                    Generar Redacción IA
                  </Button>
                  <Button onClick={resetForm} variant="outline" className="flex items-center gap-2 text-gray-600 border-gray-300 hover:bg-gray-100 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors duration-300">
                    <Eraser className="w-4 h-4" />
                    Limpiar
                  </Button>
                </div>
              </div>
            ) : (
               // --- VISTA DE REDACCIONES ---
              <div className="space-y-6">
                {Object.entries(redacciones).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-lg font-semibold capitalize text-gray-800 dark:text-gray-200">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4> {/* Formatea el nombre del sistema */}
                            <button
                                onClick={() => handleCopy(key as keyof typeof redacciones)}
                                className="text-blue-500 hover:text-blue-700 flex items-center gap-1 transition-colors duration-200 text-xs px-2 py-1 rounded border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/50"
                            >
                                {copied[key] ? (
                                    <>
                                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                        Copiado
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3.5 h-3.5" />
                                        Copiar
                                    </>
                                )}
                            </button>
                        </div>
                        <AnimatedTextarea
                            content={value}
                            className="min-h-[120px] bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-300 dark:border-gray-600 w-full resize-none text-sm leading-relaxed text-gray-700 dark:text-gray-300"
                            readOnly
                            textAlign="justify"
                         />
                    </div>
                ))}

                <div className="flex justify-center pt-4">
                    <Button onClick={() => setShowForm(true)} variant="outline" className="text-blue-600 border-blue-500 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-600 dark:hover:bg-gray-700 px-6 py-2 rounded-lg transition-colors duration-300">
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

// Componente WordButton (sin cambios, pero asegúrate que esté definido)
const WordButton = ({
  label,
  isSelected,
  onClick
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
      <button
          type="button" // Evita que actúe como submit en algunos navegadores
          onClick={onClick}
          className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ease-in-out border
                     ${isSelected
                         ? "bg-blue-500 text-white border-blue-500 shadow-sm"
                         : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                     }`}
      >
          {label}
      </button>
  );
};


export default InterrogatorioSistemas;