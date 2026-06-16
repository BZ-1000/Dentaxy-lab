import React, { useState, useRef, useCallback } from 'react';
import { ArrowUpRight } from 'lucide-react';
import EmptyFolderStack from './EmptyFolderStack';

const CAROUSEL_CARDS = Array.from({ length: 13 }).map((_, i) => {
  const baseDiff = i - 6; // -6 a +6
  return {
    id: i + 1,
    label: baseDiff === 0 ? 'Corporate' : `Archive ${Math.abs(baseDiff)}`,
    percent: baseDiff === 0 ? 87 : 45 + Math.abs(baseDiff) * 5,
    sub: baseDiff === 0 ? 'Jan 12 - May 12' : 'Previous Period',
    baseDiff,
    colorClass: 'bg-gradient-to-br from-emerald-400 to-emerald-500'
  };
});

interface SeedCarouselProps {
  onOpenFolder?: (folder: any, rect: DOMRect) => void;
}

export default function SeedCarousel({ onOpenFolder }: SeedCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0); // De -6 a +6
  const isScrolling = useRef(false);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    // Si ya estamos animando, ignorar scroll (throttle visual fluido)
    if (isScrolling.current) return;
    
    // Filtro de sensibilidad fina
    if (Math.abs(e.deltaY) < 15 && Math.abs(e.deltaX) < 15) return;

    isScrolling.current = true;
    setTimeout(() => {
      isScrolling.current = false;
    }, 450); // 450ms coincide con la transición CSS (duration-500) para un flow suave

    if (e.deltaY > 0 || e.deltaX > 0) {
      // Scroll hacia abajo/derecha: Avanzar carrusel
      setActiveIndex(prev => Math.min(prev + 1, 6));
    } else {
      // Scroll hacia arriba/izquierda: Retroceder carrusel
      setActiveIndex(prev => Math.max(prev - 1, -6));
    }
  }, []);

  return (
    <div 
      className="relative w-full h-[320px] flex items-center justify-center z-30"
      onWheel={handleWheel}
    >
      
      {/* Definiciones locales de clipPath para las capas de la carpeta central */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          {/* 1. Clip path para la solapa trasera con diseño de curva perfecta y bordes inferiores redondeados a 24px */}
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
        {CAROUSEL_CARDS.map((card) => {
          const currentDiff = card.baseDiff - activeIndex;
          const isActive = currentDiff === 0;

          // Calcular Coverflow Matemático
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
            // Lado izquierdo: Más espaciadas (75px) y más metidas al fondo (90px)
            rotateY = 55;
            translateX = currentDiff * 75 - 180;
            translateZ = -Math.abs(currentDiff) * 90;
            scaleX = 1;
          } else {
            // Lado derecho: Más espaciadas (75px) y más metidas al fondo (90px)
            // Se añade scaleX(-1) para que la pestaña quede invertida hacia afuera
            rotateY = -55;
            translateX = currentDiff * 75 + 180;
            translateZ = -Math.abs(currentDiff) * 90;
            scaleX = -1;
          }

          const transform = `translate3d(${translateX}px, 0px, ${translateZ}px) rotateY(${rotateY}deg) scaleX(${scaleX})`;

          // Igualar físicas de iluminación (Sombras y Bisel) de izquierda y derecha usando iluminación CENITAL (Top-Down)
          // Al usar offset X = 0, garantizamos que las sombras y brillos sean simétricos y de calidad perfecta en todos los ángulos.
          let boxShadow = '0 10px 30px -4px rgba(0,0,0,0.18), inset 0 2px 6px rgba(255,255,255,0.4)';
          let borderLeft = '1px solid rgba(255,255,255,0.3)';
          let borderRight = '1px solid rgba(255,255,255,0.3)';
          let glassGradient = 'bg-gradient-to-b';

          return (
            <div
              key={card.id}
              onClick={(e) => {
                if (isActive && onOpenFolder) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  onOpenFolder(card, rect);
                } else {
                  setActiveIndex(card.baseDiff);
                }
              }}
              className={`absolute w-[320px] h-[200px] transition-all duration-500 ease-out cursor-pointer group ${isActive ? 'seed-carousel-active' : ''}`}
              style={{
                transform,
                borderRadius: '24px',
                transformStyle: 'preserve-3d',
                zIndex: 50 - Math.abs(currentDiff),
              }}
            >
              {/* CAPA 1: SOLAPA TRASERA DE LA CARPETA */}
              <div
                className="absolute inset-0 seed-folder-back drop-shadow-md"
                style={{
                  clipPath: 'url(#folder-back-clip-central)',
                  background: 'var(--seed-white-glass-bg)',
                }}
              >
                {/* Teñido verde para la carpeta activa en la solapa trasera (pestaña) */}
                {isActive && (
                  <div className={`absolute inset-0 ${card.colorClass} opacity-[0.65]`}></div>
                )}
                {/* Borde vectorial SVG exacto en bbox relativo */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 200" preserveAspectRatio="none">
                  <path 
                    d="M 0,176 L 0,16 A 16,16 0 0,1 16,0 L 90,0 A 16,16 0 0,1 104,8 L 114,20 A 16,16 0 0,0 126,26 L 304,26 A 16,16 0 0,1 320,42 L 320,176 A 24,24 0 0,1 296,200 L 24,200 A 24,24 0 0,1 0,176 Z" 
                    fill="none" 
                    stroke="rgba(255, 255, 255, 0.4)" 
                    strokeWidth="1.5"
                  />
                </svg>
              </div>

              {/* CAPA 2: HOJA DE PAPEL INTERNA (Escondida bajo el hombro trasero Y=32px) */}
              <div
                className="absolute left-[16px] right-[16px] top-[42px] h-[146px] rounded-2xl shadow-md z-10 p-3 flex flex-col justify-between overflow-hidden seed-folder-paper"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
                  transform: 'translate3d(0, 0, 12px)',
                }}
              >  {/* Renglones simulados del reporte */}
                <div className="space-y-2">
                  <div className="w-10 h-2 bg-emerald-500/30 rounded-md"></div>
                  <div className="space-y-1.5">
                    <div className="w-full h-1 bg-slate-200/90 rounded-sm"></div>
                    <div className="w-[92%] h-1 bg-slate-200/90 rounded-sm"></div>
                    <div className="w-[96%] h-1 bg-slate-200/90 rounded-sm"></div>
                    <div className="w-[85%] h-1 bg-slate-200/90 rounded-sm"></div>
                  </div>
                </div>
                {/* Pie de página del papel */}
                <div className="flex justify-between items-end">
                  <div className="px-1.5 py-0.5 rounded bg-slate-100 flex items-center justify-center text-[8.5px] text-slate-400 font-bold tracking-wider">
                    REPORT
                  </div>
                  <div className="w-6 h-1 bg-slate-200 rounded-sm"></div>
                </div>
              </div>

              {/* LOMO INFERIOR (SPINE) EN 3D PARA VOLUMEN FÍSICO */}
              {/* Le damos margen a los lados (left-6 right-6 que son 24px) para que no sobresalga de las esquinas redondeadas */}
              <div className="seed-folder-spine" style={{ left: '24px', right: '24px' }}></div>

              {/* CAPA 3: SOLAPA DELANTERA (Bloque grueso 3D de acrílico) */}
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
                  <div className={`absolute inset-0 ${card.colorClass} opacity-90`} style={{ borderRadius: '16px 16px 24px 24px' }}></div>
                )}
                <div className={`absolute inset-0 ${glassGradient} from-white/0 via-white/[0.08] to-white/[0.22] pointer-events-none z-10`} style={{ borderRadius: '16px 16px 24px 24px' }}></div>

                {/* Contenido principal sobre la solapa frontal */}
                {isActive && (
                  <div className="absolute top-0 inset-x-0 bottom-0 pt-3 px-5 pb-4 flex flex-col justify-between z-20">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-semibold text-[17px] leading-tight tracking-wide">{card.label}</h3>
                        <p className="text-white/70 text-[10px] mt-0.5 font-medium">{card.sub}</p>
                      </div>
                      <ArrowUpRight size={17} className="text-white/80 hover:text-white transition" />
                    </div>

                    <div className="flex justify-between items-end">
                      <span className="text-white font-light text-[28px] leading-none tracking-tight">{card.percent}%</span>
                      <div className="w-2.5 h-2.5 rounded-full seed-green-dot"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
