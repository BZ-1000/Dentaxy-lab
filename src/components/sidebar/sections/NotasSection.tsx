import { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { NotasOverlay } from '../overlays/NotasOverlay';
import { useNotes } from '@/hooks/useNotes';

interface NotasSectionProps {
  collapsed: boolean;
}

export const NotasSection = ({ collapsed }: NotasSectionProps) => {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const { notes } = useNotes();
  const pendingCount = notes.filter(n => !n.completed).length;

  if (collapsed) {
    return (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center p-3 hover:bg-accent/50 transition-colors relative rounded-lg"
                onClick={() => setOverlayOpen(true)}
              >
                <ClipboardList className="h-6 w-6" style={{ color: '#F59E0B', strokeWidth: 2 }} />
                {pendingCount > 0 && (
                  <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {pendingCount}
                  </span>
                )}
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Notas de Actividad</p>
              {pendingCount > 0 && <p className="text-xs">{pendingCount} pendientes</p>}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <NotasOverlay open={overlayOpen} onClose={() => setOverlayOpen(false)} />
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
        <ClipboardList className="h-6 w-6 flex-shrink-0" style={{ color: '#F59E0B', strokeWidth: 2 }} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">Notas</p>
          <p className="text-xs text-muted-foreground">Tareas y pendientes</p>
        </div>
        {pendingCount > 0 && (
          <Badge variant="secondary" className="text-xs">
            {pendingCount}
          </Badge>
        )}
      </motion.button>
      <NotasOverlay open={overlayOpen} onClose={() => setOverlayOpen(false)} />
    </>
  );
};
