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
                className="w-full flex items-center justify-center p-3 hover:bg-accent/50 transition-colors rounded-lg"
                onClick={() => setOverlayOpen(true)}
              >
                <BookOpen className="h-[18px] w-[18px]" style={{ color: '#10B981', strokeWidth: 1.5 }} />
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
        className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-accent/50 transition-colors text-left rounded-lg"
        onClick={() => setOverlayOpen(true)}
      >
        <BookOpen className="h-[18px] w-[18px] flex-shrink-0" style={{ color: '#10B981', strokeWidth: 1.5 }} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium">Guía de Uso</p>
          <p className="text-[10px] text-muted-foreground">Tutoriales y ayuda</p>
        </div>
      </motion.button>
      <TutorialesOverlay open={overlayOpen} onClose={() => setOverlayOpen(false)} />
    </>
  );
};
