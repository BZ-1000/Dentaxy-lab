import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FormDataState } from '@/types/historiaClinica';
import parse from 'html-react-parser';
import { AppleTypewriter } from '@/components/ui/AppleTypewriter';
import { useIsMobile } from '@/hooks/use-mobile';

interface DocumentWriterPanelProps {
  formData?: FormDataState;
  generations: Record<string, string | React.ReactNode>;
  seccionesActivas: Array<{ id: string, nombre: string }>;
  onClose: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onNext?: () => void;
  canGoNext?: boolean;
  width?: number; // Added to support custom resizing
  patientData?: {
    nombreCompleto: string;
    edad: string;
    genero: string;
    fechaNacimiento: string;
    ocupacion: string;
    telefono: string;
    motivoConsulta: string;
  };
}

export const DocumentWriterPanel: React.FC<DocumentWriterPanelProps> = ({
  formData,
  generations,
  seccionesActivas,
  onClose,
  isExpanded,
  onToggleExpand,
  onNext,
  canGoNext = true,
  width = 50,
  patientData
}) => {
  const isMobile = useIsMobile();
  // Datos reactivos del paciente
  const nombrePaciente = patientData?.nombreCompleto || formData?.datosGenerales?.nombreCompleto || '______________________';
  
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
        const container = scrollContainerRef.current;
        if (el && container) {
          setTimeout(() => {
            const topPos = el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
            container.scrollTo({ top: topPos - 40, behavior: 'smooth' });
          }, 100);
        }
      }
    }
    prevGenerationsLength.current = currentLength;
  }, [generations, seccionesActivas]);

  const handleDownloadHTML = () => {
    const originalDocElement = document.getElementById('dentaxy-print-document');
    if (!originalDocElement) return;

    // Clone to manipulate safely
    const docElement = originalDocElement.cloneNode(true) as HTMLElement;
    
    // Replace logo src with base64
    const logoImg = docElement.querySelector('img[alt="Dentaxy Technologies"]') as HTMLImageElement;
    if (logoImg) {
      logoImg.src = "data:image/webp;base64,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";
    }

    // Replace status text
    const statusContainer = docElement.querySelectorAll('.grid > div');
    if (statusContainer && statusContainer.length >= 4) {
      const statusDiv = statusContainer[3]; // The 4th div is Estatus
      const statusValueDiv = statusDiv.querySelector('div:nth-child(2)');
      if (statusValueDiv) {
        statusValueDiv.innerHTML = 'REDACTADO POR DENTAXY';
        statusValueDiv.className = 'text-[12px] font-bold tracking-wide flex items-center gap-1.5 text-emerald-500';
      }
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Expediente Clínico - Dentaxy AI</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @import url("https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@300;400;500;700&display=swap");
          body { font-family: 'M PLUS Rounded 1c', sans-serif; background-color: #f4f4f5; padding: 20px; }
          .dentaxy-print-container { max-width: 860px; margin: 0 auto; background: white; color: #0f0f0f; padding: 40px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="dentaxy-print-container">
          ${docElement.innerHTML}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expediente_${nombrePaciente.replace(/\s+/g, '_')}_${fechaHoy.replace(/\//g, '-')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ width: "0%", opacity: 0 }}
      animate={{ width: isMobile ? "100%" : (isExpanded ? "100%" : `${width}%`), opacity: 1 }}
      exit={{ width: "0%", opacity: 0 }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      className={cn(
        "h-full bg-white flex flex-col overflow-hidden shrink-0 will-change-[width] rounded-t-3xl rounded-b-none border border-zinc-200/50 shadow-xl",
        isMobile ? "fixed inset-0 z-[9999]" : "relative z-40"
      )}
    >
      <div className={cn("relative flex flex-col h-full w-full bg-white rounded-t-3xl overflow-hidden", !isMobile && "min-w-[500px]")}>

        {/* ── BARRA SUPERIOR con difuminado blanco y sin franja sólida ── */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 pt-4 pb-8 bg-gradient-to-b from-white via-white/90 to-transparent rounded-t-3xl pointer-events-none">
          {/* Título */}
          <span className="text-[15px] font-medium text-zinc-800 tracking-tight select-none pointer-events-auto">
            Documento Automático
          </span>

          {/* Botones pill derecha */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Descargar */}
            <button
              onClick={handleDownloadHTML}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-zinc-100/90 hover:bg-zinc-200/90 text-zinc-700 text-[13px] font-medium transition-all shadow-sm"
              title="Descargar como HTML"
            >
              <Download className="w-3.5 h-3.5 text-zinc-600" />
              <span>Descargar</span>
            </button>

            {/* Cerrar */}
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-all ml-1"
              title="Cerrar panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CONTENIDO INTERIOR — Scrollable, con padding superior para espacio al título y difuminado */}
        <div
          id="dentaxy-print-document"
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth dentaxy-scrollbar bg-white flex flex-col px-6 md:px-10 pt-16 pb-16"
        >
          {/* HEADER DEL DOCUMENTO CLÍNICO */}
          <header className="border-b border-zinc-200 pb-8 mb-10">
            <div className="flex items-start justify-between gap-6">
              <div className="flex flex-col gap-1">
                <div className="text-[22px] font-light tracking-tight text-zinc-900">
                  Consultorio Odontológico
                </div>
                <div className="font-mono text-[11px] text-zinc-500 tracking-widest uppercase">
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
                  <span className="text-[9px] tracking-[0.12em] uppercase text-zinc-500 font-light">Technologies</span>
                </div>
              </a>
            </div>

            {/* Meta Strip */}
            <div className="mt-7 grid grid-cols-2 md:grid-cols-4 border border-zinc-100 rounded-lg overflow-hidden">
              <div className="p-2.5 px-4 border-r border-zinc-100">
                <div className="font-mono text-[9px] font-semibold tracking-[0.14em] uppercase text-zinc-500 mb-1">Folio</div>
                <div className="text-[13px] font-medium text-zinc-800">EXP-2026-001</div>
              </div>
              <div className="p-2.5 px-4 border-r border-zinc-100">
                <div className="font-mono text-[9px] font-semibold tracking-[0.14em] uppercase text-zinc-500 mb-1">Fecha</div>
                <div className="text-[13px] font-medium text-zinc-800">{fechaHoy}</div>
              </div>
              <div className="p-2.5 px-4 border-r border-zinc-100">
                <div className="font-mono text-[9px] font-semibold tracking-[0.14em] uppercase text-zinc-500 mb-1">Paciente</div>
                <div className="text-[13px] font-medium text-zinc-800 uppercase truncate" title={nombrePaciente}>{nombrePaciente}</div>
              </div>
              <div className="p-2.5 px-4">
                <div className="font-mono text-[9px] font-semibold tracking-[0.14em] uppercase text-zinc-500 mb-1">Estatus</div>
                <div className={cn(
                  "text-[12px] font-bold tracking-wide flex items-center gap-1.5",
                  statusActivo ? "text-emerald-500" : "text-zinc-500"
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
          {(Object.keys(generations).length === 0 && !patientData) ? (
            <div className="flex flex-col items-center justify-center opacity-20 py-20 text-center">
              <p className="text-sm font-light text-zinc-500">Inicia la redacción en el panel izquierdo.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Tabla estática de Datos Generales proveniente de patientData (Seed App) */}
              {patientData && (
                <section
                  id="doc-section-datosGenerales"
                  className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <p className="font-mono text-[11px] text-zinc-500 tracking-[0.12em]">01</p>
                    <h2 className="text-[17px] font-semibold tracking-tight text-zinc-900 border-l-[3px] border-zinc-900 pl-[14px] leading-snug m-0">
                      Datos Generales
                    </h2>
                  </div>
                  <div className="prose prose-zinc prose-sm max-w-none prose-headings:font-light prose-headings:tracking-tight prose-headings:text-zinc-800 prose-p:leading-relaxed prose-p:text-zinc-600 prose-a:text-emerald-600 prose-li:text-zinc-600 prose-strong:font-semibold prose-strong:text-zinc-800 selection:bg-emerald-100 selection:text-emerald-900 mt-5">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr>
                          <td style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', fontWeight: 500, letterSpacing: '0.04em', color: '#555', textTransform: 'uppercase', width: '38%', padding: '11px 16px 11px 0', verticalAlign: 'top', borderBottom: '1px solid #e5e7eb' }}>Nombre completo</td>
                          <td style={{ fontSize: '14px', fontWeight: 300, color: '#3a3a3a', padding: '11px 0 11px 16px', verticalAlign: 'top', borderBottom: '1px solid #e5e7eb' }}>{patientData.nombreCompleto || 'No especificado'}</td>
                        </tr>
                        <tr style={{ background: '#f9fafb' }}>
                          <td style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', fontWeight: 500, letterSpacing: '0.04em', color: '#555', textTransform: 'uppercase', width: '38%', padding: '11px 16px 11px 0', verticalAlign: 'top', borderBottom: '1px solid #e5e7eb' }}>Fecha de nacimiento / Edad</td>
                          <td style={{ fontSize: '14px', fontWeight: 300, color: '#3a3a3a', padding: '11px 0 11px 16px', verticalAlign: 'top', borderBottom: '1px solid #e5e7eb' }}>{patientData.fechaNacimiento || 'No especificado'} / {patientData.edad || ''}</td>
                        </tr>
                        <tr>
                          <td style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', fontWeight: 500, letterSpacing: '0.04em', color: '#555', textTransform: 'uppercase', width: '38%', padding: '11px 16px 11px 0', verticalAlign: 'top', borderBottom: '1px solid #e5e7eb' }}>Sexo</td>
                          <td style={{ fontSize: '14px', fontWeight: 300, color: '#3a3a3a', padding: '11px 0 11px 16px', verticalAlign: 'top', borderBottom: '1px solid #e5e7eb' }}>{patientData.genero || 'No especificado'}</td>
                        </tr>
                        <tr style={{ background: '#f9fafb' }}>
                          <td style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', fontWeight: 500, letterSpacing: '0.04em', color: '#555', textTransform: 'uppercase', width: '38%', padding: '11px 16px 11px 0', verticalAlign: 'top', borderBottom: '1px solid #e5e7eb' }}>Ocupación</td>
                          <td style={{ fontSize: '14px', fontWeight: 300, color: '#3a3a3a', padding: '11px 0 11px 16px', verticalAlign: 'top', borderBottom: '1px solid #e5e7eb' }}>{patientData.ocupacion || 'No especificada'}</td>
                        </tr>
                        <tr>
                          <td style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', fontWeight: 500, letterSpacing: '0.04em', color: '#555', textTransform: 'uppercase', width: '38%', padding: '11px 16px 11px 0', verticalAlign: 'top', borderBottom: '1px solid #e5e7eb' }}>Teléfono</td>
                          <td style={{ fontSize: '14px', fontWeight: 300, color: '#3a3a3a', padding: '11px 0 11px 16px', verticalAlign: 'top', borderBottom: '1px solid #e5e7eb' }}>{patientData.telefono || 'No especificado'}</td>
                        </tr>
                        <tr style={{ background: '#f9fafb' }}>
                          <td style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', fontWeight: 500, letterSpacing: '0.04em', color: '#555', textTransform: 'uppercase', width: '38%', padding: '11px 16px 11px 0', verticalAlign: 'top', borderBottom: '1px solid #e5e7eb' }}>Motivo de consulta</td>
                          <td style={{ fontSize: '14px', fontWeight: 300, color: '#3a3a3a', padding: '11px 0 11px 16px', verticalAlign: 'top', borderBottom: '1px solid #e5e7eb' }}>{patientData.motivoConsulta || 'No especificado'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* Secciones generadas dinámicamente */}
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
                      <p className="font-mono text-[11px] text-zinc-600 tracking-[0.12em]">
                        {String(seccionesActivas.findIndex(s => s.id === seccion.id) + 1).padStart(2, '0')}
                      </p>
                      <h2 className="text-[17px] font-semibold tracking-tight text-zinc-900 border-l-[3px] border-zinc-900 pl-[14px] leading-snug m-0">
                        {seccion.nombre.replace(/^\d+\.\s*/, '')}
                      </h2>
                    </div>

                    {/* Contenido de la redacción */}
                    <div className="prose max-w-none text-[15px] leading-relaxed text-zinc-700 text-justify font-mplus">
                      {typeof content === 'string' ? (
                        seccion.id === 'odontograma' ? (
                          <div className="overflow-x-auto">{parse(content)}</div>
                        ) : (
                          <AppleTypewriter speed={0.8} delay={0.2}>
                            {parse(content)}
                          </AppleTypewriter>
                        )
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

