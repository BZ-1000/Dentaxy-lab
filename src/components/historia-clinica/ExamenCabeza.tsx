import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X, Mic, Edit, FileText } from "lucide-react";
import { FormDataState, ExamenCabezaState } from '@/types/historiaClinica'; // Asegúrate que ExamenCabezaState esté actualizado
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from "@/components/ui/input"; // Necesario para campos de texto como localización
import { VoiceInput } from '@/components/ui/voice-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from "@/components/ui/button";

// 1. ACTUALIZA ExamenCabezaState en '@/types/historiaClinica.ts'
//    Debe incluir todas las subopciones como se definió en el pensamiento anterior.
//    Ejemplo Parcial:
/*
interface CaracteristicaDetallada {
  presente?: boolean | null;
  // Lunares
  tamano?: 'Pequeño' | 'Mediano' | 'Grande' | '';
  color?: 'Marrón claro' | 'Marrón oscuro' | 'Negro' | '';
  bordes?: 'Regulares' | 'Irregulares' | '';
  localizacion?: string;
  elevacion?: 'Plano' | 'Elevado' | '';
  // Cicatrices
  tipoCicatriz?: 'Quirúrgica' | 'Traumática' | 'Acneica' | 'Queloide' | '';
  antiguedad?: 'Nueva' | 'Antigua' | '';
  // localizacion: string; // Reusar o definir específico
  tamanoCicatriz?: 'Pequeña' | 'Mediana' | 'Grande' | '';
  coloracion?: 'Hipopigmentada' | 'Hiperpigmentada' | 'Normal' | '';
  // Asimetrias
  zonaAfectada?: 'Mandíbula' | 'Mejillas' | 'Ojos' | 'Nariz' | 'Frente' | '';
  grado?: 'Leve' | 'Moderado' | 'Severo' | '';
  posibleCausa?: string; // Incluye Congénita, Traumática, Muscular, Otra (texto)
  // Edema
  // localizacion: string; // Reusar o definir específico
  tipoEdema?: 'Localizado' | 'Difuso' | '';
  dolor?: 'Presente' | 'Ausente' | '';
  consistencia?: 'Blando' | 'Duro' | '';
}

interface ExamenCabezaState {
  // ... tipoCraneo, tipoPerfil
  tez?: 'clara' | 'morena' | 'oscura' | '' | null;
  estadoPiel?: 'reseca' | 'humectada' | '' | null;
  lunares?: CaracteristicaDetallada;
  cicatrices?: CaracteristicaDetallada;
  asimetriasFaciales?: CaracteristicaDetallada;
  edema?: CaracteristicaDetallada;
  otrosHallazgos?: string;
}
*/

interface ExamenCabezaProps {
  formData: FormDataState;
  handleExamenCabezaChange: (part: string, value: string | boolean | null) => void;
}

const ExamenCabeza: React.FC<ExamenCabezaProps> = ({
  formData,
  handleExamenCabezaChange
}) => {
  // --- Estados (sin cambios) ---
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [selectedCraneoTipo, setSelectedCraneoTipo] = useState<string>(formData.examenCabeza?.tipoCraneo || '');
  const [selectedPerfilTipo, setSelectedPerfilTipo] = useState<string>(formData.examenCabeza?.tipoPerfil || '');
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [caraViewMode, setCaraViewMode] = useState<'form' | 'narrative'>('form');
  const [isGeneratingCaraNarrative, setIsGeneratingCaraNarrative] = useState(false);
  const [targetCaraNarrative, setTargetCaraNarrative] = useState('');
  const [displayedCaraNarrative, setDisplayedCaraNarrative] = useState('');
  const caraIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typewriterSpeed = 35;

  // --- Funciones y Hooks (sin cambios en la lógica base, solo en generateCaraNarrative) ---
  const clearCaraInterval = useCallback(() => { /* ... */ }, []);
  useEffect(() => { /* ... */ }, [targetCaraNarrative, isGeneratingCaraNarrative, clearCaraInterval]);
  const handleMinimize = () => { /* ... */ };
  const handleMaximize = () => { /* ... */ };
  const handleClose = () => { /* ... */ };
  const handleVoiceTranscription = (text: string) => { /* ... */ };
  const toggleVoiceInput = () => { /* ... */ };

  // --- **NUEVA Lógica de Generación de Narrativa para Cara** ---
  const generateCaraNarrative = useCallback(() => {
    setIsGeneratingCaraNarrative(true);
    clearCaraInterval();
    setTargetCaraNarrative('');

    const data = formData.examenCabeza || {};
    let sentences: string[] = [];

    // 1. Tez y Estado Piel (si están definidos)
    let initialDescription = "";
    if (data.tez) {
        initialDescription += `El paciente presenta tez ${data.tez}`;
    }
    if (data.estadoPiel) {
        if (initialDescription) initialDescription += " y "; else initialDescription = "El paciente presenta ";
        initialDescription += `piel de aspecto ${data.estadoPiel}`;
    }
     if (initialDescription) {
        sentences.push(initialDescription.trim() + ".");
     } else {
        sentences.push("Evaluación inicial de tez y estado de piel no especificada."); // O omitir si se prefiere
     }


    // 2. Características Detalladas
    let characteristicSentences: string[] = [];

    // Lunares
    if (data.lunares?.presente === false) {
      characteristicSentences.push("No se evidencian lunares clínicamente significativos.");
    } else if (data.lunares?.presente === true) {
      let desc = "Presencia de lunares";
      const details: string[] = [];
      if (data.lunares.tamano) details.push(`tamaño ${data.lunares.tamano.toLowerCase()}`);
      if (data.lunares.color) details.push(`color ${data.lunares.color.toLowerCase()}`);
      if (data.lunares.bordes) details.push(`bordes ${data.lunares.bordes.toLowerCase()}`);
      if (data.lunares.elevacion) details.push(data.lunares.elevacion.toLowerCase() === 'plano' ? 'planos' : 'elevados');
      if (data.lunares.localizacion) details.push(`localizados en ${data.lunares.localizacion.trim()}`);
      if (details.length > 0) {
        desc += ` con características: ${details.join(', ')}.`;
      } else {
        desc += " sin detalles específicos registrados.";
      }
       characteristicSentences.push(desc);
    }

    // Cicatrices
    if (data.cicatrices?.presente === false) {
       characteristicSentences.push("No se observan cicatrices.");
    } else if (data.cicatrices?.presente === true) {
      let desc = "Se identifican cicatrices";
      const details: string[] = [];
       if (data.cicatrices.tipoCicatriz) details.push(`tipo ${data.cicatrices.tipoCicatriz.toLowerCase()}`);
       if (data.cicatrices.tamanoCicatriz) details.push(`tamaño ${data.cicatrices.tamanoCicatriz.toLowerCase()}`);
       if (data.cicatrices.coloracion) details.push(`coloración ${data.cicatrices.coloracion.toLowerCase()}`);
       if (data.cicatrices.antiguedad) details.push(`antigüedad ${data.cicatrices.antiguedad.toLowerCase()}`);
       if (data.cicatrices.localizacion) details.push(`localizadas en ${data.cicatrices.localizacion.trim()}`);
      if (details.length > 0) {
        desc += ` con las siguientes características: ${details.join(', ')}.`;
      } else {
        desc += " sin detalles específicos registrados.";
      }
       characteristicSentences.push(desc);
    }

    // Asimetrías Faciales
    if (data.asimetriasFaciales?.presente === false) {
       characteristicSentences.push("No se aprecian asimetrías faciales evidentes.");
    } else if (data.asimetriasFaciales?.presente === true) {
      let desc = "Se evidencia asimetría facial";
      const details: string[] = [];
      if (data.asimetriasFaciales.grado) details.push(`grado ${data.asimetriasFaciales.grado.toLowerCase()}`);
      if (data.asimetriasFaciales.zonaAfectada) details.push(`afectando la zona de ${data.asimetriasFaciales.zonaAfectada.toLowerCase()}`);
      if (data.asimetriasFaciales.posibleCausa) details.push(`de posible causa ${data.asimetriasFaciales.posibleCausa.trim()}`);
       if (details.length > 0) {
        desc += `: ${details.join(', ')}.`;
      } else {
        desc += " sin detalles específicos registrados.";
      }
      characteristicSentences.push(desc);
    }

    // Edema
    if (data.edema?.presente === false) {
       characteristicSentences.push("Ausencia de edema facial.");
    } else if (data.edema?.presente === true) {
      let desc = "Presencia de edema facial";
      const details: string[] = [];
      if (data.edema.tipoEdema) details.push(`${data.edema.tipoEdema.toLowerCase()}`);
      if (data.edema.consistencia) details.push(`consistencia ${data.edema.consistencia.toLowerCase()}`);
      if (data.edema.dolor) details.push(data.edema.dolor === 'Presente' ? 'doloroso a la palpación' : 'no doloroso');
       if (data.edema.localizacion) details.push(`localizado en ${data.edema.localizacion.trim()}`);
      if (details.length > 0) {
        desc += `: ${details.join(', ')}.`;
      } else {
        desc += " sin detalles específicos registrados.";
      }
       characteristicSentences.push(desc);
    }

    // Combinar frases iniciales y de características
    sentences = [...sentences, ...characteristicSentences];

    // 3. Otros Hallazgos
    let finalText = sentences.filter(s => s && s.trim() !== '.').join(' '); // Une las frases con espacios

    if (data.otrosHallazgos && data.otrosHallazgos.trim() !== '') {
      const observaciones = `Otros hallazgos relevantes: ${data.otrosHallazgos.trim()}`;
      if (finalText) {
        finalText += " " + observaciones;
      } else {
        finalText = observaciones; // Si no había nada más
      }
    }

    if (!finalText) {
        finalText = "No se realizaron observaciones específicas sobre la cara.";
    }

    setTargetCaraNarrative(finalText.trim());
    setCaraViewMode('narrative');

  }, [formData.examenCabeza, clearCaraInterval]);


  // --- Datos Constantes (sin cambios) ---
  const craneosTypes = [ /* ... */ ];
  const perfilesTypes = [ /* ... */ ];
  const caracteristicasFacialesIds: (keyof ExamenCabezaState)[] = ['lunares', 'cicatrices', 'asimetriasFaciales', 'edema']; // Para iterar más fácil
  const caracteristicasLabels = { // Mapeo para labels
      lunares: 'Lunares',
      cicatrices: 'Cicatrices',
      asimetriasFaciales: 'Asimetrías Faciales',
      edema: 'Edema'
  };


  // --- useEffects para actualizar estado local (sin cambios) ---
  useEffect(() => { setSelectedCraneoTipo(formData.examenCabeza?.tipoCraneo || ''); }, [formData.examenCabeza?.tipoCraneo]);
  useEffect(() => { setSelectedPerfilTipo(formData.examenCabeza?.tipoPerfil || ''); }, [formData.examenCabeza?.tipoPerfil]);

  // --- Helper para renderizar Selects de subopciones ---
  const renderSelectSubOption = (
      characteristicId: keyof ExamenCabezaState,
      subOptionKey: string, // Clave dentro del objeto de la característica (e.g., 'tamano')
      label: string,
      placeholder: string,
      options: string[]
  ) => {
      // Asegurarse que el objeto de la característica exista antes de acceder a la subopción
      const characteristicData = formData.examenCabeza?.[characteristicId] as any; // Usar 'any' con cuidado o definir mejor tipo
      const currentValue = characteristicData?.[subOptionKey] || '';

      return (
          <div className="space-y-1">
              <Label htmlFor={`${characteristicId}-${subOptionKey}`} className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</Label>
              <Select
                  value={currentValue}
                  onValueChange={(value) => handleExamenCabezaChange(`${characteristicId}.${subOptionKey}`, value === 'none' ? null : value)}
              >
                  <SelectTrigger id={`${characteristicId}-${subOptionKey}`} className="w-full bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm text-sm h-9"> {/* Altura reducida */}
                      <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="none">-- {placeholder} --</SelectItem>
                      {options.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                  </SelectContent>
              </Select>
          </div>
      );
  };
   // --- Helper para renderizar Inputs de subopciones ---
   const renderInputSubOption = (
       characteristicId: keyof ExamenCabezaState,
       subOptionKey: string,
       label: string,
       placeholder: string,
       isTextArea: boolean = false
   ) => {
       const characteristicData = formData.examenCabeza?.[characteristicId] as any;
       const currentValue = characteristicData?.[subOptionKey] || '';
       const InputComponent = isTextArea ? Textarea : Input;

       return (
           <div className="space-y-1">
               <Label htmlFor={`${characteristicId}-${subOptionKey}`} className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</Label>
               <InputComponent
                   id={`${characteristicId}-${subOptionKey}`}
                   placeholder={placeholder}
                   value={currentValue}
                   onChange={(e) => handleExamenCabezaChange(`${characteristicId}.${subOptionKey}`, e.target.value)}
                   className="w-full bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm text-sm h-9" // Estilo consistente
                   rows={isTextArea ? 2 : undefined} // Para Textarea
               />
           </div>
       );
   };


  // --- JSX del Componente ---
  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : "my-4"}`} data-section-name="examenCabeza">
      <Card className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col ${isMaximized ? "h-[calc(100vh-2rem)]" : ""} ${isMinimized ? "h-16 overflow-hidden" : ""}`}>
        {/* Header (Sin Cambios) */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-10 flex-shrink-0">
            <div className="flex-1 flex justify-center"><div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1"><button className={`px-4 py-1.5 rounded-full transition-all duration-300 text-sm font-medium bg-blue-600 text-white shadow-md`}>Formulario</button></div></div>
            <div className="flex items-center gap-2 pl-2">
                <button onClick={handleMinimize} title={isMinimized ? "Restaurar" : "Minimizar"} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"><Minus className="w-4 h-4 text-gray-700 dark:text-gray-300" /></button>
                <button onClick={handleMaximize} title={isMaximized ? "Restaurar" : "Maximizar"} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"><Maximize2 className="w-4 h-4 text-gray-700 dark:text-gray-300" /></button>
            </div>
        </div>

        {/* Contenedor Scrollable */}
        <div className={`flex-grow overflow-y-auto ${isMinimized ? 'hidden' : ''}`}>
          {/* Título Principal (Sin Cambios) */}
           <div className="flex justify-start px-6 pt-4 pb-2"><h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white tracking-tight"><span className="text-blue-500 dark:text-blue-400 font-semibold">X.</span> EXAMEN DE CABEZA Y CARA</h2></div>

          <div className="p-6 space-y-8">
            {/* Secciones Cráneo y Perfil (Sin Cambios) */}
             <section> {/* Cráneo */} </section>
             <section> {/* Perfil */} </section>

            {/* --- Cara: Formulario / Narrativa --- */}
             <section>
                {/* Header sección Cara (Sin Cambios) */}
                 <div className="flex justify-between items-center mb-4 border-t border-gray-300 dark:border-gray-600 pt-6">
                     <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Cara</h3>
                     {/* Botón Toggle (Sin Cambios) */}
                      {caraViewMode === 'form' ? <Button variant="outline" size="sm" onClick={generateCaraNarrative} disabled={isGeneratingCaraNarrative} className={`...`}>{isGeneratingCaraNarrative ? <svg className="animate-spin..." /> : <FileText className="w-4 h-4" />} {isGeneratingCaraNarrative ? 'Generando...' : 'Redacción Cara'}</Button> : <Button variant="outline" size="sm" onClick={() => setCaraViewMode('form')} disabled={isGeneratingCaraNarrative} className="..."><Edit className="w-4 h-4" /> Editar</Button>}
                 </div>

                 {/* Contenido Condicional: Formulario o Narrativa */}
                 {caraViewMode === 'form' ? (
                     <div className="space-y-6">
                         {/* Tez y Estado Piel (Sin Cambios) */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* ... Tez y Estado Piel ... */} </div>

                          {/* Características con detalles opcionales (AHORA CON SUBOPCIONES) */}
                         <div className="space-y-6"> {/* Espacio entre características */}
                              {caracteristicasFacialesIds.map((characteristicId) => {
                                  // Verifica si el objeto de la característica existe y tiene 'presente'
                                  const isPresent = formData.examenCabeza?.[characteristicId]?.presente === true;

                                  return (
                                      <div key={characteristicId} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-800/30 shadow-sm">
                                          <div className="flex items-center justify-between mb-3">
                                               <Label className="text-md font-semibold text-gray-800 dark:text-gray-200">{caracteristicasLabels[characteristicId]}</Label>
                                               <Select
                                                  value={isPresent ? 'si' : (formData.examenCabeza?.[characteristicId]?.presente === false ? 'no' : 'none')} // Maneja null/undefined como 'none'
                                                  onValueChange={(value) => {
                                                      const newPresent = value === 'si' ? true : (value === 'no' ? false : null);
                                                      handleExamenCabezaChange(`${characteristicId}.presente`, newPresent);
                                                      // Aquí podrías añadir lógica para limpiar subopciones si newPresent es false o null
                                                  }}
                                              >
                                                  <SelectTrigger className="w-32 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm text-sm h-9">
                                                      <SelectValue placeholder="¿Presente?" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                       <SelectItem value="none">-- Seleccione --</SelectItem>
                                                      <SelectItem value="si">Sí</SelectItem>
                                                      <SelectItem value="no">No</SelectItem>
                                                  </SelectContent>
                                              </Select>
                                          </div>

                                         {/* Renderizar subopciones solo si 'presente' es true */}
                                          {isPresent && (
                                              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3 mt-2 border-t border-gray-200 dark:border-gray-700 pt-3">
                                                  {/* Subopciones específicas para cada característica */}
                                                  {characteristicId === 'lunares' && <>
                                                      {renderSelectSubOption(characteristicId, 'tamano', 'Tamaño', 'Tamaño...', ['Pequeño', 'Mediano', 'Grande'])}
                                                      {renderSelectSubOption(characteristicId, 'color', 'Color', 'Color...', ['Marrón claro', 'Marrón oscuro', 'Negro'])}
                                                      {renderSelectSubOption(characteristicId, 'bordes', 'Bordes', 'Bordes...', ['Regulares', 'Irregulares'])}
                                                      {renderSelectSubOption(characteristicId, 'elevacion', 'Elevación', 'Elevación...', ['Plano', 'Elevado'])}
                                                      {renderInputSubOption(characteristicId, 'localizacion', 'Localización', 'Ej: mejilla derecha', true)}
                                                  </>}
                                                  {characteristicId === 'cicatrices' && <>
                                                      {renderSelectSubOption(characteristicId, 'tipoCicatriz', 'Tipo', 'Tipo...', ['Quirúrgica', 'Traumática', 'Acneica', 'Queloide'])}
                                                      {renderSelectSubOption(characteristicId, 'tamanoCicatriz', 'Tamaño', 'Tamaño...', ['Pequeña', 'Mediana', 'Grande'])}
                                                      {renderSelectSubOption(characteristicId, 'coloracion', 'Coloración', 'Color...', ['Hipopigmentada', 'Hiperpigmentada', 'Normal'])}
                                                      {renderSelectSubOption(characteristicId, 'antiguedad', 'Antigüedad', 'Antigüedad...', ['Nueva', 'Antigua'])}
                                                     {renderInputSubOption(characteristicId, 'localizacion', 'Localización', 'Ej: frente', true)}
                                                  </>}
                                                 {characteristicId === 'asimetriasFaciales' && <>
                                                      {renderSelectSubOption(characteristicId, 'grado', 'Grado', 'Grado...', ['Leve', 'Moderado', 'Severo'])}
                                                      {renderSelectSubOption(characteristicId, 'zonaAfectada', 'Zona Afectada', 'Zona...', ['Mandíbula', 'Mejillas', 'Ojos', 'Nariz', 'Frente'])}
                                                      {renderInputSubOption(characteristicId, 'posibleCausa', 'Posible Causa', 'Ej: Congénita, Otra...', true)}
                                                  </>}
                                                  {characteristicId === 'edema' && <>
                                                      {renderSelectSubOption(characteristicId, 'tipoEdema', 'Tipo', 'Tipo...', ['Localizado', 'Difuso'])}
                                                      {renderSelectSubOption(characteristicId, 'consistencia', 'Consistencia', 'Consistencia...', ['Blando', 'Duro'])}
                                                      {renderSelectSubOption(characteristicId, 'dolor', 'Dolor', 'Dolor...', ['Presente', 'Ausente'])}
                                                      {renderInputSubOption(characteristicId, 'localizacion', 'Localización', 'Ej: Periorbitaria', true)}
                                                  </>}
                                              </div>
                                          )}
                                      </div>
                                  );
                              })}
                          </div>


                         {/* Otros hallazgos (Sin cambios) */}
                         <div className="space-y-1.5"> {/* ... Textarea y VoiceInput ... */} </div>
                     </div>
                 ) : (
                     // Vista de Narrativa Generada (Sin cambios en la estructura)
                      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 min-h-[120px] shadow-inner relative">
                         {/* Indicador de carga */}
                         {isGeneratingCaraNarrative && !caraIntervalRef.current && ( <div className="absolute inset-0 flex items-center justify-center ..."> <svg className="animate-spin..." /> </div> )}
                         <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                             {displayedCaraNarrative}
                             {isGeneratingCaraNarrative && caraIntervalRef.current && ( <span className="inline-block w-1 h-4 ..."></span> )}
                         </p>
                     </div>
                 )}
             </section>
          </div> {/* Fin p-6 */}
        </div> {/* Fin Contenedor Scrollable */}
      </Card>
    </div>
  );
};

export default ExamenCabeza;