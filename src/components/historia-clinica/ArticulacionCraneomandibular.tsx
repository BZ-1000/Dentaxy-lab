import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X, Edit, FileText } from "lucide-react"; // Asegúrate que X esté importado
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// Interfaces, Estado Inicial, Opciones, Mapeo de Frases (sin cambios respecto a la versión anterior)
// ... (copia aquí toda la parte de interfaces, initialState, options, lipNarrativePhrases) ...

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
        hidratacion?: string | null; // Se refiere a la superficie/estado
        integridad?: string | null; // Se refiere a la mucosa
        comisuras?: string | null;
        movimiento?: string | null;
        otrasObservaciones?: string; // Observaciones Labios
    };
}

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
    labios: {
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

type Option = { label: string; value: string };

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
    { label: "Coloración rosada", value: "normal" },
    { label: "Coloración pálida", value: "palidos" },
    { label: "Coloración cianótica", value: "cianoticos" },
    { label: "Coloración eritematosa", value: "eritematosos" },
];
const superficieOptions: Option[] = [
    { label: "Superficie hidratada", value: "hidratados" },
    { label: "Superficie seca", value: "secos" },
    { label: "Superficie agrietada", value: "agrietados" },
    { label: "Presencia de costras", value: "costras" },
    { label: "Superficie con fisuras", value: "fisuras" },
];
const integridadOptions: Option[] = [
    { label: "Íntegra", value: "intactos" },
    { label: "Con heridas superficiales", value: "heridas" },
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
const patronAberturaOptions: Option[] = [
    { label: "Recto", value: "recto" },
    { label: "Desviación Derecha", value: "desviacionDerecha" },
    { label: "Desviación Izquierda", value: "desviacionIzquierda" },
    { label: "Forma de 'S'", value: "formaS" },
    { label: "Otro", value: "otro" }
];
const ruidoArticularOptions: Option[] = [
    { label: "A la apertura", value: "abertura" },
    { label: "Al cierre", value: "cierre" },
    { label: "No presenta", value: "ninguno" },
];

const lipNarrativePhrases: { [key: string]: { [value: string]: string } } = { simetria: { simetricos: "Los labios presentan simetría bilateral sin desviaciones evidentes.", asimetricosDerecha: "Se evidencia desviación hacia la derecha, generando una leve asimetría en la región perioral.", asimetricosIzquierda: "Se aprecia una desviación hacia la izquierda, acompañada de discreta asimetría facial.", }, volumen: { delgados: "El volumen es delgado, con perfil labial poco prominente.", medianos: "Los labios son de volumen mediano, con proporciones adecuadas.", gruesos: "El volumen labial es grueso, con prominencia.", }, coloracion: { normal: "Se identifica una coloración rosada, con tonalidad homogénea.", palidos: "Se aprecia una coloración pálida, lo cual podría indicar hipoperfusión o deficiencia de hemoglobina.", cianoticos: "Se observa una coloración cianótica, indicativa de posible hipoxia tisular o alteración circulatoria.", eritematosos: "La mucosa evidencia una coloración eritematosa, sugestiva de inflamación o irritación local.", }, hidratacion: { hidratados: "La superficie labial se encuentra hidratada, con brillo característico.", secos: "La superficie labial se observa seca, sin hidratación visible y con posible ligera descamación.", agrietados: "La superficie presenta agrietamiento.", costras: "La superficie externa muestra presencia de costras, compatibles con procesos de cicatrización.", fisuras: "La superficie presenta fisuras lineales.", }, integridad: { intactos: "La integridad de la mucosa se mantiene, sin lesiones ni interrupciones del epitelio.", heridas: "La mucosa labial muestra heridas superficiales.", ulceraciones: "La evaluación de la integridad mucosa revela úlceras.", fisuras: "En cuanto a la integridad mucosa, se evidencian fisuras que comprometen parcialmente la continuidad del epitelio.", }, comisuras: { normales: "Las comisuras se encuentran normales, sin signos de irritación ni inflamación.", erosionadas: "Las comisuras se encuentran erosionadas, con pérdida parcial del epitelio.", queilitis: "Las comisuras labiales presentan signos de queilitis angular, con fisuración y/o eritema.", }, movimiento: { normales: "Funcionalmente, los labios presentan movimientos conservados, sin restricciones.", restriccion: "Durante la exploración funcional se detecta restricción de movimiento.", incompetencia: "A nivel funcional, los labios evidencian incompetencia labial, con incapacidad de sellado pasivo.", } };


// --- Componente Principal ---
const ArticulacionCraneomandibular: React.FC = () => {
    const [formData, setFormData] = useState<ArticulacionCraneomandibularState>(initialState);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [activeTab, setActiveTab] = useState('formulario');
    const [lipsViewMode, setLipsViewMode] = useState<'form' | 'narrative'>('form');
    const [isGeneratingLipsNarrative, setIsGeneratingLipsNarrative] = useState(false);
    const [targetLipsNarrative, setTargetLipsNarrative] = useState('');
    const [displayedLipsNarrative, setDisplayedLipsNarrative] = useState('');
    const lipsIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const typewriterSpeed = 35;

    const clearLipsInterval = useCallback(() => {
        if (lipsIntervalRef.current) {
            clearInterval(lipsIntervalRef.current);
            lipsIntervalRef.current = null;
        }
    }, []);

    useEffect(() => {
        clearLipsInterval();
        if (targetLipsNarrative && isGeneratingLipsNarrative) {
            let index = 0;
            setDisplayedLipsNarrative('');
            lipsIntervalRef.current = setInterval(() => {
                setDisplayedLipsNarrative((prev) => prev + targetLipsNarrative[index]);
                index++;
                if (index === targetLipsNarrative.length) {
                    clearLipsInterval();
                    setIsGeneratingLipsNarrative(false);
                }
            }, typewriterSpeed);
        } else {
            setDisplayedLipsNarrative(targetLipsNarrative);
             if (isGeneratingLipsNarrative) setIsGeneratingLipsNarrative(false);
        }
        return () => clearLipsInterval();
    }, [targetLipsNarrative, isGeneratingLipsNarrative, clearLipsInterval]);

    const handleMinimize = () => { setIsMinimized(!isMinimized); setIsMaximized(false); };
    const handleMaximize = () => { setIsMaximized(!isMaximized); setIsMinimized(false); };

    // --- NUEVO: handleClose (copiado del estilo de AntecedentesAlergicos) ---
    const handleClose = () => {
      // Define qué debe hacer el botón cerrar. ¿Resetear? ¿Ocultar?
      // Por ahora, lo haremos similar a minimizar/restaurar el estado inicial.
      setIsMinimized(false);
      setIsMaximized(false);
      // Podrías añadir lógica para ocultar el componente si es necesario:
      // setFormData(initialState); // Opcional: resetear datos al cerrar
      // setActiveTab('formulario'); // Opcional: volver al formulario
      console.log("Cerrar presionado - Implementar lógica deseada");
    };

    const handleArticulacionCraneomandibularChange = useCallback((fieldPath: string, value: any) => {
        setFormData(prevData => {
            const parts = fieldPath.split('.');
            const newState = structuredClone(prevData);
            let currentLevel: any = newState;
            for (let i = 0; i < parts.length - 1; i++) {
                const part = parts[i];
                if (currentLevel[part] === undefined || typeof currentLevel[part] !== 'object' || currentLevel[part] === null) {
                    currentLevel[part] = {};
                }
                currentLevel = currentLevel[part];
            }
            currentLevel[parts[parts.length - 1]] = value;
            return newState;
        });
    }, []);

    const handleOptionChange = useCallback((fieldPath: string, value: string) => {
        handleArticulacionCraneomandibularChange(fieldPath, value);
    }, [handleArticulacionCraneomandibularChange]);

    const handleTextChange = useCallback((fieldPath: string, e: React.ChangeEvent<HTMLTextAreaElement>) => {
        handleArticulacionCraneomandibularChange(fieldPath, e.target.value);
    }, [handleArticulacionCraneomandibularChange]);

    const handleBooleanChange = useCallback((fieldPath: string, value: boolean) => {
        handleArticulacionCraneomandibularChange(fieldPath, value);
    }, [handleArticulacionCraneomandibularChange]);

    // Función generateLipsNarrative (sin cambios respecto a la versión anterior)
    const generateLipsNarrative = useCallback(() => {
        setIsGeneratingLipsNarrative(true);
        clearLipsInterval();
        setTargetLipsNarrative('');

        const data = formData.labios || {};
        let sentences: string[] = [];

        if (data.simetria && lipNarrativePhrases.simetria[data.simetria]) sentences.push(lipNarrativePhrases.simetria[data.simetria]);
        if (data.volumen && lipNarrativePhrases.volumen[data.volumen]) sentences.push(lipNarrativePhrases.volumen[data.volumen]);
        if (data.coloracion && lipNarrativePhrases.coloracion[data.coloracion]) sentences.push(lipNarrativePhrases.coloracion[data.coloracion]);
        if (data.hidratacion && lipNarrativePhrases.hidratacion[data.hidratacion]) sentences.push(lipNarrativePhrases.hidratacion[data.hidratacion]);
        if (data.integridad && lipNarrativePhrases.integridad[data.integridad]) {
             const integridadPhrase = lipNarrativePhrases.integridad[data.integridad];
             if (data.integridad !== 'fisuras' || data.hidratacion !== 'fisuras') {
                  if (data.integridad === 'fisuras') {
                      const superficiePhrase = data.hidratacion ? lipNarrativePhrases.hidratacion[data.hidratacion] : '';
                      if (!superficiePhrase || !superficiePhrase.toLowerCase().includes('fisura')) {
                          sentences.push(integridadPhrase);
                      }
                  } else {
                      sentences.push(integridadPhrase);
                  }
             }
        }
        if (data.comisuras && lipNarrativePhrases.comisuras[data.comisuras]) sentences.push(lipNarrativePhrases.comisuras[data.comisuras]);
        if (data.movimiento && lipNarrativePhrases.movimiento[data.movimiento]) sentences.push(lipNarrativePhrases.movimiento[data.movimiento]);

        let fullText = "";
        if (sentences.length > 0) {
             fullText = sentences.map(s => s.trim().replace(/\.$/, '')).join('. ') + '.';
        } else {
            fullText = "No se han seleccionado características específicas para la evaluación de labios.";
        }

        if (data.otrasObservaciones && data.otrasObservaciones.trim() !== '') {
            const observaciones = `Observaciones adicionales: ${data.otrasObservaciones.trim()}.`;
            if (fullText === "No se han seleccionado características específicas para la evaluación de labios.") {
                 fullText = observaciones;
            } else {
                 fullText += " " + observaciones;
            }
        }

        setTargetLipsNarrative(fullText);
        setLipsViewMode('narrative');

    }, [formData.labios, clearLipsInterval]);


    const resetForm = useCallback(() => {
        setFormData(initialState);
        setLipsViewMode('form');
        clearLipsInterval();
        setTargetLipsNarrative('');
        setIsGeneratingLipsNarrative(false);
        setActiveTab('formulario');
    }, [clearLipsInterval]);

    const renderOptionButtons = useCallback(( title: string, options: Option[], currentValue: string | undefined | null, fieldPath: string ) => (
        <div>
            <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">{title}:</h4>
            <div className="flex flex-wrap gap-2 mb-4">
                {options.map(item => (
                    <button
                        key={`${fieldPath}-${item.value}`}
                        type="button"
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                            currentValue === item.value
                                ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md ring-2 ring-emerald-300 dark:ring-emerald-700'
                                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600'
                        }`}
                        onClick={() => handleOptionChange(fieldPath, item.value)}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    ), [handleOptionChange]);


    // --- JSX del Componente ---
    return (
        <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : "my-4"}`} data-section-name="articulacionCraneomandibular">
            {/* Card con nueva clase flex-col para manejar el scroll interno */}
            <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 flex flex-col ${isMaximized ? "h-[calc(100vh-2rem)]" : ""} ${isMinimized ? "h-16 overflow-hidden" : ""}`}>
                {/* Header con el NUEVO ESTILO */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0"> {/* Estilo base adoptado, flex-shrink-0 evita que se encoja */}
                    {/* Tabs con nuevo estilo */}
                    <div className="flex justify-center w-full"> {/* Centrado */}
                        <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
                            <button
                                className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${activeTab === 'formulario' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300'}`} // Estilo adoptado
                                onClick={() => setActiveTab('formulario')}
                            >
                                Formulario
                            </button>
                            {/* Podrías añadir el tab 'Redacción IA' si aplica a todo el componente, no solo a labios */}
                        </div>
                    </div>

                    {/* Controles con nuevo estilo */}
                    <div className="flex items-center gap-2"> {/* Sin pl-2 */}
                        <button onClick={handleMinimize} title={isMinimized ? "Restaurar" : "Minimizar"} className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors" type="button"> {/* Estilo adoptado */}
                            <Minus className="w-4 h-4" />
                        </button>
                        <button onClick={handleMaximize} title={isMaximized ? "Restaurar" : "Maximizar"} className="p-1 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors" type="button"> {/* Estilo adoptado */}
                            <Maximize2 className="w-4 h-4" />
                        </button>
                        <button onClick={handleClose} title="Cerrar" className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors" type="button"> {/* Botón Cerrar añadido */}
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                 {/* Contenedor de Contenido Scrollable (si no está minimizado) */}
                 {/* flex-grow permite que este div ocupe el espacio restante, overflow-y-auto habilita el scroll interno */}
                 <div className={`flex-grow overflow-y-auto ${isMinimized ? 'hidden' : ''}`}>
                    {/* Título Principal */}
                    <div className="flex justify-start px-6 pt-4 pb-2"> {/* Ajustado padding */}
                        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white tracking-tight">
                            <span className="text-blue-500 dark:text-blue-400 font-semibold">XI.</span> ARTICULACIÓN CRANEOMANDIBULAR Y LABIOS
                        </h2>
                    </div>

                    {/* Contenido Principal */}
                    <div className="px-6 pb-6">
                        {activeTab === 'formulario' ? (
                            <div className="space-y-8">
                                {/* --- ATM Formulario (sin cambios) --- */}
                                <section>
                                    <h3 className="text-lg font-semibold mb-4 border-b border-gray-300 dark:border-gray-600 pb-2 text-gray-700 dark:text-gray-300">Articulación Craneomandibular</h3>
                                    <div className="space-y-5">
                                        {/* ... (Todo el formulario de ATM aquí, igual que antes) ... */}
                                         {/* Dolor Masticar/Hablar */}
                                         <div> <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">Dolor al masticar o hablar</h4> <div className="flex gap-3"> <button type="button" className={`px-4 py-1.5 rounded-md text-sm transition-colors shadow-sm ${formData.dolorMasticarHablar === true ? 'bg-emerald-500 text-white hover:bg-emerald-600 ring-2 ring-emerald-300' : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'}`} onClick={() => handleBooleanChange('dolorMasticarHablar', true)}>Sí</button> <button type="button" className={`px-4 py-1.5 rounded-md text-sm transition-colors shadow-sm ${formData.dolorMasticarHablar === false ? 'bg-emerald-500 text-white hover:bg-emerald-600 ring-2 ring-emerald-300' : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'}`} onClick={() => handleBooleanChange('dolorMasticarHablar', false)}>No</button> </div> </div>
                                         {/* Campos Condicionales Dolor */}
                                        {formData.dolorMasticarHablar === true && ( <div className="pl-4 border-l-2 border-emerald-300 dark:border-emerald-600 space-y-3 ml-1"> <div> <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Tipo de dolor:</label> <Textarea value={formData.tipoDolor || ''} onChange={e => handleTextChange('tipoDolor', e)} placeholder="Ej. punzante, sordo, opresivo..." className="min-h-[50px] bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-emerald-500 focus:border-emerald-500 rounded-md shadow-sm" /> </div> <div> <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Duración:</label> <Textarea value={formData.duracionDolor || ''} onChange={e => handleTextChange('duracionDolor', e)} placeholder="Ej. constante, intermitente..." className="min-h-[50px] bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-emerald-500 focus:border-emerald-500 rounded-md shadow-sm" /> </div> </div> )}
                                         {/* Dolor Específico */}
                                         <div> <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">Dolor específico localizado</h4> <div className="flex gap-3"> <button type="button" className={`px-4 py-1.5 rounded-md text-sm transition-colors shadow-sm ${formData.dolorEspecifico === true ? 'bg-emerald-500 text-white hover:bg-emerald-600 ring-2 ring-emerald-300' : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'}`} onClick={() => handleBooleanChange('dolorEspecifico', true)}>Sí</button> <button type="button" className={`px-4 py-1.5 rounded-md text-sm transition-colors shadow-sm ${formData.dolorEspecifico === false ? 'bg-emerald-500 text-white hover:bg-emerald-600 ring-2 ring-emerald-300' : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'}`} onClick={() => handleBooleanChange('dolorEspecifico', false)}>No</button> </div> </div>
                                         {/* Motivo Dolor */}
                                        {formData.dolorEspecifico === true && ( <div className="pl-4 border-l-2 border-emerald-300 dark:border-emerald-600 ml-1"> <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Zona o motivo del dolor:</label> <Textarea value={formData.motivoDolor || ''} onChange={e => handleTextChange('motivoDolor', e)} placeholder="Ej. preauricular, masetero..." className="min-h-[50px] bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-emerald-500 focus:border-emerald-500 rounded-md shadow-sm" /> </div> )}
                                        {/* Ruido Articular */}
                                        {renderOptionButtons( "Ruido articular", ruidoArticularOptions, formData.ruidoArticular, 'ruidoArticular' )}
                                        {/* Patrón Abertura */}
                                        {renderOptionButtons( "Patrón de abertura mandibular", patronAberturaOptions, formData.patronAbertura, 'patronAbertura' )}
                                        {/* Otro Patrón */}
                                        {formData.patronAbertura === 'otro' && ( <div className="pl-4 border-l-2 border-blue-300 dark:border-blue-600 ml-1"> <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Especifique otro patrón:</label> <Textarea value={formData.otroPatronAbertura || ''} onChange={e => handleTextChange('otroPatronAbertura', e)} placeholder="Describa el patrón observado" className="min-h-[50px] bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm" /> </div> )}
                                        {/* Observaciones ATM */}
                                        <div> <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Otras observaciones (ATM):</label> <Textarea value={formData.otrasObservaciones || ''} onChange={e => handleTextChange('otrasObservaciones', e)} placeholder="Cualquier otro hallazgo relevante sobre la ATM..." className="min-h-[70px] bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm" /> </div>

                                    </div>
                                </section>

                                {/* --- Labios Formulario / Narrativa --- */}
                                <section>
                                    {/* Div contenedor del título y botón AHORA STICKY */}
                                    <div className="flex justify-between items-center sticky top-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm z-5 border-b border-gray-300 dark:border-gray-600 pb-2 mb-4 pt-6"> {/* Clases Sticky añadidas y ajuste de padding/border */}
                                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Labios</h3>
                                        {/* Botón Cambiar Vista / Generar */}
                                         {lipsViewMode === 'form' ? (
                                             <Button variant="outline" size="sm" onClick={generateLipsNarrative} disabled={isGeneratingLipsNarrative} className={`flex items-center gap-1.5 ${isGeneratingLipsNarrative ? 'text-gray-500 cursor-not-allowed' : 'text-blue-600 dark:text-blue-400 border-blue-500/50 dark:border-blue-400/50 hover:bg-blue-50 dark:hover:bg-blue-900/30'}`}>
                                                 {isGeneratingLipsNarrative ? <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> : <FileText className="w-4 h-4" />}
                                                 {isGeneratingLipsNarrative ? 'Generando...' : 'Redacción Labios'}
                                             </Button>
                                         ) : (
                                             <Button variant="outline" size="sm" onClick={() => setLipsViewMode('form')} disabled={isGeneratingLipsNarrative} className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 border-gray-400/50 dark:border-gray-500/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 disabled:opacity-50">
                                                 <Edit className="w-4 h-4" /> Editar
                                             </Button>
                                         )}
                                    </div>

                                    {/* Contenido Labios (Formulario o Narrativa) */}
                                     {lipsViewMode === 'form' ? (
                                         <div className="space-y-5">
                                            {/* El contenido del formulario de labios aquí */}
                                            {renderOptionButtons("Simetría", simetriaOptions, formData.labios?.simetria, 'labios.simetria')}
                                            {renderOptionButtons("Volumen", volumenOptions, formData.labios?.volumen, 'labios.volumen')}
                                            {renderOptionButtons("Coloración", coloracionOptions, formData.labios?.coloracion, 'labios.coloracion')}
                                            {renderOptionButtons("Superficie", superficieOptions, formData.labios?.hidratacion, 'labios.hidratacion')}
                                            {renderOptionButtons("Integridad Mucosa", integridadOptions, formData.labios?.integridad, 'labios.integridad')}
                                            {renderOptionButtons("Comisuras", comisurasOptions, formData.labios?.comisuras, 'labios.comisuras')}
                                            {renderOptionButtons("Función (Movimiento)", movimientoOptions, formData.labios?.movimiento, 'labios.movimiento')}
                                             <div>
                                                 <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Otras observaciones (Labios):</label>
                                                 <Textarea value={formData.labios?.otrasObservaciones || ''} onChange={e => handleTextChange('labios.otrasObservaciones', e)} placeholder="Cualquier otro hallazgo relevante sobre los labios..." className="min-h-[70px] bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm" />
                                             </div>
                                         </div>
                                     ) : (
                                         // Vista Narrativa (sin cambios)
                                         <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 min-h-[120px] shadow-inner">
                                             <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                                                 {displayedLipsNarrative}
                                                 {(isGeneratingLipsNarrative && lipsIntervalRef.current) && <span className="inline-block w-1 h-4 bg-gray-800 dark:bg-gray-200 animate-pulse ml-px"></span>}
                                             </p>
                                         </div>
                                     )}
                                </section>
                            </div>
                        ) : (
                             // Placeholder para otras pestañas si las hubiera
                             <div className="text-center py-10">
                                <p className="text-gray-500 dark:text-gray-400">Contenido no disponible en esta pestaña.</p>
                            </div>
                        )}
                    </div>
                 </div> {/* Fin Contenedor Scrollable */}
            </Card>
        </div>
    );
};

export default ArticulacionCraneomandibular;