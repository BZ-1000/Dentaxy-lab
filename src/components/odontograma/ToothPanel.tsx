/**
 * ToothPanel.tsx — v2 con Tabs
 * Panel flotante de selección de estado dental
 * Organizado en 4 tabs: Básicos · Tratamientos · Ortodoncia · Anomalías
 */
import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import {
  ToothData, ToothState, TOOTH_COLORS, TOOTH_STATE_LABELS, TOOTH_STATE_SHORT,
  stateRequiresSurface, STATE_GROUPS, RestorationType, CrownType,
} from '@/types/odontograma';
import { getToothName } from './toothPaths';

interface ToothPanelProps {
  tooth: ToothData;
  onApply: (
    state: ToothState,
    surfaces: Record<string, boolean>,
    mobility?: 1 | 2 | 3,
    cariesGrade?: 1 | 2 | 3 | 4,
    materialType?: RestorationType,
    crownType?: CrownType,
  ) => void;
  onClose: () => void;
}

type TabKey = 'basicos' | 'tratamientos' | 'ortodoncia' | 'anomalias';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'basicos',      label: 'Básicos' },
  { key: 'tratamientos', label: 'Tratamientos' },
  { key: 'ortodoncia',   label: 'Ortodoncia' },
  { key: 'anomalias',    label: 'Anomalías' },
];

const SURFACE_OPTIONS = [
  { key: 'V', title: 'Vestibular' },
  { key: 'M', title: 'Mesial' },
  { key: 'O', title: 'Oclusal' },
  { key: 'D', title: 'Distal' },
  { key: 'L', title: 'Lingual/Pal.' },
  { key: 'I', title: 'Incisal' },
];

const CARIES_GRADES: { grade: 1|2|3|4; label: string; desc: string; color: string }[] = [
  { grade: 1, label: 'GI',   desc: 'Esmalte',    color: '#FFAB91' },
  { grade: 2, label: 'GII',  desc: 'Dentina s.', color: '#EF6C50' },
  { grade: 3, label: 'GIII', desc: 'Dentina p.', color: '#E53935' },
  { grade: 4, label: 'GIV',  desc: 'Pulpar',     color: '#B71C1C' },
];

const MATERIAL_TYPES: { key: RestorationType; label: string; desc: string }[] = [
  { key: 'AM', label: 'AM', desc: 'Amalgama' },
  { key: 'R',  label: 'R',  desc: 'Resina' },
  { key: 'IV', label: 'IV', desc: 'Ionómero' },
  { key: 'IM', label: 'IM', desc: 'Incrust. Met.' },
  { key: 'IE', label: 'IE', desc: 'Incrust. Est.' },
];

const CROWN_TYPES: { key: CrownType; label: string; desc: string }[] = [
  { key: 'CC',  label: 'CC',  desc: 'Completa Met.' },
  { key: 'CF',  label: 'CF',  desc: 'Fenestrada' },
  { key: 'CMC', label: 'CMC', desc: 'Metal-Cerám.' },
  { key: 'CJ',  label: 'CJ',  desc: 'Jacket' },
  { key: 'CV',  label: 'CV',  desc: 'Veneer' },
  { key: 'CP',  label: 'CP',  desc: 'Parcial' },
];

export const ToothPanel: React.FC<ToothPanelProps> = ({ tooth, onApply, onClose }) => {
  const [activeTab, setActiveTab]           = useState<TabKey>('basicos');
  const [selectedState, setSelectedState]   = useState<ToothState>(tooth.state);
  const [selectedSurfaces, setSelectedSurfaces] = useState<Record<string, boolean>>({});
  const [mobility, setMobility]             = useState<1|2|3>(tooth.mobility ?? 1);
  const [cariesGrade, setCariesGrade]       = useState<1|2|3|4>(tooth.cariesGrade ?? 1);
  const [materialType, setMaterialType]     = useState<RestorationType>(tooth.materialType ?? 'R');
  const [crownType, setCrownType]           = useState<CrownType>(tooth.crownType ?? 'CMC');

  useEffect(() => {
    const s: Record<string, boolean> = {};
    Object.keys(tooth.surfaces).forEach(k => { if ((tooth.surfaces as any)[k]) s[k] = true; });
    setSelectedSurfaces(s);
  }, [tooth.id]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Cambiar de tab automáticamente según el estado seleccionado
  const handleSelectState = (state: ToothState) => {
    setSelectedState(state);
    if (!stateRequiresSurface(state)) setSelectedSurfaces({});
  };

  const handleApply = () => {
    onApply(
      selectedState,
      selectedSurfaces,
      selectedState === 'MOV' ? mobility : undefined,
      selectedState === 'C' ? cariesGrade : undefined,
      (selectedState === 'O' || selectedState === 'RT' || selectedState === 'OF') ? materialType : undefined,
      selectedState === 'CR' ? crownType : undefined,
    );
    onClose();
  };

  const isDeciduous = tooth.id >= 51;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/10" onClick={onClose} />
      <div
        className="fixed z-50 bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 w-80 select-none"
        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
              {isDeciduous ? 'Deciduo · ' : ''}OD {tooth.id}
            </div>
            <div className="text-sm font-semibold text-gray-800 leading-tight">
              {getToothName(tooth.id)}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Estado actual */}
        {selectedState !== 'S' && (
          <div
            className="mb-3 px-2 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5"
            style={{ background: `${TOOTH_COLORS[selectedState]}15`, color: TOOTH_COLORS[selectedState] }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: TOOTH_COLORS[selectedState], display: 'inline-block' }} />
            {TOOTH_STATE_LABELS[selectedState]}
          </div>
        )}

        {/* Tabs */}
        <div className="flex rounded-xl border border-gray-100 bg-gray-50 p-0.5 gap-0.5 mb-3">
          {TABS.map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-1 rounded-lg text-[9px] font-bold transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-zinc-900 shadow-sm border border-gray-200'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid de estados según tab activo */}
        <div className="grid grid-cols-4 gap-1.5 mb-3">
          {STATE_GROUPS[activeTab].map(state => {
            const isActive = selectedState === state;
            const color = TOOTH_COLORS[state];
            return (
              <button
                key={state}
                type="button"
                onClick={() => handleSelectState(state)}
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
                    backgroundColor: state === 'S' ? '#fff' : `${color}30`,
                    borderColor: state === 'S' ? '#E8EBF0' : color,
                  }}
                />
                <span className="text-[8px] font-bold leading-none" style={{ color: isActive ? color : '#9CA3AF' }}>
                  {TOOTH_STATE_SHORT[state]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grado de caries */}
        {selectedState === 'C' && (
          <div className="mb-3 border-t border-gray-100 pt-3">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">Grado de caries</p>
            <div className="grid grid-cols-4 gap-1.5">
              {CARIES_GRADES.map(({ grade, label, desc, color }) => (
                <button
                  key={grade} type="button"
                  onClick={() => setCariesGrade(grade)}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all border text-center"
                  style={{
                    background: cariesGrade === grade ? `${color}18` : '#FAFAFA',
                    borderColor: cariesGrade === grade ? color : '#E5E7EB',
                  }}
                >
                  <div className="w-5 h-5 rounded-md flex-shrink-0" style={{ background: color }} />
                  <span className="text-[8px] font-bold" style={{ color: cariesGrade === grade ? color : '#9CA3AF' }}>{label}</span>
                  <span className="text-[7px] text-gray-400 leading-none">{desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tipo de material — O, RT y OF (Obturación Filtrada) */}
        {(selectedState === 'O' || selectedState === 'RT' || selectedState === 'OF') && (
          <div className="mb-3 border-t border-gray-100 pt-3">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              {selectedState === 'OF' ? 'Material de la restauración filtrada' : 'Material restaurador'}
            </p>
            <div className="grid grid-cols-5 gap-1">
              {MATERIAL_TYPES.map(({ key, label, desc }) => (
                <button
                  key={key} type="button"
                  onClick={() => setMaterialType(key)}
                  title={desc}
                  className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg border transition-all text-center ${
                    materialType === key
                      ? 'bg-blue-50 border-blue-400 text-blue-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <span className="text-[9px] font-bold">{label}</span>
                  <span className="text-[7px] leading-none text-gray-400">{desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tipo de corona — solo CR */}
        {selectedState === 'CR' && (
          <div className="mb-3 border-t border-gray-100 pt-3">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">Tipo de corona</p>
            <div className="grid grid-cols-3 gap-1.5">
              {CROWN_TYPES.map(({ key, label, desc }) => (
                <button
                  key={key} type="button"
                  onClick={() => setCrownType(key)}
                  title={desc}
                  className={`flex flex-col items-center gap-0.5 p-2 rounded-xl border transition-all text-center ${
                    crownType === key
                      ? 'bg-orange-50 border-orange-400 text-orange-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <span className="text-[10px] font-bold">{label}</span>
                  <span className="text-[7px] leading-none text-gray-400">{desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Superficies — C, O, SE, RT */}
        {stateRequiresSurface(selectedState) && (
          <div className="mb-3 border-t border-gray-100 pt-3">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">Superficies afectadas</p>
            <div className="flex gap-1.5 flex-wrap">
              {SURFACE_OPTIONS.map(({ key, title }) => {
                const isActive = !!selectedSurfaces[key];
                return (
                  <button
                    key={key} type="button" title={title}
                    onClick={() => setSelectedSurfaces(prev => ({ ...prev, [key]: !prev[key] }))}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all border ${
                      isActive
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                        : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {key}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Movilidad — solo MOV */}
        {selectedState === 'MOV' && (
          <div className="mb-3 border-t border-gray-100 pt-3">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">Grado de movilidad</p>
            <div className="flex gap-2">
              {([1, 2, 3] as (1|2|3)[]).map(g => (
                <button
                  key={g} type="button"
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

        {/* Botones */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <button
            type="button" onClick={handleApply}
            className="flex-1 h-9 bg-zinc-900 text-white text-xs font-bold rounded-xl hover:bg-zinc-700 transition-colors"
          >
            Aplicar
          </button>
          <button
            type="button" onClick={onClose}
            className="flex-1 h-9 bg-gray-100 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </>
  );
};

export default ToothPanel;
