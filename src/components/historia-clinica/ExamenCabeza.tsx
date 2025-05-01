
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X, Mic, Edit, FileText } from "lucide-react";
import { FormDataState, CaracteristicaFacial } from '@/types/historiaClinica';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { VoiceInput } from '@/components/ui/voice-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from "@/components/ui/button";

// Mapeo de frases para redacción dinámica de Cara
const caraNarrativePhrases: { 
  [key: string]: { 
    [value: string]: string 
  } | { 
    true: (details?: string) => string, 
    false: string 
  }
} = {
  tez: {
    clara: "El paciente presenta tez clara",
    morena: "El paciente presenta tez morena",
    oscura: "El paciente presenta tez oscura"
  },
  estadoPiel: {
    reseca: "piel de aspecto reseco",
    humectada: "piel adecuadamente humectada con buena turgencia"
  },
  lunares: {
    true: (details?: string) => `Se observan lunares${details ? `: ${details}` : ''}`,
    false: "No se evidencian lunares durante la evaluación clínica"
  },
  cicatrices: {
    true: (details?: string) => `Se observan cicatrices${details ? `: ${details}` : ''}`,
    false: "No se evidencian cicatrices durante la evaluación clínica"
  },
  asimetriasFaciales: {
    true: (details?: string) => `Presenta asimetría facial${details ? `: ${details}` : ''}`,
    false: "No se observan asimetrías faciales durante la evaluación"
  },
  edema: {
    true: (details?: string) => `Se evidencia edema${details ? `: ${details}` : ''}`,
    false: "No se observan signos de edema facial durante la evaluación"
  }
};

interface ExamenCabezaProps {
  formData: FormDataState;
  handleExamenCabezaChange: (part: string, value: string | boolean | null) => void;
}

const ExamenCabeza: React.FC<ExamenCabezaProps> = ({
  formData,
  handleExamenCabezaChange
}) => {
  // Estados UI existentes
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [selectedCraneoTipo, setSelectedCraneoTipo] = useState<string>(formData.examenCabeza?.tipoCraneo || '');
  const [selectedPerfilTipo, setSelectedPerfilTipo] = useState<string>(formData.examenCabeza?.tipoPerfil || '');
  const [showVoiceInput, setShowVoiceInput] = useState(false);

  // --- Estados para la Narrativa de Cara ---
  const [caraViewMode, setCaraViewMode] = useState<'form' | 'narrative'>('form');
  const [isGeneratingCaraNarrative, setIsGeneratingCaraNarrative] = useState(false);
  const [targetCaraNarrative, setTargetCaraNarrative] = useState('');
  const [displayedCaraNarrative, setDisplayedCaraNarrative] = useState('');
  const caraIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typewriterSpeed = 35; // Velocidad de escritura (ms por caracter)

  // --- Funciones de Limpieza de Intervalos (Cara) ---
   const clearCaraInterval = useCallback(() => {
     if (caraIntervalRef.current) {
       clearInterval(caraIntervalRef.current);
       caraIntervalRef.current = null;
     }
   }, []);

   // --- Hook useEffect para la animación Typewriter (Cara) ---
   useEffect(() => {
     clearCaraInterval();
     if (targetCaraNarrative && isGeneratingCaraNarrative) {
       let index = 0;
       setDisplayedCaraNarrative(''); // Empezar limpio

       caraIntervalRef.current = setInterval(() => {
         setDisplayedCaraNarrative(prev => prev + targetCaraNarrative[index]);
         index++;
         if (index === targetCaraNarrative.length) {
           clearCaraInterval();
           setIsGeneratingCaraNarrative(false); // Termina carga
         }
       }, typewriterSpeed);
     } else {
       // Si no hay target o no está generando, muestra el texto completo
       setDisplayedCaraNarrative(targetCaraNarrative);
       if (isGeneratingCaraNarrative) { // Asegurar que no se quede cargando
          setIsGeneratingCaraNarrative(false);
       }
     }
     // Limpieza al desmontar o si las dependencias cambian
     return () => clearCaraInterval();
   }, [targetCaraNarrative, isGeneratingCaraNarrative, clearCaraInterval]); // isGeneratingCaraNarrative es dependencia

  // --- Handlers UI existentes ---
  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    setIsMaximized(false);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    setIsMinimized(false);
  };

  // Definir handleClose si no existe o reutilizar una lógica similar
  const handleClose = () => {
     console.log("Cerrando card..."); // O alguna acción real si es necesaria
     // Podría ocultar el componente o llamar a una función del padre
     setIsMinimized(false); // Ejemplo: restaurar tamaño
     setIsMaximized(false);
   };

  const handleVoiceTranscription = (text: string) => {
    handleExamenCabezaChange('otrosHallazgos', text);
    setShowVoiceInput(false);
  };

  const toggleVoiceInput = () => {
    setShowVoiceInput(!showVoiceInput);
  };

  // --- Generación de Redacción DINÁMICA para Cara ---
  const generateCaraNarrative = useCallback(() => {
    setIsGeneratingCaraNarrative(true);
    clearCaraInterval();
    setTargetCaraNarrative(''); // Inicia limpieza para useEffect

    const data = formData.examenCabeza || {}; // Usar {} como fallback
    let sentences: string[] = [];

    // Construir la primera frase con tez
    if (data.tez && typeof caraNarrativePhrases.tez === 'object' && !('true' in caraNarrativePhrases.tez)) {
      const tezPhrase = (caraNarrativePhrases.tez as Record<string, string>)[data.tez];
      if (tezPhrase) {
        sentences.push(tezPhrase);
      }
    }

    // Agregar estado de la piel a la primera frase si existe
    if (data.estadoPiel && typeof caraNarrativePhrases.estadoPiel === 'object' && !('true' in caraNarrativePhrases.estadoPiel)) {
      const pielPhrase = (caraNarrativePhrases.estadoPiel as Record<string, string>)[data.estadoPiel];
      if (pielPhrase) {
        if (sentences.length > 0) {
          // Si ya hay una frase de tez, concatenar con "con"
          sentences[0] = `${sentences[0]} con ${pielPhrase}`;
        } else {
          sentences.push(`El paciente presenta ${pielPhrase}`);
        }
      }
    }
    
    // Si no hay ninguna primera frase aún
    if (sentences.length === 0) {
      sentences.push("Se realiza evaluación dermatológica facial del paciente");
    }

    // Características con valores booleanos (presente/ausente)
    const dermatologicFeatures = ['lunares', 'cicatrices', 'asimetriasFaciales', 'edema'];
    
    dermatologicFeatures.forEach(feature => {
      const caracteristicaFacial = data[feature] as CaracteristicaFacial | undefined;
      
      if (caracteristicaFacial) {
        // Determinar si la característica está presente
        const isPresent = caracteristicaFacial.presente === true;
        
        // Obtener la frase correspondiente
        const phrasesForFeature = caraNarrativePhrases[feature];
        if (phrasesForFeature && 'true' in phrasesForFeature) {
          // Si está presente y tiene detalles
          if (isPresent) {
            const truePhrase = (phrasesForFeature as {true: (details?: string) => string, false: string}).true;
            sentences.push(truePhrase(caracteristicaFacial.detalles));
          } else {
            // Si no está presente
            const falsePhrase = (phrasesForFeature as {true: (details?: string) => string, false: string}).false;
            sentences.push(falsePhrase);
          }
        }
      }
    });

    // Texto final con puntuación correcta
    let fullText = sentences.join('. ');
    
    // Asegurar que termine en punto
    if (fullText && !fullText.endsWith('.')) {
      fullText += '.';
    }

    // Añadir otros hallazgos si existen
    if (data.otrosHallazgos && data.otrosHallazgos.trim() !== '') {
      fullText += ` Otros hallazgos: ${data.otrosHallazgos.trim()}.`;
    }

    setTargetCaraNarrative(fullText); // Dispara el useEffect
    setCaraViewMode('narrative');
  }, [formData.examenCabeza, clearCaraInterval]);

  const craneosTypes = [
    {
      type: 'Mesocefálico',
      img: '/lovable-uploads/mesocefalo.png',
      description: 'Forma craneal intermedia, proporcionada y armoniosa.'
    },
    {
      type: 'Dolicocéfalo',
      img: '/dolicocefalo.png',
      description: 'Cráneo alargado y estrecho.'
    },
    {
      type: 'Braquicéfalo',
      img: '/braquicefalo.png',
      description: 'Cráneo ancho y corto.'
    }
  ];

  const perfilesTypes = [
    {
      type: 'Cóncavo',
      img: '/concavo.png',
      description: 'Perfil facial que presenta una depresión en la zona media.'
    },
    {
      type: 'Convexo',
      img: '/convexo.png',
      description: 'Perfil facial que presenta una proyección hacia adelante en la zona media.'
    },
    {
      type: 'Recto',
      img: '/recto.png',
      description: 'Perfil facial que presenta una línea recta.'
    }
  ];

  const caracteristicasFaciales = [
    { id: 'lunares', label: 'Lunares' },
    { id: 'cicatrices', label: 'Cicatrices' },
    { id: 'asimetriasFaciales', label: 'Asimetrías Faciales' },
    { id: 'edema', label: 'Edema' }
  ];

  // --- Actualización del Estado del Cráneo/Perfil ---
  // Actualizar estado local cuando cambian las props o se selecciona algo
  useEffect(() => {
      setSelectedCraneoTipo(formData.examenCabeza?.tipoCraneo || '');
  }, [formData.examenCabeza?.tipoCraneo]);

  useEffect(() => {
      setSelectedPerfilTipo(formData.examenCabeza?.tipoPerfil || '');
  }, [formData.examenCabeza?.tipoPerfil]);

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : "my-4"}`} data-section-name="examenCabeza">
        {/* Card y Header (sin cambios mayores, excepto botones de control si quieres unificar estilo) */}
       <Card className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col ${isMaximized ? "h-[calc(100vh-2rem)]" : ""} ${isMinimized ? "h-16 overflow-hidden" : ""}`}>
                {/* Header (Sticky) */}
                <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-10 flex-shrink-0">
                    {/* Tabs (simplificado a uno por ahora) */}
                    <div className="flex-1 flex justify-center">
                        <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
                            <button className={`px-4 py-1.5 rounded-full transition-all duration-300 text-sm font-medium bg-blue-600 text-white shadow-md`}>
                                Formulario
                            </button>
                            {/* Puedes añadir más tabs aquí si es necesario */}
                        </div>
                    </div>
                    {/* Controles (usando el estilo del primer ejemplo) */}
                    <div className="flex items-center gap-2 pl-2">
                        <button onClick={handleMinimize} title={isMinimized ? "Restaurar" : "Minimizar"} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            <Minus className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                        </button>
                        <button onClick={handleMaximize} title={isMaximized ? "Restaurar" : "Maximizar"} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            <Maximize2 className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                        </button>
                       {/* Opcional: Botón de cierre si es necesario */}
                       {/* <button onClick={handleClose} title="Cerrar" className="p-1.5 rounded-full hover:bg-red-200 dark:hover:bg-red-700 transition-colors">
                           <X className="w-4 h-4 text-red-600 dark:text-red-300" />
                       </button> */}
                    </div>
                </div>

        {/* Contenedor de Contenido Scrollable */}
         <div className={`flex-grow overflow-y-auto ${isMinimized ? 'hidden' : ''}`}>
              {/* Título Principal */}
             <div className="flex justify-start px-6 pt-4 pb-2">
                 <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white tracking-tight">
                     <span className="text-blue-500 dark:text-blue-400 font-semibold">X.</span> EXAMEN DE CABEZA Y CARA
                 </h2>
             </div>

          <div className="p-6 space-y-8">
            {/* --- Tipos de Cráneo --- */}
             <section>
               <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Tipos de Cráneo</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {craneosTypes.map((craneo) => (
                  <div
                    key={craneo.type}
                     className={`relative cursor-pointer transition-all duration-300 rounded-lg overflow-hidden border dark:border-gray-700 ${
                      selectedCraneoTipo === craneo.type
                         ? 'ring-2 ring-blue-500 dark:ring-blue-400 shadow-lg transform scale-[1.02]' // Realce mejorado
                         : 'hover:shadow-md hover:scale-[1.01] dark:bg-gray-800' // Efecto hover sutil
                     }`}
                    onClick={() => {
                       // Quitar selección si se clickea de nuevo
                       const newValue = selectedCraneoTipo === craneo.type ? null : craneo.type;
                       setSelectedCraneoTipo(newValue ?? '');
                       handleExamenCabezaChange('tipoCraneo', newValue);
                    }}
                  >
                    <img
                      src={craneo.img}
                      alt={craneo.type}
                      className="w-full h-40 object-cover" // Altura ajustada
                    />
                    <div className={`p-3 ${selectedCraneoTipo !== craneo.type ? 'bg-white dark:bg-gray-800' : 'bg-blue-50 dark:bg-gray-700'}`}>
                      <h4 className="font-medium text-center mb-1 text-gray-800 dark:text-gray-100">{craneo.type}</h4>
                      <p className="text-xs text-center text-gray-600 dark:text-gray-300">{craneo.description}</p>
                    </div>
                  </div>
                 ))}
               </div>
             </section>

             {/* --- Tipos de Perfil --- */}
             <section>
               <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Tipos de Perfil Facial</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                 {perfilesTypes.map((perfil) => (
                   <div
                     key={perfil.type}
                     className={`relative cursor-pointer transition-all duration-300 rounded-lg overflow-hidden border dark:border-gray-700 ${
                       selectedPerfilTipo === perfil.type
                         ? 'ring-2 ring-blue-500 dark:ring-blue-400 shadow-lg transform scale-[1.02]'
                         : 'hover:shadow-md hover:scale-[1.01] dark:bg-gray-800'
                     }`}
                     onClick={() => {
                       const newValue = selectedPerfilTipo === perfil.type ? null : perfil.type;
                       setSelectedPerfilTipo(newValue ?? '');
                       handleExamenCabezaChange('tipoPerfil', newValue);
                     }}
                   >
                     <img
                       src={perfil.img}
                       alt={perfil.type}
                       className="w-full h-40 object-contain bg-gray-50 dark:bg-gray-700/50" // object-contain y fondo
                     />
                     <div className={`p-3 ${selectedPerfilTipo !== perfil.type ? 'bg-white dark:bg-gray-800' : 'bg-blue-50 dark:bg-gray-700'}`}>
                       <h4 className="font-medium text-center mb-1 text-gray-800 dark:text-gray-100">{perfil.type}</h4>
                       <p className="text-xs text-center text-gray-600 dark:text-gray-300">{perfil.description}</p>
                     </div>
                   </div>
                 ))}
               </div>
             </section>

            {/* --- Cara: Formulario / Narrativa --- */}
             <section>
                {/* Header de la sección Cara con botón de cambio */}
                 <div className="flex justify-between items-center mb-4 border-t border-gray-300 dark:border-gray-600 pt-6">
                     <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Cara</h3>
                     {caraViewMode === 'form' ? (
                         <Button
                             variant="outline"
                             size="sm"
                             onClick={generateCaraNarrative}
                             disabled={isGeneratingCaraNarrative}
                             className={`flex items-center gap-1.5 ${isGeneratingCaraNarrative ? 'text-gray-500 cursor-not-allowed' : 'text-blue-600 dark:text-blue-400 border-blue-500/50 dark:border-blue-400/50 hover:bg-blue-50 dark:hover:bg-blue-900/30'}`}
                         >
                           {isGeneratingCaraNarrative ? (
                               <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg>
                           ) : (
                               <FileText className="w-4 h-4" />
                           )}
                             {isGeneratingCaraNarrative ? 'Generando...' : 'Redacción Cara'}
                         </Button>
                     ) : (
                         <Button
                             variant="outline"
                             size="sm"
                             onClick={() => setCaraViewMode('form')}
                             disabled={isGeneratingCaraNarrative} // Deshabilitar mientras genera
                             className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 border-gray-400/50 dark:border-gray-500/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 disabled:opacity-50"
                         >
                             <Edit className="w-4 h-4" /> Editar
                         </Button>
                     )}
                 </div>

                 {/* Contenido Condicional: Formulario o Narrativa */}
                 {caraViewMode === 'form' ? (
                     <div className="space-y-6"> {/* Aumentar espacio entre elementos del form */}
                         {/* Tez y Estado de la Piel en una fila */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {/* Tez - Dropdown */}
                             <div className="space-y-1.5"> {/* Reducir espacio interno */}
                                 <Label htmlFor="tez-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">Tez</Label>
                                 <Select
                                     value={formData.examenCabeza?.tez || ''}
                                     onValueChange={(value) => handleExamenCabezaChange('tez', value === 'none' ? null : value)} // Permitir deseleccionar
                                 >
                                     <SelectTrigger id="tez-select" className="w-full bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm">
                                         <SelectValue placeholder="Seleccione..." />
                                     </SelectTrigger>
                                     <SelectContent>
                                         <SelectItem value="none">-- Ninguno --</SelectItem>
                                         <SelectItem value="clara">Clara</SelectItem>
                                         <SelectItem value="morena">Morena</SelectItem>
                                         <SelectItem value="oscura">Oscura</SelectItem>
                                     </SelectContent>
                                 </Select>
                             </div>

                             {/* Estado de la piel - Dropdown */}
                             <div className="space-y-1.5">
                                 <Label htmlFor='estado-piel-select' className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado de la piel</Label>
                                 <Select
                                     value={formData.examenCabeza?.estadoPiel || ''}
                                     onValueChange={(value) => handleExamenCabezaChange('estadoPiel', value === 'none' ? null : value)}
                                 >
                                     <SelectTrigger id='estado-piel-select' className="w-full bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm">
                                         <SelectValue placeholder="Seleccione..." />
                                     </SelectTrigger>
                                     <SelectContent>
                                          <SelectItem value="none">-- Ninguno --</SelectItem>
                                         <SelectItem value="reseca">Reseca</SelectItem>
                                         <SelectItem value="humectada">Humectada</SelectItem>
                                     </SelectContent>
                                 </Select>
                             </div>
                         </div>

                         {/* Características con detalles opcionales (dos columnas) */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6"> {/* Ajustar gap */}
                             {caracteristicasFaciales.map((caracteristica) => (
                                 <div key={caracteristica.id} className="space-y-2">
                                     <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{caracteristica.label}</Label>
                                     <Select
                                         value={(formData.examenCabeza?.[caracteristica.id] as CaracteristicaFacial)?.presente ? 'si' : 'no'}
                                         onValueChange={(value) => {
                                             const isPresent = value === 'si';
                                             handleExamenCabezaChange(`${caracteristica.id}.presente`, isPresent);
                                             // Limpiar detalles si se selecciona "No"
                                             if (!isPresent) {
                                                 handleExamenCabezaChange(`${caracteristica.id}.detalles`, '');
                                             }
                                         }}
                                     >
                                         <SelectTrigger className="w-full bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm">
                                             <SelectValue placeholder="Seleccione" />
                                         </SelectTrigger>
                                         <SelectContent>
                                             <SelectItem value="si">Sí</SelectItem>
                                             <SelectItem value="no">No</SelectItem>
                                         </SelectContent>
                                     </Select>

                                    {/* Mostrar Textarea solo si 'presente' es true */}
                                     {(formData.examenCabeza?.[caracteristica.id] as CaracteristicaFacial)?.presente === true && (
                                         <Textarea
                                             placeholder={`Detalles (ej. ubicación, tamaño, cantidad)`}
                                             value={(formData.examenCabeza?.[caracteristica.id] as CaracteristicaFacial)?.detalles || ''}
                                             onChange={(e) => handleExamenCabezaChange(`${caracteristica.id}.detalles`, e.target.value)}
                                             className="min-h-[50px] bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm mt-1.5" // Añadir margen superior
                                         />
                                     )}
                                 </div>
                             ))}
                         </div>

                         {/* Otros hallazgos con botón de voz a texto */}
                         <div className="space-y-1.5">
                             <Label htmlFor='otros-hallazgos-cara' className="text-sm font-medium text-gray-700 dark:text-gray-300">Otros hallazgos (Cara)</Label>
                             <div className="relative">
                                 <Textarea
                                     id='otros-hallazgos-cara'
                                     placeholder="Describa cualquier otra observación relevante sobre la cara..."
                                     value={formData.examenCabeza?.otrosHallazgos || ''}
                                     onChange={(e) => handleExamenCabezaChange('otrosHallazgos', e.target.value)}
                                     className="pr-10 min-h-[70px] bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                                 />
                                 <button
                                     type="button"
                                     onClick={toggleVoiceInput}
                                     className="absolute right-2 top-2 p-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-300 transition-colors" // Estilo mejorado
                                     aria-label="Usar reconocimiento de voz"
                                     title="Dictar hallazgos"
                                 >
                                     <Mic className="h-4 w-4" />
                                 </button>
                             </div>

                             {showVoiceInput && (
                                 <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-900/50 rounded-md border border-gray-200 dark:border-gray-700 shadow-inner">
                                     <VoiceInput onTranscriptionComplete={handleVoiceTranscription} />
                                 </div>
                             )}
                         </div>
                     </div>
                 ) : (
                     // Vista de Narrativa Generada
                      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 min-h-[120px] shadow-inner relative">
                         {/* Indicador de carga superpuesto */}
                         {isGeneratingCaraNarrative && !caraIntervalRef.current && (
                             <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 dark:bg-gray-900/80 z-10 rounded-lg">
                                 <svg className="animate-spin h-6 w-6 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg>
                             </div>
                         )}
                         <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                             {displayedCaraNarrative}
                             {/* Cursor solo si está animando activamente */}
                             {isGeneratingCaraNarrative && caraIntervalRef.current && (
                                 <span className="inline-block w-1 h-4 bg-gray-800 dark:bg-gray-200 animate-pulse ml-px align-bottom"></span>
                             )}
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
