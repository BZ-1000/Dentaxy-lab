import React from 'react';
import { FileText, ChevronRight } from 'lucide-react';

export default function SeedFolderCard() {
  return (
    <div className="relative w-full h-full flex flex-col justify-end pt-12 pb-2 px-2">
      
      {/* --- DEFINICIONES DE CLIP PATHS PARA LAS CARPETAS --- */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <clipPath id="folder-clip-left" clipPathUnits="objectBoundingBox">
            <path d="M 0,0.92 
                     L 0,0.12 
                     C 0,0.06, 0.02,0.03, 0.05,0.03 
                     L 0.35,0.03 
                     C 0.38,0.03, 0.41,0.07, 0.43,0.11 
                     C 0.45,0.14, 0.47,0.14, 0.50,0.14 
                     L 0.95,0.14 
                     C 0.98,0.14, 1,0.17, 1,0.22 
                     L 1,0.92 
                     C 1,0.96, 0.98,1, 0.95,1 
                     L 0.05,1 
                     C 0.02,1, 0,0.96, 0,0.92 
                     Z" />
          </clipPath>
          <clipPath id="folder-clip-mid-left" clipPathUnits="objectBoundingBox">
            <path d="M 0,0.92 
                     L 0,0.14 
                     C 0,0.12, 0.02,0.11, 0.05,0.11 
                     L 0.18,0.11 
                     C 0.20,0.11, 0.22,0.08, 0.24,0.03 
                     C 0.26,0, 0.28,0, 0.31,0 
                     L 0.54,0 
                     C 0.57,0, 0.59,0, 0.61,0.03 
                     C 0.63,0.08, 0.65,0.11, 0.68,0.11 
                     L 0.95,0.11 
                     C 0.98,0.11, 1,0.13, 1,0.16 
                     L 1,0.92 
                     C 1,0.96, 0.98,1, 0.95,1 
                     L 0.05,1 
                     C 0.02,1, 0,0.96, 0,0.92 
                     Z" />
          </clipPath>
          <clipPath id="folder-clip-mid-right" clipPathUnits="objectBoundingBox">
            <path d="M 0,0.92 
                     L 0,0.14 
                     C 0,0.12, 0.02,0.11, 0.05,0.11 
                     L 0.32,0.11 
                     C 0.34,0.11, 0.36,0.08, 0.38,0.03 
                     C 0.40,0, 0.42,0, 0.45,0 
                     L 0.68,0 
                     C 0.71,0, 0.73,0, 0.75,0.03 
                     C 0.77,0.08, 0.79,0.11, 0.82,0.11 
                     L 0.95,0.11 
                     C 0.98,0.11, 1,0.13, 1,0.16 
                     L 1,0.92 
                     C 1,0.96, 0.98,1, 0.95,1 
                     L 0.05,1 
                     C 0.02,1, 0,0.96, 0,0.92 
                     Z" />
          </clipPath>
        </defs>
      </svg>

      {/* --- CARPETAS DE FONDO EN CASCADA --- */}

      {/* 1. Simatent (Al fondo, izquierda) */}
      <div 
        className="absolute top-[-10px] left-0 w-full h-[360px] opacity-40 scale-[0.88] origin-bottom -z-30 select-none pointer-events-none transition-all duration-300"
        style={{
          clipPath: 'url(#folder-clip-left)',
          background: 'var(--seed-folder-bg-1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path 
            d="M 0.5,91.5 L 0.5,12.5 C 0.5,6.5 2.5,3.5 5.5,3.5 L 34.5,3.5 C 37.5,3.5 40.5,7.5 42.5,11.5 C 44.5,14.5 46.5,14.5 49.5,14.5 L 94.5,14.5 C 97.5,14.5 99.5,17.5 99.5,22.5 L 99.5,91.5 C 99.5,96.5 97.5,99.5 94.5,99.5 L 5.5,99.5 C 2.5,99.5 0.5,96.5 0.5,91.5 Z" 
            fill="none" stroke="var(--seed-folder-stroke-1)" strokeWidth="1" vectorEffect="non-scaling-stroke" 
          />
        </svg>
        <div className="absolute left-6 top-5 text-[12px] font-medium tracking-wider" style={{ color: 'var(--seed-text-muted)' }}>
          Simatent
        </div>
      </div>

      {/* 2. Vender (En medio, centro-izquierda) */}
      <div 
        className="absolute top-[5px] left-0 w-full h-[360px] opacity-60 scale-[0.93] origin-bottom -z-20 select-none pointer-events-none transition-all duration-300"
        style={{
          clipPath: 'url(#folder-clip-mid-left)',
          background: 'var(--seed-folder-bg-2)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path 
            d="M 0.5,91.5 L 0.5,14.5 C 0.5,12.5 2.5,11.5 5.5,11.5 L 17.5,11.5 C 19.5,11.5 21.5,8.5 23.5,3.5 C 25.5,0.5 27.5,0.5 30.5,0.5 L 53.5,0.5 C 56.5,0.5 58.5,0.5 60.5,3.5 C 62.5,8.5 64.5,11.5 67.5,11.5 L 94.5,11.5 C 97.5,11.5 99.5,13.5 99.5,16.5 L 99.5,91.5 C 99.5,95.5 97.5,99.5 94.5,99.5 L 5.5,99.5 C 2.5,99.5 0.5,95.5 0.5,91.5 Z" 
            fill="none" stroke="var(--seed-folder-stroke-2)" strokeWidth="1" vectorEffect="non-scaling-stroke" 
          />
        </svg>
        <div className="absolute left-[92px] top-2 text-[12px] font-medium tracking-wider" style={{ color: 'var(--seed-text-muted)' }}>
          Vender
        </div>
        <div className="absolute left-[92px] top-[50px] text-[10px] font-medium" style={{ color: 'var(--seed-text-light)' }}>
          Approved Auto
        </div>
        <div className="absolute left-[92px] top-[64px] text-[13px] font-semibold tracking-wide" style={{ color: 'var(--seed-text-muted)' }}>
          Onestry
        </div>
      </div>

      {/* 3. QPA (Adelante de las de fondo, centro-derecha) */}
      <div 
        className="absolute top-[20px] left-0 w-full h-[360px] opacity-85 scale-[0.97] origin-bottom -z-10 select-none pointer-events-none transition-all duration-300"
        style={{
          clipPath: 'url(#folder-clip-mid-right)',
          background: 'var(--seed-folder-bg-3)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path 
            d="M 0.5,91.5 L 0.5,14.5 C 0.5,12.5 2.5,11.5 5.5,11.5 L 31.5,11.5 C 33.5,11.5 35.5,8.5 37.5,3.5 C 39.5,0.5 41.5,0.5 44.5,0.5 L 67.5,0.5 C 70.5,0.5 72.5,0.5 74.5,3.5 C 76.5,8.5 78.5,11.5 81.5,11.5 L 94.5,11.5 C 97.5,11.5 99.5,13.5 99.5,16.5 L 99.5,91.5 C 99.5,95.5 97.5,99.5 94.5,99.5 L 5.5,99.5 C 2.5,99.5 0.5,95.5 0.5,91.5 Z" 
            fill="none" stroke="var(--seed-folder-stroke-3)" strokeWidth="1" vectorEffect="non-scaling-stroke" 
          />
        </svg>
        <div className="absolute left-[158px] top-2 text-[12px] font-medium tracking-wider flex items-center gap-1.5" style={{ color: 'var(--seed-text-main)' }}>
          QPA
          <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] text-white bg-white/10">
            ➔
          </div>
        </div>
        <div className="absolute left-6 top-[50px] text-[10px] font-medium" style={{ color: 'var(--seed-text-light)' }}>
          Secctec Aolos
        </div>
        <div className="absolute left-6 top-[64px] text-[13px] font-semibold tracking-wide" style={{ color: 'var(--seed-text-muted)' }}>
          City Onestry
        </div>
        <div className="absolute left-6 top-[84px] text-[9px] font-medium leading-tight" style={{ color: 'var(--seed-text-light)' }}>
          Aszet Catomonics Review<br/>City Gnoestity
        </div>
      </div>

      {/* --- CARPETA PRINCIPAL (Compliance - Verde) --- */}
      <div 
        className="relative w-full h-[360px] seed-compliance-card"
        style={{
          clipPath: 'url(#folder-clip-left)',
          background: 'var(--seed-compliance-bg)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
        }}
      >
        {/* Borde vectorial SVG exacto con stroke de no-escalado */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-30" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path 
            d="M 0.5,91.5 L 0.5,12.5 C 0.5,6.5 2.5,3.5 5.5,3.5 L 34.5,3.5 C 37.5,3.5 40.5,7.5 42.5,11.5 C 44.5,14.5 46.5,14.5 49.5,14.5 L 94.5,14.5 C 97.5,14.5 99.5,17.5 99.5,22.5 L 99.5,91.5 C 99.5,96.5 97.5,99.5 94.5,99.5 L 5.5,99.5 C 2.5,99.5 0.5,96.5 0.5,91.5 Z" 
            fill="none" stroke="rgba(255, 255, 255, 0.22)" strokeWidth="1" vectorEffect="non-scaling-stroke" 
          />
        </svg>

        {/* Reflejo de luz diagonal interno (Brillo del material) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.04] to-white/[0.08] pointer-events-none z-10"></div>

        {/* Cabecera dentro de la pestaña (Tab) */}
        <div className="absolute left-6 top-3.5 z-20">
          <h2 className="text-white text-[19px] font-semibold tracking-wide leading-tight">Compliance</h2>
          <p className="text-white/60 text-[10px] font-medium tracking-wider mt-0.5">Recent activity</p>
        </div>

        {/* Contenido de la carpeta (Desplazado hacia abajo para librar la pestaña) */}
        <div className="pt-[64px] px-6 h-full flex flex-col justify-between pb-6 relative z-20">
          
          {/* Línea de tiempo / Timeline */}
          <div className="mt-2">
            <div className="flex items-center justify-between text-white text-[12px] font-medium mb-3">
               <span className="tracking-wide">Annual Data Privacy Audit</span>
               <div className="flex gap-7 text-white/50 font-normal mr-2">
                  <span className="hover:text-white transition cursor-pointer">v1</span>
                  <span className="hover:text-white transition cursor-pointer">v2-v2</span>
                  <span className="hover:text-white transition cursor-pointer">v3-v4</span>
                  <span className="text-white font-semibold relative">
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
          <div className="flex gap-4 items-start flex-1 mt-4">
            
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
  );
}

