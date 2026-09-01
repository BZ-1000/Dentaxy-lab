import React, { useState } from 'react';
import { FormDataState } from '@/types/historiaClinica';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface InterrogatorioSistemasProps {
  formData: FormDataState;
  handleInterrogatorioChange: (system: string, value: string) => void;
  onRedaccionGenerada?: (text: string) => void;
  onToggleViewMode?: () => void;
}

const SISTEMAS_CONFIG = [
  {
    id: 'digestivo', title: 'Aparato Digestivo',
    sintomas: ['Reflujo', 'Gastritis', 'Colitis', 'Úlcera', 'Disfagia', 'Estreñimiento', 'Náuseas/Vómito'],
    normal: 'Sin sintomatología digestiva reportada. Masticación y deglución normales.'
  },
  {
    id: 'respiratorio', title: 'Aparato Respiratorio',
    sintomas: ['Tos crónica', 'Asma', 'Disnea', 'Apnea del sueño', 'Sibilancias', 'Epistaxis'],
    normal: 'Sin sintomatología respiratoria. Respiración de tipo costal/abdominal normal.'
  },
  {
    id: 'cardiovascular', title: 'Aparato Cardiovascular',
    sintomas: ['Dolor torácico', 'Palpitaciones', 'Arritmias', 'Soplos', 'Hipertensión', 'Hipotensión'],
    normal: 'Sin sintomatología cardiovascular. Niega disnea, dolor torácico o palpitaciones.'
  },
  {
    id: 'genitoUrinario', title: 'Aparato Genitourinario',
    sintomas: ['Infecciones frecuentes', 'Disuria (Dolor al orinar)', 'Hematuria', 'Alteraciones menstruales', 'Embarazo'],
    normal: 'Sin sintomatología genitourinaria.'
  },
  {
    id: 'endocrino', title: 'Sistema Endocrino',
    sintomas: ['Pérdida de peso inexplicable', 'Intolerancia al frío/calor', 'Polidipsia', 'Poliuria', 'Alteración tiroidea'],
    normal: 'Sin sintomatología endocrina o alteraciones hormonales.'
  },
  {
    id: 'tegumentario', title: 'Sistema Tegumentario (Piel y anexos)',
    sintomas: ['Lesiones en piel', 'Cambios de coloración', 'Problemas de cicatrización', 'Erupciones/Urticaria'],
    normal: 'Piel y anexos normales, hidratados y sin lesiones evidentes.'
  },
  {
    id: 'musculoEsqueletico', title: 'Sistema Musculoesquelético',
    sintomas: ['Dolor articular', 'Limitación de movimiento', 'Artritis/Artrosis', 'Espasmos musculares', 'Fracturas recientes'],
    normal: 'Sistema musculoesquelético íntegro y funcional, sin limitaciones de movilidad.'
  },
  {
    id: 'nervioso', title: 'Sistema Nervioso',
    sintomas: ['Convulsiones', 'Mareos/Vértigo', 'Neuralgias', 'Insomnio', 'Temblores', 'Migrañas'],
    normal: 'Sistema nervioso íntegro, alerta y orientado en tres esferas.'
  }
];

type SystemState = {
  sinSintomas: boolean;
  sintomas: string[];
  otros: string;
};

// Word button component for symptom checkboxes
const WordButton = ({
  label,
  isSelected,
  onClick
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all mb-2 mr-2 ${isSelected ? "bg-zinc-800 text-white shadow-sm" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
    >
      {label}
    </button>
  );
};

const InterrogatorioSistemas: React.FC<InterrogatorioSistemasProps> = ({
  formData,
  handleInterrogatorioChange,
  onRedaccionGenerada,
  onToggleViewMode
}) => {
  const [localState, setLocalState] = useState<Record<string, SystemState>>(() => {
    const initialState: Record<string, SystemState> = {};
    SISTEMAS_CONFIG.forEach(sys => {
      initialState[sys.id] = { sinSintomas: true, sintomas: [], otros: "" };
    });
    return initialState;
  });

  const handleToggleSano = (sysId: string, value: boolean) => {
    setLocalState(prev => ({
      ...prev,
      [sysId]: {
        ...prev[sysId],
        sinSintomas: value,
        // Si lo marcamos como sano, limpiamos los síntomas
        ...(value ? { sintomas: [], otros: "" } : {})
      }
    }));
  };

  const handleToggleSintoma = (sysId: string, sintoma: string) => {
    setLocalState(prev => {
      const state = prev[sysId];
      const newSintomas = state.sintomas.includes(sintoma)
        ? state.sintomas.filter(s => s !== sintoma)
        : [...state.sintomas, sintoma];
      
      return {
        ...prev,
        [sysId]: {
          ...state,
          sinSintomas: false, // Si marca un síntoma, ya no está sano
          sintomas: newSintomas
        }
      };
    });
  };

  const handleOtrosChange = (sysId: string, value: string) => {
    setLocalState(prev => ({
      ...prev,
      [sysId]: {
        ...prev[sysId],
        sinSintomas: value.trim() === "" && prev[sysId].sintomas.length === 0,
        otros: value
      }
    }));
  };

  const limpiarFormulario = () => {
    const initialState: Record<string, SystemState> = {};
    SISTEMAS_CONFIG.forEach(sys => {
      initialState[sys.id] = { sinSintomas: true, sintomas: [], otros: "" };
      handleInterrogatorioChange(sys.id, sys.normal);
    });
    setLocalState(initialState);
  };

  const generarRedaccionIA = () => {
    let redaccionCompleta = '';

    SISTEMAS_CONFIG.forEach(sys => {
      const state = localState[sys.id];
      let text = '';
      if (state.sinSintomas) {
        text = sys.normal;
      } else {
        let parts = [];
        if (state.sintomas.length > 0) parts.push(`Refiere sintomatología caracterizada por: ${state.sintomas.join(', ')}`);
        if (state.otros) parts.push(`Observaciones: ${state.otros}`);
        text = parts.length > 0 ? parts.join('. ') + '.' : 'Sintomatología en estudio.';
      }
      
      handleInterrogatorioChange(sys.id, text);
      
      const titleHTML = `<span class="block text-xs font-semibold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 mt-4 mb-1">${sys.title}</span>`;
      redaccionCompleta += `\n${titleHTML}\n${text}\n`;
    });

    if (onRedaccionGenerada) {
      onRedaccionGenerada(redaccionCompleta.trim());
    }
    if (onToggleViewMode) {
      onToggleViewMode();
    }
  };

  return (
    <div className='bg-background dark:bg-background transition-colors duration-300' data-formulario-section="interrogatorio-sistemas">
      <div className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SISTEMAS_CONFIG.map((sys) => {
            const state = localState[sys.id];
            
            return (
              <div key={sys.id} className="bg-white dark:bg-gray-900/30 p-5 rounded-xl border border-gray-100 dark:border-gray-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">{sys.title}</h4>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-gray-500 cursor-pointer" htmlFor={`switch-${sys.id}`}>
                      {state.sinSintomas ? 'Sin síntomas' : 'Con alteraciones'}
                    </Label>
                    <Switch 
                      id={`switch-${sys.id}`} 
                      checked={!state.sinSintomas} 
                      onCheckedChange={(checked) => handleToggleSano(sys.id, !checked)} 
                      className={!state.sinSintomas ? "bg-red-500" : "bg-emerald-500"}
                    />
                  </div>
                </div>

                {!state.sinSintomas && (
                  <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Label className="mb-2 block">Síntomas Reportados:</Label>
                    <div className="flex flex-wrap">
                      {sys.sintomas.map(sintoma => (
                        <WordButton
                          key={sintoma}
                          label={sintoma}
                          isSelected={state.sintomas.includes(sintoma)}
                          onClick={() => handleToggleSintoma(sys.id, sintoma)}
                        />
                      ))}
                    </div>
                    
                    <div className="mt-3">
                      <Label>Otros Detalles / Especificaciones</Label>
                      <Textarea
                        placeholder="Describa otros síntomas o detalles de la alteración..."
                        value={state.otros}
                        onChange={(e) => handleOtrosChange(sys.id, e.target.value)}
                        className="w-full mt-1 bg-gray-50 dark:bg-gray-800/50"
                        rows={2}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Controls */}
        <div className="flex justify-end items-center gap-3 pt-6 mt-6 border-t border-gray-100 dark:border-gray-700/50">
          {onToggleViewMode && (
            <Button
              variant="outline"
              onClick={generarRedaccionIA}
              className="hidden data-trigger-generation text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Ver Redacción IA
            </Button>
          )}

        </div>
      </div>
    </div>
  );
};

export default InterrogatorioSistemas;
