import React, { useState, useRef } from 'react';
import { Minus, Maximize2, X, Copy, CheckCircle, Loader2, RotateCcw } from "lucide-react";
import { FormDataState, GanglioLinfatico } from '@/types/historiaClinica';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { AnimatedTextareaWithTyping } from "@/components/ui/AnimatedTextareaWithTyping";

interface ExamenCuelloProps {
  formData: FormDataState;
  handleExamenCuelloChange: (part: string, value: string | boolean | GanglioLinfatico) => void;
}

interface CopiedState {
  cervicales?: boolean;
  submaxilares?: boolean;
  submentonianos?: boolean;
  parotideos?: boolean;
  preauriculares?: boolean;
  auricularesPosteriores?: boolean;
}

// Mapa de estilos para evitar la purga de clases dinámicas de Tailwind
const colorStyles: { [key: string]: { bg: string; border: string; text: string; } } = {
  blue: {
    bg: 'bg-emerald-50/30 dark:bg-blue-950/20',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-900 dark:text-blue-100',
  },
  pink: {
    bg: 'bg-pink-50/30 dark:bg-pink-950/20',
    border: 'border-pink-200 dark:border-pink-800',
    text: 'text-pink-900 dark:text-pink-100',
  },
  purple: {
    bg: 'bg-purple-50/30 dark:bg-purple-950/20',
    border: 'border-purple-200 dark:border-purple-800',
    text: 'text-purple-900 dark:text-purple-100',
  },
  red: {
    bg: 'bg-red-50/30 dark:bg-red-950/20',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-900 dark:text-red-100',
  },
  green: {
    bg: 'bg-green-50/30 dark:bg-green-950/20',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-900 dark:text-green-100',
  },
  yellow: {
    bg: 'bg-yellow-50/30 dark:bg-yellow-950/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    text: 'text-yellow-900 dark:text-yellow-100',
  },
};

// Definición de las secciones para mapeo
const sections = [
  { key: 'cervicales', label: '1. Cervicales', color: 'blue' },
  { key: 'submaxilares', label: '2. Submaxilares', color: 'pink' },
  { key: 'submentonianos', label: '3. Submentonianos', color: 'purple' },
  { key: 'parotideos', label: '4. Parotídeos', color: 'red' },
  { key: 'preauriculares', label: '5. Preauriculares', color: 'green' },
  { key: 'auricularesPosteriores', label: '6. Auriculares posteriores', color: 'yellow' }
];

const ExamenCuello: React.FC<ExamenCuelloProps> = ({
  formData,
  handleExamenCuelloChange
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [redacciones, setRedacciones] = useState({
    cervicales: "",
    submaxilares: "",
    submentonianos: "",
    parotideos: "",
    preauriculares: "",
    auricularesPosteriores: ""
  });
  const [copied, setCopied] = useState<CopiedState>({});
  const [copiedAll, setCopiedAll] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const redaccionesRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    setIsMaximized(false);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    setIsMinimized(false);
  };

  const handleClose = () => {
    setIsMinimized(false);
    setIsMaximized(false);
  };

  const handleGanglioChange = (tipo: string, field: string, value: string) => {
    const ganglioActual = formData?.examenCuello?.[tipo] as GanglioLinfatico || {
      palpacion: '',
      consistencia: '',
      dolor: '',
      movilidad: '',
      localizacion: '',
      tamano: '',
      observaciones: ''
    };

    const ganglioActualizado = { ...ganglioActual, [field]: value };
    
    // Si se selecciona "no_palpan", limpiar los demás campos
    if (field === 'palpacion' && value === 'no_palpan') {
      ganglioActualizado.consistencia = '';
      ganglioActualizado.dolor = '';
      ganglioActualizado.movilidad = '';
      ganglioActualizado.localizacion = '';
      ganglioActualizado.tamano = '';
      ganglioActualizado.observaciones = '';
    }

    handleExamenCuelloChange(tipo, ganglioActualizado);
  };

  const getRedaccionNoPalpan = (tipo: string) => {
    const redaccionesNoPalpan: { [key: string]: string[] } = {
      cervicales: [
        "No se palpan ganglios cervicales, el cuello se aprecia simétrico y sin aumento de volumen palpable.",
        "A la exploración no se detectan adenomegalias cervicales; la palpación es indolora y sin irregularidades.",
        "No se identifican ganglios cervicales aumentados de tamaño ni dolor a la palpación.",
        "Los ganglios cervicales no son palpables, conservando la integridad anatómica y sin signos inflamatorios."
      ],
      submaxilares: [
        "No se palpan ganglios submaxilares, la región se observa sin aumento de volumen ni dolor a la palpación.",
        "No se detectan adenomegalias submaxilares, la superficie es lisa y sin alteraciones.",
        "La exploración submaxilar no revela ganglios palpables ni sensibilidad dolorosa.",
        "No se identifican ganglios submaxilares, manteniendo la morfología normal y sin induración."
      ],
      submentonianos: [
        "No se palpan ganglios submentonianos, la región se encuentra sin aumento de volumen ni sensibilidad.",
        "No se aprecian adenomegalias submentonianas a la palpación; la zona presenta consistencia blanda y homogénea.",
        "Los ganglios submentonianos no son palpables ni presentan dolor.",
        "No se observan alteraciones palpables en la región submentoniana."
      ],
      parotideos: [
        "No se palpan ganglios parotídeos, las glándulas se perciben de consistencia y volumen normales.",
        "No se detectan adenomegalias parotídeas ni dolor a la palpación.",
        "Los ganglios parotídeos no son palpables y no se evidencian signos inflamatorios.",
        "A la exploración no se encuentran ganglios parotídeos aumentados ni sensibles."
      ],
      preauriculares: [
        "No se palpan ganglios preauriculares, sin evidencia de aumento de volumen ni sensibilidad.",
        "La región preauricular se encuentra libre de adenomegalias o dolor a la palpación.",
        "No se identifican ganglios preauriculares palpables, manteniendo simetría y textura normal.",
        "Sin hallazgos palpables en la zona preauricular."
      ],
      auricularesPosteriores: [
        "No se palpan ganglios auriculares posteriores, la región se encuentra sin induración ni aumento de volumen.",
        "A la exploración no se detectan adenomegalias retroauriculares ni dolor a la palpación.",
        "No se evidencian ganglios auriculares posteriores palpables.",
        "La zona auricular posterior se encuentra sin alteraciones detectables."
      ]
    };

    const opciones = redaccionesNoPalpan[tipo] || ["No se palpan ganglios."];
    return opciones[Math.floor(Math.random() * opciones.length)];
  };

  const getNombreGanglio = (tipo: string) => {
    const nombres: { [key: string]: string } = {
      cervicales: "cervicales",
      submaxilares: "submaxilares",
      submentonianos: "submentonianos",
      parotideos: "parotídeos",
      preauriculares: "preauriculares",
      auricularesPosteriores: "auriculares posteriores"
    };
    return nombres[tipo] || tipo;
  };

  const generarRedaccionSePalpan = (tipo: string, ganglio: GanglioLinfatico) => {
    const nombre = getNombreGanglio(tipo);
    let redaccion = `Se palpan ganglios ${nombre}`;

    // Agregar localización
    if (ganglio.localizacion === 'bilaterales') {
      redaccion += " bilaterales";
    } else if (ganglio.localizacion === 'unilaterales') {
      redaccion += " unilaterales";
    }

    // Agregar consistencia
    if (ganglio.consistencia === 'firme') {
      redaccion += ", de consistencia firme";
    } else if (ganglio.consistencia === 'blanda') {
      redaccion += ", de consistencia blanda";
    }

    // Agregar dolor
    if (ganglio.dolor === 'no_dolorosos') {
      redaccion += ", no dolorosos a la palpación";
    } else if (ganglio.dolor === 'dolorosos') {
      redaccion += ", dolorosos a la palpación";
    }

    // Agregar movilidad
    if (ganglio.movilidad === 'moviles') {
      redaccion += ", móviles";
    } else if (ganglio.movilidad === 'fijos') {
      redaccion += ", fijos";
    }

    // Agregar tamaño
    if (ganglio.tamano && ganglio.tamano.trim() !== '') {
      redaccion += `, con tamaño aproximado de ${ganglio.tamano}`;
    }

    redaccion += ".";

    // Agregar observaciones si existen
    if (ganglio.observaciones && ganglio.observaciones.trim() !== '') {
      redaccion += ` ${ganglio.observaciones}`;
    }

    return redaccion;
  };

  const generarRedaccionPorTipo = (tipo: string) => {
    const ganglio = formData?.examenCuello?.[tipo] as GanglioLinfatico;
    
    if (!ganglio || ganglio.palpacion === '' || ganglio.palpacion === 'no_palpan') {
      return getRedaccionNoPalpan(tipo);
    }

    if (ganglio.palpacion === 'se_palpan') {
      return generarRedaccionSePalpan(tipo, ganglio);
    }

    return "";
  };

  const generarRedaccionIA = async () => {
    setIsGenerating(true);
    setShowForm(false);
    
    // Simular delay para mostrar la animación
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const nuevasRedacciones = {
      cervicales: generarRedaccionPorTipo('cervicales'),
      submaxilares: generarRedaccionPorTipo('submaxilares'),
      submentonianos: generarRedaccionPorTipo('submentonianos'),
      parotideos: generarRedaccionPorTipo('parotideos'),
      preauriculares: generarRedaccionPorTipo('preauriculares'),
      auricularesPosteriores: generarRedaccionPorTipo('auricularesPosteriores')
    };

    setRedacciones(nuevasRedacciones);
    setIsGenerating(false);
    
    // Scroll hacia la parte superior del contenedor después de generar
    setTimeout(() => {
      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleCopy = async (section: keyof CopiedState) => {
    try {
      const { trackCopyClick } = await import('@/utils/trackCopyClick');
      trackCopyClick();
    } catch (error) {
      console.error('Error tracking copy:', error);
    }
    if (redacciones[section]) {
      navigator.clipboard.writeText(redacciones[section]);
      setCopied(prev => ({
        ...prev,
        [section]: true
      }));
      setTimeout(() => setCopied(prev => ({
        ...prev,
        [section]: false
      })), 2000);
    }
  };

  const handleCopyAll = async () => {
    const fullText = sections.map(section => {
      // Tomar "Cervicales" de "1. Cervicales"
      const redactionLabel = section.label.split('. ')[1];
      return `${redactionLabel}: ${redacciones[section.key as keyof typeof redacciones]}`;
    }).join('\n\n');

    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (error) {
      console.error('Error al copiar todo:', error);
    }
  };


  const limpiarFormulario = () => {
    const ganglioLimpio: GanglioLinfatico = {
      palpacion: '',
      consistencia: '',
      dolor: '',
      movilidad: '',
      localizacion: '',
      tamano: '',
      observaciones: ''
    };

    handleExamenCuelloChange('cervicales', ganglioLimpio);
    handleExamenCuelloChange('submaxilares', ganglioLimpio);
    handleExamenCuelloChange('submentonianos', ganglioLimpio);
    handleExamenCuelloChange('parotideos', ganglioLimpio);
    handleExamenCuelloChange('preauriculares', ganglioLimpio);
    handleExamenCuelloChange('auricularesPosteriores', ganglioLimpio);

    setShowForm(true);
    setRedacciones({
      cervicales: "",
      submaxilares: "",
      submentonianos: "",
      parotideos: "",
      preauriculares: "",
      auricularesPosteriores: ""
    });
  };

  const OpcionBoton = ({
    tipo,
    campo,
    valor,
    etiqueta
  }: {
    tipo: string;
    campo: string;
    valor: string;
    etiqueta: string;
  }) => {
    const ganglio = formData?.examenCuello?.[tipo] as GanglioLinfatico;
    const isSelected = ganglio?.[campo] === valor;

    return (
      <button
        type="button"
        onClick={() => handleGanglioChange(tipo, campo, valor)}
        className={`px-3 py-1.5 rounded-md text-xs transition-all ${
          isSelected
            ? "bg-zinc-800 text-white shadow-sm"
            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
      >
        {etiqueta}
      </button>
    );
  };

  const SeccionGanglio = ({
    tipo,
    titulo,
    colorName
  }: {
    tipo: string;
    titulo: string;
    colorName: string;
  }) => {
    const ganglio = formData?.examenCuello?.[tipo] as GanglioLinfatico;
    const sePalpan = ganglio?.palpacion === 'se_palpan';
    const styles = colorStyles[colorName] || colorStyles.blue;

    return (
      <div className={`p-4 rounded-lg border ${styles.bg} ${styles.border}`}>
        <h4 className={`text-base font-semibold mb-3 flex items-center gap-2 ${styles.text}`}>
          {titulo}
        </h4>

        <div className="space-y-3">
          {/* Palpación */}
          <div>
            <Label className="text-xs font-medium mb-1.5 block">Palpación</Label>
            <div className="flex gap-2">
              <OpcionBoton tipo={tipo} campo="palpacion" valor="no_palpan" etiqueta="No se palpan" />
              <OpcionBoton tipo={tipo} campo="palpacion" valor="se_palpan" etiqueta="Se palpan" />
            </div>
          </div>

          {/* Características - solo mostrar si se palpan */}
          {sePalpan && (
            <div className="space-y-3 pl-3 border-l-2 border-blue-300 dark:border-blue-700">
              {/* Consistencia */}
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Consistencia</Label>
                <div className="flex gap-2">
                  <OpcionBoton tipo={tipo} campo="consistencia" valor="firme" etiqueta="Firme" />
                  <OpcionBoton tipo={tipo} campo="consistencia" valor="blanda" etiqueta="Blanda" />
                </div>
              </div>

              {/* Dolor */}
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Dolor</Label>
                <div className="flex gap-2">
                  <OpcionBoton tipo={tipo} campo="dolor" valor="dolorosos" etiqueta="Dolorosos" />
                  <OpcionBoton tipo={tipo} campo="dolor" valor="no_dolorosos" etiqueta="No dolorosos" />
                </div>
              </div>

              {/* Movilidad */}
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Movilidad</Label>
                <div className="flex gap-2">
                  <OpcionBoton tipo={tipo} campo="movilidad" valor="moviles" etiqueta="Móviles" />
                  <OpcionBoton tipo={tipo} campo="movilidad" valor="fijos" etiqueta="Fijos" />
                </div>
              </div>

              {/* Localización */}
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Localización</Label>
                <div className="flex gap-2">
                  <OpcionBoton tipo={tipo} campo="localizacion" valor="unilaterales" etiqueta="Unilaterales" />
                  <OpcionBoton tipo={tipo} campo="localizacion" valor="bilaterales" etiqueta="Bilaterales" />
                </div>
              </div>

              {/* Tamaño */}
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Tamaño aproximado (mm/cm)</Label>
                <Input
                  type="text"
                  value={ganglio?.tamano || ''}
                  onChange={(e) => handleGanglioChange(tipo, 'tamano', e.target.value)}
                  placeholder="Ej: 8 mm, 1 cm"
                  className="text-sm"
                />
              </div>

              {/* Observaciones */}
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Observaciones</Label>
                <Textarea
                  value={ganglio?.observaciones || ''}
                  onChange={(e) => handleGanglioChange(tipo, 'observaciones', e.target.value)}
                  placeholder="Observaciones adicionales..."
                  className="text-sm min-h-[60px]"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`} data-formulario-section="examen-cuello">
      <div className="w-full bg-transparent">

            





        {!isMinimized && (
          <>
            {showForm ? (
              <div className="p-6 space-y-4">
                {sections.map(({ key, label, color }) => (
                  <SeccionGanglio
                    key={key}
                    tipo={key}
                    titulo={label}
                    colorName={color}
                  />
                ))}

                {/* --- Botón de Acción --- */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-100 dark:border-gray-800 mt-4">
                  <Button
                    onClick={generarRedaccionIA}
                    className="hidden data-trigger-generation"
                    aria-label="Generar redacción examen cuello"
                  />
                  <Button
                    variant="ghost"
                    onClick={limpiarFormulario}
                    className="text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                  >
                    <RotateCcw className="w-3 h-3 mr-2" />
                    Reiniciar Sección
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-4" ref={redaccionesRef}>
                {isGenerating && (
                  <div className="flex items-center gap-2 mb-4 text-emerald-600 dark:text-emerald-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Generando redacciones...</span>
                  </div>
                )}
                
                {sections.map(({ key, label, color }) => {
                  const redactionLabel = label.split('. ')[1];
                  const styles = colorStyles[color] || colorStyles.blue;
                  return (
                    <div key={key} className={`p-4 rounded-lg border ${styles.bg} ${styles.border}`}>
                      <div className="flex items-center justify-between mb-2">
                        <Label className={`text-base font-semibold ${styles.text}`}>
                          {redactionLabel}
                        </Label>
                        <Button
                          onClick={() => handleCopy(key as keyof CopiedState)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          disabled={isGenerating}
                        >
                          {copied[key as keyof CopiedState] ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {isGenerating ? (
                        <Textarea
                          value=""
                          className="bg-white dark:bg-gray-900 min-h-[90px]"
                          readOnly
                        />
                      ) : (
                        <AnimatedTextareaWithTyping
                          content={redacciones[key as keyof typeof redacciones]}
                          className="bg-white dark:bg-gray-900 min-h-[90px]"
                        />
                      )}
                    </div>
                  );
                })}

                {/* Botones de acción */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleCopyAll}
                    className="flex-1"
                  >
                    {copiedAll ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    Copiar Todo
                  </Button>
                  <Button
                    onClick={() => setShowForm(true)}
                    variant="outline"
                    className="flex-1"
                  >
                    Volver al Formulario
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ExamenCuello;

