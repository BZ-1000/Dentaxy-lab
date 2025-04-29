import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card"; // Asume que estos imports funcionan en tu proyecto
import { Minus, Maximize2, X, Edit, FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// 1. Define la estructura del estado LOCAL para este componente
interface ArticulacionCraneomandibularState {
  dolorMasticarHablar?: boolean | null;
  tipoDolor?: string;
  duracionDolor?: string;
  dolorEspecifico?: boolean | null;
  motivoDolor?: string;
  ruidoArticular?: string | null;
  patronAbertura?: string | null;
  otroPatronAbertura?: string;
  otrasObservaciones?: string; // Observaciones para ATM
  labios: { // Asegura que labios siempre exista
      simetria?: string | null;
      volumen?: string | null;
      coloracion?: string | null;
      hidratacion?: string | null;
      integridad?: string | null;
      comisuras?: string | null;
      movimiento?: string | null;
      otrasObservaciones?: string; // Observaciones para Labios
  };
}

// 2. Define un estado inicial claro
const initialState: ArticulacionCraneomandibularState = {
  dolorMasticarHablar: null,
  tipoDolor: '',
  duracionDolor: '',
  dolorEspecifico: null,
  motivoDolor: '',
  ruidoArticular: null,
  patronAbertura: null,
  otroPatronAbertura: '',
  otrasObservaciones: '', // ATM observations
  labios: { // Inicializa el objeto labios
      simetria: null,
      volumen: null,
      coloracion: null,
      hidratacion: null,
      integridad: null,
      comisuras: null,
      movimiento: null,
      otrasObservaciones: '' // Labios observations
  }
};

// Definir tipos para las opciones (sin cambios)
type Option = { label: string; value: string };
const simetriaOptions: Option[] = [ /* ... opciones ... */ { label: "Simétricos", value: "simetricos" },{ label: "Desviación Derecha", value: "asimetricosDerecha" },{ label: "Desviación Izquierda", value: "asimetricosIzquierda" },];
const volumenOptions: Option[] = [ /* ... opciones ... */ { label: "Delgados", value: "delgados" },{ label: "Medianos", value: "medianos" },{ label: "Gruesos", value: "gruesos" },];
const coloracionOptions: Option[] = [ /* ... opciones ... */ { label: "Rosados (Normal)", value: "normal" },{ label: "Pálidos", value: "palidos" },{ label: "Cianóticos", value: "cianoticos" },{ label: "Eritematosos", value: "eritematosos" },];
const hidratacionOptions: Option[] = [ /* ... opciones ... */ { label: "Hidratados", value: "hidratados" },{ label: "Secos", value: "secos" },{ label: "Agrietados", value: "agrietados" },{ label: "Con Costras", value: "costras" },];
const integridadOptions: Option[] = [ /* ... opciones ... */ { label: "Íntegros", value: "intactos" },{ label: "Heridas", value: "heridas" },{ label: "Ulceraciones", value: "ulceraciones" },{ label: "Fisuras Comisurales", value: "fisuras" },];
const comisurasOptions: Option[] = [ /* ... opciones ... */ { label: "Normales", value: "normales" },{ label: "Erosionadas", value: "erosionadas" },{ label: "Queilitis Angular", value: "queilitis" },];
const movimientoOptions: Option[] = [ /* ... opciones ... */ { label: "Normales", value: "normales" },{ label: "Restricción Movimiento", value: "restriccion" },{ label: "Incompetencia Labial", value: "incompetencia" },];
const patronAberturaOptions: Option[] = [ /* ... opciones ... */ { label: "Recto", value: "recto" },{ label: "Desviación Derecha", value: "desviacionDerecha" },{ label: "Desviación Izquierda", value: "desviacionIzquierda" },{ label: "Forma de 'S'", value: "formaS" },{ label: "Otro", value: "otro" }];
const ruidoArticularOptions: Option[] = [ /* ... opciones ... */ { label: "Abertura", value: "abertura" },{ label: "Cierre", value: "cierre" },{ label: "No", value: "ninguno" },];


// 3. El componente ya no necesita props para los datos
const ArticulacionCraneomandibular: React.FC = () => { // No recibe props de datos

  // 4. Usa el estado interno
  const [formData, setFormData] = useState<ArticulacionCraneomandibularState>(initialState);

  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState('formulario');
  const [redaccionContent, setRedaccionContent] = useState('');
  const [isGeneratingRedaccion, setIsGeneratingRedaccion] = useState(false);
  const [lipsViewMode, setLipsViewMode] = useState<'form' | 'narrative'>('form');
  const [lipsNarrativeContent, setLipsNarrativeContent] = useState('');
  const [isGeneratingLipsNarrative, setIsGeneratingLipsNarrative] = useState(false);

  // Acceso seguro a los datos del estado interno
  const labiosData = formData.labios || {}; // Asegura que labiosData sea siempre un objeto

  const handleMinimize = () => { setIsMinimized(!isMinimized); setIsMaximized(false); };
  const handleMaximize = () => { setIsMaximized(!isMaximized); setIsMinimized(false); };
  const handleClose = () => { setIsMinimized(true); setIsMaximized(false); };

  // 5. Define la función de actualización DENTRO del componente
  const handleArticulacionCraneomandibularChange = (fieldPath: string, value: any) => {
      setFormData(prevData => {
          const parts = fieldPath.split('.'); // ej: 'labios.simetria' -> ['labios', 'simetria']
          // Usa structuredClone para una copia profunda segura y fácil (alternativa a immer o deepmerge manual)
          const newState = structuredClone(prevData);

          let currentLevel: any = newState;

          // Navega hasta el penúltimo nivel del path
          for (let i = 0; i < parts.length - 1; i++) {
              const part = parts[i];
              // Si un nivel intermedio no existe (aunque con initialState no debería pasar), créalo
              if (currentLevel[part] === undefined || currentLevel[part] === null) {
                  currentLevel[part] = {};
              }
              currentLevel = currentLevel[part];
          }

          // Establece el valor en el último nivel
          const finalPart = parts[parts.length - 1];
          currentLevel[finalPart] = value;

          return newState; // Devuelve el estado completamente nuevo
      });
  };

  // Las funciones handler ahora llaman a la función interna
   const handleOptionChange = (fieldPath: string, value: string) => {
     handleArticulacionCraneomandibularChange(fieldPath, value);
   };
   const handleTextChange = (fieldPath: string, value: string) => {
     handleArticulacionCraneomandibularChange(fieldPath, value);
   };
   const handleBooleanChange = (fieldPath: string, value: boolean) => {
     handleArticulacionCraneomandibularChange(fieldPath, value);
   };

  // --- Funciones de Generación de Narrativa (usan el estado interno 'formData') ---
  const generateLipsNarrative = () => {
    setIsGeneratingLipsNarrative(true);
    // Usa directamente formData.labios
    const currentLabiosData = formData.labios || {};

    setTimeout(() => {
      let content = "Al examen clínico se observan ";
      // ... (lógica de generación igual que antes, usando currentLabiosData)
        const simetriaDesc = simetriaOptions.find(o => o.value === currentLabiosData.simetria)?.label || 'simetría no evaluada';
        content += `labios ${simetriaDesc.toLowerCase()}. `;
        const volumenDesc = volumenOptions.find(o => o.value === currentLabiosData.volumen)?.label || 'volumen no evaluado';
        content += `Son ${volumenDesc.toLowerCase()}, `;
        const coloracionDesc = coloracionOptions.find(o => o.value === currentLabiosData.coloracion)?.label || 'coloración no evaluada';
        content += `con coloración ${coloracionDesc.toLowerCase()}. `;
        const hidratacionDesc = hidratacionOptions.find(o => o.value === currentLabiosData.hidratacion)?.label || 'hidratación no evaluada';
        content += `La superficie presenta ${hidratacionDesc.toLowerCase()}. `;
        const integridadDesc = integridadOptions.find(o => o.value === currentLabiosData.integridad)?.label || 'integridad no evaluada';
        content += `Se observan ${integridadDesc.toLowerCase()}. `;
        const comisurasDesc = comisurasOptions.find(o => o.value === currentLabiosData.comisuras)?.label || 'comisuras no evaluadas';
        content += `Las comisuras labiales son ${comisurasDesc.toLowerCase()}. `;
        const movimientoDesc = movimientoOptions.find(o => o.value === currentLabiosData.movimiento)?.label || 'movimiento no evaluado';
        content += `El movimiento y función muestra ${movimientoDesc.toLowerCase()}. `;
        if (currentLabiosData.otrasObservaciones) { content += `Observaciones adicionales: ${currentLabiosData.otrasObservaciones}.`; }

      setLipsNarrativeContent(content.trim());
      setIsGeneratingLipsNarrative(false);
      setLipsViewMode('narrative');
    }, 500);
  };

  const generateRedaccion = () => {
    setIsGeneratingRedaccion(true);
    // Usa directamente formData para ATM y formData.labios para labios
    const currentAtmData = formData; // formData ahora ES el estado de ATM+Labios
    const currentLabiosData = formData.labios || {};

    setTimeout(() => {
      let fullContent = "";
      let lipsContent = "Labios: ";
      // ... (lógica de generación de labios igual que antes, usando currentLabiosData)
        const simetriaDesc = simetriaOptions.find(o => o.value === currentLabiosData.simetria)?.label || '';
        const volumenDesc = volumenOptions.find(o => o.value === currentLabiosData.volumen)?.label || '';
        const coloracionDesc = coloracionOptions.find(o => o.value === currentLabiosData.coloracion)?.label || '';
        const hidratacionDesc = hidratacionOptions.find(o => o.value === currentLabiosData.hidratacion)?.label || '';
        const integridadDesc = integridadOptions.find(o => o.value === currentLabiosData.integridad)?.label || '';
        const comisurasDesc = comisurasOptions.find(o => o.value === currentLabiosData.comisuras)?.label || '';
        const movimientoDesc = movimientoOptions.find(o => o.value === currentLabiosData.movimiento)?.label || '';
        const lipsDetails = [ simetriaDesc && `Simetría: ${simetriaDesc}`, volumenDesc && `Volumen: ${volumenDesc}`, coloracionDesc && `Coloración: ${coloracionDesc}`, hidratacionDesc && `Superficie: ${hidratacionDesc}`, integridadDesc && `Integridad: ${integridadDesc}`, comisurasDesc && `Comisuras: ${comisurasDesc}`, movimientoDesc && `Movimiento: ${movimientoDesc}`, currentLabiosData.otrasObservaciones && `Observaciones: ${currentLabiosData.otrasObservaciones}` ].filter(Boolean).join('. ');
        if (lipsDetails) { lipsContent += lipsDetails + "."; } else { lipsContent += "No se registraron detalles específicos de los labios."; }
        fullContent += lipsContent;


      let atmContent = "\n\nArticulación Craneomandibular: ";
      let atmDetails = [];
       // ... (lógica de generación de ATM igual que antes, usando currentAtmData directamente)
       if (currentAtmData.dolorMasticarHablar === true) { let dolorInfo = "Refiere dolor al masticar/hablar"; if (currentAtmData.tipoDolor) dolorInfo += ` (Tipo: ${currentAtmData.tipoDolor})`; if (currentAtmData.duracionDolor) dolorInfo += ` (Duración: ${currentAtmData.duracionDolor})`; atmDetails.push(dolorInfo); } else if (currentAtmData.dolorMasticarHablar === false) { atmDetails.push("No refiere dolor al masticar/hablar"); }
       if (currentAtmData.dolorEspecifico === true && currentAtmData.motivoDolor) { atmDetails.push(`Refiere dolor específico (Motivo: ${currentAtmData.motivoDolor})`); } else if (currentAtmData.dolorEspecifico === false) { /* No añadir nada o ser explícito */ }
       if (currentAtmData.ruidoArticular && currentAtmData.ruidoArticular !== 'ninguno') { const ruidoLabel = ruidoArticularOptions.find(o => o.value === currentAtmData.ruidoArticular)?.label || currentAtmData.ruidoArticular; atmDetails.push(`Ruido articular: ${ruidoLabel}`); } else if (currentAtmData.ruidoArticular === 'ninguno') { atmDetails.push("No se reporta ruido articular"); }
       if (currentAtmData.patronAbertura) { let patronDesc = patronAberturaOptions.find(o => o.value === currentAtmData.patronAbertura)?.label || currentAtmData.patronAbertura; if (currentAtmData.patronAbertura === 'otro' && currentAtmData.otroPatronAbertura) { patronDesc += `: ${currentAtmData.otroPatronAbertura}`; } atmDetails.push(`Patrón de abertura: ${patronDesc}`); }
       if (currentAtmData.otrasObservaciones) { atmDetails.push(`Observaciones ATM: ${currentAtmData.otrasObservaciones}`); } // Observaciones de ATM
       if (atmDetails.length > 0) { atmContent += atmDetails.join('. ') + "."; } else { atmContent += "No se registraron detalles específicos de la ATM."; }
       fullContent += atmContent;

      setRedaccionContent(fullContent.trim());
      setIsGeneratingRedaccion(false);
      setActiveTab('redaccion');
    }, 1000);
  };

  // 6. Reset usa setFormData con el estado inicial
  const resetForm = () => {
    setFormData(initialState); // Resetea al estado inicial definido arriba

    // Resetear vistas y contenido local adicional
    setLipsViewMode('form');
    setLipsNarrativeContent('');
    setActiveTab('formulario');
    setRedaccionContent('');
  };

  // Helper para renderizar botones (sin cambios, pero usa el estado interno)
  const renderOptionButtons = (
      title: string,
      options: Option[],
      currentValue: string | undefined | null, // El valor actual vendrá del estado interno formData
      fieldPath: string                       // El path se usa para actualizar el estado interno
  ) => (
      <div>
          <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">{title}:</h4>
          <div className="flex flex-wrap gap-2 mb-4">
              {options.map(item => (
                  <button
                      key={item.value}
                      type="button"
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                          currentValue === item.value
                              ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                              : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                      }`}
                      // Llama al handler interno que usa la función de actualización interna
                      onClick={() => handleOptionChange(fieldPath, item.value)}
                  >
                      {item.label}
                  </button>
              ))}
          </div>
      </div>
  );


  // --- JSX del Componente (adaptado para leer del estado interno 'formData') ---
  return (
    // Clases para maximizar/minimizar (sin cambios)
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : "my-4"}`} data-section-name="articulacionCraneomandibular">
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""} ${isMinimized ? "h-16 overflow-hidden" : ""}`}>
        {/* Header con Tabs y Controles (sin cambios funcionales) */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {/* ... (Tabs y botones de minimizar/maximizar igual que antes) ... */}
            <div className="flex justify-center w-full">
              <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
                <button
                  className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${activeTab === 'formulario' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                  onClick={() => setActiveTab('formulario')}
                >
                  Formulario
                </button>
                <button
                  className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${activeTab === 'redaccion' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                  onClick={() => setActiveTab('redaccion')}
                >
                  Redacción IA (General)
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleMinimize} title={isMinimized ? "Restaurar" : "Minimizar"} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <Minus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
              <button onClick={handleMaximize} title={isMaximized ? "Restaurar" : "Maximizar"} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
               {/* <button onClick={handleClose} title="Cerrar" className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"> <X className="w-4 h-4" /> </button> */}
          </div>
        </div>

         {/* Título Principal (sin cambios) */}
         <div className={`flex justify-start px-6 py-2 ${isMinimized ? 'hidden' : ''}`}>
           <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
             <span className="text-gray-400 dark:text-gray-500">XI.</span> ARTICULACIÓN CRANEOMANDIBULAR Y LABIOS
           </h2>
         </div>


        {/* Contenido Principal (lee del estado interno 'formData') */}
        {!isMinimized && (
          <>
            {activeTab === 'formulario' ? (
              <div className="p-6">
                <div className="space-y-6">
                  {/* --- Sección Articulación Craneomandibular --- */}
                  <h3 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-700 dark:text-gray-300">Articulación Craneomandibular</h3>

                  {/* Dolor al masticar (lee de formData.dolorMasticarHablar) */}
                  <div>
                    <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">¿Dolor al masticar o al hablar?</h4>
                    <div className="flex gap-4">
                      <button type="button" /* ... */ className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.dolorMasticarHablar === true ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'}`} onClick={() => handleBooleanChange('dolorMasticarHablar', true)}>Sí</button>
                      <button type="button" /* ... */ className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.dolorMasticarHablar === false ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'}`} onClick={() => handleBooleanChange('dolorMasticarHablar', false)}>No</button>
                    </div>
                  </div>

                  {/* Campos condicionales (leen de formData.tipoDolor, etc) */}
                  {formData.dolorMasticarHablar === true && (
                     <>
                       <div className="relative pl-4 border-l-2 border-emerald-200 dark:border-emerald-700 space-y-2">
                         <div>
                             <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Tipo de dolor:</label>
                             <Textarea value={formData.tipoDolor || ''} onChange={e => handleTextChange('tipoDolor', e.target.value)} /* ... */ className="min-h-[60px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-emerald-500 focus:border-emerald-500" />
                         </div>
                         <div>
                             <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Duración:</label>
                             <Textarea value={formData.duracionDolor || ''} onChange={e => handleTextChange('duracionDolor', e.target.value)} /* ... */ className="min-h-[60px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-emerald-500 focus:border-emerald-500" />
                         </div>
                       </div>
                     </>
                  )}

                  {/* Dolor específico (lee de formData.dolorEspecifico) */}
                   <div>
                     <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">¿Dolor específico en alguna zona?</h4>
                     <div className="flex gap-4">
                       <button type="button" /* ... */ className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.dolorEspecifico === true ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'}`} onClick={() => handleBooleanChange('dolorEspecifico', true)}>Sí</button>
                       <button type="button" /* ... */ className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.dolorEspecifico === false ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'}`} onClick={() => handleBooleanChange('dolorEspecifico', false)}>No</button>
                     </div>
                   </div>

                  {formData.dolorEspecifico === true && (
                    <div className="relative pl-4 border-l-2 border-emerald-200 dark:border-emerald-700">
                      <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Motivo/Zona del dolor:</label>
                      <Textarea value={formData.motivoDolor || ''} onChange={e => handleTextChange('motivoDolor', e.target.value)} /* ... */ className="min-h-[60px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-emerald-500 focus:border-emerald-500" />
                    </div>
                  )}

                  {/* Ruido Articular (lee de formData.ruidoArticular) */}
                  {renderOptionButtons( "Ruido articular", ruidoArticularOptions, formData.ruidoArticular, 'ruidoArticular' )}

                  {/* Patrón de abertura (lee de formData.patronAbertura) */}
                  {renderOptionButtons( "Patrón de abertura mandibular", patronAberturaOptions, formData.patronAbertura, 'patronAbertura' )}

                  {formData.patronAbertura === 'otro' && (
                     <div className="relative pl-4 border-l-2 border-blue-200 dark:border-blue-700">
                       <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Especifique otro patrón:</label>
                       <Textarea value={formData.otroPatronAbertura || ''} onChange={e => handleTextChange('otroPatronAbertura', e.target.value)} /* ... */ className="min-h-[60px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500" />
                     </div>
                  )}

                  {/* Otras observaciones ATM (lee de formData.otrasObservaciones) */}
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Otras observaciones (ATM):</label>
                    <Textarea value={formData.otrasObservaciones || ''} onChange={e => handleTextChange('otrasObservaciones', e.target.value)} /* ... */ className="min-h-[80px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500" />
                  </div>


                  {/* --- Sección Labios --- */}
                  <div className="mt-8 border-t pt-6 border-gray-200 dark:border-gray-700">
                     {/* ... (Header de labios y botón de generar/editar igual que antes) ... */}
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Labios</h3>
                        {lipsViewMode === 'form' ? (
                            <Button variant="outline" size="sm" onClick={generateLipsNarrative} disabled={isGeneratingLipsNarrative} /* ... */ className="flex items-center gap-1 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700">
                                {isGeneratingLipsNarrative ? <svg /* spinner */></svg> : <FileText className="w-4 h-4" />} Generar Redacción Labios
                            </Button>
                        ) : (
                            <Button variant="outline" size="sm" onClick={() => setLipsViewMode('form')} /* ... */ className="flex items-center gap-1 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Edit className="w-4 h-4" /> Editar Labios
                            </Button>
                        )}
                      </div>

                      {/* Contenido condicional Labios (lee de formData.labios) */}
                      {lipsViewMode === 'form' ? (
                        <div className="space-y-4">
                          {/* Simetría (lee de formData.labios.simetria) */}
                          {renderOptionButtons("Simetría", simetriaOptions, formData.labios?.simetria, 'labios.simetria')}
                          {/* Volumen (lee de formData.labios.volumen) */}
                          {renderOptionButtons("Tamaño/Volumen", volumenOptions, formData.labios?.volumen, 'labios.volumen')}
                           {/* ... resto de renderOptionButtons para labios ... */}
                           {renderOptionButtons("Coloración", coloracionOptions, formData.labios?.coloracion, 'labios.coloracion')}
                           {renderOptionButtons("Hidratación/Superficie", hidratacionOptions, formData.labios?.hidratacion, 'labios.hidratacion')}
                           {renderOptionButtons("Integridad", integridadOptions, formData.labios?.integridad, 'labios.integridad')}
                           {renderOptionButtons("Comisuras labiales", comisurasOptions, formData.labios?.comisuras, 'labios.comisuras')}
                           {renderOptionButtons("Movimiento y función", movimientoOptions, formData.labios?.movimiento, 'labios.movimiento')}


                          {/* Otras observaciones Labios (lee de formData.labios.otrasObservaciones) */}
                          <div className="relative">
                              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Otras observaciones (Labios):</label>
                              <Textarea value={formData.labios?.otrasObservaciones || ''} onChange={e => handleTextChange('labios.otrasObservaciones', e.target.value)} /* ... */ className="min-h-[80px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500" />
                          </div>
                        </div>
                      ) : (
                        // Vista narrativa (sin cambios)
                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700"> <p /* ... */ >{lipsNarrativeContent || "..."}</p> </div>
                      )}
                  </div> {/* Fin Sección Labios */}

                </div> {/* Fin space-y-6 */}
              </div> /* Fin p-6 formulario */

            ) : ( /* Inicio Pestaña Redacción IA General */

              <div className="p-6">
                 {/* ... (Botón generar redacción general y Textarea igual que antes) ... */}
                <div className="flex justify-center mb-4">
                    <Button onClick={generateRedaccion} disabled={isGeneratingRedaccion} /* ... */ className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-2 px-5 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed">
                        {isGeneratingRedaccion ? <>{/* spinner */} Generando...</> : '✨ Generar Redacción General (ATM y Labios)'}
                    </Button>
                </div>
                <Textarea readOnly value={redaccionContent} placeholder="..." /* ... */ className="min-h-[250px] w-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-md p-4 border border-gray-200 dark:border-gray-700 whitespace-pre-wrap" />

                 {/* Botón Limpiar Todo (llama a la función interna resetForm) */}
                 <div className="mt-4 flex justify-end">
                    <button type="button" onClick={resetForm} className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors font-medium">
                        Limpiar Todo (ATM y Labios)
                    </button>
                </div>
              </div> /* Fin p-6 redacción general */
            )}
          </> /* Fin Fragment */
        )} {/* Fin !isMinimized */}
      </Card>
    </div>
  );
};

export default ArticulacionCraneomandibular; // Exporta el componente autocontenido