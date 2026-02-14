import React, { useState, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormDataState } from '@/types/historiaClinica';
import { Button } from "@/components/ui/button";
import { Minus, Maximize2, X, Copy, CheckCircle, ChevronDown, Sparkles } from "lucide-react";
import { AnimatedTextareaWithTyping } from "@/components/ui/AnimatedTextareaWithTyping"; // Asegúrate de tener este componente
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Interfaz para características faciales detalladas (reutilizada)
interface CaracteristicaFacial {
  presente?: boolean;
  detalles?: string;
  descripcion?: string; // Añadido para Asimetrías y Edema
  tamanio?: string;
  color?: string;
  bordes?: string;
  localizacion?: string;
  grado?: string;
  consistencia?: string;
  tipo?: string;
  zonaAfectada?: string;
}

// Interfaz para el estado 'cara' dentro de 'examenCabeza'
interface CaraState {
  tez?: string;
  estadoPiel?: string;
  lunares?: CaracteristicaFacial;
  cicatrices?: CaracteristicaFacial;
  asimetriasFaciales?: CaracteristicaFacial;
  edema?: CaracteristicaFacial;
  observaciones?: string;
}

// Actualizamos FormDataState para reflejar la nueva estructura anidada
// (Esto es una suposición de cómo se ve tu tipo FormDataState)
declare module '@/types/historiaClinica' {
  interface ExamenCabezaState {
    tipoCraneo?: string;
    tipoPerfil?: string;
    cara?: CaraState;
    // ... otros campos de examenCabeza si los hubiera
  }
}

interface ExamenCabezaProps {
  formData: FormDataState;
  handleExamenCabezaChange: (part: string, value: any) => void;
  onRedaccionGenerada?: (redaccion: string) => void;
  onToggleViewMode?: () => void;
}

const ExamenCabeza = ({ formData, handleExamenCabezaChange, onRedaccionGenerada, onToggleViewMode }: ExamenCabezaProps) => {
  // Estados para la UI de la tarjeta y la redacción
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [redaccionCara, setRedaccionCara] = useState("");
  const [copied, setCopied] = useState(false);
  const redaccionRef = useRef<HTMLDivElement>(null);

  // --- Manejadores de la UI de la Tarjeta ---
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

  // --- Manejadores de Datos del Formulario ---

  // Manejador para campos simples dentro de 'cara'
  const handleCaraChange = (field: keyof CaraState, value: string | boolean) => {
    const currentCara = formData.examenCabeza.cara as CaraState || {};
    const updatedCara = {
      ...currentCara,
      [field]: value
    };
    handleExamenCabezaChange('cara', updatedCara);
  };

  // Manejador para campos detallados (lunares, cicatrices, etc.) dentro de 'cara'
  const handleDetailedChange = (category: keyof CaraState, field: string, value: string | boolean) => {
    const currentCara = formData.examenCabeza.cara as CaraState || {};
    const currentData = (currentCara[category] as CaracteristicaFacial) || {};

    const updatedData = {
      ...currentData,
      [field]: value
    };

    const updatedCara = {
      ...currentCara,
      [category]: updatedData
    };

    handleExamenCabezaChange('cara', updatedCara);
  };

  // --- Funciones 'Get' para obtener valores del formulario ---

  // Obtiene valor de campos de primer nivel (tipoCraneo, tipoPerfil)
  const getFormValue = (field: 'tipoCraneo' | 'tipoPerfil'): string => {
    const value = formData.examenCabeza[field];
    return typeof value === 'string' ? value : '';
  };

  // Obtiene valor de campos simples dentro de 'cara'
  const getFormValueCara = (field: keyof CaraState): string => {
    const value = formData.examenCabeza.cara?.[field];
    return typeof value === 'string' ? value : '';
  };

  // Obtiene valor de un campo 'select' dentro de una categoría detallada
  const getSelectValue = (category: keyof CaraState, field: string): string => {
    const data = formData.examenCabeza.cara?.[category] as CaracteristicaFacial;
    const value = data?.[field as keyof CaracteristicaFacial];
    return typeof value === 'string' ? value : '';
  };

  // Obtiene valor booleano 'presente' de una categoría detallada
  const getCheckboxValue = (category: keyof CaraState): boolean => {
    const data = formData.examenCabeza.cara?.[category];
    if (typeof data === 'object' && data !== null && 'presente' in data) {
      return (data as CaracteristicaFacial).presente || false;
    }
    return false;
  };

  // --- Lógica de Redacción IA y Limpieza ---

  const limpiarFormulario = () => {
    // Limpia campos de primer nivel
    handleExamenCabezaChange('tipoCraneo', '');
    handleExamenCabezaChange('tipoPerfil', '');

    // Limpia el objeto 'cara'
    const caraLimpia: CaraState = {
      tez: '',
      estadoPiel: '',
      lunares: { presente: false, detalles: '', tamanio: '', color: '' },
      cicatrices: { presente: false, detalles: '', tamanio: '', bordes: '', localizacion: '' },
      asimetriasFaciales: { presente: false, descripcion: '', tipo: '', zonaAfectada: '' },
      edema: { presente: false, descripcion: '', grado: '', localizacion: '', consistencia: '' },
      observaciones: ''
    };
    handleExamenCabezaChange('cara', caraLimpia);

    // Resetea la vista
    setRedaccionCara("");
    setShowForm(true);
  };

  const generarRedaccionIA = () => {
    const { tipoCraneo, tipoPerfil, cara: caraData } = formData.examenCabeza;
    const cara = caraData as CaraState;
    let redaccion = "Al examen de cabeza, ";

    // 1. Cráneo y Perfil
    if (tipoCraneo) {
      const craneoLabel = {
        mesocefalo: "mesocéfalo",
        dolicocefalo: "dolicocéfalo",
        braquicefalo: "braquicéfalo"
      }[tipoCraneo] || tipoCraneo;
      redaccion += `se observa un cráneo de tipo ${craneoLabel}`;
    } else {
      redaccion += "no se especifica el tipo de cráneo";
    }

    if (tipoPerfil) {
      const perfilLabel = {
        recto: "recto",
        convexo: "convexo",
        concavo: "cóncavo"
      }[tipoPerfil] || tipoPerfil;
      redaccion += `, con un perfil facial ${perfilLabel}. `;
    } else {
      redaccion += ". ";
    }

    // 2. Detalles de la Cara
    if (cara) {
      redaccion += "En la inspección facial, ";
      const detallesCara: string[] = [];

      if (cara.tez) {
        detallesCara.push(`la tez del paciente es ${cara.tez}`);
      }
      if (cara.estadoPiel) {
        const pielLabel = cara.estadoPiel === 'reseca' ? 'reseca' : 'adecuadamente humectada';
        detallesCara.push(`la piel se encuentra ${pielLabel}`);
      }

      // Lunares
      if (cara.lunares?.presente) {
        let descLunares = "se observan lunares";
        const detallesLunares = [];
        if (cara.lunares.tamanio) detallesLunares.push(`de tamaño ${cara.lunares.tamanio}`);
        if (cara.lunares.color) detallesLunares.push(`de color ${cara.lunares.color}`);
        if (cara.lunares.detalles) detallesLunares.push(`descritos como: "${cara.lunares.detalles}"`);

        if (detallesLunares.length > 0) {
          descLunares += ` ${detallesLunares.join(', ')}`;
        }
        detallesCara.push(descLunares);
      } else {
        detallesCara.push("no se observan lunares de relevancia");
      }

      // Cicatrices
      if (cara.cicatrices?.presente) {
        let descCicatrices = "presenta cicatrices";
        const detallesCicatrices = [];
        if (cara.cicatrices.localizacion) detallesCicatrices.push(`localizadas en ${cara.cicatrices.localizacion}`);
        if (cara.cicatrices.tamanio) detallesCicatrices.push(`de tamaño ${cara.cicatrices.tamanio}`);
        if (cara.cicatrices.bordes) detallesCicatrices.push(`con bordes ${cara.cicatrices.bordes}`);
        if (cara.cicatrices.detalles) detallesCicatrices.push(`descritas como: "${cara.cicatrices.detalles}"`);

        if (detallesCicatrices.length > 0) {
          descCicatrices += ` ${detallesCicatrices.join(' ')}`;
        }
        detallesCara.push(descCicatrices);
      } else {
        detallesCara.push("sin cicatrices visibles");
      }

      // Asimetrías
      if (cara.asimetriasFaciales?.presente) {
        let descAsimetrias = "se detecta asimetría facial";
        const detallesAsimetrias = [];
        if (cara.asimetriasFaciales.tipo) detallesAsimetrias.push(`de tipo ${cara.asimetriasFaciales.tipo}`);
        if (cara.asimetriasFaciales.zonaAfectada) detallesAsimetrias.push(`en el ${cara.asimetriasFaciales.zonaAfectada}`);
        if (cara.asimetriasFaciales.descripcion) detallesAsimetrias.push(`descrita como: "${cara.asimetriasFaciales.descripcion}"`);

        if (detallesAsimetrias.length > 0) {
          descAsimetrias += ` ${detallesAsimetrias.join(', ')}`;
        }
        detallesCara.push(descAsimetrias);
      } else {
        detallesCara.push("la cara se observa simétrica");
      }

      // Edema
      if (cara.edema?.presente) {
        let descEdema = "se evidencia edema";
        const detallesEdema = [];
        if (cara.edema.grado) detallesEdema.push(`de grado ${cara.edema.grado}`);
        if (cara.edema.localizacion) detallesEdema.push(`con localización en ${cara.edema.localizacion}`);
        if (cara.edema.consistencia) detallesEdema.push(`de consistencia ${cara.edema.consistencia}`);
        if (cara.edema.descripcion) detallesEdema.push(`descrito como: "${cara.edema.descripcion}"`);

        if (detallesEdema.length > 0) {
          descEdema += ` ${detallesEdema.join(', ')}`;
        }
        detallesCara.push(descEdema);
      } else {
        detallesCara.push("sin presencia de edema facial");
      }

      // Unir detalles de la cara
      if (detallesCara.length > 0) {
        redaccion += detallesCara.join(', ') + ".";
      } else {
        redaccion += "sin hallazgos patológicos aparentes. ";
      }

      // Observaciones de la Cara
      if (cara.observaciones) {
        redaccion += ` Observaciones adicionales de la cara: ${cara.observaciones}`;
      }
    } else {
      redaccion += " No se realizó un examen detallado de la cara.";
    }

    setRedaccionCara(redaccion.trim());
    if (onRedaccionGenerada) {
      onRedaccionGenerada(redaccion.trim());
    }
    setShowForm(false);
    redaccionRef.current?.scrollIntoView({ behavior: 'smooth' });

    if (onToggleViewMode) {
      onToggleViewMode();
    }
  };

  const handleCopy = async () => {
    // Lógica de seguimiento (opcional, traída del ejemplo)
    try {
      const { trackCopyClick } = await import('@/utils/trackCopyClick');
      trackCopyClick();
    } catch (error) {
      console.error('Error tracking copy:', error);
    }

    if (redaccionCara) {
      navigator.clipboard.writeText(redaccionCara);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // --- Renderizado del Componente ---
  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`} data-formulario-section="examen-cabeza">
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>

        {/* --- Barra Superior (Controles) --- */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-0.5 sm:p-1">
              <button
                onClick={() => setShowForm(true)}
                className={`px-3 sm:px-5 py-1 sm:py-1.5 rounded-full transition-all duration-300 text-xs sm:text-sm ${showForm ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}
              >
                Formulario
              </button>
              <button
                onClick={() => setShowForm(false)}
                className={`px-3 sm:px-5 py-1 sm:py-1.5 rounded-full transition-all duration-300 text-xs sm:text-sm ${!showForm ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}
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

        {/* --- Título de la Sección --- */}
        <div className="flex justify-start px-6 py-2">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Examen de Cabeza
          </h2>
        </div>

        {!isMinimized && (
          <CardContent className="p-6">
            {showForm ? (
              // --- VISTA DE FORMULARIO ---
              <div className="space-y-8">

                {/* Tipo de Cráneo */}
                <div className="space-y-4">
                  <Label className="text-base font-medium text-gray-800 dark:text-white">Tipo de Cráneo</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'mesocefalo', label: 'Mesocéfalo', image: '/mesocefalo.svg' },
                      { value: 'dolicocefalo', label: 'Dolicocéfalo', image: '/dolicocefalo.svg' },
                      { value: 'braquicefalo', label: 'Braquicéfalo', image: '/braquicefalo.svg' }
                    ].map((tipo) => (
                      <div key={tipo.value} className="flex flex-col items-center space-y-2">
                        {/* --- INICIO DE LA MODIFICACIÓN --- */}
                        <div
                          className={`relative w-32 h-32 rounded-lg border-2 transition-all duration-200 cursor-pointer overflow-hidden ${getFormValue('tipoCraneo') === tipo.value
                            ? 'border-blue-500 scale-105 shadow-lg' // MODIFICADO: Sin ring, sombra más sutil
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500'
                            }`}
                          onClick={() => {
                            // MODIFICADO: Lógica para deseleccionar
                            const currentValue = getFormValue('tipoCraneo');
                            handleExamenCabezaChange('tipoCraneo', currentValue === tipo.value ? '' : tipo.value);
                          }}
                        >
                          <img
                            src={tipo.image}
                            alt={tipo.label}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        {/* --- FIN DE LA MODIFICACIÓN --- */}
                        <Label className="text-sm text-center text-gray-700 dark:text-gray-300">{tipo.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tipo de Perfil */}
                <div className="space-y-4">
                  <Label className="text-base font-medium text-gray-800 dark:text-white">Tipo de Perfil</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'recto', label: 'Recto', image: '/recto.svg' },
                      { value: 'convexo', label: 'Convexo', image: '/convexo.svg' },
                      { value: 'concavo', label: 'Cóncavo', image: '/concavo.svg' }
                    ].map((perfil) => (
                      <div key={perfil.value} className="flex flex-col items-center space-y-2">
                        {/* --- INICIO DE LA MODIFICACIÓN --- */}
                        <div
                          className={`relative w-32 h-32 rounded-lg border-2 transition-all duration-200 cursor-pointer overflow-hidden ${getFormValue('tipoPerfil') === perfil.value
                            ? 'border-blue-500 scale-105 shadow-lg' // MODIFICADO: Sin ring, sombra más sutil
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500'
                            }`}
                          onClick={() => {
                            // MODIFICADO: Lógica para deseleccionar
                            const currentValue = getFormValue('tipoPerfil');
                            handleExamenCabezaChange('tipoPerfil', currentValue === perfil.value ? '' : perfil.value);
                          }}
                        >
                          <img
                            src={perfil.image}
                            alt={perfil.label}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        {/* --- FIN DE LA MODIFICACIÓN --- */}
                        <Label className="text-sm text-center text-gray-700 dark:text-gray-300">{perfil.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* --- NUEVA SECCIÓN: CARA --- */}
                <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Inspección Facial (Cara)
                  </h3>

                  {/* Grid para Tez y Estado de Piel */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tez */}
                    <div className="space-y-3">
                      <Label className="font-medium text-gray-700 dark:text-gray-300">Tez</Label>
                      <Select
                        value={getFormValueCara('tez')}
                        onValueChange={(value) => handleCaraChange('tez', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo de tez" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clara">Clara</SelectItem>
                          <SelectItem value="morena">Morena</SelectItem>
                          <SelectItem value="oscura">Oscura</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Estado de la Piel */}
                    <div className="space-y-3">
                      <Label className="font-medium text-gray-700 dark:text-gray-300">Estado de la Piel</Label>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {[
                          { value: 'reseca', label: 'Reseca' },
                          { value: 'humectada', label: 'Humectada' }
                        ].map((estado) => (
                          <Button
                            key={estado.value}
                            type="button"
                            variant={getFormValueCara('estadoPiel') === estado.value ? 'default' : 'outline'}
                            size="sm"
                            className="h-8 px-3 text-xs"
                            onClick={() => handleCaraChange('estadoPiel', getFormValueCara('estadoPiel') === estado.value ? '' : estado.value)}
                          >
                            {estado.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Grid para Hallazgos Detallados */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Lunares */}
                    <Collapsible
                      open={getCheckboxValue('lunares')}
                      onOpenChange={(open) => handleDetailedChange('lunares', 'presente', open)}
                      className="bg-gray-50/50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full justify-between p-4 hover:bg-accent/50"
                        >
                          <span className="text-base font-medium text-gray-800 dark:text-white">Lunares</span>
                          <ChevronDown className={`h-4 w-4 transition-transform ${getCheckboxValue('lunares') ? 'rotate-180' : ''}`} />
                        </Button>
                      </CollapsibleTrigger>

                      <CollapsibleContent className="px-4 pb-4">
                        <div className="space-y-4 ml-2 pt-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <Label className="text-sm">Tamaño</Label>
                              <Select
                                value={getSelectValue('lunares', 'tamanio')}
                                onValueChange={(value) => handleDetailedChange('lunares', 'tamanio', value)}
                              >
                                <SelectTrigger><SelectValue placeholder="Tamaño" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pequeno">Pequeño (&lt;5mm)</SelectItem>
                                  <SelectItem value="mediano">Mediano (5-10mm)</SelectItem>
                                  <SelectItem value="grande">Grande (&gt;10mm)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-sm">Color</Label>
                              <Select
                                value={getSelectValue('lunares', 'color')}
                                onValueChange={(value) => handleDetailedChange('lunares', 'color', value)}
                              >
                                <SelectTrigger><SelectValue placeholder="Color" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="marron-claro">Marrón claro</SelectItem>
                                  <SelectItem value="marron-oscuro">Marrón oscuro</SelectItem>
                                  <SelectItem value="negro">Negro</SelectItem>
                                  <SelectItem value="rojizo">Rojizo</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm">Detalles</Label>
                            <Textarea
                              placeholder="Describe características, ubicación, etc."
                              value={getSelectValue('lunares', 'detalles')}
                              onChange={(e) => handleDetailedChange('lunares', 'detalles', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Asimetrías Faciales */}
                    <Collapsible
                      open={getCheckboxValue('asimetriasFaciales')}
                      onOpenChange={(open) => handleDetailedChange('asimetriasFaciales', 'presente', open)}
                      className="bg-gray-50/50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full justify-between p-4 hover:bg-accent/50"
                        >
                          <span className="text-base font-medium text-gray-800 dark:text-white">Asimetrías Faciales</span>
                          <ChevronDown className={`h-4 w-4 transition-transform ${getCheckboxValue('asimetriasFaciales') ? 'rotate-180' : ''}`} />
                        </Button>
                      </CollapsibleTrigger>

                      <CollapsibleContent className="px-4 pb-4">
                        <div className="space-y-4 ml-2 pt-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <Label className="text-sm">Tipo</Label>
                              <Select
                                value={getSelectValue('asimetriasFaciales', 'tipo')}
                                onValueChange={(value) => handleDetailedChange('asimetriasFaciales', 'tipo', value)}
                              >
                                <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="leve">Leve</SelectItem>
                                  <SelectItem value="moderada">Moderada</SelectItem>
                                  <SelectItem value="severa">Severa</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-sm">Zona Afectada</Label>
                              <Select
                                value={getSelectValue('asimetriasFaciales', 'zonaAfectada')}
                                onValueChange={(value) => handleDetailedChange('asimetriasFaciales', 'zonaAfectada', value)}
                              >
                                <SelectTrigger><SelectValue placeholder="Zona" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="tercio-superior">Tercio superior</SelectItem>
                                  <SelectItem value="tercio-medio">Tercio medio</SelectItem>
                                  <SelectItem value="tercio-inferior">Tercio inferior</SelectItem>
                                  <SelectItem value="lado-derecho">Lado derecho</SelectItem>
                                  <SelectItem value="lado-izquierdo">Lado izquierdo</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm">Descripción</Label>
                            <Textarea
                              placeholder="Describe la asimetría observada..."
                              value={getSelectValue('asimetriasFaciales', 'descripcion')}
                              onChange={(e) => handleDetailedChange('asimetriasFaciales', 'descripcion', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Cicatrices */}
                    <Collapsible
                      open={getCheckboxValue('cicatrices')}
                      onOpenChange={(open) => handleDetailedChange('cicatrices', 'presente', open)}
                      className="bg-gray-50/50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 md:col-span-2"
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full justify-between p-4 hover:bg-accent/50"
                        >
                          <span className="text-base font-medium text-gray-800 dark:text-white">Cicatrices</span>
                          <ChevronDown className={`h-4 w-4 transition-transform ${getCheckboxValue('cicatrices') ? 'rotate-180' : ''}`} />
                        </Button>
                      </CollapsibleTrigger>

                      <CollapsibleContent className="px-4 pb-4">
                        <div className="space-y-4 ml-2 pt-2">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <Label className="text-sm">Tamaño</Label>
                              <Select
                                value={getSelectValue('cicatrices', 'tamanio')}
                                onValueChange={(value) => handleDetailedChange('cicatrices', 'tamanio', value)}
                              >
                                <SelectTrigger><SelectValue placeholder="Tamaño" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pequena">Pequeña</SelectItem>
                                  <SelectItem value="mediana">Mediana</SelectItem>
                                  <SelectItem value="grande">Grande</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-sm">Bordes</Label>
                              <Select
                                value={getSelectValue('cicatrices', 'bordes')}
                                onValueChange={(value) => handleDetailedChange('cicatrices', 'bordes', value)}
                              >
                                <SelectTrigger><SelectValue placeholder="Bordes" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="regulares">Regulares</SelectItem>
                                  <SelectItem value="irregulares">Irregulares</SelectItem>
                                  <SelectItem value="elevados">Elevados</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-sm">Localización</Label>
                              <Select
                                value={getSelectValue('cicatrices', 'localizacion')}
                                onValueChange={(value) => handleDetailedChange('cicatrices', 'localizacion', value)}
                              >
                                <SelectTrigger><SelectValue placeholder="Ubicación" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="frente">Frente</SelectItem>
                                  <SelectItem value="mejilla-derecha">Mejilla derecha</SelectItem>
                                  <SelectItem value="mejilla-izquierda">Mejilla izquierda</SelectItem>
                                  <SelectItem value="menton">Mentón</SelectItem>
                                  <SelectItem value="otra">Otra</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm">Detalles</Label>
                            <Textarea
                              placeholder="Describe ubicación, causa, características..."
                              value={getSelectValue('cicatrices', 'detalles')}
                              onChange={(e) => handleDetailedChange('cicatrices', 'detalles', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Edema */}
                    <Collapsible
                      open={getCheckboxValue('edema')}
                      onOpenChange={(open) => handleDetailedChange('edema', 'presente', open)}
                      className="bg-gray-50/50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 md:col-span-2"
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full justify-between p-4 hover:bg-accent/50"
                        >
                          <span className="text-base font-medium text-gray-800 dark:text-white">Edema</span>
                          <ChevronDown className={`h-4 w-4 transition-transform ${getCheckboxValue('edema') ? 'rotate-180' : ''}`} />
                        </Button>
                      </CollapsibleTrigger>

                      <CollapsibleContent className="px-4 pb-4">
                        <div className="space-y-4 ml-2 pt-2">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <Label className="text-sm">Grado</Label>
                              <Select
                                value={getSelectValue('edema', 'grado')}
                                onValueChange={(value) => handleDetailedChange('edema', 'grado', value)}
                              >
                                <SelectTrigger><SelectValue placeholder="Grado" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="leve (+)">Leve (+)</SelectItem>
                                  <SelectItem value="moderado (++)">Moderado (++)</SelectItem>
                                  <SelectItem value="severo (+++)">Severo (+++)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-sm">Localización</Label>
                              <Select
                                value={getSelectValue('edema', 'localizacion')}
                                onValueChange={(value) => handleDetailedChange('edema', 'localizacion', value)}
                              >
                                <SelectTrigger><SelectValue placeholder="Ubicación" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="parpados">Párpados</SelectItem>
                                  <SelectItem value="mejillas">Mejillas</SelectItem>
                                  <SelectItem value="labios">Labios</SelectItem>
                                  <SelectItem value="generalizado">Generalizado</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-sm">Consistencia</Label>
                              <Select
                                value={getSelectValue('edema', 'consistencia')}
                                onValueChange={(value) => handleDetailedChange('edema', 'consistencia', value)}
                              >
                                <SelectTrigger><SelectValue placeholder="Consistencia" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="blando">Blando</SelectItem>
                                  <SelectItem value="firme">Firme</SelectItem>
                                  <SelectItem value="duro">Duro</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm">Descripción</Label>
                            <Textarea
                              placeholder="Describe características del edema..."
                              value={getSelectValue('edema', 'descripcion')}
                              onChange={(e) => handleDetailedChange('edema', 'descripcion', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>

                  {/* Observaciones Generales (de la Cara) */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-gray-800 dark:text-white">
                      Otras Observaciones (Cara)
                    </Label>
                    <Textarea
                      placeholder="Anota cualquier observación adicional sobre la cara..."
                      value={getFormValueCara('observaciones')}
                      onChange={(e) => handleCaraChange('observaciones', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>

                {/* --- Botones de Acción --- */}
                <div className="flex justify-center gap-4 mt-6">
                  <Button
                    onClick={generarRedaccionIA}
                    className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generar Redacción IA
                  </Button>
                  <Button
                    onClick={limpiarFormulario}
                    variant="outline"
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Limpiar Formulario
                  </Button>
                </div>

              </div>
            ) : (
              // --- VISTA DE REDACCIÓN IA ---
              <div className="space-y-6">
                <div ref={redaccionRef} className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Redacción General</h4>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div>
                    <AnimatedTextareaWithTyping
                      content={redaccionCara}
                      className="w-full bg-white/50 dark:bg-gray-800/50 p-2 rounded-md text-sm text-gray-700 dark:text-gray-300"
                      textAlign="justify"
                      readOnly
                    />
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button
                    onClick={() => setShowForm(true)}
                    variant="outline"
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Volver al Formulario
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ExamenCabeza;