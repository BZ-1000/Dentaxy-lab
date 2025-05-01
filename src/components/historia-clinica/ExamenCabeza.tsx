import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; // Importar Input para campos de texto
import { Minus, Maximize2, X, Mic, Edit, FileText } from "lucide-react";
import { FormDataState, ExamenCabezaState } from '@/types/historiaClinica'; // Asegúrate que ExamenCabezaState sea ACTUALIZADO
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { VoiceInput } from '@/components/ui/voice-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from "@/components/ui/button";

// --- INTERFAZ ACTUALIZADA (EJEMPLO - DEBE ESTAR EN @/types/historiaClinica) ---
// interface ExamenCabezaState {
//   tipoCraneo?: string | null;
//   tipoPerfil?: string | null;
//   tez?: 'clara' | 'morena' | 'oscura' | null;
//   estadoPiel?: 'reseca' | 'humectada' | null;
//   lunares?: {
//     presente?: boolean | null;
//     tamaño?: 'Pequeño' | 'Mediano' | 'Grande' | null;
//     color?: 'Marrón claro' | 'Marrón oscuro' | 'Negro' | null;
//     bordes?: 'Regulares' | 'Irregulares' | null;
//     localizacion?: string | null; // Campo de texto
//     elevacion?: 'Plano' | 'Elevado' | null;
//   };
//   cicatrices?: {
//     presente?: boolean | null;
//     tipo?: 'Quirúrgica' | 'Traumática' | 'Acneica' | 'Queloide' | null;
//     antigüedad?: 'Nueva' | 'Antigua' | null;
//     localizacion?: string | null; // Campo de texto
//     tamaño?: 'Pequeña' | 'Mediana' | 'Grande' | null;
//     coloracion?: 'Hipopigmentada' | 'Hiperpigmentada' | 'Normal' | null;
//   };
//   asimetriasFaciales?: {
//     presente?: boolean | null;
//     zonaAfectada?: 'Mandíbula' | 'Mejillas' | 'Ojos' | 'Nariz' | 'Frente' | null;
//     grado?: 'Leve' | 'Moderado' | 'Severo' | null;
//     posibleCausa?: string | null; // Campo de texto (o Select si hay causas comunes)
//   };
//   edema?: {
//     presente?: boolean | null;
//     localizacion?: string | null; // Campo de texto (o Select: Facial, Periorbitaria, Labial)
//     tipo?: 'Localizado' | 'Difuso' | null;
//     dolor?: 'Presente' | 'Ausente' | null;
//     consistencia?: 'Blando' | 'Duro' | null;
//   };
//   otrosHallazgos?: string | null;
// }
// --- FIN INTERFAZ EJEMPLO ---


interface ExamenCabezaProps {
  formData: FormDataState;
  // handleExamenCabezaChange debe poder manejar rutas como 'lunares.tamaño'
  handleExamenCabezaChange: (part: string, value: string | boolean | null) => void;
}

// --- Constantes para Opciones de Select ---
const LUNARES_OPTIONS = {
  tamaño: ['Pequeño', 'Mediano', 'Grande'],
  color: ['Marrón claro', 'Marrón oscuro', 'Negro'],
  bordes: ['Regulares', 'Irregulares'],
  elevacion: ['Plano', 'Elevado'],
};

const CICATRICES_OPTIONS = {
  tipo: ['Quirúrgica', 'Traumática', 'Acneica', 'Queloide'],
  antigüedad: ['Nueva', 'Antigua'],
  tamaño: ['Pequeña', 'Mediana', 'Grande'],
  coloracion: ['Hipopigmentada', 'Hiperpigmentada', 'Normal'],
};

const ASIMETRIAS_OPTIONS = {
  zonaAfectada: ['Mandíbula', 'Mejillas', 'Ojos', 'Nariz', 'Frente'],
  grado: ['Leve', 'Moderado', 'Severo'],
};

const EDEMA_OPTIONS = {
  // localizacion: ['Facial', 'Periorbitaria', 'Labial'], // Convertido a Input de texto
  tipo: ['Localizado', 'Difuso'],
  dolor: ['Presente', 'Ausente'],
  consistencia: ['Blando', 'Duro'],
};

// Mapeo de claves de subopciones para limpiar al seleccionar "No"
const CARACTERISTICA_SUBFIELDS: { [key: string]: string[] } = {
  lunares: ['tamaño', 'color', 'bordes', 'localizacion', 'elevacion'],
  cicatrices: ['tipo', 'antigüedad', 'localizacion', 'tamaño', 'coloracion'],
  asimetriasFaciales: ['zonaAfectada', 'grado', 'posibleCausa'],
  edema: ['localizacion', 'tipo', 'dolor', 'consistencia'],
};

const ExamenCabeza: React.FC<ExamenCabezaProps> = ({
  formData,
  handleExamenCabezaChange
}) => {
  // Estados UI existentes (sin cambios)
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [selectedCraneoTipo, setSelectedCraneoTipo] = useState<string>(formData.examenCabeza?.tipoCraneo || '');
  const [selectedPerfilTipo, setSelectedPerfilTipo] = useState<string>(formData.examenCabeza?.tipoPerfil || '');
  const [showVoiceInput, setShowVoiceInput] = useState(false);

  // Estados para la Narrativa de Cara (sin cambios)
  const [caraViewMode, setCaraViewMode] = useState<'form' | 'narrative'>('form');
  const [isGeneratingCaraNarrative, setIsGeneratingCaraNarrative] = useState(false);
  const [targetCaraNarrative, setTargetCaraNarrative] = useState('');
  const [displayedCaraNarrative, setDisplayedCaraNarrative] = useState('');
  const caraIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typewriterSpeed = 35; // Velocidad de escritura (ms por caracter)

  // Funciones de Limpieza de Intervalos (Cara) (sin cambios)
  const clearCaraInterval = useCallback(() => {
    if (caraIntervalRef.current) {
      clearInterval(caraIntervalRef.current);
      caraIntervalRef.current = null;
    }
  }, []);

  // Hook useEffect para la animación Typewriter (Cara) (sin cambios)
  useEffect(() => {
    clearCaraInterval();
    if (targetCaraNarrative && isGeneratingCaraNarrative) {
      let index = 0;
      setDisplayedCaraNarrative('');
      caraIntervalRef.current = setInterval(() => {
        setDisplayedCaraNarrative(prev => prev + targetCaraNarrative[index]);
        index++;
        if (index === targetCaraNarrative.length) {
          clearCaraInterval();
          setIsGeneratingCaraNarrative(false);
        }
      }, typewriterSpeed);
    } else {
      setDisplayedCaraNarrative(targetCaraNarrative);
      if (isGeneratingCaraNarrative) {
        setIsGeneratingCaraNarrative(false);
      }
    }
    return () => clearCaraInterval();
  }, [targetCaraNarrative, isGeneratingCaraNarrative, clearCaraInterval]);

  // Handlers UI existentes (sin cambios)
  const handleMinimize = () => setIsMinimized(!isMinimized);
  const handleMaximize = () => setIsMaximized(!isMaximized);
  const handleClose = () => console.log("Cerrando card...");
  const handleVoiceTranscription = (text: string) => {
    handleExamenCabezaChange('otrosHallazgos', text);
    setShowVoiceInput(false);
  };
  const toggleVoiceInput = () => setShowVoiceInput(!showVoiceInput);


  // --- *** ACTUALIZACIÓN: Generación de Redacción DETALLADA para Cara *** ---
  const generateCaraNarrative = useCallback(() => {
    setIsGeneratingCaraNarrative(true);
    clearCaraInterval();
    setTargetCaraNarrative(''); // Inicia limpieza

    const data = formData.examenCabeza || {};
    let sentences: string[] = [];
    let negativeSentences: string[] = []; // Para agrupar los "No presenta"

    // Tez y Estado Piel (igual que antes)
    if (data.tez) {
        const phrases = { clara: "La tez del paciente es clara.", morena: "Se observa una tez morena.", oscura: "El paciente presenta una tez oscura." };
        if (phrases[data.tez]) sentences.push(phrases[data.tez]);
    }
    if (data.estadoPiel) {
        const phrases = { reseca: "La piel de la cara se presenta reseca.", humectada: "La piel facial se encuentra humectada y con turgencia conservada." };
        if (phrases[data.estadoPiel]) sentences.push(phrases[data.estadoPiel]);
    }

    // Lunares (con detalles estructurados)
    if (data.lunares?.presente === true) {
        let desc = "Se observan lunares";
        const details: string[] = [];
        if (data.lunares.tamaño) details.push(`${data.lunares.tamaño.toLowerCase()}s`);
        if (data.lunares.color) details.push(`de color ${data.lunares.color.toLowerCase()}`);
        if (data.lunares.bordes) details.push(`con bordes ${data.lunares.bordes.toLowerCase()}`);
        if (data.lunares.elevacion) details.push(`${data.lunares.elevacion.toLowerCase()}s`);
        if (data.lunares.localizacion?.trim()) details.push(`localizados en ${data.lunares.localizacion.trim()}`);

        if (details.length > 0) {
            desc += ` ${details.join(', ')}.`;
        } else {
            desc += '.'; // Si solo se marcó 'Sí' sin detalles
        }
        sentences.push(desc);
    } else if (data.lunares?.presente === false) {
        negativeSentences.push("lunares");
    }

    // Cicatrices (con detalles estructurados)
    if (data.cicatrices?.presente === true) {
        let desc = "Presenta cicatrices";
        const details: string[] = [];
        if (data.cicatrices.tipo) details.push(`de tipo ${data.cicatrices.tipo.toLowerCase()}`);
        if (data.cicatrices.antigüedad) details.push(`${data.cicatrices.antigüedad.toLowerCase()}s`);
        if (data.cicatrices.tamaño) details.push(`de tamaño ${data.cicatrices.tamaño.toLowerCase()}`);
        if (data.cicatrices.coloracion) details.push(`con coloración ${data.cicatrices.coloracion.toLowerCase()}`);
        if (data.cicatrices.localizacion?.trim()) details.push(`localizadas en ${data.cicatrices.localizacion.trim()}`);

         if (details.length > 0) {
            desc += ` ${details.join(', ')}.`;
        } else {
            desc += '.';
        }
        sentences.push(desc);
    } else if (data.cicatrices?.presente === false) {
        negativeSentences.push("cicatrices");
    }

    // Asimetrías Faciales (con detalles estructurados)
    if (data.asimetriasFaciales?.presente === true) {
        let desc = "Se evidencia asimetría facial";
        const details: string[] = [];
        if (data.asimetriasFaciales.grado) details.push(`${data.asimetriasFaciales.grado.toLowerCase()}`);
        if (data.asimetriasFaciales.zonaAfectada) details.push(`a nivel de ${data.asimetriasFaciales.zonaAfectada.toLowerCase()}`);
        if (data.asimetriasFaciales.posibleCausa?.trim()) details.push(`de posible causa ${data.asimetriasFaciales.posibleCausa.trim()}`);

        if (details.length > 0) {
            desc += ` ${details.join(', ')}.`;
        } else {
            desc += '.';
        }
        sentences.push(desc);
    } else if (data.asimetriasFaciales?.presente === false) {
        negativeSentences.push("asimetrías faciales");
    }

    // Edema (con detalles estructurados)
    if (data.edema?.presente === true) {
        let desc = "Se detecta edema";
        const details: string[] = [];
        if (data.edema.tipo) details.push(`${data.edema.tipo.toLowerCase()}`);
        if (data.edema.localizacion?.trim()) details.push(`en ${data.edema.localizacion.trim()}`);
        if (data.edema.consistencia) details.push(`de consistencia ${data.edema.consistencia.toLowerCase()}`);
        if (data.edema.dolor) details.push(data.edema.dolor === 'Presente' ? 'doloroso' : 'no doloroso');

        if (details.length > 0) {
            desc += ` ${details.join(', ')}.`;
        } else {
            desc += '.';
        }
        sentences.push(desc);
    } else if (data.edema?.presente === false) {
        negativeSentences.push("signos de edema");
    }

    // Construir texto final
    let fullText = "";
    if (sentences.length > 0) {
        fullText = sentences.map(s => s.trim().replace(/\.$/, '')).join('. ') + '.';
    }

    // Añadir frases negativas agrupadas
    if (negativeSentences.length > 0) {
        const negativeClause = "No se evidencia" + (negativeSentences.length > 1 ? "n" : "") + " " + negativeSentences.join(', ') + " durante la evaluación clínica.";
        if (fullText.length > 0) {
            fullText += " " + negativeClause;
        } else {
            fullText = negativeClause.charAt(0).toUpperCase() + negativeClause.slice(1); // Capitalizar si es la única frase
        }
    }

     if (fullText.length === 0 && !(data.otrosHallazgos?.trim())) {
         fullText = "No se han descrito características faciales específicas.";
     }


    // Añadir otros hallazgos
    if (data.otrosHallazgos?.trim()) {
        const observaciones = `Otros hallazgos relevantes: ${data.otrosHallazgos.trim()}.`;
         if (fullText === "No se han descrito características faciales específicas.") {
            fullText = observaciones;
        } else if (fullText.length > 0){
            fullText += " " + observaciones;
        } else {
            fullText = observaciones; // Si no había nada antes
        }
    }

    setTargetCaraNarrative(fullText); // Dispara el useEffect
    setCaraViewMode('narrative');
  }, [formData.examenCabeza, clearCaraInterval]); // Dependencias


  const craneosTypes = [ /* ... (sin cambios) ... */ ];
  const perfilesTypes = [ /* ... (sin cambios) ... */ ];

  // IDs para las características faciales (sin cambios)
   const caracteristicasFacialesIds: (keyof ExamenCabezaState)[] = [
       'lunares', 'cicatrices', 'asimetriasFaciales', 'edema'
   ];
    // Mapeo para Labels (puedes ajustar los labels)
   const caracteristicasLabels: { [key in typeof caracteristicasFacialesIds[number]]: string } = {
        lunares: 'Lunares',
        cicatrices: 'Cicatrices',
        asimetriasFaciales: 'Asimetrías Faciales',
        edema: 'Edema'
    };


  // Actualización del Estado del Cráneo/Perfil (sin cambios)
  useEffect(() => { setSelectedCraneoTipo(formData.examenCabeza?.tipoCraneo || ''); }, [formData.examenCabeza?.tipoCraneo]);
  useEffect(() => { setSelectedPerfilTipo(formData.examenCabeza?.tipoPerfil || ''); }, [formData.examenCabeza?.tipoPerfil]);


  // --- *** FUNCIÓN HELPER para Renderizar Sub-campos *** ---
  const renderSubFields = (caracteristicaId: keyof ExamenCabezaState) => {
    const data = formData.examenCabeza?.[caracteristicaId];
    if (!data?.presente) return null;

    const renderSelect = (field: string, options: string[], label: string) => (
      <div key={field} className="space-y-1">
        <Label htmlFor={`${caracteristicaId}-${field}`} className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</Label>
        <Select
          value={(data as any)?.[field] || ''}
          onValueChange={(value) => handleExamenCabezaChange(`${caracteristicaId}.${field}`, value === 'none' ? null : value)}
        >
          <SelectTrigger id={`${caracteristicaId}-${field}`} className="w-full text-sm h-9">
            <SelectValue placeholder="Seleccione..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">-- Ninguno --</SelectItem>
            {options.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    );

    const renderInput = (field: string, label: string, placeholder?: string) => (
       <div key={field} className="space-y-1">
         <Label htmlFor={`${caracteristicaId}-${field}`} className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</Label>
         <Input
           id={`${caracteristicaId}-${field}`}
           type="text"
           placeholder={placeholder || label}
           value={(data as any)?.[field] || ''}
           onChange={(e) => handleExamenCabezaChange(`${caracteristicaId}.${field}`, e.target.value)}
           className="w-full text-sm h-9"
         />
       </div>
    );


    switch (caracteristicaId) {
      case 'lunares':
        return (
          <div className="grid grid-cols-2 gap-x-3 gap-y-3 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            {renderSelect('tamaño', LUNARES_OPTIONS.tamaño, 'Tamaño')}
            {renderSelect('color', LUNARES_OPTIONS.color, 'Color')}
            {renderSelect('bordes', LUNARES_OPTIONS.bordes, 'Bordes')}
            {renderSelect('elevacion', LUNARES_OPTIONS.elevacion, 'Elevación')}
            {renderInput('localizacion', 'Localización', 'Ej: Mejilla der.')}
          </div>
        );
      case 'cicatrices':
          return (
              <div className="grid grid-cols-2 gap-x-3 gap-y-3 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  {renderSelect('tipo', CICATRICES_OPTIONS.tipo, 'Tipo')}
                  {renderSelect('antigüedad', CICATRICES_OPTIONS.antigüedad, 'Antigüedad')}
                  {renderSelect('tamaño', CICATRICES_OPTIONS.tamaño, 'Tamaño')}
                  {renderSelect('coloracion', CICATRICES_OPTIONS.coloracion, 'Coloración')}
                  {renderInput('localizacion', 'Localización', 'Ej: Frente')}
              </div>
          );
      case 'asimetriasFaciales':
          return (
              <div className="grid grid-cols-2 gap-x-3 gap-y-3 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  {renderSelect('zonaAfectada', ASIMETRIAS_OPTIONS.zonaAfectada, 'Zona Afectada')}
                  {renderSelect('grado', ASIMETRIAS_OPTIONS.grado, 'Grado')}
                  {renderInput('posibleCausa', 'Posible Causa', 'Ej: Congénita', /* className="col-span-2" */)} {/* Opcional: span 2 cols */}
              </div>
          );
      case 'edema':
          return (
              <div className="grid grid-cols-2 gap-x-3 gap-y-3 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  {renderInput('localizacion', 'Localización', 'Ej: Periorbitaria')}
                  {renderSelect('tipo', EDEMA_OPTIONS.tipo, 'Tipo')}
                  {renderSelect('dolor', EDEMA_OPTIONS.dolor, 'Dolor')}
                  {renderSelect('consistencia', EDEMA_OPTIONS.consistencia, 'Consistencia')}
              </div>
          );
      default:
        return null;
    }
  };


  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : "my-4"}`} data-section-name="examenCabeza">
      <Card className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col ${isMaximized ? "h-[calc(100vh-2rem)]" : ""} ${isMinimized ? "h-16 overflow-hidden" : ""}`}>
        {/* Header (Sticky) - Sin cambios */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-10 flex-shrink-0">
             <div className="flex-1 flex justify-center">
                 <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
                     <button className={`px-4 py-1.5 rounded-full transition-all duration-300 text-sm font-medium ${caraViewMode === 'form' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`} onClick={() => setCaraViewMode('form')}>
                         Formulario
                     </button>
                     <button className={`px-4 py-1.5 rounded-full transition-all duration-300 text-sm font-medium ${caraViewMode === 'narrative' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`} onClick={generateCaraNarrative} disabled={isGeneratingCaraNarrative}>
                         {isGeneratingCaraNarrative ? '...' : 'Redacción'}
                     </button>
                 </div>
             </div>
             <div className="flex items-center gap-2 pl-2">
                 <button onClick={handleMinimize} title={isMinimized ? "Restaurar" : "Minimizar"} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"> <Minus className="w-4 h-4 text-gray-700 dark:text-gray-300" /> </button>
                 <button onClick={handleMaximize} title={isMaximized ? "Restaurar" : "Maximizar"} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"> <Maximize2 className="w-4 h-4 text-gray-700 dark:text-gray-300" /> </button>
             </div>
         </div>

        {/* Contenedor de Contenido Scrollable */}
        <div className={`flex-grow overflow-y-auto ${isMinimized ? 'hidden' : ''}`}>
          {/* Título Principal - Sin cambios */}
          <div className="flex justify-start px-6 pt-4 pb-2">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white tracking-tight">
              <span className="text-blue-500 dark:text-blue-400 font-semibold">X.</span> EXAMEN DE CABEZA Y CARA
            </h2>
          </div>

          <div className="p-6 space-y-8">
            {/* Tipos de Cráneo - Sin cambios */}
            <section>
                <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Tipos de Cráneo</h3>
                {/* ... (contenido sin cambios) ... */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {craneosTypes.map((craneo) => ( <div key={craneo.type} /* ... (resto igual) ... */ > {/* ... */} </div> ))}
                 </div>
            </section>

            {/* Tipos de Perfil - Sin cambios */}
            <section>
                <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Tipos de Perfil Facial</h3>
                {/* ... (contenido sin cambios) ... */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                   {perfilesTypes.map((perfil) => ( <div key={perfil.type} /* ... (resto igual) ... */ > {/* ... */} </div> ))}
                 </div>
            </section>

            {/* --- *** CARA: Formulario / Narrativa (ACTUALIZADO) *** --- */}
            <section>
              {/* Header de la sección Cara con botón de cambio (Lógica de botones actualizada en Header) */}
               <div className="flex justify-between items-center mb-4 border-t border-gray-300 dark:border-gray-600 pt-6">
                 <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Cara</h3>
                 {/* Botón Editar/Generar ahora está en el Header principal */}
                {caraViewMode === 'narrative' && (
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

              {/* Contenido Condicional: Formulario o Narrativa */}
              {caraViewMode === 'form' ? (
                <div className="space-y-6">
                  {/* Tez y Estado de la Piel (sin cambios estructurales) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tez - Dropdown */}
                    <div className="space-y-1.5">
                        <Label htmlFor="tez-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">Tez</Label>
                        <Select value={formData.examenCabeza?.tez || ''} onValueChange={(value) => handleExamenCabezaChange('tez', value === 'none' ? null : value)} >
                            <SelectTrigger id="tez-select" /* ... */ > <SelectValue placeholder="Seleccione..." /> </SelectTrigger>
                            <SelectContent> <SelectItem value="none">-- Ninguno --</SelectItem> <SelectItem value="clara">Clara</SelectItem> <SelectItem value="morena">Morena</SelectItem> <SelectItem value="oscura">Oscura</SelectItem> </SelectContent>
                        </Select>
                    </div>
                    {/* Estado de la piel - Dropdown */}
                    <div className="space-y-1.5">
                         <Label htmlFor='estado-piel-select' className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado de la piel</Label>
                         <Select value={formData.examenCabeza?.estadoPiel || ''} onValueChange={(value) => handleExamenCabezaChange('estadoPiel', value === 'none' ? null : value)} >
                           <SelectTrigger id='estado-piel-select' /* ... */ > <SelectValue placeholder="Seleccione..." /> </SelectTrigger>
                           <SelectContent> <SelectItem value="none">-- Ninguno --</SelectItem> <SelectItem value="reseca">Reseca</SelectItem> <SelectItem value="humectada">Humectada</SelectItem> </SelectContent>
                         </Select>
                     </div>
                  </div>

                  {/* --- *** Características con SUB-DETALLES *** --- */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                    {caracteristicasFacialesIds.map((id) => {
                       // Asegurar que el ID es una clave válida antes de acceder
                       if (!(id in caracteristicasLabels)) return null;
                       const caracteristicaId = id as keyof typeof caracteristicasLabels; // Type assertion

                       return (
                         <div key={caracteristicaId} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800/50 shadow-sm">
                           <Label className="text-sm font-medium text-gray-800 dark:text-gray-200 block mb-2">{caracteristicasLabels[caracteristicaId]}</Label>
                           <Select
                             // Acceso seguro al estado
                             value={formData.examenCabeza?.[caracteristicaId]?.presente === true ? 'si' : (formData.examenCabeza?.[caracteristicaId]?.presente === false ? 'no' : '')}
                             onValueChange={(value) => {
                               const isPresent = value === 'si';
                               handleExamenCabezaChange(`${caracteristicaId}.presente`, isPresent);

                               // Limpiar subcampos si se selecciona "No"
                               if (!isPresent && CARACTERISTICA_SUBFIELDS[caracteristicaId]) {
                                 CARACTERISTICA_SUBFIELDS[caracteristicaId].forEach(subField => {
                                   handleExamenCabezaChange(`${caracteristicaId}.${subField}`, null); // O '' según prefieras manejar estado vacío
                                 });
                               }
                             }}
                           >
                             <SelectTrigger className="w-full bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm h-9 text-sm">
                               <SelectValue placeholder="¿Presente?" />
                             </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="si">Sí</SelectItem>
                               <SelectItem value="no">No</SelectItem>
                             </SelectContent>
                           </Select>

                           {/* Renderizar Subcampos Condicionalmente */}
                           {renderSubFields(caracteristicaId)}
                         </div>
                       );
                     })}
                  </div>

                  {/* Otros hallazgos (sin cambios estructurales) */}
                  <div className="space-y-1.5 pt-4 border-t border-gray-200 dark:border-gray-600">
                     <Label htmlFor='otros-hallazgos-cara' className="text-sm font-medium text-gray-700 dark:text-gray-300">Otros hallazgos (Cara)</Label>
                     <div className="relative">
                       <Textarea id='otros-hallazgos-cara' /* ... (resto igual) ... */
                           value={formData.examenCabeza?.otrosHallazgos || ''}
                           onChange={(e) => handleExamenCabezaChange('otrosHallazgos', e.target.value)}
                        />
                       <button type="button" onClick={toggleVoiceInput} /* ... (resto igual) ... */ > <Mic className="h-4 w-4" /> </button>
                     </div>
                     {showVoiceInput && ( <div className="mt-2 p-3 ..."> <VoiceInput onTranscriptionComplete={handleVoiceTranscription} /> </div> )}
                   </div>

                </div>
              ) : (
                // Vista de Narrativa Generada (sin cambios estructurales, pero el contenido será diferente)
                 <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 min-h-[120px] shadow-inner relative">
                     {/* Indicador de carga */}
                     {isGeneratingCaraNarrative && !caraIntervalRef.current && ( <div className="absolute ..."> {/* SVG Spinner */} </div> )}
                     <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                       {displayedCaraNarrative}
                       {/* Cursor */}
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