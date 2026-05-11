import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Eraser } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
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
}

const ExamenIntrabucalForm: React.FC<ExamenIntrabucalFormProps> = ({
  formData,
  handleExamenIntrabucalChange,
}) => {
  const [redaccionComun, setRedaccionComun] = useState(false);

  const handleLimpiarFormulario = () => {
    const sections = ['mejillas', 'lengua', 'pisoBoca', 'encias', 'paladar', 'orofaringe', 'regionRetromolar', 'istmoFauces'];
    sections.forEach(section => {
      handleExamenIntrabucalChange(`${section}.sinHallazgos`, false);
    });
    setRedaccionComun(false);
  };

  return (
    <div className="space-y-6">
      <RedaccionComunToggle 
        isActive={redaccionComun}
        onChange={(val) => {
          setRedaccionComun(val);
          // Sincronizar con formData para que la generación del Siguiente lo tome en cuenta
          handleExamenIntrabucalChange('sinHallazgos', val);
        }}
      />

      {!redaccionComun && (
        <Accordion type="multiple" className="w-full space-y-3">
          <AccordionItem value="mejillas" className="border border-gray-100 rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 hover:no-underline bg-white dark:bg-gray-900">
              <span className="font-semibold text-gray-800 dark:text-gray-200">1. Mejillas</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-4">
              <MejillasSection 
                data={formData.examenIntrabucal?.mejillas}
                onChange={handleExamenIntrabucalChange}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="lengua" className="border border-gray-100 rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 hover:no-underline bg-white dark:bg-gray-900">
              <span className="font-semibold text-gray-800 dark:text-gray-200">2. Lengua</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-4">
              <LenguaSection 
                data={formData.examenIntrabucal?.lengua}
                onChange={handleExamenIntrabucalChange}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="pisoBoca" className="border border-gray-100 rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 hover:no-underline bg-white dark:bg-gray-900">
              <span className="font-semibold text-gray-800 dark:text-gray-200">3. Piso de Boca</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-4">
              <PisoBocaSection 
                data={formData.examenIntrabucal?.pisoBoca}
                onChange={handleExamenIntrabucalChange}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="encias" className="border border-gray-100 rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 hover:no-underline bg-white dark:bg-gray-900">
              <span className="font-semibold text-gray-800 dark:text-gray-200">4. Encías</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-4">
              <EnciasSection 
                data={formData.examenIntrabucal?.encias}
                onChange={handleExamenIntrabucalChange}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="paladar" className="border border-gray-100 rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 hover:no-underline bg-white dark:bg-gray-900">
              <span className="font-semibold text-gray-800 dark:text-gray-200">5. Paladar Duro y Blando</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-4">
              <PaladarSection 
                data={formData.examenIntrabucal?.paladar}
                onChange={handleExamenIntrabucalChange}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="orofaringe" className="border border-gray-100 rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 hover:no-underline bg-white dark:bg-gray-900">
              <span className="font-semibold text-gray-800 dark:text-gray-200">6. Orofaringe</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-4">
              <OrofaringeSection 
                data={formData.examenIntrabucal?.orofaringe}
                onChange={handleExamenIntrabucalChange}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="regionRetromolar" className="border border-gray-100 rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 hover:no-underline bg-white dark:bg-gray-900">
              <span className="font-semibold text-gray-800 dark:text-gray-200">7. Región Retromolar</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-4">
              <RegionRetromolarSection 
                data={formData.examenIntrabucal?.regionRetromolar}
                onChange={handleExamenIntrabucalChange}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="istmoFauces" className="border border-gray-100 rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 hover:no-underline bg-white dark:bg-gray-900">
              <span className="font-semibold text-gray-800 dark:text-gray-200">8. Istmo de las Fauces</span>
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
          onClick={handleLimpiarFormulario}
          variant="outline"
          className="w-full"
        >
          <Eraser className="w-4 h-4 mr-2" />
          Limpiar Formulario
        </Button>
      </div>
    </div>
  );
};

export default ExamenIntrabucalForm;
