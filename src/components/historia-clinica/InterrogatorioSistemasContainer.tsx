import React, { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X } from "lucide-react";
import { FormDataState, FormValuesInterrogatorio, RedaccionesInterrogatorio } from '@/types/historiaClinica'; // Asegúrate de definir estos tipos
import InterrogatorioSistemasFormulario from './InterrogatorioSistemasFormulario';
import InterrogatorioSistemasRedacciones from './InterrogatorioSistemasRedacciones';
import { Button } from "@/components/ui/button";

// Define los tipos necesarios si no los tienes en '@/types/historiaClinica'
// Ejemplo:
/*
export interface FormValuesInterrogatorio {
  digestivo: { alimentacion: string; masticacion: string; /* ...otros campos... */ };
  respiratorio: { tipoRespiracion: string; /* ...otros campos... */ };
  // ... otros sistemas
}

export interface RedaccionesInterrogatorio {
  digestivo: string;
  respiratorio: string;
  cardiovascular: string;
  genitoUrinario: string;
  endocrino: string;
  tegumentario: string;
  musculoEsqueletico: string;
  nervioso: string;
}

export interface FormDataState {
    // ... otros datos del formulario general ...
    interrogatorioSistemas?: RedaccionesInterrogatorio; // Para almacenar las redacciones finales
}
*/


// Estado inicial para los valores del formulario
const initialFormValues: FormValuesInterrogatorio = {
    digestivo: {
        alimentacion: "", masticacion: "", percepcionGusto: "", percepcionGustoEspecificaciones: "",
        salivacion: "", deglusion: "", halitosis: "", halitosisEspecificaciones: "",
        sintomasDigestivos: [], cambiosApetito: "", habitosAlimenticios: "",
        colorEvacuaciones: "", hematemesis: "", frecuenciaEvacuacion: "",
        frecuenciaEvacuacionEspecificaciones: ""
    },
    respiratorio: {
        tipoRespiracion: "", sintomasRespiratorios: [], apneaSuenio: "",
        oxigenoSuplementario: "", tosExpectoracion: ""
    },
    cardiovascular: {
        dolorPecho: "", lipotimia: "", ritmoCardiaco: "", sintomasCardiovasculares: [],
        presionArterial: "", antecedentesInfarto: "", fatigaEsfuerzo: ""
    },
    genitoUrinario: {
        frecuenciaUrinaria: "", sintomasUrinarios: [], urgenciaUrinaria: "",
        chorroUrinarioDebil: "", chorroUrinarioIntermitente: "", flujoVaginalUretral: "",
        infeccionesUrinarias: "", ultimaMenstruacion: "", dismenorrea: "",
        duracionMenstruacion: "", ultimoParto: "", antecedentesObstetricos: ""
    },
    endocrino: {
        sintomasEndocrinos: [], sudoracionNocturna: "", hirsutismo: "",
        galactorrea: "", cambiosRitmoMenstrual: "", cambiosPeso: "",
        intolerancia: "", condicionesEndocrinas: ""
    },
    tegumentario: {
        cambiosColoracion: "", cambiosColoracionEspecificaciones: "", sintomasTegumentarios: [],
        cambiosUnas: "", cambiosLunares: "", lesionesPigmentadas: ""
    },
    musculoEsqueletico: {
        fracturas: "", detallesFracturas: "", sintomasMusculoEsqueleticos: [],
        rigidezMatutina: "", debilidadMuscular: "", limitacionesMovimiento: ""
    },
    nervioso: {
        percepcionSentidos: "", horasSueno: "", trastornosSueno: "",
        trastornosSuenoEspecificaciones: "", estadoAnimo: "", parestesias: "",
        otrosSintomasNeurologicos: []
    }
};

// Estado inicial para las redacciones
const initialRedacciones: RedaccionesInterrogatorio = {
    digestivo: "", respiratorio: "", cardiovascular: "", genitoUrinario: "",
    endocrino: "", tegumentario: "", musculoEsqueletico: "", nervioso: ""
};


interface InterrogatorioSistemasContainerProps {
    formData: FormDataState; // El estado general que contiene todos los datos
    // Esta función actualizará el estado general de la historia clínica
    onInterrogatorioChange: (redacciones: RedaccionesInterrogatorio) => void;
}

const InterrogatorioSistemasContainer: React.FC<InterrogatorioSistemasContainerProps> = ({
    formData, // Podrías usarlo para inicializar formValues si es necesario
    onInterrogatorioChange
}) => {
    const [isMinimized, setIsMinimized] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [showForm, setShowForm] = useState(true); // Inicia mostrando el formulario
    const [formValues, setFormValues] = useState<FormValuesInterrogatorio>(initialFormValues);
    const [redacciones, setRedacciones] = useState<RedaccionesInterrogatorio>(initialRedacciones);
    const redaccionesRef = useRef<HTMLDivElement>(null);

    // Cargar datos iniciales si existen en formData (opcional)
    // useEffect(() => {
    //     if (formData.interrogatorioSistemas) {
    //         // Aquí necesitarías una lógica inversa para rellenar formValues
    //         // basado en las redacciones guardadas, o guardar formValues directamente.
    //         // Por simplicidad, asumimos que empezamos de cero o que `formValues`
    //         // se guarda/carga por separado si es necesario.
    //         setRedacciones(formData.interrogatorioSistemas);
    //     }
    // }, [formData]);

    const handleMinimize = () => {
        setIsMinimized(!isMinimized);
        setIsMaximized(false);
    };

    const handleMaximize = () => {
        setIsMaximized(!isMaximized);
        setIsMinimized(false);
    };

    const handleClose = () => {
        // Decide qué hacer al cerrar. ¿Ocultar? ¿Resetear?
        // Por ahora, solo minimiza y quita maximizado.
        setIsMinimized(false);
        setIsMaximized(false);
        // Podrías querer ocultar el componente completo aquí
    };

    const handleValueChange = (system: keyof FormValuesInterrogatorio, field: string, value: string | string[] | boolean) => {
      setFormValues(prev => {
          const systemKey = system as keyof typeof prev; // Asegurar que 'system' es una clave válida
          const fieldKey = field as keyof typeof prev[typeof systemKey]; // Asegurar que 'field' es una clave válida dentro del sistema

          // Comprobación adicional para asegurar que field existe en el sistema
          if (!(fieldKey in prev[systemKey])) {
              console.error(`Field "${field}" does not exist in system "${system}"`);
              return prev;
          }

          // Crear una copia profunda del sistema específico para evitar mutaciones directas
          const updatedSystem = { ...prev[systemKey] };

           // Asignar el nuevo valor
          (updatedSystem as any)[fieldKey] = value;

          // Devolver el nuevo estado
          return {
              ...prev,
              [systemKey]: updatedSystem
          };
      });
  };


    const handleRadioChange = (system: keyof FormValuesInterrogatorio, field: string, value: string) => {
        handleValueChange(system, field, value);
    };

    const handleCheckboxChange = (system: keyof FormValuesInterrogatorio, field: string, value: string, checked: boolean) => {
        setFormValues(prev => {
            const currentValues = prev[system][field as keyof typeof prev[typeof system]] as string[];
            let updatedValues: string[];

            if (checked) {
                updatedValues = [...currentValues, value];
            } else {
                updatedValues = currentValues.filter(item => item !== value);
            }

            // Lógica de "Ninguno"
            if (value === "Ninguno" && checked) {
                updatedValues = ["Ninguno"];
            } else if (value !== "Ninguno" && checked && updatedValues.includes("Ninguno")) {
                 updatedValues = updatedValues.filter(item => item !== "Ninguno");
            } else if (!checked && updatedValues.length === 0 && !currentValues.includes("Ninguno")){
                 // Si se desmarca el último síntoma y no era "Ninguno", no hacer nada especial
                 // Opcional: Podrías marcar "Ninguno" automáticamente aquí si lo deseas
            } else if (updatedValues.length > 1 && updatedValues.includes("Ninguno")) {
                 // Asegurar que si se marca otra opción, "Ninguno" se quite
                 updatedValues = updatedValues.filter(item => item !== "Ninguno");
            }


            // Crear copia actualizada del sistema
            const updatedSystem = { ...prev[system], [field]: updatedValues };

            return {
                ...prev,
                [system]: updatedSystem
            };
        });
    };


    const handleTextChange = (system: keyof FormValuesInterrogatorio, field: string, value: string) => {
        handleValueChange(system, field, value);
    };

    const clearForm = () => {
        setFormValues(initialFormValues);
        setRedacciones(initialRedacciones);
        onInterrogatorioChange(initialRedacciones); // Notifica al padre que se limpió
        setShowForm(true); // Vuelve al formulario
    };

    // --- Funciones de generación de texto (movidas del componente original) ---
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
            return "[sin especificar]";
        }
     };
    // --- Fin Funciones de generación de texto ---


    const generateAndUpdateRedacciones = () => {
        // --- Lógica de generación de texto (movida del componente original) ---
        let digestivoText = `El paciente refiere alimentación de tipo ${formValues.digestivo.alimentacion || "[sin especificar]"}. Su patrón de masticación es ${formValues.digestivo.masticacion || "[sin especificar]"}. Manifiesta ${getPercepcionGustoText()}. ${formValues.digestivo.percepcionGustoEspecificaciones ? `Especificaciones: ${formValues.digestivo.percepcionGustoEspecificaciones}.` : ''} La salivación ${getSalivacionText()}. Respecto a la deglución, ${getDeglusiónText()}. ${formValues.digestivo.halitosis === "Sí" ? "Presenta halitosis" : "No presenta halitosis"}${formValues.digestivo.halitosis === "Sí" && formValues.digestivo.halitosisEspecificaciones ? ` (${formValues.digestivo.halitosisEspecificaciones}).` : "."}`;

        if (!formValues.digestivo.sintomasDigestivos || formValues.digestivo.sintomasDigestivos.length === 0 || formValues.digestivo.sintomasDigestivos.includes("Ninguno")) {
            digestivoText += " El paciente niega alteraciones relacionadas al sistema digestivo. Se interrogó específicamente sobre distensión abdominal, estreñimiento, plenitud posprandial, pirosis, dolor abdominal, náuseas, vómito y reflujo.";
        } else {
            digestivoText += ` Ha experimentado los siguientes síntomas digestivos: ${formValues.digestivo.sintomasDigestivos.join(", ")}.`;
        }

        digestivoText += ` ${formValues.digestivo.cambiosApetito ? `Refiere cambios en el apetito: ${formValues.digestivo.cambiosApetito}.` : 'No refiere cambios en el apetito.'} ${formValues.digestivo.habitosAlimenticios && formValues.digestivo.habitosAlimenticios !== "Ninguno" ? `Describe hábitos alimenticios como: ${formValues.digestivo.habitosAlimenticios}.` : 'No refiere hábitos alimenticios particulares.'} El color de las evacuaciones es ${getColorEvacuacionesText()}. ${formValues.digestivo.hematemesis === "Sí" ? "Presenta hematemesis." : "Niega hematemesis."} Realiza ${formValues.digestivo.frecuenciaEvacuacion || "[sin especificar]"} evacuaciones diarias${formValues.digestivo.frecuenciaEvacuacion === "Otra" && formValues.digestivo.frecuenciaEvacuacionEspecificaciones ? ` (${formValues.digestivo.frecuenciaEvacuacionEspecificaciones})` : ''}.`;

        // --- Respiratorio ---
        let respiratorioText = `El tipo de respiración habitual es ${formValues.respiratorio.tipoRespiracion || "[sin especificar]"}.`;
        if (!formValues.respiratorio.sintomasRespiratorios || formValues.respiratorio.sintomasRespiratorios.length === 0 || formValues.respiratorio.sintomasRespiratorios.includes("Ninguno")) {
            respiratorioText += " El paciente niega alteraciones relacionadas al sistema respiratorio. Se interrogó específicamente sobre obstrucción nasal, rinorrea, congestión nasal, epistaxis, disnea, tos, dolor torácico, hernias, expectoraciones, secreciones y cianosis.";
        } else {
            respiratorioText += ` Presenta síntomas respiratorios como: ${formValues.respiratorio.sintomasRespiratorios.join(", ")}.`;
        }
        respiratorioText += ` ${formValues.respiratorio.apneaSuenio === "Sí" ? "Refiere apnea del sueño." : "Niega apnea del sueño."} ${formValues.respiratorio.oxigenoSuplementario === "Sí" ? "Usa oxígeno suplementario." : "No usa oxígeno suplementario."} ${formValues.respiratorio.tosExpectoracion ? `Presenta tos con expectoración de tipo: ${formValues.respiratorio.tosExpectoracion}.` : 'No refiere tos con expectoración.'}`;

        // --- Cardiovascular ---
        let cardiovascularText = `${formValues.cardiovascular.dolorPecho === "No" ? "No refiere" : "Refiere"} dolor en el pecho. ${formValues.cardiovascular.lipotimia === "Sí" ? "Ha presentado" : "No ha presentado"} episodios de lipotimia. El ritmo cardíaco es ${formValues.cardiovascular.ritmoCardiaco || "[sin especificar]"}.`;
        if (!formValues.cardiovascular.sintomasCardiovasculares || formValues.cardiovascular.sintomasCardiovasculares.length === 0 || formValues.cardiovascular.sintomasCardiovasculares.includes("Ninguno")) {
            cardiovascularText += " El paciente niega alteraciones relacionadas al sistema cardiovascular. Se interrogó sobre mareos, edema, equimosis, várices, cefalea, acúfenos, fosfenos y palpitaciones.";
        } else {
            cardiovascularText += ` Sintomatología cardiovascular reportada: ${formValues.cardiovascular.sintomasCardiovasculares.join(", ")}.`;
        }
        cardiovascularText += ` ${formValues.cardiovascular.presionArterial ? `Refiere presión arterial ${formValues.cardiovascular.presionArterial}.` : 'No especifica presión arterial conocida.'} ${formValues.cardiovascular.antecedentesInfarto === "Sí" ? "Tiene antecedentes de infarto o enfermedad coronaria." : "Niega antecedentes de infarto o enfermedad coronaria."} ${formValues.cardiovascular.fatigaEsfuerzo === "Sí" ? "Presenta fatiga fácil con esfuerzo leve." : "No presenta fatiga fácil con esfuerzo leve."}`;

        // --- Genito-Urinario ---
        let genitoUrinarioText = `El paciente refiere una frecuencia urinaria de ${formValues.genitoUrinario.frecuenciaUrinaria || "[sin especificar]"} veces al día.`;
        if (!formValues.genitoUrinario.sintomasUrinarios || formValues.genitoUrinario.sintomasUrinarios.length === 0 || formValues.genitoUrinario.sintomasUrinarios.includes("Ninguno")) {
            genitoUrinarioText += " Niega alteraciones relacionadas al aparato genito-urinario. Se exploró incontinencia, disuria, hematuria, poliuria, nicturia y dolor lumbar.";
        } else {
            genitoUrinarioText += ` Síntomas urinarios presentes: ${formValues.genitoUrinario.sintomasUrinarios.join(", ")}.`;
        }
        genitoUrinarioText += ` ${formValues.genitoUrinario.urgenciaUrinaria === "Sí" ? "Presenta urgencia urinaria." : "Niega urgencia urinaria."} ${formValues.genitoUrinario.chorroUrinarioDebil === "Sí" ? "Presenta chorro urinario débil." : "Niega chorro urinario débil."} ${formValues.genitoUrinario.chorroUrinarioIntermitente === "Sí" ? "Presenta chorro urinario intermitente." : "Niega chorro urinario intermitente."} ${formValues.genitoUrinario.flujoVaginalUretral === "Sí" ? "Refiere flujo vaginal/uretral anormal." : "Niega flujo vaginal/uretral anormal."} ${formValues.genitoUrinario.infeccionesUrinarias === "Sí" ? "Refiere infecciones urinarias frecuentes." : "Niega infecciones urinarias frecuentes."}`;
        // Datos gineco-obstétricos
        if (formValues.genitoUrinario.ultimaMenstruacion) {
            genitoUrinarioText += ` Fecha de última menstruación: ${formValues.genitoUrinario.ultimaMenstruacion}.`;
        }
        if (formValues.genitoUrinario.dismenorrea) {
             genitoUrinarioText += ` Dismenorrea: ${formValues.genitoUrinario.dismenorrea}.`;
        }
         if (formValues.genitoUrinario.duracionMenstruacion) {
             genitoUrinarioText += ` Duración de menstruación: ${formValues.genitoUrinario.duracionMenstruacion}.`;
        }
         if (formValues.genitoUrinario.ultimoParto) {
             genitoUrinarioText += ` Fecha de último parto: ${formValues.genitoUrinario.ultimoParto}.`;
        }
         genitoUrinarioText += ` Antecedentes obstétricos: ${formValues.genitoUrinario.antecedentesObstetricos || "ninguno"}.`;


        // --- Endocrino ---
        let endocrinoText = "";
        if (!formValues.endocrino.sintomasEndocrinos || formValues.endocrino.sintomasEndocrinos.length === 0 || formValues.endocrino.sintomasEndocrinos.includes("Ninguno")) {
            endocrinoText += "El paciente niega alteraciones relacionadas al sistema endocrino. Se indagó sobre poliuria, polidipsia, polifagia, exoftalmos, nerviosismo, temblores, insomnio, cambios de peso e intolerancia al frío o calor.";
        } else {
             endocrinoText += `El paciente refiere los siguientes síntomas endocrinos: ${formValues.endocrino.sintomasEndocrinos.join(", ")}.`;
        }
        endocrinoText += ` ${formValues.endocrino.sudoracionNocturna === "Sí" ? "Presenta sudoración excesiva nocturna." : "Niega sudoración excesiva nocturna."} ${formValues.endocrino.hirsutismo === "Sí" ? "Presenta hirsutismo." : "Niega hirsutismo."} ${formValues.endocrino.galactorrea === "Sí" ? "Presenta galactorrea." : "Niega galactorrea."} ${formValues.endocrino.cambiosRitmoMenstrual ? `Refiere cambios en el ritmo menstrual: ${formValues.endocrino.cambiosRitmoMenstrual}.` : ''} Reporta ${getCambiosPesoText()}. ${getIntoleranciaText()}. Antecedentes patológicos conocidos: ${formValues.endocrino.condicionesEndocrinas || "ninguno"}.`;

        // --- Tegumentario ---
        let tegumentarioText = `${formValues.tegumentario.cambiosColoracion === "Sí" ? "Ha notado cambios en la coloración de la piel" : "No ha notado cambios en la coloración de la piel"}${formValues.tegumentario.cambiosColoracion === "Sí" && formValues.tegumentario.cambiosColoracionEspecificaciones ? ` (${formValues.tegumentario.cambiosColoracionEspecificaciones}).` : "."}`;
        if (!formValues.tegumentario.sintomasTegumentarios || formValues.tegumentario.sintomasTegumentarios.length === 0 || formValues.tegumentario.sintomasTegumentarios.includes("Ninguno")) {
            tegumentarioText += " El paciente niega alteraciones relacionadas al sistema tegumentario. Se investigó presencia de erupciones, prurito, hiperhidrosis, pérdida de cabello y piel seca.";
        } else {
            tegumentarioText += ` Otros síntomas presentes: ${formValues.tegumentario.sintomasTegumentarios.join(", ")}.`;
        }
        tegumentarioText += ` ${formValues.tegumentario.cambiosUnas ? `Refiere cambios en uñas: ${formValues.tegumentario.cambiosUnas}.` : 'No refiere cambios en uñas.'} ${formValues.tegumentario.cambiosLunares === "Sí" ? "Presenta cambios en lunares." : "Niega cambios en lunares."} ${formValues.tegumentario.lesionesPigmentadas === "Sí" ? "Presenta lesiones pigmentadas." : "Niega lesiones pigmentadas."}`;

        // --- MusculoEsqueletico ---
        let musculoEsqueleticoText = `${formValues.musculoEsqueletico.fracturas === "No" ? "Niega antecedentes de" : "Refiere antecedentes de"} fracturas o esguinces${formValues.musculoEsqueletico.fracturas === "Sí" && formValues.musculoEsqueletico.detallesFracturas ? `: ${formValues.musculoEsqueletico.detallesFracturas}.` : "."}`;
        if (!formValues.musculoEsqueletico.sintomasMusculoEsqueleticos || formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.length === 0 || formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Ninguno")) {
            musculoEsqueleticoText += " El paciente niega alteraciones relacionadas al sistema músculo-esquelético. Se interrogó sobre deformidad o dolor articular, calambres musculares y limitaciones de movimiento.";
        } else {
            musculoEsqueleticoText += ` Sintomatología musculoesquelética actual: ${formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.join(", ")}.`;
        }
        musculoEsqueleticoText += ` ${formValues.musculoEsqueletico.rigidezMatutina ? `Refiere rigidez matutina (${formValues.musculoEsqueletico.rigidezMatutina}).` : 'Niega rigidez matutina.'} ${formValues.musculoEsqueletico.debilidadMuscular && formValues.musculoEsqueletico.debilidadMuscular !== "No" ? `Refiere debilidad muscular ${formValues.musculoEsqueletico.debilidadMuscular}.` : 'Niega debilidad muscular.'} ${formValues.musculoEsqueletico.limitacionesMovimiento ? `Describe limitaciones de movimiento: ${formValues.musculoEsqueletico.limitacionesMovimiento}.` : 'Niega limitaciones de movimiento.'}`;

        // --- Nervioso ---
        let nerviosoText = `${formValues.nervioso.percepcionSentidos === "Sí" ? "Percibe" : "No percibe"} adecuadamente a través de los órganos de los sentidos. El patrón de sueño habitual es de ${formValues.nervioso.horasSueno || "[sin especificar]"} horas por noche. ${formValues.nervioso.trastornosSueno === "Sí" ? "Presenta trastornos del sueño" : "No presenta trastornos del sueño"}${formValues.nervioso.trastornosSueno === "Sí" && formValues.nervioso.trastornosSuenoEspecificaciones ? ` (${formValues.nervioso.trastornosSuenoEspecificaciones}).` : "."} Su carácter habitual se describe como ${formValues.nervioso.estadoAnimo || "[sin especificar]"}. ${formValues.nervioso.parestesias === "Sí" ? "Presenta" : "Niega"} parestesias (hormigueos, adormecimiento o pérdida de sensibilidad).`;
        if (!formValues.nervioso.otrosSintomasNeurologicos || formValues.nervioso.otrosSintomasNeurologicos.length === 0 || formValues.nervioso.otrosSintomasNeurologicos.includes("Ninguno")) {
            nerviosoText += " Niega otras alteraciones relacionadas al sistema nervioso. Se preguntó sobre convulsiones, temblores, problemas de memoria/concentración, cambios de personalidad/comportamiento y coordinación motora.";
        } else {
            nerviosoText += ` Otros síntomas neurológicos: ${formValues.nervioso.otrosSintomasNeurologicos.join(", ")}.`;
        }
        // --- Fin Lógica de generación ---

        const nuevasRedacciones: RedaccionesInterrogatorio = {
            digestivo: digestivoText,
            respiratorio: respiratorioText,
            cardiovascular: cardiovascularText,
            genitoUrinario: genitoUrinarioText,
            endocrino: endocrinoText,
            tegumentario: tegumentarioText,
            musculoEsqueletico: musculoEsqueleticoText,
            nervioso: nerviosoText
        };

        setRedacciones(nuevasRedacciones);
        onInterrogatorioChange(nuevasRedacciones); // Actualiza el estado del componente padre principal

        // Cambiar a la vista de redacción y hacer scroll
        setShowForm(false);
        setTimeout(() => {
            redaccionesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };


    return (
        <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}>
            <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto flex flex-col" : ""}`}>
                {/* --- Cabecera --- */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
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

                 {/* --- Título --- */}
                 <div className="flex justify-start px-6 py-2 flex-shrink-0">
                     <h2 className="text-xl font-semibold flex items-center gap-2">
                         <span className="text-gray-400">IX.</span> INTERROGATORIO POR APARATOS Y SISTEMAS
                     </h2>
                 </div>

                {/* --- Contenido (Formulario o Redacciones) --- */}
                {!isMinimized && (
                     <div className={`p-6 ${isMaximized ? "flex-grow overflow-y-auto" : ""}`}>
                        {showForm ? (
                            <InterrogatorioSistemasFormulario
                                formValues={formValues}
                                onRadioChange={handleRadioChange}
                                onCheckboxChange={handleCheckboxChange}
                                onTextChange={handleTextChange}
                                onGenerate={generateAndUpdateRedacciones}
                                onClear={clearForm}
                            />
                        ) : (
                            <InterrogatorioSistemasRedacciones
                                ref={redaccionesRef} // Pasa la ref al componente hijo
                                redacciones={redacciones}
                                onBackToForm={() => setShowForm(true)}
                            />
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default InterrogatorioSistemasContainer;