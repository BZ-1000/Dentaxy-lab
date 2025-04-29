import React, { useState, useEffect, useCallback, useRef } from 'react'; // Añadir useRef
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X, Edit, FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// Interfaz, Estado Inicial y Opciones (sin cambios respecto a la versión anterior)
interface ArticulacionCraneomandibularState { /* ... */ dolorMasticarHablar?: boolean | null; tipoDolor?: string; duracionDolor?: string; dolorEspecifico?: boolean | null; motivoDolor?: string; ruidoArticular?: string | null; patronAbertura?: string | null; otroPatronAbertura?: string; otrasObservaciones?: string; labios: { simetria?: string | null; volumen?: string | null; coloracion?: string | null; hidratacion?: string | null; integridad?: string | null; comisuras?: string | null; movimiento?: string | null; otrasObservaciones?: string; }; }
const initialState: ArticulacionCraneomandibularState = { /* ... */ dolorMasticarHablar: null, tipoDolor: '', duracionDolor: '', dolorEspecifico: null, motivoDolor: '', ruidoArticular: null, patronAbertura: null, otroPatronAbertura: '', otrasObservaciones: '', labios: { simetria: null, volumen: null, coloracion: null, hidratacion: null, integridad: null, comisuras: null, movimiento: null, otrasObservaciones: '' } };
type Option = { label: string; value: string };
const simetriaOptions: Option[] = [ { label: "Simétricos", value: "simetricos" },{ label: "Desviación Derecha", value: "asimetricosDerecha" },{ label: "Desviación Izquierda", value: "asimetricosIzquierda" },];
const volumenOptions: Option[] = [ { label: "Delgados", value: "delgados" },{ label: "Medianos", value: "medianos" },{ label: "Gruesos", value: "gruesos" },];
const coloracionOptions: Option[] = [ { label: "Rosados (Normal)", value: "normal" },{ label: "Pálidos", value: "palidos" },{ label: "Cianóticos", value: "cianoticos" },{ label: "Eritematosos", value: "eritematosos" },];
const hidratacionOptions: Option[] = [ { label: "Hidratados", value: "hidratados" },{ label: "Secos", value: "secos" },{ label: "Agrietados", value: "agrietados" },{ label: "Con Costras", value: "costras" },];
const integridadOptions: Option[] = [ { label: "Íntegros", value: "intactos" },{ label: "Heridas", value: "heridas" },{ label: "Ulceraciones", value: "ulceraciones" },{ label: "Fisuras Comisurales", value: "fisuras" },];
const comisurasOptions: Option[] = [ { label: "Normales", value: "normales" },{ label: "Erosionadas", value: "erosionadas" },{ label: "Queilitis Angular", value: "queilitis" },];
const movimientoOptions: Option[] = [ { label: "Movimientos Conservados", value: "normales" }, { label: "Restricción Movimiento", value: "restriccion" }, { label: "Incompetencia Labial", value: "incompetencia" },];
const patronAberturaOptions: Option[] = [ { label: "Recto", value: "recto" },{ label: "Desviación Derecha", value: "desviacionDerecha" },{ label: "Desviación Izquierda", value: "desviacionIzquierda" },{ label: "Forma de 'S'", value: "formaS" },{ label: "Otro", value: "otro" }];
const ruidoArticularOptions: Option[] = [ { label: "Abertura", value: "abertura" },{ label: "Cierre", value: "cierre" },{ label: "No", value: "ninguno" },];


const ArticulacionCraneomandibular: React.FC = () => {
    const [formData, setFormData] = useState<ArticulacionCraneomandibularState>(initialState);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [activeTab, setActiveTab] = useState('formulario');
    const [lipsViewMode, setLipsViewMode] = useState<'form' | 'narrative'>('form');

    // Estados y Refs para Typewriter
    const [isGeneratingLipsNarrative, setIsGeneratingLipsNarrative] = useState(false);
    const [isGeneratingRedaccion, setIsGeneratingRedaccion] = useState(false);
    const [targetLipsNarrative, setTargetLipsNarrative] = useState('');
    const [displayedLipsNarrative, setDisplayedLipsNarrative] = useState('');
    const [targetRedaccion, setTargetRedaccion] = useState('');
    const [displayedRedaccion, setDisplayedRedaccion] = useState('');
    const lipsIntervalRef = useRef<NodeJS.Timeout | null>(null); // Ref para el intervalo de labios
    const redaccionIntervalRef = useRef<NodeJS.Timeout | null>(null); // Ref para el intervalo general

    const typewriterSpeed = 35; // Ajusta la velocidad (ms)

    // --- Limpieza de Intervalos ---
    const clearLipsInterval = () => {
        if (lipsIntervalRef.current) {
            clearInterval(lipsIntervalRef.current);
            lipsIntervalRef.current = null;
        }
    };
    const clearRedaccionInterval = () => {
        if (redaccionIntervalRef.current) {
            clearInterval(redaccionIntervalRef.current);
            redaccionIntervalRef.current = null;
        }
    };

    // --- Hooks useEffect para la animación ---
    useEffect(() => {
        clearLipsInterval(); // Limpia intervalo anterior si target cambia

        if (targetLipsNarrative) {
            let index = 0;
            // Iniciar el nuevo intervalo
            lipsIntervalRef.current = setInterval(() => {
                setDisplayedLipsNarrative((prev) => prev + targetLipsNarrative[index]);
                index++;
                if (index === targetLipsNarrative.length) {
                    clearLipsInterval(); // Detener intervalo al terminar
                    setIsGeneratingLipsNarrative(false); // Desactivar carga al final
                }
            }, typewriterSpeed);
        } else {
            setDisplayedLipsNarrative(''); // Limpiar si no hay target
            setIsGeneratingLipsNarrative(false); // Asegurarse que la carga esté desactivada
        }

        // Función de limpieza del efecto
        return () => clearLipsInterval();
    }, [targetLipsNarrative]); // Ejecutar cuando el texto objetivo cambie

    useEffect(() => {
        clearRedaccionInterval(); // Limpia intervalo anterior si target cambia

        if (targetRedaccion) {
            let index = 0;
            // Iniciar el nuevo intervalo
            redaccionIntervalRef.current = setInterval(() => {
                setDisplayedRedaccion((prev) => prev + targetRedaccion[index]);
                index++;
                if (index === targetRedaccion.length) {
                    clearRedaccionInterval(); // Detener intervalo al terminar
                    setIsGeneratingRedaccion(false); // Desactivar carga al final
                }
            }, typewriterSpeed);
        } else {
            setDisplayedRedaccion(''); // Limpiar si no hay target
            setIsGeneratingRedaccion(false); // Asegurarse que la carga esté desactivada
        }

        // Función de limpieza del efecto
        return () => clearRedaccionInterval();
    }, [targetRedaccion]); // Ejecutar cuando el texto objetivo cambie


    // --- Handlers (Minimizar, Maximizar, Cerrar, Cambios de Formulario - sin cambios) ---
    const handleMinimize = () => { setIsMinimized(!isMinimized); setIsMaximized(false); };
    const handleMaximize = () => { setIsMaximized(!isMaximized); setIsMinimized(false); };
    const handleClose = () => { setIsMinimized(true); setIsMaximized(false); };
    const handleArticulacionCraneomandibularChange = useCallback((fieldPath: string, value: any) => { /* ... (igual) ... */ setFormData(prevData => { const parts = fieldPath.split('.'); const newState = structuredClone(prevData); let currentLevel: any = newState; for (let i = 0; i < parts.length - 1; i++) { const part = parts[i]; if (currentLevel[part] === undefined || currentLevel[part] === null) { currentLevel[part] = {}; } currentLevel = currentLevel[part]; } currentLevel[parts[parts.length - 1]] = value; return newState; }); }, []);
    const handleOptionChange = useCallback((fieldPath: string, value: string) => { handleArticulacionCraneomandibularChange(fieldPath, value); }, [handleArticulacionCraneomandibularChange]);
    const handleTextChange = useCallback((fieldPath: string, value: string) => { handleArticulacionCraneomandibularChange(fieldPath, value); }, [handleArticulacionCraneomandibularChange]);
    const handleBooleanChange = useCallback((fieldPath: string, value: boolean) => { handleArticulacionCraneomandibularChange(fieldPath, value); }, [handleArticulacionCraneomandibularChange]);


    // --- **Redacción MUY Mejorada: Labios** ---
    const generateLipsNarrative = () => {
        setIsGeneratingLipsNarrative(true); // Activar estado de carga
        clearLipsInterval(); // Detener animación anterior si existiera
        setTargetLipsNarrative(''); // Limpiar target previo
        setDisplayedLipsNarrative(''); // Limpiar display previo

        const data = formData.labios || {};
        let findings: string[] = []; // Almacenará las frases/cláusulas

        // 1. Apariencia General (Simetría y Volumen)
        const simetriaLabel = simetriaOptions.find(o => o.value === data.simetria)?.label;
        const volumenLabel = volumenOptions.find(o => o.value === data.volumen)?.label?.toLowerCase();
        if (simetriaLabel) {
            if (data.simetria === 'simetricos') {
                findings.push(volumenLabel ? `labios simétricos de volumen ${volumenLabel}` : "labios simétricos");
            } else {
                findings.push(volumenLabel ? `se observa asimetría labial (${simetriaLabel.toLowerCase()}), siendo de volumen ${volumenLabel}` : `se observa asimetría labial (${simetriaLabel.toLowerCase()})`);
            }
        } else if (volumenLabel) {
            findings.push(`labios de volumen ${volumenLabel}`); // Si solo hay volumen
        }

        // 2. Mucosa y Superficie (Color, Hidratación, Integridad)
        const colorLabel = coloracionOptions.find(o => o.value === data.coloracion)?.label?.toLowerCase();
        const hidratacionLabel = hidratacionOptions.find(o => o.value === data.hidratacion)?.label?.toLowerCase();
        const integridadLabel = integridadOptions.find(o => o.value === data.integridad)?.label?.toLowerCase();

        let mucosaSurfaceClause = "";
        if (colorLabel) {
            mucosaSurfaceClause += `presentan coloración ${colorLabel}`;
        }
        if (hidratacionLabel) {
            if (mucosaSurfaceClause) mucosaSurfaceClause += ", "; // Conectar si ya hay color
            else mucosaSurfaceClause = "La superficie labial "; // Empezar frase si no hay color

            if (data.hidratacion === 'hidratados') mucosaSurfaceClause += `mostrando adecuada hidratación`;
            else mucosaSurfaceClause += `se encuentra ${hidratacionLabel}`;
        }
        if (integridadLabel && data.integridad !== 'intactos') {
             if (mucosaSurfaceClause) mucosaSurfaceClause += ", ";
             else mucosaSurfaceClause = "Se observan "; // Empezar frase

             mucosaSurfaceClause += `${integridadLabel} en la mucosa`;
        } else if (integridadLabel === 'íntegros' && !mucosaSurfaceClause) {
             mucosaSurfaceClause = "La mucosa labial se encuentra íntegra"; // Solo si es lo único a reportar aquí
        }
        if(mucosaSurfaceClause) findings.push(mucosaSurfaceClause);


        // 3. Comisuras
        const comisurasLabel = comisurasOptions.find(o => o.value === data.comisuras)?.label?.toLowerCase();
         if (comisurasLabel && data.comisuras !== 'normales') {
             findings.push(`las comisuras labiales presentan ${comisurasLabel}`);
         } else if (comisurasLabel === 'normales'){
             // Opcional: añadir "Las comisuras son normales" si no hay otros hallazgos relevantes
             // Por ahora, lo omitimos si son normales para no ser redundante si todo lo demás está bien
         }

        // 4. Función (Movimiento)
        const movimientoLabel = movimientoOptions.find(o => o.value === data.movimiento)?.label;
        if (movimientoLabel) {
             findings.push(`en cuanto a la función, ${movimientoLabel.toLowerCase()}`);
        }

        // 5. Observaciones Adicionales
        if (data.otrasObservaciones) {
            findings.push(`como observación adicional se reporta: "${data.otrasObservaciones}"`);
        }

        // Construcción Final del Texto
        let fullText = "";
        if (findings.length > 0) {
            fullText = "Al examen clínico, " + findings.map(f => f.trim()) // Quitar espacios extra
                                                .filter(f => f) // Quitar strings vacíos
                                                .join('. ') + '.';
            fullText = fullText.replace(/\.\./g, '.').replace(/ \./g, '.'); // Limpiar puntuación
        } else {
            fullText = "No se registraron hallazgos específicos en el examen de labios.";
        }

        // Iniciar animación estableciendo el target
        setTargetLipsNarrative(fullText);
        setLipsViewMode('narrative');
        // NO desactivar isGenerating aquí, se hace en el useEffect al terminar
    };

    // --- **Redacción MUY Mejorada: General (ATM + Labios)** ---
    const generateRedaccion = () => {
        setIsGeneratingRedaccion(true); // Activar carga
        clearRedaccionInterval(); // Limpiar animación previa
        setTargetRedaccion(''); // Limpiar target
        setDisplayedRedaccion(''); // Limpiar display

        const atm = formData;
        const labios = formData.labios || {};
        let atmFindings: string[] = [];
        let lipsFindings: string[] = []; // Reutilizar lógica mejorada

        // --- ATM ---
        let dolorClause = "";
        if (atm.dolorMasticarHablar === true) {
            dolorClause = "el paciente refiere dolor al masticar y/o hablar";
            if(atm.tipoDolor) dolorClause += ` (tipo ${atm.tipoDolor.toLowerCase()})`;
            if(atm.duracionDolor) dolorClause += `, de duración ${atm.duracionDolor.toLowerCase()}`;
        } else if (atm.dolorMasticarHablar === false) {
            dolorClause = "el paciente no refiere dolor significativo al masticar o hablar";
        }
        if (atm.dolorEspecifico === true && atm.motivoDolor) {
             if (dolorClause) dolorClause += ", además de "; else dolorClause = "Presenta ";
             dolorClause += `dolor específico en la zona de ${atm.motivoDolor.toLowerCase()}`;
        }
        if(dolorClause) atmFindings.push(dolorClause);

        let ruidoPatronClause = "";
        const ruidoLabel = ruidoArticularOptions.find(o => o.value === atm.ruidoArticular)?.label?.toLowerCase();
        const patronLabel = patronAberturaOptions.find(o => o.value === atm.patronAbertura)?.label?.toLowerCase();
        if (ruidoLabel && atm.ruidoArticular !== 'ninguno') {
            ruidoPatronClause = `se ausculta ruido articular (${ruidoLabel})`;
        } else if (atm.ruidoArticular === 'ninguno') {
             ruidoPatronClause = "no se detectan ruidos articulares";
        }
        if (patronLabel) {
             let patronText = `el patrón de abertura mandibular es ${patronLabel}`;
             if(atm.patronAbertura === 'otro' && atm.otroPatronAbertura) patronText += `: "${atm.otroPatronAbertura}"`;

             if(ruidoPatronClause) ruidoPatronClause += `, y ${patronText}`;
             else ruidoPatronClause = patronText.charAt(0).toUpperCase() + patronText.slice(1); // Capitalizar
        }
        if(ruidoPatronClause) atmFindings.push(ruidoPatronClause);

        if(atm.otrasObservaciones) atmFindings.push(`observaciones adicionales en ATM: "${atm.otrasObservaciones}"`);

        // --- Labios (Aplicar lógica mejorada similar a generateLipsNarrative) ---
        const simetriaLabel = simetriaOptions.find(o => o.value === labios.simetria)?.label; const volumenLabel = volumenOptions.find(o => o.value === labios.volumen)?.label?.toLowerCase(); if (simetriaLabel) { if (labios.simetria === 'simetricos') { lipsFindings.push(volumenLabel ? `labios simétricos de volumen ${volumenLabel}` : "labios simétricos"); } else { lipsFindings.push(volumenLabel ? `se observa asimetría labial (${simetriaLabel.toLowerCase()}), siendo de volumen ${volumenLabel}` : `se observa asimetría labial (${simetriaLabel.toLowerCase()})`); } } else if (volumenLabel) { lipsFindings.push(`labios de volumen ${volumenLabel}`); }
        const colorLabel = coloracionOptions.find(o => o.value === labios.coloracion)?.label?.toLowerCase(); const hidratacionLabel = hidratacionOptions.find(o => o.value === labios.hidratacion)?.label?.toLowerCase(); const integridadLabel = integridadOptions.find(o => o.value === labios.integridad)?.label?.toLowerCase(); let mucosaSurfaceClause = ""; if (colorLabel) { mucosaSurfaceClause += `presentan coloración ${colorLabel}`; } if (hidratacionLabel) { if (mucosaSurfaceClause) mucosaSurfaceClause += ", "; else mucosaSurfaceClause = "La superficie labial "; if (labios.hidratacion === 'hidratados') mucosaSurfaceClause += `mostrando adecuada hidratación`; else mucosaSurfaceClause += `se encuentra ${hidratacionLabel}`; } if (integridadLabel && labios.integridad !== 'intactos') { if (mucosaSurfaceClause) mucosaSurfaceClause += ", "; else mucosaSurfaceClause = "Se observan "; mucosaSurfaceClause += `${integridadLabel} en la mucosa`; } else if (integridadLabel === 'íntegros' && !mucosaSurfaceClause) { mucosaSurfaceClause = "La mucosa labial se encuentra íntegra"; } if(mucosaSurfaceClause) lipsFindings.push(mucosaSurfaceClause);
        const comisurasLabel = comisurasOptions.find(o => o.value === labios.comisuras)?.label?.toLowerCase(); if (comisurasLabel && labios.comisuras !== 'normales') { lipsFindings.push(`las comisuras labiales presentan ${comisurasLabel}`); }
        const movimientoLabel = movimientoOptions.find(o => o.value === labios.movimiento)?.label; if (movimientoLabel) { lipsFindings.push(`en cuanto a la función, ${movimientoLabel.toLowerCase()}`); }
        if (labios.otrasObservaciones) { lipsFindings.push(`como observación adicional se reporta: "${labios.otrasObservaciones}"`); }


        // --- Construcción Final General ---
        let fullText = "";
        if (atmFindings.length > 0) {
             fullText += "Evaluación Craneomandibular:\n" + atmFindings.map(f => f.trim()).filter(f=>f).map(f => f.charAt(0).toUpperCase() + f.slice(1)).join('. ') + '.\n\n';
        } else {
             fullText += "Evaluación Craneomandibular: Sin hallazgos relevantes registrados.\n\n";
        }
        if (lipsFindings.length > 0) {
             fullText += "Examen de Labios:\n" + lipsFindings.map(f => f.trim()).filter(f=>f).map(f => f.charAt(0).toUpperCase() + f.slice(1)).join('. ') + '.';
        } else {
             fullText += "Examen de Labios: Sin hallazgos relevantes registrados.";
        }

        // Iniciar animación
        setTargetRedaccion(fullText.replace(/\.\./g, '.').replace(/ \./g, '.').replace('.\n\n.', '.\n\n'));
        setActiveTab('redaccion');
        // NO desactivar isGenerating aquí
    };


    // --- Reset (limpia targets e intervalos) ---
    const resetForm = () => {
        setFormData(initialState);
        setLipsViewMode('form');
        // Detener y limpiar animaciones
        clearLipsInterval();
        clearRedaccionInterval();
        setTargetLipsNarrative('');
        setDisplayedLipsNarrative('');
        setTargetRedaccion('');
        setDisplayedRedaccion('');
        // Resetear estados de carga por si acaso
        setIsGeneratingLipsNarrative(false);
        setIsGeneratingRedaccion(false);
        setActiveTab('formulario');
    };


    // --- Render Helper (sin cambios) ---
    const renderOptionButtons = /* ... (igual) ... */ ( title: string, options: Option[], currentValue: string | undefined | null, fieldPath: string ) => ( <div> <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">{title}:</h4> <div className="flex flex-wrap gap-2 mb-4"> {options.map(item => ( <button key={item.value} type="button" className={`px-3 py-1 text-sm rounded-full transition-colors ${ currentValue === item.value ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200' }`} onClick={() => handleOptionChange(fieldPath, item.value)} > {item.label} </button> ))} </div> </div> );

    // --- JSX (Usa los estados 'displayed...' para los Textarea de narrativa) ---
    return (
        <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : "my-4"}`} data-section-name="articulacionCraneomandibular">
            <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""} ${isMinimized ? "h-16 overflow-hidden" : ""}`}>
                {/* Header y Título (sin cambios) */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700"> <div className="flex justify-center w-full"> <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1"> <button className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${activeTab === 'formulario' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`} onClick={() => setActiveTab('formulario')} > Formulario </button> <button className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${activeTab === 'redaccion' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`} onClick={() => setActiveTab('redaccion')} > Redacción IA (General) </button> </div> </div> <div className="flex items-center gap-2"> <button onClick={handleMinimize} title={isMinimized ? "Restaurar" : "Minimizar"} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"> <Minus className="w-4 h-4 text-gray-600 dark:text-gray-300" /> </button> <button onClick={handleMaximize} title={isMaximized ? "Restaurar" : "Maximizar"} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"> <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-300" /> </button> </div> </div>
                <div className={`flex justify-start px-6 py-2 ${isMinimized ? 'hidden' : ''}`}> <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800 dark:text-white"> <span className="text-gray-400 dark:text-gray-500">XI.</span> ARTICULACIÓN CRANEOMANDIBULAR Y LABIOS </h2> </div>

                {!isMinimized && (
                    <>
                        {activeTab === 'formulario' ? (
                             <div className="p-6">
                                <div className="space-y-6">
                                     {/* --- ATM Formulario (sin cambios) --- */}
                                     <h3 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-700 dark:text-gray-300">Articulación Craneomandibular</h3>
                                     {/* ... (campos del formulario ATM igual que antes) ... */}
                                     <div> <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">¿Dolor al masticar o al hablar?</h4> <div className="flex gap-4"> <button type="button" className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.dolorMasticarHablar === true ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'}`} onClick={() => handleBooleanChange('dolorMasticarHablar', true)}>Sí</button> <button type="button" className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.dolorMasticarHablar === false ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'}`} onClick={() => handleBooleanChange('dolorMasticarHablar', false)}>No</button> </div> </div>
                                     {formData.dolorMasticarHablar === true && ( <> <div className="relative pl-4 border-l-2 border-emerald-200 dark:border-emerald-700 space-y-2"> <div> <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Tipo de dolor:</label> <Textarea value={formData.tipoDolor || ''} onChange={e => handleTextChange('tipoDolor', e.target.value)} placeholder="Describa el tipo de dolor (ej. punzante, sordo)" className="min-h-[60px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-emerald-500 focus:border-emerald-500" /> </div> <div> <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Duración:</label> <Textarea value={formData.duracionDolor || ''} onChange={e => handleTextChange('duracionDolor', e.target.value)} placeholder="Describa la duración (ej. constante, intermitente)" className="min-h-[60px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-emerald-500 focus:border-emerald-500" /> </div> </div> </> )}
                                     <div> <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">¿Dolor específico en alguna zona?</h4> <div className="flex gap-4"> <button type="button" className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.dolorEspecifico === true ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'}`} onClick={() => handleBooleanChange('dolorEspecifico', true)}>Sí</button> <button type="button" className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.dolorEspecifico === false ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'}`} onClick={() => handleBooleanChange('dolorEspecifico', false)}>No</button> </div> </div>
                                     {formData.dolorEspecifico === true && ( <div className="relative pl-4 border-l-2 border-emerald-200 dark:border-emerald-700"> <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Motivo/Zona del dolor:</label> <Textarea value={formData.motivoDolor || ''} onChange={e => handleTextChange('motivoDolor', e.target.value)} placeholder="Describa la zona o motivo (ej. preauricular, muscular)" className="min-h-[60px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-emerald-500 focus:border-emerald-500" /> </div> )}
                                     {renderOptionButtons( "Ruido articular", ruidoArticularOptions, formData.ruidoArticular, 'ruidoArticular' )}
                                     {renderOptionButtons( "Patrón de abertura mandibular", patronAberturaOptions, formData.patronAbertura, 'patronAbertura' )}
                                     {formData.patronAbertura === 'otro' && ( <div className="relative pl-4 border-l-2 border-blue-200 dark:border-blue-700"> <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Especifique otro patrón:</label> <Textarea value={formData.otroPatronAbertura || ''} onChange={e => handleTextChange('otroPatronAbertura', e.target.value)} placeholder="Especifique el patrón observado" className="min-h-[60px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500" /> </div> )}
                                     <div className="relative"> <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Otras observaciones (ATM):</label> <Textarea value={formData.otrasObservaciones || ''} onChange={e => handleTextChange('otrasObservaciones', e.target.value)} placeholder="Anote aquí cualquier otra observación relevante sobre la ATM" className="min-h-[80px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500" /> </div>


                                     {/* --- Labios Formulario / Narrativa Animada --- */}
                                     <div className="mt-8 border-t pt-6 border-gray-200 dark:border-gray-700">
                                         <div className="flex justify-between items-center mb-4">
                                             <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Labios</h3>
                                             {lipsViewMode === 'form' ? (
                                                 <Button variant="outline" size="sm" onClick={generateLipsNarrative} disabled={isGeneratingLipsNarrative} className={`flex items-center gap-1 ${isGeneratingLipsNarrative ? 'text-gray-500' : 'text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700'}`}>
                                                     {isGeneratingLipsNarrative ? <svg className="animate-spin h-4 w-4 mr-2" /* ... */></svg> : <FileText className="w-4 h-4 mr-2" />}
                                                     {isGeneratingLipsNarrative ? 'Generando...' : 'Generar Redacción Labios'}
                                                 </Button>
                                             ) : (
                                                 <Button variant="outline" size="sm" onClick={() => setLipsViewMode('form')} disabled={isGeneratingLipsNarrative} className="flex items-center gap-1 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                     <Edit className="w-4 h-4 mr-2" /> Editar Labios
                                                 </Button>
                                             )}
                                         </div>

                                         {lipsViewMode === 'form' ? (
                                              <div className="space-y-4">
                                                 {/* ... (Render options labios igual que antes) ... */}
                                                 {renderOptionButtons("Simetría", simetriaOptions, formData.labios?.simetria, 'labios.simetria')}
                                                 {renderOptionButtons("Tamaño/Volumen", volumenOptions, formData.labios?.volumen, 'labios.volumen')}
                                                 {renderOptionButtons("Coloración", coloracionOptions, formData.labios?.coloracion, 'labios.coloracion')}
                                                 {renderOptionButtons("Hidratación/Superficie", hidratacionOptions, formData.labios?.hidratacion, 'labios.hidratacion')}
                                                 {renderOptionButtons("Integridad", integridadOptions, formData.labios?.integridad, 'labios.integridad')}
                                                 {renderOptionButtons("Comisuras labiales", comisurasOptions, formData.labios?.comisuras, 'labios.comisuras')}
                                                 {renderOptionButtons("Movimiento y función", movimientoOptions, formData.labios?.movimiento, 'labios.movimiento')}
                                                 <div className="relative"> <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Otras observaciones (Labios):</label> <Textarea value={formData.labios?.otrasObservaciones || ''} onChange={e => handleTextChange('labios.otrasObservaciones', e.target.value)} placeholder="Observaciones adicionales sobre los labios" className="min-h-[80px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500" /> </div>
                                             </div>
                                         ) : (
                                             // **Usa el estado displayedLipsNarrative**
                                             <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700 min-h-[100px]">
                                                 <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                                                     {displayedLipsNarrative}
                                                     {/* Cursor opcional */}
                                                     {isGeneratingLipsNarrative && <span className="animate-pulse">▋</span>}
                                                 </p>
                                             </div>
                                         )}
                                     </div>
                                </div>
                             </div>
                        ) : (
                            <div className="p-6">
                                 <div className="flex justify-center mb-4">
                                     <Button onClick={generateRedaccion} disabled={isGeneratingRedaccion} className={`/* Estilos Botón */ ${isGeneratingRedaccion ? 'opacity-60 cursor-not-allowed' : ''}`}>
                                         {isGeneratingRedaccion ? <>{/* spinner */} Generando...</> : '✨ Generar Redacción General'}
                                     </Button>
                                 </div>
                                 {/* **Usa el estado displayedRedaccion** */}
                                 <Textarea
                                     readOnly
                                     value={displayedRedaccion}
                                     placeholder="La redacción generada aparecerá aquí..."
                                     className="min-h-[250px] w-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-md p-4 border border-gray-200 dark:border-gray-700 whitespace-pre-wrap font-mono"
                                 />
                                  {/* Cursor opcional */}
                                 {isGeneratingRedaccion && <span className="text-gray-400 dark:text-gray-600 animate-pulse">▋</span>}

                                 <div className="mt-4 flex justify-end">
                                     <button type="button" onClick={resetForm} className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors font-medium">
                                         Limpiar Todo
                                     </button>
                                 </div>
                            </div>
                        )}
                    </>
                )}
            </Card>
        </div>
    );
};

export default ArticulacionCraneomandibular;