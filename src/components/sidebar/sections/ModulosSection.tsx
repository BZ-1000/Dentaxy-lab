import { useState } from 'react';
import { LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ModulosOverlay } from '../overlays/ModulosOverlay';

interface ModulosSectionProps {
  collapsed: boolean;
}

export const ModulosSection = ({ collapsed }: ModulosSectionProps) => {
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
                <LayoutGrid className="h-5 w-5" style={{ color: '#EC4899', strokeWidth: 1.5 }} />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Módulos</p>
              <p className="text-xs">Herramientas extra</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <ModulosOverlay open={overlayOpen} onClose={() => setOverlayOpen(false)} />
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
        <LayoutGrid className="h-5 w-5 flex-shrink-0" style={{ color: '#EC4899', strokeWidth: 1.5 }} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">Módulos</p>
          <p className="text-xs text-muted-foreground">Herramientas extra</p>
        </div>
      </motion.button>
      <ModulosOverlay open={overlayOpen} onClose={() => setOverlayOpen(false)} />
    </>
  );
};
