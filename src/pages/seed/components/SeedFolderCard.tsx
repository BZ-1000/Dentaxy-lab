import React from 'react';
import { FileText, ChevronRight } from 'lucide-react';

export default function SeedFolderCard() {
  return (
    <div className="relative w-full h-full flex flex-col justify-end pb-2 px-2">
      
      {/* --- DEFINICIONES DE CLIP PATHS PARA LAS CARPETAS --- */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          {/* 1. Solapa trasera (Pestaña a la izquierda, hombro a Y=18%) */}
          <clipPath id="folder-clip-left" clipPathUnits="objectBoundingBox">
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
          {/* 2. Solapa delantera (Borde superior recto a Y=28% de la altura, esquinas redondeadas) */}
          <clipPath id="folder-front-clip-left" clipPathUnits="objectBoundingBox">
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

      {/* --- CARPETA PRINCIPAL (Compliance - Verde Liquid Glass) --- */}
      <div 
        className="relative w-full h-[360px] seed-compliance-card"
        style={{
          borderRadius: '24px',
          transform: 'translateZ(0)',
        }}
      >
        {/* CAPA 1: SOLAPA TRASERA DE LA CARPETA (Back Folder) */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: 'url(#folder-clip-left)',
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
          className="absolute left-[20px] right-[20px] top-[44px] h-[270px] rounded-2xl shadow-md z-10 p-5 flex flex-col justify-between overflow-hidden transition-all duration-300"
          style={{
            transform: 'rotate(-0.6deg)',
            background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
            border: '1px solid rgba(0, 0, 0, 0.06)',
          }}
        >
          {/* Aquí se traslucirá la hoja blanca */}
          <div className="w-full h-full flex flex-col justify-between opacity-10 pointer-events-none select-none">
            <div className="space-y-3">
              <div className="w-16 h-3 bg-emerald-500 rounded-md"></div>
              <div className="space-y-2">
                <div className="w-full h-1.5 bg-slate-300 rounded-sm"></div>
                <div className="w-[90%] h-1.5 bg-slate-300 rounded-sm"></div>
                <div className="w-[95%] h-1.5 bg-slate-300 rounded-sm"></div>
                <div className="w-[85%] h-1.5 bg-slate-300 rounded-sm"></div>
                <div className="w-[88%] h-1.5 bg-slate-300 rounded-sm"></div>
              </div>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-sm"></div>
          </div>
        </div>



        {/* CAPA 3: SOLAPA DELANTERA (Front Folder de Cristal Verde Vibrante) */}
        <div
          className="absolute inset-0 z-20"
          style={{
            clipPath: 'url(#folder-front-clip-left)',
            background: 'var(--seed-liquid-glass-front)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
          }}
        >
          {/* Borde vectorial SVG exacto de la solapa delantera */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-30" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path 
              d="M 0.5,91.5 L 0.5,33.5 C 0.5,29.5 2.5,27.5 5.5,27.5 L 94.5,27.5 C 97.5,27.5 99.5,29.5 99.5,33.5 L 99.5,91.5 C 99.5,96.5 97.5,99.5 94.5,99.5 L 5.5,99.5 C 2.5,99.5 0.5,96.5 0.5,91.5 Z" 
              fill="none" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" 
            />
          </svg>

          {/* Reflejo de luz diagonal interno */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.08] to-white/[0.22] pointer-events-none z-10"></div>

          {/* Contenido principal sobre la solapa frontal */}
          <div className="absolute top-[28%] inset-x-0 bottom-0 pt-10 px-6 pb-6 flex flex-col justify-between z-20">
            
            {/* Línea de tiempo / Timeline */}
            <div className="mt-1">
              <div className="flex items-center justify-between text-white text-[12px] font-medium mb-3">
                 <span className="tracking-wide">Annual Data Privacy Audit</span>
                 <div className="flex gap-7 text-white/50 font-normal mr-2">
                    <span className="hover:text-white transition cursor-pointer pointer-events-auto">v1</span>
                    <span className="hover:text-white transition cursor-pointer pointer-events-auto">v2-v2</span>
                    <span className="hover:text-white transition cursor-pointer pointer-events-auto">v3-v4</span>
                    <span className="text-white font-semibold relative pointer-events-auto">
                      v1-v6
                      {/* Indicador sutil de activo debajo */}
                      <span className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
                    </span>
                 </div>
                 <span className="text-white/50 font-normal">Final Validation</span>
              </div>
              
              {/* Barra de Timeline */}
              <div className="relative w-full h-[1.5px] bg-white/15 flex items-center">
                 {/* Progreso sólido */}
                 <div className="absolute left-0 h-full bg-white/80 w-[68%]"></div>
                 
                 {/* Puntos anteriores */}
                 <div className="absolute left-[34%] w-1 h-1 bg-white/60 rounded-full"></div>
                 <div className="absolute left-[44%] w-1 h-1 bg-white/60 rounded-full"></div>
                 <div className="absolute left-[54%] w-1 h-1 bg-white/60 rounded-full"></div>
                 
                 {/* Nodo Activo con Resplandor (Glow) */}
                 <div className="absolute left-[68%] -translate-x-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.9)] z-10"></div>
                 
                 {/* Línea punteada posterior */}
                 <div className="absolute left-[68%] right-0 h-full" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.2) 40%, transparent 40%)', backgroundSize: '5px 1px' }}></div>
              </div>
            </div>

            {/* Fila del Documento */}
            <div className="flex gap-4 items-start flex-1 mt-3">
              
              {/* Columna Icono + Conector vertical punteado */}
              <div className="flex flex-col items-center h-full pt-1">
                <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center bg-white/5 text-white/70 shadow-sm">
                   <FileText size={16} />
                </div>
                <div 
                  className="w-px flex-1 mt-3" 
                  style={{ 
                    backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.18) 50%, transparent 50%)', 
                    backgroundSize: '1px 5px',
                    minHeight: '40px'
                  }}
                ></div>
              </div>
              
              {/* Detalles de archivo y Tarjeta de Reunión */}
              <div className="flex-1 flex flex-col justify-between h-full pb-1">
                 <div>
                   <h3 className="text-white font-medium text-[13.5px] tracking-wide leading-tight">GDPR Compliance Report v1.pdf</h3>
                   <p className="text-white/45 text-[10.5px] mt-0.5">compliancebrivags.legar</p>
                 </div>

                 {/* Tarjeta Interna (Reunión) */}
                 <div className="w-full seed-compliance-inner-card rounded-[20px] p-3 flex items-center justify-between backdrop-blur-md transition mt-3">
                    <div className="flex items-center gap-3">
                       
                       {/* Icono de Meet simulado a color */}
                       <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shadow-inner">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.5 8V16H4.5V8H14.5Z" fill="#EA4335" />
                            <path d="M14.5 10L18.5 7V17L14.5 14V10Z" fill="#4285F4" />
                            <path d="M4.5 8H8.5V12H4.5V8Z" fill="#FBBC05" />
                            <path d="M10.5 12H14.5V16H10.5V12Z" fill="#34A853" />
                          </svg>
                       </div>
                       
                       <div>
                          <h4 className="text-white font-medium text-[12px] tracking-wide">Audit Committee Review</h4>
                          <div className="flex items-center gap-2 mt-1">
                             {/* Overlapping Avatars */}
                             <div className="flex -space-x-1">
                               <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" className="w-4 h-4 rounded-full border border-[var(--seed-compliance-avatar-border)]" alt="avatar" />
                               <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" className="w-4 h-4 rounded-full border border-[var(--seed-compliance-avatar-border)]" alt="avatar" />
                             </div>
                             <span className="text-white/50 text-[10px] font-medium tracking-wide">Internal Board</span>
                          </div>
                       </div>
                    </div>
                    
                    {/* Hora */}
                    <div className="bg-white/10 rounded-full px-2.5 py-1 text-white/70 text-[10px] font-semibold tracking-wide">
                       09:00 AM
                    </div>
                 </div>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

