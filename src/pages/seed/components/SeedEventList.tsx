import React, { useState } from 'react';

export default function SeedEventList({ forceWhiteBg = false }: { forceWhiteBg?: boolean }) {
  const [riskActive, setRiskActive] = useState(true);
  const [deliverableActive, setDeliverableActive] = useState(true);

  const wb = forceWhiteBg;
  const cardBg  = wb ? 'rgba(255, 255, 255, 0.92)' : 'var(--seed-card-bg)';
  const cardBorder = wb ? '1px solid rgba(226, 232, 240, 0.9)' : '1px solid var(--seed-card-border)';
  const cardShadow = wb ? '0 8px 32px rgba(0, 0, 0, 0.08)' : 'var(--seed-card-shadow), inset 0 1px 0 var(--seed-card-border)';
  const textMain   = wb ? '#0f172a'     : 'var(--seed-text-main)';
  const textMuted  = wb ? '#334155'     : 'var(--seed-text-muted)';
  const textLight  = wb ? '#64748b'     : 'var(--seed-text-light)';
  const rowBg      = wb ? 'rgba(248, 250, 252, 0.85)' : 'var(--seed-row-bg)';
  const rowBorder  = wb ? '#e2e8f0'     : 'var(--seed-row-border)';
  const iconBg     = wb ? '#f1f5f9'     : 'var(--seed-icon-bg)';
  const divider    = wb ? '#e2e8f0'     : 'var(--seed-row-border)';

  return (
    <div 
      className="w-full h-full px-6 pt-6 pb-12 flex flex-col justify-between overflow-hidden transition-all duration-300"
      style={{
        borderRadius: '30px 30px 0 0',
        background: cardBg,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: cardBorder,
        boxShadow: cardShadow,
      }}
    >
      <div>
        {/* Cabecera */}
        <div className="mb-6 pl-1">
          <h2 className="text-[16px] font-semibold tracking-wide" style={{ color: textMain }}>Risk Assessment</h2>
        </div>

        {/* Encabezados de Tabla */}
        <div className="flex justify-between text-[10.5px] font-semibold mb-3 pl-1 pr-2 tracking-wider uppercase" style={{ color: textLight }}>
          <span>Event</span>
          <span>Status</span>
        </div>

        {/* Filas */}
        <div className="flex flex-col gap-2.5">
          {/* Fila 1 - Risk Assessment */}
          <div 
            className="flex items-center justify-between rounded-2xl border p-3 transition cursor-pointer"
            style={{ 
              backgroundColor: rowBg, 
              borderColor: rowBorder 
            }}
          >
            <span className="text-[12.5px] font-medium tracking-wide" style={{ color: textMuted }}>
              Risk Assessment
            </span>
            {/* Custom Toggle Switch */}
            <div 
              onClick={(e) => { e.stopPropagation(); setRiskActive(!riskActive); }}
              className="w-8 h-4.5 rounded-full p-0.5 flex items-center transition-all duration-300 cursor-pointer"
              style={{ 
                backgroundColor: iconBg,
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
              backgroundColor: rowBg, 
              borderColor: rowBorder 
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[12.5px] font-medium tracking-wide" style={{ color: textMuted }}>
                Deliverable Due
              </span>
              {/* Custom Toggle Switch */}
              <div 
                onClick={(e) => { e.stopPropagation(); setDeliverableActive(!deliverableActive); }}
                className="w-8 h-4.5 rounded-full p-0.5 flex items-center transition-all duration-300 cursor-pointer"
                style={{ 
                  backgroundColor: iconBg,
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
            style={{ backgroundColor: iconBg, color: textMain }}
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
            style={{ backgroundColor: iconBg, color: textMain }}
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
        <div className="flex items-center justify-center gap-2.5 h-6 select-none pt-2" style={{ borderTop: `1px solid ${divider}` }}>
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
