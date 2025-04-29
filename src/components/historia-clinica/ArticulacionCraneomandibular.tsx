import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from "@/components/ui/card"; // Asume que estos imports funcionan
import { Minus, Maximize2, X, Edit, FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// 1. Interface para el estado interno del componente
interface ArticulacionCraneomandibularState {
  dolorMasticarHablar?: boolean | null;
  tipoDolor?: string;
  duracionDolor?: string;
  dolorEspecifico?: boolean | null;
  motivoDolor?: string;
  ruidoArticular?: string | null;
  patronAbertura?: string | null;
  otroPatronAbertura?: string;
  otrasObservaciones?: string; // Observaciones ATM
  labios: { // Objeto labios siempre presente
      simetria?: string | null;
      volumen?: string | null;
      coloracion?: string | null;
      hidratacion?: string | null;
      integridad?: string | null;
      comisuras?: string | null;
      movimiento?: string | null;
      otrasObservaciones?: string; // Observaciones Labios
  };
}

// 2. Estado inicial bien definido
const initialState: ArticulacionCraneomandibularState = {
  dolorMasticarHablar: null,
  tipoDolor: '',
  duracionDolor: '',
  dolorEspecifico: null,
  motivoDolor: '',
  ruidoArticular: null,
  patronAbertura: null,
  otroPatronAbertura: '',
  otrasObservaciones: '',
  labios: { // Inicializar labios y sus propiedades
      simetria: null,
      volumen: null,
      coloracion: null,
      hidratacion: null,
      integridad: null,
      comisuras: null,
      movimiento: null,
      otrasObservaciones: ''
  }
};

// 3. Opciones con etiquetas CORREGIDAS y gramaticalmente adecuadas
type Option = { label: string; value: string };

// Opciones Labios Corregidas
const simetriaOptions: Option[] = [
  { label: "Simétricos", value: "simetricos" },
  { label: "Desviación Derecha", value: "asimetricosDerecha" },
  { label: "Desviación Izquierda", value: "asimetricosIzquierda" },
];
const volumenOptions: Option[] = [
  { label: "Delgados", value: "delgados" },
  { label: "Medianos", value: "medianos" },
  { label: "Gruesos", value: "gruesos" },
];
const coloracionOptions: Option[] = [
  { label: "Rosada normal", value: "normal" },
  { label: "Pálida", value: "palidos" },
  { label: "Cianótica", value: "cianoticos" },
  { label: "Eritematosa", value: "eritematosos" },
];
const hidratacionOptions: Option[] = [
  { label: "Hidratada", value: "hidratados" },
  { label: "Seca", value: "secos" },
  { label: "Agrietada", value: "agrietados" },
  { label: "Con costras", value: "costras" },
];
const integridadOptions: Option[] = [
  { label: "Íntegra", value: "intactos" },
  { label: "Con heridas", value: "heridas" },
  { label: "Con ulceraciones", value: "ulceraciones" },
  { label: "Con fisuras", value: "fisuras" },
];
const comisurasOptions: Option[] = [
  { label: "Normales", value: "normales" },
  { label: "Erosionadas", value: "erosionadas" },
  { label: "Con queilitis angular", value: "queilitis" },
];
const movimientoOptions: Option[] = [
  { label: "Movimientos conservados", value: "normales" },
  { label: "Restricción de movimiento", value: "restriccion" },
  { label: "Incompetencia labial", value: "incompetencia" },
];

// Opciones ATM (Revisadas, sin cambios mayores necesarios)
const patronAberturaOptions: Option[] = [
    { label: "Recto", value: "recto" },
    { label: "Desviación Derecha", value: "desviacionDerecha" },
    { label: "Desviación Izquierda", value: "desviacionIzquierda" },
    { label: "Forma de 'S'", value: "formaS" },
    { label: "Otro", value: "otro" }
];
const ruidoArticularOptions: Option[] = [
    { label: "A la apertura", value: "abertura" }, // Más claro
    { label: "Al cierre", value: "cierre" }, // Más claro
    { label: "No presenta", value: "ninguno" }, // Más claro
];


// --- Componente Principal ---
const ArticulacionCraneomandibular: React.FC = () => {
    const [formData, setFormData] = useState<ArticulacionCraneomandibularState>(initialState);

    // Estados UI
    const [isMinimized, setIsMinimized] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [activeTab, setActiveTab] = useState('formulario');
    const [lipsViewMode, setLipsViewMode] = useState<'form' | 'narrative'>('form');

    // Estados y Refs para Typewriter y Carga
    const [isGeneratingLipsNarrative, setIsGeneratingLipsNarrative] = useState(false);
    const [isGeneratingRedaccion, setIsGeneratingRedaccion] = useState(false);
    const [targetLipsNarrative, setTargetLipsNarrative] = useState('');
    const [displayedLipsNarrative, setDisplayedLipsNarrative] = useState('');
    const [targetRedaccion, setTargetRedaccion] = useState('');
    const [displayedRedaccion, setDisplayedRedaccion] = useState('');
    const lipsIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const redaccionIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const typewriterSpeed = 35; // Velocidad de escritura (ms por caracter)

    // --- Funciones de Limpieza de Intervalos ---
    const clearLipsInterval = useCallback(() => {
        if (lipsIntervalRef.current) {
            clearInterval(lipsIntervalRef.current);
            lipsIntervalRef.current = null;
        }
    }, []);
    const clearRedaccionInterval = useCallback(() => {
        if (redaccionIntervalRef.current) {
            clearInterval(redaccionIntervalRef.current);
            redaccionIntervalRef.current = null;
        }
    }, []);

    // --- Hooks useEffect para la animación Typewriter ---
    useEffect(() => {
        clearLipsInterval(); // Limpia anterior al cambiar target

        if (targetLipsNarrative) {
            let index = 0;
            setDisplayedLipsNarrative(''); // Asegura empezar limpio
            lipsIntervalRef.current = setInterval(() => {
                setDisplayedLipsNarrative((prev) => prev + targetLipsNarrative[index]);
                index++;
                if (index === targetLipsNarrative.length) {
                    clearLipsInterval();
                    setIsGeneratingLipsNarrative(false); // Carga termina al final
                }
            }, typewriterSpeed);
        } else {
             // Si no hay target, asegúrate que no esté cargando
             if(isGeneratingLipsNarrative) setIsGeneratingLipsNarrative(false);
             setDisplayedLipsNarrative(''); // Limpia si se borra el target
        }
        return () => clearLipsInterval(); // Limpieza al desmontar/cambiar target
    }, [targetLipsNarrative, clearLipsInterval, isGeneratingLipsNarrative]); // Añadir isGeneratingLipsNarrative como dependencia puede ayudar a estabilizar

    useEffect(() => {
        clearRedaccionInterval(); // Limpia anterior al cambiar target

        if (targetRedaccion) {
            let index = 0;
            setDisplayedRedaccion(''); // Asegura empezar limpio
            redaccionIntervalRef.current = setInterval(() => {
                setDisplayedRedaccion((prev) => prev + targetRedaccion[index]);
                index++;
                if (index === targetRedaccion.length) {
                    clearRedaccionInterval();
                    setIsGeneratingRedaccion(false); // Carga termina al final
                }
            }, typewriterSpeed);
        } else {
             if(isGeneratingRedaccion) setIsGeneratingRedaccion(false);
             setDisplayedRedaccion(''); // Limpia si se borra el target
        }
        return () => clearRedaccionInterval(); // Limpieza al desmontar/cambiar target
    }, [targetRedaccion, clearRedaccionInterval, isGeneratingRedaccion]); // Añadir isGeneratingRedaccion

    // --- Handlers UI (Minimizar, Maximizar) ---
    const handleMinimize = () => { setIsMinimized(!isMinimized); setIsMaximized(false); };
    const handleMaximize = () => { setIsMaximized(!isMaximized); setIsMinimized(false); };
    // const handleClose = () => { setIsMinimized(true); setIsMaximized(false); }; // Opcional

    // --- Handlers de Actualización de Estado ---
    const handleArticulacionCraneomandibularChange = useCallback((fieldPath: string, value: any) => {
        setFormData(prevData => {
            const parts = fieldPath.split('.');
            const newState = structuredClone(prevData);
            let currentLevel: any = newState;
            for (let i = 0; i < parts.length - 1; i++) {
                const part = parts[i];
                // Asegurar que el nivel exista si es un objeto anidado (como labios)
                if (currentLevel[part] === undefined || typeof currentLevel[part] !== 'object' || currentLevel[part] === null) {
                    currentLevel[part] = {};
                }
                currentLevel = currentLevel[part];
            }
            currentLevel[parts[parts.length - 1]] = value;
            return newState;
        });
    }, []); // Vacío porque no depende de props externas

    const handleOptionChange = useCallback((fieldPath: string, value: string) => {
        handleArticulacionCraneomandibularChange(fieldPath, value);
    }, [handleArticulacionCraneomandibularChange]);

    const handleTextChange = useCallback((fieldPath: string, value: string) => {
        handleArticulacionCraneomandibularChange(fieldPath, value);
    }, [handleArticulacionCraneomandibularChange]);

    const handleBooleanChange = useCallback((fieldPath: string, value: boolean) => {
        handleArticulacionCraneomandibularChange(fieldPath, value);
    }, [handleArticulacionCraneomandibularChange]);


    // --- **Generación de Redacción CORREGIDA Y REFINADA** ---

    const generateLipsNarrative = useCallback(() => {
        setIsGeneratingLipsNarrative(true); // Activar carga
        clearLipsInterval();
        setTargetLipsNarrative(''); // Resetear estados de animación
        setDisplayedLipsNarrative('');

        const data = formData.labios || {};
        let findings: string[] = [];

        // 1. Simetría y Volumen
        const simetriaLabel = simetriaOptions.find(o => o.value === data.simetria)?.label;
        const volumenLabel = volumenOptions.find(o => o.value === data.volumen)?.label?.toLowerCase();
        if (simetriaLabel) {
            let clause = data.simetria === 'simetricos' ? "labios simétricos" : `se observa asimetría labial (${simetriaLabel.toLowerCase()})`;
            if (volumenLabel) clause += `, de volumen ${volumenLabel}`;
            findings.push(clause);
        } else if (volumenLabel) {
            findings.push(`labios de volumen ${volumenLabel}`);
        }

        // 2. Color y Superficie (Hidratación)
        const colorLabel = coloracionOptions.find(o => o.value === data.coloracion)?.label?.toLowerCase();
        const hidratacionLabel = hidratacionOptions.find(o => o.value === data.hidratacion)?.label?.toLowerCase();
        if (colorLabel) {
            let clause = `presentan coloración ${colorLabel}`;
            if (hidratacionLabel) clause += ` y superficie ${hidratacionLabel}`;
            findings.push(clause);
        } else if (hidratacionLabel) {
            findings.push(`la superficie labial se encuentra ${hidratacionLabel}`);
        }

        // 3. Integridad (Mucosa)
        const integridadLabel = integridadOptions.find(o => o.value === data.integridad)?.label;
        if (integridadLabel && data.integridad !== 'intactos') {
            findings.push(`${integridadLabel.toLowerCase()} en la mucosa`); // ej: "con heridas en la mucosa"
        } else if (integridadLabel === 'Íntegra' && findings.length === 0) { // Solo si no hay otros hallazgos mayores
             findings.push("mucosa labial íntegra");
        }

        // 4. Comisuras
        const comisurasLabel = comisurasOptions.find(o => o.value === data.comisuras)?.label;
        if (comisurasLabel && data.comisuras !== 'normales') {
            findings.push(`las comisuras se encuentran ${comisurasLabel.toLowerCase()}`);
        } else if (comisurasLabel === 'Normales' && findings.length > 0 && !findings.some(f => f.includes("comisura"))) {
             // Añadir si hay otros hallazgos, pero nada específico de comisuras aún
             findings.push("comisuras normales");
        }

        // 5. Función (Movimiento)
        const movimientoLabel = movimientoOptions.find(o => o.value === data.movimiento)?.label;
        if (movimientoLabel) {
            findings.push(`funcionalmente, ${movimientoLabel.toLowerCase()}`); // ej: "funcionalmente, movimientos conservados"
        }

        // 6. Observaciones Adicionales
        if (data.otrasObservaciones) {
            findings.push(`observaciones adicionales: "${data.otrasObservaciones}"`);
        }

        // Construcción Final
        let fullText = "";
        const filteredFindings = findings.map(f => f.trim()).filter(Boolean);

        if (filteredFindings.length > 0) {
            fullText = "Al examen clínico, " + filteredFindings
                .map((f, index) => (index === 0 ? f.charAt(0).toUpperCase() + f.slice(1) : f)) // Capitaliza solo el primero
                .join('. ') + '.';
        } else {
            fullText = "No se registraron hallazgos específicos en el examen de labios.";
        }
        fullText = fullText.replace(/\.\./g, '.').replace(/ \./g, '.').replace(/,\./g, '.').replace(/\s+/g, ' ').trim();

        setTargetLipsNarrative(fullText); // Inicia animación
        setLipsViewMode('narrative');
        // El estado de carga se desactiva en el useEffect
    }, [formData.labios, clearLipsInterval]); // Depende de los datos y la función de limpieza


     const generateRedaccion = useCallback(() => {
        setIsGeneratingRedaccion(true);
        clearRedaccionInterval();
        setTargetRedaccion('');
        setDisplayedRedaccion('');

        const atm = formData;
        const labios = formData.labios || {};
        let atmFindings: string[] = [];
        let lipsFindings: string[] = [];

        // --- ATM ---
        let dolorClause = "";
        if (atm.dolorMasticarHablar === true) { dolorClause = `refiere dolor al masticar/hablar`; if(atm.tipoDolor) dolorClause += ` (tipo ${atm.tipoDolor.toLowerCase()})`; if(atm.duracionDolor) dolorClause += `, duración ${atm.duracionDolor.toLowerCase()}`; } else if (atm.dolorMasticarHablar === false) { dolorClause = `no refiere dolor al masticar/hablar`; }
        if (atm.dolorEspecifico === true && atm.motivoDolor) { if (dolorClause) dolorClause += "; además "; else dolorClause = ""; dolorClause += `presenta dolor específico en ${atm.motivoDolor.toLowerCase()}`; }
        if(dolorClause) atmFindings.push(dolorClause);

        let ruidoPatronClause = "";
        const ruidoLabel = ruidoArticularOptions.find(o => o.value === atm.ruidoArticular)?.label?.toLowerCase(); // Usa label corregido
        const patronLabel = patronAberturaOptions.find(o => o.value === atm.patronAbertura)?.label?.toLowerCase();
        if (ruidoLabel && atm.ruidoArticular !== 'ninguno') { ruidoPatronClause = `se ausculta ruido articular ${ruidoLabel}`; } else if (atm.ruidoArticular === 'ninguno') { ruidoPatronClause = `sin ruidos articulares audibles`; }
        if (patronLabel) { let patronText = `patrón de abertura ${patronLabel}`; if(atm.patronAbertura === 'otro' && atm.otroPatronAbertura) patronText += `: "${atm.otroPatronAbertura}"`; if(ruidoPatronClause) ruidoPatronClause += `, con ${patronText}`; else {ruidoPatronClause = patronText.charAt(0).toUpperCase() + patronText.slice(1); } } // Capitaliza si es el primer hallazgo de esta cláusula
        if(ruidoPatronClause) atmFindings.push(ruidoPatronClause);

        if(atm.otrasObservaciones) atmFindings.push(`observaciones ATM: "${atm.otrasObservaciones}"`);

        // --- Labios ---
        // (Reutiliza la lógica refinada de generateLipsNarrative)
        const simetriaLabel = simetriaOptions.find(o => o.value === labios.simetria)?.label; const volumenLabel = volumenOptions.find(o => o.value === labios.volumen)?.label?.toLowerCase(); if (simetriaLabel) { let clause = ""; if (labios.simetria === 'simetricos') { clause = volumenLabel ? `labios simétricos de volumen ${volumenLabel}` : "labios simétricos"; } else { clause = `se observa asimetría labial (${simetriaLabel.toLowerCase()})`; if (volumenLabel) clause += `, siendo de volumen ${volumenLabel}`; } lipsFindings.push(clause); } else if (volumenLabel) { lipsFindings.push(`labios de volumen ${volumenLabel}`); }
        const colorLabel = coloracionOptions.find(o => o.value === labios.coloracion)?.label?.toLowerCase(); const hidratacionLabel = hidratacionOptions.find(o => o.value === labios.hidratacion)?.label?.toLowerCase(); if (colorLabel) { let clause = `presentan coloración ${colorLabel}`; if (hidratacionLabel) clause += ` y superficie ${hidratacionLabel}`; lipsFindings.push(clause); } else if (hidratacionLabel) { lipsFindings.push(`la superficie labial se encuentra ${hidratacionLabel}`); }
        const integridadLabel = integridadOptions.find(o => o.value === labios.integridad)?.label; if (integridadLabel && labios.integridad !== 'intactos') { lipsFindings.push(`${integridadLabel.toLowerCase()} en la mucosa`); } else if (integridadLabel === 'Íntegra' && lipsFindings.length === 0) { lipsFindings.push("mucosa labial íntegra"); }
        const comisurasLabel = comisurasOptions.find(o => o.value === labios.comisuras)?.label; if (comisurasLabel && labios.comisuras !== 'normales') { lipsFindings.push(`las comisuras se encuentran ${comisurasLabel.toLowerCase()}`); } else if (comisurasLabel === 'Normales' && lipsFindings.length > 0 && !lipsFindings.some(f => f.includes("comisura"))) { lipsFindings.push("comisuras normales"); }
        const movimientoLabel = movimientoOptions.find(o => o.value === labios.movimiento)?.label; if (movimientoLabel) { lipsFindings.push(`funcionalmente, ${movimientoLabel.toLowerCase()}`); }
        if (labios.otrasObservaciones) { lipsFindings.push(`observaciones labios: "${labios.otrasObservaciones}"`); }


        // --- Construcción Final General ---
        let fullText = "";
        const filteredAtmFindings = atmFindings.map(f => f.trim()).filter(Boolean);
        const filteredLipsFindings = lipsFindings.map(f => f.trim()).filter(Boolean);

        if (filteredAtmFindings.length > 0) {
             fullText += "Evaluación Craneomandibular:\n" + filteredAtmFindings
                .map((f, index) => (index === 0 ? f.charAt(0).toUpperCase() + f.slice(1) : f))
                .join('. ') + '.\n\n';
        } else {
             fullText += "Evaluación Craneomandibular: Sin hallazgos relevantes registrados.\n\n";
        }
        if (filteredLipsFindings.length > 0) {
             fullText += "Examen de Labios:\n" + filteredLipsFindings
                .map((f, index) => (index === 0 ? f.charAt(0).toUpperCase() + f.slice(1) : f))
                .join('. ') + '.';
        } else {
             fullText += "Examen de Labios: Sin hallazgos relevantes registrados.";
        }
        fullText = fullText.replace(/\.\./g, '.').replace(/ \./g, '.').replace(/,\./g, '.').replace(/; \./g, ';').replace(/\s+/g, ' ').trim();

        setTargetRedaccion(fullText); // Inicia animación
        setActiveTab('redaccion');
        // El estado de carga se desactiva en el useEffect
    }, [formData, clearRedaccionInterval]); // Depende de TODOS los datos y la limpieza

    // --- Reset Form ---
    const resetForm = useCallback(() => {
        setFormData(initialState);
        setLipsViewMode('form');
        // Detener y limpiar animaciones/targets
        clearLipsInterval();
        clearRedaccionInterval();
        setTargetLipsNarrative('');
        setDisplayedLipsNarrative('');
        setTargetRedaccion('');
        setDisplayedRedaccion('');
        // Resetear estados de carga
        setIsGeneratingLipsNarrative(false);
        setIsGeneratingRedaccion(false);
        setActiveTab('formulario');
    }, [clearLipsInterval, clearRedaccionInterval]); // Depende de las funciones de limpieza


    // --- Render Helper para Botones ---
    const renderOptionButtons = useCallback(( title: string, options: Option[], currentValue: string | undefined | null, fieldPath: string ) => (
         <div>
             <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">{title}:</h4>
             <div className="flex flex-wrap gap-2 mb-4">
                 {options.map(item => (
                     <button
                         key={`${fieldPath}-${item.value}`} // Clave más específica
                         type="button"
                         className={`px-3 py-1 text-sm rounded-full transition-colors ${
                             currentValue === item.value
                                 ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md' // Sombra al seleccionado
                                 : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                         }`}
                         onClick={() => handleOptionChange(fieldPath, item.value)}
                     >
                         {item.label}
                     </button>
                 ))}
             </div>
         </div>
     ), [handleOptionChange]); // Depende del handler

    // --- JSX del Componente ---
    return (
        <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : "my-4"}`} data-section-name="articulacionCraneomandibular">
            <Card className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""} ${isMinimized ? "h-16 overflow-hidden" : "min-h-[400px]"}`}> {/* Añadido min-height */}
                {/* Header con Tabs y Controles */}
                 <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-10"> {/* Sticky Header */}
                    <div className="flex-1 flex justify-center"> {/* Centrar Tabs */}
                        <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
                            <button
                                className={`px-4 py-1.5 rounded-full transition-all duration-300 text-sm font-medium ${activeTab === 'formulario' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300/50 dark:hover:bg-gray-600/50'}`}
                                onClick={() => setActiveTab('formulario')}
                            >
                                Formulario
                            </button>
                            <button
                                className={`px-4 py-1.5 rounded-full transition-all duration-300 text-sm font-medium ${activeTab === 'redaccion' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300/50 dark:hover:bg-gray-600/50'}`}
                                onClick={() => setActiveTab('redaccion')}
                            >
                                Redacción IA
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 pl-2"> {/* Controles a la derecha */}
                        <button onClick={handleMinimize} title={isMinimized ? "Restaurar" : "Minimizar"} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            <Minus className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                        </button>
                        <button onClick={handleMaximize} title={isMaximized ? "Restaurar" : "Maximizar"} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            <Maximize2 className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                        </button>
                        {/* <button onClick={handleClose} title="Cerrar" className="p-1 rounded-full hover:bg-red-200 dark:hover:bg-red-700 transition-colors"> <X className="w-4 h-4 text-red-600 dark:text-red-400" /> </button> */}
                    </div>
                </div>

                 {/* Título Principal */}
                 <div className={`flex justify-start px-6 py-3 ${isMinimized ? 'hidden' : ''}`}>
                     <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white tracking-tight"> {/* Ajuste fuente */}
                         <span className="text-blue-500 dark:text-blue-400 font-semibold">XI.</span> ARTICULACIÓN CRANEOMANDIBULAR Y LABIOS
                     </h2>
                 </div>

                {/* Contenido Principal */}
                {!isMinimized && (
                    <div className="px-6 pb-6"> {/* Padding general para contenido */}
                        {activeTab === 'formulario' ? (
                            <div className="space-y-8"> {/* Aumentar espacio entre secciones */}
                                {/* --- ATM Formulario --- */ }
                                <section> {/* Usar section para agrupar */}
                                    <h3 className="text-lg font-semibold mb-4 border-b border-gray-300 dark:border-gray-600 pb-2 text-gray-700 dark:text-gray-300">Articulación Craneomandibular</h3>
                                    <div className="space-y-5"> {/* Espacio dentro de la sección */}
                                        {/* Dolor Masticar/Hablar */}
                                        <div> <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">Dolor al masticar o hablar</h4> <div className="flex gap-3"> <button type="button" className={`px-4 py-1.5 rounded-md text-sm transition-colors shadow-sm ${formData.dolorMasticarHablar === true ? 'bg-emerald-500 text-white hover:bg-emerald-600 ring-2 ring-emerald-300' : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'}`} onClick={() => handleBooleanChange('dolorMasticarHablar', true)}>Sí</button> <button type="button" className={`px-4 py-1.5 rounded-md text-sm transition-colors shadow-sm ${formData.dolorMasticarHablar === false ? 'bg-emerald-500 text-white hover:bg-emerald-600 ring-2 ring-emerald-300' : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'}`} onClick={() => handleBooleanChange('dolorMasticarHablar', false)}>No</button> </div> </div>
                                        {/* Campos Condicionales Dolor */}
                                        {formData.dolorMasticarHablar === true && ( <div className="pl-4 border-l-2 border-emerald-300 dark:border-emerald-600 space-y-3 ml-1"> <div> <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Tipo de dolor:</label> <Textarea value={formData.tipoDolor || ''} onChange={e => handleTextChange('tipoDolor', e.target.value)} placeholder="Ej. punzante, sordo, opresivo..." className="min-h-[50px] bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-emerald-500 focus:border-emerald-500 rounded-md shadow-sm" /> </div> <div> <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Duración:</label> <Textarea value={formData.duracionDolor || ''} onChange={e => handleTextChange('duracionDolor', e.target.value)} placeholder="Ej. constante, intermitente, al masticar..." className="min-h-[50px] bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-emerald-500 focus:border-emerald-500 rounded-md shadow-sm" /> </div> </div> )}
                                        {/* Dolor Específico */}
                                        <div> <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">Dolor específico localizado</h4> <div className="flex gap-3"> <button type="button" className={`px-4 py-1.5 rounded-md text-sm transition-colors shadow-sm ${formData.dolorEspecifico === true ? 'bg-emerald-500 text-white hover:bg-emerald-600 ring-2 ring-emerald-300' : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'}`} onClick={() => handleBooleanChange('dolorEspecifico', true)}>Sí</button> <button type="button" className={`px-4 py-1.5 rounded-md text-sm transition-colors shadow-sm ${formData.dolorEspecifico === false ? 'bg-emerald-500 text-white hover:bg-emerald-600 ring-2 ring-emerald-300' : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'}`} onClick={() => handleBooleanChange('dolorEspecifico', false)}>No</button> </div> </div>
                                        {/* Motivo Dolor */}
                                        {formData.dolorEspecifico === true && ( <div className="pl-4 border-l-2 border-emerald-300 dark:border-emerald-600 ml-1"> <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Zona o motivo del dolor:</label> <Textarea value={formData.motivoDolor || ''} onChange={e => handleTextChange('motivoDolor', e.target.value)} placeholder="Ej. preauricular, masetero, temporal..." className="min-h-[50px] bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-emerald-500 focus:border-emerald-500 rounded-md shadow-sm" /> </div> )}
                                        {/* Ruido Articular */}
                                        {renderOptionButtons( "Ruido articular", ruidoArticularOptions, formData.ruidoArticular, 'ruidoArticular' )}
                                        {/* Patrón Abertura */}
                                        {renderOptionButtons( "Patrón de abertura mandibular", patronAberturaOptions, formData.patronAbertura, 'patronAbertura' )}
                                        {/* Otro Patrón */}
                                        {formData.patronAbertura === 'otro' && ( <div className="pl-4 border-l-2 border-blue-300 dark:border-blue-600 ml-1"> <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Especifique otro patrón:</label> <Textarea value={formData.otroPatronAbertura || ''} onChange={e => handleTextChange('otroPatronAbertura', e.target.value)} placeholder="Describa el patrón observado" className="min-h-[50px] bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm" /> </div> )}
                                        {/* Observaciones ATM */}
                                        <div> <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Otras observaciones (ATM):</label> <Textarea value={formData.otrasObservaciones || ''} onChange={e => handleTextChange('otrasObservaciones', e.target.value)} placeholder="Cualquier otro hallazgo relevante sobre la ATM..." className="min-h-[70px] bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm" /> </div>
                                    </div>
                                </section>

                                {/* --- Labios Formulario / Narrativa --- */ }
                                <section>
                                    <div className="flex justify-between items-center mb-4 border-t border-gray-300 dark:border-gray-600 pt-6"> {/* Separador */}
                                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Labios</h3>
                                         {lipsViewMode === 'form' ? (
                                             <Button variant="outline" size="sm" onClick={generateLipsNarrative} disabled={isGeneratingLipsNarrative} className={`flex items-center gap-1.5 ${isGeneratingLipsNarrative ? 'text-gray-500 cursor-not-allowed' : 'text-blue-600 dark:text-blue-400 border-blue-500/50 dark:border-blue-400/50 hover:bg-blue-50 dark:hover:bg-blue-900/30'}`}>
                                                 {isGeneratingLipsNarrative ? <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> : <FileText className="w-4 h-4" />}
                                                 {isGeneratingLipsNarrative ? 'Generando...' : 'Redacción Labios'}
                                             </Button>
                                         ) : (
                                             <Button variant="outline" size="sm" onClick={() => setLipsViewMode('form')} disabled={isGeneratingLipsNarrative} className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 border-gray-400/50 dark:border-gray-500/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 disabled:opacity-50">
                                                 <Edit className="w-4 h-4" /> Editar
                                             </Button>
                                         )}
                                    </div>

                                    {lipsViewMode === 'form' ? (
                                        <div className="space-y-5"> {/* Espacio entre opciones de labios */}
                                            {renderOptionButtons("Simetría", simetriaOptions, formData.labios?.simetria, 'labios.simetria')}
                                            {renderOptionButtons("Volumen", volumenOptions, formData.labios?.volumen, 'labios.volumen')}
                                            {renderOptionButtons("Coloración", coloracionOptions, formData.labios?.coloracion, 'labios.coloracion')}
                                            {renderOptionButtons("Superficie (Hidratación)", hidratacionOptions, formData.labios?.hidratacion, 'labios.hidratacion')}
                                            {renderOptionButtons("Integridad Mucosa", integridadOptions, formData.labios?.integridad, 'labios.integridad')}
                                            {renderOptionButtons("Comisuras", comisurasOptions, formData.labios?.comisuras, 'labios.comisuras')}
                                            {renderOptionButtons("Función (Movimiento)", movimientoOptions, formData.labios?.movimiento, 'labios.movimiento')}
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Otras observaciones (Labios):</label>
                                                <Textarea value={formData.labios?.otrasObservaciones || ''} onChange={e => handleTextChange('labios.otrasObservaciones', e.target.value)} placeholder="Cualquier otro hallazgo relevante sobre los labios..." className="min-h-[70px] bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 min-h-[120px] shadow-inner"> {/* Estilo área narrativa */}
                                            <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed"> {/* Mejor interlineado */}
                                                {displayedLipsNarrative}
                                                {/* Cursor solo si está generando Y no ha terminado */}
                                                {(isGeneratingLipsNarrative && lipsIntervalRef.current) && <span className="animate-pulse">▋</span>}
                                            </p>
                                        </div>
                                    )}
                                </section>
                            </div>
                        ) : ( // Pestaña Redacción General
                            <div className="space-y-4">
                                <div className="flex justify-center">
                                     <Button onClick={generateRedaccion} disabled={isGeneratingRedaccion} className={`bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-2.5 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out flex items-center justify-center gap-2 ${isGeneratingRedaccion ? 'opacity-70 cursor-not-allowed' : ''}`}>
                                         {isGeneratingRedaccion ? <svg className="animate-spin h-5 w-5" /* ... */></svg> : '✨'}
                                         {isGeneratingRedaccion ? 'Generando Redacción...' : 'Generar Redacción General'}
                                     </Button>
                                </div>
                                <Textarea
                                    readOnly
                                    value={displayedRedaccion}
                                    placeholder="La redacción generada para ATM y Labios aparecerá aquí..."
                                    className="min-h-[300px] w-full bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 rounded-lg p-4 border border-gray-200 dark:border-gray-700 whitespace-pre-wrap font-mono text-sm leading-relaxed shadow-inner" // Estilos Textarea General
                                />
                                 {/* Cursor opcional */}
                                {(isGeneratingRedaccion && redaccionIntervalRef.current) && <span className="text-gray-500 dark:text-gray-600 animate-pulse float-right mr-2">▋</span>}

                                <div className="flex justify-end pt-2">
                                     <button type="button" onClick={resetForm} className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors font-medium hover:underline">
                                         Limpiar Formulario
                                     </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ArticulacionCraneomandibular;