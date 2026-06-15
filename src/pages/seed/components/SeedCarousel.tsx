import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const CARDS_DATA = [
  { id: 1, label: 'Sec', percent: 0 },
  { id: 2, label: 'Lic', percent: 0 },
  { id: 3, label: 'Fin', percent: 0 },
  { id: 4, label: 'Cat', percent: 0 },
  { id: 5, label: 'Omt', percent: 0 },
  { id: 6, label: 'Corporate', percent: 87, active: true, sub: 'Jan 12 - May 12' },
  { id: 7, label: 'Compliance', percent: 0 },
  { id: 8, label: 'Edi', percent: 0 },
  { id: 9, label: 'Mn', percent: 0 },
  { id: 10, label: '', percent: 0 },
  { id: 11, label: '', percent: 0 },
  { id: 12, label: '', percent: 0 },
  { id: 13, label: '', percent: 0 },
  { id: 14, label: '', percent: 0 },
  { id: 15, label: '', percent: 0 },
  { id: 16, label: '', percent: 0 },
  { id: 17, label: '', percent: 0 },
];

export default function SeedCarousel() {
  const activeCard = CARDS_DATA.find(c => c.active);

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

      <div className="flex items-center justify-center relative w-full max-w-5xl h-full">
        {/* Contenedor principal de la tarjeta con sombra 3D proyectada */}
        <div
          className="relative w-[320px] h-[200px] transition-all duration-500 ease-out hover:scale-[1.04] cursor-pointer seed-carousel-active"
          style={{
            borderRadius: '24px',
            transform: 'translateZ(0)',
          }}
        >
          {/* CAPA 1: SOLAPA TRASERA DE LA CARPETA (Back Folder) */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: 'url(#folder-clip-carousel)',
              background: 'var(--seed-liquid-glass-bg)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            {/* Borde sutil interno trasero */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path 
                d="M 0.5,91.5 L 0.5,17.5 C 0.5,11.5 2.5,5.5 5.5,5.5 L 29.5,5.5 C 32.5,5.5 35.5,9.5 37.5,13.5 C 39.5,17.5 41.5,17.5 44.5,17.5 L 94.5,17.5 C 97.5,17.5 99.5,21.5 99.5,25.5 L 99.5,91.5 C 99.5,96.5 97.5,99.5 94.5,99.5 L 5.5,99.5 C 2.5,99.5 0.5,96.5 0.5,91.5 Z" 
                fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" vectorEffect="non-scaling-stroke" 
              />
            </svg>
          </div>

          {/* CAPA 2: HOJA DE PAPEL INTERNA (Document) */}
          <div
            className="absolute left-[16px] right-[16px] top-[24px] h-[152px] rounded-2xl shadow-md z-10 p-3 flex flex-col justify-between overflow-hidden transition-all duration-300"
            style={{
              transform: 'rotate(-0.8deg)',
              background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
            }}
          >
            {/* Renglones simulados del reporte */}
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

          {/* CAPA 3: SOLAPA DELANTERA (Front Folder de Cristal Esmerilado Muy Borroso) */}
          <div
            className="absolute inset-0 z-20"
            style={{
              clipPath: 'url(#folder-front-clip-carousel)',
              background: 'var(--seed-liquid-glass-front)',
              backdropFilter: 'blur(48px)',
              WebkitBackdropFilter: 'blur(48px)',
            }}
          >
            {/* Borde vectorial SVG exacto de la solapa delantera */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-30" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path 
                d="M 0.5,91.5 L 0.5,33.5 C 0.5,29.5 2.5,27.5 5.5,27.5 L 94.5,27.5 C 97.5,27.5 99.5,29.5 99.5,33.5 L 99.5,91.5 C 99.5,96.5 97.5,99.5 94.5,99.5 L 5.5,99.5 C 2.5,99.5 0.5,96.5 0.5,91.5 Z" 
                fill="none" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" 
              />
            </svg>

            {/* Reflejo de luz diagonal interno en el cristal frontal */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.08] to-white/[0.22] pointer-events-none z-10"></div>

            {/* Contenido principal sobre la solapa frontal */}
            <div className="absolute top-[28%] inset-x-0 bottom-0 pt-4 px-5 pb-4 flex flex-col justify-between z-20">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-semibold text-[17px] leading-tight tracking-wide">{activeCard.label}</h3>
                  <p className="text-white/70 text-[10px] mt-0.5 font-medium">{activeCard.sub}</p>
                </div>
                <ArrowUpRight size={17} className="text-white/80 hover:text-white transition" />
              </div>
              
              <div className="flex justify-between items-end">
                <span className="text-white font-light text-[28px] leading-none tracking-tight">{activeCard.percent}%</span>
                <div className="w-2.5 h-2.5 rounded-full seed-green-dot"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
