import { FileText, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';

interface HistoriaClinicaNavProps {
  collapsed: boolean;
}

const sections = [
  { id: 'info-principal', title: 'Información Principal', scrollTo: 'patient-name-input' },
  { id: 'padecimiento', title: 'Padecimiento Actual', scrollTo: 'padecimiento-actual' },
  { id: 'antecedentes-heredofamiliares', title: 'Ant. HeredoFamiliares', scrollTo: 'antecedentes-heredofamiliares' },
  { id: 'antecedentes-personales-np', title: 'Ant. Personales No Pat.', scrollTo: 'antecedentes-personales-no-patologicos' },
  { id: 'antecedentes-personales-p', title: 'Ant. Personales Pat.', scrollTo: 'antecedentes-personales-patologicos' },
  { id: 'antecedentes-alergicos', title: 'Ant. Alérgicos', scrollTo: 'antecedentes-alergicos' },
  { id: 'antecedentes-quirurgicos', title: 'Ant. Quirúrgicos', scrollTo: 'antecedentes-quirurgicos' },
  { id: 'antecedentes-hemorragicos', title: 'Ant. Hemorrágicos', scrollTo: 'antecedentes-hemorragicos' },
  { id: 'interrogatorio', title: 'Interrogatorio', scrollTo: 'interrogatorio-sistemas' },
  { id: 'exploracion-fisica', title: 'Exploración Física', scrollTo: 'exploracion-fisica' },
  { id: 'examen-cabeza', title: 'Examen de Cabeza', scrollTo: 'examen-cabeza' },
  { id: 'examen-cuello', title: 'Examen de Cuello', scrollTo: 'examen-cuello' },
  { id: 'examen-intrabucal', title: 'Examen Intrabucal', scrollTo: 'examen-intrabucal' },
  { id: 'diagnostico', title: 'Diagnóstico', scrollTo: 'diagnostico' },
  { id: 'pronostico', title: 'Pronóstico', scrollTo: 'pronostico' },
];

export const HistoriaClinicaNav = ({ collapsed }: HistoriaClinicaNavProps) => {
  const [open, setOpen] = useState(false);

  const handleScrollToSection = (scrollTo: string) => {
    const element = document.querySelector(`[data-formulario-section="${scrollTo}"]`);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
      element.classList.add('highlight-section');
      setTimeout(() => element.classList.remove('highlight-section'), 2000);
    }
  };

  if (collapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center p-4 hover:bg-accent transition-colors"
            >
              <FileText className="h-5 w-5" style={{ color: '#8B5CF6', strokeWidth: 2 }} />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Historia Clínica</p>
            <p className="text-xs">Navegación rápida</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left"
        >
          <FileText className="h-5 w-5 flex-shrink-0" style={{ color: '#8B5CF6', strokeWidth: 2 }} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Historia Clínica</p>
            <p className="text-xs text-muted-foreground">Navegación rápida</p>
          </div>
          <ChevronRight 
            className={`h-4 w-4 transition-transform ${open ? 'rotate-90' : ''}`}
          />
        </motion.button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pl-8 pr-2 py-2 space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleScrollToSection(section.scrollTo)}
              className="w-full text-left text-xs py-2 px-3 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            >
              {section.title}
            </button>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
