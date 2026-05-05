/**
 * OdontogramaFDI.tsx — Fase 2D
 * Odontograma SVG interactivo basado en nomenclatura FDI (ISO 3950)
 * 32 dientes permanentes | 20 deciduos | 11 estados ADA | Historial de cambios
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Download, History, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS Y CONSTANTES
// ─────────────────────────────────────────────────────────────────────────────

export type EstadoDiente =
  | 'sano' | 'caries' | 'obturado' | 'corona' | 'ausente'
  | 'extraccion' | 'fractura' | 'endodoncia' | 'implante'
  | 'sellador' | 'puente';

export type CaraDiente = 'O' | 'M' | 'D' | 'V' | 'L';

export interface EstadoDienteObj {
  caras: Partial<Record<CaraDiente, EstadoDiente>>;
  general: EstadoDiente;
  nota?: string;
}

export type MapaOdontograma = Record<number, EstadoDienteObj>;

interface CambioHistorial {
  diente: number;
  cara?: CaraDiente;
  estadoAnterior: EstadoDiente;
  estadoNuevo: EstadoDiente;
  timestamp: Date;
  alumno: string;
}

// Colores ADA oficiales por estado
const COLORES_ESTADO: Record<EstadoDiente, { bg: string; border: string; label: string; emoji: string }> = {
  sano:       { bg: '#F0FDF4', border: '#86EFAC', label: 'Sano',       emoji: '✅' },
  caries:     { bg: '#FEF2F2', border: '#FCA5A5', label: 'Caries',     emoji: '🟡' },
  obturado:   { bg: '#EFF6FF', border: '#93C5FD', label: 'Obturado',   emoji: '🔵' },
  corona:     { bg: '#F5F3FF', border: '#C4B5FD', label: 'Corona',     emoji: '👑' },
  ausente:    { bg: '#18181B', border: '#52525B', label: 'Ausente',     emoji: '⬛' },
  extraccion: { bg: '#FFF7ED', border: '#FCA5A5', label: 'Extr. indicada', emoji: '❌' },
  fractura:   { bg: '#FEF9C3', border: '#FCD34D', label: 'Fractura',   emoji: '⚡' },
  endodoncia: { bg: '#FFF1F2', border: '#FDA4AF', label: 'Endodoncia', emoji: '🟠' },
  implante:   { bg: '#F0FDF4', border: '#6EE7B7', label: 'Implante',   emoji: '🔩' },
  sellador:   { bg: '#F0F9FF', border: '#67E8F9', label: 'Sellador',   emoji: '🛡' },
  puente:     { bg: '#FDF4FF', border: '#E879F9', label: 'Puente',     emoji: '⛓' },
};

const TODOS_ESTADOS = Object.keys(COLORES_ESTADO) as EstadoDiente[];

// Numeración FDI permanente
const ARCO_SUPERIOR_DER = [18, 17, 16, 15, 14, 13, 12, 11]; // derecha del paciente
const ARCO_SUPERIOR_IZQ = [21, 22, 23, 24, 25, 26, 27, 28]; // izquierda del paciente
const ARCO_INFERIOR_IZQ = [31, 32, 33, 34, 35, 36, 37, 38];
const ARCO_INFERIOR_DER = [48, 47, 46, 45, 44, 43, 42, 41];

// Deciduos
const DECIDUOS_SUP_DER = [55, 54, 53, 52, 51];
const DECIDUOS_SUP_IZQ = [61, 62, 63, 64, 65];
const DECIDUOS_INF_IZQ = [71, 72, 73, 74, 75];
const DECIDUOS_INF_DER = [85, 84, 83, 82, 81];

// Estado inicial
const crearEstadoInicial = (): EstadoDienteObj => ({
  caras: {},
  general: 'sano',
});

// ─────────────────────────────────────────────────────────────────────────────
// DIENTE SVG COMPONENTE
// ─────────────────────────────────────────────────────────────────────────────

interface DienteSVGProps {
  numero: number;
  estado: EstadoDienteObj;
  seleccionado: boolean;
  deciduo?: boolean;
  onClick: () => void;
}

const DienteSVG: React.FC<DienteSVGProps> = ({ numero, estado, seleccionado, deciduo = false, onClick }) => {
  const col = COLORES_ESTADO[estado.general];
  const size = deciduo ? 28 : 34;
  const hayCaras = Object.keys(estado.caras).length > 0;

  return (
    <button
      onClick={onClick}
      title={`Diente ${numero} — ${col.label}`}
      className={cn(
        'flex flex-col items-center gap-0.5 group focus:outline-none',
        seleccionado && 'ring-2 ring-zinc-900 dark:ring-white ring-offset-1 rounded-lg'
      )}
    >
      <span className={cn(
        'text-[9px] font-bold leading-none',
        seleccionado ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'
      )}>{numero}</span>

      <div
        style={{
          width: size,
          height: size * 1.15,
          backgroundColor: estado.general === 'ausente' ? '#18181B' :
            estado.general === 'sano' ? 'transparent' : col.bg,
          border: `2px solid ${seleccionado ? '#18181B' : col.border}`,
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.15s',
          boxShadow: seleccionado ? '0 0 0 3px rgba(0,0,0,0.06)' : undefined,
        }}
        className="hover:shadow-md transition-shadow"
      >
        {estado.general === 'ausente' ? (
          <span className="text-zinc-400 text-[10px]">✕</span>
        ) : hayCaras ? (
          <DiagramaCaras caras={estado.caras} size={size - 6} />
        ) : (
          <span className="text-[11px]">{col.emoji}</span>
        )}
      </div>
    </button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DIAGRAMA DE 5 CARAS
// ─────────────────────────────────────────────────────────────────────────────

const DiagramaCaras: React.FC<{ caras: Partial<Record<CaraDiente, EstadoDiente>>; size: number }> = ({ caras, size }) => {
  const s = size;
  const t = s / 3; // tercio

  const colorCara = (cara: CaraDiente) => {
    const est = caras[cara];
    if (!est || est === 'sano') return '#F9FAFB';
    return COLORES_ESTADO[est]?.bg ?? '#F9FAFB';
  };
  const borderCara = (cara: CaraDiente) => {
    const est = caras[cara];
    if (!est || est === 'sano') return '#E5E7EB';
    return COLORES_ESTADO[est]?.border ?? '#E5E7EB';
  };

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      {/* Occlusal (center) */}
      <rect x={t} y={t} width={t} height={t} fill={colorCara('O')} stroke={borderCara('O')} strokeWidth="1" />
      {/* Mesial (left) */}
      <polygon points={`0,0 ${t},${t} ${t},${s-t} 0,${s}`} fill={colorCara('M')} stroke={borderCara('M')} strokeWidth="1" />
      {/* Distal (right) */}
      <polygon points={`${s},0 ${s-t},${t} ${s-t},${s-t} ${s},${s}`} fill={colorCara('D')} stroke={borderCara('D')} strokeWidth="1" />
      {/* Vestibular (top) */}
      <polygon points={`0,0 ${s},0 ${s-t},${t} ${t},${t}`} fill={colorCara('V')} stroke={borderCara('V')} strokeWidth="1" />
      {/* Lingual/Paladar (bottom) */}
      <polygon points={`${t},${s-t} ${s-t},${s-t} ${s},${s} 0,${s}`} fill={colorCara('L')} stroke={borderCara('L')} strokeWidth="1" />
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PANEL LATERAL — EDITAR DIENTE
// ─────────────────────────────────────────────────────────────────────────────

interface PanelDienteProps {
  numero: number;
  estado: EstadoDienteObj;
  onCambiarGeneral: (est: EstadoDiente) => void;
  onCambiarCara: (cara: CaraDiente, est: EstadoDiente) => void;
  onAgregarNota: (nota: string) => void;
  onClose: () => void;
}

const PanelDiente: React.FC<PanelDienteProps> = ({ numero, estado, onCambiarGeneral, onCambiarCara, onAgregarNota, onClose }) => {
  const [nota, setNota] = useState(estado.nota ?? '');
  const caras: CaraDiente[] = ['O', 'M', 'D', 'V', 'L'];
  const nombresCaras: Record<CaraDiente, string> = {
    O: 'Oclusal',
    M: 'Mesial',
    D: 'Distal',
    V: 'Vestibular',
    L: 'Ling./Palat.',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-72 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 flex flex-col h-full overflow-hidden shrink-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <p className="text-xs text-zinc-400">Diente FDI</p>
          <h3 className="text-base font-bold text-zinc-900 dark:text-white"># {numero}</h3>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Estado general */}
        <div>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Estado general</p>
          <div className="grid grid-cols-2 gap-1.5">
            {TODOS_ESTADOS.map(est => {
              const col = COLORES_ESTADO[est];
              const activo = estado.general === est;
              return (
                <button
                  key={est}
                  onClick={() => onCambiarGeneral(est)}
                  className={cn(
                    'flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-left transition-all text-xs',
                    activo
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold'
                      : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                  )}
                >
                  <span>{col.emoji}</span>
                  <span className="truncate">{col.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Estado por cara */}
        <div>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Estado por cara</p>
          <div className="space-y-2">
            {caras.map(cara => {
              const est = estado.caras[cara] ?? 'sano';
              return (
                <div key={cara} className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-zinc-500 w-16 shrink-0">{nombresCaras[cara]}</span>
                  <select
                    value={est}
                    onChange={e => onCambiarCara(cara, e.target.value as EstadoDiente)}
                    className="flex-1 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white"
                  >
                    {TODOS_ESTADOS.map(e => (
                      <option key={e} value={e}>{COLORES_ESTADO[e].emoji} {COLORES_ESTADO[e].label}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>

        {/* Nota */}
        <div>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Nota clínica</p>
          <textarea
            value={nota}
            onChange={e => setNota(e.target.value)}
            onBlur={() => onAgregarNota(nota)}
            rows={3}
            placeholder="Observaciones adicionales..."
            className="w-full text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white resize-none"
          />
        </div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ODONTOGRAMA PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

interface OdontogramaFDIProps {
  mapaInicial?: MapaOdontograma;
  readOnly?: boolean;
  onChange?: (mapa: MapaOdontograma) => void;
}

const OdontogramaFDI: React.FC<OdontogramaFDIProps> = ({
  mapaInicial = {},
  readOnly = false,
  onChange,
}) => {
  const [mapa, setMapa] = useState<MapaOdontograma>(() => {
    const todos = [
      ...ARCO_SUPERIOR_DER, ...ARCO_SUPERIOR_IZQ,
      ...ARCO_INFERIOR_IZQ, ...ARCO_INFERIOR_DER,
      ...DECIDUOS_SUP_DER, ...DECIDUOS_SUP_IZQ,
      ...DECIDUOS_INF_IZQ, ...DECIDUOS_INF_DER,
    ];
    const inicial: MapaOdontograma = {};
    todos.forEach(n => { inicial[n] = mapaInicial[n] ?? crearEstadoInicial(); });
    return inicial;
  });

  const [dienteSel, setDienteSel] = useState<number | null>(null);
  const [modoDeciduo, setModoDeciduo] = useState(false);
  const [historial, setHistorial] = useState<CambioHistorial[]>([]);
  const [showHistorial, setShowHistorial] = useState(false);

  const actualizarMapa = useCallback((nuevo: MapaOdontograma) => {
    setMapa(nuevo);
    onChange?.(nuevo);
  }, [onChange]);

  const handleCambiarGeneral = (est: EstadoDiente) => {
    if (!dienteSel) return;
    const anterior = mapa[dienteSel].general;
    const nuevo = { ...mapa, [dienteSel]: { ...mapa[dienteSel], general: est } };
    actualizarMapa(nuevo);
    setHistorial(h => [{
      diente: dienteSel, estadoAnterior: anterior, estadoNuevo: est,
      timestamp: new Date(), alumno: 'Rodrigo Martínez Ávalos'
    }, ...h].slice(0, 30));
  };

  const handleCambiarCara = (cara: CaraDiente, est: EstadoDiente) => {
    if (!dienteSel) return;
    const anterior = mapa[dienteSel].caras[cara] ?? 'sano';
    const nuevo = {
      ...mapa,
      [dienteSel]: {
        ...mapa[dienteSel],
        caras: { ...mapa[dienteSel].caras, [cara]: est }
      }
    };
    actualizarMapa(nuevo);
    setHistorial(h => [{
      diente: dienteSel, cara, estadoAnterior: anterior, estadoNuevo: est,
      timestamp: new Date(), alumno: 'Rodrigo Martínez Ávalos'
    }, ...h].slice(0, 30));
  };

  const handleAgregarNota = (nota: string) => {
    if (!dienteSel) return;
    actualizarMapa({ ...mapa, [dienteSel]: { ...mapa[dienteSel], nota } });
  };

  // Renderizar arco
  const renderArco = (dientes: number[], deciduos = false) => (
    <div className="flex items-end gap-0.5 justify-center flex-wrap">
      {dientes.map(n => (
        <DienteSVG
          key={n}
          numero={n}
          estado={mapa[n] ?? crearEstadoInicial()}
          seleccionado={dienteSel === n}
          deciduo={deciduos}
          onClick={() => !readOnly && setDienteSel(prev => prev === n ? null : n)}
        />
      ))}
    </div>
  );

  return (
    <div className="flex gap-0 h-full min-h-0">
      {/* Área principal del odontograma */}
      <div className="flex-1 min-w-0 p-4 overflow-auto">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Odontograma FDI</h2>
            <span className="text-[10px] px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-full">ISO 3950</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Toggle deciduos */}
            <button
              onClick={() => setModoDeciduo(p => !p)}
              className={cn(
                'text-xs font-medium px-3 py-1.5 rounded-xl transition-all',
                modoDeciduo
                  ? 'bg-pink-100 dark:bg-pink-950/30 text-pink-700 dark:text-pink-400'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              )}
            >
              🧒 {modoDeciduo ? 'Deciduos ON' : 'Deciduos'}
            </button>
            <button
              onClick={() => setShowHistorial(p => !p)}
              className={cn(
                'flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl transition-all',
                showHistorial
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
              )}
            >
              <History className="h-3.5 w-3.5" />
              Historial ({historial.length})
            </button>
          </div>
        </div>

        {/* Leyenda compacta */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {TODOS_ESTADOS.slice(0, 6).map(est => (
            <span key={est} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
              style={{ backgroundColor: COLORES_ESTADO[est].bg, border: `1px solid ${COLORES_ESTADO[est].border}` }}>
              {COLORES_ESTADO[est].emoji} {COLORES_ESTADO[est].label}
            </span>
          ))}
          <span className="text-[10px] text-zinc-400 px-1 self-center">+{TODOS_ESTADOS.length - 6} más</span>
        </div>

        {/* ARCO SUPERIOR */}
        <div className="mb-2">
          <div className="flex justify-between text-[10px] text-zinc-400 font-medium mb-1 px-4">
            <span>← Der. paciente</span>
            <span className="text-center text-zinc-500 font-bold">MAXILAR SUPERIOR</span>
            <span>Izq. paciente →</span>
          </div>
          {modoDeciduo && (
            <div className="mb-1">
              {renderArco([...DECIDUOS_SUP_DER, ...DECIDUOS_SUP_IZQ], true)}
            </div>
          )}
          {renderArco([...ARCO_SUPERIOR_DER, ...ARCO_SUPERIOR_IZQ])}
        </div>

        {/* Separador */}
        <div className="my-3 border-t border-dashed border-zinc-200 dark:border-zinc-800 relative">
          <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-50 dark:bg-zinc-950 px-2 text-[10px] text-zinc-400">línea media</span>
        </div>

        {/* ARCO INFERIOR */}
        <div className="mt-2">
          {renderArco([...ARCO_INFERIOR_IZQ, ...ARCO_INFERIOR_DER])}
          {modoDeciduo && (
            <div className="mt-1">
              {renderArco([...DECIDUOS_INF_IZQ, ...DECIDUOS_INF_DER], true)}
            </div>
          )}
          <div className="flex justify-between text-[10px] text-zinc-400 font-medium mt-1 px-4">
            <span>← Izq. paciente</span>
            <span className="text-zinc-500 font-bold">MANDÍBULA INFERIOR</span>
            <span>Der. paciente →</span>
          </div>
        </div>

        {/* Instrucción */}
        {!readOnly && !dienteSel && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-xs text-zinc-400 mt-4"
          >
            👆 Toca un diente para editar su estado
          </motion.p>
        )}

        {/* Historial */}
        <AnimatePresence>
          {showHistorial && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4">
                <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-3">
                  Historial de cambios ({historial.length})
                </p>
                {historial.length === 0 ? (
                  <p className="text-xs text-zinc-400">Sin cambios registrados aún.</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {historial.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-zinc-500 shrink-0">D{h.diente}{h.cara ? `·${h.cara}` : ''}</span>
                        <span className="text-zinc-400">{COLORES_ESTADO[h.estadoAnterior]?.emoji}→{COLORES_ESTADO[h.estadoNuevo]?.emoji}</span>
                        <span className="text-zinc-400 ml-auto shrink-0">{h.timestamp.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Panel lateral del diente seleccionado */}
      <AnimatePresence>
        {!readOnly && dienteSel && (
          <PanelDiente
            numero={dienteSel}
            estado={mapa[dienteSel]}
            onCambiarGeneral={handleCambiarGeneral}
            onCambiarCara={handleCambiarCara}
            onAgregarNota={handleAgregarNota}
            onClose={() => setDienteSel(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default OdontogramaFDI;
