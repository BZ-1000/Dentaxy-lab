import React, { useEffect } from 'react';
import { FormDataState, GanglioLinfatico } from '@/types/historiaClinica';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VoiceInput } from "@/components/ui/voice-input";

interface ExamenCuelloProps {
  formData: FormDataState;
  handleExamenCuelloChange: (part: string, value: string | boolean | GanglioLinfatico) => void;
  onRedaccionGenerada?: (text: string) => void;
}

const SECTIONS = [
  { key: 'cervicales', label: '1. Ganglios Cervicales' },
  { key: 'submaxilares', label: '2. Ganglios Submaxilares' },
  { key: 'submentonianos', label: '3. Ganglios Submentonianos' },
  { key: 'parotideos', label: '4. Ganglios Parotídeos' },
  { key: 'preauriculares', label: '5. Ganglios Preauriculares' },
  { key: 'auricularesPosteriores', label: '6. Ganglios Auriculares Posteriores' }
];

const Btn = ({
  active,
  label,
  onClick
}: {
  active: boolean;
  label: string;
  onClick: (e: React.MouseEvent) => void;
}) => (
  <button
    type="button"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick(e);
    }}
    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
      active
        ? 'bg-zinc-800 text-white shadow-sm'
        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-400'
    }`}
  >
    {label}
  </button>
);

const ExamenCuello: React.FC<ExamenCuelloProps> = ({
  formData,
  handleExamenCuelloChange,
  onRedaccionGenerada
}) => {
  const getGanglio = (tipo: string) => (formData?.examenCuello?.[tipo] as GanglioLinfatico) || {};

  const setGanglio = (tipo: string, field: string, value: string) => {
    const actual = getGanglio(tipo);
    const nuevo = { ...actual, [field]: value };
    // Si se marca "no_palpan", limpiar el resto
    if (field === 'palpacion' && value === 'no_palpan') {
      nuevo.consistencia = '';
      nuevo.dolor = '';
      nuevo.movilidad = '';
      nuevo.localizacion = '';
      nuevo.tamano = '';
      nuevo.observaciones = '';
    }
    handleExamenCuelloChange(tipo, nuevo);
  };

  const handleVoice = (tipo: string, field: string) => (text: string) => {
    const current = getGanglio(tipo)[field as keyof GanglioLinfatico] || '';
    setGanglio(tipo, field, current ? `${current} ${text}` : text);
  };

  // Motor determinista silencioso
  useEffect(() => {
    let parts: string[] = [];
    
    SECTIONS.forEach(({ key, label }) => {
      const g = getGanglio(key);
      const nombre = label.split('. ')[1].toLowerCase();

      if (!g.palpacion || g.palpacion === 'no_palpan') {
        parts.push(`No se palpan ${nombre}.`);
      } else if (g.palpacion === 'se_palpan') {
        let text = `Se palpan ${nombre}`;
        if (g.localizacion === 'bilaterales') text += ' bilaterales';
        if (g.localizacion === 'unilaterales') text += ' unilaterales';
        if (g.consistencia === 'firme') text += ', de consistencia firme';
        if (g.consistencia === 'blanda') text += ', de consistencia blanda';
        if (g.dolor === 'no_dolorosos') text += ', no dolorosos';
        if (g.dolor === 'dolorosos') text += ', dolorosos';
        if (g.movilidad === 'moviles') text += ', móviles';
        if (g.movilidad === 'fijos') text += ', fijos';
        if (g.tamano) text += `, de aprox. ${g.tamano}`;
        text += '.';
        if (g.observaciones) text += ` ${g.observaciones}`;
        parts.push(text);
      }
    });

    onRedaccionGenerada?.(parts.join(' '));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.examenCuello]);

  return (
    <div className="max-w-4xl mx-auto" data-formulario-section="examen-cuello">
      <div className="p-6 space-y-10">
        {SECTIONS.map(({ key, label }) => {
          const g = getGanglio(key);
          const sePalpan = g.palpacion === 'se_palpan';

          return (
            <div key={key} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{label}</h3>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600 mb-1 block">Palpación</Label>
                <div className="flex gap-3">
                  <Btn active={g.palpacion === 'no_palpan'} label="No se palpan" onClick={() => setGanglio(key, 'palpacion', 'no_palpan')} />
                  <Btn active={g.palpacion === 'se_palpan'} label="Se palpan" onClick={() => setGanglio(key, 'palpacion', 'se_palpan')} />
                </div>
              </div>

              {sePalpan && (
                <div className="pl-6 border-l-2 border-gray-100 space-y-5 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-600">Localización</Label>
                      <div className="flex gap-2">
                        <Btn active={g.localizacion === 'unilaterales'} label="Unilaterales" onClick={() => setGanglio(key, 'localizacion', 'unilaterales')} />
                        <Btn active={g.localizacion === 'bilaterales'} label="Bilaterales" onClick={() => setGanglio(key, 'localizacion', 'bilaterales')} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm text-gray-600">Consistencia</Label>
                      <div className="flex gap-2">
                        <Btn active={g.consistencia === 'blanda'} label="Blanda" onClick={() => setGanglio(key, 'consistencia', 'blanda')} />
                        <Btn active={g.consistencia === 'firme'} label="Firme" onClick={() => setGanglio(key, 'consistencia', 'firme')} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm text-gray-600">Dolor</Label>
                      <div className="flex gap-2">
                        <Btn active={g.dolor === 'no_dolorosos'} label="No dolorosos" onClick={() => setGanglio(key, 'dolor', 'no_dolorosos')} />
                        <Btn active={g.dolor === 'dolorosos'} label="Dolorosos" onClick={() => setGanglio(key, 'dolor', 'dolorosos')} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm text-gray-600">Movilidad</Label>
                      <div className="flex gap-2">
                        <Btn active={g.movilidad === 'moviles'} label="Móviles" onClick={() => setGanglio(key, 'movilidad', 'moviles')} />
                        <Btn active={g.movilidad === 'fijos'} label="Fijos" onClick={() => setGanglio(key, 'movilidad', 'fijos')} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">Tamaño aproximado</Label>
                    <div className="flex gap-2 max-w-sm">
                      <Input
                        type="text"
                        value={g.tamano || ''}
                        onChange={(e) => setGanglio(key, 'tamano', e.target.value)}
                        placeholder="Ej: 8 mm, 1 cm"
                        className="bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">Observaciones</Label>
                    <div className="flex gap-2">
                      <Textarea
                        value={g.observaciones || ''}
                        onChange={(e) => setGanglio(key, 'observaciones', e.target.value)}
                        placeholder="Observaciones adicionales..."
                        className="min-h-[60px] bg-white flex-1"
                      />
                      <VoiceInput onTranscriptionComplete={handleVoice(key, 'observaciones')} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExamenCuello;
