/**
 * ToothBox.tsx — v5 Hyper-Realista
 * Muestra la imagen real del diente (vista oclusal) como base.
 * Superpone colores de estado clínico con opacity controlada.
 * Símbolos normativos FDI/OPS en capa superior.
 */
import React from 'react';

export type ToothFace = 'top' | 'bottom' | 'left' | 'right' | 'center';

export interface ToothState {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  center?: string;
  isExtracted?: boolean;
  clinicalState?: string;
  mobility?: 1 | 2 | 3;
  pulpLabel?: string;
  crownType?: string;
  materialType?: string;
}

const AZUL  = '#1A73E8';
const ROJO  = '#EA4335';
const WHITE = '#ffffff';
const SURFACE_STATES = new Set(['C', 'O', 'SE', 'S']);
const OUTLINE_STATES = new Set(['RT']);

interface ToothBoxProps {
  id: number;
  state: ToothState;
  onClickFace?: (face: ToothFace) => void;
  onClickExtracted?: () => void;
}

// ── Utilidad: determina si el diente es maxilar ───────────────────────────────
const isMaxilar = (id: number) => {
  const q = Math.floor(id / 10);
  return q === 1 || q === 2 || q === 5 || q === 6;
};

// ── Color dominante del estado (para overlay) ─────────────────────────────────
const stateOverlayColor = (cs: string): string | null => {
  const map: Record<string, string> = {
    C: ROJO, EI: ROJO, F: ROJO, RR: ROJO, RT: ROJO,
    O: AZUL, A: AZUL, CR: AZUL, E: AZUL, PC: AZUL,
    PP: AZUL, IM: AZUL, SE: AZUL, PU: AZUL, MOV: '#FF6D00',
  };
  return map[cs] ?? null;
};

// ── Símbolo SVG normativo ─────────────────────────────────────────────────────
const NormSymbol: React.FC<{ cs: string; mobility?: number; crownType?: string }> = ({ cs, mobility, crownType }) => {
  switch (cs) {
    case 'A':   return <><line x1="10" y1="10" x2="90" y2="90" stroke={AZUL} strokeWidth="10" strokeLinecap="round"/><line x1="90" y1="10" x2="10" y2="90" stroke={AZUL} strokeWidth="10" strokeLinecap="round"/></>;
    case 'EI':  return <><line x1="10" y1="10" x2="90" y2="90" stroke={ROJO} strokeWidth="8" strokeLinecap="round" strokeDasharray="12 6"/><line x1="90" y1="10" x2="10" y2="90" stroke={ROJO} strokeWidth="8" strokeLinecap="round" strokeDasharray="12 6"/></>;
    case 'CR':  return <><ellipse cx="50" cy="50" rx="44" ry="44" fill="none" stroke={AZUL} strokeWidth="6"/>{crownType && <text x="50" y="57" textAnchor="middle" fill={AZUL} fontSize="20" fontWeight="bold" fontFamily="system-ui,sans-serif">{crownType}</text>}</>;
    case 'E': case 'PC': case 'PP': { const lbl = cs === 'E' ? 'TC' : cs; return <><line x1="50" y1="20" x2="50" y2="95" stroke={AZUL} strokeWidth="6" strokeLinecap="round"/><text x="50" y="17" textAnchor="middle" fill={AZUL} fontSize="18" fontWeight="bold" fontFamily="system-ui,sans-serif">{lbl}</text></>; }
    case 'IM':  return <text x="50" y="58" textAnchor="middle" fill={AZUL} fontSize="20" fontWeight="bold" fontFamily="system-ui,sans-serif">IMP</text>;
    case 'F':   return <line x1="20" y1="5" x2="80" y2="95" stroke={ROJO} strokeWidth="7" strokeLinecap="round"/>;
    case 'MOV': return <text x="50" y="60" textAnchor="middle" fill="#FF6D00" fontSize="24" fontWeight="bold" fontFamily="system-ui,sans-serif">M{typeof mobility === 'number' ? mobility : 1}</text>;
    case 'RR':  return <text x="50" y="60" textAnchor="middle" fill={ROJO} fontSize="26" fontWeight="bold" fontFamily="system-ui,sans-serif">RR</text>;
    case 'SI':  return <text x="50" y="60" textAnchor="middle" fill={AZUL} fontSize="26" fontWeight="bold" fontFamily="system-ui,sans-serif">SI</text>;
    case 'SN':  return <><circle cx="50" cy="50" r="42" fill="none" stroke={AZUL} strokeWidth="6"/><text x="50" y="60" textAnchor="middle" fill={AZUL} fontSize="30" fontWeight="bold" fontFamily="system-ui,sans-serif">S</text></>;
    case 'DES': return <text x="50" y="58" textAnchor="middle" fill={AZUL} fontSize="20" fontWeight="bold" fontFamily="system-ui,sans-serif">DES</text>;
    case 'DIS': return <text x="50" y="58" textAnchor="middle" fill={AZUL} fontSize="20" fontWeight="bold" fontFamily="system-ui,sans-serif">DIS</text>;
    case 'ECT': return <text x="50" y="62" textAnchor="middle" fill={AZUL} fontSize="32" fontWeight="bold" fontFamily="system-ui,sans-serif">E</text>;
    case 'CLV': return <polygon points="50,5 93,92 7,92" fill="none" stroke={AZUL} strokeWidth="6" strokeLinejoin="round"/>;
    case 'EXT': return <><line x1="50" y1="88" x2="50" y2="15" stroke={AZUL} strokeWidth="5" strokeLinecap="round"/><polyline points="32,34 50,10 68,34" fill="none" stroke={AZUL} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/></>;
    case 'INT': return <><line x1="50" y1="12" x2="50" y2="85" stroke={AZUL} strokeWidth="5" strokeLinecap="round"/><polyline points="32,66 50,90 68,66" fill="none" stroke={AZUL} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/></>;
    case 'GF':  return <><circle cx="32" cy="50" r="30" fill="none" stroke={AZUL} strokeWidth="5"/><circle cx="68" cy="50" r="30" fill="none" stroke={AZUL} strokeWidth="5"/></>;
    case 'GV':  return <><path d="M 20,50 Q 50,12 80,50" fill="none" stroke={AZUL} strokeWidth="5" strokeLinecap="round"/><polyline points="66,32 80,50 64,58" fill="none" stroke={AZUL} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/></>;
    case 'MIG': return <><line x1="10" y1="50" x2="82" y2="50" stroke={AZUL} strokeWidth="5" strokeLinecap="round"/><polyline points="66,32 86,50 66,68" fill="none" stroke={AZUL} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/></>;
    case 'PU':  return <><line x1="2" y1="80" x2="98" y2="80" stroke={AZUL} strokeWidth="6" strokeLinecap="round"/><line x1="50" y1="38" x2="50" y2="80" stroke={AZUL} strokeWidth="4"/></>;
    case 'TR':  return <><path d="M 12,26 Q 50,62 88,26" fill="none" stroke={AZUL} strokeWidth="5" strokeLinecap="round"/><path d="M 12,74 Q 50,38 88,74" fill="none" stroke={AZUL} strokeWidth="5" strokeLinecap="round"/></>;
    case 'AOF': return <><rect x="25" y="25" width="50" height="50" fill="none" stroke={AZUL} strokeWidth="5"/><line x1="25" y1="25" x2="75" y2="75" stroke={AZUL} strokeWidth="4"/><line x1="75" y1="25" x2="25" y2="75" stroke={AZUL} strokeWidth="4"/></>;
    case 'AOR': return <polyline points="5,72 20,44 35,72 50,44 65,72 80,44 95,72" fill="none" stroke={AZUL} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>;
    case 'DIA': return <><text x="28" y="62" textAnchor="middle" fill={AZUL} fontSize="32" fontWeight="bold" fontFamily="system-ui,sans-serif">)</text><text x="72" y="62" textAnchor="middle" fill={AZUL} fontSize="32" fontWeight="bold" fontFamily="system-ui,sans-serif">(</text></>;
    default:    return null;
  }
};

// ── Zonas interactivas sobre la imagen ───────────────────────────────────────
// Dividimos el área de la imagen en 5 regiones clickeables con overlay
const FaceOverlay: React.FC<{
  face: ToothFace;
  color: string | undefined;
  isSurface: boolean;
  isOutline: boolean;
  isHover: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onClick: () => void;
}> = ({ face, color, isSurface, isOutline, isHover, onEnter, onLeave, onClick }) => {
  const hasColor = color && color !== WHITE;

  // Posición de cada zona en % del contenedor
  const pos: Record<ToothFace, React.CSSProperties> = {
    top:    { top: '0%',    left: '5%',   width: '90%',  height: '25%' },
    bottom: { top: '75%',  left: '5%',   width: '90%',  height: '25%' },
    left:   { top: '25%',  left: '0%',   width: '28%',  height: '50%' },
    right:  { top: '25%',  left: '72%',  width: '28%',  height: '50%' },
    center: { top: '25%',  left: '28%',  width: '44%',  height: '50%' },
  };

  let bg = 'transparent';
  if (isHover && isSurface) bg = 'rgba(59,130,246,0.35)';
  else if (hasColor && isSurface) bg = color + 'AA';
  else if (hasColor && isOutline) bg = 'transparent';

  let border = 'none';
  if (isOutline && hasColor) border = `2px solid ${ROJO}`;
  else if (isHover && isSurface) border = '2px solid #3B82F6';

  return (
    <div
      style={{
        position: 'absolute',
        ...pos[face],
        background: bg,
        border,
        borderRadius: face === 'center' ? '4px' : '2px',
        cursor: isSurface ? 'pointer' : 'default',
        transition: 'background 0.12s',
        boxSizing: 'border-box',
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={e => { e.stopPropagation(); isSurface && onClick(); }}
    />
  );
};

// ── Componente principal ──────────────────────────────────────────────────────
export const ToothBox: React.FC<ToothBoxProps> = ({ id, state, onClickFace, onClickExtracted }) => {
  const { top, bottom, left, right, center, clinicalState, mobility, crownType, pulpLabel } = state;
  const [hover, setHover] = React.useState<ToothFace | null>(null);

  const cs = clinicalState ?? 'S';
  const isSurface = SURFACE_STATES.has(cs);
  const isOutline = OUTLINE_STATES.has(cs);
  const isSymbol  = !isSurface && !isOutline;

  const upper     = isMaxilar(id);
  const imgSrc    = `/teeth/oclusal/${id}.png`;
  const overlayColor = stateOverlayColor(cs);

  const labelStyle: React.CSSProperties = {
    fontSize: 8, fontWeight: 700, fontFamily: 'ui-sans-serif,system-ui,sans-serif',
    color: '#9CA3AF', lineHeight: 1, userSelect: 'none',
  };

  // Tamaño de render del diente — molares más anchos, incisivos estrechos
  const pos = id % 10;
  const toothW = pos >= 6 ? 44 : pos >= 4 ? 38 : pos === 3 ? 32 : pos <= 2 ? 28 : 30;
  const toothH = 48;

  const faces: ToothFace[] = ['top', 'bottom', 'left', 'right', 'center'];
  const faceColors: Record<ToothFace, string | undefined> = { top, bottom, left, right, center };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: toothW }}>
      {upper && <span style={labelStyle}>{id}</span>}

      {/* Contenedor del diente */}
      <div
        style={{ position: 'relative', width: toothW, height: toothH, cursor: 'pointer' }}
        onClick={() => { if (isSymbol) { onClickExtracted?.(); onClickFace?.('center'); } }}
      >
        {/* Imagen real del diente */}
        <img
          src={imgSrc}
          alt={`OD ${id}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
            display: 'block',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        />

        {/* Overlay global de estado (para estados no-superficie) */}
        {isSymbol && overlayColor && cs !== 'A' && cs !== 'EI' && (
          <div
            style={{
              position: 'absolute', inset: 0,
              background: overlayColor + '30',
              borderRadius: 4,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Overlays interactivos por zona (modo superficie) */}
        {(isSurface || isOutline) && faces.map(face => (
          <FaceOverlay
            key={face}
            face={face}
            color={faceColors[face]}
            isSurface={isSurface}
            isOutline={isOutline}
            isHover={hover === face}
            onEnter={() => isSurface && setHover(face)}
            onLeave={() => setHover(null)}
            onClick={() => onClickFace?.(face)}
          />
        ))}

        {/* Símbolo SVG normativo */}
        {(isSymbol || isOutline) && (
          <svg
            viewBox="0 0 100 100"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              pointerEvents: 'none',
            }}
          >
            <NormSymbol cs={cs} mobility={mobility} crownType={crownType} />
          </svg>
        )}
      </div>

      {!upper && <span style={labelStyle}>{id}</span>}
    </div>
  );
};

export default ToothBox;