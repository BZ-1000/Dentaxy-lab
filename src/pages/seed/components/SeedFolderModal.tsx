import React, { useState, useEffect } from 'react';
import { X, FileText, CheckCircle2, AlertCircle, Clock, FilePlus2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SeedFolderModalProps {
  folder: any;
  originRect?: DOMRect;
  onClose: () => void;
  activePatient?: any;
  onOpenSeed2?: (patient: any) => void;
}

export default function SeedFolderModal({ folder, originRect, onClose, activePatient, onOpenSeed2 }: SeedFolderModalProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsExpanded(true);
      });
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  // Prevent clicks inside the modal from bubbling to the overlay
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Animación: Deslizar desde abajo (Slide Up)
  const initialTransform = 'translate3d(0, 100vh, 0)';
  const currentTransform = isExpanded ? 'translate3d(0, 0, 0)' : initialTransform;

  return (
    <div 
      className={`fixed inset-0 z-[200] bg-slate-900/40 backdrop-blur-md flex items-center justify-center px-4 transition-opacity duration-500 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      {/* Contenedor del Documento (Hoja Gruesa 3D Simétrica con borde curvo superior) */}
      <div 
        className="relative w-full max-w-[860px] h-full bg-white rounded-t-[32px] border-t border-white border-l-[8px] border-r-[8px] border-b-[8px] border-slate-300 shadow-[0_35px_70px_rgba(0,0,0,0.55)] overflow-hidden flex flex-col"
        onClick={handleModalClick}
        style={{
          transform: currentTransform,
          transition: 'transform 0.55s cubic-bezier(0.2, 0.9, 0.3, 1)',
          transformOrigin: 'center center',
          willChange: 'transform'
        }}
      >
        
        {/* Botón de Cierre */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-50 w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-full flex items-center justify-center transition-all"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* Contenido principal Vacío */}
        <div className="flex-1 px-10 sm:px-14 py-12 flex flex-col items-center justify-center relative">
          
          {/* Fondo perforado / decorativo (Radial Gradient sutil) */}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)', backgroundSize: '32px 32px', opacity: 0.5 }}></div>

          <div className="relative z-10 flex flex-col items-center text-center max-w-[420px] mx-auto mt-[-40px]">
             {/* Icono Orbe Verde */}
             <div className="w-24 h-24 rounded-[28px] bg-emerald-50 border border-emerald-100/60 flex items-center justify-center mb-8 shadow-sm">
                <FilePlus2 className="w-10 h-10 text-emerald-500" strokeWidth={1.5} />
             </div>

             {/* Textos */}
             <h2 className="text-3xl font-light text-slate-800 tracking-tight mb-3">Expediente Vacío</h2>
             <p className="text-slate-500 text-[15px] leading-relaxed mb-10 px-2">
               Esta carpeta clínica se encuentra actualmente sin registros. Comienza a construir el historial clínico agregando el primer documento.
             </p>

             {/* Botón CTA Masivo */}
             <button 
                onClick={() => {
                  if (onOpenSeed2) {
                    onOpenSeed2(activePatient);
                  } else {
                    navigate('/seed/new', { state: { patientData: activePatient } });
                  }
                }}
                className="group relative flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-white px-9 py-4.5 rounded-2xl font-medium text-[16px] tracking-wide transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_30px_-5px_rgba(16,185,129,0.35)] shadow-[0_8px_20px_-6px_rgba(16,185,129,0.3)] w-full sm:w-auto min-h-[56px]"
              >
                <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" strokeWidth={2.5} />
                <span>Agregar Nuevo Expediente</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
