/**
 * Odontograma.tsx — Odontograma DentaXy completo
 * · Diseño original ToothBox (5 caras SVG) restaurado
 * · 12 estados ADA con colores normativos por cara
 * · Grado de caries I-IV para diagnóstico preciso
 * · Dentición Permanente / Pediátrica / Mixta (FDI)
 * · Dictado por voz con 12 comandos + superficies
 * · Sin botón de redacción — se dispara automáticamente
 */
import React, { useState, useCallback } from 'react';
import { FormDataState } from '../../types/historiaClinica';
import { ToothBox, ToothFace, ToothState as BoxState } from './odontograma/ToothBox';
import { ToothPanel } from '../odontograma/ToothPanel';
import {
  ToothData, ToothState, TOOTH_COLORS,
  PERMANENT_TEETH_IDS, DECIDUOUS_TEETH_IDS,
} from '@/types/odontograma';
import { useOdontogramaVoice, ParsedVoiceCommand } from '@/hooks/useOdontogramaVoice';
import { generateOdontogramHTML } from '@/lib/engine/generateOdontogramRedaction';
import { Mic, MicOff } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────
interface OdontogramaProps {
  formData: FormDataState;
  handleOdontogramaChange: (state: Record<number, ToothData>) => void;
  onRedaccionGenerada?: (text: string) => void;
  onToggleViewMode?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Tipos internos
// ─────────────────────────────────────────────────────────────────────────────
type DentitionMode = 'permanent' | 'pediatric' | 'mixed';

interface ExtState extends BoxState {
  clinicalState: ToothState;
  mobility?: 1 | 2 | 3;
  cariesGrade?: 1 | 2 | 3 | 4;
}

const ADA = TOOTH_COLORS;

// ─────────────────────────────────────────────────────────────────────────────
// Colores por grado de caries (variaciones del rojo ADA)
// ─────────────────────────────────────────────────────────────────────────────
const CARIES_GRADE_COLORS: Record<1|2|3|4, string> = {
  1: '#FFAB91', // Esmalte — rojo claro
  2: '#EF6C50', // Dentina superficial — naranja-rojo
  3: '#E53935', // Dentina profunda — rojo ADA estándar
  4: '#B71C1C', // Compromiso pulpar — rojo oscuro
};

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
// Construir el BoxState desde el ExtState
// ─────────────────────────────────────────────────────────────────────────────
const buildBox = (ext: ExtState, id: number): BoxState => {
  const s = ext.clinicalState;
  // Color base del estado; para caries usa el color por grado
  const color = s === 'C' && ext.cariesGrade
    ? CARIES_GRADE_COLORS[ext.cariesGrade]
    : ADA[s] ?? '#ffffff';
  const white = '#ffffff';

  switch (s) {
    case 'S':
      return { top: white, bottom: white, left: white, right: white, center: white };
    case 'A':
      return { top: white, bottom: white, left: white, right: white, center: white, isExtracted: true };
    case 'EI':
      return { top: white, bottom: white, left: white, right: white, center: white };
    case 'CR':
    case 'PU':
      return { top: color, bottom: color, left: color, right: color, center: color };
    case 'E':
      return { top: white, bottom: white, left: white, right: white, center: color };
    case 'IM':
      return { top: '#ECEFF1', bottom: '#ECEFF1', left: '#ECEFF1', right: '#ECEFF1', center: '#607D8B' };
    case 'F':
      return { top: white, bottom: white, left: white, right: white, center: color };
    case 'MOV':
      return { top: white, bottom: white, left: white, right: white, center: '#FFF3E0' };
    case 'C':
    case 'O':
    case 'SE': {
      // Usar superficies guardadas si existen
      const hasFaces = ['top','bottom','left','right','center'].some(
        f => (ext as any)[f] && (ext as any)[f] !== white
      );
      if (hasFaces) {
        return { top: ext.top ?? white, bottom: ext.bottom ?? white, left: ext.left ?? white, right: ext.right ?? white, center: ext.center ?? white };
      }
      // Fallback: colorear oclusal/centro
      return { top: white, bottom: white, left: white, right: white, center: color };
    }
    default:
      return { top: white, bottom: white, left: white, right: white, center: white };
  }
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
const LEGEND: { state: ToothState; label: string }[] = [
  { state: 'C',   label: 'Caries' },
  { state: 'O',   label: 'Obturado' },
  { state: 'A',   label: 'Ausente' },
  { state: 'EI',  label: 'Extrac. Ind.' },
  { state: 'E',   label: 'Endodoncia' },
  { state: 'CR',  label: 'Corona' },
  { state: 'PU',  label: 'Puente' },
  { state: 'IM',  label: 'Implante' },
  { state: 'SE',  label: 'Sellador' },
  { state: 'F',   label: 'Fractura' },
  { state: 'MOV', label: 'Movilidad' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────────────────────────────────────
export const Odontograma: React.FC<OdontogramaProps> = ({
  handleOdontogramaChange,
  onRedaccionGenerada,
}) => {
  const [dentition, setDentition]           = useState<DentitionMode>('permanent');
  const [teeth, setTeeth]                   = useState<Record<number, ExtState>>(
    () => initTeeth([...PERMANENT_TEETH_IDS, ...DECIDUOUS_TEETH_IDS])
  );
  const [selectedId, setSelectedId]         = useState<number | null>(null);
  const [pendingToothId, setPendingToothId] = useState<number | null>(null);

  // ── Aplicar estado desde panel ────────────────────────────────────────────
  const applyPanel = useCallback((
    state: ToothState,
    surfaces: Record<string, boolean>,
    mobility?: 1 | 2 | 3,
    cariesGrade?: 1 | 2 | 3 | 4
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
    } else if (['C', 'O', 'SE'].includes(state)) {
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
        const arrForEngine = Object.values(updated).map((v, i) => ({
          id: Object.keys(updated)[i] ? parseInt(Object.keys(updated)[i]) : 0,
          state: v.clinicalState,
          surfaces: {},
          mobility: v.mobility,
          cariesGrade: v.cariesGrade,
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
    else if (['C','O','SE'].includes(cmd.state)) {
      if (cmd.surfaces.length === 0) { next.center=color; }
      else { cmd.surfaces.forEach(s => { const f: ToothFace=(s==='O'||s==='I')?'center':(faceMap[s as keyof FaceMap]??'center'); (next as any)[f]=color; }); }
    }
    setTeeth(prev => {
      const updated = {...prev, [id]: next};
      if (onRedaccionGenerada) {
        const arr = Object.values(updated).map((v, i) => ({
          id: Object.keys(updated)[i] ? parseInt(Object.keys(updated)[i]) : 0,
          state: v.clinicalState,
          surfaces: {},
          mobility: v.mobility,
          cariesGrade: v.cariesGrade,
        }));
        onRedaccionGenerada(generateOdontogramHTML(arr as any));
      }
      return updated;
    });
  }, [onRedaccionGenerada]);

  const { isListening, toggleListening, feedback, transcript } = useOdontogramaVoice({
    onCommand: handleVoice,
    onPendingTooth: setPendingToothId, // Resaltado en tiempo real
  });

  // ── Render de UN diente ────────────────────────────────────────────────────
  const renderTooth = (id: number) => {
    const ext = teeth[id] ?? blank(id);
    const box = buildBox(ext, id);
    const isPending = pendingToothId === id; 
    return (
      <div key={id} className="flex flex-col items-center relative">
        {/* Anillo de espera "listening" */}
        {isPending && (
          <div
            style={{
              position: 'absolute',
              inset: '-4px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #34d399, #059669)',
              opacity: 0.7,
              animation: 'dtx-pulse 1.2s ease-in-out infinite alternate',
              zIndex: 0,
            }}
          />
        )}
        {/* Movilidad */}
        {ext.clinicalState === 'MOV' && ext.mobility && (
          <span className="text-[8px] font-black absolute -top-3 z-10 leading-none" style={{ color: '#FF6D00' }}>
            {['I','II','III'][ext.mobility - 1]}
          </span>
        )}
        {/* Extracción indicada */}
        {ext.clinicalState === 'EI' && (
          <span className="text-[9px] font-black absolute -top-3 z-10 leading-none" style={{ color: '#7B4FA8' }}>✕</span>
        )}
        {/* Grado de caries */}
        {ext.clinicalState === 'C' && ext.cariesGrade && (
          <span
            className="text-[7px] font-black absolute -top-3 z-10 leading-none px-0.5 rounded"
            style={{ color: CARIES_GRADE_COLORS[ext.cariesGrade], background: `${CARIES_GRADE_COLORS[ext.cariesGrade]}18` }}
          >
            G{['I','II','III','IV'][ext.cariesGrade - 1]}
          </span>
        )}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <ToothBox
            id={id}
            state={box}
            onClickFace={() => setSelectedId(id)}
            onClickExtracted={() => setSelectedId(id)}
          />
        </div>
      </div>
    );
  };

  const renderArch = (left: number[], right: number[]) => (
    <div className="flex justify-center items-center gap-0">
      <div className="flex items-center gap-1 flex-row-reverse">
        {left.map(renderTooth)}
      </div>
      <div style={{ width: 1, height: 52, background: '#E5E7EB', margin: '0 6px', borderRadius: 1, flexShrink: 0 }} />
      <div className="flex items-center gap-1">
        {right.map(renderTooth)}
      </div>
    </div>
  );

  const renderDentition = () => {
    if (dentition === 'permanent') return (
      <>
        {renderArch(PERM_Q1, PERM_Q2)}
        <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,#E5E7EB 20%,#E5E7EB 80%,transparent)', margin: '8px 0' }} />
        {renderArch(PERM_Q4, PERM_Q3)}
      </>
    );

    if (dentition === 'pediatric') return (
      <>
        {renderArch(DEC_Q5, DEC_Q6)}
        <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,#E5E7EB 20%,#E5E7EB 80%,transparent)', margin: '8px 0' }} />
        {renderArch(DEC_Q8, DEC_Q7)}
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

  const [showVoiceModal, setShowVoiceModal] = useState(false);

  const startVoiceWithTTS = () => {
    setShowVoiceModal(false);
    const greetingText = 'De acuerdo doctor, Dentaxi está listo. Puede comenzar a dictar el odontograma.';

    const utter = new SpeechSynthesisUtterance(greetingText);
    utter.lang = 'es-MX';
    utter.rate = 1.0;
    utter.pitch = 1.0;
    utter.volume = 0.95;

    const loadAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const maleVoice = voices.find(v =>
        v.lang.includes('es') && (
          v.name.toLowerCase().includes('pablo') ||
          v.name.toLowerCase().includes('jorge') ||
          v.name.toLowerCase().includes('male') ||
          v.name.toLowerCase().includes('google es')
        )
      ) || voices.find(v => v.lang.includes('es'));
      if (maleVoice) utter.voice = maleVoice;

      utter.onend = () => {
        if (!isListening) toggleListening(); 
      };
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = loadAndSpeak;
    } else {
      loadAndSpeak();
    }
  };

  const handleVoiceButtonClick = () => {
    if (isListening) {
      toggleListening();
    } else {
      setShowVoiceModal(true);
    }
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

      {/* Controles superiores */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
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

      <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
        {LEGEND.map(({ state, label }) => (
          <span key={state} className="flex items-center gap-1 text-[9px] font-semibold" style={{ color: ADA[state] }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: ADA[state], display: 'inline-block' }} />
            {label}
          </span>
        ))}
        <span className="text-[9px] text-gray-400 font-medium ml-2">· Caries:</span>
        {([1,2,3,4] as (1|2|3|4)[]).map(g => (
          <span key={g} className="flex items-center gap-1 text-[9px] font-semibold" style={{ color: CARIES_GRADE_COLORS[g] }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: CARIES_GRADE_COLORS[g], display: 'inline-block' }} />
            G{['I','II','III','IV'][g-1]}
          </span>
        ))}
      </div>

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
      <div className="relative z-0 mt-2 transition-all duration-700">
        
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
        <div className={`rounded-2xl bg-white px-4 py-4 overflow-x-auto relative z-10 transition-all duration-500 ${
          isListening ? 'border-transparent shadow-none' : 'border border-gray-100 shadow-sm'
        }`}>
          <p className="text-center text-[8px] font-bold tracking-[2px] uppercase text-gray-300 mb-3">
            ← Der. paciente &nbsp;|&nbsp; Izq. paciente →
          </p>

          {renderDentition()}

          <p className="text-center text-[8px] font-bold tracking-[2px] uppercase text-gray-300 mt-3">
            Norma FDI · {dentition === 'permanent' ? '32 dientes permanentes' : dentition === 'pediatric' ? '20 dientes deciduos' : 'Dentición mixta'}
          </p>
        </div>
      </div>

      {showVoiceModal && (
        <>
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={() => setShowVoiceModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full pointer-events-auto border border-purple-100">
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Mic className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-center text-lg font-bold text-gray-800 mb-2">Asistente Clínico DentaXy</h3>
              <p className="text-center text-xs text-gray-500 mb-4 leading-relaxed">
                Para disminuir errores y garantizar una precisión del 100% en el diagnóstico y plan de tratamiento:
              </p>
              <ul className="text-xs text-gray-600 mb-6 space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <li className="flex gap-2"><span>1.</span> Hable claro y fuerte.</li>
                <li className="flex gap-2"><span>2.</span> Mantenga el micrófono cerca.</li>
                <li className="flex gap-2"><span>3.</span> Sea preciso. Ejemplo: <i>"OD 46 caries grado 2 distal"</i>.</li>
              </ul>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowVoiceModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={startVoiceWithTTS}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-xl shadow-md hover:opacity-90 transition-opacity"
                >
                  Estoy listo
                </button>
              </div>
            </div>
          </div>
        </>
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
