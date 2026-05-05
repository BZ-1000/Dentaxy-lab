/**
 * ToothPanel.tsx — Mini panel flotante de selección de estado
 * Se abre al hacer clic en un diente del odontograma
 * Incluye: 12 estados ADA · Grado de caries · Superficies · Grado de movilidad
 */
import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import {
  ToothData, ToothState, TOOTH_COLORS, TOOTH_STATE_LABELS,
  stateRequiresSurface
} from '@/types/odontograma';
import { getToothName } from './toothPaths';

interface ToothPanelProps {
  tooth: ToothData;
  onApply: (
    state: ToothState,
    surfaces: Record<string, boolean>,
    mobility?: 1 | 2 | 3,
    cariesGrade?: 1 | 2 | 3 | 4
  ) => void;
  onClose: () => void;
}

// Todos los estados en orden clínico lógico
const AVAILABLE_STATES: ToothState[] = ['S', 'C', 'O', 'A', 'EI', 'CR', 'E', 'F', 'SE', 'MOV', 'IM', 'PU'];

// Superficies disponibles
const SURFACE_OPTIONS = [
  { key: 'V', label: 'V', title: 'Vestibular' },
  { key: 'M', label: 'M', title: 'Mesial' },
  { key: 'O', label: 'O', title: 'Oclusal' },
  { key: 'D', label: 'D', title: 'Distal' },
  { key: 'L', label: 'L', title: 'Lingual/Palatino' },
  { key: 'I', label: 'I', title: 'Incisal' },
];

// Grados de caries con descripción clínica
const CARIES_GRADES: { grade: 1 | 2 | 3 | 4; label: string; desc: string; color: string }[] = [
  { grade: 1, label: 'Grado I',   desc: 'Esmalte',          color: '#FFAB91' },
  { grade: 2, label: 'Grado II',  desc: 'Dentina sup.',     color: '#EF6C50' },
  { grade: 3, label: 'Grado III', desc: 'Dentina prof.',    color: '#E53935' },
  { grade: 4, label: 'Grado IV',  desc: 'Compromiso pulp.', color: '#B71C1C' },
];

export const ToothPanel: React.FC<ToothPanelProps> = ({ tooth, onApply, onClose }) => {
  const [selectedState, setSelectedState]     = useState<ToothState>(tooth.state);
  const [selectedSurfaces, setSelectedSurfaces] = useState<Record<string, boolean>>({});
  const [mobility, setMobility]               = useState<1 | 2 | 3>(tooth.mobility ?? 1);
  const [cariesGrade, setCariesGrade]         = useState<1 | 2 | 3 | 4>(tooth.cariesGrade ?? 1);
  const panelRef = useRef<HTMLDivElement>(null);

  // Inicializar superficies desde el diente
  useEffect(() => {
    const surfaces: Record<string, boolean> = {};
    Object.keys(tooth.surfaces).forEach(k => { surfaces[k] = true; });
    setSelectedSurfaces(surfaces);
  }, [tooth.id]);

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const toggleSurface = (key: string) => {
    setSelectedSurfaces(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleApply = () => {
    onApply(
      selectedState,
      selectedSurfaces,
      selectedState === 'MOV' ? mobility : undefined,
      selectedState === 'C'   ? cariesGrade : undefined
    );
    onClose();
  };

  const isDeciduous = tooth.id >= 51;

  return (
    <div
      ref={panelRef}
      className="fixed z-50 bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 w-72 select-none"
      style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      onClick={e => e.stopPropagation()}
    >
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
            {isDeciduous ? 'Deciduo · ' : ''}OD {tooth.id}
          </div>
          <div className="text-sm font-semibold text-gray-800 leading-tight">
            {getToothName(tooth.id)}
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ── Selector de Estado — grid 4 columnas ─────────────────────────── */}
      <div className="mb-3">
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">Estado clínico</p>
        <div className="grid grid-cols-4 gap-1.5">
          {AVAILABLE_STATES.map(state => {
            const isActive = selectedState === state;
            const color = TOOTH_COLORS[state];
            return (
              <button
                key={state}
                type="button"
                onClick={() => {
                  setSelectedState(state);
                  if (!stateRequiresSurface(state)) setSelectedSurfaces({});
                }}
                title={TOOTH_STATE_LABELS[state]}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all text-center border ${
                  isActive
                    ? 'bg-gray-50 border-gray-300 shadow-sm'
                    : 'border-transparent hover:bg-gray-50 hover:border-gray-200'
                }`}
                style={isActive ? { boxShadow: `0 0 0 2px ${color}40` } : {}}
              >
                <div
                  className="w-5 h-5 rounded-md border-2 flex-shrink-0"
                  style={{
                    backgroundColor: state === 'S' ? '#fff' : color,
                    borderColor: state === 'S' ? '#E8EBF0' : color,
                    opacity: 0.9,
                  }}
                />
                <span
                  className="text-[9px] font-bold leading-none"
                  style={{ color: isActive ? color : '#9CA3AF' }}
                >
                  {state}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Grado de Caries (solo si estado = C) ─────────────────────────── */}
      {selectedState === 'C' && (
        <div className="mb-3 border-t border-gray-100 pt-3">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">Grado de caries</p>
          <div className="grid grid-cols-4 gap-1.5">
            {CARIES_GRADES.map(({ grade, label, desc, color }) => (
              <button
                key={grade}
                type="button"
                onClick={() => setCariesGrade(grade)}
                title={desc}
                className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all border text-center"
                style={{
                  background: cariesGrade === grade ? `${color}18` : '#FAFAFA',
                  borderColor: cariesGrade === grade ? color : '#E5E7EB',
                  boxShadow: cariesGrade === grade ? `0 0 0 2px ${color}30` : 'none',
                }}
              >
                <div
                  className="w-5 h-5 rounded-md flex-shrink-0"
                  style={{ background: color }}
                />
                <span className="text-[9px] font-bold leading-none" style={{ color: cariesGrade === grade ? color : '#9CA3AF' }}>
                  {['I', 'II', 'III', 'IV'][grade - 1]}
                </span>
                <span className="text-[8px] leading-none text-gray-400">{desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Selector de Superficies (solo si C/O/SE) ─────────────────────── */}
      {stateRequiresSurface(selectedState) && (
        <div className="mb-3 border-t border-gray-100 pt-3">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">Superficies afectadas</p>
          <div className="flex gap-1.5 flex-wrap">
            {SURFACE_OPTIONS.map(({ key, label, title }) => {
              const isActive = !!selectedSurfaces[key];
              return (
                <button
                  key={key}
                  type="button"
                  title={title}
                  onClick={() => toggleSurface(key)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all border ${
                    isActive
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                      : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Grado de Movilidad (solo si MOV) ─────────────────────────────── */}
      {selectedState === 'MOV' && (
        <div className="mb-3 border-t border-gray-100 pt-3">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">Grado de movilidad</p>
          <div className="flex gap-2">
            {([1, 2, 3] as (1 | 2 | 3)[]).map(g => (
              <button
                key={g}
                type="button"
                onClick={() => setMobility(g)}
                className={`flex-1 h-9 rounded-xl text-xs font-bold transition-all border ${
                  mobility === g
                    ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-orange-300'
                }`}
              >
                {['I', 'II', 'III'][g - 1]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Botones Aplicar / Cancelar ────────────────────────────────────── */}
      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <button
          type="button"
          onClick={handleApply}
          className="flex-1 h-9 bg-zinc-900 text-white text-xs font-bold rounded-xl hover:bg-zinc-700 transition-colors"
        >
          Aplicar
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 h-9 bg-gray-100 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ToothPanel;
