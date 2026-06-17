import React, { useState, useRef, useCallback } from 'react';
import { ArrowUpRight, FolderOpen } from 'lucide-react';

interface SeedCarouselProps {
  onOpenFolder?: (folder: any, rect: DOMRect) => void;
  onOpenAddPatient?: () => void;
}

export default function SeedCarousel({ onOpenFolder, onOpenAddPatient }: SeedCarouselProps) {
  const IS_EMPTY_STATE = true; // Estado vacío forzado por requerimiento actual (0 pacientes)

  // Mapeamos una sola tarjeta especial para el expediente vacío que heredará las físicas 3D
  const EMPTY_CARD = {
    id: 999,
    label: 'Expediente Vacío',
    percent: 0,
    sub: 'Sin registros clínicos',
    baseDiff: 0,
    colorClass: 'bg-gradient-to-br from-emerald-400 to-emerald-500'
  };

  const [activeIndex, setActiveIndex] = useState(0); // De -6 a +6
  const isScrolling = useRef(false);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (isScrolling.current) return;
    if (Math.abs(e.deltaY) < 15 && Math.abs(e.deltaX) < 15) return;

    isScrolling.current = true;
    setTimeout(() => {
      isScrolling.current = false;
    }, 200);

    if (e.deltaY > 0 || e.deltaX > 0) {
      setActiveIndex(prev => Math.min(prev + 1, 6));
    } else {
      setActiveIndex(prev => Math.max(prev - 1, -6));
    }
  }, []);

  // Calcular Coverflow Matemático para la carpeta vacía central
  const currentDiff = EMPTY_CARD.baseDiff - activeIndex;
  const isActive = currentDiff === 0;

  let translateX = 0;
  let translateZ = 0;
  let rotateY = 0;
  let scaleX = 1;

  if (isActive) {
    translateX = 0;
    translateZ = 60;
    rotateY = 0;
    scaleX = 1;
  } else if (currentDiff < 0) {
    rotateY = 12;
    translateX = currentDiff * 55 - 140;
    translateZ = -Math.abs(currentDiff) * 35;
    scaleX = 1;
  } else {
    rotateY = -12;
    translateX = currentDiff * 55 + 140;
    translateZ = -Math.abs(currentDiff) * 35;
    scaleX = -1;
  }

  const transform = `translate3d(${translateX}px, 0px, ${translateZ}px) rotateY(${rotateY}deg) scaleX(${scaleX})`;

  let boxShadow = '0 10px 30px -4px rgba(0,0,0,0.18), inset 0 2px 6px rgba(255,255,255,0.4)';
  let borderLeft = '1px solid rgba(255,255,255,0.3)';
  let borderRight = '1px solid rgba(255,255,255,0.3)';

  return (
    <div 
      className="relative w-full h-[320px] flex items-center justify-center z-30"
      onWheel={handleWheel}
    >
      
      {/* Definiciones locales de clipPath para las capas de la carpeta central */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <clipPath id="folder-back-clip-central" clipPathUnits="userSpaceOnUse">
            <path d="M 0,176 L 0,16 A 16,16 0 0,1 16,0 L 90,0 A 16,16 0 0,1 104,8 L 114,20 A 16,16 0 0,0 126,26 L 304,26 A 16,16 0 0,1 320,42 L 320,176 A 24,24 0 0,1 296,200 L 24,200 A 24,24 0 0,1 0,176 Z" />
          </clipPath>
        </defs>
      </svg>

      <div 
        className="flex items-center justify-center relative w-full max-w-5xl h-full"
        style={{
          perspective: '1500px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Renderizado de la Carpeta Vacía como tarjeta de carrusel 3D animada */}
        <div
          onClick={() => {
            if (isActive && onOpenAddPatient) {
              onOpenAddPatient();
            } else {
              setActiveIndex(EMPTY_CARD.baseDiff);
            }
          }}
          className={`absolute w-[320px] h-[200px] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer group ${isActive ? 'seed-carousel-active' : ''}`}
          style={{
            transform,
            borderRadius: '24px',
            transformStyle: 'preserve-3d',
            zIndex: 50 - Math.abs(currentDiff),
          }}
        >
          {/* Capa Trasera */}
          <div
            className="absolute inset-0 seed-folder-back drop-shadow-md"
            style={{
              clipPath: 'url(#folder-back-clip-central)',
              background: 'var(--seed-white-glass-bg)',
            }}
          >
            {isActive && (
              <div className={`absolute inset-0 ${EMPTY_CARD.colorClass} opacity-[0.65]`}></div>
            )}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 200" preserveAspectRatio="none">
              <path 
                d="M 0,176 L 0,16 A 16,16 0 0,1 16,0 L 90,0 A 16,16 0 0,1 104,8 L 114,20 A 16,16 0 0,0 126,26 L 304,26 A 16,16 0 0,1 320,42 L 320,176 A 24,24 0 0,1 296,200 L 24,200 A 24,24 0 0,1 0,176 Z" 
                fill="none" 
                stroke="rgba(255, 255, 255, 0.4)" 
                strokeWidth="1.5"
              />
            </svg>
          </div>

          {/* Capa Papel Interno con mensaje de Expediente Vacío */}
          <div
            className="absolute left-[16px] right-[16px] top-[42px] h-[146px] rounded-2xl shadow-md z-10 p-4 flex flex-col items-center justify-center text-center seed-folder-paper"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
              transform: 'translate3d(0, 0, 12px)',
            }}
          >
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-2 border border-slate-100 shadow-sm">
              <FolderOpen size={18} className="text-slate-300 animate-bounce" />
            </div>
            <h3 className="text-slate-600 font-semibold text-[13px] tracking-wide">Expediente Vacío</h3>
            <p className="text-slate-400 text-[10px] max-w-[180px] mt-0.5">Haz clic aquí para agregar un paciente nuevo</p>
          </div>

          {/* Lomo Físico */}
          <div className="seed-folder-spine" style={{ left: '24px', right: '24px' }}></div>

          {/* Capa Delantera (Verde Glassmorphism Optimizado) */}
          <div
            className="absolute top-[56px] left-0 right-0 bottom-0 z-20 seed-folder-front"
            style={{
              transform: 'translate3d(0, 0, 24px)',
              transformStyle: 'preserve-3d',
              borderRadius: '16px 16px 24px 24px',
              borderTop: '1.5px solid rgba(255,255,255,0.5)',
              borderBottom: '1.5px solid rgba(255,255,255,0.3)',
              borderLeft,
              borderRight,
              boxShadow,
              background: isActive ? 'transparent' : 'var(--seed-white-glass-front)',
            }}
          >
            {isActive && (
              <div className={`absolute inset-0 ${EMPTY_CARD.colorClass} opacity-90`} style={{ borderRadius: '16px 16px 24px 24px' }}></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/[0.08] to-white/[0.22] pointer-events-none z-10" style={{ borderRadius: '16px 16px 24px 24px' }}></div>

            {isActive && (
              <div className="absolute top-0 inset-x-0 bottom-0 pt-3 px-5 pb-4 flex flex-col justify-between z-20">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-semibold text-[15px] leading-tight tracking-wide">{EMPTY_CARD.label}</h3>
                    <p className="text-white/70 text-[9px] mt-0.5 font-medium">{EMPTY_CARD.sub}</p>
                  </div>
                  <ArrowUpRight size={15} className="text-white/80 hover:text-white transition" />
                </div>

                <div className="flex justify-between items-end">
                  <span className="text-white font-light text-[22px] leading-none tracking-tight">Agregar</span>
                  <div className="w-2 h-2 rounded-full seed-green-dot animate-ping"></div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
