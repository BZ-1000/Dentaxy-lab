import React from 'react';
import { Plus, Zap } from 'lucide-react';

export default function SeedKeyDates() {
  return (
    <div 
      className="w-full h-full px-6 pt-6 pb-12 flex flex-col justify-between transition-all duration-300"
      style={{
        borderRadius: '30px 30px 0 0',
        background: 'var(--seed-card-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--seed-card-border)',
        boxShadow: 'var(--seed-card-shadow), inset 0 1px 0 var(--seed-card-border)'
      }}
    >
      <div>
        {/* Cabecera */}
        <div className="mb-6 pl-1">
          <h2 className="text-[16px] font-semibold tracking-wide" style={{ color: 'var(--seed-text-main)' }}>Key Dates</h2>
          <p className="text-[10px] mt-0.5 font-medium tracking-wide" style={{ color: 'var(--seed-text-muted)' }}>Chandyda Community, smarte together</p>
        </div>

        {/* Encabezados de Tabla */}
        <div className="grid grid-cols-[50px_100px_1fr] items-center text-[10.5px] font-semibold mb-3 pl-1 tracking-wider uppercase" style={{ color: 'var(--seed-text-light)' }}>
          <div></div>
          <div>Date</div>
          <div>Event</div>
        </div>

        {/* Filas */}
        <div className="flex flex-col gap-2.5">
          {/* Fila 1 */}
          <div 
            className="grid grid-cols-[50px_100px_1fr] items-center rounded-2xl border p-2.5 transition group cursor-pointer"
            style={{ 
              backgroundColor: 'var(--seed-row-bg)', 
              borderColor: 'var(--seed-row-border)' 
            }}
          >
            <div className="flex justify-center">
              <div 
                className="w-9 h-9 rounded-full flex items-center justify-center transition shadow-inner"
                style={{ backgroundColor: 'var(--seed-icon-bg)', color: 'var(--seed-icon-text)' }}
              >
                <Plus size={14} />
              </div>
            </div>
            <div>
              <div className="text-[12.5px] font-semibold tracking-wide" style={{ color: 'var(--seed-text-main)' }}>2 Weeks</div>
              <div className="text-[9.5px] mt-0.5 font-medium" style={{ color: 'var(--seed-text-light)' }}>09/12/2023</div>
            </div>
            <div className="text-[12.5px] font-medium tracking-wide" style={{ color: 'var(--seed-text-muted)' }}>
              Autorenew date
            </div>
          </div>

          {/* Fila 2 */}
          <div 
            className="grid grid-cols-[50px_100px_1fr] items-center rounded-2xl border p-2.5 transition group cursor-pointer"
            style={{ 
              backgroundColor: 'var(--seed-row-bg)', 
              borderColor: 'var(--seed-row-border)' 
            }}
          >
            <div className="flex justify-center">
              <div 
                className="w-9 h-9 rounded-full flex items-center justify-center transition shadow-inner"
                style={{ backgroundColor: 'var(--seed-icon-bg)', color: 'var(--seed-icon-text)' }}
              >
                <Zap size={14} fill="currentColor" />
              </div>
            </div>
            <div>
              <div className="text-[12.5px] font-semibold tracking-wide" style={{ color: 'var(--seed-text-main)' }}>2 Months</div>
              <div className="text-[9.5px] mt-0.5 font-medium" style={{ color: 'var(--seed-text-light)' }}>05/12/2023</div>
            </div>
            <div className="text-[12.5px] font-medium tracking-wide" style={{ color: 'var(--seed-text-muted)' }}>
              Termination date
            </div>
          </div>
        </div>
      </div>

      {/* Línea de tiempo inferior */}
      <div className="flex items-center gap-4 pl-2.5 pr-2 pt-2 mt-4" style={{ borderTop: '1px solid var(--seed-row-border)' }}>
        {/* Botón Start */}
        <div 
          className="text-[10.5px] font-semibold rounded-full px-3 py-1 shadow-sm select-none"
          style={{ backgroundColor: 'var(--seed-icon-bg)', color: 'var(--seed-text-main)' }}
        >
          Start
        </div>
        
        {/* Puntos de la timeline distribuidos sutilmente */}
        <div className="flex items-center justify-between flex-1 pl-2 pr-1">
          {/* Activo (Verde) */}
          <div className="relative flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full seed-green-dot"></div>
          </div>
          {/* Gris */}
          <div className="w-1.5 h-1.5 rounded-full bg-current opacity-20"></div>
          {/* Gris */}
          <div className="w-1.5 h-1.5 rounded-full bg-current opacity-20"></div>
          {/* Inactivo/Advertencia (Rojo) */}
          <div className="w-1.5 h-1.5 rounded-full bg-[#EA4335]"></div>
          {/* Gris */}
          <div className="w-1.5 h-1.5 rounded-full bg-current opacity-20"></div>
        </div>
      </div>
      
    </div>
  );
}
