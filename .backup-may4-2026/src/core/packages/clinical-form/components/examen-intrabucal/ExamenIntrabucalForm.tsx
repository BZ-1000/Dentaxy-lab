import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sparkles, Eraser } from "lucide-react";
import { FormDataState } from '../../../types/historiaClinica';
import RedaccionComunToggle from './RedaccionComunToggle';
import MejillasSection from './MejillasSection';
import LenguaSection from './LenguaSection';
import PisoBocaSection from './PisoBocaSection';
import EnciasSection from './EnciasSection';
import PaladarSection from './PaladarSection';
import OrofaringeSection from './OrofaringeSection';
import RegionRetromolarSection from './RegionRetromolarSection';
import IstmoFaucesSection from './IstmoFaucesSection';

interface ExamenIntrabucalFormProps {
  formData: FormDataState;
  handleExamenIntrabucalChange: (part: string, value: any) => void;
  onGenerate: () => void;
}

const ExamenIntrabucalForm: React.FC<ExamenIntrabucalFormProps> = ({
  formData,
  handleExamenIntrabucalChange,
  onGenerate,
}) => {
  const [redaccionComun, setRedaccionComun] = useState(false);

  const handleLimpiarFormulario = () => {
    const sections = ['mejillas', 'lengua', 'pisoBoca', 'encias', 'paladar', 'orofaringe', 'regionRetromolar', 'istmoFauces'];
    sections.forEach(section => {
      handleExamenIntrabucalChange(`${section}.sinHallazgos`, false);
    });
    setRedaccionComun(false);
  };

  const handleGenerarRedaccion = () => {
    // Guardar preferencia de redacción común a nivel del módulo
    handleExamenIntrabucalChange('sinHallazgos', redaccionComun);
    // Notificar al padre para cambiar a la vista IA y disparar la animación
    onGenerate();
  };

  return (
    <div className="space-y-6">
      <RedaccionComunToggle 
        isActive={redaccionComun}
        onChange={setRedaccionComun}
      />

      {!redaccionComun && (
        <Accordion type="multiple" className="w-full space-y-3">
          <AccordionItem value="mejillas" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 hover:no-underline bg-blue-50/30 dark:bg-blue-950/20">
              <span className="font-semibold">1. Mejillas</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-4">
              <MejillasSection 
                data={formData.examenIntrabucal?.mejillas}
                onChange={handleExamenIntrabucalChange}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="lengua" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 hover:no-underline bg-pink-50/30 dark:bg-pink-950/20">
              <span className="font-semibold">2. Lengua</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-4">
              <LenguaSection 
                data={formData.examenIntrabucal?.lengua}
                onChange={handleExamenIntrabucalChange}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="pisoBoca" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 hover:no-underline bg-purple-50/30 dark:bg-purple-950/20">
              <span className="font-semibold">3. Piso de Boca</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-4">
              <PisoBocaSection 
                data={formData.examenIntrabucal?.pisoBoca}
                onChange={handleExamenIntrabucalChange}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="encias" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 hover:no-underline bg-red-50/30 dark:bg-red-950/20">
              <span className="font-semibold">4. Encías</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-4">
              <EnciasSection 
                data={formData.examenIntrabucal?.encias}
                onChange={handleExamenIntrabucalChange}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="paladar" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 hover:no-underline bg-green-50/30 dark:bg-green-950/20">
              <span className="font-semibold">5. Paladar Duro y Blando</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-4">
              <PaladarSection 
                data={formData.examenIntrabucal?.paladar}
                onChange={handleExamenIntrabucalChange}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="orofaringe" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 hover:no-underline bg-yellow-50/30 dark:bg-yellow-950/20">
              <span className="font-semibold">6. Orofaringe</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-4">
              <OrofaringeSection 
                data={formData.examenIntrabucal?.orofaringe}
                onChange={handleExamenIntrabucalChange}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="regionRetromolar" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 hover:no-underline bg-cyan-50/30 dark:bg-cyan-950/20">
              <span className="font-semibold">7. Región Retromolar</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-4">
              <RegionRetromolarSection 
                data={formData.examenIntrabucal?.regionRetromolar}
                onChange={handleExamenIntrabucalChange}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="istmoFauces" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 hover:no-underline bg-teal-50/30 dark:bg-teal-950/20">
              <span className="font-semibold">8. Istmo de las Fauces</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-4">
              <IstmoFaucesSection 
                data={formData.examenIntrabucal?.istmoFauces}
                onChange={handleExamenIntrabucalChange}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          onClick={handleGenerarRedaccion}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Generar Redacción IA
        </Button>
        <Button
          onClick={handleLimpiarFormulario}
          variant="outline"
          className="flex-1"
        >
          <Eraser className="w-4 h-4 mr-2" />
          Limpiar Formulario
        </Button>
      </div>
    </div>
  );
};

export default ExamenIntrabucalForm;
