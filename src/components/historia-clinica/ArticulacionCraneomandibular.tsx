
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { VoiceInput } from "@/components/ui/voice-input";
import { Card } from "@/components/ui/card";
import { FormDataState } from '@/types/historiaClinica';

interface ArticulacionCraneomandibularProps {
  formData: FormDataState;
  handleArticulacionCraneomandibularChange: (part: string, value: string | boolean) => void;
}

const ArticulacionCraneomandibular = ({ 
  formData, 
  handleArticulacionCraneomandibularChange 
}: ArticulacionCraneomandibularProps) => {
  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0">
      <div className="flex justify-start px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span className="text-gray-400">IX.</span> ARTICULACIÓN CRANEOMANDIBULAR
        </h2>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Apertura bucal</Label>
            <Select 
              value={formData.articulacionCraneomandibular.aperturaBucal} 
              onValueChange={value => handleArticulacionCraneomandibularChange('aperturaBucal', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione apertura bucal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="limitada">Limitada</SelectItem>
                <SelectItem value="excesiva">Excesiva</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Desviación mandibular</Label>
            <Select 
              value={formData.articulacionCraneomandibular.desviacionMandibular} 
              onValueChange={value => handleArticulacionCraneomandibularChange('desviacionMandibular', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione desviación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ausente">Ausente</SelectItem>
                <SelectItem value="derecha">Hacia la derecha</SelectItem>
                <SelectItem value="izquierda">Hacia la izquierda</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Ruidos articulares</Label>
            <Select 
              value={formData.articulacionCraneomandibular.ruidosArticulares} 
              onValueChange={value => handleArticulacionCraneomandibularChange('ruidosArticulares', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione ruidos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ausentes">Ausentes</SelectItem>
                <SelectItem value="clic">Clic</SelectItem>
                <SelectItem value="crepitacion">Crepitación</SelectItem>
                <SelectItem value="pop">Pop</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Dolor a la palpación</Label>
            <Select 
              value={formData.articulacionCraneomandibular.dolorPalpacion} 
              onValueChange={value => handleArticulacionCraneomandibularChange('dolorPalpacion', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione dolor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ausente">Ausente</SelectItem>
                <SelectItem value="leve">Leve</SelectItem>
                <SelectItem value="moderado">Moderado</SelectItem>
                <SelectItem value="severo">Severo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Observaciones adicionales</Label>
          <div className="flex items-start gap-4">
            <Textarea
              value={formData.articulacionCraneomandibular.observaciones}
              onChange={e => handleArticulacionCraneomandibularChange('observaciones', e.target.value)}
              placeholder="Describir cualquier anomalía o hallazgo relevante en la articulación craneomandibular"
              className="min-h-[100px] max-h-[200px] w-full resize-y text-justify"
            />
            <div className="mt-2">
              <VoiceInput 
                onTranscriptionComplete={text => handleArticulacionCraneomandibularChange('observaciones', text)} 
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ArticulacionCraneomandibular;
