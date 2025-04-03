import React, { useState, useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VoiceInput } from "@/components/ui/voice-input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Maximize2, X, Eraser, Copy, CheckCircle } from "lucide-react";
import { Typewriter } from "@/components/ui/typewriter-text";
import CaracteristicasDolor from "./padecimiento/CaracteristicasDolor";
import SintomasToggle from "./padecimiento/SintomasToggle";
interface PadecimientoActualProps {
  formData: {
    padecimientoActual: {
      sinSintomas: boolean;
      motivoConsulta: string;
      historiaPadecimiento: string;
      dolor: {
        fechaInicio: string;
        condicionAparicion: string;
        frecuencia: string;
        caracter: string;
        intensidad: string;
        localizacion: {
          tipo: string;
          descripcion: string;
        };
        atenuacion: string;
        causaProvocado?: string;
      };
    };
  };
  handlePadecimientoChange: (field: string, value: string) => void;
  handleDolorChange: (field: string, value: any) => void;
  handleSinSintomasChange: (checked: boolean) => void;
}
function revisarRedaccion(text: string): string {
  let textoCorregido = text.replace(/(\b\w+\b)(?:\s+\1\b)+/gi, '$1');
  const frasesRedundantes = [{
    patron: /Motivo de consulta: El paciente acude a consulta por Motivo de consulta/gi,
    reemplazo: 'Motivo de consulta: El paciente acude a consulta por'
  }, {
    patron: /El paciente acude a consulta por El paciente acude a consulta por/gi,
    reemplazo: 'El paciente acude a consulta por'
  }, {
    patron: /El paciente acude a consulta por por/gi,
    reemplazo: 'El paciente acude a consulta por'
  }, {
    patron: /El paciente acude a consulta por debido a/gi,
    reemplazo: 'El paciente acude a consulta por'
  }, {
    patron: /El paciente refiere la presencia de dolor localizado en localizado en/gi,
    reemplazo: 'El paciente refiere la presencia de dolor localizado en'
  }, {
    patron: /El paciente refiere que refiere/gi,
    reemplazo: 'El paciente refiere'
  }, {
    patron: /refiere que refiere/gi,
    reemplazo: 'refiere'
  }, {
    patron: /presenta dolor con doloroso/gi,
    reemplazo: 'presenta dolor'
  }];
  frasesRedundantes.forEach(({
    patron,
    reemplazo
  }) => {
    textoCorregido = textoCorregido.replace(patron, reemplazo);
  });
  textoCorregido = textoCorregido.replace(/\. ([a-z])/g, (_, letra) => `. ${letra.toUpperCase()}`);
  textoCorregido = textoCorregido.replace(/provocado por/gi, 'provocada por').replace(/aparece en/gi, 'aparece cuando').replace(/se ha observado que/gi, 'se observa que').replace(/presenta un dolor/gi, 'manifiesta dolor').replace(/tiene dolor/gi, 'presenta dolor').replace(/el dolor es/gi, 'el dolor se caracteriza por ser');
return textoCorregido;
}
function formatearTexto(text: string): string {
  let textoFormateado = text.replace(/Motivo de consulta:/g, '<strong>Motivo de consulta:</strong>').replace(/Historia del padecimiento:/g, '<strong>Historia del padecimiento:</strong>');
  const sections = textoFormateado.split('<strong>Historia del padecimiento:</strong>');
  if (sections.length > 1) {
    textoFormateado = `${sections[0]}<strong>Historia del padecimiento:</strong><div style="text-align: justify;">${sections[1].trim()}</div>`;
  }
  textoFormateado = textoFormateado.replace(/\.$/, '');
  textoFormateado = textoFormateado.replace(/<strong>Historia del padecimiento:<\/strong>\s*\n\s*/g, '<strong>Historia del padecimiento:</strong>\n');
  textoFormateado = textoFormateado.replace(/\n\s*\n\s*\n/g, '\n\n');
  return textoFormateado;
}
const PadecimientoActual = ({
  formData,
  handlePadecimientoChange,
  handleDolorChange,
  handleSinSintomasChange
}: PadecimientoActualProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showRedaccion, setShowRedaccion] = useState(false);
  const [redaccionIA, setRedaccionIA] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showCausasProvocado, setShowCausasProvocado] = useState(formData.padecimientoActual.dolor.condicionAparicion === 'provocado');
  const redaccionRef = useRef(null);
  const defaultMotivoConsulta = "El paciente acude a consulta por ";
  const motivosEjemplo = ["dolor dental intenso en molar superior derecho...", "sangrado de encías al cepillarse...", "revisión y limpieza dental de rutina...", "sensibilidad al frío y calor en dientes anteriores...", "inflamación y dolor en zona de muelas del juicio...", "aplicación de resina en diente fracturado...", "evaluación para tratamiento de ortodoncia...", "manchas oscuras en los dientes frontales...", "mal aliento persistente...", "dolor al masticar alimentos..."];
  const defaultCausaProvocado = "Provocado con ";
  const causasProvocadoEjemplo = ["alimentos fríos o helados en contacto con el diente...", "la presión durante la masticación de alimentos duros...", "bebidas calientes que generan dolor inmediato...", "el cepillado en la zona vestibular de los premolares...", "dulces y alimentos azucarados que desencadenan molestias..."];
  useEffect(() => {
    if (!formData.padecimientoActual.motivoConsulta) {
      handlePadecimientoChange("motivoConsulta", defaultMotivoConsulta);
    }
    if (formData.padecimientoActual.dolor.condicionAparicion === 'provocado' && (!formData.padecimientoActual.dolor.causaProvocado || formData.padecimientoActual.dolor.causaProvocado === '')) {
      handleDolorChange("causaProvocado", defaultCausaProvocado);
    }
  }, []);
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
  const generarRedaccionIA = () => {
    const motivoConsulta = formData.padecimientoActual.motivoConsulta.trim();
    const sinSintomas = formData.padecimientoActual.sinSintomas;
    let textoGenerado = "";
    if (sinSintomas) {
 textoGenerado = `Motivo de consulta:
${defaultMotivoConsulta} ${motivoConsulta.replace(defaultMotivoConsulta, '').trim()}.


Actualmente no refiere sintomatología`;
    } else {
      const {
        fechaInicio,
        condicionAparicion,
        frecuencia,
        caracter,
        intensidad,
        localizacion,
        atenuacion,
        causaProvocado
      } = formData.padecimientoActual.dolor;
      textoGenerado = `Motivo de consulta:
${defaultMotivoConsulta} ${motivoConsulta.replace(defaultMotivoConsulta, '').trim()}.


Historia del padecimiento:
El paciente refiere la presencia de dolor localizado en ${localizacion.descripcion || 'una localización no especificada'}. El síntoma inició el ${fechaInicio || 'una fecha no especificada'} y se presenta de manera ${frecuencia || 'no especificada'}. Se describe como un dolor ${caracter || 'no especificado'} con una intensidad ${intensidad || 'no especificada'}. Se ha identificado que el dolor aparece ${condicionAparicion || 'en una condición no especificada'}`;
      if (condicionAparicion === 'provocado' && causaProvocado) {
        textoGenerado += `, siendo provocado específicamente por ${causaProvocado}`;
      }
      if (atenuacion) {
        textoGenerado += `. Se ha observado que ${atenuacion}`;
      }
    }
    const textoRevisado = revisarRedaccion(textoGenerado);
    const textoFinal = formatearTexto(textoRevisado);
    setRedaccionIA(textoFinal);
    setShowRedaccion(true);
    setTimeout(() => {
      redaccionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      setTimeout(() => {
        window.scrollBy(0, -200);
      }, 300);
    }, 100);
  };
  const limpiarFormulario = () => {
    handlePadecimientoChange("motivoConsulta", defaultMotivoConsulta);
    handlePadecimientoChange("historiaPadecimiento", "");
    handleDolorChange("fechaInicio", "");
    handleDolorChange("condicionAparicion", "");
    handleDolorChange("frecuencia", "");
    handleDolorChange("caracter", "");
    handleDolorChange("intensidad", "");
    handleDolorChange("localizacion", {
      tipo: "",
descripcion: ""
    });
    handleDolorChange("atenuacion", "");
    handleDolorChange("causaProvocado", defaultCausaProvocado);
    handleSinSintomasChange(false);
    setRedaccionIA("");
    setShowRedaccion(false);
    setShowCausasProvocado(false);
  };
  const handleCopy = async () => {
    await navigator.clipboard.writeText(redaccionIA);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < redaccionIA.length) {
        setDisplayedText(redaccionIA.substring(0, index + 1));
        setProgress(index / redaccionIA.length * 100);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [redaccionIA]);
  return <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`} data-section-redaction="true" data-section-name="padecimientoActual">
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
              <button onClick={() => setShowRedaccion(false)} className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${!showRedaccion ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}>
                Formulario
              </button>
              <button onClick={() => setShowRedaccion(true)} className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${showRedaccion ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}>
                Redacción IA
              </button>
            </div>
          </div>


          <div className="flex items-center gap-2">
            <button onClick={handleMinimize} className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors" aria-label={isMinimized ? "Expandir" : "Minimizar"}>
              <Minus className="w-4 h-4" />
 </button>
            <button onClick={handleMaximize} className="p-1 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors" aria-label={isMaximized ? "Restaurar" : "Maximizar"}>
              <Maximize2 className="w-4 h-4" />
            </button>
            <button onClick={handleClose} className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors" aria-label="Cerrar">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>


        <div className="flex justify-start px-6 py-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-gray-400">I.</span> PADECIMIENTO ACTUAL
          </h2>
        </div>


        {showRedaccion ? <div ref={redaccionRef} className="p-6">
            <Label className="text-gray-700 dark:text-gray-300">Redacción IA:</Label>
            <div className="progress-bar-container" style={{
          width: '100%',
          backgroundColor: '#d3d3d3',
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '1rem',
          boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)'
        }}>
              <div className="progress-bar" style={{
            height: '8px',
            backgroundColor: '#34c759',
            transition: 'width 0.015s ease-in-out',
            width: `${progress}%`,
            borderRadius: '12px'
          }}></div>
            </div>
<div className="min-h-[150px] max-h-[250px] w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-3 overflow-y-auto whitespace-pre-wrap" style={{
          whiteSpace: 'pre-wrap'
        }} dangerouslySetInnerHTML={{
          __html: displayedText
        }} data-redaction-content />
            <Button onClick={handleCopy} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2 relative">
              <Copy className="w-4 h-4" />
              <span>Copiar Redacción</span>
              {copied && <div className="absolute -top-8 left-0 bg-green-500 text-white text-sm rounded-lg px-3 py-1 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Copiado</span>
                </div>}
            </Button>
          </div> : <div className="p-6">
            <Label className="text-gray-700 dark:text-gray-300">1. Motivo de consulta:</Label>
            <div className="flex items-start gap-4">
              <div className="relative w-full">
                <Textarea value={formData.padecimientoActual.motivoConsulta} onChange={e => {
              const newValue = e.target.value;
              if (!newValue.startsWith(defaultMotivoConsulta)) {
                handlePadecimientoChange("motivoConsulta", defaultMotivoConsulta);
              } else {
                handlePadecimientoChange("motivoConsulta", newValue);
              }
            }} placeholder={defaultMotivoConsulta} className="min-h-[100px] max-h-[200px] w-full resize-y bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md" />
                {formData.padecimientoActual.motivoConsulta === defaultMotivoConsulta && <div className="absolute top-2 left-[215px] pointer-events-none">
 <Typewriter text={motivosEjemplo} speed={50} deleteSpeed={30} delay={2000} loop={true} className="text-gray-500 italic text-base" />
                  </div>}
              </div>
              <div className="mt-2">
                <VoiceInput onTranscriptionComplete={text => {
              const newValue = text;
              if (!newValue.startsWith(defaultMotivoConsulta)) {
                handlePadecimientoChange("motivoConsulta", `${defaultMotivoConsulta} ${newValue}`);
              } else {
                handlePadecimientoChange("motivoConsulta", newValue);
              }
            }} />
              </div>
            </div>
          </div>}


        {!isMinimized && !showRedaccion && <div className="p-6 space-y-8">
            <SintomasToggle checked={formData.padecimientoActual.sinSintomas} onChange={checked => {
          handleSinSintomasChange(checked);
          setShowCausasProvocado(false);
        }} />
            {!formData.padecimientoActual.sinSintomas && <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                  <h3 className="mb-6 text-xl text-gray-800 font-medium">EN CASO DE DOLOR</h3>
                  <CaracteristicasDolor dolor={formData.padecimientoActual.dolor} onDolorChange={(field, value) => {
              handleDolorChange(field, value);
              if (field === 'condicionAparicion' && value === 'provocado') {
                setShowCausasProvocado(true);
              } else if (field === 'condicionAparicion' && value !== 'provocado') {
setShowCausasProvocado(false);
              }
            }} />
                </div>
              </div>}
          </div>}


        {!showRedaccion && <div className="p-6 flex justify-center gap-4">
            <Button onClick={generarRedaccionIA} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2">
              <span>Generar Redacción IA</span>
            </Button>
            <Button onClick={limpiarFormulario} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2">
              <Eraser className="w-4 h-4" />
              <span>Limpiar Formulario</span>
            </Button>
          </div>}
      </Card>
    </div>;
};
export default PadecimientoActual;


