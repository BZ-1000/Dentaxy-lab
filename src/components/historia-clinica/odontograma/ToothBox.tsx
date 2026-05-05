import React from 'react';

export type ToothFace = 'top' | 'bottom' | 'left' | 'right' | 'center';

export interface ToothState {
  top?: string;    // Color ADA, ej. '#EA4335' para Caries
  bottom?: string;
  left?: string;
  right?: string;
  center?: string;
  isExtracted?: boolean;
}

interface ToothBoxProps {
  id: number;
  state: ToothState;
  onClickFace?: (face: ToothFace) => void;
  onClickExtracted?: () => void;
}

// Determina si el número va arriba (maxilares: Q1, Q2, Q5, Q6)
// o abajo (mandibulares: Q3, Q4, Q7, Q8)
const isMaxilar = (id: number) => {
  const q = Math.floor(id / 10);
  return q === 1 || q === 2 || q === 5 || q === 6;
};

// Color de borde según si el diente tiene algo pintado o no
const STROKE_NORMAL   = '#9CA3AF'; // gray-400 — visible pero suave
const STROKE_ACTIVE   = '#6B7280'; // gray-500 — un poco más oscuro cuando hay color
const STROKE_W        = 1.5;

export const ToothBox: React.FC<ToothBoxProps> = ({ id, state, onClickFace, onClickExtracted }) => {
  const { top, bottom, left, right, center, isExtracted } = state;
  const white = '#ffffff';

  // ¿Alguna cara tiene color ADA (no es blanca)?
  const hasColor = [top, bottom, left, right, center].some(c => c && c !== white);
  const stroke = hasColor ? STROKE_ACTIVE : STROKE_NORMAL;

  const numberOnTop    = isMaxilar(id);
  const labelStyle: React.CSSProperties = {
    fontSize: 8,
    fontWeight: 700,
    fontFamily: 'ui-monospace, monospace',
    color: '#374151',      // gray-700 — bien visible
    lineHeight: 1,
    userSelect: 'none',
    letterSpacing: '-0.3px',
  };

  if (isExtracted) {
    return (
      <div
        style={{ width: 36, minWidth: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
        onClick={onClickExtracted}
      >
        {numberOnTop && <span style={labelStyle}>{id}</span>}
        <svg viewBox="0 0 100 100" style={{ width: 36, height: 44 }}>
          {/* Contorno del diente tachado */}
          <path d="M 10,10 L 90,10 L 75,25 L 25,25 Z" fill={white} stroke={stroke} strokeWidth={STROKE_W} />
          <path d="M 10,90 L 90,90 L 75,75 L 25,75 Z" fill={white} stroke={stroke} strokeWidth={STROKE_W} />
          <path d="M 10,10 L 25,25 L 25,75 L 10,90 Z" fill={white} stroke={stroke} strokeWidth={STROKE_W} />
          <path d="M 90,10 L 75,25 L 75,75 L 90,90 Z" fill={white} stroke={stroke} strokeWidth={STROKE_W} />
          <rect x="25" y="25" width="50" height="50" fill={white} stroke={stroke} strokeWidth={STROKE_W} />
          {/* X roja de ausente */}
          <line x1="15" y1="15" x2="85" y2="85" stroke="#EF4444" strokeWidth="7" strokeLinecap="round" />
          <line x1="85" y1="15" x2="15" y2="85" stroke="#EF4444" strokeWidth="7" strokeLinecap="round" />
        </svg>
        {!numberOnTop && <span style={labelStyle}>{id}</span>}
      </div>
    );
  }

  return (
    <div
      style={{ width: 36, minWidth: 36, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      {/* Número FDI — arriba para maxilares */}
      {numberOnTop && <span style={labelStyle}>{id}</span>}

      <svg viewBox="0 0 100 100" style={{ width: 36, height: 44 }}>
        {/* Top — Vestibular */}
        <path
          d="M 10,10 L 90,10 L 75,25 L 25,25 Z"
          fill={top || white}
          stroke={stroke}
          strokeWidth={STROKE_W}
          strokeLinejoin="round"
          style={{ cursor: 'pointer' }}
          onClick={() => onClickFace?.('top')}
        >
          <title>Vestibular</title>
        </path>

        {/* Bottom — Palatino/Lingual */}
        <path
          d="M 10,90 L 90,90 L 75,75 L 25,75 Z"
          fill={bottom || white}
          stroke={stroke}
          strokeWidth={STROKE_W}
          strokeLinejoin="round"
          style={{ cursor: 'pointer' }}
          onClick={() => onClickFace?.('bottom')}
        >
          <title>Lingual/Palatino</title>
        </path>

        {/* Left — según cuadrante puede ser Mesial o Distal */}
        <path
          d="M 10,10 L 25,25 L 25,75 L 10,90 Z"
          fill={left || white}
          stroke={stroke}
          strokeWidth={STROKE_W}
          strokeLinejoin="round"
          style={{ cursor: 'pointer' }}
          onClick={() => onClickFace?.('left')}
        >
          <title>Mesial/Distal</title>
        </path>

        {/* Right */}
        <path
          d="M 90,10 L 75,25 L 75,75 L 90,90 Z"
          fill={right || white}
          stroke={stroke}
          strokeWidth={STROKE_W}
          strokeLinejoin="round"
          style={{ cursor: 'pointer' }}
          onClick={() => onClickFace?.('right')}
        >
          <title>Distal/Mesial</title>
        </path>

        {/* Center — Oclusal/Incisal */}
        <rect
          x="25" y="25" width="50" height="50"
          fill={center || white}
          stroke={stroke}
          strokeWidth={STROKE_W}
          style={{ cursor: 'pointer' }}
          onClick={() => onClickFace?.('center')}
        >
          <title>Oclusal/Incisal</title>
        </rect>
      </svg>

      {/* Número FDI — abajo para mandibulares */}
      {!numberOnTop && <span style={labelStyle}>{id}</span>}
    </div>
  );
};