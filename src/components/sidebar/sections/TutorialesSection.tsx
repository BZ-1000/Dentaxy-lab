import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TutorialesOverlay } from '../overlays/TutorialesOverlay';

interface TutorialesSectionProps {
  collapsed: boolean;
}

export const TutorialesSection = ({ collapsed }: TutorialesSectionProps) => {
  const [overlayOpen, setOverlayOpen] = useState(false);

  if (collapsed) {
    return (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center p-4 hover:bg-accent transition-colors"
                onClick={() => setOverlayOpen(true)}
              >
                <BookOpen className="h-5 w-5 text-primary" />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Guía de Uso</p>
              <p className="text-xs">Tutoriales</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TutorialesOverlay open={overlayOpen} onClose={() => setOverlayOpen(false)} />
      </>
    );
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left"
        onClick={() => setOverlayOpen(true)}
      >
        <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">Guía de Uso</p>
          <p className="text-xs text-muted-foreground">Tutoriales y ayuda</p>
        </div>
      </motion.button>
      <TutorialesOverlay open={overlayOpen} onClose={() => setOverlayOpen(false)} />
    </>
  );
};
