/**
 * Odontograma.tsx — Odontograma DentaXy completo
 * · Diseño original ToothBox (5 caras SVG) restaurado
 * · 12 estados ADA con colores normativos por cara
 * · Grado de caries I-IV para diagnóstico preciso
 * · Dentición Permanente / Pediátrica / Mixta (FDI)
 * · Dictado por voz con 12 comandos + superficies
 * · Sin botón de redacción — se dispara automáticamente
 */
import React, { useState, useCallback, useEffect } from 'react';
import { FormDataState } from '../../types/historiaClinica';
import { ToothBox, ToothFace, ToothState as BoxState } from './odontograma/ToothBox';
// isUpper se pasa al ToothBox para determinar si imagen va arriba (superior) o abajo (inferior)
import { ToothPanel } from '../odontograma/ToothPanel';
import { VoiceSelectorModal } from '../odontograma/VoiceSelectorModal';
import { useVoiceSelector } from '@/hooks/useVoiceSelector';
import {
  ToothData, ToothState, TOOTH_COLORS,
  PERMANENT_TEETH_IDS, DECIDUOUS_TEETH_IDS,
} from '@/types/odontograma';
import { useOdontogramaVoice, ParsedVoiceCommand } from '@/hooks/useOdontogramaVoice';
import { generateOdontogramHTML } from '@/lib/engine/generateOdontogramRedaction';
import { Mic, MicOff, RotateCcw } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────
interface OdontogramaProps {
  formData?: FormDataState;
  handleOdontogramaChange: (state: Record<number, ToothData>) => void;
  onRedaccionGenerada?: (text: string) => void;
  onToggleViewMode?: () => void;
  initialTeethState?: Record<number, any>;
  minimalMode?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Tipos internos
// ─────────────────────────────────────────────────────────────────────────────
type DentitionMode = 'permanent' | 'pediatric' | 'mixed';

interface ExtState extends BoxState {
  clinicalState: ToothState;
  mobility?: 1 | 2 | 3;
  cariesGrade?: 1 | 2 | 3 | 4;
  crownType?: string;    // tipo de corona p.ej. CC, CF, CMC…
  pulpLabel?: string;    // etiqueta pulpar TC, PC, PP
  materialType?: string; // material restaurador AM, R, IV…
}

const ADA = TOOTH_COLORS;

// ─────────────────────────────────────────────────────────────────────────────
// Colores por grado de caries — solo variaciones del ROJO normativo (EA4335)
// La norma 1.3 dice: "pintada con color rojo"
// ─────────────────────────────────────────────────────────────────────────────
const CARIES_GRADE_COLORS: Record<1|2|3|4, string> = {
  1: '#EF9A9A', // Esmalte — rojo pálido (lesión incipiente)
  2: '#EF5350', // Dentina superficial — rojo medio
  3: '#EA4335', // Dentina profunda — rojo normativo estándar
  4: '#B71C1C', // Compromiso pulpar — rojo oscuro
};

// Estados que usan colores de superficie (caras pintadas)
const SURFACE_STATES = new Set(['C', 'O', 'OF', 'SE', 'S']);
const OUTLINE_STATES = new Set(['RT']); // Contorno rojo sin relleno

// ─────────────────────────────────────────────────────────────────────────────
// Layout de arcos (orden visual, norma FDI)
// ─────────────────────────────────────────────────────────────────────────────

// PERMANENTE
const PERM_Q1 = [18, 17, 16, 15, 14, 13, 12, 11]; // sup-der paciente (aparece a izq de pantalla)
const PERM_Q2 = [21, 22, 23, 24, 25, 26, 27, 28]; // sup-izq paciente
const PERM_Q4 = [48, 47, 46, 45, 44, 43, 42, 41]; // inf-der paciente
const PERM_Q3 = [31, 32, 33, 34, 35, 36, 37, 38]; // inf-izq paciente

// PEDIÁTRICA (decidua FDI)
const DEC_Q5 = [55, 54, 53, 52, 51]; // sup-der deciduo
const DEC_Q6 = [61, 62, 63, 64, 65]; // sup-izq deciduo
const DEC_Q8 = [85, 84, 83, 82, 81]; // inf-der deciduo
const DEC_Q7 = [71, 72, 73, 74, 75]; // inf-izq deciduo

// MIXTA: permanentes + espacio para deciduos (zonas 3-5 por cuadrante)
// Los dientes mixtos típicos son molares deciduos en posiciones 4 y 5
const MIXED_Q1 = [18, 17, 16, 15, 14, 13, 12, 11];
const MIXED_Q2 = [21, 22, 23, 24, 25, 26, 27, 28];
const MIXED_Q4 = [48, 47, 46, 45, 44, 43, 42, 41];
const MIXED_Q3 = [31, 32, 33, 34, 35, 36, 37, 38];
// Deciduos presentes en dentición mixta (sobre los permanentes)
const MIXED_DEC_SUP = [55, 54, 53, 52, 51, 61, 62, 63, 64, 65];
const MIXED_DEC_INF = [85, 84, 83, 82, 81, 71, 72, 73, 74, 75];

// ─────────────────────────────────────────────────────────────────────────────
// Mapa de cara FDI → cara ToothBox según cuadrante
// ─────────────────────────────────────────────────────────────────────────────
type FaceMap = { M: ToothFace; D: ToothFace; V: ToothFace; L: ToothFace; center: ToothFace };

const getFaceMap = (id: number): FaceMap => {
  const q = Math.floor(id / 10);
  // Q1, Q4 (y sus deciduos Q5, Q8): der. del paciente → Mesial apunta al centro = right en pantalla
  const isRight = q === 1 || q === 4 || q === 5 || q === 8;
  return {
    M: isRight ? 'right' : 'left',
    D: isRight ? 'left'  : 'right',
    V: 'top',
    L: 'bottom',
    center: 'center',
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// buildBox v3 — Convierte ExtState → BoxState para ToothBox v3
// Tres modos de renderizado:
//   1. Superficie (C, O, SE): colorea caras por superficie seleccionada
//   2. Contorno (RT): caras blancas con borde rojo en superficies afectadas
//   3. Símbolo (todos los demás): caras blancas + clinicalState para dibujar el símbolo normativo
// ─────────────────────────────────────────────────────────────────────────────
const buildBox = (ext: ExtState, _id: number): BoxState => {
  const s     = ext.clinicalState;
  const white = '#ffffff';
  const color = s === 'C' && ext.cariesGrade
    ? CARIES_GRADE_COLORS[ext.cariesGrade]
    : ADA[s] ?? white;

  // ─ 1. Sano ────────────────────────────────────────────────────────────────────────
  if (s === 'S') return { top: white, bottom: white, left: white, right: white, center: white, clinicalState: 'S' };

  // ─ 2. Estados de superficie: pintar caras (C rojo, O azul, SE azul) ───────────
  if (SURFACE_STATES.has(s)) {
    const hasFaces = ['top','bottom','left','right','center'].some(
      f => (ext as any)[f] && (ext as any)[f] !== white
    );
    if (hasFaces) {
      return { top: ext.top ?? white, bottom: ext.bottom ?? white,
               left: ext.left ?? white, right: ext.right ?? white,
               center: ext.center ?? white, clinicalState: s };
    }
    return { top: white, bottom: white, left: white, right: white, center: color, clinicalState: s };
  }

  // ─ 3. Restauración Temporal (RT): contorno rojo sin relleno ─────────────────
  if (OUTLINE_STATES.has(s)) {
    const hasFaces = ['top','bottom','left','right','center'].some(
      f => (ext as any)[f] && (ext as any)[f] !== white
    );
    if (hasFaces) {
      return { top: ext.top ?? white, bottom: ext.bottom ?? white,
               left: ext.left ?? white, right: ext.right ?? white,
               center: ext.center ?? white, clinicalState: 'RT' };
    }
    return { top: white, bottom: white, left: white, right: white, center: color, clinicalState: 'RT' };
  }

  // ─ 4. Todos los demás: símbolo normativo SVG ─────────────────────────────────
  // Caras blancas + clinicalState para que ToothBox dibuje el símbolo
  return {
    top: white, bottom: white, left: white, right: white, center: white,
    clinicalState: s,
    mobility: ext.mobility,
    crownType: ext.crownType,
    pulpLabel: ext.pulpLabel,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Estado inicial
// ─────────────────────────────────────────────────────────────────────────────
const blank = (id: number): ExtState => ({
  clinicalState: 'S',
  top: '#ffffff', bottom: '#ffffff', left: '#ffffff', right: '#ffffff', center: '#ffffff',
});

const initTeeth = (ids: number[]): Record<number, ExtState> => {
  const m: Record<number, ExtState> = {};
  ids.forEach(id => { m[id] = blank(id); });
  return m;
};

// ─────────────────────────────────────────────────────────────────────────────
// Leyenda ADA
// ─────────────────────────────────────────────────────────────────────────────
// Leyenda: AZUL (#1A73E8) para tratamientos, ROJO (#EA4335) para patologías
const AZUL_N = '#1A73E8';
const ROJO_N = '#EA4335';

const LEGEND: { state: ToothState; label: string; color: string }[] = [
  { state: 'C',   label: 'Caries',          color: ROJO_N },
  { state: 'O',   label: 'Restaurado',       color: AZUL_N },
  { state: 'RT',  label: 'Rest. Temporal',   color: ROJO_N },
  { state: 'A',   label: 'Ausente',          color: AZUL_N },
  { state: 'EI',  label: 'Extrac. Indicada', color: ROJO_N },
  { state: 'CR',  label: 'Corona',           color: AZUL_N },
  { state: 'PU',  label: 'Puente',           color: AZUL_N },
  { state: 'E',   label: 'T. Conductos',     color: AZUL_N },
  { state: 'PC',  label: 'Pulpectomía',      color: AZUL_N },
  { state: 'PP',  label: 'Pulpotomía',       color: AZUL_N },
  { state: 'IM',  label: 'Implante',         color: AZUL_N },
  { state: 'SE',  label: 'Sellador',         color: AZUL_N },
  { state: 'F',   label: 'Fractura',         color: ROJO_N },
  { state: 'MOV', label: 'Movilidad',        color: AZUL_N },
  { state: 'RR',  label: 'Rem. Radicular',   color: ROJO_N },
  { state: 'OF',  label: 'Obtur. Filtrada',   color: '#A52A2A' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────────────────────────────────────
export const Odontograma: React.FC<OdontogramaProps> = ({
  handleOdontogramaChange,
  onRedaccionGenerada,
  initialTeethState,
  minimalMode = false,
}) => {
  const [dentition, setDentition]           = useState<DentitionMode>('permanent');
  const [teeth, setTeeth]                   = useState<Record<number, ExtState>>(
    () => initialTeethState || initTeeth([...PERMANENT_TEETH_IDS, ...DECIDUOUS_TEETH_IDS])
  );
  const [selectedId, setSelectedId]         = useState<number | null>(null);
  const [pendingToothId, setPendingToothId] = useState<number | null>(null);
  const [odontogramView, setOdontogramView] = useState<'images' | 'boxes'>('images');

  // Sincronizar el estado de los dientes con el componente padre
  useEffect(() => {
    if (handleOdontogramaChange) {
      handleOdontogramaChange(teeth as any);
    }
  }, [teeth, handleOdontogramaChange]);

  // ── Aplicar estado desde panel ────────────────────────────────────────────
  const applyPanel = useCallback((
    state: ToothState,
    surfaces: Record<string, boolean>,
    mobility?: 1 | 2 | 3,
    cariesGrade?: 1 | 2 | 3 | 4,
    materialType?: string,   // AM | R | IV | IM | IE  (solo O, RT)
    crownType?: string,      // CC | CF | CMC | CJ | CV | CP  (solo CR)
  ) => {
    if (selectedId === null) return;
    const id = selectedId;
    const color = state === 'C' && cariesGrade
      ? CARIES_GRADE_COLORS[cariesGrade]
      : ADA[state];
    const faceMap = getFaceMap(id);
    const white = '#ffffff';

    const next: ExtState = {
      clinicalState: state,
      mobility,
      cariesGrade,
      crownType,      // preservar tipo de corona para ToothBox v3
      materialType,   // preservar material para redacción
      top: white, bottom: white, left: white, right: white, center: white,
    };

    if (state === 'A') {
      next.isExtracted = true;
    } else if (['CR', 'PU'].includes(state)) {
      next.top = color; next.bottom = color; next.left = color; next.right = color; next.center = color;
    } else if (state === 'E') {
      next.center = color;
    } else if (state === 'IM') {
      next.top = '#ECEFF1'; next.bottom = '#ECEFF1'; next.left = '#ECEFF1'; next.right = '#ECEFF1'; next.center = '#607D8B';
    } else if (state === 'MOV') {
      next.center = '#FFF3E0';
    } else if (state === 'EI') {
      next.center = color; 
    } else if (['C', 'O', 'OF', 'SE'].includes(state)) {
      const active = Object.keys(surfaces).filter(k => surfaces[k]);
      if (active.length === 0) {
        next.center = color;
      } else {
        active.forEach(surf => {
          const face: ToothFace = (surf === 'O' || surf === 'I')
            ? 'center'
            : (faceMap[surf as keyof FaceMap] ?? 'center');
          (next as any)[face] = color;
        });
      }
    }

    setTeeth(prev => {
      const updated = { ...prev, [id]: next };
      if (onRedaccionGenerada) {
        // ✅ Usar Object.entries() para garantizar correlación ID ↔ estado
        const arrForEngine = Object.entries(updated).map(([key, v]) => ({
          id: parseInt(key),
          state: v.clinicalState,
          surfaces: {},
          mobility: v.mobility,
          cariesGrade: v.cariesGrade,
          crownType: v.crownType,
          pulpLabel: v.pulpLabel,
          materialType: v.materialType,
        }));
        onRedaccionGenerada(generateOdontogramHTML(arrForEngine as any));
      }
      return updated;
    });
    setSelectedId(null);
  }, [selectedId, onRedaccionGenerada]);

  // ── Comando de voz ────────────────────────────────────────────────────────
  const handleVoice = useCallback((cmd: ParsedVoiceCommand) => {
    const id = cmd.toothId;
    const all = [...PERMANENT_TEETH_IDS, ...DECIDUOUS_TEETH_IDS];
    if (!all.includes(id)) return;
    const color = cmd.state === 'C' && cmd.cariesGrade
      ? CARIES_GRADE_COLORS[cmd.cariesGrade]
      : ADA[cmd.state];
    const faceMap = getFaceMap(id);
    const white = '#ffffff';
    const next: ExtState = {
      clinicalState: cmd.state,
      mobility: cmd.mobility,
      cariesGrade: cmd.cariesGrade,
      top: white, bottom: white, left: white, right: white, center: white,
    };
    if (cmd.state === 'A') next.isExtracted = true;
    else if (['CR','PU'].includes(cmd.state)) { next.top=color;next.bottom=color;next.left=color;next.right=color;next.center=color; }
    else if (cmd.state === 'E') { next.center=color; }
    else if (cmd.state === 'IM') { next.top='#ECEFF1';next.bottom='#ECEFF1';next.left='#ECEFF1';next.right='#ECEFF1';next.center='#607D8B'; }
    else if (cmd.state === 'MOV') { next.center='#FFF3E0'; }
    else if (cmd.state === 'EI') { next.center=color; }
    else if (['C','O','OF','SE'].includes(cmd.state)) {
      if (cmd.surfaces.length === 0) { next.center=color; }
      else { cmd.surfaces.forEach(s => { const f: ToothFace=(s==='O'||s==='I')?'center':(faceMap[s as keyof FaceMap]??'center'); (next as any)[f]=color; }); }
    }
    setTeeth(prev => {
      const updated = {...prev, [id]: next};
      if (onRedaccionGenerada) {
        // ✅ Usar Object.entries() para garantizar correlación ID ↔ estado
        const arr = Object.entries(updated).map(([key, v]) => ({
          id: parseInt(key),
          state: v.clinicalState,
          surfaces: {},
          mobility: v.mobility,
          cariesGrade: v.cariesGrade,
          crownType: v.crownType,
          pulpLabel: v.pulpLabel,
          materialType: v.materialType,
        }));
        onRedaccionGenerada(generateOdontogramHTML(arr as any));
      }
      return updated;
    });
  }, [onRedaccionGenerada]);

  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const { selectedVoiceURI } = useVoiceSelector();

  const { isListening, toggleListening, feedback, transcript } = useOdontogramaVoice({
    onCommand: handleVoice,
    onPendingTooth: setPendingToothId,
    preferredVoiceURI: selectedVoiceURI || undefined,
  });

  // ── Limpiar odontograma completo ────────────────────────────────────────
  const clearOdontograma = useCallback(() => {
    const allIds = [...PERMANENT_TEETH_IDS, ...DECIDUOUS_TEETH_IDS];
    const cleared = initTeeth(allIds);
    setTeeth(cleared);
    // Limpiar el documento del lado derecho también
    if (onRedaccionGenerada) onRedaccionGenerada('');
    // Notificar al padre
    handleOdontogramaChange(cleared as any);
  }, [onRedaccionGenerada, handleOdontogramaChange]);

  // ── Render de UN diente ────────────────────────────────────────────────────
  const renderTooth = (id: number) => {
    const ext = teeth[id] ?? blank(id);
    const box = buildBox(ext, id);
    const isPending = pendingToothId === id;
    const q = Math.floor(id / 10);
    const upper = q === 1 || q === 2 || q === 5 || q === 6;
    
    // ── Curvatura tipo arco dental (solo en vista de anatomía) ──────────────
    // Offset progresivo: posición 1 (incisivo) = 0, posición 8 (molar) = max
    const position = id % 10; // 1–8
    const CURVE_PX = [0, 4, 9, 15, 20, 24, 27, 29] as const;
    const curveAmt = CURVE_PX[Math.min(position - 1, 7)];
    // Superiores (U invertida): molares bajan (+Y) pero suavizado (75%). Inferiores (U sutil): molares suben (-Y) al 50%.
    const curveTransform = odontogramView === 'images'
      ? `translateY(${upper ? Math.round(curveAmt * 0.75) : -Math.round(curveAmt * 0.5)}px)`
      : 'none';

    return (
      <div
        key={id}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: upper ? 'flex-end' : 'flex-start',
          transform: curveTransform,
          transition: 'transform 0.4s ease',
          margin: 0,
        }}
      >
        {/* Halo de voz pendiente */}
        {isPending && (
          <div
            style={{
              position: 'absolute', inset: '-4px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #34d399, #059669)',
              opacity: 0.55,
              animation: 'dtx-pulse 1.2s ease-in-out infinite alternate',
              zIndex: 0, pointerEvents: 'none',
            }}
          />
        )}
        {/* Badge de grado de caries */}
        {ext.clinicalState === 'C' && ext.cariesGrade && (
          <span
            style={{
              position: 'absolute',
              top: upper ? undefined : '-13px',
              bottom: upper ? '-13px' : undefined,
              fontSize: 7, fontWeight: 900, lineHeight: 1,
              zIndex: 10,
              color: CARIES_GRADE_COLORS[ext.cariesGrade],
              fontFamily: 'ui-sans-serif,system-ui,sans-serif',
            }}
          >
            G{['I','II','III','IV'][ext.cariesGrade - 1]}
          </span>
        )}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <ToothBox
            id={id}
            state={box}
            isUpper={upper}
            viewMode={odontogramView}
            onClickFace={(_face) => setSelectedId(id)}
            onClickTooth={() => setSelectedId(id)}
          />
        </div>
      </div>
    );
  };

  const renderArch = (left: number[], right: number[], alignBottom = true) => {
    const alignItems = alignBottom ? 'flex-end' : 'flex-start';
    const archGap = odontogramView === 'images' ? 0 : 5; // Menos espacio entre dientes en anatomía
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems, gap: 0 }}>
        {/* Cuadrante izquierdo en pantalla (Q1 para sup, Q4 para inf) */}
        <div style={{ display: 'flex', alignItems, gap: archGap }}>
          {left.map(renderTooth)}
        </div>
        {/* Separador de línea media */}
        <div style={{
          width: odontogramView === 'images' ? 0 : 1, height: 28, background: 'linear-gradient(to bottom, transparent, #D1D5DB, transparent)',
          margin: odontogramView === 'images' ? '0 0px' : '0 10px', flexShrink: 0, alignSelf: 'center',
          opacity: odontogramView === 'images' ? 0 : 1, // Ocultar sutilmente la línea en vista anatomía para que parezcan unidos
        }} />
        {/* Cuadrante derecho en pantalla (Q2 para sup, Q3 para inf) */}
        <div style={{ display: 'flex', alignItems, gap: archGap }}>
          {right.map(renderTooth)}
        </div>
      </div>
    );
  };

  const renderDentition = () => {
    // Separador entre arcadas: línea media muy sutil con etiqueta FDI
    const archDivider = (
      <div style={{
        display: 'flex', alignItems: 'center',
        margin: odontogramView === 'images' ? '24px 0' : '2px 0', // Ajustado para compensar la reducción de curvatura y mantener las arcadas juntas
        padding: '0 12px',
        transition: 'margin 0.4s ease',
      }}>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,transparent,#E5E7EB 30%,#E5E7EB 70%,transparent)' }} />
      </div>
    );

    if (dentition === 'permanent') return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
        backgroundColor: 'transparent',
        padding: '20px 0',
        width: '100%',
      }}>

        {/* ── Bloque arcada superior (cuadros) ── */}
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: 950,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {renderArch(PERM_Q1, PERM_Q2, true)}
        </div>

        {archDivider}

        {/* ── Bloque arcada inferior (cuadros) ── */}
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: 950,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {renderArch(PERM_Q4, PERM_Q3, false)}
        </div>

      </div>
    );

    if (dentition === 'pediatric') return (
      <>
        {renderArch(DEC_Q5, DEC_Q6, true)}
        {archDivider}
        {renderArch(DEC_Q8, DEC_Q7, false)}
      </>
    );

    return (
      <>
        <p className="text-center text-[7px] font-bold tracking-[2px] uppercase text-purple-400 mb-1">Deciduos superiores</p>
        {renderArch(DEC_Q5, DEC_Q6)}
        <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,#C084FC 30%,#C084FC 70%,transparent)', margin: '4px 0', opacity: 0.4 }} />
        <p className="text-center text-[7px] font-bold tracking-[2px] uppercase text-gray-400 mb-1">Permanentes superiores</p>
        {renderArch(MIXED_Q1, MIXED_Q2)}
        <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,#E5E7EB 20%,#E5E7EB 80%,transparent)', margin: '8px 0' }} />
        <p className="text-center text-[7px] font-bold tracking-[2px] uppercase text-gray-400 mb-1">Permanentes inferiores</p>
        {renderArch(MIXED_Q4, MIXED_Q3)}
        <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,#C084FC 30%,#C084FC 70%,transparent)', margin: '4px 0', opacity: 0.4 }} />
        <p className="text-center text-[7px] font-bold tracking-[2px] uppercase text-purple-400 mb-1">Deciduos inferiores</p>
        {renderArch(DEC_Q8, DEC_Q7)}
      </>
    );
  };



  const handleVoiceButtonClick = () => {
    if (isListening) {
      toggleListening();
    } else {
      setShowVoiceModal(true);
    }
  };

  const handleVoiceConfirm = (voiceURI: string) => {
    setShowVoiceModal(false);
    // Iniciar con TTS de saludo usando la voz seleccionada
    const utter = new SpeechSynthesisUtterance('¡Dentaxi está listo! Comience a dictar el odontograma');
    utter.lang = 'es-MX';
    utter.rate = 1.0;
    utter.volume = 0.95;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.voiceURI === voiceURI);
    if (preferred) utter.voice = preferred;
    utter.onend = () => { if (!isListening) toggleListening(); };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="w-full relative" data-section-name="odontograma">
      {/* Keyframes de Apple Intelligence & Gemini */}
      <style>{`
        @keyframes dtx-pan {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes dtx-orbit {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes dtx-pulse {
          0%   { opacity: 0.5; transform: scale(0.97); }
          100% { opacity: 0.9; transform: scale(1.03); }
        }
        @keyframes dtx-breathe {
          0%, 100% { opacity: 0.3; transform: scale(0.99); }
          50% { opacity: 0.8; transform: scale(1.01); }
        }
      `}</style>

      {/* Selector de vista eliminado de aquí — movido a controles inferiores */}

      {isListening && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100/50">
          <span className={`text-[11px] font-medium ${
            feedback.type === 'success' ? 'text-emerald-600' :
            feedback.type === 'error'   ? 'text-red-500' : 'text-indigo-600'
          }`}>
            {feedback.message || 'Escuchando con precisión… Ej: "OD 21 caries grado 3 mesial"'}
          </span>
          {transcript && <span className="text-[10px] text-gray-400 italic truncate">"{transcript}"</span>}
        </div>
      )}

      {/* ── Odontograma + Marco IA Apple & Gemini ──────────── */}
      <div
        className="relative mt-2 transition-all duration-700"
        style={{
          zIndex: 1,
          isolation: 'isolate',
          paddingBottom: 4,
          backgroundColor: 'transparent',
        }}
      >
        
        {/* Capa 1: Sombra luminosa envolvente (Glow ambiental) — Animación LED Verde */}
        {isListening && (
          <div 
            className="absolute -inset-1.5 rounded-[24px] z-[-2] pointer-events-none"
            style={{
              background: 'linear-gradient(120deg, #10b981 0%, #34d399 25%, #059669 50%, #34d399 75%, #10b981 100%)',
              backgroundSize: '200% 200%',
              animation: 'dtx-pan 6s linear infinite, dtx-breathe 3s ease-in-out infinite alternate',
              filter: 'blur(16px)',
            }}
          />
        )}

        {/* Capa 2: Borde que fluye (Rotación LED esmeralda) */}
        {isListening && (
          <div className="absolute inset-0 rounded-2xl z-[-1] overflow-hidden p-[2px] pointer-events-none">
            <div 
              className="absolute w-[300%] h-[300%] top-[-100%] left-[-100%]"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0%, #10b981 15%, #34d399 30%, #059669 45%, transparent 60%)',
                animation: 'dtx-orbit 4s linear infinite',
                filter: 'blur(1px)',
              }}
            />
            {/* Máscara interior para dejar solo el borde luminoso */}
            <div className="absolute inset-[2px] bg-white rounded-[14px]" />
          </div>
        )}

        {/* Capa 3: Contenedor principal de los dientes */}
        <div
          className={`rounded-2xl bg-transparent relative z-10 transition-all duration-500 ${
            isListening ? 'border-transparent shadow-none' : 'border-none shadow-none'
          }`}
          style={{
            overflow: 'visible',
            padding: '16px 0 20px',
            width: '100%',
            position: 'relative',
            zIndex: 1,
            backgroundColor: 'transparent',
          }}
        >
          {!minimalMode && (
            <p style={{
              textAlign: 'center', fontSize: 7, fontWeight: 700,
              letterSpacing: '2px', textTransform: 'uppercase',
              color: '#D1D5DB', marginBottom: 10,
              fontFamily: 'ui-sans-serif,system-ui,sans-serif',
            }}>
              ← Der. paciente &nbsp;|&nbsp; Izq. paciente →
            </p>
          )}

          {renderDentition()}

          {!minimalMode && (
            <p className="text-center text-[8px] font-bold tracking-[2px] uppercase text-gray-300 mt-3">
              Norma FDI · {dentition === 'permanent' ? '32 dientes permanentes' : dentition === 'pediatric' ? '20 dientes deciduos' : 'Dentición mixta'}
            </p>
          )}
        </div>
      </div>
      
      {/* Controles Inferiores: [modos] [toggle vista] [voz] */}
      {!minimalMode && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 16, flexWrap: 'wrap', gap: 8, padding: '0 8px',
        }}>
        {/* Botones de modo de dentición */}
        <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-0.5 gap-0.5">
          {(['permanent','pediatric','mixed'] as DentitionMode[]).map(mode => (
            <button
              key={mode}
              type="button"
              onClick={() => setDentition(mode)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                dentition === mode
                  ? 'bg-white text-zinc-900 shadow-sm border border-gray-200'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {mode === 'permanent' ? 'Permanente' : mode === 'pediatric' ? 'Pediátrica' : 'Mixta'}
            </button>
          ))}
        </div>

        {/* Toggle de vista — centro — */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            type="button"
            onClick={() => setOdontogramView('images')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 24, height: 24, borderRadius: '50%',
              background: odontogramView === 'images' ? 'rgba(99,102,241,0.12)' : 'transparent',
              border: odontogramView === 'images' ? '1.5px solid rgba(99,102,241,0.4)' : '1.5px solid rgba(180,180,195,0.35)',
              cursor: 'pointer', transition: 'all 0.2s',
              color: odontogramView === 'images' ? '#6366f1' : '#9CA3AF',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: 8, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase',
              color: odontogramView === 'images' ? '#6366f1' : '#64748b',
              fontFamily: 'ui-sans-serif,system-ui,sans-serif',
              whiteSpace: 'nowrap', transition: 'color 0.3s',
            }}>
              {odontogramView === 'images' ? '🦷 Anatomía' : '📋 Diagnóstico'}
            </p>
            <div style={{ display: 'flex', gap: 3, justifyContent: 'center', marginTop: 2 }}>
              <div style={{
                width: 12, height: 2.5, borderRadius: 2,
                background: odontogramView === 'images' ? '#6366f1' : 'rgba(180,180,195,0.4)',
                transition: 'background 0.3s',
              }}/>
              <div style={{
                width: 12, height: 2.5, borderRadius: 2,
                background: odontogramView === 'boxes' ? '#64748b' : 'rgba(180,180,195,0.4)',
                transition: 'background 0.3s',
              }}/>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOdontogramView('boxes')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 24, height: 24, borderRadius: '50%',
              background: odontogramView === 'boxes' ? 'rgba(100,116,139,0.12)' : 'transparent',
              border: odontogramView === 'boxes' ? '1.5px solid rgba(100,116,139,0.4)' : '1.5px solid rgba(180,180,195,0.35)',
              cursor: 'pointer', transition: 'all 0.2s',
              color: odontogramView === 'boxes' ? '#64748b' : '#9CA3AF',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Acciones de voz y reset */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={clearOdontograma}
            title="Limpiar Odontograma"
            className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 border border-gray-200 bg-white transition-all shadow-sm"
          >
            <RotateCcw size={12} />
          </button>

          <button
            type="button"
            onClick={handleVoiceButtonClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold transition-all shadow-sm ${
              isListening
                ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white border-transparent shadow-emerald-500/20'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {isListening ? <><MicOff size={11} className="animate-pulse" /> Detener Asistente</> : <><Mic size={11} className="text-emerald-500" /> DentaXy Voice</>}
          </button>
        </div>
      </div>
      )}

      {showVoiceModal && (
        <VoiceSelectorModal
          onConfirm={handleVoiceConfirm}
          onCancel={() => setShowVoiceModal(false)}
        />
      )}

      {selectedId !== null && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/10"
            onClick={() => setSelectedId(null)}
          />
          <ToothPanel
            tooth={{
              id: selectedId,
              state: teeth[selectedId]?.clinicalState ?? 'S',
              surfaces: {},
              mobility: teeth[selectedId]?.mobility,
              cariesGrade: teeth[selectedId]?.cariesGrade,
            }}
            onApply={applyPanel}
            onClose={() => setSelectedId(null)}
          />
        </>
      )}
    </div>
  );
};

export default Odontograma;
