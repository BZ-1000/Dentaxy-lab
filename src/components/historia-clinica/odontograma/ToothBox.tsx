import React from 'react';

export type ToothFace = 'top' | 'bottom' | 'left' | 'right' | 'center';

export interface ToothState {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  center?: string;
  clinicalState?: string;
  mobility?: string;
  crownType?: string;
  pulpLabel?: string;
}

interface ToothBoxProps {
  id: number;
  state: ToothState;
  isUpper: boolean;
  viewMode?: 'images' | 'boxes';
  onClickFace?: (face: ToothFace) => void;
  onClickTooth?: () => void;
}

const IMAGE_SYMBOL_STATES = new Set(['A', 'X', 'CR', 'MC', 'P', 'I']);
const SQUARE_STATES       = new Set(['C', 'O', 'SE', 'RT', 'OF', 'S']);

const ROJO  = '#EF4444';
const AZUL  = '#3B82F6';
const WHITE = '#FFFFFF';

// ── Símbolo normativo ─────────────────────────────────────────────────────────
const ImageSymbol: React.FC<{
  cs: string; mobility?: string; crownType?: string; pulpLabel?: string;
}> = ({ cs, mobility, crownType, pulpLabel }) => {
  if (cs === 'X') return (
    <g stroke={ROJO} strokeWidth="8" strokeLinecap="round">
      <line x1="20" y1="20" x2="80" y2="80" />
      <line x1="80" y1="20" x2="20" y2="80" />
    </g>
  );
  if (cs === 'CR') return <circle cx="50" cy="50" r="35" fill="none" stroke={AZUL} strokeWidth="6" />;
  if (cs === 'MC') return <circle cx="50" cy="50" r="35" fill="none" stroke={ROJO} strokeWidth="6" />;
  if (cs === 'P') return (
    <g stroke={AZUL} strokeWidth="6" strokeLinecap="round">
      <line x1="20" y1="50" x2="80" y2="50" />
      <line x1="20" y1="30" x2="20" y2="70" />
      <line x1="80" y1="30" x2="80" y2="70" />
    </g>
  );
  if (cs === 'I') return <text x="50" y="65" fontSize="45" fontWeight="bold" fill={AZUL} textAnchor="middle">I</text>;
  if (mobility)  return <text x="50" y="65" fontSize="30" fontWeight="bold" fill={ROJO} textAnchor="middle">{mobility}</text>;
  if (crownType) return <text x="50" y="65" fontSize="30" fontWeight="bold" fill={AZUL} textAnchor="middle">{crownType}</text>;
  if (pulpLabel) return <text x="50" y="65" fontSize="30" fontWeight="bold" fill={AZUL} textAnchor="middle">{pulpLabel}</text>;
  return null;
};

// ── Cuadrito FDI con glassmorphism grisáceo ───────────────────────────────────
interface FaceSquareProps {
  id: number;
  faceColors: Record<ToothFace, string | undefined>;
  clinicalState: string;
  onClickFace: (face: ToothFace) => void;
}

const FaceSquare: React.FC<FaceSquareProps> = ({ id, faceColors, clinicalState, onClickFace }) => {
  const [hover, setHover] = React.useState<ToothFace | null>(null);
  const isOutline = clinicalState === 'RT' || clinicalState === 'OF';

  // Tono plateado-perla que coincide con el color natural de los dientes SVG
  const GLASS: Record<ToothFace, { base: string; lit: string }> = {
    top:    { base: 'rgba(168, 176, 190, 0.38)', lit: 'rgba(220, 228, 238, 0.80)' },
    bottom: { base: 'rgba(155, 163, 176, 0.32)', lit: 'rgba(210, 218, 230, 0.75)' },
    left:   { base: 'rgba(145, 153, 168, 0.28)', lit: 'rgba(205, 213, 225, 0.70)' },
    right:  { base: 'rgba(145, 153, 168, 0.28)', lit: 'rgba(205, 213, 225, 0.70)' },
    center: { base: 'rgba(178, 186, 200, 0.42)', lit: 'rgba(225, 232, 242, 0.82)' },
  };

  const DIVIDER    = 'rgba(130, 140, 158, 0.55)';
  const HOVER_EDGE = '#6B7A90';

  const getFill = (face: ToothFace): string => {
    const color    = faceColors[face];
    const hasColor = !!(color && color.toUpperCase() !== WHITE);
    if (hasColor) return isOutline ? `${ROJO}66` : color!;
    return hover === face ? GLASS[face].lit : GLASS[face].base;
  };

  const getEdge = (face: ToothFace): string => {
    if (hover === face) return HOVER_EDGE;
    const hasColor = !!(faceColors[face] && faceColors[face]?.toUpperCase() !== WHITE);
    if (isOutline && hasColor) return ROJO;
    return DIVIDER;
  };

  const getEdgeW = (face: ToothFace): number => hover === face ? 2.5 : 1.3;

  const Face = ({ face, d }: { face: ToothFace; d: string }) => (
    <path
      d={d}
      fill={getFill(face)}
      stroke={getEdge(face)}
      strokeWidth={getEdgeW(face)}
      strokeLinejoin="round"
      style={{ cursor: 'pointer', transition: 'fill 0.15s ease' }}
      onMouseEnter={() => setHover(face)}
      onMouseLeave={() => setHover(null)}
      onClick={(e) => { e.stopPropagation(); onClickFace(face); }}
    />
  );

  const FaceRect = ({ face }: { face: ToothFace }) => (
    <rect
      x="25" y="25" width="50" height="50"
      fill={getFill(face)}
      stroke={getEdge(face)}
      strokeWidth={getEdgeW(face)}
      style={{ cursor: 'pointer', transition: 'fill 0.15s ease' }}
      onMouseEnter={() => setHover(face)}
      onMouseLeave={() => setHover(null)}
      onClick={(e) => { e.stopPropagation(); onClickFace(face); }}
    />
  );

  return (
    <div 
      onMouseLeave={() => setHover(null)}
      style={{
        width: 42, height: 42, borderRadius: 8,
        // Degradado plateado-perla que imita el esmalte dental de los SVGs
        background: 'linear-gradient(145deg, rgba(200,208,220,0.60) 0%, rgba(168,178,195,0.40) 50%, rgba(185,194,210,0.50) 100%)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(160,170,186,0.55)',
        boxShadow: [
          '0 2px 8px rgba(100,110,130,0.10)',
          '0 1px 2px rgba(80,90,110,0.08)',
          'inset 0 1px 2px rgba(255,255,255,0.70)',
          'inset 0 -1px 2px rgba(100,110,130,0.12)',
        ].join(', '),
        overflow: 'hidden', flexShrink: 0,
      }}
    >
      <svg 
        viewBox="0 0 100 100" 
        style={{ width: '100%', height: '100%', display: 'block' }}
        onMouseLeave={() => setHover(null)}
      >
        <Face face="top"    d="M 10,10 L 90,10 L 75,25 L 25,25 Z" />
        <Face face="bottom" d="M 10,90 L 90,90 L 75,75 L 25,75 Z" />
        <Face face="left"   d="M 10,10 L 25,25 L 25,75 L 10,90 Z" />
        <Face face="right"  d="M 90,10 L 75,25 L 75,75 L 90,90 Z" />
        <FaceRect face="center" />
        
        {/* Número FDI como marca de agua interna */}
        <text 
          x="50" y="52"
          fontSize="15" 
          fontWeight="900" 
          fill="rgba(70, 80, 100, 0.55)" 
          textAnchor="middle" 
          dominantBaseline="middle"
          pointerEvents="none"
          style={{ userSelect: 'none', fontFamily: 'ui-sans-serif, system-ui, sans-serif', letterSpacing: '-1px' }}
        >
          {id}
        </text>
        <line x1="13" y1="11.5" x2="87" y2="11.5"
          stroke="rgba(255,255,255,0.75)" strokeWidth="1.8" strokeLinecap="round"
          pointerEvents="none"
        />
        <circle cx="12" cy="12" r="3" fill="rgba(255,255,255,0.35)" pointerEvents="none" />
      </svg>
    </div>
  );
};

// ── Componente principal ToothBox ─────────────────────────────────────────────
export const ToothBox: React.FC<ToothBoxProps> = ({
  id, state, isUpper, viewMode = 'images', onClickFace, onClickTooth,
}) => {
  const cs           = state.clinicalState ?? 'S';
  const isGlobalSymbol = IMAGE_SYMBOL_STATES.has(cs) || !!state.mobility || !!state.crownType || !!state.pulpLabel;
  const isSquareMode = SQUARE_STATES.has(cs);

  const faceColors: Record<ToothFace, string | undefined> = {
    top: state.top, bottom: state.bottom,
    left: state.left, right: state.right, center: state.center,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 10, fontWeight: 600,
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    color: '#6B7280', lineHeight: 1, userSelect: 'none',
    letterSpacing: '-0.3px',
    height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
  };

  const isUpperWisdom = id === 18 || id === 28;
  const isMolar = [6, 7, 8].includes(id % 10) && !isUpperWisdom;

  const imgWidth = isUpperWisdom ? 50 : isMolar ? 62 : 52;
  const imgMaxHeight = isUpperWisdom ? 95 : isMolar ? 115 : 100;
  const containerWidth = isUpperWisdom ? 39 : isMolar ? 49 : 41;

  // ── Lógica de estilos para la vista de imágenes (Mapeo de Caras) ───────
  
  // Palatino/Lingual (Sombra exterior por detrás del diente)
  const backColor = isUpper ? faceColors.bottom : faceColors.top;
  const isBackActive = backColor && backColor.toUpperCase() !== WHITE;

  // Vestibular (Centro de la corona)
  const centerColor = isUpper ? faceColors.top : faceColors.bottom;
  const isCenterActive = centerColor && centerColor.toUpperCase() !== WHITE;

  // Oclusal/Incisal (Borde)
  const oclusalColor = faceColors.center;
  const isOclusalActive = oclusalColor && oclusalColor.toUpperCase() !== WHITE;

  // Mesial/Distal (Bordes Laterales)
  const leftColor = faceColors.left;
  const isLeftActive = leftColor && leftColor.toUpperCase() !== WHITE;
  const rightColor = faceColors.right;
  const isRightActive = rightColor && rightColor.toUpperCase() !== WHITE;

  // Máscara de gradiente para limitar el color interno solo a la corona (oculta la raíz)
  const maskGradient = isUpper 
    ? 'linear-gradient(to bottom, transparent 35%, black 65%)' 
    : 'linear-gradient(to top, transparent 35%, black 65%)';

  // Imagen individual del diente por ID (Preparado para formato SVG)
  const toothImg = (
    <img
      src={`/teeth/${id}.svg`}
      alt={`Diente ${id}`}
      draggable={false}
      style={{
        width: imgWidth,
        height: 'auto',
        maxHeight: imgMaxHeight,
        objectFit: 'contain',
        objectPosition: isUpper ? 'bottom center' : 'top center',
        userSelect: 'none',
        pointerEvents: 'none',
        display: 'block',
        flexShrink: 0,
        filter: 'drop-shadow(0px 0px 8px rgba(255, 255, 255, 0.85)) drop-shadow(0px 0px 18px rgba(255, 255, 255, 0.45)) drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.4))', // Gradiente de luz blanca detrás de cada diente
        transition: 'all 0.15s ease-out',
        position: 'relative',
        zIndex: 5,
      }}
    />
  );

  // ── VISTA: solo imágenes anatomías (Simple, Vectorial) ────────────
  if (viewMode === 'images') {
    return (
      <div 
        // Efecto tipo Dock hiper-rápido: animaciones snappy
        className="relative flex flex-col items-center transition-all duration-100 ease-out hover:scale-[1.15] hover:-translate-y-2 hover:z-50"
        style={{ width: containerWidth, cursor: 'pointer' }}
        onClick={(e) => { e.stopPropagation(); onClickTooth?.(); }}
      >
        {/* Capa de Sombra Lingual/Palatina (Brillo vibrante SÓLO detrás de la corona) */}
        {isBackActive && (
          <div style={{
            position: 'absolute', inset: 0,
            pointerEvents: 'none',
            zIndex: 1,
            // Aplicamos el drop-shadow al contenedor para que la sombra desborde libremente
            filter: `drop-shadow(0px 0px 4px ${backColor}) drop-shadow(0px 0px 10px ${backColor})`,
          }}>
            {/* Aplicamos la máscara a la imagen para cortar la raíz, así la sombra solo nace de la corona */}
            <img
              src={`/teeth/${id}.svg`}
              alt=""
              style={{
                width: '100%', height: '100%',
                objectFit: 'contain',
                objectPosition: isUpper ? 'bottom center' : 'top center',
                WebkitMaskImage: maskGradient,
                maskImage: maskGradient,
              }}
            />
          </div>
        )}

        {toothImg}

        {/* Capas de gradientes superpuestos estrictamente en la corona del diente */}
        {(isCenterActive || isOclusalActive || isLeftActive || isRightActive) && (
          <div style={{
            position: 'absolute', inset: 0,
            WebkitMaskImage: maskGradient,
            maskImage: maskGradient,
            pointerEvents: 'none',
            zIndex: 10
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              WebkitMaskImage: `url(/teeth/${id}.svg)`,
              maskImage: `url(/teeth/${id}.svg)`,
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskPosition: isUpper ? 'bottom center' : 'top center',
              maskPosition: isUpper ? 'bottom center' : 'top center',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
            }}>
              {/* 1. Capa Oclusal/Incisal (Borde inferior/superior muy reducido) */}
              {isOclusalActive && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: isUpper 
                    ? `linear-gradient(to top, ${oclusalColor} 0%, transparent 20%)` 
                    : `linear-gradient(to bottom, ${oclusalColor} 0%, transparent 20%)`,
                  opacity: 0.75 // Colores vivos y claros, sin "multiply" para no oscurecer
                }} />
              )}
              {/* 2. Capa Izquierda (Mesial/Distal muy reducido) */}
              {isLeftActive && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `linear-gradient(to right, ${leftColor} 0%, transparent 25%)`,
                  opacity: 0.75
                }} />
              )}
              {/* 3. Capa Derecha (Mesial/Distal muy reducido) */}
              {isRightActive && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `linear-gradient(to left, ${rightColor} 0%, transparent 25%)`,
                  opacity: 0.75
                }} />
              )}
              {/* 4. Capa Vestibular (Centro / Barriga de la corona) */}
              {isCenterActive && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `radial-gradient(ellipse at 50% ${isUpper ? '85%' : '15%'}, ${centerColor} 0%, transparent 60%)`,
                  opacity: 0.75
                }} />
              )}
            </div>
          </div>
        )}

        {/* Símbolo clínico global superpuesto en la corona */}
        {isGlobalSymbol && (
          <div style={{
            position: 'absolute', 
            top: isUpper ? '70%' : '5%',
            left: '25%',
            width: '50%', 
            height: '25%',
            pointerEvents: 'none', 
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // Se elimina el drop-shadow para evitar que números y textos tengan "fondo" cuadrado
          }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <ImageSymbol cs={cs} mobility={state.mobility} crownType={state.crownType} pulpLabel={state.pulpLabel} />
            </svg>
          </div>
        )}
      </div>
    );
  }

  // ── VISTA: solo cuadros diagnósticos FDI (sin imágenes) ───────────
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: 46,
      gap: 1,
    }}>

      {/* Cuadro interactivo */}
      <div
        style={{ flexShrink: 0, position: 'relative' }}
        onClick={(e) => { e.stopPropagation(); if (!isSquareMode) onClickTooth?.(); }}
      >
        <FaceSquare
          id={id}
          faceColors={faceColors}
          clinicalState={cs}
          onClickFace={(face) => onClickFace?.(face)}
        />

        {/* Estado ausente */}
        {cs === 'A' && (
          <div style={{
            position: 'absolute', inset: 0,
            background: `${AZUL}1A`, borderRadius: 8, pointerEvents: 'none',
          }}/>
        )}

        {/* Símbolo clínico */}
        {isGlobalSymbol && (
          <svg viewBox="0 0 100 100" style={{
            position: 'absolute', inset: -4,
            width: 'calc(100% + 8px)', height: 'calc(100% + 8px)',
            pointerEvents: 'none',
          }}>
            <ImageSymbol cs={cs} mobility={state.mobility} crownType={state.crownType} pulpLabel={state.pulpLabel} />
          </svg>
        )}
      </div>

    </div>
  );
};
