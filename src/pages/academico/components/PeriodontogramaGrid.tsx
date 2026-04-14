/**
 * PeriodontogramaGrid.tsx — Fase 2E
 * Periodontograma completo: 32 dientes × 6 puntos = 192 campos
 * Diagnóstico automático AAP 2017 | Gráfica de sondaje | Sangrado/Supuración
 */

import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────────────────────

export type PuntoSondaje = 'MB' | 'B' | 'DB' | 'ML' | 'L' | 'DL';

interface DientePeriograma {
  sondaje: Record<PuntoSondaje, number>;
  sangrado: Record<PuntoSondaje, boolean>;
  supuracion: Record<PuntoSondaje, boolean>;
  movilidad: 0 | 1 | 2 | 3;
  furca: 0 | 1 | 2 | 3;
  placa: boolean;
  ausente: boolean;
}

export type MapaPeriograma = Record<number, DientePeriograma>;

const DIENTES_ORDEN = [
  18, 17, 16, 15, 14, 13, 12, 11,
  21, 22, 23, 24, 25, 26, 27, 28,
  31, 32, 33, 34, 35, 36, 37, 38,
  48, 47, 46, 45, 44, 43, 42, 41,
];

const PUNTOS: PuntoSondaje[] = ['MB', 'B', 'DB', 'ML', 'L', 'DL'];
const PUNTOS_LABEL: Record<PuntoSondaje, string> = { MB: 'MV', B: 'V', DB: 'DV', ML: 'ML', L: 'L', DL: 'DL' };

// ─────────────────────────────────────────────────────────────────────────────
// DATOS DEMO PRE-CARGADOS
// ─────────────────────────────────────────────────────────────────────────────

const crearDienteVacio = (): DientePeriograma => ({
  sondaje: { MB: 0, B: 0, DB: 0, ML: 0, L: 0, DL: 0 },
  sangrado: { MB: false, B: false, DB: false, ML: false, L: false, DL: false },
  supuracion: { MB: false, B: false, DB: false, ML: false, L: false, DL: false },
  movilidad: 0,
  furca: 0,
  placa: false,
  ausente: false,
});

const crearMapaDemo = (): MapaPeriograma => {
  const mapa: MapaPeriograma = {};
  DIENTES_ORDEN.forEach(n => {
    mapa[n] = crearDienteVacio();
  });
  // Algunos datos demo para dientes con enfermedad
  const datos: Partial<Record<number, Partial<DientePeriograma>>> = {
    16: { sondaje: { MB: 5, B: 4, DB: 5, ML: 6, L: 7, DL: 6 }, sangrado: { MB: true, B: true, DB: false, ML: true, L: true, DL: true }, furca: 2 },
    17: { sondaje: { MB: 6, B: 5, DB: 6, ML: 7, L: 7, DL: 8 }, sangrado: { MB: true, B: true, DB: true, ML: true, L: true, DL: true }, furca: 3, movilidad: 1 },
    26: { sondaje: { MB: 5, B: 4, DB: 4, ML: 6, L: 5, DL: 5 }, sangrado: { MB: true, B: false, DB: false, ML: true, L: true, DL: false }, furca: 1 },
    36: { sondaje: { MB: 4, B: 3, DB: 4, ML: 5, L: 5, DL: 4 }, sangrado: { MB: true, B: false, DB: false, ML: true, L: false, DL: false } },
    11: { sondaje: { MB: 2, B: 2, DB: 2, ML: 2, L: 2, DL: 2 } },
    21: { sondaje: { MB: 2, B: 2, DB: 2, ML: 2, L: 2, DL: 2 } },
    12: { sondaje: { MB: 3, B: 2, DB: 3, ML: 2, L: 2, DL: 2 } },
    22: { sondaje: { MB: 3, B: 2, DB: 3, ML: 2, L: 2, DL: 2 } },
  };
  Object.entries(datos).forEach(([num, d]) => {
    const n = parseInt(num);
    if (mapa[n]) {
      mapa[n] = {
        ...mapa[n],
        ...d,
        sondaje: { ...mapa[n].sondaje, ...(d.sondaje ?? {}) },
        sangrado: { ...mapa[n].sangrado, ...(d.sangrado ?? {}) },
      };
    }
  });
  return mapa;
};

// ─────────────────────────────────────────────────────────────────────────────
// DIAGNÓSTICO AAP 2017
// ─────────────────────────────────────────────────────────────────────────────

const calcularDiagnosticoAAP = (mapa: MapaPeriograma) => {
  let totalSitios = 0;
  let sitioss4 = 0;
  let sitiosSangrado = 0;
  let maxSondaje = 0;

  DIENTES_ORDEN.forEach(n => {
    const d = mapa[n];
    if (d.ausente) return;
    PUNTOS.forEach(p => {
      totalSitios++;
      const s = d.sondaje[p];
      if (s > maxSondaje) maxSondaje = s;
      if (s >= 4) sitioss4++;
      if (d.sangrado[p]) sitiosSangrado++;
    });
  });

  const pctS4 = totalSitios > 0 ? (sitioss4 / totalSitios) * 100 : 0;
  const pctSangrado = totalSitios > 0 ? (sitiosSangrado / totalSitios) * 100 : 0;

  let diagnostico = 'Salud periodontal';
  let color = 'emerald';
  let estadio = '';

  if (pctSangrado > 10 && pctS4 < 10) {
    diagnostico = 'Gingivitis generalizada';
    color = 'amber';
  } else if (pctS4 > 10 && maxSondaje <= 4) {
    diagnostico = 'Periodontitis Estadio I';
    color = 'orange';
    estadio = 'Grado A';
  } else if (pctS4 > 20 && maxSondaje <= 6) {
    diagnostico = 'Periodontitis Estadio II';
    color = 'orange';
    estadio = 'Grado B';
  } else if (pctS4 > 30 || maxSondaje >= 7) {
    diagnostico = 'Periodontitis Estadio III–IV';
    color = 'red';
    estadio = 'Grado B–C';
  }

  return { diagnostico, color, estadio, pctSangrado: pctSangrado.toFixed(1), pctS4: pctS4.toFixed(1), maxSondaje };
};

// ─────────────────────────────────────────────────────────────────────────────
// CELDA DE SONDAJE
// ─────────────────────────────────────────────────────────────────────────────

interface CeldaSondajeProps {
  valor: number;
  sangrado: boolean;
  readOnly: boolean;
  onChange: (v: number) => void;
  onToggleSangrado: () => void;
}

const CeldaSondaje: React.FC<CeldaSondajeProps> = ({ valor, sangrado, readOnly, onChange, onToggleSangrado }) => {
  const getColor = (v: number) => {
    if (v === 0) return 'text-zinc-400';
    if (v <= 3) return 'text-emerald-600 dark:text-emerald-400';
    if (v <= 5) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getBg = (v: number) => {
    if (v === 0) return '';
    if (v <= 3) return 'bg-emerald-50 dark:bg-emerald-950/20';
    if (v <= 5) return 'bg-amber-50 dark:bg-amber-950/20';
    return 'bg-red-50 dark:bg-red-950/20';
  };

  return (
    <div className="flex flex-col items-center gap-0.5">
      <input
        type="number"
        min={0}
        max={12}
        value={valor || ''}
        readOnly={readOnly}
        onChange={e => onChange(parseInt(e.target.value) || 0)}
        className={cn(
          'w-8 h-7 text-center text-xs font-bold rounded border focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white transition-colors',
          getBg(valor), getColor(valor),
          'border-zinc-200 dark:border-zinc-700',
          readOnly ? 'cursor-default' : 'cursor-text'
        )}
      />
      {/* Dot de sangrado */}
      <button
        onClick={readOnly ? undefined : onToggleSangrado}
        title={sangrado ? 'Sangrado sí' : 'Sin sangrado'}
        className={cn(
          'w-3 h-3 rounded-full border transition-colors',
          sangrado ? 'bg-red-500 border-red-500' : 'bg-transparent border-zinc-300 dark:border-zinc-700',
          readOnly ? 'cursor-default' : 'cursor-pointer'
        )}
      />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BARRA DE SONDAJE VISUAL
// ─────────────────────────────────────────────────────────────────────────────

const BarraSondaje: React.FC<{ diente: DientePeriograma; numero: number }> = ({ diente, numero }) => {
  const maxBar = 10;
  const getBarColor = (v: number) => v <= 3 ? '#10B981' : v <= 5 ? '#F59E0B' : '#EF4444';

  return (
    <div className="flex flex-col items-center">
      <span className="text-[9px] text-zinc-400 mb-0.5">{numero}</span>
      <div className="flex gap-px items-end" style={{ height: 32 }}>
        {PUNTOS.map(p => {
          const v = diente.sondaje[p];
          const h = v > 0 ? Math.max(2, (v / maxBar) * 32) : 2;
          return (
            <div
              key={p}
              style={{
                width: 4,
                height: h,
                backgroundColor: v > 0 ? getBarColor(v) : '#E5E7EB',
                borderRadius: 1,
              }}
              title={`${PUNTOS_LABEL[p]}: ${v}mm`}
            />
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PERIODONTOGRAMA PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

interface PeriodontogramaGridProps {
  readOnly?: boolean;
  onChange?: (mapa: MapaPeriograma) => void;
}

const PeriodontogramaGrid: React.FC<PeriodontogramaGridProps> = ({ readOnly = false, onChange }) => {
  const [mapa, setMapa] = useState<MapaPeriograma>(crearMapaDemo);
  const [arco, setArco] = useState<'superior' | 'inferior'>('superior');

  const dientesVista = arco === 'superior'
    ? [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28]
    : [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

  const actualizarSondaje = useCallback((num: number, punto: PuntoSondaje, val: number) => {
    setMapa(prev => {
      const nuevo = { ...prev, [num]: { ...prev[num], sondaje: { ...prev[num].sondaje, [punto]: val } } };
      onChange?.(nuevo);
      return nuevo;
    });
  }, [onChange]);

  const toggleSangrado = useCallback((num: number, punto: PuntoSondaje) => {
    setMapa(prev => {
      const nuevo = { ...prev, [num]: { ...prev[num], sangrado: { ...prev[num].sangrado, [punto]: !prev[num].sangrado[punto] } } };
      onChange?.(nuevo);
      return nuevo;
    });
  }, [onChange]);

  const diagnostico = useMemo(() => calcularDiagnosticoAAP(mapa), [mapa]);

  const colorDxMap: Record<string, string> = {
    emerald: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    amber: 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    orange: 'bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    red: 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
  };

  return (
    <div className="p-4 space-y-4">
      {/* Diagnóstico AAP */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('rounded-2xl border p-4', colorDxMap[diagnostico.color] ?? colorDxMap.emerald)}
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-0.5">Diagnóstico AAP 2017 (automático)</p>
            <p className="text-lg font-bold">{diagnostico.diagnostico}</p>
            {diagnostico.estadio && <p className="text-xs opacity-80">{diagnostico.estadio}</p>}
          </div>
          <div className="flex gap-4 text-right">
            <div>
              <p className="text-2xl font-bold">{diagnostico.pctSangrado}%</p>
              <p className="text-[10px] opacity-70">Sangrado al sondaje</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{diagnostico.maxSondaje}mm</p>
              <p className="text-[10px] opacity-70">Máx. profundidad</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{diagnostico.pctS4}%</p>
              <p className="text-[10px] opacity-70">Sitios ≥4mm</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Gráfica visual de sondaje */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Gráfica de profundidad de sondaje</p>
          <div className="flex gap-2">
            {(['superior', 'inferior'] as const).map(a => (
              <button
                key={a}
                onClick={() => setArco(a)}
                className={cn(
                  'text-xs px-3 py-1 rounded-lg font-medium transition-all',
                  arco === a
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                )}
              >
                {a === 'superior' ? '↑ Superior' : '↓ Inferior'}
              </button>
            ))}
          </div>
        </div>

        {/* Barras */}
        <div className="flex gap-1 items-end overflow-x-auto pb-1">
          {dientesVista.map(n => (
            <BarraSondaje key={n} diente={mapa[n]} numero={n} />
          ))}
        </div>

        {/* Leyenda */}
        <div className="flex gap-3 mt-2">
          {[['≤3mm', 'bg-emerald-500'], ['4–5mm', 'bg-amber-500'], ['≥6mm', 'bg-red-500']].map(([l, c]) => (
            <div key={l} className="flex items-center gap-1.5">
              <div className={`w-3 h-2 rounded-sm ${c}`} />
              <span className="text-[10px] text-zinc-400">{l}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 ml-auto">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-[10px] text-zinc-400">● Sangrado</span>
          </div>
        </div>
      </div>

      {/* Tabla de sondaje por arco */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 overflow-x-auto">
        <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-3">
          Sondaje detallado — {arco === 'superior' ? 'Maxilar Superior' : 'Mandíbula Inferior'}
        </p>

        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-[10px] text-zinc-400 font-medium text-left py-1 w-8">D</th>
              {PUNTOS.map(p => (
                <th key={p} className="text-[10px] text-zinc-400 font-medium text-center py-1 w-10">
                  {PUNTOS_LABEL[p]}
                </th>
              ))}
              <th className="text-[10px] text-zinc-400 font-medium text-center py-1 w-10">Mov.</th>
              <th className="text-[10px] text-zinc-400 font-medium text-center py-1 w-10">Furc.</th>
            </tr>
          </thead>
          <tbody>
            {dientesVista.map(num => {
              const d = mapa[num];
              return (
                <tr key={num} className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="py-0.5">
                    <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400">{num}</span>
                  </td>
                  {PUNTOS.map(p => (
                    <td key={p} className="py-0.5 text-center">
                      <CeldaSondaje
                        valor={d.sondaje[p]}
                        sangrado={d.sangrado[p]}
                        readOnly={readOnly}
                        onChange={v => actualizarSondaje(num, p, v)}
                        onToggleSangrado={() => toggleSangrado(num, p)}
                      />
                    </td>
                  ))}
                  <td className="py-0.5 text-center">
                    <select
                      value={d.movilidad}
                      disabled={readOnly}
                      onChange={e => setMapa(prev => ({ ...prev, [num]: { ...prev[num], movilidad: parseInt(e.target.value) as 0 | 1 | 2 | 3 } }))}
                      className="w-9 text-xs text-center bg-transparent border border-zinc-200 dark:border-zinc-700 rounded px-0.5 py-0.5 focus:outline-none"
                    >
                      {[0, 1, 2, 3].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </td>
                  <td className="py-0.5 text-center">
                    <select
                      value={d.furca}
                      disabled={readOnly}
                      onChange={e => setMapa(prev => ({ ...prev, [num]: { ...prev[num], furca: parseInt(e.target.value) as 0 | 1 | 2 | 3 } }))}
                      className="w-9 text-xs text-center bg-transparent border border-zinc-200 dark:border-zinc-700 rounded px-0.5 py-0.5 focus:outline-none"
                    >
                      {[0, 1, 2, 3].map(v => <option key={v} value={v}>{v === 0 ? '—' : `F${v}`}</option>)}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <p className="text-[10px] text-zinc-400 mt-2 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
          Dot rojo = sangrado al sondaje · Ingresar 0 = no sondado
        </p>
      </div>
    </div>
  );
};

export default PeriodontogramaGrid;
