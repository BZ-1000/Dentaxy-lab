import React, { useState, useEffect, useCallback } from 'react'; // Añadir useCallback
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X, Edit, FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// Interfaz y Estado Inicial (sin cambios respecto a la versión autocontenida)
interface ArticulacionCraneomandibularState {
    dolorMasticarHablar?: boolean | null;
    tipoDolor?: string;
    duracionDolor?: string;
    dolorEspecifico?: boolean | null;
    motivoDolor?: string;
    ruidoArticular?: string | null;
    patronAbertura?: string | null;
    otroPatronAbertura?: string;
    otrasObservaciones?: string;
    labios: {
        simetria?: string | null;
        volumen?: string | null;
        coloracion?: string | null;
        hidratacion?: string | null;
        integridad?: string | null;
        comisuras?: string | null;
        movimiento?: string | null;
        otrasObservaciones?: string;
    };
}

const initialState: ArticulacionCraneomandibularState = {
    dolorMasticarHablar: null, tipoDolor: '', duracionDolor: '', dolorEspecifico: null, motivoDolor: '',
    ruidoArticular: null, patronAbertura: null, otroPatronAbertura: '', otrasObservaciones: '',
    labios: {
        simetria: null, volumen: null, coloracion: null, hidratacion: null, integridad: null,
        comisuras: null, movimiento: null, otrasObservaciones: ''
    }
};

// Opciones (Actualizar etiqueta de movimiento)
type Option = { label: string; value: string };
const simetriaOptions: Option[] = [ { label: "Simétricos", value: "simetricos" },{ label: "Desviación Derecha", value: "asimetricosDerecha" },{ label: "Desviación Izquierda", value: "asimetricosIzquierda" },];
const volumenOptions: Option[] = [ { label: "Delgados", value: "delgados" },{ label: "Medianos", value: "medianos" },{ label: "Gruesos", value: "gruesos" },];
const coloracionOptions: Option[] = [ { label: "Rosados (Normal)", value: "normal" },{ label: "Pálidos", value: "palidos" },{ label: "Cianóticos", value: "cianoticos" },{ label: "Eritematosos", value: "eritematosos" },];
const hidratacionOptions: Option[] = [ { label: "Hidratados", value: "hidratados" },{ label: "Secos", value: "secos" },{ label: "Agrietados", value: "agrietados" },{ label: "Con Costras", value: "costras" },];
const integridadOptions: Option[] = [ { label: "Íntegros", value: "intactos" },{ label: "Heridas", value: "heridas" },{ label: "Ulceraciones", value: "ulceraciones" },{ label: "Fisuras Comisurales", value: "fisuras" },]; // Nota: Fisuras Comisurales podría ir mejor en Comisuras
const comisurasOptions: Option[] = [ { label: "Normales", value: "normales" },{ label: "Erosionadas", value: "erosionadas" },{ label: "Queilitis Angular", value: "queilitis" },];
// Cambiar etiqueta 'Normales' por algo más descriptivo si se quiere, o manejar en la redacción
const movimientoOptions: Option[] = [ { label: "Movimientos Conservados", value: "normales" }, { label: "Restricción Movimiento", value: "restriccion" }, { label: "Incompetencia Labial", value: "incompetencia" },];
const patronAberturaOptions: Option[] = [ { label: "Recto", value: "recto" },{ label: "Desviación Derecha", value: "desviacionDerecha" },{ label: "Desviación Izquierda", value: "desviacionIzquierda" },{ label: "Forma de 'S'", value: "formaS" },{ label: "Otro", value: "otro" }];
const ruidoArticularOptions: Option[] = [ { label: "Abertura", value: "abertura" },{ label: "Cierre", value: "cierre" },{ label: "No", value: "ninguno" },];


const ArticulacionCraneomandibular: React.FC = () => {
    const [formData, setFormData] = useState<ArticulacionCraneomandibularState>(initialState);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [activeTab, setActiveTab] = useState('formulario');

    // Estados para la generación y animación
    const [isGeneratingLipsNarrative, setIsGeneratingLipsNarrative] = useState(false);
    const [isGeneratingRedaccion, setIsGeneratingRedaccion] = useState(false);
    const [lipsViewMode, setLipsViewMode] = useState<'form' | 'narrative'>('form');

    // Estados para el Typewriter Effect
    const [targetLipsNarrative, setTargetLipsNarrative] = useState('');
    const [displayedLipsNarrative, setDisplayedLipsNarrative] = useState('');
    const [targetRedaccion, setTargetRedaccion] = useState('');
    const [displayedRedaccion, setDisplayedRedaccion] = useState('');

    const labiosData = formData.labios || {};

    const handleMinimize = () => { setIsMinimized(!isMinimized); setIsMaximized(false); };
    const handleMaximize = () => { setIsMaximized(!isMaximized); setIsMinimized(false); };
    const handleClose = () => { setIsMinimized(true); setIsMaximized(false); };

    // --- Typewriter Effect Hooks ---
    const typewriterSpeed = 30; // ms por caracter (ajusta según preferencia)

    useEffect(() => {
        if (!targetLipsNarrative) {
            setDisplayedLipsNarrative('');
            return;
        }
        setDisplayedLipsNarrative(''); // Reset display text when target changes
        let index = 0;
        const intervalId = setInterval(() => {
            setDisplayedLipsNarrative((prev) => prev + targetLipsNarrative[index]);
            index++;
            if (index === targetLipsNarrative.length) {
                clearInterval(intervalId);
                setIsGeneratingLipsNarrative(false); // Finaliza "carga" cuando termina de escribir
            }
        }, typewriterSpeed);
        return () => clearInterval(intervalId); // Cleanup
    }, [targetLipsNarrative]); // Depende del texto OBJETIVO

    useEffect(() => {
        if (!targetRedaccion) {
            setDisplayedRedaccion('');
            return;
        }
        setDisplayedRedaccion(''); // Reset display text
        let index = 0;
        const intervalId = setInterval(() => {
            setDisplayedRedaccion((prev) => prev + targetRedaccion[index]);
            index++;
            if (index === targetRedaccion.length) {
                clearInterval(intervalId);
                setIsGeneratingRedaccion(false); // Finaliza "carga"
            }
        }, typewriterSpeed);
        return () => clearInterval(intervalId); // Cleanup
    }, [targetRedaccion]); // Depende del texto OBJETIVO

    // --- Funciones de Actualización de Estado (igual) ---
    const handleArticulacionCraneomandibularChange = useCallback((fieldPath: string, value: any) => {
        setFormData(prevData => {
            const parts = fieldPath.split('.');
            const newState = structuredClone(prevData);
            let currentLevel: any = newState;
            for (let i = 0; i < parts.length - 1; i++) {
                const part = parts[i];
                if (currentLevel[part] === undefined || currentLevel[part] === null) {
                    currentLevel[part] = {};
                }
                currentLevel = currentLevel[part];
            }
            currentLevel[parts[parts.length - 1]] = value;
            return newState;
        });
    }, []); // useCallback para estabilidad si se pasara como prop

    const handleOptionChange = useCallback((fieldPath: string, value: string) => {
        handleArticulacionCraneomandibularChange(fieldPath, value);
    }, [handleArticulacionCraneomandibularChange]);

    const handleTextChange = useCallback((fieldPath: string, value: string) => {
        handleArticulacionCraneomandibularChange(fieldPath, value);
    }, [handleArticulacionCraneomandibularChange]);

    const handleBooleanChange = useCallback((fieldPath: string, value: boolean) => {
        handleArticulacionCraneomandibularChange(fieldPath, value);
    }, [handleArticulacionCraneomandibularChange]);


    // --- **Redacción Mejorada: Labios** ---
    const generateLipsNarrative = () => {
        setIsGeneratingLipsNarrative(true); // Inicia estado de carga
        setTargetLipsNarrative(''); // Limpia target anterior inmediato
        setDisplayedLipsNarrative(''); // Limpia display anterior inmediato

        const data = formData.labios || {};
        let fragments: string[] = [];

        // 1. Simetría y Volumen
        const simetriaDesc = simetriaOptions.find(o => o.value === data.simetria)?.label;
        const volumenDesc = volumenOptions.find(o => o.value === data.volumen)?.label?.toLowerCase();
        if (simetriaDesc) {
            if (data.simetria === 'simetricos') {
                fragments.push(volumenDesc ? `labios simétricos, de volumen ${volumenDesc}` : "labios simétricos");
            } else {
                fragments.push(volumenDesc ? `se observa asimetría (${simetriaDesc.toLowerCase()}), siendo de volumen ${volumenDesc}` : `se observa asimetría (${simetriaDesc.toLowerCase()})`);
            }
        } else if (volumenDesc) {
            fragments.push(`labios de volumen ${volumenDesc}`);
        }

        // 2. Coloración e Hidratación
        const colorDesc = coloracionOptions.find(o => o.value === data.coloracion)?.label;
        const hidratacionDesc = hidratacionOptions.find(o => o.value === data.hidratacion)?.label?.toLowerCase();
        if (colorDesc) {
            let colorText = `presentan una coloración ${colorDesc.toLowerCase()}`;
            if (data.coloracion !== 'normal' && hidratacionDesc) {
                colorText += `, asociada posiblemente a una superficie ${hidratacionDesc}`;
            } else if (hidratacionDesc) {
                colorText += ` y se encuentran ${hidratacionDesc}`;
            }
            fragments.push(colorText);
        } else if (hidratacionDesc) {
            fragments.push(`la superficie labial se encuentra ${hidratacionDesc}`);
        }

        // 3. Integridad y Comisuras
        const integridadDesc = integridadOptions.find(o => o.value === data.integridad)?.label?.toLowerCase();
        const comisurasDesc = comisurasOptions.find(o => o.value === data.comisuras)?.label?.toLowerCase();
        let integridadText = "";
        if (integridadDesc) {
             integridadText = data.integridad === 'intactos' ? "se encuentran íntegros" : `se observan ${integridadDesc}`;
        }
        let comisurasText = "";
        if (comisurasDesc) {
             comisurasText = data.comisuras === 'normales' ? "comisuras normales" : `se evidencia ${comisurasDesc} en comisuras`;
             // Ajuste para fisuras si se movió la opción
             if (data.integridad === 'fisuras') { // Si 'fisuras' está en integridad
                comisurasText = `con fisuras comisurales`;
                if(data.comisuras && data.comisuras !== 'normales') { // Añadir si hay otro problema en comisura
                    comisurasText += ` y ${comisurasDesc}`;
                }
             }
        }

        if (integridadText && comisurasText) {
            fragments.push(`${integridadText}, con ${comisurasText}`);
        } else if (integridadText) {
            fragments.push(integridadText);
        } else if (comisurasText) {
            fragments.push(comisurasText.charAt(0).toUpperCase() + comisurasText.slice(1)); // Capitalizar si empieza frase
        }


        // 4. Movimiento
        const movimientoDesc = movimientoOptions.find(o => o.value === data.movimiento)?.label; // Usar la etiqueta actualizada
        if (movimientoDesc) {
            fragments.push(`respecto a la función, ${movimientoDesc.toLowerCase()}`);
        }

        // 5. Observaciones Adicionales
        if (data.otrasObservaciones) {
            fragments.push(`adicionalmente, se anota: "${data.otrasObservaciones}"`);
        }

        // Construcción final
        let fullContent = "Al examen clínico de los labios, ";
        if (fragments.length > 0) {
            fullContent += fragments.join('. ') + '.';
        } else {
            fullContent = "No se han registrado hallazgos específicos sobre los labios.";
        }

        // Simula un pequeño delay antes de empezar a escribir para que se vea el cambio
        setTimeout(() => {
           setTargetLipsNarrative(fullContent.replace(/\.\./g, '.')); // Reemplaza dobles puntos
           setLipsViewMode('narrative'); // Cambia a vista narrativa
           //setIsGeneratingLipsNarrative(false); // Se mueve al final del typewriter
        }, 100); // Pequeño delay

    };

    // --- **Redacción Mejorada: General (ATM + Labios)** ---
    const generateRedaccion = () => {
        setIsGeneratingRedaccion(true); // Inicia carga
        setTargetRedaccion(''); // Limpia target
        setDisplayedRedaccion(''); // Limpia display

        const atm = formData;
        const labios = formData.labios || {};
        let fullContent = "";
        let atmFragments: string[] = [];
        let lipsFragments: string[] = []; // Usará lógica similar a generateLipsNarrative

        // -- Sección ATM --
        // Dolor general y específico
        let dolorGeneral = "";
        if (atm.dolorMasticarHablar === true) {
            dolorGeneral = "refiere dolor al masticar y/o hablar";
            if (atm.tipoDolor) dolorGeneral += ` (tipo ${atm.tipoDolor.toLowerCase()})`;
            if (atm.duracionDolor) dolorGeneral += ` de duración ${atm.duracionDolor.toLowerCase()}`;
        } else if (atm.dolorMasticarHablar === false) {
            dolorGeneral = "no refiere dolor al masticar o hablar";
        }

        let dolorEspecifico = "";
        if (atm.dolorEspecifico === true && atm.motivoDolor) {
            dolorEspecifico = `presenta dolor específico en ${atm.motivoDolor.toLowerCase()}`;
        } else if (atm.dolorEspecifico === false) {
            // Opcional: añadir "no refiere dolor específico localizado"
        }

        if (dolorGeneral && dolorEspecifico) atmFragments.push(`${dolorGeneral} y ${dolorEspecifico}`);
        else if (dolorGeneral) atmFragments.push(dolorGeneral);
        else if (dolorEspecifico) atmFragments.push(dolorEspecifico.charAt(0).toUpperCase() + dolorEspecifico.slice(1)); // Capitalizar

        // Ruido y Patrón de Abertura
        const ruidoDesc = ruidoArticularOptions.find(o => o.value === atm.ruidoArticular)?.label?.toLowerCase();
        const patronDesc = patronAberturaOptions.find(o => o.value === atm.patronAbertura)?.label?.toLowerCase();
        let ruidoPatronText = "";
        if (ruidoDesc && ruidoDesc !== 'no') {
            ruidoPatronText = `se ausculta ruido articular (${ruidoDesc})`;
        } else if (ruidoDesc === 'no') {
             ruidoPatronText = "no se detectan ruidos articulares";
        }

        if (patronDesc) {
            let patronCompleto = `el patrón de abertura mandibular es ${patronDesc}`;
            if (atm.patronAbertura === 'otro' && atm.otroPatronAbertura) {
                patronCompleto += `: ${atm.otroPatronAbertura}`;
            }
            if (ruidoPatronText) {
                 ruidoPatronText += `, y ${patronCompleto}`;
            } else {
                 ruidoPatronText = patronCompleto.charAt(0).toUpperCase() + patronCompleto.slice(1); // Capitalizar si empieza
            }
        }
        if(ruidoPatronText) atmFragments.push(ruidoPatronText);

        // Observaciones ATM
        if (atm.otrasObservaciones) {
            atmFragments.push(`observaciones adicionales de ATM: "${atm.otrasObservaciones}"`);
        }

        // Construcción ATM
        if (atmFragments.length > 0) {
            fullContent += "Evaluación de la Articulación Craneomandibular:\n";
            fullContent += atmFragments.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join('. ') + '.\n\n'; // Capitalizar inicio de cada frase
        } else {
             fullContent += "Evaluación de la Articulación Craneomandibular: No se registraron hallazgos específicos.\n\n";
        }


        // -- Sección Labios (reutilizar lógica adaptada de generateLipsNarrative) --
         const simetriaDesc = simetriaOptions.find(o => o.value === labios.simetria)?.label;
         const volumenDesc = volumenOptions.find(o => o.value === labios.volumen)?.label?.toLowerCase();
         // ... (copiar/adaptar lógica de fragments de generateLipsNarrative aquí) ...
         if (simetriaDesc) { if (labios.simetria === 'simetricos') { lipsFragments.push(volumenDesc ? `labios simétricos, de volumen ${volumenDesc}` : "labios simétricos"); } else { lipsFragments.push(volumenDesc ? `se observa asimetría (${simetriaDesc.toLowerCase()}), siendo de volumen ${volumenDesc}` : `se observa asimetría (${simetriaDesc.toLowerCase()})`); } } else if (volumenDesc) { lipsFragments.push(`labios de volumen ${volumenDesc}`); }
         const colorDesc = coloracionOptions.find(o => o.value === labios.coloracion)?.label; const hidratacionDesc = hidratacionOptions.find(o => o.value === labios.hidratacion)?.label?.toLowerCase(); if (colorDesc) { let colorText = `presentan una coloración ${colorDesc.toLowerCase()}`; if (labios.coloracion !== 'normal' && hidratacionDesc) { colorText += `, asociada posiblemente a una superficie ${hidratacionDesc}`; } else if (hidratacionDesc) { colorText += ` y se encuentran ${hidratacionDesc}`; } lipsFragments.push(colorText); } else if (hidratacionDesc) { lipsFragments.push(`la superficie labial se encuentra ${hidratacionDesc}`); }
         const integridadDesc = integridadOptions.find(o => o.value === labios.integridad)?.label?.toLowerCase(); const comisurasDesc = comisurasOptions.find(o => o.value === labios.comisuras)?.label?.toLowerCase(); let integridadText = ""; if (integridadDesc) { integridadText = labios.integridad === 'intactos' ? "se encuentran íntegros" : `se observan ${integridadDesc}`; } let comisurasText = ""; if (comisurasDesc) { comisurasText = labios.comisuras === 'normales' ? "comisuras normales" : `se evidencia ${comisurasDesc} en comisuras`; if (labios.integridad === 'fisuras') { comisurasText = `con fisuras comisurales`; if(labios.comisuras && labios.comisuras !== 'normales') { comisurasText += ` y ${comisurasDesc}`; } } } if (integridadText && comisurasText) { lipsFragments.push(`${integridadText}, con ${comisurasText}`); } else if (integridadText) { lipsFragments.push(integridadText); } else if (comisurasText) { lipsFragments.push(comisurasText.charAt(0).toUpperCase() + comisurasText.slice(1)); }
         const movimientoDesc = movimientoOptions.find(o => o.value === labios.movimiento)?.label; if (movimientoDesc) { lipsFragments.push(`respecto a la función, ${movimientoDesc.toLowerCase()}`); }
         if (labios.otrasObservaciones) { lipsFragments.push(`observaciones adicionales en labios: "${labios.otrasObservaciones}"`); }


        // Construcción Labios
        fullContent += "Examen de Labios:\n";
        if (lipsFragments.length > 0) {
            fullContent += lipsFragments.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join('. ') + '.';
        } else {
            fullContent += "No se han registrado hallazgos específicos.";
        }

        // Simula delay y empieza a escribir
         setTimeout(() => {
            setTargetRedaccion(fullContent.replace(/\.\./g, '.').replace('.\n\n.', '.\n\n')); // Limpieza final
            setActiveTab('redaccion'); // Cambia a la pestaña
            //setIsGeneratingRedaccion(false); // Se mueve al final del typewriter
        }, 100);

    };

    // --- Reset (limpia también los targets de animación) ---
    const resetForm = () => {
        setFormData(initialState);
        setLipsViewMode('form');
        // Limpiar estados de animación
        setTargetLipsNarrative('');
        setDisplayedLipsNarrative('');
        setTargetRedaccion('');
        setDisplayedRedaccion('');
        setActiveTab('formulario');
    };

    // --- Render Helper (sin cambios) ---
    const renderOptionButtons = /* ... (igual que antes) ... */ ( title: string, options: Option[], currentValue: string | undefined | null, fieldPath: string ) => ( <div> <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">{title}:</h4> <div className="flex flex-wrap gap-2 mb-4"> {options.map(item => ( <button key={item.value} type="button" className={`px-3 py-1 text-sm rounded-full transition-colors ${ currentValue === item.value ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200' }`} onClick={() => handleOptionChange(fieldPath, item.value)} > {item.label} </button> ))} </div> </div> );


    // --- JSX (adaptar Textareas para mostrar texto animado) ---
    return (
        <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : "my-4"}`} data-section-name="articulacionCraneomandibular">
            <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""} ${isMinimized ? "h-16 overflow-hidden" : ""}`}>
                {/* Header, Título (sin cambios) */}
                 <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700"> <div className="flex justify-center w-full"> <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1"> <button className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${activeTab === 'formulario' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`} onClick={() => setActiveTab('formulario')} > Formulario </button> <button className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${activeTab === 'redaccion' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`} onClick={() => setActiveTab('redaccion')} > Redacción IA (General) </button> </div> </div> <div className="flex items-center gap-2"> <button onClick={handleMinimize} title={isMinimized ? "Restaurar" : "Minimizar"} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"> <Minus className="w-4 h-4 text-gray-600 dark:text-gray-300" /> </button> <button onClick={handleMaximize} title={isMaximized ? "Restaurar" : "Maximizar"} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"> <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-300" /> </button> </div> </div>
                 <div className={`flex justify-start px-6 py-2 ${isMinimized ? 'hidden' : ''}`}> <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800 dark:text-white"> <span className="text-gray-400 dark:text-gray-500">XI.</span> ARTICULACIÓN CRANEOMANDIBULAR Y LABIOS </h2> </div>

                {!isMinimized && (
                    <>
                        {activeTab === 'formulario' ? (
                            <div className="p-6">
                                <div className="space-y-6">
                                    {/* --- Sección ATM (Formulario sin cambios) --- */}
                                    <h3 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-700 dark:text-gray-300">Articulación Craneomandibular</h3>
                                     <div> <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">¿Dolor al masticar o al hablar?</h4> <div className="flex gap-4"> <button type="button" className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.dolorMasticarHablar === true ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'}`} onClick={() => handleBooleanChange('dolorMasticarHablar', true)}>Sí</button> <button type="button" className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.dolorMasticarHablar === false ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'}`} onClick={() => handleBooleanChange('dolorMasticarHablar', false)}>No</button> </div> </div>
                                     {formData.dolorMasticarHablar === true && ( <> <div className="relative pl-4 border-l-2 border-emerald-200 dark:border-emerald-700 space-y-2"> <div> <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Tipo de dolor:</label> <Textarea value={formData.tipoDolor || ''} onChange={e => handleTextChange('tipoDolor', e.target.value)} placeholder="Describa el tipo de dolor (ej. punzante, sordo)" className="min-h-[60px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-emerald-500 focus:border-emerald-500" /> </div> <div> <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Duración:</label> <Textarea value={formData.duracionDolor || ''} onChange={e => handleTextChange('duracionDolor', e.target.value)} placeholder="Describa la duración (ej. constante, intermitente)" className="min-h-[60px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-emerald-500 focus:border-emerald-500" /> </div> </div> </> )}
                                     <div> <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">¿Dolor específico en alguna zona?</h4> <div className="flex gap-4"> <button type="button" className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.dolorEspecifico === true ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'}`} onClick={() => handleBooleanChange('dolorEspecifico', true)}>Sí</button> <button type="button" className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.dolorEspecifico === false ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'}`} onClick={() => handleBooleanChange('dolorEspecifico', false)}>No</button> </div> </div>
                                     {formData.dolorEspecifico === true && ( <div className="relative pl-4 border-l-2 border-emerald-200 dark:border-emerald-700"> <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Motivo/Zona del dolor:</label> <Textarea value={formData.motivoDolor || ''} onChange={e => handleTextChange('motivoDolor', e.target.value)} placeholder="Describa la zona o motivo (ej. preauricular, muscular)" className="min-h-[60px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-emerald-500 focus:border-emerald-500" /> </div> )}
                                     {renderOptionButtons( "Ruido articular", ruidoArticularOptions, formData.ruidoArticular, 'ruidoArticular' )}
                                     {renderOptionButtons( "Patrón de abertura mandibular", patronAberturaOptions, formData.patronAbertura, 'patronAbertura' )}
                                     {formData.patronAbertura === 'otro' && ( <div className="relative pl-4 border-l-2 border-blue-200 dark:border-blue-700"> <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Especifique otro patrón:</label> <Textarea value={formData.otroPatronAbertura || ''} onChange={e => handleTextChange('otroPatronAbertura', e.target.value)} placeholder="Especifique el patrón observado" className="min-h-[60px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500" /> </div> )}
                                     <div className="relative"> <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Otras observaciones (ATM):</label> <Textarea value={formData.otrasObservaciones || ''} onChange={e => handleTextChange('otrasObservaciones', e.target.value)} placeholder="Anote aquí cualquier otra observación relevante sobre la ATM" className="min-h-[80px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500" /> </div>

                                    {/* --- Sección Labios (Formulario) --- */}
                                    <div className="mt-8 border-t pt-6 border-gray-200 dark:border-gray-700">
                                        <div className="flex justify-between items-center mb-4">
                                             <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Labios</h3>
                                             {lipsViewMode === 'form' ? (
                                                 <Button variant="outline" size="sm" onClick={generateLipsNarrative} disabled={isGeneratingLipsNarrative} /* ... */ >
                                                     {/* Icono y Texto Botón */}
                                                     {isGeneratingLipsNarrative ? <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> : <FileText className="w-4 h-4 mr-2" />}
                                                     Generar Redacción Labios
                                                 </Button>
                                             ) : (
                                                 <Button variant="outline" size="sm" onClick={() => setLipsViewMode('form')} /* ... */ >
                                                     <Edit className="w-4 h-4 mr-2" /> Editar Labios
                                                 </Button>
                                             )}
                                        </div>

                                        {lipsViewMode === 'form' ? (
                                            <div className="space-y-4">
                                                {/* Render options para labios (sin cambios) */}
                                                {renderOptionButtons("Simetría", simetriaOptions, labiosData?.simetria, 'labios.simetria')}
                                                {renderOptionButtons("Tamaño/Volumen", volumenOptions, labiosData?.volumen, 'labios.volumen')}
                                                {renderOptionButtons("Coloración", coloracionOptions, labiosData?.coloracion, 'labios.coloracion')}
                                                {renderOptionButtons("Hidratación/Superficie", hidratacionOptions, labiosData?.hidratacion, 'labios.hidratacion')}
                                                {renderOptionButtons("Integridad", integridadOptions, labiosData?.integridad, 'labios.integridad')}
                                                {renderOptionButtons("Comisuras labiales", comisurasOptions, labiosData?.comisuras, 'labios.comisuras')}
                                                {renderOptionButtons("Movimiento y función", movimientoOptions, labiosData?.movimiento, 'labios.movimiento')}
                                                <div className="relative"> <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Otras observaciones (Labios):</label> <Textarea value={labiosData?.otrasObservaciones || ''} onChange={e => handleTextChange('labios.otrasObservaciones', e.target.value)} placeholder="Observaciones adicionales sobre los labios" className="min-h-[80px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500" /> </div>
                                            </div>
                                        ) : (
                                            // **Mostrar texto ANIMADO para labios**
                                            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700 min-h-[100px]">
                                                <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                                                    {displayedLipsNarrative}
                                                    {/* Cursor intermitente al final (opcional) */}
                                                    {isGeneratingLipsNarrative && displayedLipsNarrative.length < targetLipsNarrative.length && <span className="animate-pulse">▋</span>}
                                                </p>
                                            </div>
                                        )}
                                    </div> {/* Fin Sección Labios */}
                                </div> {/* Fin space-y-6 */}
                            </div> /* Fin p-6 formulario */
                        ) : ( /* Inicio Pestaña Redacción IA General */
                            <div className="p-6">
                                <div className="flex justify-center mb-4">
                                    <Button onClick={generateRedaccion} disabled={isGeneratingRedaccion} /* Estilos botón ... */>
                                         {isGeneratingRedaccion ? <>{/* spinner */} Generando...</> : '✨ Generar Redacción General (ATM y Labios)'}
                                    </Button>
                                </div>
                                {/* **Mostrar texto ANIMADO general** */}
                                <Textarea
                                    readOnly
                                    value={displayedRedaccion} // Usa el estado animado
                                    placeholder="La redacción generada aparecerá aquí..."
                                    className="min-h-[250px] w-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-md p-4 border border-gray-200 dark:border-gray-700 whitespace-pre-wrap font-mono" // Font mono opcional para typewriter
                                />
                                 {/* Cursor intermitente (opcional) */}
                                 {isGeneratingRedaccion && displayedRedaccion.length < targetRedaccion.length && <span className="text-gray-400 dark:text-gray-600 animate-pulse">▋</span>}

                                <div className="mt-4 flex justify-end">
                                    <button type="button" onClick={resetForm} className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors font-medium">
                                        Limpiar Todo
                                    </button>
                                </div>
                            </div> /* Fin p-6 redacción general */
                        )}
                    </>
                )}
            </Card>
        </div>
    );
};

export default ArticulacionCraneomandibular;