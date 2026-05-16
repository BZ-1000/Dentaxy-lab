/**
 * VoiceSelectorModal.tsx
 * Modal premium para elegir voz del asistente clínico.
 * Lista todas las voces del navegador/SO — 100% offline.
 * Sustituye al modal anterior de "Asistente Clínico DentaXy".
 */
import React, { useState } from 'react';
import { Mic, Volume2, Check, X } from 'lucide-react';
import { useVoiceSelector } from '@/hooks/useVoiceSelector';

interface VoiceSelectorModalProps {
  onConfirm: (voiceURI: string) => void;
  onCancel: () => void;
}

export const VoiceSelectorModal: React.FC<VoiceSelectorModalProps> = ({ onConfirm, onCancel }) => {
  const { voices, selectedVoiceURI, selectVoice, testVoice } = useVoiceSelector();
  const [testingURI, setTestingURI] = useState<string | null>(null);

  const spanishVoices = voices.filter(v => v.isSpanish);
  const otherVoices   = voices.filter(v => !v.isSpanish);

  const handleTest = (voiceURI: string) => {
    setTestingURI(voiceURI);
    testVoice(voiceURI);
    setTimeout(() => setTestingURI(null), 3000);
  };

  const handleConfirm = () => {
    onConfirm(selectedVoiceURI);
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm pointer-events-auto border border-gray-100 overflow-hidden">

          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <Mic className="w-4 h-4 text-indigo-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-800">Asistente de Voz DentaXy</h3>
              </div>
              <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1 ml-10">
              Seleccione la voz del asistente. Funciona sin internet.
            </p>
          </div>

          {/* Lista de voces */}
          <div className="px-4 py-3 max-h-72 overflow-y-auto">
            {voices.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">
                Cargando voces del sistema…
              </p>
            )}

            {spanishVoices.length > 0 && (
              <>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                  🇲🇽 Voces en Español
                </p>
                {spanishVoices.map(voice => (
                  <VoiceRow
                    key={voice.voiceURI}
                    voice={voice}
                    isSelected={selectedVoiceURI === voice.voiceURI}
                    isTesting={testingURI === voice.voiceURI}
                    onSelect={() => selectVoice(voice.voiceURI)}
                    onTest={() => handleTest(voice.voiceURI)}
                  />
                ))}
              </>
            )}

            {otherVoices.length > 0 && (
              <>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 mt-3 px-1">
                  Otras voces
                </p>
                {otherVoices.map(voice => (
                  <VoiceRow
                    key={voice.voiceURI}
                    voice={voice}
                    isSelected={selectedVoiceURI === voice.voiceURI}
                    isTesting={testingURI === voice.voiceURI}
                    onSelect={() => selectVoice(voice.voiceURI)}
                    onTest={() => handleTest(voice.voiceURI)}
                  />
                ))}
              </>
            )}
          </div>

          {/* Instrucciones */}
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
            <ul className="text-[10px] text-gray-500 space-y-1">
              <li>1. Diga el número del diente y el estado: <i>"OD 46 caries grado 2 mesial"</i></li>
              <li>2. Espere 2 segundos en silencio — el sistema confirma automáticamente</li>
              <li>3. Puede dictar varios dientes seguidos sin pausar</li>
            </ul>
          </div>

          {/* Botones */}
          <div className="px-5 pb-5 pt-3 flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selectedVoiceURI}
              className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-xl shadow-md hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              Iniciar Asistente →
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Fila de voz
// ─────────────────────────────────────────────────────────────────────────────
interface VoiceRowProps {
  voice: { name: string; lang: string; voiceURI: string };
  isSelected: boolean;
  isTesting: boolean;
  onSelect: () => void;
  onTest: () => void;
}

const VoiceRow: React.FC<VoiceRowProps> = ({ voice, isSelected, isTesting, onSelect, onTest }) => (
  <div
    className={`flex items-center justify-between px-3 py-2 rounded-xl mb-1 cursor-pointer transition-all ${
      isSelected ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-gray-50 border border-transparent'
    }`}
    onClick={onSelect}
  >
    <div className="flex items-center gap-2 min-w-0">
      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
        isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
      }`}>
        {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-800 truncate">{voice.name}</p>
        <p className="text-[9px] text-gray-400">{voice.lang}</p>
      </div>
    </div>
    <button
      type="button"
      onClick={e => { e.stopPropagation(); onTest(); }}
      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-bold transition-all flex-shrink-0 ${
        isTesting
          ? 'bg-emerald-100 text-emerald-700 animate-pulse'
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      }`}
    >
      <Volume2 className="w-3 h-3" />
      {isTesting ? 'Probando…' : 'Probar'}
    </button>
  </div>
);

export default VoiceSelectorModal;
