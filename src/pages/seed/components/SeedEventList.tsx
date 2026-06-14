import React, { useState } from 'react';

export default function SeedEventList() {
  const [riskActive, setRiskActive] = useState(true);
  const [deliverableActive, setDeliverableActive] = useState(true);

  return (
    <div 
      className="w-full h-full p-6 flex flex-col justify-between overflow-hidden transition-all duration-300"
      style={{
        borderRadius: '30px',
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
          <h2 className="text-[16px] font-semibold tracking-wide" style={{ color: 'var(--seed-text-main)' }}>Risk Assessment</h2>
        </div>

        {/* Encabezados de Tabla */}
        <div className="flex justify-between text-[10.5px] font-semibold mb-3 pl-1 pr-2 tracking-wider uppercase" style={{ color: 'var(--seed-text-light)' }}>
          <span>Event</span>
          <span>Status</span>
        </div>

        {/* Filas */}
        <div className="flex flex-col gap-2.5">
          {/* Fila 1 - Risk Assessment */}
          <div 
            className="flex items-center justify-between rounded-2xl border p-3 transition cursor-pointer"
            style={{ 
              backgroundColor: 'var(--seed-row-bg)', 
              borderColor: 'var(--seed-row-border)' 
            }}
          >
            <span className="text-[12.5px] font-medium tracking-wide" style={{ color: 'var(--seed-text-muted)' }}>
              Risk Assessment
            </span>
            {/* Custom Toggle Switch */}
            <div 
              onClick={(e) => { e.stopPropagation(); setRiskActive(!riskActive); }}
              className="w-8 h-4.5 rounded-full p-0.5 flex items-center transition-all duration-300 cursor-pointer"
              style={{ 
                backgroundColor: 'var(--seed-icon-bg)',
                justifyContent: riskActive ? 'flex-end' : 'flex-start' 
              }}
            >
              <div className={`w-3.5 h-3.5 rounded-full shadow-md transition-all duration-300 ${
                riskActive ? 'seed-green-dot' : 'bg-current opacity-30'
              }`}></div>
            </div>
          </div>

          {/* Fila 2 - Deliverable Due */}
          <div 
            className="flex flex-col rounded-2xl border p-3 transition cursor-pointer"
            style={{ 
              backgroundColor: 'var(--seed-row-bg)', 
              borderColor: 'var(--seed-row-border)' 
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[12.5px] font-medium tracking-wide" style={{ color: 'var(--seed-text-muted)' }}>
                Deliverable Due
              </span>
              {/* Custom Toggle Switch */}
              <div 
                onClick={(e) => { e.stopPropagation(); setDeliverableActive(!deliverableActive); }}
                className="w-8 h-4.5 rounded-full p-0.5 flex items-center transition-all duration-300 cursor-pointer"
                style={{ 
                  backgroundColor: 'var(--seed-icon-bg)',
                  justifyContent: deliverableActive ? 'flex-end' : 'flex-start' 
                }}
              >
                <div className={`w-3.5 h-3.5 rounded-full shadow-md transition-all duration-300 ${
                  deliverableActive ? 'seed-green-dot' : 'bg-current opacity-30'
                }`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controles y Timeline en la Base */}
      <div className="flex flex-col gap-3.5 mt-4">
        {/* Fila de Botones */}
        <div className="flex items-center justify-between px-1.5">
          {/* Botón Izquierdo (Double Pane) */}
          <button 
            className="w-8 h-8 rounded-full flex items-center justify-center transition shadow-inner"
            style={{ backgroundColor: 'var(--seed-icon-bg)', color: 'var(--seed-text-main)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
              <rect x="3" y="3" width="7" height="18" rx="1" />
              <rect x="14" y="3" width="7" height="18" rx="1" />
            </svg>
          </button>

          {/* Botón Central (More Fore - Verde adaptable) */}
          <button className="seed-primary-button px-5 py-1.5 rounded-full text-[11px] font-bold tracking-wide">
            More Fore
          </button>

          {/* Botón Derecho (Eye Slash) */}
          <button 
            className="w-8 h-8 rounded-full flex items-center justify-center transition shadow-inner"
            style={{ backgroundColor: 'var(--seed-icon-bg)', color: 'var(--seed-text-main)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
              <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
              <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
              <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
              <line x1="2" y1="2" x2="22" y2="22" />
            </svg>
          </button>
        </div>

        {/* Arco de Puntos de Navegación en la Base */}
        <div className="flex items-center justify-center gap-2.5 h-6 select-none pt-2" style={{ borderTop: '1px solid var(--seed-row-border)' }}>
          {/* Blanco (abajo) */}
          <div className="w-1.5 h-1.5 rounded-full bg-current opacity-25 translate-y-[3px]"></div>
          {/* Verde (en medio) */}
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--seed-green)] opacity-60 translate-y-[1px]"></div>
          {/* Verde (arriba) */}
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--seed-green)] translate-y-0"></div>
          {/* Verde (arriba) */}
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--seed-green)] translate-y-0"></div>
          {/* Rojo/Coral (en medio) */}
          <div className="w-1.5 h-1.5 rounded-full bg-[#EA4335] translate-y-[1px]"></div>
          {/* Blanco (abajo) */}
          <div className="w-1.5 h-1.5 rounded-full bg-current opacity-25 translate-y-[3px]"></div>
        </div>
      </div>
      
    </div>
  );
}
