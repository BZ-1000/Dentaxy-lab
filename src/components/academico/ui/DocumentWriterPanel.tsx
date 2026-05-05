import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FormDataState } from '@/types/historiaClinica';
import parse from 'html-react-parser';
import { AppleTypewriter } from '@/components/ui/AppleTypewriter';

interface DocumentWriterPanelProps {
  formData?: FormDataState;
  generations: Record<string, string | React.ReactNode>;
  seccionesActivas: Array<{ id: string, nombre: string }>;
  onClose: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isMaximized?: boolean;
}

export const DocumentWriterPanel: React.FC<DocumentWriterPanelProps> = ({
  formData,
  generations,
  seccionesActivas,
  onClose,
  isExpanded,
  onToggleExpand,
  isMaximized = false
}) => {
  // Datos reactivos del paciente
  const nombrePaciente = formData?.datosGenerales?.nombreCompleto || '______________________';
  
  // Fecha actual formateada
  const today = new Date();
  const fechaHoy = today.toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const statusActivo = Object.keys(generations).length > 0;
  const statusText = statusActivo ? "EN REDACCIÓN" : "ESPERANDO...";

  // Referencias y efecto para autoscroll
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevGenerationsLength = useRef(0);

  useEffect(() => {
    const currentLength = Object.keys(generations).length;
    if (currentLength > prevGenerationsLength.current) {
      const activeIds = seccionesActivas.filter(s => generations[s.id]).map(s => s.id);
      if (activeIds.length > 0) {
        const lastId = activeIds[activeIds.length - 1];
        const el = document.getElementById(`doc-section-${lastId}`);
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      }
    }
    prevGenerationsLength.current = currentLength;
  }, [generations, seccionesActivas]);

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        "h-full bg-white border-l border-zinc-100 relative flex flex-col shadow-2xl transition-all duration-500 will-change-[width]",
        isMaximized ? "fixed inset-0 z-[100] w-full" : "z-40 flex-1 min-w-[300px]"
      )}
    >
      {/* System Header */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-zinc-100 bg-white z-10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-widest text-zinc-400 font-semibold">Documento Automático</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onToggleExpand} className="h-7 w-7 text-zinc-300 hover:text-zinc-700">
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7 text-zinc-300 hover:text-red-400">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Pages / Document Area — fondo blanco puro, scrollbar fantasma */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 scroll-smooth dentaxy-scrollbar"
      >
        {/* HOJA FÍSICA — sin bordes visibles, un solo plano blanco */}
        <div
          className="mx-auto bg-white font-mplus"
          style={{
            width: '100%',
            maxWidth: '860px',
            color: '#0f0f0f',
            padding: '48px 40px 120px',
          }}
        >
          {/* HEADER DEL DOCUMENTO CLÍNICO */}
          <header className="border-b border-zinc-200 pb-8 mb-10">
            <div className="flex items-start justify-between gap-6">
              <div className="flex flex-col gap-1">
                <div className="text-[22px] font-light tracking-tight text-zinc-900">
                  Consultorio Odontológico
                </div>
                <div className="font-mono text-[11px] text-zinc-400 tracking-widest uppercase">
                  Céd. Prof. 0000000 | Zacatecas, Mx.
                </div>
              </div>

              {/* Logo Dentaxy Technologies — real, clickeable */}
              <a
                href="https://dentaxy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 shrink-0 opacity-70 hover:opacity-100 transition-opacity cursor-pointer group"
                title="Dentaxy Technologies"
              >
                <img
                  src="/brand/dentaxy-icon-solid.webp"
                  alt="Dentaxy Technologies"
                  className="w-8 h-8 object-contain group-hover:scale-105 transition-transform"
                />
                <div className="flex flex-col leading-tight">
                  <span className="font-semibold text-[11px] tracking-widest uppercase text-zinc-700">Dentaxy</span>
                  <span className="text-[9px] tracking-[0.12em] uppercase text-zinc-400 font-light">Technologies</span>
                </div>
              </a>
            </div>

            {/* Meta Strip */}
            <div className="mt-7 grid grid-cols-4 border border-zinc-100 rounded-lg overflow-hidden">
              <div className="p-2.5 px-4 border-r border-zinc-100">
                <div className="font-mono text-[9px] font-semibold tracking-[0.14em] uppercase text-zinc-400 mb-1">Folio</div>
                <div className="text-[13px] font-medium text-zinc-800">EXP-2026-001</div>
              </div>
              <div className="p-2.5 px-4 border-r border-zinc-100">
                <div className="font-mono text-[9px] font-semibold tracking-[0.14em] uppercase text-zinc-400 mb-1">Fecha</div>
                <div className="text-[13px] font-medium text-zinc-800">{fechaHoy}</div>
              </div>
              <div className="p-2.5 px-4 border-r border-zinc-100">
                <div className="font-mono text-[9px] font-semibold tracking-[0.14em] uppercase text-zinc-400 mb-1">Paciente</div>
                <div className="text-[13px] font-medium text-zinc-800 uppercase truncate" title={nombrePaciente}>{nombrePaciente}</div>
              </div>
              <div className="p-2.5 px-4">
                <div className="font-mono text-[9px] font-semibold tracking-[0.14em] uppercase text-zinc-400 mb-1">Estatus</div>
                <div className={cn(
                  "text-[12px] font-bold tracking-wide flex items-center gap-1.5",
                  statusActivo ? "text-emerald-500" : "text-zinc-300"
                )}>
                  {statusActivo && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_2px_rgba(52,211,153,0.7)]" />
                  )}
                  {statusText}
                </div>
              </div>
            </div>
          </header>

          {/* MAIN DOCUMENT CONTENT */}
          {Object.keys(generations).length === 0 ? (
            <div className="flex flex-col items-center justify-center opacity-20 py-20 text-center">
              <p className="text-sm font-light text-zinc-500">Inicia la redacción en el panel izquierdo.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {seccionesActivas.map(seccion => {
                const content = generations[seccion.id];
                if (!content) return null;

                return (
                  <section
                    id={`doc-section-${seccion.id}`}
                    key={seccion.id}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                  >
                    {/* Título de sección — estilo expediente clínico de referencia */}
                    <div className="flex items-center gap-2 mb-4">
                      <p className="font-mono text-[11px] text-zinc-400 tracking-[0.12em]">
                        {String(seccionesActivas.findIndex(s => s.id === seccion.id) + 1).padStart(2, '0')}
                      </p>
                      <h2 className="text-[17px] font-semibold tracking-tight text-zinc-900 border-l-[3px] border-zinc-900 pl-[14px] leading-snug m-0">
                        {seccion.nombre.replace(/^\d+\.\s*/, '')}
                      </h2>
                    </div>

                    {/* Contenido de la redacción — directo sin animación para scroll fluido */}
                    <div className="prose max-w-none text-[15px] leading-relaxed text-zinc-700 text-justify font-mplus">
                      {typeof content === 'string' ? (
                        <div className="overflow-x-auto">{parse(content)}</div>
                      ) : (
                        <>{content}</>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
