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
  state?: ToothState;
  onClickFace?: (toothId: number, face: ToothFace) => void;
  onClickExtracted?: (toothId: number) => void;
}

export const ToothBox: React.FC<ToothBoxProps> = ({ id, state = {}, onClickFace, onClickExtracted }) => {
  const { top, bottom, left, right, center, isExtracted } = state;

  const handleFaceClick = (e: React.MouseEvent, face: ToothFace) => {
    e.stopPropagation();
    if (onClickFace) onClickFace(id, face);
  };

  const handleToothClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClickExtracted) onClickExtracted(id);
  };

  // SVG dimensions
  const size = 32; // Overall size of the box

  return (
    <div 
      className="flex flex-col items-center gap-1.5 cursor-pointer group"
      onClick={handleToothClick}
    >
      {/* FDI Number */}
      <span className="text-[11px] font-bold text-gray-500 group-hover:text-gray-800 transition-colors">
        {id}
      </span>

      {/* SVG Box */}
      <svg width={size} height={size} viewBox="0 0 40 40" className="overflow-visible">
        <defs>
          <style>
            {`
              .face { transition: all 0.2s ease; stroke: #cbd5e1; stroke-width: 1.5; stroke-linejoin: round; }
              .face:hover { opacity: 0.8; stroke: #3b82f6; stroke-width: 2; z-index: 10; }
              .cross-line { stroke: #ef4444; stroke-width: 3; stroke-linecap: round; }
            `}
          </style>
        </defs>

        {/* TOP */}
        <polygon 
          points="0,0 40,0 30,10 10,10" 
          fill={top || '#ffffff'} 
          className="face"
          onClick={(e) => handleFaceClick(e, 'top')}
        />
        
        {/* BOTTOM */}
        <polygon 
          points="0,40 40,40 30,30 10,30" 
          fill={bottom || '#ffffff'} 
          className="face"
          onClick={(e) => handleFaceClick(e, 'bottom')}
        />
        
        {/* LEFT */}
        <polygon 
          points="0,0 10,10 10,30 0,40" 
          fill={left || '#ffffff'} 
          className="face"
          onClick={(e) => handleFaceClick(e, 'left')}
        />
        
        {/* RIGHT */}
        <polygon 
          points="40,0 30,10 30,30 40,40" 
          fill={right || '#ffffff'} 
          className="face"
          onClick={(e) => handleFaceClick(e, 'right')}
        />
        
        {/* CENTER */}
        <polygon 
          points="10,10 30,10 30,30 10,30" 
          fill={center || '#ffffff'} 
          className="face"
          onClick={(e) => handleFaceClick(e, 'center')}
        />

        {/* EXTRACTION X */}
        {isExtracted && (
          <g className="pointer-events-none">
            <line x1="-4" y1="-4" x2="44" y2="44" className="cross-line" />
            <line x1="44" y1="-4" x2="-4" y2="44" className="cross-line" />
          </g>
        )}
      </svg>
    </div>
  );
};
