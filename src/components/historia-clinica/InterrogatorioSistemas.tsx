import React, { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X, Copy, CheckCircle, Eraser } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica'; // Asegúrate que esta ruta sea correcta
import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox"; // No se usa si solo usas WordButton
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AnimatedTextarea } from "@/components/ui/animated-textarea"; // Asegúrate que esta ruta sea correcta

interface InterrogatorioSistemasProps {
  formData: FormDataState; // Considera si realmente necesitas pasar todo formData como prop
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

  // Estado inicial del formulario (sin cambios respecto a la versión anterior con funcionalidad añadida)
  const [formValues, setFormValues] = useState({
        digestivo: { alimentacion: "", masticacion: "", percepcionGusto: "", percepcionGustoEspecificaciones: "", salivacion: "", deglusion: "", halitosis: "", halitosisEspecificaciones: "", sintomasDigestivos: [] as string[], cambiosApetito: "", habitosAlimenticios: "", colorEvacuaciones: "", hematemesis: "", frecuenciaEvacuacion: "", frecuenciaEvacuacionEspecificaciones: "" },
        respiratorio: { tipoRespiracion: "", sintomasRespiratorios: [] as string[], apneaSuenio: "", oxigenoSuplementario: "", tosExpectoracion: "" },
        cardiovascular: { dolorPecho: "", lipotimia: "", ritmoCardiaco: "", sintomasCardiovasculares: [] as string[], presionArterial: "", antecedentesInfarto: "", fatigaEsfuerzo: "" },
        genitoUrinario: { frecuenciaUrinaria: "", sintomasUrinarios: [] as string[], urgenciaUrinaria: "", chorroUrinarioDebil: "", chorroUrinarioIntermitente: "", flujoVaginalUretral: "", infeccionesUrinarias: "", ultimaMenstruacion: "", dismenorrea: "", duracionMenstruacion: "", ultimoParto: "", antecedentesObstetricos: "" },
        endocrino: { sintomasEndocrinos: [] as string[], sudoracionNocturna: "", hirsutismo: "", galactorrea: "", cambiosRitmoMenstrual: "", cambiosPeso: "", intolerancia: "", condicionesEndocrinas: "" },
        tegumentario: { cambiosColoracion: "", cambiosColoracionEspecificaciones: "", sintomasTegumentarios: [] as string[], cambiosUnas: "", cambiosLunares: "", lesionesPigmentadas: "" },
        musculoEsqueletico: { fracturas: "", detallesFracturas: "", sintomasMusculoEsqueleticos: [] as string[], rigidezMatutina: "", debilidadMuscular: "", limitacionesMovimiento: "" },
        nervioso: { percepcionSentidos: "", horasSueno: "", trastornosSueno: "", trastornosSuenoEspecificaciones: "", estadoAnimo: "", parestesias: "", otrosSintomasNeurologicos: [] as string[] }
    });

  // useEffect para generar redacción (sin cambios)
  useEffect(() => {
    if (showForm === false) {
      generateAndUpdateRedacciones();
    }
  }, [showForm]);

  // Handlers de minimizar, maximizar, cerrar (sin cambios)
  const handleMinimize = () => { setIsMinimized(!isMinimized); setIsMaximized(false); };
  const handleMaximize = () => { setIsMaximized(!isMaximized); setIsMinimized(false); };
  const handleClose = () => { setIsMinimized(false); setIsMaximized(false); };

  // Handlers de cambio (sin cambios)
  const handleRadioChange = (system: string, field: string, value: string) => {
    setFormValues(prev => ({ ...prev, [system]: { ...prev[system as keyof typeof prev], [field]: value } }));
  };
  const handleCheckboxChange = (system: string, field: string, value: string, checked: boolean) => {
      setFormValues(prev => {
        const currentSystemValues = prev[system as keyof typeof prev];
        const currentFieldValues = currentSystemValues[field as keyof typeof currentSystemValues] as string[];
        let updatedValues: string[];
        if (value === "Ninguno") { updatedValues = checked ? [value] : []; }
        else {
          let intermediateValues: string[];
          if (checked) { intermediateValues = [...currentFieldValues.filter(item => item !== "Ninguno"), value]; }
          else { intermediateValues = currentFieldValues.filter(item => item !== value); }
          updatedValues = intermediateValues;
        }
        return { ...prev, [system]: { ...currentSystemValues, [field]: updatedValues } };
      });
  };
  const handleTextChange = (system: string, field: string, value: string) => {
    setFormValues(prev => ({ ...prev, [system]: { ...prev[system as keyof typeof prev], [field]: value } }));
  };

  // --- generateAndUpdateRedacciones (CON LÓGICA ACTUALIZADA pero estructura sin cambios) ---
  const generateAndUpdateRedacciones = () => {
    // Digestivo
     let digestivoText = `El paciente refiere alimentación de tipo ${formValues.digestivo.alimentacion || "[sin especificar]"}. Su patrón de masticación es ${formValues.digestivo.masticacion || "[sin especificar]"}. Manifiesta ${getPercepcionGustoText()}. ${formValues.digestivo.percepcionGustoEspecificaciones ? `Especificaciones: ${formValues.digestivo.percepcionGustoEspecificaciones}.` : ''} La salivación ${getSalivacionText()}. Respecto a la deglución, ${getDeglusiónText()}. ${formValues.digestivo.halitosis === "Sí" ? `Presenta halitosis${formValues.digestivo.halitosisEspecificaciones ? ` (${formValues.digestivo.halitosisEspecificaciones})` : ''}.` : "No presenta halitosis."}`;
     if (formValues.digestivo.sintomasDigestivos.length === 0 || formValues.digestivo.sintomasDigestivos.includes("Ninguno")) {
         digestivoText += " El paciente niega alteraciones relevantes relacionadas al sistema digestivo. Se interrogó específicamente sobre distensión abdominal, estreñimiento, plenitud posprandial, pirosis, dolor abdominal, náuseas, vómito y reflujo.";
     } else { digestivoText += ` Ha experimentado los siguientes síntomas digestivos: ${formValues.digestivo.sintomasDigestivos.join(", ")}.`; }
     digestivoText += ` ${formValues.digestivo.cambiosApetito ? `Cambios en el apetito: ${formValues.digestivo.cambiosApetito}.` : 'Sin cambios relevantes en el apetito.'}`;
     // *** Lógica Hábitos Alimenticios ACTUALIZADA ***
     if (!formValues.digestivo.habitosAlimenticios || formValues.digestivo.habitosAlimenticios === "Ninguno") {
         digestivoText += " Sin habitos alimenticios relevantes, se interrogo especificamente por: ingesta nocturna, picoteo frecuente, ayuno prolongado.";
     } else { digestivoText += ` Hábitos alimenticios: ${formValues.digestivo.habitosAlimenticios}.`; }
     digestivoText += ` El color de las evacuaciones es ${getColorEvacuacionesText()}. ${formValues.digestivo.hematemesis === "Sí" ? "Presenta hematemesis." : "No presenta hematemesis."} Realiza ${formValues.digestivo.frecuenciaEvacuacion || "[sin especificar]"} evacuaciones diarias${formValues.digestivo.frecuenciaEvacuacion === "Otra" ? ` (${formValues.digestivo.frecuenciaEvacuacionEspecificaciones})` : ''}.`;

     // Respiratorio
     let respiratorioText = `El tipo de respiración habitual es ${formValues.respiratorio.tipoRespiracion || "[sin especificar]"}.`;
     if (formValues.respiratorio.sintomasRespiratorios.length === 0 || formValues.respiratorio.sintomasRespiratorios.includes("Ninguno")) {
         respiratorioText += " El paciente niega alteraciones relevantes relacionadas al sistema respiratorio. Se interrogó específicamente sobre obstrucción nasal, rinorrea, congestión nasal, epistaxis, disnea, tos, dolor torácico, hernias, expectoraciones, secreciones y cianosis.";
     } else { respiratorioText += ` Presenta síntomas respiratorios como: ${formValues.respiratorio.sintomasRespiratorios.join(", ")}.`; }
     respiratorioText += ` ${formValues.respiratorio.apneaSuenio === "Sí" ? "Presenta apnea del sueño." : "No presenta apnea del sueño."} ${formValues.respiratorio.oxigenoSuplementario === "Sí" ? "Usa oxígeno suplementario." : "No usa oxígeno suplementario."}`;
     // *** Lógica Tos con expectoración ACTUALIZADA ***
     if (formValues.respiratorio.tosExpectoracion) { respiratorioText += ` Tos: ${formValues.respiratorio.tosExpectoracion}.`;
     } else { respiratorioText += " No refiere tos con expectoración."; }

     // Cardiovascular
     let cardiovascularText = `${formValues.cardiovascular.dolorPecho === "No" ? "No refiere" : "Refiere"} dolor en el pecho. ${formValues.cardiovascular.lipotimia === "Sí" ? "Ha presentado" : "No ha presentado"} episodios de lipotimia. El ritmo cardíaco es ${formValues.cardiovascular.ritmoCardiaco || "[sin especificar]"}.`;
     if (formValues.cardiovascular.sintomasCardiovasculares.length === 0 || formValues.cardiovascular.sintomasCardiovasculares.includes("Ninguno")) {
         cardiovascularText += " El paciente niega alteraciones relevantes relacionadas al sistema cardiovascular. Se interrogó específicamente sobre mareos, edema, equimosis, várices, cefalea, acúfenos, fosfenos y palpitaciones.";
     } else { cardiovascularText += ` Sintomatología cardiovascular reportada: ${formValues.cardiovascular.sintomasCardiovasculares.join(", ")}.`; }
     cardiovascularText += ` ${formValues.cardiovascular.presionArterial ? `Presión arterial conocida: ${formValues.cardiovascular.presionArterial}.` : 'Presión arterial no especificada.'} ${formValues.cardiovascular.antecedentesInfarto === "Sí" ? "Tiene antecedentes de infarto o enfermedad coronaria." : "No tiene antecedentes de infarto o enfermedad coronaria."} ${formValues.cardiovascular.fatigaEsfuerzo === "Sí" ? "Presenta fatiga fácil con esfuerzo leve." : "No presenta fatiga fácil con esfuerzo leve."}`;

     // Genito-Urinario
     let genitoUrinarioText = `El paciente refiere una frecuencia urinaria de ${formValues.genitoUrinario.frecuenciaUrinaria || "[sin especificar]"} veces al día.`;
     if (formValues.genitoUrinario.sintomasUrinarios.length === 0 || formValues.genitoUrinario.sintomasUrinarios.includes("Ninguno")) {
         genitoUrinarioText += " El paciente niega alteraciones relevantes relacionadas al aparato genito-urinario. Se exploró la frecuencia urinaria, síntomas urinarios, urgencia urinaria, fuerza del chorro, infecciones recurrentes y flujo anormal.";
     } else { genitoUrinarioText += ` Síntomas urinarios presentes: ${formValues.genitoUrinario.sintomasUrinarios.join(", ")}.`; }
     genitoUrinarioText += ` ${formValues.genitoUrinario.urgenciaUrinaria === "Sí" ? "Presenta urgencia urinaria." : "No presenta urgencia urinaria."} ${formValues.genitoUrinario.chorroUrinarioDebil === "Sí" ? "Presenta chorro urinario débil." : "No presenta chorro urinario débil."} ${formValues.genitoUrinario.chorroUrinarioIntermitente === "Sí" ? "Presenta chorro urinario intermitente." : "No presenta chorro urinario intermitente."} ${formValues.genitoUrinario.flujoVaginalUretral === "Sí" ? "Presenta flujo vaginal/uretral anormal." : "No presenta flujo vaginal/uretral anormal."} ${formValues.genitoUrinario.infeccionesUrinarias === "Sí" ? "Presenta infecciones urinarias frecuentes." : "No presenta infecciones urinarias frecuentes."}`;
     if (formValues.genitoUrinario.ultimaMenstruacion) {
         genitoUrinarioText += ` Fecha de última menstruación: ${formValues.genitoUrinario.ultimaMenstruacion}.`;
         genitoUrinarioText += ` ${formValues.genitoUrinario.dismenorrea ? `Dismenorrea: ${formValues.genitoUrinario.dismenorrea}.` : ''}`;
         genitoUrinarioText += ` ${formValues.genitoUrinario.duracionMenstruacion ? `Días de duración de menstruación: ${formValues.genitoUrinario.duracionMenstruacion}.` : ''}`; // Asumiendo que duracionMenstruacion tiene el texto deseado
         genitoUrinarioText += ` ${formValues.genitoUrinario.ultimoParto ? `Fecha de último parto: ${formValues.genitoUrinario.ultimoParto}.` : ''}`;
         genitoUrinarioText += ` Antecedentes obstétricos: ${formValues.genitoUrinario.antecedentesObstetricos || "ninguno"}.`;
     }

     // Endocrino
     let endocrinoText = "";
     if (formValues.endocrino.sintomasEndocrinos.length === 0 || formValues.endocrino.sintomasEndocrinos.includes("Ninguno")) {
         endocrinoText += "El paciente niega alteraciones relevantes relacionadas al sistema endocrino. Se indagó sobre poliuria, polidipsia, polifagia, exoftalmos, nerviosismo, temblores, insomnio, cambios de peso e intolerancia al frío o calor.";
     } else { endocrinoText += `El paciente refiere los siguientes síntomas endocrinos: ${formValues.endocrino.sintomasEndocrinos.join(", ")}.`; }
     endocrinoText += ` ${formValues.endocrino.sudoracionNocturna === "Sí" ? "Presenta sudoración excesiva nocturna." : "No presenta sudoración excesiva nocturna."} ${formValues.endocrino.hirsutismo === "Sí" ? "Presenta hirsutismo." : "No presenta hirsutismo."} ${formValues.endocrino.galactorrea === "Sí" ? "Presenta galactorrea." : "No presenta galactorrea."}`;
     // *** Lógica Ritmo Menstrual ACTUALIZADA ***
     if (formValues.endocrino.cambiosRitmoMenstrual) { endocrinoText += ` Cambios en el ritmo menstrual: ${formValues.endocrino.cambiosRitmoMenstrual}.`; }
     else { /* Opcional: añadir texto si no aplica o no se especifica */ }
     endocrinoText += ` Reporta ${getCambiosPesoText()}. ${getIntoleranciaText()}. Antecedentes patológicos endocrinos conocidos: ${formValues.endocrino.condicionesEndocrinas || "ninguno"}.`;

     // Tegumentario
     let tegumentarioText = `${formValues.tegumentario.cambiosColoracion === "Sí" ? `Ha notado cambios en la coloración de la piel${formValues.tegumentario.cambiosColoracionEspecificaciones ? ` (${formValues.tegumentario.cambiosColoracionEspecificaciones})` : ''}.` : "No ha notado cambios en la coloración de la piel."}`;
     if (formValues.tegumentario.sintomasTegumentarios.length === 0 || formValues.tegumentario.sintomasTegumentarios.includes("Ninguno")) {
         tegumentarioText += " El paciente niega otras alteraciones relevantes relacionadas al sistema tegumentario. Se investigó presencia de erupciones, prurito, hiperhidrosis, pérdida de cabello y piel seca.";
     } else { tegumentarioText += ` Otros síntomas presentes: ${formValues.tegumentario.sintomasTegumentarios.join(", ")}.`; }
     // *** Lógica Cambios en Uñas ACTUALIZADA ***
     if (formValues.tegumentario.cambiosUnas) { tegumentarioText += ` Cambios en uñas: ${formValues.tegumentario.cambiosUnas}.`;
     } else { tegumentarioText += " No refiere cambios en uñas."; }
     tegumentarioText += ` ${formValues.tegumentario.cambiosLunares === "Sí" ? "Presenta cambios en lunares." : "No presenta cambios en lunares."} ${formValues.tegumentario.lesionesPigmentadas === "Sí" ? "Presenta lesiones pigmentadas." : "No presenta lesiones pigmentadas."}`;

     // Músculo-Esquelético
     let musculoEsqueleticoText = `${formValues.musculoEsqueletico.fracturas === "No" ? "No ha presentado" : "Ha presentado"} fracturas o esguinces${formValues.musculoEsqueletico.fracturas === "Sí" ? ` (${formValues.musculoEsqueletico.detallesFracturas || "sin especificar"})` : ''}.`;
     if (formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.length === 0 || formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Ninguno")) {
         musculoEsqueleticoText += " El paciente niega otras alteraciones relevantes relacionadas al sistema músculo-esquelético. Se interrogó sobre deformidad o dolor articular, rigidez matutina, calambres musculares y limitaciones de movimiento.";
     } else { musculoEsqueleticoText += ` Sintomatología musculoesquelética actual: ${formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.join(", ")}.`; }
     // *** Lógica Rigidez Matutina ACTUALIZADA ***
     if (formValues.musculoEsqueletico.rigidezMatutina) { musculoEsqueleticoText += ` Rigidez matutina: ${formValues.musculoEsqueletico.rigidezMatutina}.`;
     } else { musculoEsqueleticoText += " No refiere rigidez matutina."; }
     musculoEsqueleticoText += ` ${formValues.musculoEsqueletico.debilidadMuscular ? `Debilidad muscular: ${formValues.musculoEsqueletico.debilidadMuscular}.` : 'No refiere debilidad muscular.'} ${formValues.musculoEsqueletico.limitacionesMovimiento ? `Limitaciones de movimiento: ${formValues.musculoEsqueletico.limitacionesMovimiento}.` : 'No refiere limitaciones de movimiento.'}`;

     // Nervioso
     let nerviosoText = `${formValues.nervioso.percepcionSentidos === "Sí" ? "Percibe" : "No percibe"} adecuadamente a través de los órganos de los sentidos. El patrón de sueño habitual es de ${formValues.nervioso.horasSueno || "[sin especificar]"} horas por noche. ${formValues.nervioso.trastornosSueno === "Sí" ? `Presenta trastornos del sueño (${formValues.nervioso.trastornosSuenoEspecificaciones || 'sin especificar'}).` : "No presenta trastornos del sueño."} Su carácter habitual se describe como ${formValues.nervioso.estadoAnimo || "[sin especificar]"}. ${formValues.nervioso.parestesias === "Sí" ? "Presenta" : "No presenta"} parestesias.`;
     if (formValues.nervioso.otrosSintomasNeurologicos.length === 0 || formValues.nervioso.otrosSintomasNeurologicos.includes("Ninguno")) {
         nerviosoText += " El paciente niega otras alteraciones relevantes relacionadas al sistema nervioso. Se preguntó sobre convulsiones, temblores, problemas de memoria, personalidad y coordinación.";
     } else { nerviosoText += ` Otros síntomas neurológicos: ${formValues.nervioso.otrosSintomasNeurologicos.join(", ")}.`; }

    // Actualizar estado y props (sin cambios)
    const newRedacciones = { digestivo: digestivoText, respiratorio: respiratorioText, cardiovascular: cardiovascularText, genitoUrinario: genitoUrinarioText, endocrino: endocrinoText, tegumentario: tegumentarioText, musculoEsqueletico: musculoEsqueleticoText, nervioso: nerviosoText };
    setRedacciones(newRedacciones);
    Object.entries(newRedacciones).forEach(([system, value]) => { handleInterrogatorioChange(system, value); });

    // Cambiar a vista de redacción y scroll (sin cambios)
    setShowForm(false);
    setTimeout(() => { redaccionesRef.current?.scrollIntoView({ behavior: 'smooth' }); }, 100);
  };

  // Funciones auxiliares (sin cambios)
  const getPercepcionGustoText = () => { switch (formValues.digestivo.percepcionGusto) { case "Normal": return "no percibir alteraciones del gusto"; case "Disminucion": return "hipogeusia"; case "Alterados": return "disgeusia (sabores metálicos, amargos, etc.)"; default: return "[sin especificar]"; } };
  const getSalivacionText = () => { switch (formValues.digestivo.salivacion) { case "Normal": return "se encuentra presente en cantidad y consistencia adecuadas"; case "Aumentada": return "aumentada"; case "Disminuida": return "disminuida"; default: return "[sin especificar]"; } };
  const getDeglusiónText = () => { switch (formValues.digestivo.deglusion) { case "No": return "no refiere dificultad"; case "Dificultad": return "presenta dificultad sin dolor"; case "Dolor": return "presenta odinofagia"; default: return "[sin especificar]"; } };
  const getColorEvacuacionesText = () => { switch (formValues.digestivo.colorEvacuaciones) { case "Normal": return "marron y bien formado"; case "Oscuras": return "oscuras"; case "Claras": return "claras"; case "Presencia de moco": return "con presencia de moco"; default: return "[sin especificar]"; } };
  const getCambiosPesoText = () => { switch (formValues.endocrino.cambiosPeso) { case "Perdida": return "pérdida de peso sin causa aparente"; case "Aumento": return "aumento de peso sin causa aparente"; case "No": return "sin cambios de peso"; default: return "[sin especificar]"; } };
  const getIntoleranciaText = () => { if (formValues.endocrino.intolerancia === "No") { return "No presenta intolerancia al frío o calor"; } else if (formValues.endocrino.intolerancia) { return `Presenta intolerancia al ${formValues.endocrino.intolerancia.toLowerCase()}`; } else { return "[sin especificar intolerancia]"; } };

  // handleCopy (sin cambios funcionales, quizás ajuste de tipo)
  const handleCopy = (section: keyof typeof redacciones) => {
    navigator.clipboard.writeText(redacciones[section]);
    setCopied(prev => ({ ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}), [section]: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, [section]: false })), 2000);
  };

  // resetForm (sin cambios)
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
      setRedacciones({ digestivo: "", respiratorio: "", cardiovascular: "", genitoUrinario: "", endocrino: "", tegumentario: "", musculoEsqueletico: "", nervioso: "" });
      // setShowForm(true); // Podrías descomentar esto si quieres que limpiar siempre vuelva al formulario
  };

  // --- JSX Principal ---
  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50 bg-white dark:bg-gray-800" : ""}`}>
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        {/* Cabecera con botones (sin cambios) */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm z-10">
          <div className="flex justify-center w-full">
             <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
               <button onClick={() => setShowForm(true)} className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${showForm ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}>Formulario</button>
               <button onClick={generateAndUpdateRedacciones} disabled={showForm} className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${!showForm ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}>Redacción IA</button>
             </div>
           </div>
           <div className="flex items-center gap-2">
             <button onClick={handleMinimize} className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"><Minus className="w-4 h-4" /></button>
             <button onClick={handleMaximize} className="p-1 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors"><Maximize2 className="w-4 h-4" /></button>
             <button onClick={handleClose} className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"><X className="w-4 h-4" /></button>
           </div>
        </div>

        {/* Título (sin cambios) */}
        <div ref={redaccionesRef} className="flex justify-start px-6 py-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-gray-400">IX.</span> INTERROGATORIO POR APARATOS Y SISTEMAS
          </h2>
        </div>

        {!isMinimized && (
          <div className={`p-6 ${isMaximized ? 'pb-16' : ''}`} ref={formRef}>
            {showForm ? (
              // --- FORMULARIO ---
              <div className="space-y-6">
                {/* APARATO DIGESTIVO */}
                 <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                   <h4 className="text-lg font-semibold mb-2 text-justify">Aparato Digestivo</h4>
                   {/* Usar grid-cols-1 en móvil y grid-cols-2 en pantallas más grandes */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <Label>Tipo de Alimentación</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="Blanda" isSelected={formValues.digestivo.alimentacion === "Blanda"} onClick={() => handleRadioChange("digestivo", "alimentacion", "Blanda")} />
                         <WordButton label="Fibrosa" isSelected={formValues.digestivo.alimentacion === "Fibrosa"} onClick={() => handleRadioChange("digestivo", "alimentacion", "Fibrosa")} />
                         <WordButton label="Combinada" isSelected={formValues.digestivo.alimentacion === "Combinada"} onClick={() => handleRadioChange("digestivo", "alimentacion", "Combinada")} />
                       </div>
                     </div>
                     <div>
                       <Label>Patrón de Masticación</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="Unilateral" isSelected={formValues.digestivo.masticacion === "Unilateral"} onClick={() => handleRadioChange("digestivo", "masticacion", "Unilateral")} />
                         <WordButton label="Bilateral" isSelected={formValues.digestivo.masticacion === "Bilateral"} onClick={() => handleRadioChange("digestivo", "masticacion", "Bilateral")} />
                         <WordButton label="Anterior" isSelected={formValues.digestivo.masticacion === "Anterior"} onClick={() => handleRadioChange("digestivo", "masticacion", "Anterior")} />
                       </div>
                     </div>
                     <div>
                       <Label>Percepción del Gusto</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                           <WordButton label="Normal" isSelected={formValues.digestivo.percepcionGusto === "Normal"} onClick={() => handleRadioChange("digestivo", "percepcionGusto", "Normal")} />
                           <WordButton label="Disminución" isSelected={formValues.digestivo.percepcionGusto === "Disminucion"} onClick={() => handleRadioChange("digestivo", "percepcionGusto", "Disminucion")} />
                           <WordButton label="Alterados" isSelected={formValues.digestivo.percepcionGusto === "Alterados"} onClick={() => handleRadioChange("digestivo", "percepcionGusto", "Alterados")} />
                       </div>
                       {formValues.digestivo.percepcionGusto === "Alterados" && (<Textarea placeholder="Escriba especificaciones..." value={formValues.digestivo.percepcionGustoEspecificaciones} onChange={(e) => handleTextChange("digestivo", "percepcionGustoEspecificaciones", e.target.value)} className="w-full mt-2" rows={2}/>)}
                     </div>
                     <div>
                         <Label>Salivación</Label>
                         {/* *** CONTENEDOR ORIGINAL *** */}
                         <div className="flex flex-wrap mt-1">
                             <WordButton label="Normal" isSelected={formValues.digestivo.salivacion === "Normal"} onClick={() => handleRadioChange("digestivo", "salivacion", "Normal")} />
                             <WordButton label="Aumentada" isSelected={formValues.digestivo.salivacion === "Aumentada"} onClick={() => handleRadioChange("digestivo", "salivacion", "Aumentada")} />
                             <WordButton label="Disminuida" isSelected={formValues.digestivo.salivacion === "Disminuida"} onClick={() => handleRadioChange("digestivo", "salivacion", "Disminuida")} />
                         </div>
                     </div>
                     <div>
                         <Label>Dificultad o Dolor al Tragar</Label>
                         {/* *** CONTENEDOR ORIGINAL *** */}
                         <div className="flex flex-wrap mt-1">
                             <WordButton label="No" isSelected={formValues.digestivo.deglusion === "No"} onClick={() => handleRadioChange("digestivo", "deglusion", "No")} />
                             <WordButton label="Dificultad" isSelected={formValues.digestivo.deglusion === "Dificultad"} onClick={() => handleRadioChange("digestivo", "deglusion", "Dificultad")} />
                             <WordButton label="Dolor" isSelected={formValues.digestivo.deglusion === "Dolor"} onClick={() => handleRadioChange("digestivo", "deglusion", "Dolor")} />
                         </div>
                     </div>
                      <div>
                         <Label>Halitosis (mal aliento)</Label>
                         {/* *** CONTENEDOR ORIGINAL *** */}
                         <div className="flex flex-wrap mt-1">
                             <WordButton label="Sí" isSelected={formValues.digestivo.halitosis === "Sí"} onClick={() => handleRadioChange("digestivo", "halitosis", "Sí")} />
                             <WordButton label="No" isSelected={formValues.digestivo.halitosis === "No"} onClick={() => handleRadioChange("digestivo", "halitosis", "No")} />
                         </div>
                         {formValues.digestivo.halitosis === "Sí" && (
                             /* *** CONTENEDOR ORIGINAL *** */
                             <div className="flex flex-wrap mt-1">
                                 <WordButton label="Solo por las mañanas" isSelected={formValues.digestivo.halitosisEspecificaciones === "Solo por las mañanas"} onClick={() => handleRadioChange("digestivo", "halitosisEspecificaciones", "Solo por las mañanas")} />
                                 <WordButton label="Todo el tiempo" isSelected={formValues.digestivo.halitosisEspecificaciones === "Todo el tiempo"} onClick={() => handleRadioChange("digestivo", "halitosisEspecificaciones", "Todo el tiempo")} />
                             </div>
                         )}
                     </div>
                      {/* Síntomas Digestivos - Checkbox group */}
                     <div className="md:col-span-2"> {/* Ocupa ambas columnas en md */}
                         <Label>Síntomas Digestivos</Label>
                         {/* *** CONTENEDOR ORIGINAL *** */}
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
                         <Label>Cambios en el apetito</Label>
                          {/* *** CONTENEDOR ORIGINAL *** */}
                         <div className="flex flex-wrap mt-1">
                             <WordButton label="Aumentado" isSelected={formValues.digestivo.cambiosApetito === "Aumentado"} onClick={() => handleRadioChange("digestivo", "cambiosApetito", "Aumentado")} />
                             <WordButton label="Disminuido" isSelected={formValues.digestivo.cambiosApetito === "Disminuido"} onClick={() => handleRadioChange("digestivo", "cambiosApetito", "Disminuido")} />
                             <WordButton label="Sin cambios" isSelected={formValues.digestivo.cambiosApetito === "Sin cambios"} onClick={() => handleRadioChange("digestivo", "cambiosApetito", "Sin cambios")} />
                         </div>
                     </div>
                     <div>
                         <Label>Hábitos alimenticios</Label>
                         {/* *** CONTENEDOR ORIGINAL *** */}
                         <div className="flex flex-wrap mt-1">
                             <WordButton label="Ingesta nocturna" isSelected={formValues.digestivo.habitosAlimenticios === "Ingesta nocturna"} onClick={() => handleRadioChange("digestivo", "habitosAlimenticios", "Ingesta nocturna")} />
                             <WordButton label="Picoteo frecuente" isSelected={formValues.digestivo.habitosAlimenticios === "Picoteo frecuente"} onClick={() => handleRadioChange("digestivo", "habitosAlimenticios", "Picoteo frecuente")} />
                             <WordButton label="Ayuno prolongado" isSelected={formValues.digestivo.habitosAlimenticios === "Ayuno prolongado"} onClick={() => handleRadioChange("digestivo", "habitosAlimenticios", "Ayuno prolongado")} />
                             {/* La opción "Ninguno" controla el texto específico en la redacción */}
                             <WordButton label="Ninguno" isSelected={formValues.digestivo.habitosAlimenticios === "Ninguno"} onClick={() => handleRadioChange("digestivo", "habitosAlimenticios", "Ninguno")} />
                         </div>
                     </div>
                     <div>
                         <Label>Color de las evacuaciones</Label>
                         {/* *** CONTENEDOR ORIGINAL *** */}
                         <div className="flex flex-wrap mt-1">
                             <WordButton label="Normal" isSelected={formValues.digestivo.colorEvacuaciones === "Normal"} onClick={() => handleRadioChange("digestivo", "colorEvacuaciones", "Normal")} />
                             <WordButton label="Oscuras" isSelected={formValues.digestivo.colorEvacuaciones === "Oscuras"} onClick={() => handleRadioChange("digestivo", "colorEvacuaciones", "Oscuras")} />
                             <WordButton label="Claras" isSelected={formValues.digestivo.colorEvacuaciones === "Claras"} onClick={() => handleRadioChange("digestivo", "colorEvacuaciones", "Claras")} />
                             <WordButton label="Presencia de moco" isSelected={formValues.digestivo.colorEvacuaciones === "Presencia de moco"} onClick={() => handleRadioChange("digestivo", "colorEvacuaciones", "Presencia de moco")} />
                         </div>
                     </div>
                     <div>
                         <Label>Hematemesis (vómito con sangre)</Label>
                          {/* *** CONTENEDOR ORIGINAL *** */}
                         <div className="flex flex-wrap mt-1">
                             <WordButton label="Sí" isSelected={formValues.digestivo.hematemesis === "Sí"} onClick={() => handleRadioChange("digestivo", "hematemesis", "Sí")} />
                             <WordButton label="No" isSelected={formValues.digestivo.hematemesis === "No"} onClick={() => handleRadioChange("digestivo", "hematemesis", "No")} />
                         </div>
                     </div>
                      <div>
                         <Label>Frecuencia de Evacuación</Label>
                          {/* *** CONTENEDOR ORIGINAL *** */}
                         <div className="flex flex-wrap mt-1">
                             <WordButton label="Menos de 1 vez al día" isSelected={formValues.digestivo.frecuenciaEvacuacion === "Menos de una vez al día"} onClick={() => handleRadioChange("digestivo", "frecuenciaEvacuacion", "Menos de una vez al día")} />
                             <WordButton label="1 a 2 veces" isSelected={formValues.digestivo.frecuenciaEvacuacion === "1 a 2 veces"} onClick={() => handleRadioChange("digestivo", "frecuenciaEvacuacion", "1 a 2 veces")} />
                             <WordButton label="Más de 2 veces" isSelected={formValues.digestivo.frecuenciaEvacuacion === "Más de 2 veces"} onClick={() => handleRadioChange("digestivo", "frecuenciaEvacuacion", "Más de 2 veces")} />
                             <WordButton label="Otra" isSelected={formValues.digestivo.frecuenciaEvacuacion === "Otra"} onClick={() => handleRadioChange("digestivo", "frecuenciaEvacuacion", "Otra")} />
                         </div>
                         {formValues.digestivo.frecuenciaEvacuacion === "Otra" && (<Textarea placeholder="Escriba especificaciones..." value={formValues.digestivo.frecuenciaEvacuacionEspecificaciones} onChange={(e) => handleTextChange("digestivo", "frecuenciaEvacuacionEspecificaciones", e.target.value)} className="w-full mt-2" rows={2}/>)}
                     </div>
                   </div>
                 </div>

                {/* APARATO RESPIRATORIO */}
                 <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                   <h4 className="text-lg font-semibold mb-2 text-justify">Aparato Respiratorio</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <Label>Tipo de Respiración</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="Nasal" isSelected={formValues.respiratorio.tipoRespiracion === "Nasal"} onClick={() => handleRadioChange("respiratorio", "tipoRespiracion", "Nasal")} />
                         <WordButton label="Bucal" isSelected={formValues.respiratorio.tipoRespiracion === "Bucal"} onClick={() => handleRadioChange("respiratorio", "tipoRespiracion", "Bucal")} />
                         <WordButton label="Combinada" isSelected={formValues.respiratorio.tipoRespiracion === "Combinada"} onClick={() => handleRadioChange("respiratorio", "tipoRespiracion", "Combinada")} />
                       </div>
                     </div>
                     {/* Sintomas Respiratorios - Checkbox group */}
                     <div className="md:col-span-2">
                       <Label>Síntomas Respiratorios</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="Obstrucción Nasal" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Obstrucción nasal")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Obstrucción nasal", !formValues.respiratorio.sintomasRespiratorios.includes("Obstrucción nasal"))} />
                         <WordButton label="Rinorrea" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Secreción nasal (rinorrea)")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Secreción nasal (rinorrea)", !formValues.respiratorio.sintomasRespiratorios.includes("Secreción nasal (rinorrea)"))} />
                         <WordButton label="Congestión Nasal" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Congestión nasal")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Congestión nasal", !formValues.respiratorio.sintomasRespiratorios.includes("Congestión nasal"))} />
                         <WordButton label="Epistaxis" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Sangrado nasal (epistaxis)")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Sangrado nasal (epistaxis)", !formValues.respiratorio.sintomasRespiratorios.includes("Sangrado nasal (epistaxis)"))} />
                         <WordButton label="Disnea" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Dificultad para respirar (disnea)")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Dificultad para respirar (disnea)", !formValues.respiratorio.sintomasRespiratorios.includes("Dificultad para respirar (disnea)"))} />
                         <WordButton label="Tos" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Tos")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Tos", !formValues.respiratorio.sintomasRespiratorios.includes("Tos"))} />
                         <WordButton label="Dolor Torácico" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Dolor en el pecho")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Dolor en el pecho", !formValues.respiratorio.sintomasRespiratorios.includes("Dolor en el pecho"))} />
                         <WordButton label="Expectoraciones" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Flemas (expectoración)")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Flemas (expectoración)", !formValues.respiratorio.sintomasRespiratorios.includes("Flemas (expectoración)"))} />
                         <WordButton label="Cianosis" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Coloración azulada en labios o piel (cianosis)")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Coloración azulada en labios o piel (cianosis)", !formValues.respiratorio.sintomasRespiratorios.includes("Coloración azulada en labios o piel (cianosis)"))} />
                         <WordButton label="Ninguno" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Ninguno")} onClick={() => handleCheckboxChange("respiratorio", "sintomasRespiratorios", "Ninguno", !formValues.respiratorio.sintomasRespiratorios.includes("Ninguno"))} />
                       </div>
                     </div>
                     <div>
                       <Label>Apnea del sueño (ronquido o pausas al dormir)</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="Sí" isSelected={formValues.respiratorio.apneaSuenio === "Sí"} onClick={() => handleRadioChange("respiratorio", "apneaSuenio", "Sí")} />
                         <WordButton label="No" isSelected={formValues.respiratorio.apneaSuenio === "No"} onClick={() => handleRadioChange("respiratorio", "apneaSuenio", "No")} />
                       </div>
                     </div>
                     <div>
                       <Label>Uso de oxígeno suplementario</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="Sí" isSelected={formValues.respiratorio.oxigenoSuplementario === "Sí"} onClick={() => handleRadioChange("respiratorio", "oxigenoSuplementario", "Sí")} />
                         <WordButton label="No" isSelected={formValues.respiratorio.oxigenoSuplementario === "No"} onClick={() => handleRadioChange("respiratorio", "oxigenoSuplementario", "No")} />
                       </div>
                     </div>
                     {/* *** CAMPO MODIFICADO FUNCIONALMENTE *** */}
                     <div>
                       <Label>Tos con expectoración</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="Transparente" isSelected={formValues.respiratorio.tosExpectoracion === "Transparente"} onClick={() => handleRadioChange("respiratorio", "tosExpectoracion", "Transparente")} />
                         <WordButton label="Amarilla" isSelected={formValues.respiratorio.tosExpectoracion === "Amarilla"} onClick={() => handleRadioChange("respiratorio", "tosExpectoracion", "Amarilla")} />
                         <WordButton label="Verdosa" isSelected={formValues.respiratorio.tosExpectoracion === "Verdosa"} onClick={() => handleRadioChange("respiratorio", "tosExpectoracion", "Verdosa")} />
                         <WordButton label="Hemoptoica" isSelected={formValues.respiratorio.tosExpectoracion === "Hemoptoica"} onClick={() => handleRadioChange("respiratorio", "tosExpectoracion", "Hemoptoica")} />
                         {/* *** Nueva Opción AÑADIDA *** */}
                         <WordButton label="No presenta tos con expectoracion" isSelected={formValues.respiratorio.tosExpectoracion === "No presenta tos con expectoracion"} onClick={() => handleRadioChange("respiratorio", "tosExpectoracion", "No presenta tos con expectoracion")} />
                       </div>
                     </div>
                   </div>
                 </div>

                {/* APARATO CARDIOVASCULAR */}
                 <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                   <h4 className="text-lg font-semibold mb-2 text-justify">Aparato Cardiovascular</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <Label>Dolor en el Pecho</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="No" isSelected={formValues.cardiovascular.dolorPecho === "No"} onClick={() => handleRadioChange("cardiovascular", "dolorPecho", "No")} />
                         <WordButton label="Sí" isSelected={formValues.cardiovascular.dolorPecho === "Sí"} onClick={() => handleRadioChange("cardiovascular", "dolorPecho", "Sí")} />
                       </div>
                     </div>
                     <div>
                       <Label>Lipotimia</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="Sí" isSelected={formValues.cardiovascular.lipotimia === "Sí"} onClick={() => handleRadioChange("cardiovascular", "lipotimia", "Sí")} />
                         <WordButton label="No" isSelected={formValues.cardiovascular.lipotimia === "No"} onClick={() => handleRadioChange("cardiovascular", "lipotimia", "No")} />
                       </div>
                     </div>
                      <div>
                       <Label>Ritmo Cardíaco</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="Normal" isSelected={formValues.cardiovascular.ritmoCardiaco === "Normal"} onClick={() => handleRadioChange("cardiovascular", "ritmoCardiaco", "Normal")} />
                         <WordButton label="Rápido" isSelected={formValues.cardiovascular.ritmoCardiaco === "Rápido"} onClick={() => handleRadioChange("cardiovascular", "ritmoCardiaco", "Rápido")} />
                         <WordButton label="Lento" isSelected={formValues.cardiovascular.ritmoCardiaco === "Lento"} onClick={() => handleRadioChange("cardiovascular", "ritmoCardiaco", "Lento")} />
                       </div>
                     </div>
                     {/* Sintomas Cardiovasculares - Checkbox group */}
                     <div className="md:col-span-2">
                       <Label>Síntomas Cardiovasculares</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
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
                      <div>
                       <Label>Presión arterial conocida</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="Alta" isSelected={formValues.cardiovascular.presionArterial === "Alta"} onClick={() => handleRadioChange("cardiovascular", "presionArterial", "Alta")} />
                         <WordButton label="Baja" isSelected={formValues.cardiovascular.presionArterial === "Baja"} onClick={() => handleRadioChange("cardiovascular", "presionArterial", "Baja")} />
                         <WordButton label="Normal" isSelected={formValues.cardiovascular.presionArterial === "Normal"} onClick={() => handleRadioChange("cardiovascular", "presionArterial", "Normal")} />
                       </div>
                     </div>
                     <div>
                       <Label>Antecedentes de infarto o enf. coronaria</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="Sí" isSelected={formValues.cardiovascular.antecedentesInfarto === "Sí"} onClick={() => handleRadioChange("cardiovascular", "antecedentesInfarto", "Sí")} />
                         <WordButton label="No" isSelected={formValues.cardiovascular.antecedentesInfarto === "No"} onClick={() => handleRadioChange("cardiovascular", "antecedentesInfarto", "No")} />
                       </div>
                     </div>
                     <div>
                       <Label>Fatiga fácil con esfuerzo leve</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="Sí" isSelected={formValues.cardiovascular.fatigaEsfuerzo === "Sí"} onClick={() => handleRadioChange("cardiovascular", "fatigaEsfuerzo", "Sí")} />
                         <WordButton label="No" isSelected={formValues.cardiovascular.fatigaEsfuerzo === "No"} onClick={() => handleRadioChange("cardiovascular", "fatigaEsfuerzo", "No")} />
                       </div>
                     </div>
                   </div>
                 </div>

                {/* APARATO GENITO-URINARIO */}
                 <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                     <h4 className="text-lg font-semibold mb-2 text-justify">Aparato Genito-Urinario</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                             <Label>Frecuencia Urinaria</Label>
                             {/* *** CONTENEDOR ORIGINAL *** */}
                             <div className="flex flex-wrap mt-1">
                                 <WordButton label="Menos de 3 veces" isSelected={formValues.genitoUrinario.frecuenciaUrinaria === "Menos de 3"} onClick={() => handleRadioChange("genitoUrinario", "frecuenciaUrinaria", "Menos de 3")} />
                                 <WordButton label="3 a 6 veces" isSelected={formValues.genitoUrinario.frecuenciaUrinaria === "3 a 6"} onClick={() => handleRadioChange("genitoUrinario", "frecuenciaUrinaria", "3 a 6")} />
                                 <WordButton label="Más de 6 veces" isSelected={formValues.genitoUrinario.frecuenciaUrinaria === "Más de 6"} onClick={() => handleRadioChange("genitoUrinario", "frecuenciaUrinaria", "Más de 6")} />
                             </div>
                         </div>
                         {/* Sintomas Urinarios - Checkbox group */}
                         <div className="md:col-span-2">
                             <Label>Síntomas Urinarios</Label>
                              {/* *** CONTENEDOR ORIGINAL *** */}
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
                             <Label>Urgencia urinaria</Label>
                              {/* *** CONTENEDOR ORIGINAL *** */}
                             <div className="flex flex-wrap mt-1">
                                 <WordButton label="Sí" isSelected={formValues.genitoUrinario.urgenciaUrinaria === "Sí"} onClick={() => handleRadioChange("genitoUrinario", "urgenciaUrinaria", "Sí")} />
                                 <WordButton label="No" isSelected={formValues.genitoUrinario.urgenciaUrinaria === "No"} onClick={() => handleRadioChange("genitoUrinario", "urgenciaUrinaria", "No")} />
                             </div>
                         </div>
                         <div>
                             <Label>Chorro urinario débil</Label>
                              {/* *** CONTENEDOR ORIGINAL *** */}
                             <div className="flex flex-wrap mt-1">
                                 <WordButton label="Sí" isSelected={formValues.genitoUrinario.chorroUrinarioDebil === "Sí"} onClick={() => handleRadioChange("genitoUrinario", "chorroUrinarioDebil", "Sí")} />
                                 <WordButton label="No" isSelected={formValues.genitoUrinario.chorroUrinarioDebil === "No"} onClick={() => handleRadioChange("genitoUrinario", "chorroUrinarioDebil", "No")} />
                             </div>
                         </div>
                         <div>
                             <Label>Chorro urinario intermitente</Label>
                              {/* *** CONTENEDOR ORIGINAL *** */}
                             <div className="flex flex-wrap mt-1">
                                 <WordButton label="Sí" isSelected={formValues.genitoUrinario.chorroUrinarioIntermitente === "Sí"} onClick={() => handleRadioChange("genitoUrinario", "chorroUrinarioIntermitente", "Sí")} />
                                 <WordButton label="No" isSelected={formValues.genitoUrinario.chorroUrinarioIntermitente === "No"} onClick={() => handleRadioChange("genitoUrinario", "chorroUrinarioIntermitente", "No")} />
                             </div>
                         </div>
                         <div>
                             <Label>Flujo vaginal/uretral anormal</Label>
                              {/* *** CONTENEDOR ORIGINAL *** */}
                             <div className="flex flex-wrap mt-1">
                                 <WordButton label="Sí" isSelected={formValues.genitoUrinario.flujoVaginalUretral === "Sí"} onClick={() => handleRadioChange("genitoUrinario", "flujoVaginalUretral", "Sí")} />
                                 <WordButton label="No" isSelected={formValues.genitoUrinario.flujoVaginalUretral === "No"} onClick={() => handleRadioChange("genitoUrinario", "flujoVaginalUretral", "No")} />
                             </div>
                         </div>
                         <div>
                             <Label>Infecciones urinarias frecuentes</Label>
                              {/* *** CONTENEDOR ORIGINAL *** */}
                             <div className="flex flex-wrap mt-1">
                                 <WordButton label="Sí" isSelected={formValues.genitoUrinario.infeccionesUrinarias === "Sí"} onClick={() => handleRadioChange("genitoUrinario", "infeccionesUrinarias", "Sí")} />
                                 <WordButton label="No" isSelected={formValues.genitoUrinario.infeccionesUrinarias === "No"} onClick={() => handleRadioChange("genitoUrinario", "infeccionesUrinarias", "No")} />
                             </div>
                         </div>
                         {/* --- Sección solo mujeres --- */}
                          <div className="md:col-span-2 mt-4 border-t pt-4 border-gray-300 dark:border-gray-600">
                             <h5 className="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-400">Información Gineco-Obstétrica (si aplica)</h5>
                             <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                                 <div>
                                     <Label htmlFor="ultimaMenstruacion">Fecha de Última Menstruación (FUM)</Label>
                                     <input id="ultimaMenstruacion" type="date" value={formValues.genitoUrinario.ultimaMenstruacion} onChange={(e) => handleTextChange("genitoUrinario", "ultimaMenstruacion", e.target.value)} className="w-full p-2 border rounded-md mt-1 bg-white dark:bg-gray-700"/>
                                 </div>
                                 <div>
                                     <Label>Dismenorrea</Label>
                                      {/* *** CONTENEDOR ORIGINAL *** */}
                                     <div className="flex flex-wrap mt-1">
                                         <WordButton label="Sí" isSelected={formValues.genitoUrinario.dismenorrea === "Sí"} onClick={() => handleRadioChange("genitoUrinario", "dismenorrea", "Sí")} />
                                         <WordButton label="No" isSelected={formValues.genitoUrinario.dismenorrea === "No"} onClick={() => handleRadioChange("genitoUrinario", "dismenorrea", "No")} />
                                     </div>
                                 </div>
                                 <div>
                                     <Label>Días de duración de menstruación</Label>
                                     {/* *** CONTENEDOR ORIGINAL *** */}
                                     <div className="flex flex-wrap mt-1">
                                         <WordButton label="Menos de 3 días" isSelected={formValues.genitoUrinario.duracionMenstruacion === "Menos de 3 días"} onClick={() => handleRadioChange("genitoUrinario", "duracionMenstruacion", "Menos de 3 días")} />
                                         <WordButton label="3 a 5 días" isSelected={formValues.genitoUrinario.duracionMenstruacion === "3 a 5 días"} onClick={() => handleRadioChange("genitoUrinario", "duracionMenstruacion", "3 a 5 días")} />
                                         <WordButton label="Más de 5 días" isSelected={formValues.genitoUrinario.duracionMenstruacion === "Más de 5 días"} onClick={() => handleRadioChange("genitoUrinario", "duracionMenstruacion", "Más de 5 días")} />
                                     </div>
                                 </div>
                                  <div>
                                     <Label htmlFor="ultimoParto">Fecha de Último Parto</Label>
                                     <input id="ultimoParto" type="date" value={formValues.genitoUrinario.ultimoParto} onChange={(e) => handleTextChange("genitoUrinario", "ultimoParto", e.target.value)} className="w-full p-2 border rounded-md mt-1 bg-white dark:bg-gray-700"/>
                                 </div>
                                 <div className="md:col-span-2">
                                     <Label>Antecedentes Obstétricos</Label>
                                     {/* *** CONTENEDOR ORIGINAL *** */}
                                     <div className="flex flex-wrap mt-1">
                                         <WordButton label="Ninguno" isSelected={formValues.genitoUrinario.antecedentesObstetricos === "Ninguno"} onClick={() => handleRadioChange("genitoUrinario", "antecedentesObstetricos", "Ninguno")} />
                                         <WordButton label="Abortos" isSelected={formValues.genitoUrinario.antecedentesObstetricos === "Abortos"} onClick={() => handleRadioChange("genitoUrinario", "antecedentesObstetricos", "Abortos")} />
                                         <WordButton label="Cesáreas" isSelected={formValues.genitoUrinario.antecedentesObstetricos === "Cesáreas"} onClick={() => handleRadioChange("genitoUrinario", "antecedentesObstetricos", "Cesáreas")} />
                                         <WordButton label="Ambos" isSelected={formValues.genitoUrinario.antecedentesObstetricos === "Ambos"} onClick={() => handleRadioChange("genitoUrinario", "antecedentesObstetricos", "Ambos")} />
                                     </div>
                                     {/* Opcional: podrías tener un Textarea para G P C A */}
                                     {/* <Textarea placeholder="Ej: G3 P2 C1 A0" value={formValues.genitoUrinario.antecedentesObstetricos} onChange={(e) => handleTextChange("genitoUrinario", "antecedentesObstetricos", e.target.value)} className="w-full mt-1" rows={1}/> */}
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>

                {/* SISTEMA ENDOCRINO */}
                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                   <h4 className="text-lg font-semibold mb-2 text-justify">Sistema Endocrino</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {/* Sintomas Endocrinos - Checkbox group */}
                     <div className="md:col-span-2">
                       <Label>Síntomas Endocrinos</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
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
                       <Label>Sudoración excesiva nocturna</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="Sí" isSelected={formValues.endocrino.sudoracionNocturna === "Sí"} onClick={() => handleRadioChange("endocrino", "sudoracionNocturna", "Sí")} />
                         <WordButton label="No" isSelected={formValues.endocrino.sudoracionNocturna === "No"} onClick={() => handleRadioChange("endocrino", "sudoracionNocturna", "No")} />
                       </div>
                     </div>
                     <div>
                       <Label>Hirsutismo (vello excesivo en mujeres)</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="Sí" isSelected={formValues.endocrino.hirsutismo === "Sí"} onClick={() => handleRadioChange("endocrino", "hirsutismo", "Sí")} />
                         <WordButton label="No" isSelected={formValues.endocrino.hirsutismo === "No"} onClick={() => handleRadioChange("endocrino", "hirsutismo", "No")} />
                       </div>
                     </div>
                     <div>
                       <Label>Galactorrea (secreción mamaria anormal)</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="Sí" isSelected={formValues.endocrino.galactorrea === "Sí"} onClick={() => handleRadioChange("endocrino", "galactorrea", "Sí")} />
                         <WordButton label="No" isSelected={formValues.endocrino.galactorrea === "No"} onClick={() => handleRadioChange("endocrino", "galactorrea", "No")} />
                       </div>
                     </div>
                     {/* *** CAMPO MODIFICADO FUNCIONALMENTE *** */}
                     <div>
                       <Label>Cambios en el ritmo menstrual</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="Retrasos" isSelected={formValues.endocrino.cambiosRitmoMenstrual === "Retrasos"} onClick={() => handleRadioChange("endocrino", "cambiosRitmoMenstrual", "Retrasos")} />
                         <WordButton label="Amenorrea" isSelected={formValues.endocrino.cambiosRitmoMenstrual === "Amenorrea"} onClick={() => handleRadioChange("endocrino", "cambiosRitmoMenstrual", "Amenorrea")} />
                         <WordButton label="Ciclos cortos" isSelected={formValues.endocrino.cambiosRitmoMenstrual === "Ciclos cortos"} onClick={() => handleRadioChange("endocrino", "cambiosRitmoMenstrual", "Ciclos cortos")} />
                         {/* *** Nueva Opción AÑADIDA *** */}
                         <WordButton label="Sin cambios en el ritmo menstrual" isSelected={formValues.endocrino.cambiosRitmoMenstrual === "Sin cambios en el ritmo menstrual"} onClick={() => handleRadioChange("endocrino", "cambiosRitmoMenstrual", "Sin cambios en el ritmo menstrual")} />
                       </div>
                     </div>
                     <div>
                       <Label>Cambios de Peso</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="Pérdida" isSelected={formValues.endocrino.cambiosPeso === "Perdida"} onClick={() => handleRadioChange("endocrino", "cambiosPeso", "Perdida")} />
                         <WordButton label="Aumento" isSelected={formValues.endocrino.cambiosPeso === "Aumento"} onClick={() => handleRadioChange("endocrino", "cambiosPeso", "Aumento")} />
                         <WordButton label="No" isSelected={formValues.endocrino.cambiosPeso === "No"} onClick={() => handleRadioChange("endocrino", "cambiosPeso", "No")} />
                       </div>
                     </div>
                     <div>
                       <Label>Intolerancia</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="Frío" isSelected={formValues.endocrino.intolerancia === "Frío"} onClick={() => handleRadioChange("endocrino", "intolerancia", "Frío")} />
                         <WordButton label="Calor" isSelected={formValues.endocrino.intolerancia === "Calor"} onClick={() => handleRadioChange("endocrino", "intolerancia", "Calor")} />
                         <WordButton label="No" isSelected={formValues.endocrino.intolerancia === "No"} onClick={() => handleRadioChange("endocrino", "intolerancia", "No")} />
                       </div>
                     </div>
                      <div>
                       <Label>Condiciones Endocrinas</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
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
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <Label>Cambios en la Coloración de la Piel</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="Sí" isSelected={formValues.tegumentario.cambiosColoracion === "Sí"} onClick={() => handleRadioChange("tegumentario", "cambiosColoracion", "Sí")} />
                         <WordButton label="No" isSelected={formValues.tegumentario.cambiosColoracion === "No"} onClick={() => handleRadioChange("tegumentario", "cambiosColoracion", "No")} />
                       </div>
                       {formValues.tegumentario.cambiosColoracion === "Sí" && (<Textarea placeholder="Escriba especificaciones..." value={formValues.tegumentario.cambiosColoracionEspecificaciones} onChange={(e) => handleTextChange("tegumentario", "cambiosColoracionEspecificaciones", e.target.value)} className="w-full mt-2" rows={2}/>)}
                     </div>
                     {/* Sintomas Tegumentarios - Checkbox group */}
                     <div className="md:col-span-2">
                       <Label>Síntomas Tegumentarios</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="Erupciones" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("Erupciones")} onClick={() => handleCheckboxChange("tegumentario", "sintomasTegumentarios", "Erupciones", !formValues.tegumentario.sintomasTegumentarios.includes("Erupciones"))} />
                         <WordButton label="Prurito" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("Prurito (comezón)")} onClick={() => handleCheckboxChange("tegumentario", "sintomasTegumentarios", "Prurito (comezón)", !formValues.tegumentario.sintomasTegumentarios.includes("Prurito (comezón)"))} />
                         <WordButton label="Hiperhidrosis" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("Hiperhidrosis (sudoración excesiva)")} onClick={() => handleCheckboxChange("tegumentario", "sintomasTegumentarios", "Hiperhidrosis (sudoración excesiva)", !formValues.tegumentario.sintomasTegumentarios.includes("Hiperhidrosis (sudoración excesiva)"))} />
                         <WordButton label="Pérdida de Pelo" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("Pérdida de pelo o vello")} onClick={() => handleCheckboxChange("tegumentario", "sintomasTegumentarios", "Pérdida de pelo o vello", !formValues.tegumentario.sintomasTegumentarios.includes("Pérdida de pelo o vello"))} />
                         <WordButton label="Piel Seca" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("Piel seca")} onClick={() => handleCheckboxChange("tegumentario", "sintomasTegumentarios", "Piel seca", !formValues.tegumentario.sintomasTegumentarios.includes("Piel seca"))} />
                         <WordButton label="Ninguno" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("Ninguno")} onClick={() => handleCheckboxChange("tegumentario", "sintomasTegumentarios", "Ninguno", !formValues.tegumentario.sintomasTegumentarios.includes("Ninguno"))} />
                       </div>
                     </div>
                      {/* *** CAMPO MODIFICADO FUNCIONALMENTE *** */}
                     <div>
                       <Label>Cambios en uñas</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="Frágiles" isSelected={formValues.tegumentario.cambiosUnas === "Frágiles"} onClick={() => handleRadioChange("tegumentario", "cambiosUnas", "Frágiles")} />
                         <WordButton label="Quebradizas" isSelected={formValues.tegumentario.cambiosUnas === "Quebradizas"} onClick={() => handleRadioChange("tegumentario", "cambiosUnas", "Quebradizas")} />
                         <WordButton label="Deformadas" isSelected={formValues.tegumentario.cambiosUnas === "Deformadas"} onClick={() => handleRadioChange("tegumentario", "cambiosUnas", "Deformadas")} />
                          {/* *** Nueva Opción AÑADIDA *** */}
                         <WordButton label="Sin cambios" isSelected={formValues.tegumentario.cambiosUnas === "Sin cambios"} onClick={() => handleRadioChange("tegumentario", "cambiosUnas", "Sin cambios")} />
                       </div>
                     </div>
                     <div>
                       <Label>Cambios en lunares</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="Sí" isSelected={formValues.tegumentario.cambiosLunares === "Sí"} onClick={() => handleRadioChange("tegumentario", "cambiosLunares", "Sí")} />
                         <WordButton label="No" isSelected={formValues.tegumentario.cambiosLunares === "No"} onClick={() => handleRadioChange("tegumentario", "cambiosLunares", "No")} />
                       </div>
                     </div>
                     <div>
                       <Label>Lesiones pigmentadas</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="Sí" isSelected={formValues.tegumentario.lesionesPigmentadas === "Sí"} onClick={() => handleRadioChange("tegumentario", "lesionesPigmentadas", "Sí")} />
                         <WordButton label="No" isSelected={formValues.tegumentario.lesionesPigmentadas === "No"} onClick={() => handleRadioChange("tegumentario", "lesionesPigmentadas", "No")} />
                       </div>
                     </div>
                   </div>
                 </div>

                {/* SISTEMA MÚSCULO-ESQUELÉTICO */}
                 <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                   <h4 className="text-lg font-semibold mb-2 text-justify">Sistema Músculo-Esquelético</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <Label>Fracturas o Esguinces</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="Sí" isSelected={formValues.musculoEsqueletico.fracturas === "Sí"} onClick={() => handleRadioChange("musculoEsqueletico", "fracturas", "Sí")} />
                         <WordButton label="No" isSelected={formValues.musculoEsqueletico.fracturas === "No"} onClick={() => handleRadioChange("musculoEsqueletico", "fracturas", "No")} />
                       </div>
                     </div>
                     <div>
                       <Label>Detalles de Fracturas</Label>
                        <Textarea placeholder="Escriba especificaciones..." value={formValues.musculoEsqueletico.detallesFracturas} onChange={(e) => handleTextChange("musculoEsqueletico", "detallesFracturas", e.target.value)} className="w-full mt-1" rows={2} disabled={formValues.musculoEsqueletico.fracturas !== 'Sí'}/>
                     </div>
                     {/* Sintomas Musculoesqueleticos - Checkbox group */}
                     <div className="md:col-span-2">
                       <Label>Síntomas Musculoesqueléticos</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="Deformidad Articular" isSelected={formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Deformidad articular")} onClick={() => handleCheckboxChange("musculoEsqueletico", "sintomasMusculoEsqueleticos", "Deformidad articular", !formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Deformidad articular"))} />
                         <WordButton label="Dolor Articular" isSelected={formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Dolor articular")} onClick={() => handleCheckboxChange("musculoEsqueletico", "sintomasMusculoEsqueleticos", "Dolor articular", !formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Dolor articular"))} />
                         <WordButton label="Calambres musculares frecuentes" isSelected={formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Calambres musculares frecuentes")} onClick={() => handleCheckboxChange("musculoEsqueletico", "sintomasMusculoEsqueleticos", "Calambres musculares frecuentes", !formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Calambres musculares frecuentes"))} />
                         <WordButton label="Ninguno" isSelected={formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Ninguno")} onClick={() => handleCheckboxChange("musculoEsqueletico", "sintomasMusculoEsqueleticos", "Ninguno", !formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Ninguno"))} />
                       </div>
                     </div>
                      {/* *** CAMPO MODIFICADO FUNCIONALMENTE *** */}
                     <div>
                       <Label>Rigidez matutina</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="Menos de 30 min" isSelected={formValues.musculoEsqueletico.rigidezMatutina === "Menos de 30 min"} onClick={() => handleRadioChange("musculoEsqueletico", "rigidezMatutina", "Menos de 30 min")} />
                         <WordButton label="Más de 30 min" isSelected={formValues.musculoEsqueletico.rigidezMatutina === "Más de 30 min"} onClick={() => handleRadioChange("musculoEsqueletico", "rigidezMatutina", "Más de 30 min")} />
                         {/* *** Nueva Opción AÑADIDA *** */}
                         <WordButton label="No presenta rigidez matutina" isSelected={formValues.musculoEsqueletico.rigidezMatutina === "No presenta rigidez matutina"} onClick={() => handleRadioChange("musculoEsqueletico", "rigidezMatutina", "No presenta rigidez matutina")} />
                       </div>
                     </div>
                     <div>
                       <Label>Debilidad muscular</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="Generalizada" isSelected={formValues.musculoEsqueletico.debilidadMuscular === "Generalizada"} onClick={() => handleRadioChange("musculoEsqueletico", "debilidadMuscular", "Generalizada")} />
                         <WordButton label="Localizada" isSelected={formValues.musculoEsqueletico.debilidadMuscular === "Localizada"} onClick={() => handleRadioChange("musculoEsqueletico", "debilidadMuscular", "Localizada")} />
                         <WordButton label="No" isSelected={formValues.musculoEsqueletico.debilidadMuscular === "No"} onClick={() => handleRadioChange("musculoEsqueletico", "debilidadMuscular", "No")} />
                       </div>
                     </div>
                     <div className="md:col-span-2">
                       <Label>Limitaciones de Movimiento</Label>
                       <Textarea placeholder="Escriba especificaciones..." value={formValues.musculoEsqueletico.limitacionesMovimiento} onChange={(e) => handleTextChange("musculoEsqueletico", "limitacionesMovimiento", e.target.value)} className="w-full mt-1" rows={2}/>
                     </div>
                   </div>
                 </div>

                {/* SISTEMA NERVIOSO */}
                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                   <h4 className="text-lg font-semibold mb-2 text-justify">Sistema Nervioso</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <Label>Percepción de los Sentidos</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                           {/* Simplificado a Sí/No como en el original, ajustar si necesitas detalle */}
                           <WordButton label="Sí (Adecuada)" isSelected={formValues.nervioso.percepcionSentidos === "Sí"} onClick={() => handleRadioChange("nervioso", "percepcionSentidos", "Sí")} />
                           <WordButton label="No (Alterada)" isSelected={formValues.nervioso.percepcionSentidos === "No"} onClick={() => handleRadioChange("nervioso", "percepcionSentidos", "No")} />
                       </div>
                     </div>
                     <div>
                       <Label>Horas de Sueño</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="Menos de 4" isSelected={formValues.nervioso.horasSueno === "Menos de 4"} onClick={() => handleRadioChange("nervioso", "horasSueno", "Menos de 4")} />
                         <WordButton label="4 a 6" isSelected={formValues.nervioso.horasSueno === "4 a 6"} onClick={() => handleRadioChange("nervioso", "horasSueno", "4 a 6")} />
                         <WordButton label="7 a 8" isSelected={formValues.nervioso.horasSueno === "7 a 8"} onClick={() => handleRadioChange("nervioso", "horasSueno", "7 a 8")} />
                         <WordButton label="Más de 8" isSelected={formValues.nervioso.horasSueno === "Más de 8"} onClick={() => handleRadioChange("nervioso", "horasSueno", "Más de 8")} />
                       </div>
                     </div>
                     <div>
                       <Label>Trastornos del Sueño</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="Sí" isSelected={formValues.nervioso.trastornosSueno === "Sí"} onClick={() => handleRadioChange("nervioso", "trastornosSueno", "Sí")} />
                         <WordButton label="No" isSelected={formValues.nervioso.trastornosSueno === "No"} onClick={() => handleRadioChange("nervioso", "trastornosSueno", "No")} />
                       </div>
                       {formValues.nervioso.trastornosSueno === "Sí" && (<Textarea placeholder="Escriba especificaciones..." value={formValues.nervioso.trastornosSuenoEspecificaciones} onChange={(e) => handleTextChange("nervioso", "trastornosSuenoEspecificaciones", e.target.value)} className="w-full mt-2" rows={2}/>)}
                     </div>
                     <div>
                       <Label>Estado de Ánimo</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="Tranquilo" isSelected={formValues.nervioso.estadoAnimo === "Tranquilo"} onClick={() => handleRadioChange("nervioso", "estadoAnimo", "Tranquilo")} />
                         <WordButton label="Irritable" isSelected={formValues.nervioso.estadoAnimo === "Irritable"} onClick={() => handleRadioChange("nervioso", "estadoAnimo", "Irritable")} />
                         <WordButton label="Aprensivo" isSelected={formValues.nervioso.estadoAnimo === "Aprensivo"} onClick={() => handleRadioChange("nervioso", "estadoAnimo", "Aprensivo")} />
                         <WordButton label="Alegre" isSelected={formValues.nervioso.estadoAnimo === "Alegre"} onClick={() => handleRadioChange("nervioso", "estadoAnimo", "Alegre")} />
                       </div>
                     </div>
                     <div>
                       <Label>Parestesias</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="Sí" isSelected={formValues.nervioso.parestesias === "Sí"} onClick={() => handleRadioChange("nervioso", "parestesias", "Sí")} />
                         <WordButton label="No" isSelected={formValues.nervioso.parestesias === "No"} onClick={() => handleRadioChange("nervioso", "parestesias", "No")} />
                       </div>
                     </div>
                     {/* Otros Sintomas Neurologicos - Checkbox group */}
                     <div className="md:col-span-2">
                       <Label>Otros Síntomas Neurológicos</Label>
                       {/* *** CONTENEDOR ORIGINAL *** */}
                       <div className="flex flex-wrap mt-1">
                         <WordButton label="Convulsiones" isSelected={formValues.nervioso.otrosSintomasNeurologicos.includes("Convulsiones")} onClick={() => handleCheckboxChange("nervioso", "otrosSintomasNeurologicos", "Convulsiones", !formValues.nervioso.otrosSintomasNeurologicos.includes("Convulsiones"))} />
                         <WordButton label="Temblores" isSelected={formValues.nervioso.otrosSintomasNeurologicos.includes("Temblores")} onClick={() => handleCheckboxChange("nervioso", "otrosSintomasNeurologicos", "Temblores", !formValues.nervioso.otrosSintomasNeurologicos.includes("Temblores"))} />
                         <WordButton label="Problemas de memoria o concentración" isSelected={formValues.nervioso.otrosSintomasNeurologicos.includes("Problemas de memoria o concentración")} onClick={() => handleCheckboxChange("nervioso", "otrosSintomasNeurologicos", "Problemas de memoria o concentración", !formValues.nervioso.otrosSintomasNeurologicos.includes("Problemas de memoria o concentración"))} />
                         <WordButton label="Cambios de personalidad o comportamiento" isSelected={formValues.nervioso.otrosSintomasNeurologicos.includes("Cambios de personalidad o comportamiento")} onClick={() => handleCheckboxChange("nervioso", "otrosSintomasNeurologicos", "Cambios de personalidad o comportamiento", !formValues.nervioso.otrosSintomasNeurologicos.includes("Cambios de personalidad o comportamiento"))} />
                         <WordButton label="Coordinación motora alterada" isSelected={formValues.nervioso.otrosSintomasNeurologicos.includes("Coordinación motora alterada")} onClick={() => handleCheckboxChange("nervioso", "otrosSintomasNeurologicos", "Coordinación motora alterada", !formValues.nervioso.otrosSintomasNeurologicos.includes("Coordinación motora alterada"))} />
                         <WordButton label="Ninguno" isSelected={formValues.nervioso.otrosSintomasNeurologicos.includes("Ninguno")} onClick={() => handleCheckboxChange("nervioso", "otrosSintomasNeurologicos", "Ninguno", !formValues.nervioso.otrosSintomasNeurologicos.includes("Ninguno"))} />
                       </div>
                     </div>
                   </div>
                 </div>

                {/* Botones Finales (Generar/Limpiar) */}
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
               // --- VISTA DE REDACCIONES (Sin cambios) ---
              <div className="space-y-6">
                {Object.entries(redacciones).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-lg font-semibold capitalize text-gray-800 dark:text-gray-200">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
                            <button onClick={() => handleCopy(key as keyof typeof redacciones)} className="text-blue-500 hover:text-blue-700 flex items-center gap-1 transition-colors duration-200 text-xs px-2 py-1 rounded border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/50">
                                {copied[key] ? (<><CheckCircle className="w-3.5 h-3.5 text-green-500" />Copiado</>) : (<><Copy className="w-3.5 h-3.5" />Copiar</>)}
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

// *** Componente WordButton RESTAURADO A TU VERSIÓN ORIGINAL ***
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
          type="button" // Buena práctica añadir type="button"
          onClick={onClick}
          // Clases CSS originales que me proporcionaste
          className={`px-2 py-1 text-xs rounded-md transition-colors mb-1 mr-1 ${isSelected
              ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200" // Estilo seleccionado original
              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700" // Estilo no seleccionado original
          }`}
        >
          {label}
      </button>
  );
};

export default InterrogatorioSistemas;