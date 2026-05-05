import React from 'react';

export type ToothFace = 'top' | 'bottom' | 'left' | 'right' | 'center';

export interface ToothState {
  top?: string; // Color ADA, ej. '#EA4335' para rojo (Caries)
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

export const ToothBox: React.FC<ToothBoxProps> = ({ state, onClickFace, onClickExtracted }) => {
  const { top, bottom, left, right, center, isExtracted } = state;

  if (isExtracted) {
    return (
      <div 
        className="w-8 h-10 flex items-center justify-center cursor-pointer"
        onClick={onClickExtracted}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-30">
          <line x1="10" y1="10" x2="90" y2="90" stroke="#EF4444" strokeWidth="8" />
          <line x1="90" y1="10" x2="10" y2="90" stroke="#EF4444" strokeWidth="8" />
        </svg>
      </div>
    );
  }

  return (
    <div className="w-8 h-10 relative flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Top (Vestibular) */}
        <path
          d="M 10,10 L 90,10 L 75,25 L 25,25 Z"
          fill={top || '#ffffff'}
          stroke="#E5E7EB"
          strokeWidth="1"
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => onClickFace?.('top')}
        />
        {/* Bottom (Lingual/Palatino) */}
        <path
          d="M 10,90 L 90,90 L 75,75 L 25,75 Z"
          fill={bottom || '#ffffff'}
          stroke="#E5E7EB"
          strokeWidth="1"
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => onClickFace?.('bottom')}
        />
        {/* Left (Mesial/Distal) */}
        <path
          d="M 10,10 L 25,25 L 25,75 L 10,90 Z"
          fill={left || '#ffffff'}
          stroke="#E5E7EB"
          strokeWidth="1"
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => onClickFace?.('left')}
        />
        {/* Right (Distal/Mesial) */}
        <path
          d="M 90,10 L 75,25 L 75,75 L 90,90 Z"
          fill={right || '#ffffff'}
          stroke="#E5E7EB"
          strokeWidth="1"
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => onClickFace?.('right')}
        />
        {/* Center (Oclusal) */}
        <rect
          x="25"
          y="25"
          width="50"
          height="50"
          fill={center || '#ffffff'}
          stroke="#E5E7EB"
          strokeWidth="1"
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => onClickFace?.('center')}
        />
      </svg>
    </div>
  );
};