import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X, Copy, CheckCircle } from "lucide-react";
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
  const redaccionesRef = useRef<HTMLDivElement>(null);

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
    const ganglioActual = formData.examenCuello?.[tipo] as GanglioLinfatico || {
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
    const redaccionesNoPalpan = {
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
    const nombres = {
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
    const ganglio = formData.examenCuello?.[tipo] as GanglioLinfatico;
    
    if (!ganglio || ganglio.palpacion === '' || ganglio.palpacion === 'no_palpan') {
      return getRedaccionNoPalpan(tipo);
    }

    if (ganglio.palpacion === 'se_palpan') {
      return generarRedaccionSePalpan(tipo, ganglio);
    }

    return "";
  };

  const generarRedaccionIA = () => {
    const nuevasRedacciones = {
      cervicales: generarRedaccionPorTipo('cervicales'),
      submaxilares: generarRedaccionPorTipo('submaxilares'),
      submentonianos: generarRedaccionPorTipo('submentonianos'),
      parotideos: generarRedaccionPorTipo('parotideos'),
      preauriculares: generarRedaccionPorTipo('preauriculares'),
      auricularesPosteriores: generarRedaccionPorTipo('auricularesPosteriores')
    };

    setRedacciones(nuevasRedacciones);
    setShowForm(false);
    
    // Scroll solo al generar redacción IA
    setTimeout(() => {
      const cuelloContainer = document.querySelector('[data-formulario-section="examen-cuello"]');
      cuelloContainer?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    etiqueta,
    colorClass
  }: {
    tipo: string;
    campo: string;
    valor: string;
    etiqueta: string;
    colorClass?: string;
  }) => {
    const ganglio = formData.examenCuello?.[tipo] as GanglioLinfatico;
    const isSelected = ganglio?.[campo] === valor;

    return (
      <button
        type="button"
        onClick={() => handleGanglioChange(tipo, campo, valor)}
        className={`px-4 py-2 rounded-md text-base transition-all ${
          isSelected
            ? colorClass || "bg-primary text-primary-foreground shadow-md"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
      >
        {etiqueta}
      </button>
    );
  };

  const getColorConfig = (tipo: string) => {
    const configs = {
      cervicales: {
        bg: "bg-primary/10 border-primary/30",
        button: "bg-primary text-primary-foreground",
        textareaBorder: "border-primary/40"
      },
      submaxilares: {
        bg: "bg-secondary/10 border-secondary/30",
        button: "bg-secondary text-secondary-foreground",
        textareaBorder: "border-secondary/40"
      },
      submentonianos: {
        bg: "bg-accent/10 border-accent/30",
        button: "bg-accent text-accent-foreground",
        textareaBorder: "border-accent/40"
      },
      parotideos: {
        bg: "bg-muted/30 border-muted-foreground/20",
        button: "bg-muted text-muted-foreground",
        textareaBorder: "border-muted-foreground/30"
      },
      preauriculares: {
        bg: "bg-primary/5 border-primary/20",
        button: "bg-primary/80 text-primary-foreground",
        textareaBorder: "border-primary/30"
      },
      auricularesPosteriores: {
        bg: "bg-secondary/5 border-secondary/20",
        button: "bg-secondary/80 text-secondary-foreground",
        textareaBorder: "border-secondary/30"
      }
    };
    return configs[tipo] || configs.cervicales;
  };

  const SeccionGanglio = ({
    tipo,
    titulo
  }: {
    tipo: string;
    titulo: string;
  }) => {
    const ganglio = formData.examenCuello?.[tipo] as GanglioLinfatico;
    const sePalpan = ganglio?.palpacion === 'se_palpan';
    const colors = getColorConfig(tipo);

    return (
      <div className={`p-5 rounded-lg border-2 ${colors.bg}`}>
        <h4 className="text-base font-semibold mb-4">
          {titulo}
        </h4>

        <div className="space-y-4">
          {/* Palpación */}
          <div>
            <Label className="text-base font-medium mb-2 block">Palpación</Label>
            <div className="flex gap-2">
              <OpcionBoton tipo={tipo} campo="palpacion" valor="no_palpan" etiqueta="No se palpan" colorClass={colors.button} />
              <OpcionBoton tipo={tipo} campo="palpacion" valor="se_palpan" etiqueta="Se palpan" colorClass={colors.button} />
            </div>
          </div>

          {/* Características - solo mostrar si se palpan */}
          {sePalpan && (
            <div className="space-y-4">
              {/* Consistencia */}
              <div>
                <Label className="text-base font-medium mb-2 block">Consistencia</Label>
                <div className="flex gap-2">
                  <OpcionBoton tipo={tipo} campo="consistencia" valor="firme" etiqueta="Firme" colorClass={colors.button} />
                  <OpcionBoton tipo={tipo} campo="consistencia" valor="blanda" etiqueta="Blanda" colorClass={colors.button} />
                </div>
              </div>

              {/* Dolor */}
              <div>
                <Label className="text-base font-medium mb-2 block">Dolor</Label>
                <div className="flex gap-2">
                  <OpcionBoton tipo={tipo} campo="dolor" valor="dolorosos" etiqueta="Dolorosos" colorClass={colors.button} />
                  <OpcionBoton tipo={tipo} campo="dolor" valor="no_dolorosos" etiqueta="No dolorosos" colorClass={colors.button} />
                </div>
              </div>

              {/* Movilidad */}
              <div>
                <Label className="text-base font-medium mb-2 block">Movilidad</Label>
                <div className="flex gap-2">
                  <OpcionBoton tipo={tipo} campo="movilidad" valor="moviles" etiqueta="Móviles" colorClass={colors.button} />
                  <OpcionBoton tipo={tipo} campo="movilidad" valor="fijos" etiqueta="Fijos" colorClass={colors.button} />
                </div>
              </div>

              {/* Localización */}
              <div>
                <Label className="text-base font-medium mb-2 block">Localización</Label>
                <div className="flex gap-2">
                  <OpcionBoton tipo={tipo} campo="localizacion" valor="unilaterales" etiqueta="Unilaterales" colorClass={colors.button} />
                  <OpcionBoton tipo={tipo} campo="localizacion" valor="bilaterales" etiqueta="Bilaterales" colorClass={colors.button} />
                </div>
              </div>

              {/* Tamaño */}
              <div>
                <Label className="text-base font-medium mb-2 block">Tamaño aproximado (mm/cm)</Label>
                <Input
                  type="text"
                  value={ganglio?.tamano || ''}
                  onChange={(e) => handleGanglioChange(tipo, 'tamano', e.target.value)}
                  placeholder="Ej: 8 mm, 1 cm"
                  className="text-base"
                />
              </div>

              {/* Observaciones */}
              <div>
                <Label className="text-base font-medium mb-2 block">Observaciones</Label>
                <div className={`p-3 rounded-md border-2 ${colors.textareaBorder} ${colors.bg}`}>
                  <Textarea
                    value={ganglio?.observaciones || ''}
                    onChange={(e) => handleGanglioChange(tipo, 'observaciones', e.target.value)}
                    placeholder="Observaciones adicionales..."
                    className="text-base min-h-[70px] border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`} data-formulario-section="examen-cuello">
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-0.5 sm:p-1">
              <button 
                onClick={() => setShowForm(true)}
                className={`px-3 sm:px-5 py-1 sm:py-1.5 rounded-full transition-all duration-300 text-xs sm:text-sm ${
                  showForm 
                    ? "bg-blue-500 text-white shadow-md" 
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Formulario
              </button>
              <button 
                onClick={() => setShowForm(false)}
                className={`px-3 sm:px-5 py-1 sm:py-1.5 rounded-full transition-all duration-300 text-xs sm:text-sm ${
                  !showForm 
                    ? "bg-blue-500 text-white shadow-md" 
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Redacción IA
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={handleMinimize} className="p-0.5 sm:p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors">
              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button onClick={handleMaximize} className="p-0.5 sm:p-1 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors">
              <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button onClick={handleClose} className="p-0.5 sm:p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        <div className="flex justify-start px-6 py-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-muted-foreground">XII.</span> CUELLO
          </h2>
        </div>

        {!isMinimized && (
          <>
            {showForm ? (
              <div className="p-6 space-y-5">
                <SeccionGanglio tipo="cervicales" titulo="1. Cervicales" />
                <SeccionGanglio tipo="submaxilares" titulo="2. Submaxilares" />
                <SeccionGanglio tipo="submentonianos" titulo="3. Submentonianos" />
                <SeccionGanglio tipo="parotideos" titulo="4. Parotídeos" />
                <SeccionGanglio tipo="preauriculares" titulo="5. Preauriculares" />
                <SeccionGanglio tipo="auricularesPosteriores" titulo="6. Auriculares posteriores" />

                {/* Botones de acción */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={generarRedaccionIA}
                    className="flex-1 text-base py-6"
                  >
                    Generar Redacción IA
                  </Button>
                  <Button
                    onClick={limpiarFormulario}
                    variant="outline"
                    className="flex-1 text-base py-6"
                  >
                    Limpiar Formulario
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-5" ref={redaccionesRef}>
                {/* Redacción Cervicales */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Cervicales</Label>
                    <Button
                      onClick={() => handleCopy('cervicales')}
                      variant="ghost"
                      size="sm"
                      className="h-9 px-3 text-base"
                    >
                      {copied.cervicales ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <div className="p-3 rounded-md border-2 bg-primary/10 border-primary/40">
                    <AnimatedTextareaWithTyping
                      content={redacciones.cervicales}
                      className="min-h-[70px] text-base border-0 bg-transparent"
                      readOnly
                    />
                  </div>
                </div>

                {/* Redacción Submaxilares */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Submaxilares</Label>
                    <Button
                      onClick={() => handleCopy('submaxilares')}
                      variant="ghost"
                      size="sm"
                      className="h-9 px-3 text-base"
                    >
                      {copied.submaxilares ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <div className="p-3 rounded-md border-2 bg-secondary/10 border-secondary/40">
                    <AnimatedTextareaWithTyping
                      content={redacciones.submaxilares}
                      className="min-h-[70px] text-base border-0 bg-transparent"
                      readOnly
                    />
                  </div>
                </div>

                {/* Redacción Submentonianos */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Submentonianos</Label>
                    <Button
                      onClick={() => handleCopy('submentonianos')}
                      variant="ghost"
                      size="sm"
                      className="h-9 px-3 text-base"
                    >
                      {copied.submentonianos ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <div className="p-3 rounded-md border-2 bg-accent/10 border-accent/40">
                    <AnimatedTextareaWithTyping
                      content={redacciones.submentonianos}
                      className="min-h-[70px] text-base border-0 bg-transparent"
                      readOnly
                    />
                  </div>
                </div>

                {/* Redacción Parotídeos */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Parotídeos</Label>
                    <Button
                      onClick={() => handleCopy('parotideos')}
                      variant="ghost"
                      size="sm"
                      className="h-9 px-3 text-base"
                    >
                      {copied.parotideos ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <div className="p-3 rounded-md border-2 bg-muted/30 border-muted-foreground/30">
                    <AnimatedTextareaWithTyping
                      content={redacciones.parotideos}
                      className="min-h-[70px] text-base border-0 bg-transparent"
                      readOnly
                    />
                  </div>
                </div>

                {/* Redacción Preauriculares */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Preauriculares</Label>
                    <Button
                      onClick={() => handleCopy('preauriculares')}
                      variant="ghost"
                      size="sm"
                      className="h-9 px-3 text-base"
                    >
                      {copied.preauriculares ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <div className="p-3 rounded-md border-2 bg-primary/5 border-primary/30">
                    <AnimatedTextareaWithTyping
                      content={redacciones.preauriculares}
                      className="min-h-[70px] text-base border-0 bg-transparent"
                      readOnly
                    />
                  </div>
                </div>

                {/* Redacción Auriculares Posteriores */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Auriculares posteriores</Label>
                    <Button
                      onClick={() => handleCopy('auricularesPosteriores')}
                      variant="ghost"
                      size="sm"
                      className="h-9 px-3 text-base"
                    >
                      {copied.auricularesPosteriores ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <div className="p-3 rounded-md border-2 bg-secondary/5 border-secondary/30">
                    <AnimatedTextareaWithTyping
                      content={redacciones.auricularesPosteriores}
                      className="min-h-[70px] text-base border-0 bg-transparent"
                      readOnly
                    />
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setShowForm(true)}
                    variant="outline"
                    className="flex-1 text-base py-6"
                  >
                    Volver al Formulario
                  </Button>
                  <Button
                    onClick={limpiarFormulario}
                    variant="outline"
                    className="flex-1 text-base py-6"
                  >
                    Limpiar Formulario
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default ExamenCuello;