import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X, Edit, FileText } from "lucide-react"; // Importar iconos necesarios
import { FormDataState } from '@/types/historiaClinica';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button"; // Importar Button si se usa

interface ArticulacionCraneomandibularProps {
  formData: FormDataState;
  handleArticulacionCraneomandibularChange: (part: string, value: string | boolean | null) => void; // Permitir null para resetear opcionales
}

// Definir tipos para las opciones para mayor claridad
type Option = { label: string; value: string };

// Opciones para los campos de labios
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
  { label: "Rosados (Normal)", value: "normal" },
  { label: "Pálidos", value: "palidos" },
  { label: "Cianóticos", value: "cianoticos" },
  { label: "Eritematosos", value: "eritematosos" },
];
const hidratacionOptions: Option[] = [
  { label: "Hidratados", value: "hidratados" },
  { label: "Secos", value: "secos" },
  { label: "Agrietados", value: "agrietados" },
  { label: "Con Costras", value: "costras" },
];
const integridadOptions: Option[] = [
  { label: "Íntegros", value: "intactos" },
  { label: "Heridas", value: "heridas" },
  { label: "Ulceraciones", value: "ulceraciones" },
  { label: "Fisuras Comisurales", value: "fisuras" },
];
const comisurasOptions: Option[] = [
  { label: "Normales", value: "normales" },
  { label: "Erosionadas", value: "erosionadas" },
  { label: "Queilitis Angular", value: "queilitis" },
];
const movimientoOptions: Option[] = [
  { label: "Normales", value: "normales" },
  { label: "Restricción Movimiento", value: "restriccion" },
  { label: "Incompetencia Labial", value: "incompetencia" },
];

const patronAberturaOptions: Option[] = [
  { label: "Recto", value: "recto" },
  { label: "Desviación Derecha", value: "desviacionDerecha" },
  { label: "Desviación Izquierda", value: "desviacionIzquierda" },
  { label: "Forma de 'S'", value: "formaS" },
  { label: "Otro", value: "otro" }
];

const ruidoArticularOptions: Option[] = [
  { label: "Abertura", value: "abertura" },
  { label: "Cierre", value: "cierre" },
  { label: "No", value: "ninguno" }, // Nueva opción
];


const ArticulacionCraneomandibular: React.FC<ArticulacionCraneomandibularProps> = ({
  formData,
  handleArticulacionCraneomandibularChange
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState('formulario');
  const [redaccionContent, setRedaccionContent] = useState(''); // Para la pestaña general "Redacción IA"
  const [isGeneratingRedaccion, setIsGeneratingRedaccion] = useState(false); // Para la pestaña general

  // --- Nuevos estados para la redacción integrada de labios ---
  const [lipsViewMode, setLipsViewMode] = useState<'form' | 'narrative'>('form');
  const [lipsNarrativeContent, setLipsNarrativeContent] = useState('');
  const [isGeneratingLipsNarrative, setIsGeneratingLipsNarrative] = useState(false);
  // -----------------------------------------------------------

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    setIsMaximized(false);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    setIsMinimized(false);
  };

  const handleClose = () => {
    // Idealmente, esto debería des montar el componente o señalar al padre que se cierre
    // Por ahora, solo lo minimiza y resetea maximización
    setIsMinimized(true);
    setIsMaximized(false);
    console.log("Cerrar presionado - Implementar lógica de cierre si es necesario");
  };

  // Asegura que exista la estructura para labios al montar
  useEffect(() => {
    if (!formData.articulacionCraneomandibular.labios) {
      handleArticulacionCraneomandibularChange('labios', {}); // Inicializa el objeto labios si no existe
    }
  }, [formData.articulacionCraneomandibular.labios, handleArticulacionCraneomandibularChange]);


  // Función genérica para manejar selección de opciones (botones)
  const handleOptionChange = (fieldPath: string, value: string) => {
    handleArticulacionCraneomandibularChange(fieldPath, value);
  };

   // Función genérica para manejar cambios en Textarea
  const handleTextChange = (fieldPath: string, value: string) => {
    handleArticulacionCraneomandibularChange(fieldPath, value);
  };

  // Función para manejar botones Sí/No (boolean)
  const handleBooleanChange = (fieldPath: string, value: boolean) => {
    handleArticulacionCraneomandibularChange(fieldPath, value);
  };

  // --- Función para generar SOLO la redacción de labios ---
  const generateLipsNarrative = () => {
    setIsGeneratingLipsNarrative(true);
    setTimeout(() => { // Simular async
      let content = "Al examen clínico se observan ";
      const labios = formData.articulacionCraneomandibular.labios || {};

      const simetriaDesc = simetriaOptions.find(o => o.value === labios.simetria)?.label || 'simetría no evaluada';
      content += `labios ${simetriaDesc.toLowerCase()}. `;

      const volumenDesc = volumenOptions.find(o => o.value === labios.volumen)?.label || 'volumen no evaluado';
      content += `Son ${volumenDesc.toLowerCase()}, `;

      const coloracionDesc = coloracionOptions.find(o => o.value === labios.coloracion)?.label || 'coloración no evaluada';
      content += `con coloración ${coloracionDesc.toLowerCase()}. `;

      const hidratacionDesc = hidratacionOptions.find(o => o.value === labios.hidratacion)?.label || 'hidratación no evaluada';
      content += `La superficie presenta ${hidratacionDesc.toLowerCase()}. `;

      const integridadDesc = integridadOptions.find(o => o.value === labios.integridad)?.label || 'integridad no evaluada';
      content += `Se observan ${integridadDesc.toLowerCase()}. `;

      const comisurasDesc = comisurasOptions.find(o => o.value === labios.comisuras)?.label || 'comisuras no evaluadas';
      content += `Las comisuras labiales son ${comisurasDesc.toLowerCase()}. `;

      const movimientoDesc = movimientoOptions.find(o => o.value === labios.movimiento)?.label || 'movimiento no evaluado';
      content += `El movimiento y función muestra ${movimientoDesc.toLowerCase()}. `;

      if (labios.otrasObservaciones) {
        content += `Observaciones adicionales: ${labios.otrasObservaciones}.`;
      }

      setLipsNarrativeContent(content.trim());
      setIsGeneratingLipsNarrative(false);
      setLipsViewMode('narrative'); // Cambiar a la vista de narrativa de labios
    }, 500); // Simulación más corta para la parte de labios
  };
  // -----------------------------------------------------------


  // --- Función para generar la redacción COMPLETA (ATM + Labios) ---
  // (Actualizada para manejar ruidoArticular 'ninguno')
  const generateRedaccion = () => {
    setIsGeneratingRedaccion(true);
    setTimeout(() => {
      let fullContent = ""; // Empezar vacío
      const atm = formData.articulacionCraneomandibular;
      const labios = atm.labios || {};

      // --- Sección Labios (similar a generateLipsNarrative) ---
      let lipsContent = "Labios: ";
      const simetriaDesc = simetriaOptions.find(o => o.value === labios.simetria)?.label || '';
      const volumenDesc = volumenOptions.find(o => o.value === labios.volumen)?.label || '';
      const coloracionDesc = coloracionOptions.find(o => o.value === labios.coloracion)?.label || '';
      const hidratacionDesc = hidratacionOptions.find(o => o.value === labios.hidratacion)?.label || '';
      const integridadDesc = integridadOptions.find(o => o.value === labios.integridad)?.label || '';
      const comisurasDesc = comisurasOptions.find(o => o.value === labios.comisuras)?.label || '';
      const movimientoDesc = movimientoOptions.find(o => o.value === labios.movimiento)?.label || '';

      const lipsDetails = [
        simetriaDesc && `Simetría: ${simetriaDesc}`,
        volumenDesc && `Volumen: ${volumenDesc}`,
        coloracionDesc && `Coloración: ${coloracionDesc}`,
        hidratacionDesc && `Superficie: ${hidratacionDesc}`,
        integridadDesc && `Integridad: ${integridadDesc}`,
        comisurasDesc && `Comisuras: ${comisurasDesc}`,
        movimientoDesc && `Movimiento: ${movimientoDesc}`,
        labios.otrasObservaciones && `Observaciones: ${labios.otrasObservaciones}`
      ].filter(Boolean).join('. '); // Filtra vacíos y une con punto y espacio

      if (lipsDetails) {
        lipsContent += lipsDetails + ".";
      } else {
        lipsContent += "No se registraron detalles específicos de los labios.";
      }
      fullContent += lipsContent;

      // --- Sección ATM ---
      let atmContent = "\n\nArticulación Craneomandibular: ";
      let atmDetails = [];

      if (atm.dolorMasticarHablar === true) {
        let dolorInfo = "Refiere dolor al masticar/hablar";
        if (atm.tipoDolor) dolorInfo += ` (Tipo: ${atm.tipoDolor})`;
        if (atm.duracionDolor) dolorInfo += ` (Duración: ${atm.duracionDolor})`;
        atmDetails.push(dolorInfo);
      } else if (atm.dolorMasticarHablar === false) {
        atmDetails.push("No refiere dolor al masticar/hablar");
      }

      if (atm.dolorEspecifico === true && atm.motivoDolor) {
        atmDetails.push(`Refiere dolor específico (Motivo: ${atm.motivoDolor})`);
      } else if (atm.dolorEspecifico === false) {
         // Podrías añadir "No refiere dolor específico" si quieres ser explícito
      }

      // Actualizado para 'ninguno'
      if (atm.ruidoArticular && atm.ruidoArticular !== 'ninguno') {
        const ruidoLabel = ruidoArticularOptions.find(o => o.value === atm.ruidoArticular)?.label || atm.ruidoArticular;
        atmDetails.push(`Ruido articular: ${ruidoLabel}`);
      } else if (atm.ruidoArticular === 'ninguno') {
          atmDetails.push("No se reporta ruido articular");
      }

      if (atm.patronAbertura) {
         let patronDesc = patronAberturaOptions.find(o => o.value === atm.patronAbertura)?.label || atm.patronAbertura;
         if (atm.patronAbertura === 'otro' && atm.otroPatronAbertura) {
           patronDesc += `: ${atm.otroPatronAbertura}`;
         }
         atmDetails.push(`Patrón de abertura: ${patronDesc}`);
      }

       if (atm.otrasObservaciones) {
         atmDetails.push(`Observaciones ATM: ${atm.otrasObservaciones}`);
       }

      if (atmDetails.length > 0) {
        atmContent += atmDetails.join('. ') + ".";
      } else {
        atmContent += "No se registraron detalles específicos de la ATM.";
      }
       fullContent += atmContent;

      setRedaccionContent(fullContent.trim());
      setIsGeneratingRedaccion(false);
      setActiveTab('redaccion'); // Cambia a la pestaña principal de redacción
    }, 1000);
  };
  // -----------------------------------------------------------

  const resetForm = () => {
    // Reset labios fields
    handleArticulacionCraneomandibularChange('labios.simetria', null); // Usa null o '' para indicar "no seleccionado"
    handleArticulacionCraneomandibularChange('labios.volumen', null);
    handleArticulacionCraneomandibularChange('labios.coloracion', null);
    handleArticulacionCraneomandibularChange('labios.hidratacion', null);
    handleArticulacionCraneomandibularChange('labios.integridad', null);
    handleArticulacionCraneomandibularChange('labios.comisuras', null);
    handleArticulacionCraneomandibularChange('labios.movimiento', null);
    handleArticulacionCraneomandibularChange('labios.otrasObservaciones', '');

    // Reset main fields
    handleArticulacionCraneomandibularChange('dolorMasticarHablar', null); // Usa null para indeterminado o false si quieres default 'No'
    handleArticulacionCraneomandibularChange('tipoDolor', '');
    handleArticulacionCraneomandibularChange('duracionDolor', '');
    handleArticulacionCraneomandibularChange('dolorEspecifico', null);
    handleArticulacionCraneomandibularChange('motivoDolor', '');
    handleArticulacionCraneomandibularChange('ruidoArticular', null);
    handleArticulacionCraneomandibularChange('patronAbertura', null);
    handleArticulacionCraneomandibularChange('otroPatronAbertura', '');
    handleArticulacionCraneomandibularChange('otrasObservaciones', '');

    // Resetear vista de labios y contenido
    setLipsViewMode('form');
    setLipsNarrativeContent('');

    setActiveTab('formulario'); // Vuelve a la pestaña formulario
    setRedaccionContent(''); // Limpia también la redacción general
  };

   // Helper para renderizar grupos de botones de opción
  const renderOptionButtons = (
      title: string,
      options: Option[],
      currentValue: string | undefined | null,
      fieldPath: string
  ) => (
      <div>
          <h4 className="text-md font-medium mb-2">{title}:</h4>
          <div className="flex flex-wrap gap-2 mb-4">
              {options.map(item => (
                  <button
                      key={item.value}
                      type="button" // Evitar submit si está dentro de un <form>
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                          currentValue === item.value
                              ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                              : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                      }`}
                      onClick={() => handleOptionChange(fieldPath, item.value)}
                  >
                      {item.label}
                  </button>
              ))}
          </div>
      </div>
  );


  return (
    // Clases para maximizar/minimizar (sin cambios)
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : "my-4"}`} data-section-name="articulacionCraneomandibular">
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""} ${isMinimized ? "h-16 overflow-hidden" : ""}`}>
        {/* Header con Tabs y Controles (sin cambios funcionales mayores) */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
             <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
               <button
                 className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${activeTab === 'formulario' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300'}`}
                 onClick={() => setActiveTab('formulario')}
               >
                 Formulario
               </button>
               <button
                 className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${activeTab === 'redaccion' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300'}`}
                 onClick={() => setActiveTab('redaccion')}
               >
                 Redacción IA (General)
               </button>
             </div>
           </div>
           <div className="flex items-center gap-2">
             <button onClick={handleMinimize} title={isMinimized ? "Restaurar" : "Minimizar"} className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors">
               <Minus className="w-4 h-4" />
             </button>
             <button onClick={handleMaximize} title={isMaximized ? "Restaurar" : "Maximizar"} className="p-1 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors">
               <Maximize2 className="w-4 h-4" />
             </button>
             {/* El botón cerrar podría necesitar lógica adicional dependiendo de la app */}
             {/* <button onClick={handleClose} title="Cerrar" className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
               <X className="w-4 h-4" />
             </button> */}
          </div>
        </div>

         {/* Título Principal */}
         <div className={`flex justify-start px-6 py-2 ${isMinimized ? 'hidden' : ''}`}>
           <h2 className="text-xl font-semibold flex items-center gap-2">
             <span className="text-gray-400">XI.</span> ARTICULACIÓN CRANEOMANDIBULAR Y LABIOS
           </h2>
         </div>

         {/* Contenido Principal (se oculta si está minimizado) */}
         {!isMinimized && (
           <>
             {activeTab === 'formulario' ? (
               <div className="p-6">
                 <div className="space-y-6">
                   {/* --- Sección Articulación Craneomandibular --- */}
                   <h3 className="text-lg font-semibold mb-4 border-b pb-2">Articulación Craneomandibular</h3>

                   {/* Dolor al masticar */}
                   <div>
                     <h4 className="text-md font-medium mb-2">¿Dolor al masticar o al hablar?</h4>
                     <div className="flex gap-4">
                       <button
                         type="button"
                         className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.dolorMasticarHablar === true ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                         onClick={() => handleBooleanChange('dolorMasticarHablar', true)}
                       >
                         Sí
                       </button>
                       <button
                          type="button"
                         className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.dolorMasticarHablar === false ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                         onClick={() => handleBooleanChange('dolorMasticarHablar', false)}
                       >
                         No
                       </button>
                     </div>
                   </div>

                   {formData.articulacionCraneomandibular?.dolorMasticarHablar === true && (
                     <>
                       <div className="relative pl-4 border-l-2 border-emerald-200">
                         <label className="block text-sm font-medium mb-1">Tipo de dolor:</label>
                         <Textarea
                           value={formData.articulacionCraneomandibular?.tipoDolor || ''}
                           onChange={e => handleTextChange('tipoDolor', e.target.value)}
                           placeholder="Describa el tipo de dolor (ej. punzante, sordo)"
                           className="min-h-[60px]" // Reducir altura un poco
                         />
                       </div>
                       <div className="relative pl-4 border-l-2 border-emerald-200">
                         <label className="block text-sm font-medium mb-1">Duración:</label>
                         <Textarea
                           value={formData.articulacionCraneomandibular?.duracionDolor || ''}
                           onChange={e => handleTextChange('duracionDolor', e.target.value)}
                           placeholder="Describa la duración (ej. constante, intermitente)"
                           className="min-h-[60px]"
                         />
                       </div>
                     </>
                   )}

                    {/* Dolor específico */}
                   <div>
                     <h4 className="text-md font-medium mb-2">¿Dolor específico en alguna zona?</h4>
                     <div className="flex gap-4">
                       <button
                         type="button"
                         className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.dolorEspecifico === true ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                         onClick={() => handleBooleanChange('dolorEspecifico', true)}
                       >
                         Sí
                       </button>
                       <button
                         type="button"
                         className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.dolorEspecifico === false ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                         onClick={() => handleBooleanChange('dolorEspecifico', false)}
                       >
                         No
                       </button>
                     </div>
                   </div>

                    {formData.articulacionCraneomandibular?.dolorEspecifico === true && (
                     <div className="relative pl-4 border-l-2 border-emerald-200">
                       <label className="block text-sm font-medium mb-1">Motivo/Zona del dolor:</label>
                       <Textarea
                         value={formData.articulacionCraneomandibular?.motivoDolor || ''}
                         onChange={e => handleTextChange('motivoDolor', e.target.value)}
                         placeholder="Describa la zona o motivo (ej. preauricular, muscular)"
                         className="min-h-[60px]"
                       />
                     </div>
                   )}

                    {/* Ruido Articular - Actualizado con "No" */}
                   {renderOptionButtons(
                       "Ruido articular",
                       ruidoArticularOptions,
                       formData.articulacionCraneomandibular?.ruidoArticular,
                       'ruidoArticular'
                   )}

                   {/* Patrón de abertura mandibular */}
                   {renderOptionButtons(
                       "Patrón de abertura mandibular",
                       patronAberturaOptions,
                       formData.articulacionCraneomandibular?.patronAbertura,
                       'patronAbertura'
                   )}

                   {formData.articulacionCraneomandibular?.patronAbertura === 'otro' && (
                     <div className="relative pl-4 border-l-2 border-emerald-200">
                       <label className="block text-sm font-medium mb-1">Especifique otro patrón:</label>
                       <Textarea
                         value={formData.articulacionCraneomandibular?.otroPatronAbertura || ''}
                         onChange={e => handleTextChange('otroPatronAbertura', e.target.value)}
                         placeholder="Especifique el patrón observado"
                          className="min-h-[60px]"
                       />
                     </div>
                   )}

                   {/* Otras observaciones ATM */}
                   <div className="relative">
                     <label className="block text-sm font-medium mb-1">Otras observaciones (ATM):</label>
                     <Textarea
                       value={formData.articulacionCraneomandibular?.otrasObservaciones || ''}
                       onChange={e => handleTextChange('otrasObservaciones', e.target.value)}
                       placeholder="Anote aquí cualquier otra observación relevante sobre la ATM"
                       className="min-h-[80px]"
                     />
                   </div>


                   {/* --- Sección Labios --- */}
                   <div className="mt-8 border-t pt-6">
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">Labios</h3>
                          {/* Botones para cambiar entre formulario y redacción de labios */}
                          {lipsViewMode === 'form' ? (
                              <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={generateLipsNarrative}
                                  disabled={isGeneratingLipsNarrative}
                                  className="flex items-center gap-1"
                              >
                                  {isGeneratingLipsNarrative ? (
                                     <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                     </svg>
                                  ) : (
                                      <FileText className="w-4 h-4" />
                                  )}
                                  Generar Redacción Labios
                              </Button>
                          ) : (
                               <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setLipsViewMode('form')}
                                  className="flex items-center gap-1"
                              >
                                  <Edit className="w-4 h-4" />
                                  Editar Labios
                              </Button>
                          )}
                      </div>

                      {/* Contenido condicional: Formulario o Narrativa */}
                      {lipsViewMode === 'form' ? (
                          <div className="space-y-4">
                              {/* Simetría */}
                              {renderOptionButtons(
                                  "Simetría",
                                  simetriaOptions,
                                  formData.articulacionCraneomandibular?.labios?.simetria,
                                  'labios.simetria'
                              )}

                              {/* Tamaño/Volumen */}
                              {renderOptionButtons(
                                  "Tamaño/Volumen",
                                  volumenOptions,
                                  formData.articulacionCraneomandibular?.labios?.volumen,
                                  'labios.volumen'
                              )}

                              {/* Coloración */}
                               {renderOptionButtons(
                                  "Coloración",
                                  coloracionOptions,
                                  formData.articulacionCraneomandibular?.labios?.coloracion,
                                  'labios.coloracion'
                              )}

                              {/* Hidratación/Superficie */}
                              {renderOptionButtons(
                                  "Hidratación/Superficie",
                                  hidratacionOptions,
                                  formData.articulacionCraneomandibular?.labios?.hidratacion,
                                  'labios.hidratacion'
                              )}

                               {/* Integridad */}
                               {renderOptionButtons(
                                  "Integridad",
                                  integridadOptions,
                                  formData.articulacionCraneomandibular?.labios?.integridad,
                                  'labios.integridad'
                              )}

                              {/* Comisuras labiales */}
                              {renderOptionButtons(
                                  "Comisuras labiales",
                                  comisurasOptions,
                                  formData.articulacionCraneomandibular?.labios?.comisuras,
                                  'labios.comisuras'
                              )}

                              {/* Movimiento y función */}
                              {renderOptionButtons(
                                  "Movimiento y función",
                                  movimientoOptions,
                                  formData.articulacionCraneomandibular?.labios?.movimiento,
                                  'labios.movimiento'
                              )}

                              {/* Otras observaciones Labios */}
                              <div className="relative">
                                  <label className="block text-sm font-medium mb-1">Otras observaciones (Labios):</label>
                                  <Textarea
                                      value={formData.articulacionCraneomandibular?.labios?.otrasObservaciones || ''}
                                      onChange={e => handleTextChange('labios.otrasObservaciones', e.target.value)}
                                      placeholder="Observaciones adicionales sobre los labios"
                                      className="min-h-[80px]"
                                  />
                              </div>
                          </div>
                      ) : (
                          // Vista de la narrativa de labios
                          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
                              <p className="text-sm whitespace-pre-wrap">{lipsNarrativeContent || "No se ha generado la redacción para los labios."}</p>
                          </div>
                      )}
                   </div> {/* Fin Sección Labios */}

                 </div> {/* Fin space-y-6 */}
               </div> /* Fin p-6 formulario */

             ) : ( /* Inicio Pestaña Redacción IA General */

               <div className="p-6">
                  <div className="flex justify-center mb-4">
                     <Button // Usando el componente Button si está disponible/importado
                       onClick={generateRedaccion}
                       disabled={isGeneratingRedaccion}
                      //  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       {isGeneratingRedaccion ? (
                         <>
                           <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                           Generando...
                         </>
                       ) : (
                         '✨ Generar Redacción General'
                       )}
                     </Button>
                  </div>
                 <Textarea
                   readOnly
                   value={redaccionContent}
                   placeholder="La redacción general (ATM y Labios) aparecerá aquí..."
                   className="min-h-[250px] w-full bg-gray-50 dark:bg-gray-700 rounded-md p-4 border border-gray-200 dark:border-gray-600 whitespace-pre-wrap" // whitespace-pre-wrap para respetar saltos de línea
                 />
                 <div className="mt-4 flex justify-end">
                    <button
                        type="button"
                        onClick={resetForm}
                        className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    >
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

export default ArticulacionCraneomandibular;