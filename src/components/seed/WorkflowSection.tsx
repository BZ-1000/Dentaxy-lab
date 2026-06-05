import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { 
  FileText, Cloud, Check, ArrowRight, Shield, RefreshCw, 
  Smartphone, Terminal, FileCode, CheckCircle2, User, ChevronRight
} from "lucide-react";

interface StepData {
  id: string;
  title: string;
  subtitle: string;
  shortDesc: string;
  description: string;
  focus: string[];
  impact: string[];
  phaseName: string;
}

const steps: StepData[] = [
  {
    id: "01",
    phaseName: "Canalización",
    title: "Llegada del Paciente",
    subtitle: "Formulario móvil o tablet",
    shortDesc: "Captura autónoma en sala de espera",
    description: "El paciente inicia su registro desde una tablet o smartphone en la sala de espera. Captura rápida de datos personales y motivo de consulta de forma 100% autónoma y sin papel.",
    focus: ["Experiencia del Paciente", "Captura Ágil", "Autonomía en Sala"],
    impact: ["Cero consumo de papel", "Reducción de espera en 40%", "Datos validados al instante"]
  },
  {
    id: "02",
    phaseName: "Diagnóstico",
    title: "Consulta Rápida",
    subtitle: "Selección en interfaz clínica",
    shortDesc: "Mapeo anatómico guiado en sillón",
    description: "El odontólogo interactúa con una interfaz clínica optimizada para selección rápida. Se capturan de forma táctil el síntoma principal, ubicación anatómica y evolución temporal en segundos.",
    focus: ["Mapeo Anatómico Táctil", "Estandarización de Notas", "Eficiencia en Sillón"],
    impact: ["Ahorro de hasta 15 min por paciente", "Precisión terminológica", "Sin necesidad de teclear"]
  },
  {
    id: "03",
    phaseName: "Procesamiento",
    title: "Motor de Redacción",
    subtitle: "Ensamblaje determinista local",
    shortDesc: "Compilación de notas SOAP al instante",
    description: "Nuestro motor local procesa la selección del formulario y redacta una nota clínica formal. Sin usar APIs externas ni compartir datos confidenciales. Lógica local, determinista y privada.",
    focus: ["Lógica Local", "Cumplimiento LFPDPPP", "Latencia Cero"],
    impact: ["Costo de API de $0.00", "Privacidad médica absoluta", "Generación en 3ms"]
  },
  {
    id: "04",
    phaseName: "Resguardo",
    title: "Archivo en Drive",
    subtitle: "Expediente listo y seguro",
    shortDesc: "Soberanía digital garantizada",
    description: "La nota generada se almacena automáticamente en la carpeta de Google Drive del odontólogo como un PDF estructurado. Seguro, accesible y bajo el control absoluto del médico.",
    focus: ["Soberanía de Datos", "Respaldos Automáticos", "Integración Nativa Cloud"],
    impact: ["Expediente digital permanente", "Acceso multidispositivo", "Cero servidores intermediarios"]
  }
];

export const WorkflowSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Detectar si estamos en un dispositivo móvil para desactivar el sticky scroll
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Escuchar el progreso del scroll usando framer-motion
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (isMobile) return;
    
    // Mapear el progreso [0, 1] a los índices de pasos [0, 3]
    const stepIndex = Math.min(
      Math.max(Math.floor(latest * steps.length), 0),
      steps.length - 1
    );
    
    setActiveStep(stepIndex);
  });

  // Navegación fluida al hacer clic en los indicadores
  const handleStepClick = (index: number) => {
    if (isMobile) {
      setActiveStep(index);
    } else {
      if (!containerRef.current) return;
      
      const containerTop = containerRef.current.offsetTop;
      const viewportHeight = window.innerHeight;
      
      // Desplazarse de forma que el paso index se alinee al tope de la pantalla
      const targetScrollY = containerTop + (index * viewportHeight);

      window.scrollTo({
        top: targetScrollY,
        behavior: "smooth"
      });
    }
  };

  // Renderizar las pantallas dentro del dispositivo simulado
  const renderDeviceScreen = () => {
    switch (activeStep) {
      case 0:
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -18 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="w-full h-full bg-[#FAFAFC] text-zinc-900 p-6 sm:p-8 flex flex-col justify-between font-sans"
          >
            {/* Header del Formulario */}
            <div>
              <div className="flex items-center gap-2 mb-3.5">
                <div className="w-6 h-6 rounded-full bg-[#00C980]/15 flex items-center justify-center">
                  <User size={13} className="text-[#00C980]" />
                </div>
                <span className="font-mono text-[9.5px] uppercase tracking-wider text-zinc-550 font-bold">DentaXy Portal Paciente</span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-zinc-800 tracking-tight">Registro de Nueva Consulta</h4>
              <p className="text-xs text-zinc-550 mt-1 font-medium font-sans">Captura de ingreso clínico autónomo.</p>

              {/* Campos del Formulario */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-[9.5px] font-mono uppercase text-zinc-550 mb-1 font-bold">Nombre Completo</label>
                  <div className="w-full bg-white border border-zinc-200 rounded-lg px-3.5 py-2.5 text-[12.5px] font-medium text-zinc-800 flex items-center justify-between shadow-xs">
                    <span>Carlos Medina</span>
                    <span className="w-2 h-2 rounded-full bg-[#00C980] animate-pulse"></span>
                  </div>
                </div>

                <div>
                  <label className="block text-[9.5px] font-mono uppercase text-zinc-555 mb-1 font-bold">Edad y Sexo</label>
                  <div className="w-full bg-white border border-zinc-200 rounded-lg px-3.5 py-2.5 text-[12.5px] text-zinc-800 shadow-xs">
                    24 años / Masculino
                  </div>
                </div>

                <div>
                  <label className="block text-[9.5px] font-mono uppercase text-zinc-555 mb-1 font-bold">Motivo de Consulta Principal</label>
                  <div className="w-full bg-[#00C980]/5 border border-[#00C980]/30 rounded-lg px-3.5 py-2.5 text-[12.5px] font-medium text-zinc-800">
                    Dolor molar inferior derecho
                  </div>
                </div>
              </div>
            </div>

            {/* Pie y Botón */}
            <div className="pt-4 border-t border-zinc-200">
              <button 
                onClick={() => isMobile && handleStepClick(1)}
                className="w-full bg-[#00C980] hover:bg-[#00B271] text-white font-mono text-[11px] uppercase font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-[0_4px_12px_rgba(0,201,128,0.2)]"
              >
                {isMobile ? "Siguiente Paso" : "Enviar Formulario"} <ArrowRight size={12} />
              </button>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -18 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="w-full h-full bg-[#FAFAFC] text-zinc-900 p-6 sm:p-8 flex flex-col justify-between font-sans"
          >
            {/* Cabecera Clínica */}
            <div>
              <div className="flex items-center gap-1.5 mb-3.5">
                <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-600 font-bold bg-zinc-200/80 px-2 py-0.5 rounded">Fase de Selección</span>
                <span className="text-[10px] text-zinc-400">•</span>
                <span className="font-mono text-[9px] text-zinc-500">MOLAR INF. DER</span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-zinc-800 tracking-tight">Evaluación del Odontólogo</h4>

              {/* Tags Clínicas Seleccionadas */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-[10px] font-mono bg-[#00C980] text-white px-2.5 py-1.5 rounded-full flex items-center gap-1.5 font-bold shadow-xs">
                  Dolor punzante <Check size={11} />
                </span>
                <span className="text-[10px] font-mono bg-[#00C980] text-white px-2.5 py-1.5 rounded-full flex items-center gap-1.5 font-bold shadow-xs">
                  Molar Inf. Der. <Check size={11} />
                </span>
                <span className="text-[10px] font-mono bg-[#00C980] text-white px-2.5 py-1.5 rounded-full flex items-center gap-1.5 font-bold shadow-xs">
                  Hace 3 días <Check size={11} />
                </span>
                <span className="text-[10px] font-mono bg-[#EF4444] text-white px-2.5 py-1.5 rounded-full flex items-center gap-1.5 font-bold shadow-xs">
                  No cede a analgésicos <Check size={11} />
                </span>
              </div>

              {/* Mini Gráfico de Molar SVG */}
              <div className="mt-6 flex justify-center items-center">
                <div className="relative p-5 bg-white border border-zinc-200 rounded-2xl shadow-xs flex items-center justify-center gap-4 w-full">
                  <svg className="w-14 h-14 text-[#00C980] animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M7 3C5.5 3 4 4.5 4 6.5C4 9.5 5 11.5 6 13.5C7 15.5 6.5 18.5 7.5 20.5C7.8 21 8.5 21 9 20.5C9.5 20 10 19 10 18C10 17 11 16.5 12 16.5C13 16.5 14 17 14 18C14 19 14.5 20 15 20.5C15.5 21 16.2 21 16.5 20.5C17.5 18.5 17 15.5 18 13.5C19 11.5 20 9.5 20 6.5C20 4.5 18.5 3 17 3C15.5 3 14.5 4 12 4C9.5 4 8.5 3 7 3Z" fill="rgba(0,201,128,0.1)"/>
                    <path d="M12 4V16.5" strokeDasharray="2 2"/>
                  </svg>
                  <div className="text-[10.5px] font-mono">
                    <div className="text-zinc-500 uppercase font-bold text-[8.5px]">Diente Objetivo</div>
                    <div className="font-bold text-zinc-800 text-[12px] mt-0.5">Órgano Dentario 46</div>
                    <div className="text-[#00C980] font-bold mt-0.5">Estado: Sintomático</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progreso / Botón */}
            <div className="pt-3">
              {isMobile ? (
                <button 
                  onClick={() => handleStepClick(2)}
                  className="w-full bg-[#00C980] text-white font-mono text-[11px] uppercase font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-[0_4px_12px_rgba(0,201,128,0.2)]"
                >
                  Generar SOAP <ArrowRight size={11} />
                </button>
              ) : (
                <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#00C980] h-full w-1/2"></div>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -18 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="w-full h-full bg-[#F8FAFC] text-slate-700 p-6 sm:p-8 flex flex-col justify-between font-mono text-[10.5px] border border-slate-200 rounded-[20px]"
          >
            {/* Terminal View */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                <span className="text-[#00A86B] font-bold flex items-center gap-2 text-[11px]">
                  <Terminal size={13} className="text-[#00A86B]" /> LOCAL_ENGINE // v2.0
                </span>
                <span className="text-slate-550 text-[8.5px] font-bold bg-slate-200/50 px-2 py-0.5 rounded">ONLINE</span>
              </div>

              <div>
                <span className="text-slate-400">&gt; import &#123; compileNote &#125; from "./engine";</span>
              </div>
              
              <div className="mt-1">
                <span className="text-slate-555 font-bold block mb-1">INPUT DATA:</span>
                <pre className="text-[10.5px] text-[#2563EB] pl-3 py-2 bg-slate-100 rounded-lg border border-slate-200/80 leading-relaxed font-bold">
{`{
  paciente: "Carlos Medina",
  sintoma: "dolor_punzante",
  tiempo: "3_dias",
  diente: "OD46"
}`}
                </pre>
              </div>

              <div className="pt-1 flex items-center gap-2">
                <span className="text-slate-555">&gt; compileNote(inputs)</span>
                <span className="text-amber-605 animate-pulse font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block animate-ping"></span> Compiling...
                </span>
              </div>

              <div className="text-slate-550 text-[9.5px] leading-relaxed pl-2.5 border-l border-slate-300">
                [OK] Local text assembled in 3.4ms.<br/>
                [OK] Zero remote API dependencies.
              </div>
            </div>

            {isMobile ? (
              <button 
                onClick={() => handleStepClick(3)}
                className="w-full bg-[#00C980] text-white font-mono text-[11px] uppercase font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-[0_4px_12px_rgba(0,201,128,0.2)]"
              >
                Ver Expediente <ArrowRight size={11} />
              </button>
            ) : (
              <div className="bg-[#00C980]/10 border border-[#00C980]/20 text-[#008A56] p-2.5 rounded-lg text-[9.5px] font-bold text-center uppercase tracking-wider">
                Compilado con éxito (Local HIPAA)
              </div>
            )}
          </motion.div>
        );

      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -18 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="w-full h-full bg-[#FAFAFC] text-zinc-900 p-6 sm:p-8 flex flex-col justify-between font-sans"
          >
            {/* Vista Documento Drive */}
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-zinc-200 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center bg-blue-50 border border-blue-200 rounded-lg">
                    <Cloud size={13} className="text-blue-600" />
                  </div>
                  <span className="font-mono text-[9.5px] uppercase tracking-wider text-zinc-600 font-bold">Google Drive Sync</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-550 bg-zinc-200 px-2 py-0.5 rounded-md font-bold">PDF Listo</span>
              </div>

              {/* Documento Clínico Formateado */}
              <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs">
                <div className="flex justify-between items-center border-b border-zinc-100 pb-2 mb-2.5">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-zinc-500 font-mono">engine_output.txt</span>
                  <span className="text-[9px] font-mono text-[#00C980] font-bold">EXPEDIENTE SEGURO</span>
                </div>
                <p className="text-[11.5px] text-zinc-700 leading-relaxed italic font-medium">
                  "El paciente refiere dolor punzante en zona molar inferior derecha desde hace 3 días. No responde a analgésicos comunes."
                </p>
              </div>

              {/* Sincronización Exitosa */}
              <div className="mt-5 flex items-center gap-2.5 p-3 bg-[#00C980]/5 border border-[#00C980]/20 rounded-xl">
                <CheckCircle2 size={16} className="text-[#00C980] flex-shrink-0" />
                <div className="text-[10px] font-mono leading-tight">
                  <div className="font-bold text-zinc-800">Sincronización Automática</div>
                  <div className="text-zinc-600 mt-0.5 font-medium">Guardado en Drive / Medina_C.pdf</div>
                </div>
              </div>
            </div>

            {/* Google Ecosystem Mini-Badges */}
            <div className="flex justify-center gap-6 text-zinc-600 border-t border-zinc-200 pt-3">
              <span className="text-[9.5px] font-mono flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Drive
              </span>
              <span className="text-[9.5px] font-mono flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Calendar
              </span>
              <span className="text-[9.5px] font-mono flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Sheets
              </span>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  // Render para dispositivos móviles (diseño tabulado compacto interactivo)
  if (isMobile) {
    return (
      <div className="relative w-full bg-[#FAFAFA] border-t border-zinc-200 py-16 px-6">
        <div className="max-w-[500px] mx-auto space-y-8">
          
          {/* Header e Identidad */}
          <div>
            <div className="font-sans text-[20px] font-bold text-zinc-900 tracking-tight leading-none mb-1">
              DentaXy Seed
            </div>
            <p className="font-sans text-zinc-600 text-[11px] lowercase tracking-normal">flujo de trabajo · clínico · local</p>
          </div>

          {/* Indicadores de Paginación */}
          <div className="flex gap-2">
            {steps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(idx)}
                className="flex-1 py-2 focus:outline-none"
              >
                <div 
                  className={`h-[2px] rounded-full transition-all duration-350 ${
                    idx === activeStep ? "bg-zinc-900" : "bg-zinc-300"
                  }`}
                />
                <span className={`block text-[9px] font-sans text-center mt-1 font-bold ${
                  idx === activeStep ? "text-zinc-900" : "text-zinc-600"
                }`}>
                  Paso {step.id}
                </span>
              </button>
            ))}
          </div>

          {/* Nombre y descripción corta del paso */}
          <div className="space-y-1">
            <span className="font-sans text-[10px] uppercase tracking-widest text-[#00C980] font-bold">
              {steps[activeStep].phaseName}
            </span>
            <h3 className="text-3xl font-bold text-zinc-900 tracking-tight leading-tight">
              {steps[activeStep].title}
            </h3>
            <div className="text-3xl font-bold text-zinc-500 tracking-tight leading-tight">
              {steps[activeStep].subtitle}
            </div>
          </div>

          {/* Tablet Mockup (Móvil - Wider bezel-less tablet) */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-[360px] aspect-[4/5] rounded-[24px] bg-zinc-950 p-2.5 border border-zinc-800 shadow-xl overflow-hidden flex flex-col">
              {/* Cámara ultra-delgada */}
              <div className="w-full flex justify-center mb-1 select-none">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
              </div>
              {/* Pantalla Interna */}
              <div className="w-full h-full rounded-[16px] bg-[#FAFAFC] overflow-hidden relative z-10 flex flex-col shadow-inner">
                <AnimatePresence mode="wait">
                  {renderDeviceScreen()}
                </AnimatePresence>
              </div>
              {/* Home indicator */}
              <div className="w-20 h-0.5 bg-zinc-800 rounded-full mx-auto mt-2 z-10 opacity-60"></div>
            </div>
          </div>

          {/* Detalles del Paso */}
          <div className="space-y-4 bg-white p-5 rounded-2xl border border-zinc-200 font-sans text-xs shadow-xs">
            <div>
              <span className="block text-[8px] uppercase tracking-widest text-zinc-650 mb-1 font-bold">Descripción</span>
              <p className="text-zinc-850 leading-relaxed font-normal text-[13px]">{steps[activeStep].description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-200">
              <div>
                <span className="block text-[8px] uppercase tracking-widest text-zinc-650 mb-1 font-bold">Enfoque</span>
                <div className="space-y-1 font-normal text-zinc-700 text-[13px]">
                  {steps[activeStep].focus.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <span className="block text-[8px] uppercase tracking-widest text-zinc-650 mb-1 font-bold">Impacto</span>
                <div className="space-y-1 font-normal text-zinc-850 text-[13px]">
                  {steps[activeStep].impact.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Render para pantallas Desktop (Layout original de 3 columnas fijas en contenedor sticky)
  return (
    <div 
      ref={containerRef} 
      className="workflow-scroll-container"
    >
      <div className="workflow-sticky-wrapper">
        
        {/* Luz ambiental de fondo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(0,201,128,0.012)_0%,transparent_60%)] pointer-events-none z-0"></div>

        <div className="max-w-[1450px] w-full mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-12 h-full items-stretch relative z-10">
          
          {/* Columna Izquierda (Identidad, Paso actual y Paginador Lineal) */}
          <div className="col-span-3 flex flex-col justify-between pr-6 pt-20 pb-16 h-[580px] self-start">
            <div>
              <div className="font-sans text-[20px] font-bold text-zinc-900 tracking-tight leading-none mb-1">
                DentaXy Seed
              </div>
              <p className="font-sans text-zinc-700 text-[11px] lowercase tracking-normal mb-5">flujo de trabajo · clínico · local</p>

              {/* Indicadores de Paginación Lineal */}
              <div className="flex gap-1.5">
                {steps.map((_, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handleStepClick(pIdx)}
                    className="focus:outline-none"
                    aria-label={`Ir al paso ${pIdx + 1}`}
                  >
                    <div 
                      className={`h-[1.5px] rounded-full transition-all duration-350 ease-out ${
                        pIdx === activeStep 
                          ? "w-6 bg-zinc-950" 
                          : "w-6 bg-zinc-400 hover:bg-zinc-500"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  className="space-y-1.5"
                >
                  <h3 className="text-[44px] lg:text-[48px] font-sans font-bold text-zinc-900 tracking-tighter leading-[1.05]">
                    {steps[activeStep].title}
                  </h3>
                  <div className="text-[44px] lg:text-[48px] font-sans font-bold text-zinc-500 tracking-tighter leading-[1.05]">
                    {steps[activeStep].subtitle}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer de construcción */}
            <div className="font-sans text-[10.5px] text-zinc-600 mt-auto lowercase">
              desarrollo local · privacidad hipaa · costo $0.00
            </div>
          </div>

          {/* Columna Central: Tablet central simulada (aspecto 4.3/5, estática, bisel ultra delgado de p-2) */}
          <div className="col-span-6 flex items-center justify-center self-center">
            <div className="relative w-full max-w-[540px] aspect-[4.3/5] rounded-[24px] bg-zinc-950 p-2 border border-zinc-800 shadow-[0_25px_60px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col">
              
              {/* Cámara ultra-delgada de la Tablet */}
              <div className="w-full flex justify-center mb-1 select-none">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-850"></div>
              </div>

              {/* Pantalla Interna */}
              <div className="w-full h-full rounded-[16px] bg-[#FAFAFC] overflow-hidden relative z-10 flex flex-col shadow-inner">
                <AnimatePresence mode="wait">
                  {renderDeviceScreen()}
                </AnimatePresence>
              </div>

              {/* Barra física del Home Indicator */}
              <div className="w-24 h-0.5 bg-zinc-850 rounded-full mx-auto mt-1.5 z-10 opacity-60"></div>
              
            </div>
          </div>

          {/* Columna Derecha (Detalles específicos, enfoques e impactos) */}
          <div className="col-span-3 flex flex-col justify-start space-y-8 pl-12 lg:pl-16 pt-20 pb-16 h-[580px] self-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="space-y-8"
              >
                {/* Cabecera de la fase */}
                <div className="space-y-1">
                  <span className="font-sans text-[15px] font-bold text-zinc-900">
                    {steps[activeStep].phaseName}
                  </span>
                  <div className="font-mono text-xs text-zinc-600">
                    &#123;{steps[activeStep].id}&#125;
                  </div>
                </div>

                {/* Metadatos del producto */}
                <div className="space-y-0.5">
                  <div className="font-sans text-[15px] font-bold text-zinc-900">
                    DentaXy · Seed
                  </div>
                  <div className="font-sans text-xs text-zinc-600">
                    Lógica Local Determínica
                  </div>
                </div>

                {/* Descripción */}
                <div className="space-y-1.5">
                  <span className="block font-sans text-[9.5px] font-bold uppercase tracking-wider text-zinc-650">Descripción</span>
                  <p className="font-sans text-[13px] text-zinc-800 leading-relaxed font-normal">
                    {steps[activeStep].description}
                  </p>
                </div>

                {/* Enfoques */}
                <div className="space-y-1.5">
                  <span className="block font-sans text-[9.5px] font-bold uppercase tracking-wider text-zinc-650">Enfoque</span>
                  <div className="flex flex-col gap-1 font-sans text-[13px] text-zinc-700 font-normal">
                    {steps[activeStep].focus.map((item, fIdx) => (
                      <span key={fIdx}>{item}</span>
                    ))}
                  </div>
                </div>

                {/* Impactos */}
                <div className="space-y-1.5">
                  <span className="block font-sans text-[9.5px] font-bold uppercase tracking-wider text-zinc-650">Impacto</span>
                  <div className="flex flex-col gap-1 font-sans text-[13px] text-zinc-900 font-normal">
                    {steps[activeStep].impact.map((item, iIdx) => (
                      <span key={iIdx}>{item}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
};