/**
 * ToothSVG.tsx — Diente individual SVG interactivo
 * Renderiza la silueta anatómica con sus estados visuales ADA
 */
import React, { useState } from 'react';
import { ToothData, ToothState, TOOTH_COLORS } from '@/types/odontograma';
import { getToothPath, getToothName } from './toothPaths';

interface ToothSVGProps {
  tooth: ToothData;
  isUpper: boolean;
  onClick: (id: number) => void;
  isSelected: boolean;
  readOnly?: boolean;
}

// ─────────────────────────────────────────────────────────────
// Renderiza el overlay visual según el estado del diente
// ─────────────────────────────────────────────────────────────
const renderStateOverlay = (tooth: ToothData, crown: string) => {
  const color = TOOTH_COLORS[tooth.state];

  switch (tooth.state) {
    case 'S':
      return null; // Sano — sin overlay

    case 'C':
    case 'O':
    case 'SE': {
      // Colorear superficies específicas
      const paths = getToothPath(tooth.id);
      const surfaceKeys = Object.keys(tooth.surfaces) as (keyof typeof tooth.surfaces)[];
      if (surfaceKeys.length === 0) {
        // Sin superficie específica → colorear centro
        const centerPath = paths.surfaces.O ?? paths.surfaces.I;
        if (!centerPath) return null;
        return <path d={centerPath} fill={color} opacity={0.85} />;
      }
      return (
        <>
          {surfaceKeys.map(key => {
            const surfPath = paths.surfaces[key as keyof typeof paths.surfaces];
            if (!surfPath) return null;
            return <path key={key} d={surfPath} fill={color} opacity={0.85} />;
          })}
        </>
      );
    }

    case 'A':
      // Ausente: X roja sobre diente vacío (la corona ya tiene fill gris en el padre)
      return (
        <>
          <line x1="12" y1="14" x2="28" y2="38" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
          <line x1="28" y1="14" x2="12" y2="38" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
        </>
      );

    case 'EI':
      // Extracción indicada: X morada sobre diente normal
      return (
        <>
          <line x1="13" y1="14" x2="27" y2="36" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
          <line x1="27" y1="14" x2="13" y2="36" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
        </>
      );

    case 'CR':
      // Corona: doble contorno naranja
      return (
        <>
          <path d={crown} fill="none" stroke={color} strokeWidth={3} />
          <path d={crown} fill="none" stroke={color} strokeWidth={1} transform="scale(0.9) translate(2, 2.4)" />
        </>
      );

    case 'E':
      // Endodoncia: línea roja vertical central
      return (
        <line x1="20" y1="6" x2="20" y2="44" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      );

    case 'F':
      // Fractura: línea diagonal roja
      return (
        <line x1="10" y1="10" x2="30" y2="42" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      );

    case 'PU':
      // Puente: barra naranja horizontal (el puente real se dibuja en el padre)
      return (
        <rect x="4" y="20" width="32" height="8" fill={color} opacity={0.7} rx={2} />
      );

    case 'IM':
      // Implante: ícono de tornillo (líneas paralelas grises)
      return (
        <>
          <line x1="20" y1="6" x2="20" y2="42" stroke={color} strokeWidth={3} strokeLinecap="round" />
          {[12, 17, 22, 27, 32].map(y => (
            <line key={y} x1="14" y1={y} x2="26" y2={y} stroke={color} strokeWidth={1.5} strokeLinecap="round" opacity={0.6} />
          ))}
        </>
      );

    case 'MOV':
      // Movilidad: número de grado encima del diente (se maneja como texto en el padre)
      return null;

    default:
      return null;
  }
};

// ─────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────
export const ToothSVG: React.FC<ToothSVGProps> = ({
  tooth,
  isUpper,
  onClick,
  isSelected,
  readOnly = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const pathData = getToothPath(tooth.id);
  const toothName = getToothName(tooth.id);

  const isAbsent = tooth.state === 'A';
  const crownFill = isAbsent ? '#F7F8FA' : '#FFFFFF';
  const crownStroke = isAbsent ? '#E8EBF0' : '#D1D5DB';
  const crownStrokeDasharray = isAbsent ? '4 3' : undefined;

  return (
    <div className="relative flex flex-col items-center" style={{ width: pathData.width }}>
      {/* Número FDI — Arcada superior: debajo del diente. Inferior: encima */}
      {!isUpper && (
        <span className="text-[8px] font-semibold text-gray-400 mb-0.5 leading-none select-none">
          {tooth.id}
        </span>
      )}

      {/* Grado de movilidad — encima del diente si aplica */}
      {tooth.state === 'MOV' && tooth.mobility && (
        <span
          className="absolute -top-3 text-[8px] font-bold select-none z-10"
          style={{ color: TOOTH_COLORS['MOV'] }}
        >
          {['I', 'II', 'III'][tooth.mobility - 1]}
        </span>
      )}

      {/* SVG del diente */}
      <div className="relative">
        {showTooltip && (
          <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-gray-900 text-white text-[10px] px-2 py-1 rounded-md shadow-lg pointer-events-none">
            <div className="font-semibold">{tooth.id}</div>
            <div className="text-gray-300 text-[9px]">{toothName}</div>
          </div>
        )}

        <svg
          viewBox="0 0 40 48"
          width={pathData.width}
          height={Math.round(pathData.width * 1.2)}
          className={`cursor-pointer transition-transform duration-150 ${
            !readOnly ? 'hover:scale-110' : ''
          } ${isSelected ? 'scale-110' : ''}`}
          onClick={() => !readOnly && onClick(tooth.id)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          style={{ filter: isSelected ? 'drop-shadow(0 0 4px rgba(99,102,241,0.6))' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.08))' }}
        >
          {/* Corona base */}
          <path
            d={pathData.crown}
            fill={crownFill}
            stroke={crownStroke}
            strokeWidth={1.5}
            strokeDasharray={crownStrokeDasharray}
          />

          {/* Overlay del estado clínico */}
          {renderStateOverlay(tooth, pathData.crown)}

          {/* Anillo de selección */}
          {isSelected && (
            <path
              d={pathData.crown}
              fill="none"
              stroke="#6366F1"
              strokeWidth={2}
              opacity={0.8}
            />
          )}
        </svg>
      </div>

      {/* Número FDI — Arcada superior: encima del diente */}
      {isUpper && (
        <span className="text-[8px] font-semibold text-gray-400 mt-0.5 leading-none select-none">
          {tooth.id}
        </span>
      )}
    </div>
  );
};

export default ToothSVG;
