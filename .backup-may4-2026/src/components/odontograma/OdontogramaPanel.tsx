/**
 * OdontogramaPanel.tsx — Mini-panel flotante estilo Apple
 * Selector de estado clínico + superficies + grado de movilidad
 * Diseño Total White, chips con colores ADA, microanimaciones
 */
import React, { useEffect, useRef } from 'react';
import { ToothData, ToothState, TOOTH_COLORS, TOOTH_STATE_LABELS, stateRequiresSurface } from '@/types/odontograma';
import { X, Check } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Iconos SVG inline por estado (minimalistas)
// ─────────────────────────────────────────────────────────────────────────────
const STATE_ICONS: Partial<Record<ToothState, React.ReactNode>> = {
  C:   <span style={{width:8,height:8,borderRadius:'50%',background:'#EA4335',display:'inline-block',flexShrink:0}} />,
  O:   <span style={{width:8,height:8,borderRadius:'50%',background:'#1A73E8',display:'inline-block',flexShrink:0}} />,
  A:   <span style={{fontSize:9,fontWeight:800,color:'#EA4335',lineHeight:1}}>✕</span>,
  EI:  <span style={{fontSize:9,fontWeight:800,color:'#7B4FA8',lineHeight:1}}>✕</span>,
  CR:  <span style={{width:8,height:8,borderRadius:2,border:'2px solid #FF6D00',display:'inline-block',flexShrink:0}} />,
  PU:  <span style={{width:12,height:4,borderRadius:2,background:'#FF6D00',display:'inline-block',flexShrink:0}} />,
  E:   <span style={{width:2,height:10,borderRadius:1,background:'#EA4335',display:'inline-block',flexShrink:0}} />,
  IM:  <span style={{fontSize:8,color:'#607D8B',lineHeight:1}}>⬡</span>,
  SE:  <span style={{width:8,height:8,borderRadius:'50%',background:'#F9AB00',display:'inline-block',flexShrink:0}} />,
  F:   <span style={{display:'inline-block',width:10,height:10,flexShrink:0,position:'relative'}}>
         <span style={{position:'absolute',top:0,left:7,width:2,height:12,background:'#EA4335',transform:'rotate(-35deg)',transformOrigin:'top',borderRadius:1}} />
       </span>,
  MOV: <span style={{fontSize:9,fontWeight:800,color:'#FF6D00',lineHeight:1}}>≋</span>,
  S:   <span style={{width:8,height:8,borderRadius:'50%',border:'1.5px solid #1D9E75',display:'inline-block',flexShrink:0}} />,
};

// ─────────────────────────────────────────────────────────────────────────────
// Todos los estados en orden lógico clínico
// ─────────────────────────────────────────────────────────────────────────────
const ALL_STATES: ToothState[] = ['S', 'C', 'O', 'A', 'EI', 'E', 'CR', 'PU', 'IM', 'SE', 'F', 'MOV'];

// Qué estados requieren selección de superficie
const SURFACE_STATES: ToothState[] = ['C', 'O', 'SE'];

// Las 5 superficies en orden para el selector
interface SurfaceConfig {
  key: string;
  label: string;
  pos: 'top' | 'left' | 'center' | 'right' | 'bottom';
}
const SURFACES: SurfaceConfig[] = [
  { key: 'V', label: 'V', pos: 'top' },
  { key: 'M', label: 'M', pos: 'left' },
  { key: 'O', label: 'O', pos: 'center' }, // O o I según grupo dental
  { key: 'D', label: 'D', pos: 'right' },
  { key: 'L', label: 'L', pos: 'bottom' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────
interface OdontogramaPanelProps {
  toothId: number;
  toothName: string;
  currentData: ToothData;
  isUpper: boolean;           // para saber si usar "O" o "I" en el centro
  onApply: (data: ToothData) => void;
  onClose: () => void;
  position: { x: number; y: number };
}

// ─────────────────────────────────────────────────────────────────────────────
// Componente selector de superficie — mini esquema del diente
// ─────────────────────────────────────────────────────────────────────────────
const SurfaceSelector: React.FC<{
  selectedSurfaces: Record<string, boolean>;
  onToggle: (key: string) => void;
  stateColor: string;
  isAnterior: boolean;
}> = ({ selectedSurfaces, onToggle, stateColor, isAnterior }) => {
  const centerKey = isAnterior ? 'I' : 'O';
  const centerLabel = isAnterior ? 'I' : 'O';

  const getSurfBg = (key: string) => selectedSurfaces[key] ? stateColor : '#F3F4F6';
  const getSurfColor = (key: string) => selectedSurfaces[key] ? '#fff' : '#9CA3AF';
  const surfStyle = (key: string): React.CSSProperties => ({
    background: getSurfBg(key),
    color: getSurfColor(key),
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 9, fontWeight: 700, cursor: 'pointer',
    transition: 'all 0.12s ease',
    borderRadius: 3,
    userSelect: 'none',
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '28px 28px 28px', gridTemplateRows: '24px 24px 24px', gap: 2, width: 86 }}>
      {/* Fila 1: V centrado */}
      <div style={{ gridColumn: '2', ...surfStyle('V') }} onClick={() => onToggle('V')}>V</div>
      {/* Fila 2: M | O/I | D */}
      <div style={{ gridColumn: '1', gridRow: '2', ...surfStyle('M') }} onClick={() => onToggle('M')}>M</div>
      <div style={{ gridColumn: '2', gridRow: '2', ...surfStyle(centerKey) }} onClick={() => onToggle(centerKey)}>{centerLabel}</div>
      <div style={{ gridColumn: '3', gridRow: '2', ...surfStyle('D') }} onClick={() => onToggle('D')}>D</div>
      {/* Fila 3: L centrado */}
      <div style={{ gridColumn: '2', gridRow: '3', ...surfStyle('L') }} onClick={() => onToggle('L')}>L</div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────────────────────
export const OdontogramaPanel: React.FC<OdontogramaPanelProps> = ({
  toothId,
  toothName,
  currentData,
  isUpper,
  onApply,
  onClose,
  position,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Estado local del panel
  const [selectedState, setSelectedState] = React.useState<ToothState>(currentData.state);
  const [selectedSurfaces, setSelectedSurfaces] = React.useState<Record<string, boolean>>(
    Object.fromEntries(Object.keys(currentData.surfaces).filter(k => currentData.surfaces[k as keyof typeof currentData.surfaces]).map(k => [k, true]))
  );
  const [selectedMobility, setSelectedMobility] = React.useState<1 | 2 | 3>(currentData.mobility ?? 1);

  // Determinar si el diente es anterior (incisivos + caninos)
  const pos = toothId % 10;
  const isAnterior = pos <= 3; // 1=IC, 2=IL, 3=Canino

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    setTimeout(() => document.addEventListener('mousedown', handleClickOutside), 100);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Ajustar posición para que no se salga de pantalla
  const panelWidth = 260;
  const adjustedX = Math.min(position.x, window.innerWidth - panelWidth - 16);
  const adjustedY = Math.max(8, position.y - 20);

  const toggleSurface = (key: string) => {
    setSelectedSurfaces(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleApply = () => {
    const surfaces: ToothData['surfaces'] = {};
    if (SURFACE_STATES.includes(selectedState)) {
      Object.entries(selectedSurfaces).forEach(([k, v]) => {
        if (v) surfaces[k as keyof typeof surfaces] = selectedState;
      });
    }
    onApply({
      id: toothId,
      state: selectedState,
      surfaces,
      mobility: selectedState === 'MOV' ? selectedMobility : undefined,
    });
  };

  const handleClear = () => {
    onApply({ id: toothId, state: 'S', surfaces: {} });
  };

  const stateColor = TOOTH_COLORS[selectedState] ?? '#18181B';
  const needsSurface = SURFACE_STATES.includes(selectedState);

  return (
    <div
      ref={panelRef}
      style={{
        position: 'fixed',
        left: adjustedX,
        top: adjustedY,
        width: panelWidth,
        zIndex: 99999,
        background: '#ffffff',
        borderRadius: 16,
        boxShadow: '0 8px 40px rgba(0,0,0,0.14), 0 1px 4px rgba(0,0,0,0.06)',
        border: '1px solid #F0F0F0',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        animation: 'panelSlideIn 0.15s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      <style>{`
        @keyframes panelSlideIn {
          from { opacity: 0; transform: scale(0.92) translateY(-4px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div style={{ padding: '12px 14px 8px', borderBottom: '1px solid #F5F5F5', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#18181B', lineHeight: 1.2 }}>OD {toothId}</div>
          <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2, lineHeight: 1.3, maxWidth: 190 }}>{toothName}</div>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: '#D1D5DB', marginLeft: 8, flexShrink: 0 }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Estados — grid de chips */}
      <div style={{ padding: '10px 12px 8px' }}>
        <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#C4C4C4', marginBottom: 8 }}>
          Estado clínico
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {ALL_STATES.map(state => {
            const isActive = selectedState === state;
            const color = TOOTH_COLORS[state];
            return (
              <button
                key={state}
                onClick={() => {
                  setSelectedState(state);
                  if (!SURFACE_STATES.includes(state)) setSelectedSurfaces({});
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '4px 9px',
                  borderRadius: 20,
                  border: isActive ? `1.5px solid ${color}` : '1.5px solid #EBEBEB',
                  background: isActive ? `${color}14` : '#FAFAFA',
                  cursor: 'pointer',
                  transition: 'all 0.12s ease',
                  fontSize: 11, fontWeight: isActive ? 700 : 500,
                  color: isActive ? color : '#6B7280',
                  outline: 'none',
                }}
              >
                {STATE_ICONS[state] ?? <span style={{width:6,height:6,borderRadius:'50%',background:color,display:'inline-block'}} />}
                {TOOTH_STATE_LABELS[state]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selector de superficies (solo si aplica) */}
      {needsSurface && (
        <div style={{ padding: '6px 12px 8px', borderTop: '1px solid #F5F5F5' }}>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#C4C4C4', marginBottom: 8 }}>
            Superficies afectadas
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <SurfaceSelector
              selectedSurfaces={selectedSurfaces}
              onToggle={toggleSurface}
              stateColor={stateColor}
              isAnterior={isAnterior}
            />
            <div style={{ fontSize: 10, color: '#9CA3AF', lineHeight: 1.6 }}>
              <div><strong style={{color:'#374151'}}>V</strong> — Vestibular</div>
              <div><strong style={{color:'#374151'}}>L</strong> — Lingual</div>
              <div><strong style={{color:'#374151'}}>M</strong> — Mesial</div>
              <div><strong style={{color:'#374151'}}>D</strong> — Distal</div>
              <div><strong style={{color:'#374151'}}>{isAnterior ? 'I' : 'O'}</strong> — {isAnterior ? 'Incisal' : 'Oclusal'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Selector de movilidad (solo MOV) */}
      {selectedState === 'MOV' && (
        <div style={{ padding: '6px 12px 8px', borderTop: '1px solid #F5F5F5' }}>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#C4C4C4', marginBottom: 8 }}>
            Grado de movilidad
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {([1, 2, 3] as const).map(g => (
              <button
                key={g}
                onClick={() => setSelectedMobility(g)}
                style={{
                  width: 40, height: 32, borderRadius: 8,
                  border: selectedMobility === g ? `2px solid #FF6D00` : '1.5px solid #EBEBEB',
                  background: selectedMobility === g ? '#FFF3E0' : '#FAFAFA',
                  color: selectedMobility === g ? '#FF6D00' : '#9CA3AF',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  transition: 'all 0.12s',
                }}
              >
                {['I', 'II', 'III'][g - 1]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer — Botones */}
      <div style={{ padding: '8px 12px 12px', borderTop: '1px solid #F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={handleClear}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 11, color: '#D1D5DB', fontWeight: 500,
            padding: '4px 6px', borderRadius: 6,
            transition: 'all 0.12s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
          onMouseLeave={e => (e.currentTarget.style.color = '#D1D5DB')}
        >
          Limpiar
        </button>
        <button
          onClick={handleApply}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: '#18181B', color: '#fff',
            border: 'none', borderRadius: 10,
            padding: '7px 16px', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.12s',
            letterSpacing: '0.2px',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#374151')}
          onMouseLeave={e => (e.currentTarget.style.background = '#18181B')}
        >
          <Check size={12} strokeWidth={2.5} />
          Aplicar
        </button>
      </div>
    </div>
  );
};

export default OdontogramaPanel;
