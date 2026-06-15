import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const CARDS_DATA = [
  { id: 1, label: 'CROID Clin', percent: 0 },
  { id: 2, label: 'UAZ Acad', percent: 0 },
  { id: 3, label: 'Finanzas', percent: 0 },
  { id: 4, label: 'Catálogos', percent: 0 },
  { id: 5, label: 'Pacientes', percent: 0 },
  { id: 6, label: 'Corporate', percent: 87, active: true, sub: 'Jan 12 - May 12' },
  { id: 7, label: 'Compliance', percent: 0 },
  { id: 8, label: 'Historial', percent: 0 },
  { id: 9, label: 'Recetas', percent: 0 },
  { id: 10, label: 'Inventario', percent: 0 },
  { id: 11, label: 'Usuarios', percent: 0 },
  { id: 12, label: 'Reportes', percent: 0 },
  { id: 13, label: 'Config', percent: 0 },
];

export default function SeedCarousel() {
  const activeCard = CARDS_DATA.find(c => c.active);
  const activeIdx = CARDS_DATA.findIndex(c => c.active);

  if (!activeCard) return null;

  return (
    <div className="relative w-full h-[320px] flex items-center justify-center z-30">
      
      {/* Definiciones locales de clipPath para las capas de la carpeta */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          {/* 1. Clip path para la solapa trasera (con la pestaña de archivo a la izquierda, hombro a 18%) */}
          <clipPath id="folder-clip-carousel" clipPathUnits="objectBoundingBox">
            <path d="M 0,0.92 
                     L 0,0.18 
                     C 0,0.12, 0.02,0.06, 0.05,0.06 
                     L 0.30,0.06 
                     C 0.33,0.06, 0.36,0.10, 0.38,0.14 
                     C 0.40,0.18, 0.42,0.18, 0.45,0.18 
                     L 0.95,0.18 
                     C 0.98,0.18, 1,0.22, 1,0.26 
                     L 1,0.92 
                     C 1,0.96, 0.98,1, 0.95,1 
                     L 0.05,1 
                     C 0.02,1, 0,0.96, 0,0.92 
                     Z" />
          </clipPath>
          {/* 2. Clip path para la solapa delantera (recta a la altura de Y=28% de alto, con esquinas redondeadas) */}
          <clipPath id="folder-front-clip-carousel" clipPathUnits="objectBoundingBox">
            <path d="M 0,0.92 
                     L 0,0.34 
                     C 0,0.30, 0.02,0.28, 0.05,0.28 
                     L 0.95,0.28 
                     C 0.98,0.28, 1,0.30, 1,0.34 
                     L 1,0.92 
                     C 1,0.96, 0.98,1, 0.95,1 
                     L 0.05,1 
                     C 0.02,1, 0,0.96, 0,0.92 
                     Z" />
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
        {CARDS_DATA.map((card, i) => {
          const diff = i - activeIdx;
          const isActive = diff === 0;

          // Parámetros de la pila 3D (archivador infinito)
          const gap = 38; // Separación horizontal
          const zStep = 32; // Separación de profundidad
          const rY = 56; // Rotación en eje Y

          let translateX = diff * gap;
          let translateZ = -Math.abs(diff) * zStep;
          let rotateY = diff < 0 ? rY : diff > 0 ? -rY : 0;
          let rotateX = 0;

          // Separación extra respecto a la carpeta activa para no tapar los textos
          if (diff < 0) {
            translateX -= 20;
          } else if (diff > 0) {
            translateX += 20;
          }

          // Si es activa, se posiciona de frente y un poco adelantada
          if (isActive) {
            translateZ = 45;
            rotateY = -12; // Rotación sutil para dinamismo
            rotateX = 1;
          }

          const transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
          
          // Desvanecimiento hacia los bordes
          const maxDiff = 6;
          const opacity = Math.max(0, 1 - Math.abs(diff) / maxDiff);

          // Apilamiento 3D correcto (los elementos del centro tienen prioridad visual)
          const zIndex = 50 - Math.abs(diff);

          if (opacity <= 0) return null;

          return (
            <div
              key={card.id}
              className={`absolute w-[320px] h-[200px] transition-all duration-700 ease-out ${isActive ? 'seed-carousel-active cursor-pointer' : 'seed-carousel-inactive'}`}
              style={{
                transform,
                opacity,
                borderRadius: '24px',
                transformStyle: 'preserve-3d',
                pointerEvents: isActive ? 'auto' : 'none',
                zIndex,
              }}
            >
              {/* CAPA 1: SOLAPA TRASERA DE LA CARPETA */}
              <div
                className="absolute inset-0"
                style={{
                  clipPath: 'url(#folder-clip-carousel)',
                  background: isActive ? 'var(--seed-liquid-glass-bg)' : 'var(--seed-inactive-folder-bg)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}
              >
                {/* Borde sutil interno trasero */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path 
                    d="M 0.5,91.5 L 0.5,17.5 C 0.5,11.5 2.5,5.5 5.5,5.5 L 29.5,5.5 C 32.5,5.5 35.5,9.5 37.5,13.5 C 39.5,17.5 41.5,17.5 44.5,17.5 L 94.5,17.5 C 97.5,17.5 99.5,21.5 99.5,25.5 L 99.5,91.5 C 99.5,96.5 97.5,99.5 94.5,99.5 L 5.5,99.5 C 2.5,99.5 0.5,96.5 0.5,91.5 Z" 
                    fill="none" 
                    stroke={isActive ? 'rgba(255, 255, 255, 0.2)' : 'var(--seed-inactive-folder-stroke)'} 
                    strokeWidth="1" 
                    vectorEffect="non-scaling-stroke" 
                  />
                </svg>
              </div>

              {/* CAPA 2: HOJA DE PAPEL INTERNA */}
              <div
                className="absolute left-[16px] right-[16px] top-[24px] h-[152px] rounded-2xl shadow-md z-10 p-3 flex flex-col justify-between overflow-hidden seed-folder-paper"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                }}
              >
                {/* Renglones simulados del reporte */}
                <div className="space-y-2">
                  <div className={`w-10 h-2 rounded-md ${isActive ? 'bg-emerald-500/30' : 'bg-slate-300/15'}`}></div>
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

              {/* CAPA 3: SOLAPA DELANTERA */}
              <div
                className="absolute inset-0 z-20 seed-folder-front"
                style={{
                  clipPath: 'url(#folder-front-clip-carousel)',
                  background: isActive ? 'var(--seed-liquid-glass-front)' : 'var(--seed-inactive-folder-front)',
                  backdropFilter: isActive ? 'blur(48px)' : 'blur(16px)',
                  WebkitBackdropFilter: isActive ? 'blur(48px)' : 'blur(16px)',
                }}
              >
                {/* Borde vectorial SVG exacto de la solapa delantera */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path 
                    d="M 0.5,91.5 L 0.5,33.5 C 0.5,29.5 2.5,27.5 5.5,27.5 L 94.5,27.5 C 97.5,27.5 99.5,29.5 99.5,33.5 L 99.5,91.5 C 99.5,96.5 97.5,99.5 94.5,99.5 L 5.5,99.5 C 2.5,99.5 0.5,96.5 0.5,91.5 Z" 
                    fill="none" 
                    stroke={isActive ? 'rgba(255, 255, 255, 0.35)' : 'var(--seed-inactive-folder-stroke)'} 
                    strokeWidth="1.2" 
                    vectorEffect="non-scaling-stroke" 
                  />
                </svg>

                {/* Reflejo de luz diagonal interno */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.04] to-white/[0.12] pointer-events-none z-10"></div>

                {/* Contenido sobre la solapa frontal */}
                {isActive ? (
                  <div className="absolute top-[28%] inset-x-0 bottom-0 pt-4 px-5 pb-4 flex flex-col justify-between z-20">
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
                ) : (
                  /* Etiquetas laterales para simular carpetas vacías alineadas en archivador */
                  <div className="absolute bottom-4 left-5 right-5 z-20 flex justify-between items-end">
                    <span 
                      className="font-semibold text-[11px] tracking-wide select-none transition-colors duration-300"
                      style={{ color: 'var(--seed-inactive-text)' }}
                    >
                      {card.label}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full opacity-30" style={{ backgroundColor: 'var(--seed-inactive-text)' }}></div>
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
