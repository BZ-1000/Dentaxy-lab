import React, { useState, useEffect, useRef } from 'react';
import { AnalysisModeProvider } from '@/contexts/AnalysisModeContext';
import { ProgressLine } from '@/components/academico/ui/ProgressLine';
import { SectionCard } from '@/components/academico/ui/SectionCard';
import { DatosGeneralesCard } from '@/components/academico/sections/DatosGeneralesCard';
import { PadecimientoCard } from '@/components/academico/sections/PadecimientoCard';
import { getInitialFormState } from '@/utils/initialFormState';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DocumentWriterPanel } from '@/components/academico/ui/DocumentWriterPanel';
import { RefreshCw } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const stepNames = [
  '1. Datos Generales',
  '2. Padecimiento Actual',
  '3. Antecedentes Heredofamiliares',
  '4. Antecedentes No Patológicos',
  '5. Antecedentes Patológicos',
  '6. Antecedentes Alérgicos',
];

const variants = {
  enter: { x: 50, opacity: 0 },
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: { zIndex: 0, x: -50, opacity: 0 }
};

function AutomatedDentaxyForm({ animationTrigger, onAnimationComplete }: { animationTrigger: number, onAnimationComplete?: () => void }) {
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState(getInitialFormState());
  const [currentStep, setCurrentStep] = useState(0);
  const [isDocumentOpen, setIsDocumentOpen] = useState(false);
  const [generations, setGenerations] = useState<Record<string, string>>({});
  const [seccionesActivas, setSeccionesActivas] = useState([{ id: 'datosGenerales', nombre: 'Datos Generales' }]);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleDatosGeneralesChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, datosGenerales: { ...prev.datosGenerales, [field]: value } }));
  };
  const handlePadecimientoChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, padecimientoActual: { ...prev.padecimientoActual, [field]: value } }));
  };
  const handleDolorChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, padecimientoActual: { ...prev.padecimientoActual, dolor: { ...prev.padecimientoActual.dolor, [field]: value } } }));
  };
  const handleSinSintomasChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, padecimientoActual: { ...prev.padecimientoActual, sinSintomas: checked } }));
  };

  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const runAnimation = async () => {
      // Función auxiliar para tipear en Datos Generales
      const typeField = async (field: string, text: string, speed = 40) => {
        for (let i = 0; i <= text.length; i++) {
          if (!mounted) return;
          handleDatosGeneralesChange(field, text.slice(0, i));
          await new Promise(r => setTimeout(r, speed));
        }
        await new Promise(r => setTimeout(r, 400));
      };

      // Función auxiliar para tipear en Padecimiento con prefijo
      const typeFieldPadecimiento = async (field: string, prefix: string, text: string, speed = 40) => {
        for (let i = 0; i <= text.length; i++) {
          if (!mounted) return;
          handlePadecimientoChange(field, prefix + text.slice(0, i));
          await new Promise(r => setTimeout(r, speed));
        }
        await new Promise(r => setTimeout(r, 400));
      };

      const selectField = async (field: string, text: string) => {
        if (!mounted) return;
        handleDatosGeneralesChange(field, text);
        await new Promise(r => setTimeout(r, 600));
      };

      const typeDolor = async (field: string, text: string, speed = 40) => {
        for (let i = 0; i <= text.length; i++) {
          if (!mounted) return;
          handleDolorChange(field, text.slice(0, i));
          await new Promise(r => setTimeout(r, speed));
        }
        await new Promise(r => setTimeout(r, 400));
      };
      
      const typeDolorWithPrefix = async (field: string, prefix: string, text: string, speed = 40) => {
        for (let i = 0; i <= text.length; i++) {
          if (!mounted) return;
          handleDolorChange(field, prefix + text.slice(0, i));
          await new Promise(r => setTimeout(r, speed));
        }
        await new Promise(r => setTimeout(r, 400));
      };

      const selectDolor = async (field: string, text: any) => {
        if (!mounted) return;
        handleDolorChange(field, text);
        await new Promise(r => setTimeout(r, 300));
      };

      const autoScroll = async (amount: number, extraWait = 100) => {
        if (scrollContainerRef.current && mounted) {
           scrollContainerRef.current.scrollBy({
             top: amount,
             behavior: 'smooth'
           });
        }
        await new Promise(r => setTimeout(r, extraWait));
      };

      await new Promise(r => setTimeout(r, 1000));
      if (!mounted) return;

      // 1. Llenar todos los campos de Datos Generales
      await typeField('nombreCompleto', 'Carlos Ramírez');
      await selectField('fechaNacimiento', '1985-06-15');
      await selectField('sexo', 'Masculino');
      await selectField('estadoCivil', 'Casado/a');
      await typeField('ocupacion', 'Ingeniero de Software');
      
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollBy({ top: 180, behavior: 'smooth' });
      }
      
      await typeField('telefono', '55 1234 5678');
      await typeField('correo', 'carlos.rmz@email.com');
      await typeField('contactoEmergencia', 'Ana López - 55 8765 4321');
      
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollBy({ top: 150, behavior: 'smooth' });
      }

      await typeField('domicilio', 'Av. Reforma 222, Col. Juárez, 06600, CDMX');

      await new Promise(r => setTimeout(r, 1500));
      if (!mounted) return;
      
      // 2. Transición al paso 2 (Padecimiento Actual)
      setCurrentStep(1);
      setIsDocumentOpen(true);
      
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Generar el HTML exacto de Datos Generales para el DocumentWriterPanel
      const filas = [
        { key: 'Nombre completo',          val: 'Carlos Ramírez' },
        { key: 'Fecha de nacimiento',      val: '1985-06-15' },
        { key: 'Sexo',                     val: 'Masculino' },
        { key: 'Estado civil',             val: 'Casado/a' },
        { key: 'Ocupación',                val: 'Ingeniero de Software' },
        { key: 'Domicilio',                val: 'Av. Reforma 222, Col. Juárez, 06600, CDMX' },
        { key: 'Teléfono',                 val: '55 1234 5678' },
        { key: 'Correo electrónico',       val: 'carlos.rmz@email.com' },
        { key: 'Contacto de emergencia',   val: 'Ana López - 55 8765 4321' },
      ];

      const filaHTML = filas.map((f, i) => {
        const bg = i % 2 !== 0 ? ' style="background:#f9fafb;"' : '';
        return `<tr${bg}>
          <td style="font-family:'DM Mono',monospace;font-size:11px;font-weight:500;letter-spacing:0.04em;color:#888;text-transform:uppercase;width:38%;padding:11px 16px 11px 0;vertical-align:top;border-bottom:1px solid #e5e7eb;">${f.key}</td>
          <td style="font-size:14px;font-weight:300;color:#3a3a3a;padding:11px 0 11px 16px;vertical-align:top;border-bottom:1px solid #e5e7eb;">${f.val}</td>
        </tr>`;
      }).join('');

      const html = `<table style="width:100%;border-collapse:collapse;">
        <tbody>${filaHTML}</tbody>
      </table>`;

      setGenerations({ datosGenerales: html });

      // Esperar un momento para que se vea el panel abriéndose
      await new Promise(r => setTimeout(r, 1500));
      if (!mounted) return;

      // Escribir el padecimiento actual respetando el prefijo
      await typeFieldPadecimiento(
        'motivoConsulta', 
        'El paciente acude a consulta por ', 
        'dolor agudo en el cuadrante inferior derecho, que se intensifica al masticar o al consumir bebidas frías.'
      );

      await autoScroll(80, 400);
      
      // Click visual en "Sí, hay dolor" para habilitar las características y centrar la vista
      if (!mounted) return;
      handleSinSintomasChange(false);
      await new Promise(r => setTimeout(r, 600));
      await autoScroll(200, 200);

      // Fecha de inicio
      await selectDolor('fechaInicio', '2023-10-01');
      await autoScroll(50, 100);
      
      // Modo de Aparición -> Provocado
      await selectDolor('condicionAparicion', 'provocado');
      await autoScroll(180, 300);
      
      // Escribir causa de provocado
      await typeDolorWithPrefix('causaProvocado', 'Provocado con ', 'la masticación y bebidas frías', 30);
      await autoScroll(180, 200);

      // Frecuencia -> Intermitente
      await selectDolor('frecuencia', 'intermitente');
      await autoScroll(130, 100);
      
      // Carácter -> Pulsátil
      await selectDolor('caracter', 'pulsatil');
      await autoScroll(130, 100);
      
      // Intensidad -> Severa
      await selectDolor('intensidad', 'severa');
      await autoScroll(130, 100);

      // Ubicación -> Localizado
      await selectDolor('ubicacion', 'localizado');
      handleDolorChange('localizacion', { tipo: 'Localizado', descripcion: '' });
      await autoScroll(150, 200);
      
      const locPrefix = 'Localizado en ';
      const locText = 'el cuadrante inferior derecho';
      for (let i = 0; i <= locText.length; i++) {
        if (!mounted) return;
        handleDolorChange('localizacion', { tipo: 'Localizado', descripcion: locPrefix + locText.slice(0, i) });
        await new Promise(r => setTimeout(r, 30));
      }
      await new Promise(r => setTimeout(r, 200));
      await autoScroll(250, 200); // Scroll extra largo para asegurar visibilidad del textarea final

      // Atenuación
      await typeDolor('atenuacion', 'Analgésicos de venta libre (Ibuprofeno)');
      
      await new Promise(r => setTimeout(r, 1000));
      if (!mounted) return;

      // Generar Padecimiento Actual en DocumentWriterPanel
      setSeccionesActivas(prev => [...prev, { id: 'padecimiento', nombre: 'Padecimiento Actual' }]);
      const formatTitle = (title: string) => `<span class="block text-xs font-semibold uppercase tracking-widest text-zinc-400 mt-4 mb-1">${title}</span>`;
      const motivoVal = "El paciente acude a consulta por dolor agudo en el cuadrante inferior derecho, que se intensifica al masticar o al consumir bebidas frías";
      const historyText = "El paciente acude a consulta manifestando: \"Dolor agudo en el cuadrante inferior derecho, que se intensifica al masticar o al consumir bebidas frías\". Presenta sintomatología de manera provocada, exacerbada específicamente ante la masticación y bebidas frías. El dolor se manifiesta con una frecuencia intermitente de carácter pulsatil e intensidad severa. El foco doloroso se percibe estrictamente localizado en un punto clínico específico (el cuadrante inferior derecho). El paciente reporta mejoría ante Analgésico de venta libre (Ibuprofeno).";
      const padHtml = `${formatTitle("Motivo de consulta")}${motivoVal}<br/>${formatTitle("Historia del padecimiento")}${historyText}`;
      
      setGenerations(prev => ({ ...prev, padecimiento: padHtml }));

      // Pausa para permitir que la animación de redacción del documento termine
      await new Promise(r => setTimeout(r, 6000));
      if (!mounted) return;

      // Detener aquí y permitir al usuario explorar
      setIsAnimationComplete(true);
      if (onAnimationComplete) onAnimationComplete();
    };
    
    // Reinicio de estado inicial
    setFormData(getInitialFormState());
    setCurrentStep(0);
    setIsDocumentOpen(false);
    setGenerations({});
    setSeccionesActivas([{ id: 'datosGenerales', nombre: 'Datos Generales' }]);
    setIsAnimationComplete(false);

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }

    runAnimation();
    
    return () => { mounted = false; };
  }, [animationTrigger]);

  return (
    <div className="flex flex-col w-full h-full bg-white dark:bg-zinc-950 overflow-hidden relative rounded-xl demo-readonly-container">
      <div className="flex w-full flex-1 overflow-hidden">
        <div className={cn(
          "flex flex-col relative h-full shrink-0 transition-all duration-300", 
          isDocumentOpen ? "w-0 md:w-[50%] overflow-hidden opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto" : "w-full"
        )}>
          <div className="w-full relative z-50 bg-transparent transition-all border-b border-transparent">
          <ProgressLine
            totalSteps={stepNames.length}
            currentStep={currentStep}
            isGenerating={false}
            stepNames={stepNames}
            onStepClick={() => {}}
            stepStatuses={stepNames.map((_, i) => i < currentStep ? 'completed' : i === currentStep ? 'active' : 'pending')}
            isScrolled={false}
            disableAutoScroll={true}
          />
        </div>
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-40 scroll-smooth dentaxy-scrollbar" ref={scrollContainerRef}>
          <div className="container mx-auto px-4 py-4 max-w-4xl">
           <AnimatePresence mode="wait">
              <motion.div
                 key={currentStep}
                 variants={variants}
                 initial="enter"
                 animate="center"
                 exit="exit"
                 transition={{ type: "spring", stiffness: 300, damping: 30 }}
                 className="w-full flex justify-center"
              >
                 <div className="w-full" data-section={currentStep === 0 ? "datosGenerales" : "padecimiento"}>
                   <SectionCard
                     title={stepNames[currentStep]}
                     viewMode="form"
                     onViewModeChange={() => {}}
                     isExpanded={true}
                     onToggleExpand={() => {}}
                     hideGlobalToggle={currentStep === 1}
                   >
                     {currentStep === 0 ? (
                        <DatosGeneralesCard
                          formData={formData}
                          handleDatosGeneralesChange={handleDatosGeneralesChange}
                          onToggleViewMode={() => {}}
                          onSeccionGenerada={() => {}}
                        />
                     ) : (
                        <PadecimientoCard
                          formData={formData}
                          handlePadecimientoChange={handlePadecimientoChange}
                          handleDolorChange={handleDolorChange}
                          handleSinSintomasChange={handleSinSintomasChange}
                          onToggleViewMode={() => {}}
                          onSeccionGenerada={() => {}}
                        />
                     )}
                   </SectionCard>
                 </div>
              </motion.div>
           </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isDocumentOpen && (
          <DocumentWriterPanel
            formData={formData}
            generations={generations}
            seccionesActivas={seccionesActivas}
            onClose={() => setIsDocumentOpen(false)}
            isExpanded={false}
            onToggleExpand={() => {}}
            onNext={() => {}}
            canGoNext={false}
            width={isMobile ? 100 : 50}
          />
        )}
      </AnimatePresence>

      </div>
    </div>
  );
}

/**
 * AnimatedDemoUI
 * 
 * Contenedor del demo clínico automatizado aislado.
 * Ya NO usamos pointer-events-none global para permitir scroll manual al final de la animación.
 * Usamos CSS inyectado para bloquear inputs, selects, textareas y botones excepto el de replay.
 */
export default function AnimatedDemoUI({ animationTrigger = 0, onAnimationComplete }: { animationTrigger?: number, onAnimationComplete?: () => void }) {
  const isMobile = useIsMobile();
  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden flex flex-col font-sans relative">
      <style>{`
        .demo-readonly-container button,
        .demo-readonly-container input,
        .demo-readonly-container textarea,
        .demo-readonly-container select {
          pointer-events: none !important;
        }
      `}</style>
      <AnalysisModeProvider>
        <div className="w-full h-full bg-background relative z-50 overflow-hidden transform-gpu">
          <div 
            className="origin-top-left w-full h-full" 
            style={
              isMobile 
                ? { transform: 'scale(1.0)', width: '100%', height: '100%' } 
                : { transform: 'scale(0.85)', width: '117.64%', height: '117.64%' }
            }
          >
            <div className="w-full h-full">
               <AutomatedDentaxyForm animationTrigger={animationTrigger} onAnimationComplete={onAnimationComplete} />
            </div>
          </div>
        </div>
      </AnalysisModeProvider>
    </div>
  );
}
