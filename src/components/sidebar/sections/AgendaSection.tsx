import { useState } from 'react';
import { Calendar, Badge as BadgeIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AgendaOverlay } from '../overlays/AgendaOverlay';
import { useAppointments } from '@/hooks/useAppointments';

interface AgendaSectionProps {
  collapsed: boolean;
}

export const AgendaSection = ({ collapsed }: AgendaSectionProps) => {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const { getTodayAppointments } = useAppointments();
  const todayCount = getTodayAppointments().length;

  if (collapsed) {
    return (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center p-4 hover:bg-accent transition-colors relative"
                onClick={() => setOverlayOpen(true)}
              >
                <Calendar className="h-5 w-5 text-primary" />
                {todayCount > 0 && (
                  <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {todayCount}
                  </span>
                )}
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Agenda / Citas</p>
              {todayCount > 0 && <p className="text-xs">{todayCount} citas hoy</p>}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <AgendaOverlay open={overlayOpen} onClose={() => setOverlayOpen(false)} />
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
        <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">Agenda / Citas</p>
          <p className="text-xs text-muted-foreground">Gestiona tu calendario</p>
        </div>
        {todayCount > 0 && (
          <Badge variant="default" className="text-xs">
            {todayCount}
          </Badge>
        )}
      </motion.button>
      <AgendaOverlay open={overlayOpen} onClose={() => setOverlayOpen(false)} />
    </>
  );
};
