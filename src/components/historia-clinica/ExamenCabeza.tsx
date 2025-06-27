
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X, Mic, Edit, FileText } from "lucide-react";
import { FormDataState, CaracteristicaFacial, ExamenCabeza as ExamenCabezaType } from '@/types/historiaClinica';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { VoiceInput } from '@/components/ui/voice-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from "@/components/ui/button";

// Mapeo de frases para redacción dinámica de Cara
const caraNarrativePhrases = {
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
    true: (details) => {
      let description = "Se observan lunares";
      if (details) {
        const parts = [];
        if (details.tamanio) parts.push(`de tamaño ${details.tamanio.toLowerCase()}`);
        if (details.color) parts.push(`color ${details.color.toLowerCase()}`);
        if (details.bordes) parts.push(`con bordes ${details.bordes.toLowerCase()}`);
        if (details.elevacion) parts.push(`${details.elevacion.toLowerCase()}`);
        if (details.localizacion) parts.push(`localizados en ${details.localizacion.toLowerCase()}`);

        if (parts.length > 0) {
          description += ` ${parts.join(", ")}`;
        } else if (details.detalles) {
          description += `: ${details.detalles}`;
        }
      }
      return description;
    },
    false: "No se evidencian lunares durante la evaluación clínica"
  },
  cicatrices: {
    true: (details) => {
      let description = "Se observan cicatrices";
      if (details) {
        const parts = [];
        if (details.tipo) parts.push(`de tipo ${details.tipo.toLowerCase()}`);
        if (details.antiguedad) parts.push(`${details.antiguedad.toLowerCase()}`);
        if (details.tamanio) parts.push(`de tamaño ${details.tamanio.toLowerCase()}`);
        if (details.coloracion) parts.push(`con coloración ${details.coloracion.toLowerCase()}`);
        if (details.localizacion) parts.push(`localizadas en ${details.localizacion.toLowerCase()}`);

        if (parts.length > 0) {
          description += ` ${parts.join(", ")}`;
        } else if (details.detalles) {
          description += `: ${details.detalles}`;
        }
      }
      return description;
    },
    false: "No se evidencian cicatrices durante la evaluación clínica"
  },
  asimetriasFaciales: {
    true: (details) => {
      let description = "Presenta asimetría facial";
      if (details) {
        const parts = [];
        if (details.zonaAfectada) parts.push(`en ${details.zonaAfectada.toLowerCase()}`);
        if (details.grado) parts.push(`de grado ${details.grado.toLowerCase()}`);
        if (details.posibleCausa) parts.push(`de origen posiblemente ${details.posibleCausa.toLowerCase()}`);

        if (parts.length > 0) {
          description += ` ${parts.join(", ")}`;
        } else if (details.detalles) {
          description += `: ${details.detalles}`;
        }
      }
      return description;
    },
    false: "No se observan asimetrías faciales durante la evaluación"
  },
  edema: {
    true: (details) => {
      let description = "Se evidencia edema";
      if (details) {
        const parts = [];
        if (details.localizacion) parts.push(`${details.localizacion.toLowerCase()}`);
        if (details.tipoEdema) parts.push(`de tipo ${details.tipoEdema.toLowerCase()}`);
        if (details.dolor) parts.push(`con dolor ${details.dolor.toLowerCase()}`);
        if (details.consistencia) parts.push(`de consistencia ${details.consistencia.toLowerCase()}`);

        if (parts.length > 0) {
          description += ` ${parts.join(", ")}`;
        } else if (details.detalles) {
          description += `: ${details.detalles}`;
        }
      }
      return description;
    },
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
            const truePhrase = (phrasesForFeature as {true: (details?: any) => string, false: string}).true;
            sentences.push(truePhrase(caracteristicaFacial));
          } else {
            // Si no está presente
            const falsePhrase = (phrasesForFeature as {true: (details?: any) => string, false: string}).false;
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

  // Opciones para subopciones de cada característica
  const lunaresOptions = {
    tamanio: ['Pequeño', 'Mediano', 'Grande'],
    color: ['Marrón claro', 'Marrón oscuro', 'Negro'],
    bordes: ['Regulares', 'Irregulares'],
    elevacion: ['Plano', 'Elevado']
  };

  const cicatricesOptions = {
    tipo: ['Quirúrgica', 'Traumática', 'Acneica', 'Queloide'],
    antiguedad: ['Nueva', 'Antigua'],
    tamanio: ['Pequeña', 'Mediana', 'Grande'],
    coloracion: ['Hipopigmentada', 'Hiperpigmentada', 'Normal']
  };

  const asimetriasOptions = {
    zonaAfectada: ['Mandíbula', 'Mejillas', 'Ojos', 'Nariz', 'Frente'],
    grado: ['Leve', 'Moderado', 'Severo'],
    posibleCausa: ['Congénita', 'Traumática', 'Muscular', 'Otra']
  };

  const edemaOptions = {
    localizacion: ['Facial', 'Periorbitaria', 'Labial', 'Otra'],
    tipoEdema: ['Localizado', 'Difuso'],
    dolor: ['Presente', 'Ausente'],
    consistencia: ['Blando', 'Firme', 'Duro']
  };

  // --- Actualización del Estado del Cráneo/Perfil ---
  // Actualizar estado local cuando cambian las props o se selecciona algo
  useEffect(() => {
      setSelectedCraneoTipo(formData.examenCabeza?.tipoCraneo || '');
  }, [formData.examenCabeza?.tipoCraneo]);

  useEffect(() => {
      setSelectedPerfilTipo(formData.examenCabeza?.tipoPerfil || '');
  }, [formData.examenCabeza?.tipoPerfil]);

  // Helper para actualizar características faciales
  const handleCaracteristicaFacialChange = (id: string, field: string, value: string | boolean) => {
    const currentData = formData.examenCabeza?.[id] as CaracteristicaFacial || {};

    handleExamenCabezaChange(`${id}`, {
      ...currentData,
      [field]: value
    });
  };

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : "my-4"}`} data-section-name="examenCabeza">
        <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)]" : ""} ${isMinimized ? "h-16 overflow-hidden" : ""}`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-center w-full">
                    <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
                        <button className="px-5 py-1.5 rounded-full transition-all duration-300 text-sm bg-blue-500 text-white shadow-md">
                            Formulario
                        </button>
                        <button className="px-5 py-1.5 rounded-full transition-all duration-300 text-sm text-gray-700 dark:text-gray-300">
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

            <div className={`flex-grow overflow-y-auto ${isMinimized ? 'hidden' : ''}`}>
                <div className="flex justify-start px-6 pt-4 pb-2">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white tracking-tight">
                        <span className="text-blue-500 dark:text-blue-400 font-semibold">X.</span> EXAMEN DE CABEZA Y CARA
                    </h2>
                </div>

                <div className="p-6 space-y-8">
                    <section>
                        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Tipos de Cráneo</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {craneosTypes.map((craneo) => (
                                <div
                                    key={craneo.type}
                                    className={`relative cursor-pointer transition-all duration-300 rounded-lg overflow-hidden border dark:border-gray-700 ${
                                        selectedCraneoTipo === craneo.type
                                            ? 'ring-2 ring-blue-500 dark:ring-blue-400 shadow-lg transform scale-[1.02]'
                                            : 'hover:shadow-md hover:scale-[1.01] dark:bg-gray-800'
                                    }`}
                                    onClick={() => {
                                        const newValue = selectedCraneoTipo === craneo.type ? null : craneo.type;
                                        setSelectedCraneoTipo(newValue ?? '');
                                        handleExamenCabezaChange('tipoCraneo', newValue);
                                    }}
                                >
                                    <img
                                        src={craneo.img}
                                        alt={craneo.type}
                                        className="w-full h-40 object-cover"
                                    />
                                    <div className={`p-3 ${selectedCraneoTipo !== craneo.type ? 'bg-white dark:bg-gray-800' : 'bg-blue-50 dark:bg-gray-700'}`}>
                                        <h4 className="font-medium text-center mb-1 text-gray-800 dark:text-gray-100">{craneo.type}</h4>
                                        <p className="text-xs text-center text-gray-600 dark:text-gray-300">{craneo.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

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
                                        className="w-full h-40 object-contain bg-gray-50 dark:bg-gray-700/50"
                                    />
                                    <div className={`p-3 ${selectedPerfilTipo !== perfil.type ? 'bg-white dark:bg-gray-800' : 'bg-blue-50 dark:bg-gray-700'}`}>
                                        <h4 className="font-medium text-center mb-1 text-gray-800 dark:text-gray-100">{perfil.type}</h4>
                                        <p className="text-xs text-center text-gray-600 dark:text-gray-300">{perfil.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
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
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
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
                                    disabled={isGeneratingCaraNarrative}
                                    className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 border-gray-400/50 dark:border-gray-500/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 disabled:opacity-50"
                                >
                                    <Edit className="w-4 h-4" /> Editar
                                </Button>
                            )}
                        </div>

                        {caraViewMode === 'form' ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="tez-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">Tez</Label>
                                        <Select
                                            value={formData.examenCabeza?.tez || ''}
                                            onValueChange={(value) => handleExamenCabezaChange('tez', value === 'none' ? null : value)}
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                                    {caracteristicasFaciales.map((caracteristica) => (
                                        <div key={caracteristica.id} className="space-y-2 border p-4 rounded-md shadow-sm">
                                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{caracteristica.label}</Label>
                                            <Select
                                                value={((formData.examenCabeza || {})[caracteristica.id] as CaracteristicaFacial)?.presente ? 'si' : 'no'}
                                                onValueChange={(value) => {
                                                    const isPresent = value === 'si';
                                                    handleCaracteristicaFacialChange(caracteristica.id, 'presente', isPresent);
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

                                            {((formData.examenCabeza || {})[caracteristica.id] as CaracteristicaFacial)?.presente === true && (
                                                <div className="mt-2 space-y-3 border-t pt-2">
                                                    {caracteristica.id === 'lunares' && (
                                                        <>
                                                            <div>
                                                                <Label className="text-xs text-gray-600 dark:text-gray-400">Tamaño</Label>
                                                                <Select
                                                                    value={((formData.examenCabeza || {})[caracteristica.id] as CaracteristicaFacial)?.tamanio || ''}
                                                                    onValueChange={(value) => handleCaracteristicaFacialChange(caracteristica.id, 'tamanio', value)}
                                                                >
                                                                    <SelectTrigger className="w-full h-8 text-sm mt-1">
                                                                        <SelectValue placeholder="Seleccione tamaño" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {lunaresOptions.tamanio.map(option => (
                                                                            <SelectItem key={option} value={option}>{option}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div>
                                                                <Label className="text-xs text-gray-600 dark:text-gray-400">Color</Label>
                                                                <Select
                                                                    value={((formData.examenCabeza || {})[caracteristica.id] as CaracteristicaFacial)?.color || ''}
                                                                    onValueChange={(value) => handleCaracteristicaFacialChange(caracteristica.id, 'color', value)}
                                                                >
                                                                    <SelectTrigger className="w-full h-8 text-sm mt-1">
                                                                        <SelectValue placeholder="Seleccione color" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {lunaresOptions.color.map(option => (
                                                                            <SelectItem key={option} value={option}>{option}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div>
                                                                <Label className="text-xs text-gray-600 dark:text-gray-400">Bordes</Label>
                                                                <Select
                                                                    value={((formData.examenCabeza || {})[caracteristica.id] as CaracteristicaFacial)?.bordes || ''}
                                                                    onValueChange={(value) => handleCaracteristicaFacialChange(caracteristica.id, 'bordes', value)}
                                                                >
                                                                    <SelectTrigger className="w-full h-8 text-sm mt-1">
                                                                        <SelectValue placeholder="Seleccione tipo de bordes" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {lunaresOptions.bordes.map(option => (
                                                                            <SelectItem key={option} value={option}>{option}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div>
                                                                <Label className="text-xs text-gray-600 dark:text-gray-400">Elevación</Label>
                                                                <Select
                                                                    value={((formData.examenCabeza || {})[caracteristica.id] as CaracteristicaFacial)?.elevacion || ''}
                                                                    onValueChange={(value) => handleCaracteristicaFacialChange(caracteristica.id, 'elevacion', value)}
                                                                >
                                                                    <SelectTrigger className="w-full h-8 text-sm mt-1">
                                                                        <SelectValue placeholder="Seleccione elevación" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {lunaresOptions.elevacion.map(option => (
                                                                            <SelectItem key={option} value={option}>{option}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </>
                                                    )}

                                                    {caracteristica.id === 'cicatrices' && (
                                                        <>
                                                            <div>
                                                                <Label className="text-xs text-gray-600 dark:text-gray-400">Tipo</Label>
                                                                <Select
                                                                    value={((formData.examenCabeza || {})[caracteristica.id] as CaracteristicaFacial)?.tipo || ''}
                                                                    onValueChange={(value) => handleCaracteristicaFacialChange(caracteristica.id, 'tipo', value)}
                                                                >
                                                                    <SelectTrigger className="w-full h-8 text-sm mt-1">
                                                                        <SelectValue placeholder="Seleccione tipo" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {cicatricesOptions.tipo.map(option => (
                                                                            <SelectItem key={option} value={option}>{option}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div>
                                                                <Label className="text-xs text-gray-600 dark:text-gray-400">Antigüedad</Label>
                                                                <Select
                                                                    value={((formData.examenCabeza || {})[caracteristica.id] as CaracteristicaFacial)?.antiguedad || ''}
                                                                    onValueChange={(value) => handleCaracteristicaFacialChange(caracteristica.id, 'antiguedad', value)}
                                                                >
                                                                    <SelectTrigger className="w-full h-8 text-sm mt-1">
                                                                        <SelectValue placeholder="Seleccione antigüedad" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {cicatricesOptions.antiguedad.map(option => (
                                                                            <SelectItem key={option} value={option}>{option}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </>
                                                    )}

                                                    {caracteristica.id === 'asimetriasFaciales' && (
                                                        <>
                                                            <div>
                                                                <Label className="text-xs text-gray-600 dark:text-gray-400">Zona afectada</Label>
                                                                <Select
                                                                    value={((formData.examenCabeza || {})[caracteristica.id] as CaracteristicaFacial)?.zonaAfectada || ''}
                                                                    onValueChange={(value) => handleCaracteristicaFacialChange(caracteristica.id, 'zonaAfectada', value)}
                                                                >
                                                                    <SelectTrigger className="w-full h-8 text-sm mt-1">
                                                                        <SelectValue placeholder="Seleccione zona" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {asimetriasOptions.zonaAfectada.map(option => (
                                                                            <SelectItem key={option} value={option}>{option}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div>
                                                                <Label className="text-xs text-gray-600 dark:text-gray-400">Grado</Label>
                                                                <Select
                                                                    value={((formData.examenCabeza || {})[caracteristica.id] as CaracteristicaFacial)?.grado || ''}
                                                                    onValueChange={(value) => handleCaracteristicaFacialChange(caracteristica.id, 'grado', value)}
                                                                >
                                                                    <SelectTrigger className="w-full h-8 text-sm mt-1">
                                                                        <SelectValue placeholder="Seleccione grado" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {asimetriasOptions.grado.map(option => (
                                                                            <SelectItem key={option} value={option}>{option}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </>
                                                    )}

                                                    {caracteristica.id === 'edema' && (
                                                        <>
                                                            <div>
                                                                <Label className="text-xs text-gray-600 dark:text-gray-400">Localización</Label>
                                                                <Select
                                                                    value={((formData.examenCabeza || {})[caracteristica.id] as CaracteristicaFacial)?.localizacion || ''}
                                                                    onValueChange={(value) => handleCaracteristicaFacialChange(caracteristica.id, 'localizacion', value)}
                                                                >
                                                                    <SelectTrigger className="w-full h-8 text-sm mt-1">
                                                                        <SelectValue placeholder="Seleccione localización" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {edemaOptions.localizacion.map(option => (
                                                                            <SelectItem key={option} value={option}>{option}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div>
                                                                <Label className="text-xs text-gray-600 dark:text-gray-400">Tipo</Label>
                                                                <Select
                                                                    value={((formData.examenCabeza || {})[caracteristica.id] as CaracteristicaFacial)?.tipoEdema || ''}
                                                                    onValueChange={(value) => handleCaracteristicaFacialChange(caracteristica.id, 'tipoEdema', value)}
                                                                >
                                                                    <SelectTrigger className="w-full h-8 text-sm mt-1">
                                                                        <SelectValue placeholder="Seleccione tipo" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {edemaOptions.tipoEdema.map(option => (
                                                                            <SelectItem key={option} value={option}>{option}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </>
                                                    )}

                                                    <div>
                                                        <Label className="text-xs text-gray-600 dark:text-gray-400">
                                                            {caracteristica.id !== 'edema' && caracteristica.id !== 'asimetriasFaciales' ? 'Localización' : 'Detalles adicionales'}
                                                        </Label>
                                                        <Textarea
                                                            placeholder="Describa la localización o detalles adicionales"
                                                            value={((formData.examenCabeza || {})[caracteristica.id] as CaracteristicaFacial)?.detalles || ''}
                                                            onChange={(e) => handleCaracteristicaFacialChange(caracteristica.id, 'detalles', e.target.value)}
                                                            className="min-h-[50px] text-sm mt-1"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

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
                                            className="absolute right-2 top-2 p-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-300 transition-colors"
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
                            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 min-h-[120px] shadow-inner relative">
                                {isGeneratingCaraNarrative && !caraIntervalRef.current && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 dark:bg-gray-900/80 z-10 rounded-lg">
                                        <svg className="animate-spin h-6 w-6 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                )}
                                <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                                    {displayedCaraNarrative}
                                    {isGeneratingCaraNarrative && caraIntervalRef.current && (
                                        <span className="inline-block w-1 h-4 bg-gray-800 dark:bg-gray-200 animate-pulse ml-px align-bottom"></span>
                                    )}
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </Card>
    </div>
  );
};

export default ExamenCabeza;
